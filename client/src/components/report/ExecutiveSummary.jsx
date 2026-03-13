import React from "react";
import { motion } from "framer-motion";
import { FaCheckDouble, FaQuoteLeft } from "react-icons/fa";

const ExecutiveSummary = ({ finalReport, itemVariants }) => {
  return (
    <motion.div 
      variants={itemVariants} 
      className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-between h-full relative overflow-hidden group"
    >
      {/* Visual Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full blur-[30px] -ml-12 -mb-12" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
              <FaCheckDouble size={14} />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Executive Summary</h3>
          </div>
          <FaQuoteLeft className="text-slate-100 text-3xl" />
        </div>

        <p className="text-slate-600 text-base leading-relaxed font-medium italic relative pl-4 border-l-2 border-emerald-100 italic">
          {finalReport?.summary || "Analyzing interview performance to generate strategic summary..."}
        </p>
      </div>
      
      <div className="relative z-10 pt-8 space-y-5">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Key Strengths</p>
          <div className="flex flex-wrap gap-2">
            {finalReport?.strengths?.slice(0, 3).map(s => (
              <span key={s} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-emerald-100 shadow-sm shadow-emerald-100/50">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Growth Areas</p>
          <div className="flex flex-wrap gap-2">
            {finalReport?.weaknesses?.slice(0, 2).map(w => (
              <span key={w} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-rose-100 shadow-sm shadow-rose-100/50">
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ExecutiveSummary);
