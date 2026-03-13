import React from "react";
import { motion } from "framer-motion";
import { FaCogs, FaBrain, FaBolt, FaStar, FaMagic } from "react-icons/fa";

const SkillGrid = ({ performance, itemVariants }) => {
  const skills = [
    { label: 'Technical Accuracy', score: performance?.technicalScore || 0, color: 'from-emerald-500 to-teal-500', icon: <FaCogs /> },
    { label: 'Communication Skills', score: performance?.communicationScore || 0, color: 'from-blue-500 to-indigo-500', icon: <FaBrain /> },
    { label: 'Problem Solving', score: performance?.problemSolvingScore || 0, color: 'from-amber-500 to-orange-500', icon: <FaBolt /> },
    { label: 'Confidence Index', score: performance?.confidenceScore || 0, color: 'from-emerald-400 to-emerald-600', icon: <FaStar /> },
  ];

  return (
    <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
      <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
        <FaMagic className="text-emerald-500" /> Skill Proficiency Mapping
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {skills.map((metric) => (
          <div key={metric.label} className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-xs text-slate-400 border border-slate-100">
                  {metric.icon}
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</span>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tighter">{metric.score}%</span>
            </div>
            <div className="h-3 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${metric.score}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={`h-full bg-gradient-to-r ${metric.color} rounded-full relative overflow-hidden shadow-[0_0_10px_rgba(16,185,129,0.2)]`}
              >
                <div className="absolute inset-0 bg-white/20 animate-shimmer" />
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default React.memo(SkillGrid);
