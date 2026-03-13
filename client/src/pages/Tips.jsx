import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import {
  BookOpen, Star, Play, Sparkles, TrendingUp, Shield, Award, Search
} from 'lucide-react';

// Modular Imports
import { CATEGORIES, TIPS, STATS } from '../constants/tipsData';
import TipCard from '../components/tips/TipCard';
import StatChip from '../components/tips/StatChip';

const Tips = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');

  const activeCat = CATEGORIES.find(c => c.id === activeCategory);
  const currentTips = TIPS[activeCategory] || [];
  const filteredTips = searchQuery.trim()
    ? currentTips.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
      )
    : currentTips;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const LEVEL_STYLES = {
    Crucial: { dot: 'bg-rose-500' },
    Advantage: { dot: 'bg-emerald-500' },
    Advanced: { dot: 'bg-slate-500' },
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 50%, #eff6ff 100%)',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        .tips-page * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        .grad-text {
          background: linear-gradient(120deg, #f59e0b, #10b981, #3b82f6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
      `}</style>

      {/* ── Scroll Progress Bar ── */}
      <motion.div 
        style={{ scaleX, position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #f59e0b, #10b981, #3b82f6)', transformOrigin: '0%', zIndex: 120 }}
      />

      {/* ── Ambient Background Blobs ── */}
      {[
        { w: 500, h: 500, t: '-10%', l: '-5%',  bg: 'rgba(251,191,36,0.1)' },
        { w: 400, h: 400, b: '-10%', r: '-5%',  bg: 'rgba(16,185,129,0.1)' },
        { w: 300, h: 300, t: '40%',  r: '10%',  bg: 'rgba(59,130,246,0.06)' },
      ].map(({ w, h, t, l, b, r, bg }, i) => (
        <motion.div key={i}
          style={{ position: 'absolute', width: w, height: h, top: t, left: l, bottom: b, right: r, borderRadius: '60% 40% 70% 30%/50% 60% 40% 50%', background: bg, filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }}
          animate={{ borderRadius: ['60% 40% 70% 30%/50% 60% 40% 50%', '40% 60% 30% 70%/60% 40% 60% 40%', '60% 40% 70% 30%/50% 60% 40% 50%'] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Dot Grid ── */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,.05) 1.2px, transparent 1.2px)', backgroundSize: '32px 32px', pointerEvents: 'none', zIndex: 1 }} />

      <div className="tips-page w-full max-w-6xl mx-auto px-6 lg:px-8 pt-24 pb-16 relative z-10 space-y-10">

        {/* ── Header Section ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white/60 backdrop-blur-xl rounded-full border shadow-sm leading-none transition-colors duration-500 ${activeCat.light.split(' ').filter(c => c.startsWith('border-')).join(' ')}`}>
              <Sparkles size={12} className={`animate-pulse ${activeCat.light.split(' ').filter(c => c.startsWith('text-')).join(' ')}`} />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Intelligence Network</span>
              <div className="w-[1px] h-2.5 bg-slate-200 mx-1" />
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded font-bold text-[8px] border transition-colors duration-500 ${activeCat.light}`}>
                <Shield size={8} /> SECURE
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Land Your <br className="hidden sm:block"/> 
                <span className="grad-text">Dream Job</span> smarter.
              </h1>
              <p className="text-base font-bold text-slate-500 max-w-lg leading-relaxed mt-1 mx-auto lg:mx-0">
                Access tactical interview frameworks and high-performance strategies from our intelligence database.
              </p>
            </div>
          </motion.div>

          {/* Search Box */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-[320px] relative group mx-auto lg:mx-0">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <Search size={18} strokeWidth={3} />
            </div>
            <input
              type="text"
              placeholder="Search briefings..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/80 backdrop-blur-2xl border border-slate-200 rounded-xl py-3 pl-11 pr-5 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
            />
          </motion.div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s, i) => <StatChip key={i} {...s} index={i} />)}
        </div>

        {/* ── Category Console ── */}
        <div className="bg-white/60 backdrop-blur-2xl p-2 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-white/80">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              const Icon = cat.icon;
              const tipCount = TIPS[cat.id]?.length || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                  className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl text-[12px] font-black transition-all duration-300 ${
                    isActive ? `text-white` : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab"
                      className={`absolute inset-0 rounded-xl shadow-md ${cat.tab}`}
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
                    />
                  )}
                  <Icon size={14} strokeWidth={3} className="relative z-10" />
                  <span className="relative z-10 uppercase tracking-widest">{cat.label}</span>
                  <div className={`relative z-10 text-[9px] font-black px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {tipCount}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Feed Header ── */}
        <div className="flex items-center justify-between gap-4 px-2">
          <div className="flex items-center gap-3">
             <div className="relative group">
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }} 
                 transition={{ duration: 3, repeat: Infinity }}
                 className={`absolute inset-[-4px] rounded-xl border-2 pointer-events-none transition-colors duration-500 ${activeCat.glow}`}
               />
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-colors duration-500 ${activeCat.tab.split(' ')[0]}`}>
                  {activeCat && <activeCat.icon size={20} strokeWidth={2.5} />}
               </div>
             </div>
             <div className="space-y-0.5">
               <h2 className="text-xl font-black text-slate-900 leading-none tracking-tight"><span className="grad-text">{activeCat?.label}</span> Intelligence</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 {filteredTips.length} Activity Modules Synced
               </p>
             </div>
          </div>
          
          <div className="hidden md:flex items-center gap-5">
             {Object.entries(LEVEL_STYLES).map(([name, style]) => (
               <div key={name} className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${style.dot} ring-2 ring-white shadow-sm`} />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            {filteredTips.length > 0 ? (
              <motion.div
                key={activeCategory + searchQuery}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredTips.map((tip, i) => (
                  <TipCard key={tip.title} tip={tip} index={i} categoryColor={activeCat.color} />
                ))}
              </motion.div>
            ) : (
              <motion.div className="py-20 text-center space-y-3 bg-white/40 backdrop-blur rounded-2xl border-2 border-dashed border-slate-100">
                <p className="text-xl font-black text-slate-900 tracking-tight">No Matches Found</p>
                <button onClick={() => setSearchQuery('')} className="px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Reset Search</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CTA ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
          <div className="bg-white rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-100 shadow-sm relative transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-md text-emerald-600 border border-emerald-100 font-black text-[9px] uppercase tracking-widest">
                  <Award size={14} strokeWidth={3} /> Deployment Protocol
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Knowledge is <span className="grad-text">potential.</span> <br/>
                  Practice is <span className="underline decoration-emerald-200 underline-offset-4">power.</span>
                </h2>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                  {[
                    { icon: TrendingUp, label: 'Live Analysis' },
                    { icon: Shield, label: 'Zero-Loss' },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600 shadow-sm"><f.icon size={16} strokeWidth={2.5} /></div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full sm:w-auto min-w-[280px]">
                <button onClick={() => window.location.href = '/interview'} className="flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-xl font-black text-base shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all w-full leading-none h-14">
                  <Play size={18} className="fill-white" /> START SIMULATION
                </button>
                <button onClick={() => window.location.href = '/history'} className="px-8 py-4 rounded-xl font-black text-[12px] border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all w-full uppercase tracking-widest h-14 leading-none">Field Logs</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Tips;
