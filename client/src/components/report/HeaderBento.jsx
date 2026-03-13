import React from "react";
import { motion } from "framer-motion";
import { FaBolt } from "react-icons/fa";

const HeaderBento = ({ role, experience, finalReport, itemVariants }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main Identity Card */}
      <motion.div variants={itemVariants} className="lg:col-span-8 bg-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
              <FaBolt className="text-[10px]" /> Interview Intel v2.0
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-900 leading-none">
              {role}
            </h1>
            <p className="text-slate-500 font-bold tracking-wide uppercase text-xs flex items-center gap-3">
              {experience} Experience <span className="w-1.5 h-1.5 rounded-full bg-slate-200" /> Advanced Assessment
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center gap-6 shadow-sm">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-200" />
                <motion.circle 
                  cx="48" cy="48" r="42" stroke="#10b981" strokeWidth="6" fill="transparent" 
                  strokeDasharray={2 * Math.PI * 42} 
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 - (2 * Math.PI * 42 * (finalReport?.overallScore || 0)) / 100 }}
                  transition={{ duration: 2, ease: "circOut" }}
                  style={{ strokeLinecap: "round", filter: "drop-shadow(0 0 4px #10b98150)" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">{finalReport?.overallScore}%</span>
                <span className="text-[8px] font-black text-slate-400 uppercase">Match</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommendation</p>
              <p className={`text-xl font-black ${
                finalReport?.hiringRecommendation === "Strong Hire" ? "text-emerald-600" :
                finalReport?.hiringRecommendation === "Hire" ? "text-blue-600" : "text-rose-600"
              }`}>
                {finalReport?.hiringRecommendation || "No Hire"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hire Probability Card */}
      <motion.div variants={itemVariants} className="lg:col-span-4 bg-emerald-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-emerald-200 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
        <div className="relative z-10 space-y-2">
          <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em]">Success Forecast</p>
          <h3 className="text-5xl font-black tracking-tighter italic">
            {finalReport?.hireProbability || "0%"}
          </h3>
        </div>
        <div className="relative z-10 pt-6">
          <div className="h-2 bg-emerald-800/30 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: finalReport?.hireProbability || "0%" }}
              transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
              className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]" 
            />
          </div>
          <p className="mt-4 text-[11px] font-bold text-emerald-50 flex items-center justify-between">
            <span>Hire Probability</span>
            <span className="opacity-70 italic">AI Confidence: High</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(HeaderBento);
