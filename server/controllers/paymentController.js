import Razorpay from 'razorpay';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Lazy initialization of Razorpay to prevent crash if keys are missing
let razorpay;
const getRazorpayInstance = () => {
    if (razorpay) return razorpay;
    
    console.log("DEBUG: Checking Razorpay Keys...");
    console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID ? `${process.env.RAZORPAY_KEY_ID.substring(0, 8)}...` : "MISSING");
    console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "PRESENT" : "MISSING");

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error("⚠️ Razorpay keys are missing in .env file");
        return null;
    }

    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    return razorpay;
};

/**
 * @desc    Create Razorpay Order
 * @route   POST /api/v1/payments/create-order
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res) => {
    const { amount, planName } = req.body;

    if (!amount || !planName) {
        res.status(400);
        throw new Error('Please provide amount and plan name');
    }

    const instance = getRazorpayInstance();
    if (!instance) {
        console.error("❌ Razorpay instance not created. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
        res.status(500);
        throw new Error('Payment gateway not configured. Check server logs.');
    }

    const options = {
        amount: amount * 100, // amount in the smallest currency unit (paise)
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
            planName,
            userId: req.user._id.toString()
        }
    };

    try {
        const order = await instance.orders.create(options);
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500);
        throw new Error('Could not create order. Please try again.');
    }
});

/**
 * @desc    Handle Razorpay Webhook
 * @route   POST /api/v1/payments/webhook
 * @access  Public (Secret verification)
 */
export const handleWebhook = asyncHandler(async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!secret) {
        console.error("⚠️ RAZORPAY_WEBHOOK_SECRET is not defined");
        return res.status(500).send('Webhook secret not configured');
    }

    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        console.log("✅ Webhook verified");
        const event = req.body.event;
        
        if (event === 'payment.captured' || event === 'order.paid') {
            const payload = req.body.payload.payment.entity;
            const { planName, userId } = payload.notes;
            const amount = payload.amount / 100;

            console.log(`💳 Payment ${event}: ${amount} INR for user ${userId} (${planName})`);

            // Map plan names to credits (matching Pricing.jsx)
            const planCredits = {
                'Explorer': 100,
                'Starter': 350,
                'Pro': 1000,
                'Ultra': 2000
            };

            const creditsToAdd = planCredits[planName] || 0;

            if (creditsToAdd > 0) {
                // Update User
                await User.findByIdAndUpdate(userId, {
                    $inc: { credits: creditsToAdd },
                    $set: { plan: planName }
                });
                console.log(`✨ Successfully added ${creditsToAdd} credits to user ${userId}`);
            }
        }

        res.status(200).json({ success: true });
    } else {
        console.error("❌ Invalid signature for Razorpay webhook");
        res.status(400).send('Invalid signature');
    }
});
