import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Zap, TrendingUp, Trophy, Clock } from 'lucide-react';
import CountUp from 'react-countup';

const COLOR_MAP = {
  emerald: { icon: 'bg-emerald-50 text-emerald-600', glow: 'shadow-emerald-100', ring: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
  slate:   { icon: 'bg-slate-50 text-slate-600',    glow: 'shadow-slate-100',   ring: 'bg-slate-500',   badge: 'bg-slate-100 text-slate-700' },
  amber:   { icon: 'bg-amber-50 text-amber-600',   glow: 'shadow-amber-100',   ring: 'bg-amber-500',   badge: 'bg-amber-100 text-amber-700' },
  teal:    { icon: 'bg-teal-50 text-teal-600',     glow: 'shadow-teal-100',    ring: 'bg-teal-500',    badge: 'bg-teal-100 text-teal-700' },
  indigo:  { icon: 'bg-indigo-50 text-indigo-600', glow: 'shadow-indigo-100', ring: 'bg-indigo-500', badge: 'bg-indigo-100 text-indigo-700' },
};

const StatCard = ({ label, value, numericValue, suffix = '', prefix = '', icon: Icon, color, sub, index }) => {
  const col = COLOR_MAP[color] || COLOR_MAP.emerald;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 22 }}
      whileHover={{ y: -3 }}
      className={`relative overflow-hidden bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl ${col.glow} border border-slate-200/60 cursor-default transition-all duration-300`}
    >
      {/* decorative blob */}
      <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full ${col.ring} opacity-[0.07]`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl ${col.icon} transition-colors duration-300`}>
            <Icon size={20} />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${col.badge} border border-transparent`}>
            {sub}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 px-0.5">{label}</span>
          <div className="flex items-baseline gap-1">
             <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
               {prefix}
               <CountUp end={numericValue} duration={2} decimals={numericValue % 1 !== 0 ? 1 : 0} />
               {suffix}
             </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const InterviewStats = ({ stats, loading }) => {
  if (loading && !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border border-slate-200/60 shadow-sm" />
        ))}
      </div>
    );
  }

  const items = [
    { label: 'Total Sessions',   numericValue: stats?.totalInterviews || 0,  suffix: '',   icon: Target,   color: 'emerald', sub: 'All time' },
    { label: 'Average AI Score', numericValue: stats?.averageScore || 0,      suffix: '%',  icon: Award,    color: 'teal',    sub: 'Across rounds' },
    { label: 'Avg. Confidence',  numericValue: stats?.averageConfidence || 0, suffix: '%',  icon: Zap,      color: 'indigo',  sub: 'Behavioral sync' },
    { label: 'Growth Rate',      numericValue: stats?.improvementRate || 0,  suffix: '%', prefix: '+', icon: TrendingUp, color: 'amber',   sub: 'vs last period' },
    { label: 'Best Score',       numericValue: stats?.bestScore || 0,         suffix: '%',  icon: Trophy,   color: 'emerald', sub: 'Personal best' },
    { label: 'This Week',        numericValue: stats?.thisWeekSessions || 0,  suffix: ' sessions', icon: Target, color: 'slate',   sub: 'Keep the streak!' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <StatCard key={idx} {...item} index={idx} />
      ))}
    </div>
  );
};

export default InterviewStats;
