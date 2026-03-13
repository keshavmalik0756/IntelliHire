import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Trophy, Star, Target, Zap, Award, ShieldCheck } from 'lucide-react';

const ICON_MAP = {
  Star,
  ShieldCheck,
  Zap,
  Trophy,
  Target,
  Award
};

const AchievementCard = ({ achievement, index }) => {
  const { title, description, icon, progress, target, status, reward } = achievement;
  const Icon = ICON_MAP[icon] || Award;
  const isLocked = status === 'locked';
  const percentage = Math.min((progress / target) * 100, 100);

  // 3D Tilt State
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);

  const handleMouseMove = (e) => {
    if (isLocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        rotateX,
        rotateY,
        transformPerspective: 1000
      }}
      transition={{ 
        duration: isLocked ? 0.5 : 0.1, 
        delay: index * 0.1,
        rotateX: { type: 'spring', stiffness: 300, damping: 20 },
        rotateY: { type: 'spring', stiffness: 300, damping: 20 }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group p-4 rounded-[1.5rem] border transition-all duration-300 ${
        isLocked 
          ? 'bg-slate-50/50 border-slate-200 grayscale opacity-70 cursor-not-allowed' 
          : 'bg-white border-emerald-100 shadow-[0_5px_15px_-10px_rgba(16,185,129,0.1)] hover:shadow-[0_15px_35px_-15px_rgba(16,185,129,0.2)] hover:border-emerald-300/50 cursor-pointer overflow-hidden'
      }`}
    >
      {/* Shine Effect */}
      {!isLocked && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.03), transparent)',
            width: '200%'
          }}
        />
      )}

      <div className="relative z-10 flex flex-col gap-3">
        {/* Icon & Status */}
        <div className="flex items-center justify-between">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 ${
            isLocked ? 'bg-slate-200 text-slate-400' : 'bg-emerald-100 text-emerald-600'
          }`}>
            <Icon size={18} />
          </div>
          {isLocked ? (
            <div className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 flex items-center gap-1">
              <Lock size={10} className="text-slate-400" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Locked</span>
            </div>
          ) : (
            <div className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center gap-1">
              <Trophy size={10} className="text-emerald-600" />
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">Unlocked</span>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div>
          <h3 className={`font-bold text-sm mb-0.5 ${isLocked ? 'text-slate-500' : 'text-slate-900 group-hover:text-emerald-700 transition-colors'}`}>
            {title}
          </h3>
          <p className="text-[11px] text-slate-500 leading-tight min-h-[28px]">
            {description}
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-tight">
            <span className={isLocked ? 'text-slate-400' : 'text-emerald-600'}>
              {progress} / {target}
            </span>
            <span className="text-slate-400">{Math.round(percentage)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              className={`h-full rounded-full ${
                isLocked ? 'bg-slate-300' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}
            />
          </div>
        </div>

        {/* Reward Badge */}
        {!isLocked && (
          <div className="mt-1 flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
            <Award size={12} className="text-emerald-500" />
            <span className="text-[10px] font-semibold text-slate-600 group-hover:text-emerald-700">
              Reward: <span className="text-emerald-600">{reward}</span>
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AchievementCard;
