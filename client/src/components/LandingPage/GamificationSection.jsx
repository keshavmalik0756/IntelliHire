import React from 'react';
import SectionTitle from './SectionTitle';
import FeatureCard from './FeatureCard';
import { gamificationFeatures } from './data';
import { Rocket, Sparkles } from 'lucide-react';

const GamificationSection = () => {
  return (
    <section id="gamification" className="py-16 md:py-24 lg:py-32 relative overflow-hidden bg-slate-50/50">
      {/* Background decoration - Emerald/Teal "Success" Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 -left-20 w-[600px] h-[600px] bg-emerald-200/40 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-teal-100/40 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
             <Rocket className="w-4 h-4 text-emerald-500 animate-bounce" />
             <span className="text-sm font-semibold text-emerald-700">Level Up Your Career</span>
          </div>
          
          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Make Preparation <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
              Fun & Rewarding
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Stay motivated with our gamified learning system. Earn badges, track streaks, and climb the leaderboard as you master new skills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {gamificationFeatures.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} index={idx} delay={0.4} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamificationSection;
