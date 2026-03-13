import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import BehaviorMetrics from "./BehaviorMetrics";

function EvaluationCard({ evaluation, metrics }) {
  const score = evaluation?.score ?? 0;

  const scoreMeta = useMemo(() => {
    if (score >= 7) {
      return {
        color: "text-emerald-600",
        ring: "#10b981",
        gradient: "from-emerald-500 to-teal-500",
        message: "Excellent response"
      };
    }

    if (score >= 4) {
      return {
        color: "text-amber-500",
        ring: "#f59e0b",
        gradient: "from-amber-400 to-orange-500",
        message: "Good answer, but can improve"
      };
    }

    return {
      color: "text-rose-500",
      ring: "#ef4444",
      gradient: "from-rose-400 to-red-500",
      message: "Needs improvement"
    };
  }, [score]);

  const circumference = 2 * Math.PI * 28;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.45 }}
      className="
        bg-white/70 backdrop-blur-xl
        rounded-3xl
        border border-gray-100
        shadow-[0_20px_50px_rgba(0,0,0,0.06)]
        overflow-hidden
        transition-all
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-8 py-7 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40 border-b border-gray-100">

        {/* SCORE SECTION */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Answer Score
          </p>

          <div className="flex items-end gap-2 mt-1">

            <motion.span
              key={score}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className={`text-5xl font-extrabold ${scoreMeta.color}`}
            >
              {score}
            </motion.span>

            <span className="text-xl font-semibold text-gray-400 mb-1">
              /10
            </span>

          </div>

          <p className="text-sm text-gray-500 mt-1 font-medium">
            {scoreMeta.message}
          </p>

        </div>

        {/* CIRCULAR SCORE */}
        <div className="relative w-20 h-20">

          <svg className="w-20 h-20 -rotate-90">

            <circle
              cx="36"
              cy="36"
              r="28"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
            />

            <motion.circle
              cx="36"
              cy="36"
              r="28"
              fill="none"
              stroke={scoreMeta.ring}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{
                strokeDashoffset: circumference * (1 - score / 10)
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />

          </svg>

          <div className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${scoreMeta.color}`}>
            {Math.round(score * 10)}%
          </div>

        </div>

      </div>

      {/* PROGRESS BAR */}
      <div className="px-8 pt-4">

        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score * 10}%` }}
            transition={{ duration: 1 }}
            className={`h-full rounded-full bg-gradient-to-r ${scoreMeta.gradient}`}
          />

        </div>

      </div>

      {/* BODY */}
      <div className="p-8 space-y-6">

        {/* AI FEEDBACK */}
        {evaluation?.feedback && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="
              bg-gradient-to-br
              from-white
              to-emerald-50/40
              border border-emerald-100
              rounded-2xl
              p-5
              shadow-sm
            "
          >

            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
              AI Feedback
            </p>

            <p className="text-sm text-gray-700 leading-relaxed">
              {evaluation.feedback}
            </p>

          </motion.div>
        )}

        {/* BEHAVIOR METRICS */}
        <BehaviorMetrics metrics={metrics} />

      </div>

    </motion.div>
  );
}

export default memo(EvaluationCard);