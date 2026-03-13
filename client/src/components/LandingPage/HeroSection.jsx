import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowRight, Sparkles, CheckCircle2, PlayCircle, Mic, Brain, TrendingUp, ShieldCheck } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const HeroSection = () => {
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    // Mock Data for the Radar Chart (Skill Growth) - Optimized for Light Theme
    const skillData = [
        { subject: 'Communication', A: 65, B: 95, fullMark: 100 },
        { subject: 'Technical', A: 60, B: 90, fullMark: 100 },
        { subject: 'Confidence', A: 50, B: 90, fullMark: 100 },
        { subject: 'Structure', A: 70, B: 95, fullMark: 100 },
        { subject: 'Body Language', A: 55, B: 85, fullMark: 100 },
        { subject: 'Knowledge', A: 65, B: 88, fullMark: 100 },
    ];

    const trustedCompanies = [
        "TechCorp", "InnovateLabs", "FutureSystems", "GlobalSolutions", "NextGen"
    ];

    return (
        <section id="hero" className="relative min-h-[110vh] flex items-center pt-20 overflow-hidden bg-transparent">
            {/* Ambient Background Mesh - Emerald/Teal/Slate Theme */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-teal-100 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '7s' }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-slate-100 rounded-full blur-3xl opacity-40" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    
                    {/* Left Column: Expanded Text Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-2xl"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-emerald-100 rounded-full px-4 py-1.5 mb-8 shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
                            <span className="text-sm font-semibold text-slate-600">New: Logic & Reasoning Patterns</span>
                        </div>
                        
                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6 tracking-tight">
                            Master Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-800">
                                Interview Skills
                            </span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                            The comprehensive AI coach that analyzes your <span className="font-semibold text-emerald-600">Speech</span>, <span className="font-semibold text-teal-600">Body Language</span>, and <span className="font-semibold text-slate-700">Technical Knowledge</span> in real-time.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(token ? '/interview' : '/auth')}
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 focus:outline-none ring-offset-2 focus:ring-emerald-500"
                            >
                                <Sparkles className="w-5 h-5 mr-2" />
                                Start Practicing
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/demo')}
                                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-700 transition-all duration-200 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 focus:outline-none ring-offset-2 focus:ring-slate-400 shadow-sm"
                            >
                                <PlayCircle className="w-5 h-5 mr-2 text-emerald-600" />
                                Watch Demo
                            </motion.button>
                        </div>

                        {/* "How It Works" Micro-Steps */}
                        <div className="grid grid-cols-3 gap-4 mb-12 border-t border-slate-200/60 pt-8">
                            <div className="flex flex-col items-start gap-2">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <Mic size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Record</h4>
                                    <p className="text-xs text-slate-500">Answer realistic questions</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-2">
                                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                    <Brain size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Analyze</h4>
                                    <p className="text-xs text-slate-500">Get AI-driven insights</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-start gap-2">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                    <TrendingUp size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Improve</h4>
                                    <p className="text-xs text-slate-500">Track rapid growth</p>
                                </div>
                            </div>
                        </div>

                        {/* Trust Strip */}
                        <div className="flex flex-col gap-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Trusted by candidates from</p>
                            <div className="flex flex-wrap gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                {trustedCompanies.map((company, i) => (
                                    <span key={i} className="text-sm font-bold text-slate-400">{company}</span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Visual (3D White Glass Card with Chart) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, rotateY: -20 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        style={{ perspective: '1000px' }}
                        className="relative block mt-12 w-full max-w-lg mx-auto lg:max-w-none lg:mt-0"
                    >
                        {/* Main Glass Card - Emerald Theme */}
                        <div className="relative z-10 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-200/50 transform transition-transform hover:scale-[1.01] duration-500 group">
                            {/* Card Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-800">Skill Analysis</h3>
                                    <p className="text-xs sm:text-sm text-slate-500">Latest Session Performance</p>
                                </div>
                                <div className="self-start sm:self-auto flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs sm:text-sm font-bold">
                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                                    +32% Growth
                                </div>
                            </div>

                            {/* Chart Container */}
                            <div className="h-[280px] sm:h-[400px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={skillData}>
                                        <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Before"
                                            dataKey="A"
                                            stroke="#cbd5e1"
                                            strokeWidth={2}
                                            fill="#cbd5e1"
                                            fillOpacity={0.3}
                                        />
                                        <Radar
                                            name="After"
                                            dataKey="B"
                                            stroke="#10b981" // emerald-500
                                            strokeWidth={3}
                                            fill="#10b981"
                                            fillOpacity={0.2}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                                
                                {/* Floating Badge 1 (Emerald) */}
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-4 -right-2 sm:-top-6 sm:-right-6 bg-white/90 backdrop-blur-md border border-slate-100 p-3 sm:p-4 rounded-2xl shadow-xl shadow-emerald-200/50 z-20"
                                >
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium whitespace-nowrap">Overall Score</p>
                                            <p className="text-sm sm:text-lg font-bold text-slate-800">92/100</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating Badge 2 (Teal) */}
                                <motion.div 
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -bottom-4 -left-2 sm:-bottom-8 sm:-left-8 bg-white/90 backdrop-blur-md border border-slate-100 p-3 sm:p-4 rounded-2xl shadow-xl shadow-teal-200/50 max-w-[170px] sm:max-w-[200px] z-20"
                                >
                                    <div className="flex items-start gap-2 sm:gap-3">
                                         <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 mt-1 shrink-0">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                        <div>
                                             <p className="text-[10px] sm:text-xs text-slate-400 mb-0.5 sm:mb-1">AI Feedback</p>
                                            <p className="text-[11px] sm:text-sm font-semibold text-slate-700 leading-tight">"Excellent structure in your technical response!"</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Background Decoration Blob */}
                        <div className="absolute -inset-8 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-20 blur-3xl -z-10 rounded-[3rem]" />
                    </motion.div>
                </div>
            </div>
            
            {/* Scroll Indicator - Darker for Light Theme */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-slate-400 flex flex-col items-center gap-2"
            >
                <span className="text-xs uppercase tracking-widest font-semibold">Scroll</span>
                <div className="w-px h-8 bg-gradient-to-b from-slate-400 to-transparent" />
            </motion.div>
        </section>
    );
};

export default HeroSection;