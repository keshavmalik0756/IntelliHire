import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Clock, ChevronRight } from "lucide-react";

const LEVEL_COLORS = {
  Crucial:   { pill: "bg-rose-50 text-rose-600 border-rose-100" },
  Advantage: { pill: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  Advanced:  { pill: "bg-slate-50 text-slate-600 border-slate-200" }
};

const COLOR_THEMES = {
  amber:   { light: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-100",   active: "bg-amber-600",   glow: "border-amber-300",   shimmer: "rgba(245,158,11,0.12)",  indicator: "from-amber-400 to-amber-600",   shadow: "shadow-amber-100/50" },
  indigo:  { light: "bg-indigo-50",  text: "text-indigo-600",  border: "border-indigo-100",  active: "bg-indigo-600",  glow: "border-indigo-300",  shimmer: "rgba(79,70,229,0.12)",   indicator: "from-indigo-400 to-indigo-600", shadow: "shadow-indigo-100/50" },
  violet:  { light: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-100",  active: "bg-violet-600",  glow: "border-violet-300",  shimmer: "rgba(139,92,246,0.12)",  indicator: "from-violet-400 to-violet-600", shadow: "shadow-violet-100/50" },
  rose:    { light: "bg-rose-50",    text: "text-rose-600",    border: "border-rose-100",    active: "bg-rose-600",    glow: "border-rose-300",    shimmer: "rgba(225,29,72,0.12)",   indicator: "from-rose-400 to-rose-600",     shadow: "shadow-rose-100/50" },
  cyan:    { light: "bg-cyan-50",    text: "text-cyan-600",    border: "border-cyan-100",    active: "bg-cyan-600",    glow: "border-cyan-300",    shimmer: "rgba(6,182,212,0.12)",   indicator: "from-cyan-400 to-cyan-600",     shadow: "shadow-cyan-100/50" },
  emerald: { light: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", active: "bg-emerald-600", glow: "border-emerald-300", shimmer: "rgba(16,185,129,0.12)", indicator: "from-emerald-400 to-emerald-600", shadow: "shadow-emerald-100/50" },
};

const TipCard = ({ tip, index, categoryColor = "emerald" }) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  const lv = LEVEL_COLORS[tip.level] || LEVEL_COLORS.Advantage;
  const theme = COLOR_THEMES[categoryColor] || COLOR_THEMES.emerald;
  const Icon = tip.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => setExpanded(!expanded)}
      className={`group relative bg-white rounded-[2.5rem] border border-slate-200/60 
      transition-all duration-300 cursor-pointer overflow-hidden
      ${hovered ? `shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] ${theme.shadow}` : "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]"}`}
    >
      {/* 3D Depth Inner Border */}
      <div className="absolute inset-0 rounded-[2.5rem] border-[1.5px] border-white/80 pointer-events-none z-10" />

      {/* Premium Shimmer */}
      <AnimatePresence>
        {hovered && (
          <motion.div 
            initial={{ x: "-110%", opacity: 0 }} 
            animate={{ x: "110%", opacity: 0.3 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(90deg, transparent, ${theme.shimmer}, transparent)` }} 
          />
        )}
      </AnimatePresence>

      <div className="p-8 pb-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }} 
              transition={{ duration: 4, repeat: Infinity }}
              className={`absolute inset-[-6px] rounded-2xl border-2 pointer-events-none transition-colors duration-500 ${theme.glow}`}
            />
            <div className={`p-4 rounded-2xl transition-all duration-500 shadow-lg relative z-10 ${hovered ? `${theme.active} text-white shadow-${categoryColor}-200` : `${theme.light} ${theme.text} shadow-slate-100`}`}>
              <Icon size={20} strokeWidth={2.5} />
            </div>
          </div>

          <span
            className={`text-[10px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-xl border ${lv.pill} leading-none transition-all duration-300 shadow-sm`}
          >
            {tip.level}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-black text-slate-900 text-xl leading-tight mb-2.5 transition-colors uppercase tracking-tight ${hovered ? theme.text : ""}`}>
          {tip.title}
        </h3>

        {/* Description */}
        <p className="text-[14px] text-slate-500 leading-relaxed line-clamp-2 mb-6 font-medium">
          {tip.description}
        </p>

        {/* ROI Metrics */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>Operational ROI</span>
            <span className={`text-sm ${theme.text}`}>{tip.impact}%</span>
          </div>

          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div
              className={`h-full bg-gradient-to-r ${theme.indicator}`}
              initial={{ width: 0 }}
              animate={{ width: `${tip.impact}%` }}
              transition={{ delay: 0.2 + index * 0.05, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tip.tags.map((tag, i) => (
            <span
              key={i}
              className={`text-[9px] font-black bg-slate-50 text-slate-400 px-3.5 py-1.5 rounded-xl border border-slate-100 uppercase tracking-widest transition-all duration-300 ${hovered ? `${theme.border} ${theme.text} bg-white` : ""}`}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Expand Section */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-6 border-t border-slate-100">
                <div className={`flex gap-4 rounded-2xl p-5 border relative group/insight transition-all shadow-sm ${theme.light.replace('bg-', 'bg-opacity-40 bg-')} ${theme.border.replace('border-', 'border-opacity-40 border-')}`}>
                   <div className="p-2.5 bg-white rounded-xl shadow-md border h-fit transition-colors duration-300">
                    <Lightbulb size={20} strokeWidth={2.5} className={theme.text} />
                  </div>
                  <div className="space-y-1">
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.text} opacity-80`}>Tactical Briefing</p>
                    <p className="text-[14px] text-slate-800 font-bold leading-relaxed italic">
                      "{tip.proTip}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-slate-100/60 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-500 transition-colors">
            <Clock size={14} strokeWidth={2.5} /> {tip.readTime}
          </div>

          <div className={`flex items-center gap-2 transition-all px-4 py-2 rounded-xl border-2 border-transparent ${theme.text} ${hovered ? `${theme.light} ${theme.border}` : ""}`}>
            <span>{expanded ? "Lock Brief" : "Access Intel"}</span>
            <ChevronRight
              size={14}
              strokeWidth={3}
              className={`transition-transform duration-300 ${
                expanded ? "rotate-90" : "group-hover:translate-x-1"
              }`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TipCard;