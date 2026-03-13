import React from "react";
import { motion } from "framer-motion";
import { FaChartPie, FaRobot, FaLevelUpAlt } from "react-icons/fa";

const MetricsGrid = ({ advancedMetrics, finalReport, itemVariants }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Consistency Card */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-slate-200 group hover:border-emerald-200 hover:shadow-lg transition-all shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <FaChartPie />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consistency Index</p>
            <p className="text-lg font-black text-slate-900">{advancedMetrics?.consistencyIndex?.toFixed(1) || "0.0"}%</p>
          </div>
        </div>
        <div className="h-1 bg-slate-100 rounded-full">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${advancedMetrics?.consistencyIndex || 0}%` }}
            className="h-full bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.3)]" 
          />
        </div>
      </motion.div>

      {/* Archetype Card */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-slate-200 group hover:border-teal-200 hover:shadow-lg transition-all shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
            <FaRobot />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tech Archetype</p>
            <p className="text-lg font-black text-slate-900">{advancedMetrics?.archetype || "Evaluating..."}</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[1,2,3,4,5].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? 'bg-teal-500' : 'bg-slate-100'}`} />)}
        </div>
      </motion.div>

      {/* Precision Score */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-slate-200 group hover:border-emerald-200 hover:shadow-lg transition-all shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <FaTargetSimple className="text-sm" /> 
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precision Score</p>
            <p className="text-lg font-black text-slate-900">{advancedMetrics?.precisionScore?.toFixed(0) || "0"}%</p>
          </div>
        </div>
        <div className="h-1 bg-slate-100 rounded-full">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${advancedMetrics?.precisionScore || 0}%` }}
            className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
          />
        </div>
      </motion.div>

      {/* Assessment Level */}
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-3xl border border-slate-200 group hover:border-indigo-200 hover:shadow-lg transition-all shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <FaLevelUpAlt />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assessed Level</p>
            <p className="text-lg font-black text-slate-900">{finalReport?.candidateLevel || "Entry"}</p>
          </div>
        </div>
        <p className="text-[9px] text-slate-400 font-bold uppercase italic">Based on complex logic mapping</p>
      </motion.div>
    </div>
  );
};

const FaTargetSimple = ({ className }) => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

export default React.memo(MetricsGrid);
