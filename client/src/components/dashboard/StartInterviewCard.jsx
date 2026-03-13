import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Code, ChevronRight, Play } from 'lucide-react';

const CATEGORY_CONFIG = {
  HR:          { gradient: 'from-slate-500 to-slate-600',    light: 'bg-slate-50 text-slate-600',    border: 'border-slate-100',    hover: 'hover:shadow-slate-200',    ring: 'bg-slate-500',    btn: 'bg-slate-600 shadow-slate-200' },
  Technical:   { gradient: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100',  hover: 'hover:shadow-emerald-200',  ring: 'bg-emerald-500',  btn: 'bg-emerald-600 shadow-emerald-200' },
};

const getIcon = (id) => {
  if (id === 'Technical') return <Code size={24} />;
  return <User size={24} />;
};

const StartInterviewCard = ({ category, onStart, delay = 0 }) => {
  const cfg = CATEGORY_CONFIG[category.id] || CATEGORY_CONFIG.Technical;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 240, damping: 22 }}
      whileHover={{ y: -4 }}
      onClick={() => onStart(category.id)}
      className={`group relative bg-white border ${cfg.border} rounded-3xl p-6 shadow-sm hover:shadow-xl ${cfg.hover} cursor-pointer transition-all duration-300 flex flex-col h-full overflow-hidden`}
    >
      {/* Accent top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cfg.gradient} opacity-70 group-hover:opacity-100 transition-opacity`} />

      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-2xl ${cfg.light} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
          {getIcon(category.id)}
        </div>
        <div className="p-2 rounded-xl bg-slate-50 text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
          <Play size={14} fill="currentColor" />
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
          {category.title}
        </h3>
        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">
          {category.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
          Launch Session
        </span>
        <div className={`w-8 h-8 rounded-xl ${cfg.btn} flex items-center justify-center text-white shadow-lg transition-all group-hover:translate-x-1`}>
          <ChevronRight size={18} />
        </div>
      </div>

      {/* Background glow on hover */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${cfg.ring} opacity-0 group-hover:opacity-[0.03] transition-opacity blur-2xl`} />
    </motion.div>
  );
};

export default StartInterviewCard;
