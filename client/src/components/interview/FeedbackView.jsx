import React from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaArrowRight } from "react-icons/fa";
import EvaluationCard from "./EvaluationCard";
import StatusBar from "./StatusBar";

function FeedbackView({ evaluation, metrics, currentIndex, questions, handleNext, timeLeft }) {
  return (
    <motion.div
      key="feedback-view"
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      className="p-6 lg:p-8 xl:p-12 mx-auto w-full space-y-8"
    >
      {/* Header */}
<div className="flex flex-col items-center text-center space-y-4">

  {/* ICON BADGE */}
  <motion.div
    initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
    animate={{ scale: 1, opacity: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 18 }}
    className="
      relative
      w-18 h-18
      flex items-center justify-center
      rounded-2xl
      bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500
      text-white text-2xl
      shadow-lg shadow-emerald-300/40
    "
  >

    {/* glow layer */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 blur-lg opacity-40" />

    <FaChartLine className="relative z-10" />

  </motion.div>


  {/* TEXT SECTION */}
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="space-y-1"
  >

    <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
      Response Evaluated
    </h3>

    <p className="text-sm text-gray-500 max-w-[260px] leading-relaxed">
      Our AI interviewer has analyzed your answer and generated detailed insights.
    </p>

  </motion.div>

</div>

      {/* Evaluation Card */}
      {evaluation && <EvaluationCard evaluation={evaluation} metrics={metrics} />}

      {/* Next / Finish button */}
      <div className="relative pt-4">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full scale-110 opacity-50 -z-10" />
        
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            delay: 0.3 
          }}
          whileHover={{ 
            scale: 1.01, 
            translateY: -2,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className={`
            relative w-full max-w-sm mx-auto overflow-hidden rounded-xl py-3 px-6
            flex items-center justify-center space-x-3
            font-bold text-xs tracking-[0.1em] uppercase
            transition-all duration-300
            shadow-[0_10px_30px_rgba(16,185,129,0.2)]
            hover:shadow-[0_15px_40px_rgba(16,185,129,0.35)]
            group
            ${currentIndex < questions.length - 1 
              ? "bg-slate-900 border border-slate-800"
              : "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 border border-emerald-400/30"
            }
          `}
        >
          {/* PREMIUM SHIMMER EFFECT */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 3, 
              ease: "linear",
              repeatDelay: 2
            }}
            className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
          />

          <div className="relative z-10 flex items-center space-x-2 text-white">
            <span className="drop-shadow-sm">
              {currentIndex < questions.length - 1
                ? `Continue Interview`
                : "Generate Report"}
            </span>
            
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <FaArrowRight className="text-[8px] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Question Counter (Mini Badge) */}
          {currentIndex < questions.length - 1 && (
            <div className="absolute top-0 right-0 h-full flex items-center pr-4 pointer-events-none opacity-10 group-hover:opacity-25 transition-opacity">
              <span className="text-2xl font-black italic text-white leading-none">
                {currentIndex + 2}
              </span>
            </div>
          )}
        </motion.button>

        {/* Question progress text */}
        {currentIndex < questions.length - 1 && (
          <p className="mt-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Step <span className="text-emerald-500">{currentIndex + 2}</span> of {questions.length} • Adaptive Difficulty Active
          </p>
        )}
      </div>

    </motion.div>
  );
}

export default React.memo(FeedbackView);
