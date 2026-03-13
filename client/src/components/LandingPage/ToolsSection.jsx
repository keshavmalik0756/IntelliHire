import React from 'react';
import SectionTitle from './SectionTitle';
import FeatureCard from './FeatureCard';
import { studyTools } from './data';

const ToolsSection = () => {
  return (
    <section id="tools" className="py-16 md:py-24 lg:py-32 relative overflow-hidden bg-white/50">
      {/* Ambient Background - Emerald/Teal Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-emerald-100/40 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-teal-100/40 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '5s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
             <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse"></span>
             <span className="text-sm font-semibold text-emerald-900">Essential Toolkit</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
             Comprehensive tools for <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
               maximum preparation
             </span>
          </h2>
          
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Access a complete suite of practice utilities designed to simulate real interview conditions and build your confidence.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {studyTools.map((tool, idx) => (
            <FeatureCard key={idx} {...tool} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
