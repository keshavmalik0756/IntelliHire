import React, { useMemo } from "react";
import { motion } from "framer-motion";

// Modular Components
import Confetti from "./report/Confetti";
import HeaderBento from "./report/HeaderBento";
import MetricsGrid from "./report/MetricsGrid";
import SkillGrid from "./report/SkillGrid";
import ExecutiveSummary from "./report/ExecutiveSummary";
import ResponseMatrix from "./report/ResponseMatrix";
import FooterActions from "./report/FooterActions";

const Step3Report = ({ report }) => {
  const { finalReport, performance, questions, role, experience } = report;

  const isHighScore = (finalReport?.overallScore || 0) >= 80;

  // ── ADVANCED METRICS ENGINE ────────────────────────────────────────────────
  const advancedMetrics = useMemo(() => {
    if (!questions || questions.length === 0) return null;

    const scores = questions.map(q => q.evaluation?.score || 0);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // 1. Consistency Index (Lower variance = Higher consistency)
    const variance = scores.reduce((a, b) => a + Math.pow(b - avgScore, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    const consistencyIndex = Math.max(0, Math.min(100, 100 - (stdDev * 10)));

    // 2. Precision Score (Keyword match proxy)
    const precisionScore = Math.min(100, (avgScore * 1.1) + (isHighScore ? 5 : 0));

    // 3. Technical Archetype
    const typeScores = questions.reduce((acc, q) => {
      const type = q.type || 'technical';
      acc[type] = (acc[type] || 0) + (q.evaluation?.score || 0);
      return acc;
    }, {});

    let archetype = "Full-Stack Specialist";
    const sortedTypes = Object.entries(typeScores).sort((a,b) => b[1] - a[1]);
    let dominantType = sortedTypes.length > 0 ? sortedTypes[0][0] : 'technical';

    if (dominantType === 'system-design') archetype = "Strategic Architect";
    else if (dominantType === 'debugging') archetype = "Precision Debugger";
    else if (dominantType === 'behavioral') archetype = "Culture Champion";
    else if (dominantType === 'conceptual') archetype = "Theoretical Scholar";
    else if (avgScore > 9) archetype = "Senior Visionary";

    return { consistencyIndex, precisionScore, archetype, avgScore };
  }, [questions, isHighScore]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative overflow-hidden font-sans selection:bg-emerald-500/20 print:bg-white">
      {isHighScore && <Confetti />}
      
      {/* CRYSTAL AMBIANCE */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8 relative z-10"
      >
        <HeaderBento 
          role={role} 
          experience={experience} 
          finalReport={finalReport} 
          itemVariants={itemVariants} 
        />

        <MetricsGrid 
          advancedMetrics={advancedMetrics} 
          finalReport={finalReport} 
          itemVariants={itemVariants} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkillGrid 
            performance={performance} 
            itemVariants={itemVariants} 
          />
          <ExecutiveSummary 
            finalReport={finalReport} 
            itemVariants={itemVariants} 
          />
        </div>

        <ResponseMatrix 
          questions={questions} 
          itemVariants={itemVariants} 
        />

        <FooterActions 
          itemVariants={itemVariants} 
        />
      </motion.div>
    </div>
  );
};

export default React.memo(Step3Report);
