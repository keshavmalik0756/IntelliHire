import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Zap, Award, Sparkles, ShieldCheck, Flame, ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AchievementSystem from '../components/dashboard/AchievementSystem';
import api from '../utils/api';

const AnimatedCounter = ({ value, duration = 2 }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    let totalMiliseconds = duration * 1000;
    let incrementTime = (totalMiliseconds / end);

    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const Achievements = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
      level: 1,
      xp: 0,
      streak: 0,
      unlockedCount: 0,
      totalCount: 4
  });

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const response = await api.get('/users/achievements');
            if (response.data.success) {
                const { achievements, level, xp, streak } = response.data.data;
                setStats({
                    level,
                    xp,
                    streak,
                    unlockedCount: achievements.filter(a => a.status === 'unlocked').length,
                    totalCount: achievements.length
                });
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f3f3] pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Back Button & Breadcrumbs */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-wider">Back to Dashboard</span>
        </motion.button>

        {/* Hero Section / User Progress Profile */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-[2rem] p-6 sm:p-8 border border-emerald-100 shadow-lg shadow-emerald-500/5 overflow-hidden mb-8"
        >
          {/* Background Blobs */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl opacity-30 -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-50 rounded-full blur-3xl opacity-30 -ml-16 -mb-16" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            {/* Level Hexagon */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500 rotate-45 rounded-xl opacity-10 animate-pulse" />
              <div className="absolute inset-1 bg-emerald-500 rotate-45 rounded-lg opacity-20" />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Level</span>
                <span className="text-3xl font-black text-slate-900 leading-none">
                    <AnimatedCounter value={stats.level} />
                </span>
              </div>
            </div>

            {/* Progress Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tight">Your Achievement Gallery</h1>
              <p className="text-slate-500 text-sm max-w-2xl mb-6 font-medium">
                Unlock exclusive rewards as you master your skills. Every milestone brings you closer to your dream job.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-3.5 rounded-[1.5rem] bg-slate-50 border border-slate-100 shadow-inner">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 text-center">Total XP</p>
                  <p className="text-lg font-black text-slate-800 text-center">
                    <AnimatedCounter value={stats.xp} />
                  </p>
                </div>
                <div className="p-3.5 rounded-[1.5rem] bg-slate-50 border border-slate-100 shadow-inner">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 text-center">Unlocked</p>
                  <p className="text-lg font-black text-slate-800 text-center">
                    {stats.unlockedCount} / {stats.totalCount}
                  </p>
                </div>
                <div className="p-3.5 rounded-[1.5rem] bg-white border border-emerald-100 shadow-md shadow-emerald-500/5">
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5 text-center">Rankings</p>
                  <p className="text-lg font-black text-emerald-600 text-center">Top 5%</p>
                </div>
                <div className="p-3.5 rounded-[1.5rem] bg-orange-50 border border-orange-100 shadow-inner">
                  <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mb-0.5 text-center">Streaks</p>
                  <p className="text-lg font-black text-orange-500 text-center">🔥 {stats.streak}</p>
                </div>
              </div>
            </div>

            {/* Right Side Visual Badge */}
            <div className="hidden lg:block w-32 h-32 relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-dashed border-emerald-200 rounded-full"
                />
                <div className="absolute inset-3 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Trophy className="text-white" size={32} />
                </div>
                <motion.div 
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute -top-1 -right-1 bg-white p-2 rounded-xl shadow-md border border-slate-100"
                >
                    <Sparkles className="text-emerald-500" size={16} />
                </motion.div>
            </div>
          </div>
        </motion.div>


        {/* Achievement Grid Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] p-6 sm:p-8 border border-white/60 shadow-sm overflow-hidden">
            <AchievementSystem />
        </div>

        {/* Global Leaderboard Call / Stats */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[1.8rem] p-6 text-white shadow-lg shadow-emerald-900/10">
                <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <TrendingUp size={20} />
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-[8px] font-bold uppercase tracking-widest border border-emerald-400/30">Live Update</span>
                </div>
                <h3 className="text-lg font-black mb-1">Performance Milestone</h3>
                <p className="text-emerald-100 text-xs mb-4 max-w-xs">You're just <AnimatedCounter value={250} /> XP away from reaching Level {stats.level + 1}.</p>
                <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] relative overflow-hidden"
                    >
                        <motion.div 
                            animate={{ x: ['-200%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                        />
                    </motion.div>
                </div>
                <div className="flex justify-between items-center mt-2 text-[8px] font-bold uppercase tracking-widest">
                    <span>Level {stats.level}</span>
                    <span>Level {stats.level + 1}</span>
                </div>
            </div>

            <div className="bg-white rounded-[1.8rem] p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-black text-slate-900 mb-1">Daily Challenge</h3>
                    <p className="text-slate-500 text-xs mb-4">Complete a Technical Interview today to earn a random Rare Badge!</p>
                </div>
                <button 
                  onClick={() => navigate('/interview')}
                  className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-200"
                >
                    Accept Challenge
                </button>
            </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Achievements;
