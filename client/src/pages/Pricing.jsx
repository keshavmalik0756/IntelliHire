import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaCrown, FaRocket, FaBolt, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Sparkles, Zap, ShieldCheck, Heart, Crown, CheckCircle2 } from 'lucide-react';
import { updatePlan } from '../store/slices/authSlice';

const Pricing = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector((state) => state.auth);
    const [isYearly, setIsYearly] = useState(false);

    // Sync profile to get the latest plan status
    useEffect(() => {
        const fetchLatestProfile = async () => {
            if (!token) return;
            try {
                const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const res = await fetch(`${API}/api/v1/users/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success && data.user.plan) {
                    dispatch(updatePlan(data.user.plan));
                }
            } catch (err) {
                console.error("Failed to sync profile:", err);
            }
        };
        fetchLatestProfile();
    }, [token, dispatch]);

    const handlePayment = async (plan) => {
        if (!user || !token) {
            navigate('/login');
            return;
        }

        const currentPrice = isYearly && plan.price > 0 ? Math.floor(plan.price * 0.8) : plan.price;

        if (currentPrice === 0) {
            // Handle free plan if needed (e.g., just redirect or show success)
            navigate('/dashboard');
            return;
        }

        try {
            const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

            if (!RAZORPAY_KEY) {
                throw new Error("Razorpay Key ID is not defined in client .env");
            }
            
            // 1. Create Order on Backend
            const orderRes = await fetch(`${API}/api/v1/payments/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: currentPrice,
                    planName: plan.name
                })
            });

            if (!orderRes.ok) {
                const errorData = await orderRes.json().catch(() => ({ message: "Server error occurred" }));
                throw new Error(errorData.message || "Order creation failed");
            }

            const orderData = await orderRes.json();

            // 2. Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "IntelliHire AI",
                description: `Upgrade to ${plan.name} Plan`,
                image: "https://cdn-icons-png.flaticon.com/512/1055/1055644.png", // Use a public placeholder to avoid CORS on localhost
                order_id: orderData.order.id,
                handler: function (response) {
                    // This is triggered on SUCCESS (Frontend)
                    // The actual update happens via Webhook, but we can show success here
                    alert("Payment Successful! Your credits will be updated shortly.");
                    navigate('/dashboard');
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone || ""
                },
                notes: {
                    address: "IntelliHire Corporate Office"
                },
                theme: {
                    color: "#059669" // Emerald 600
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Something went wrong with the payment process.");
        }
    };

    const plans = useMemo(() => [
        {
            id: "free",
            name: "Explorer",
            icon: <FaRocket className="text-blue-400" />,
            price: 0,
            credits: 100,
            badge: "Free",
            recommended: false,
            description: "Try the platform with basic AI interviews.",
            ctaText: "Start for Free",
            features: [
                "100 AI Interview Credits",
                "Basic AI Question Generation",
                "Limited Voice Interview Access",
                "Basic Performance Reports",
                "Last 5 Interview History",
                "Community Support"
            ],
            color: "blue"
        },
        {
            id: "starter",
            name: "Starter",
            icon: <FaBolt className="text-emerald-400" />,
            price: 199,
            credits: 350,
            badge: "Most Popular",
            recommended: true,
            description: "Perfect for consistent interview practice.",
            ctaText: "Choose Starter",
            features: [
                "350 AI Interview Credits",
                "Detailed AI Feedback",
                "Voice Interview Mode",
                "Performance Analytics Dashboard",
                "Extended Interview History",
                "Skill Gap Detection",
                "Progress Tracking"
            ],
            color: "emerald"
        },
        {
            id: "pro",
            name: "Pro",
            icon: <FaStar className="text-amber-400" />,
            price: 599,
            credits: 1000,
            badge: "Best Value",
            recommended: false,
            description: "For candidates targeting top tech companies.",
            ctaText: "Upgrade to Pro",
            features: [
                "1000 AI Interview Credits",
                "Advanced AI Feedback Engine",
                "Voice + Behavioral Interviews",
                "System Design Interview Mode",
                "Advanced Performance Analytics",
                "Unlimited Interview History",
                "Skill Heatmaps & Insights",
                "Priority AI Processing"
            ],
            color: "amber"
        },
        {
            id: "ultra",
            name: "Ultra",
            icon: <FaCrown className="text-purple-400" />,
            price: 999,
            credits: 2000,
            badge: "Elite",
            recommended: false,
            description: "Unlimited interview mastery with powerful AI career analytics.",
            ctaText: "Go Ultra",
            features: [
                "2000 AI Interview Credits",
                "Elite AI Interview Engine",
                "Real-Time AI Interview Simulation",
                "Full Career Analytics Dashboard",
                "Unlimited Interview History",
                "FAANG Interview Question Bank",
                "AI Resume Optimization",
                "Priority Queue Processing",
                "Premium Support"
            ],
            color: "purple"
        }
    ], []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 py-16 px-6 relative overflow-hidden font-sans selection:bg-emerald-200">
            
            {/* Animated Mesh Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] bg-emerald-100/40 rounded-full blur-[120px]" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        x: [0, -40, 0],
                        y: [0, 60, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] -right-[15%] w-[800px] h-[800px] bg-teal-100/30 rounded-full blur-[140px]" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1],
                        x: [0, 30, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] bg-indigo-50/40 rounded-full blur-[110px]" 
                />
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col md:flex-row items-center gap-6 mb-16"
                >
                    <motion.button
                        whileHover={{ scale: 1.1, x: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate("/dashboard")}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all text-slate-600 self-start md:self-center"
                    >
                        <FaArrowLeft />
                    </motion.button>

                    <div className="text-center md:text-left flex-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/50 text-emerald-600 text-sm font-semibold mb-4"
                        >
                            <Sparkles className="w-4 h-4" />
                            <span>Transparent AI Pricing</span>
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Interview</span> Experience
                        </h1>
                        <p className="text-slate-500 text-xl max-w-2xl">
                            Choose the perfect plan to master your interview skills with industry-leading AI and behavioral analysis.
                        </p>
                    </div>
                </motion.div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-16">
                    <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1">
                        <button 
                            onClick={() => setIsYearly(false)}
                            className={`px-8 py-2.5 rounded-xl font-bold transition-all relative z-10 ${!isYearly ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Credits Pack
                        </button>
                        <button 
                            onClick={() => setIsYearly(true)}
                            className={`relative px-8 py-2.5 rounded-xl font-bold transition-all z-10 ${isYearly ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Monthly Sub
                            <span className="absolute -top-3 -right-3 px-2 py-0.5 bg-emerald-500 text-white text-[10px] rounded-full animate-bounce shadow-sm">
                                -20%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {plans.map((plan) => {
                        const currentPrice = isYearly && plan.price > 0 ? Math.floor(plan.price * 0.8) : plan.price;
                        const pricePerCredit = plan.price > 0 ? (currentPrice / plan.credits).toFixed(2) : "0.00";
                        const approxInterviews = Math.floor(plan.credits / 30); // Assuming 30 credits per interview
                        const isCurrentPlan = user?.plan === plan.name;

                        return (
                            <motion.div
                                key={plan.id}
                                variants={itemVariants}
                                whileHover={{ y: -12, transition: { duration: 0.2 } }}
                                className={`group relative flex flex-col h-full bg-white/70 backdrop-blur-xl rounded-[2.5rem] border transition-all duration-300 overflow-hidden
                                    ${plan.recommended ? 'border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/20' : 'border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200'}
                                    ${isCurrentPlan ? 'ring-2 ring-emerald-500 ring-offset-4 ring-offset-[#f8fafc]' : ''}`}
                            >
                                {/* Current Plan Badge */}
                                {isCurrentPlan && (
                                    <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase py-1.5 text-center tracking-[0.2em] shadow-sm z-20">
                                        Active Plan
                                    </div>
                                )}
                                {/* Gradient Border on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                {/* Recommended Glow Layer */}
                                {plan.recommended && (
                                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none" />
                                )}

                                {/* Plan Header */}
                                <div className={`p-8 pb-0 relative ${isCurrentPlan ? 'pt-10' : ''}`}>
                                    {plan.badge && (
                                        <div className={`absolute top-8 right-8 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                            ${plan.recommended ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            {plan.badge}
                                        </div>
                                    )}
                                    
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner
                                        ${plan.color === 'emerald' ? 'bg-emerald-50 border border-emerald-100/50' : 
                                          plan.color === 'blue' ? 'bg-blue-50 border border-blue-100/50' : 
                                          plan.color === 'amber' ? 'bg-amber-50 border border-amber-100/50' : 
                                          'bg-purple-50 border border-purple-100/50'}`}>
                                        {plan.icon}
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6 min-h-[2.5rem]">{plan.description}</p>

                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm font-medium text-slate-400">₹</span>
                                        <span className="text-5xl font-black text-slate-900 tracking-tight">
                                            {currentPrice}
                                        </span>
                                        <span className="text-slate-400 font-semibold ml-1">/{isYearly ? 'mo' : 'pack'}</span>
                                    </div>

                                    {plan.price > 0 && (
                                        <div className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-wider">
                                            <Sparkles className="w-3 h-3 text-amber-400" />
                                            ₹{pricePerCredit} / Credit
                                        </div>
                                    )}
                                    
                                    <div className={`mt-6 inline-flex flex-col gap-1 items-center px-4 py-3 rounded-2xl text-sm font-bold w-full transition-all bg-emerald-50/50 border border-emerald-100/50 text-emerald-700`}>
                                       <div className="flex items-center gap-2">
                                           <Zap className="w-4 h-4 fill-emerald-500" />
                                           {plan.credits} AI Credits
                                       </div>
                                       {plan.credits > 0 && (
                                           <div className="text-[10px] opacity-60 font-medium">
                                               ≈ {approxInterviews} Full Interviews
                                           </div>
                                       )}
                                    </div>
                                </div>

                                {/* Features Section */}
                                <div className="p-8 flex-grow">
                                    <div className="space-y-4 mb-8">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3 group/item">
                                                <div className="mt-1 p-0.5 rounded-full bg-emerald-100 text-emerald-600 transition-transform group-hover/item:scale-110">
                                                    <FaCheckCircle className="text-[10px]" />
                                                </div>
                                                <span className="text-slate-600 text-[15px] leading-tight transition-colors group-hover/item:text-slate-900">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Area */}
                                <div className="p-8 pt-0 mt-auto">
                                    <motion.button
                                        whileHover={!isCurrentPlan ? { scale: 1.02 } : {}}
                                        whileTap={!isCurrentPlan ? { scale: 0.98 } : {}}
                                        onClick={() => !isCurrentPlan && handlePayment(plan)}
                                        disabled={isCurrentPlan}
                                        className={`w-full py-4 rounded-[1.25rem] font-bold text-base transition-all flex items-center justify-center gap-2
                                            ${isCurrentPlan 
                                                ? 'bg-slate-100 text-slate-400 cursor-default shadow-none border border-slate-200' 
                                                : plan.recommended 
                                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700' 
                                                    : 'bg-slate-900 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200'}`}
                                    >
                                        {isCurrentPlan ? (
                                            <>
                                                <CheckCircle2 className="w-5 h-5" />
                                                Current Plan
                                            </>
                                        ) : (
                                            <>
                                                {plan.ctaText}
                                                <FaArrowLeft className="rotate-180 text-xs opacity-50 transition-transform group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Footer Trust Bar */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-24 pt-12 border-t border-slate-200/60"
                >
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale transition-all hover:grayscale-0 hover:opacity-100">
                        <div className="flex items-center gap-2 font-black text-2xl text-slate-800 tracking-tighter cursor-default">
                             <ShieldCheck className="w-6 h-6" /> SECURE PAYMENTS
                        </div>
                        <div className="flex items-center gap-2 font-black text-2xl text-slate-800 tracking-tighter cursor-default">
                             <Heart className="w-6 h-6" /> TRUSTED BY 10K+
                        </div>
                        <div className="flex items-center gap-2 font-black text-2xl text-slate-800 tracking-tighter cursor-default">
                             <Sparkles className="w-6 h-6" /> AI-POWERED
                        </div>
                    </div>
                    <p className="text-center text-slate-400 mt-12 text-sm">
                        Prices are inclusive of all taxes. Cancel anytime. 100% Satisfaction Guaranteed.
                    </p>
                </motion.div>
            </div>

            {/* Floating Decorative Elements */}
            <motion.div 
                animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] text-emerald-100/20"
            >
                <Sparkles size={120} />
            </motion.div>
            <motion.div 
                animate={{ 
                    y: [0, 20, 0],
                    rotate: [0, -5, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] text-teal-100/20"
            >
                <Zap size={140} />
            </motion.div>
        </div>
    );
};

export default Pricing;

