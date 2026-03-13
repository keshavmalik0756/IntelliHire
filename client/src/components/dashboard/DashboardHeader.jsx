import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';

const DashboardHeader = ({ user, onRefresh }) => {
  const firstName = (user?.name || user?.username || 'User').split(' ')[0];
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const greeting = getGreeting();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-slate-200/60"
    >
      {/* Left — branding + greeting */}
      <div className="flex items-start gap-3">
        <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-100 shrink-0">
          <BrainCircuit size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {greeting}, <span className="text-emerald-600">{firstName}!</span>
            </h1>
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Launch a tailored AI session or review your past performance below.
          </p>
        </div>
      </div>

      {/* Right — badge strip + refresh */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100 shadow-sm">
          <Sparkles size={11} className="text-emerald-600" /> Interview Mastery
        </span>
        <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-200/60 shadow-sm">
          <TrendingUp size={11} className="text-slate-600" /> Level Up
        </span>
        {onRefresh && (
          <motion.button
            whileTap={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            onClick={onRefresh}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all border border-slate-200/60 ml-2"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
