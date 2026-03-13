import React from "react";
import { motion } from "framer-motion";

const COLOR_MAP = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", active: "bg-emerald-600", border: "hover:border-emerald-200", indicator: "bg-emerald-500", glow: "group-hover:from-emerald-500/[0.05]", shadow: "shadow-emerald-100/50" },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   active: "bg-amber-600",   border: "hover:border-amber-200",   indicator: "bg-amber-500",   glow: "group-hover:from-amber-500/[0.05]", shadow: "shadow-amber-100/50" },
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600",  active: "bg-indigo-600",  border: "hover:border-indigo-200",  indicator: "bg-indigo-500",  glow: "group-hover:from-indigo-500/[0.05]", shadow: "shadow-indigo-100/50" },
  violet:  { bg: "bg-violet-50",  text: "text-violet-600",  active: "bg-violet-600",  border: "hover:border-violet-200",  indicator: "bg-violet-500",  glow: "group-hover:from-violet-500/[0.05]", shadow: "shadow-violet-100/50" },
  rose:    { bg: "bg-rose-50",    text: "text-rose-600",    active: "bg-rose-600",    border: "hover:border-rose-200",    indicator: "bg-rose-500",    glow: "group-hover:from-rose-500/[0.05]", shadow: "shadow-rose-100/50" },
  cyan:    { bg: "bg-cyan-50",    text: "text-cyan-600",    active: "bg-cyan-600",    border: "hover:border-cyan-200",    indicator: "bg-cyan-500",    glow: "group-hover:from-cyan-500/[0.05]", shadow: "shadow-cyan-100/50" },
};

const StatChip = ({ label, value, suffix, icon: Icon, index, color = "emerald" }) => {
  const theme = COLOR_MAP[color] || COLOR_MAP.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`flex items-center gap-4 bg-white rounded-2xl px-5 py-4 
      shadow-[0_8px_20px_-10px_rgba(0,0,0,0.08)] border border-slate-100 
      ${theme.border} hover:bg-slate-50/5 hover:${theme.shadow} transition-all group relative overflow-hidden`}
    >
      {/* 3D Inner Detail */}
      <div className="absolute inset-0 rounded-2xl border border-white/60 pointer-events-none z-10" />

      {/* Subtle background glow on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent ${theme.glow} transition-all duration-500`} />

      <div
        className={`relative z-10 p-3 rounded-xl ${theme.bg} ${theme.text} 
        group-hover:${theme.active} group-hover:text-white 
        transition-all duration-500 shadow-md`}
      >
        <Icon size={16} strokeWidth={2.5} />
      </div>

      <div className="relative z-10 leading-tight">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">
          {label}
        </p>

        <p className="text-2xl font-black text-slate-900 tabular-nums tracking-tight">
          {value}
          <span className={`${theme.text} ml-0.5`}>{suffix}</span>
        </p>
      </div>

      {/* Subtle indicator line */}
      <div className={`absolute bottom-0 left-0 w-0 h-[3px] ${theme.indicator} group-hover:w-full transition-all duration-500 ease-out`} />
    </motion.div>
  );
};

export default StatChip;