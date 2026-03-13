import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Step3Report from "../components/Step3Report";
import { interviewService } from "../services/interviewService";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, ArrowLeft, BrainCircuit, Sparkles, BarChart3, Database } from "lucide-react";

// ─── STAGE MESSAGES FOR NARRATIVE LOADING ────────────────────────────────────
const LOADING_STAGES = [
    { id: 1, message: "Retrieving encrypted session data...", icon: Database, color: "text-blue-500" },
    { id: 2, message: "Analyzing verbal patterns and semantics...", icon: BrainCircuit, color: "text-emerald-500" },
    { id: 3, message: "Generating neural performance insights...", icon: Sparkles, color: "text-indigo-500" },
    { id: 4, message: "Compiling final assessment report...", icon: BarChart3, color: "text-teal-500" },
];

const InterviewReport = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loadingStage, setLoadingStage] = useState(0);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                // Artificial delay sequence for storytelling (Premium UX)
                const interval = setInterval(() => {
                    setLoadingStage(prev => (prev < LOADING_STAGES.length - 1 ? prev + 1 : prev));
                }, 1200);

                const data = await interviewService.getInterviewDetails(sessionId);
                
                // Ensure at least 3 seconds of "Advanced Analysis" feeling
                setTimeout(() => {
                    if (data.success && data.data) {
                        setReport(data.data);
                        setError(null);
                    } else {
                        throw new Error(data.message || "Assessment data not found");
                    }
                    clearInterval(interval);
                    setLoading(false);
                }, 3500);

            } catch (err) {
                console.error("Error fetching report:", err);
                setError(err.response?.data?.message || err.message || "Failed to reconstruct assessment data");
                setLoading(false);
            }
        };

        if (sessionId) fetchReport();
        else {
            setError("Authentication token or Session ID missing");
            setLoading(false);
        }
    }, [sessionId]);

    // ─── SHARED UI COMPONENTS ──────────────────────────────────────────────────
    
    const AuraBackground = () => (
        <div className="fixed inset-0 pointer-events-none overflow-hidden bg-slate-50">
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    rotate: [0, 10, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-400/10 rounded-full blur-[120px]" 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1],
                    x: [0, -40, 0],
                    y: [0, -60, 0],
                    rotate: [0, -15, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[70%] bg-indigo-400/10 rounded-full blur-[150px]" 
            />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]" />
        </div>
    );

    return (
        <div className="relative min-h-screen font-sans selection:bg-emerald-500/20">
            <AuraBackground />

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
                    >
                        <div className="relative w-32 h-32 mb-12">
                            {/* Outer Pulsing Ring */}
                            <motion.div 
                                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/10"
                            />
                            {/* Inner Spinning Core */}
                            <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center shadow-lg border border-slate-100 overflow-hidden">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-1 border-2 border-dashed border-emerald-400/40 rounded-full"
                                />
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={loadingStage}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        className={`${LOADING_STAGES[loadingStage].color}`}
                                    >
                                        {React.createElement(LOADING_STAGES[loadingStage].icon, { size: 40, strokeWidth: 1.5 })}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="text-center max-w-sm">
                            <AnimatePresence mode="wait">
                                <motion.p 
                                    key={loadingStage}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-slate-800 font-extrabold text-lg tracking-tight mb-2"
                                >
                                    {LOADING_STAGES[loadingStage].message}
                                </motion.p>
                            </AnimatePresence>
                            <div className="flex gap-1.5 justify-center">
                                {LOADING_STAGES.map((_, i) => (
                                    <motion.div 
                                        key={i}
                                        animate={{ 
                                            scale: i === loadingStage ? 1.2 : 1,
                                            backgroundColor: i <= loadingStage ? "#10b981" : "#e2e8f0" 
                                        }}
                                        className="w-8 h-1 rounded-full transition-colors"
                                    />
                                ))}
                            </div>
                            <p className="mt-8 text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">
                                IntelliHire Quantum Engine
                            </p>
                        </div>
                    </motion.div>
                ) : error || !report ? (
                    <motion.div 
                        key="error"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
                    >
                        {/* Premium Glass Card for Error */}
                        <div className="glass-morphism bg-white/60 backdrop-blur-3xl p-10 sm:p-12 rounded-[3.5rem] border border-white/50 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.1)] max-w-lg text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                            
                            <div className="relative w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-rose-500 shadow-xl shadow-rose-200/50">
                                <AlertCircle size={48} strokeWidth={1.5} />
                            </div>
                            
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">
                                Assessment Recovery Failed
                            </h2>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10">
                                {error || "We encountered a structural anomaly while retrieving your report. Please verify your connection or return to the terminal."}
                            </p>
                            
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/dashboard')}
                                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group"
                            >
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                Return to Dashboard
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="report"
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        <Step3Report report={report} />
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .glass-morphism {
                    background: rgba(255, 255, 255, 0.4);
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                }
            `}</style>
        </div>
    );
};

export default InterviewReport;