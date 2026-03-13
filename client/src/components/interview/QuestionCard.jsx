import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaBrain, FaVolumeUp, FaStop } from "react-icons/fa";
import Badge from "./ui/Badge";
import { TYPE_COLORS, DIFF_COLORS } from "./constants";

function QuestionCard({ question, index, isSpeaking, speak, cancel }) {
  const handleToggleSpeech = useCallback(() => {
    if (isSpeaking) {
      cancel();
    } else {
      const qText = question?.question || question?.text || (typeof question === 'string' ? question : "");
      if (qText) speak(qText);
    }
  }, [isSpeaking, question, speak, cancel]);

  return (
    <motion.div
      key={`q-${index}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, type: "spring", stiffness: 300 }}
      className="relative bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden"
    >
      {/* Left accent */}
      <div className="absolute left-0 inset-y-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500" />
      {/* Watermark */}
      <FaRobot className="absolute -right-4 -bottom-4 text-8xl text-emerald-50 pointer-events-none" />

      <div className="p-6 pl-8">
        {/* Q number + badges */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-500 font-black text-xl leading-none">Q{index + 1}</span>
            <span className="text-gray-200 font-light text-lg leading-none">—</span>
            
            {/* Speech Control Button */}
            <button
              onClick={handleToggleSpeech}
              title={isSpeaking ? "Stop Speaking" : "Play Question"}
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                isSpeaking 
                  ? "bg-red-50 text-red-500 hover:bg-red-100" 
                  : "bg-emerald-50 text-emerald-500 hover:bg-emerald-100"
              }`}
            >
              {isSpeaking ? (
                <FaStop className="text-xs animate-pulse" />
              ) : (
                <FaVolumeUp className="text-sm" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {question?.difficulty && (
              <Badge
                label={question.difficulty}
                colorClass={DIFF_COLORS[question.difficulty] ?? "bg-gray-50 text-gray-500 border-gray-100"}
              />
            )}
            {question?.type && (
              <Badge
                label={question.type}
                colorClass={TYPE_COLORS[question.type] ?? "bg-gray-50 text-gray-500 border-gray-100"}
              />
            )}
          </div>
        </div>

        {/* Question text */}
        <h2 className="text-[1.05rem] font-semibold text-gray-800 leading-relaxed">
          {question?.question}
        </h2>

        {/* STAR tip */}
        <div className="flex items-center space-x-1.5 mt-4 pt-3 border-t border-gray-50">
          <FaBrain className="text-[10px] text-emerald-400 shrink-0" />
          <p className="text-[11px] text-gray-400 italic">
            Tip: Use the{" "}
            <span className="font-bold not-italic text-emerald-500">STAR</span> method —
            Situation, Task, Action, Result.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(QuestionCard);
