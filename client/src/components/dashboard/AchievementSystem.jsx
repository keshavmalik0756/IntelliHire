import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Zap, Award, Sparkles, ShieldCheck, Flame, Loader2 } from 'lucide-react';
import AchievementCard from './AchievementCard';
import api from '../../utils/api';

const AchievementSystem = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ level: 1, streak: 0 });

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await api.get('/users/achievements');
        if (response.data.success) {
          setAchievements(response.data.data.achievements);
          setStats({
              level: response.data.data.level,
              streak: response.data.data.streak
          });
        }
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      } finally {
        setTimeout(() => setLoading(false), 500); // Small delay for smooth transition
      }
    };

    fetchAchievements();
  }, []);

  const categories = [
    { title: "Core Progress", ids: ['FIRST_INTERVIEW', 'INTERVIEW_MASTER'] },
    { title: "Performance & Skills", ids: ['COMMUNICATION_PRO', 'FAST_LEARNER'] }
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((group) => (
          <div key={group} className="space-y-4">
            <div className="h-4 w-24 bg-slate-100 rounded-full animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 animate-pulse relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="w-full space-y-12">
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
      
      {categories.map((cat, catIdx) => {
        const catAchievements = achievements.filter(a => cat.ids.includes(a.id));
        if (catAchievements.length === 0) return null;

        return (
          <div key={cat.title} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-slate-100" />
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                {cat.title}
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-slate-100" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {catAchievements.map((achievement, index) => (
                <AchievementCard 
                  key={achievement._id} 
                  achievement={achievement} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        );
      })}

      {achievements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                  <Trophy className="text-slate-200" size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No Achievements Yet</h3>
              <p className="text-slate-500 text-[11px] max-w-xs">Complete your first interview to start unlocking rewards!</p>
          </div>
      )}

      {/* Footer Insight */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-8 p-3.5 rounded-[1.5rem] bg-slate-900 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Sparkles className="text-emerald-400" size={20} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-0.5">Community Goal</p>
            <p className="text-xs text-slate-300 font-medium">Candidates have answered <span className="text-white font-bold">12,450+</span> questions today!</p>
          </div>
        </div>
        <button className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg text-[10px] font-extrabold uppercase tracking-widest transition-all">
          Join Challenge
        </button>
      </motion.div>
    </section>
  );
};

export default AchievementSystem;
