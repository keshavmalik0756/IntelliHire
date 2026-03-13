import express from 'express';
import { createOrder, handleWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/razorpay-webhook', handleWebhook);

export default router;
