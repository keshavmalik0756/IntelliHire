import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Brain, Users, Globe, Zap, Target, Award, ArrowUpRight, TrendingUp } from 'lucide-react';

const PlatformOverviewSection = () => {
  // Mock Data for Area Chart (Progress Trend) - Green for Growth
  const progressData = [
    { month: 'Jan', score: 45 },
    { month: 'Feb', score: 52 },
    { month: 'Mar', score: 48 },
    { month: 'Apr', score: 61 },
    { month: 'May', score: 75 },
    { month: 'Jun', score: 85 },
  ];

  // Mock Data for Topic Distribution (Pill Chart) - Multicolored
  const topicData = [
    { name: 'DS/Algo', value: 80, color: '#0ea5e9' }, // sky-500 (Blue)
    { name: 'System Design', value: 65, color: '#8b5cf6' }, // violet-500
    { name: 'Behavioral', value: 90, color: '#10b981' }, // emerald-500 (Green)
  ];

  return (
    <section id="overview" className="py-16 md:py-20 lg:py-24 bg-transparent relative overflow-hidden">
      {/* Background Elements - Emerald Theme */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-emerald-100 rounded-full px-4 py-1.5 mb-4 shadow-sm">
             <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Your Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Interview Dashboard</span>
          </h2>
          <p className="text-slate-500 text-lg">
            Everything you need to go from preparation to getting hired, visualized in one powerful, intuitive interface.
          </p>
        </div>

        {/* Bento Grid Layout - Violet Theme */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* Card 1: Progress Trend (Large, Span 8 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-6 lg:col-span-8 row-span-2 bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xl shadow-emerald-100/40 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Performance Trajectory
                </h3>
                <p className="text-slate-500 text-sm mt-1">Average user score improvement over 6 months</p>
              </div>
              <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1">
                <ArrowUpRight size={14} />
                +85% Growth
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e2e8f0', borderRadius: '12px', color: '#1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#64748b' }}
                  />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#10b981" // emerald-500
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Card 2: Stats (Small, Span 4 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3 lg:col-span-4 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-6 md:p-8 text-white flex flex-col justify-center items-center text-center shadow-xl shadow-emerald-200 hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="bg-white/20 p-3 rounded-2xl mb-4 backdrop-blur-sm">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-5xl font-bold mb-2 tracking-tight">10k+</h3>
            <p className="text-emerald-50 font-medium text-lg">Active High-Performers</p>
          </motion.div>

          {/* Card 3: Topic Coverage (Medium, Span 4 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-3 lg:col-span-4 bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-100/40 hover:border-emerald-200 transition-colors"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-500" />
              Topic Coverage
            </h3>
            <div className="space-y-5">
              {topicData.map((item) => (
                <div key={item.name} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{item.name}</span>
                    <span className="text-slate-500">{item.value}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full" 
                      style={{ backgroundColor: item.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 4: AI Feature (Span 4 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-3 lg:col-span-4 bg-emerald-50/50 backdrop-blur-sm border border-emerald-100/50 rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-emerald-200 transition-colors shadow-lg shadow-emerald-100/20"
          >
            <div className="absolute -right-8 -top-8 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors duration-500 rotate-12">
               <Brain size={160} />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 text-emerald-600 shadow-sm">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">AI-Driven Insights</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Our advanced AI determines your improved potential instantly.
                  </p>
              </div>
              <button className="mt-6 text-emerald-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Learn more <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Card 5: Gamification (Span 4 cols) */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.4 }}
             className="md:col-span-3 lg:col-span-4 bg-emerald-50/50 backdrop-blur-sm border border-emerald-100/50 rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-emerald-200 transition-colors shadow-lg shadow-emerald-100/20"
          >
             <div className="absolute -right-6 -bottom-6 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors duration-500">
               <Award size={140} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 text-emerald-500 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Gamified Learning</h3>
              <p className="text-slate-500 text-sm mb-4">
                Earn badges, track streaks, and compete on the leaderboard.
              </p>
              <div className="flex gap-2">
                 <div className="h-8 px-3 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xs font-bold shadow-sm" title="Gold Badge">
                    Gold
                 </div>
                 <div className="h-8 px-3 rounded-full bg-slate-200/80 border border-slate-300 flex items-center justify-center text-slate-600 text-xs font-bold shadow-sm" title="Silver Badge">
                    Silver
                 </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PlatformOverviewSection;