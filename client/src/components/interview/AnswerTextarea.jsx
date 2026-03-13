import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser } from "react-icons/fa";
import Waveform from "./ui/Waveform";

function AnswerTextarea({
  answer,
  setAnswer,
  isRecording,
  textareaRef,
  growTextarea,
  wordCount
}) {

  const progress = Math.min((wordCount / 80) * 100, 100);

  const wordColor =
    wordCount >= 50
      ? "text-emerald-600"
      : wordCount >= 20
      ? "text-amber-500"
      : "text-gray-400";

  return (
    <div className="space-y-3">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        {/* Left label */}
        <div className="flex items-center space-x-2 text-gray-500">

          <div className="w-6 h-6 bg-emerald-50 rounded-lg flex items-center justify-center">
            <FaUser className="text-[10px] text-emerald-500" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">
            Your Response
          </span>

        </div>

        {/* Right status */}
        {isRecording ? (
          <div className="flex items-center space-x-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full shadow-sm">

            <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" />

            <Waveform />

            <span className="text-[11px] font-bold text-red-500">
              Recording
            </span>

          </div>
        ) : (
          <div className="flex items-center space-x-2 text-[11px] text-gray-400">

            <span>
              <span className={`font-bold ${wordColor}`}>
                {wordCount}
              </span>{" "}
              words
            </span>

            <span className="text-gray-200">·</span>

            <span>{answer.length} chars</span>

            <AnimatePresence>
              {wordCount >= 50 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 350 }}
                  className="bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full border border-emerald-100"
                >
                  ✓ Detailed
                </motion.span>
              )}
            </AnimatePresence>

          </div>
        )}
      </div>

      {/* TEXTAREA CONTAINER */}
      <div
        className={`
        relative
        rounded-2xl
        backdrop-blur-md
        border
        transition-all duration-200
        ${
          isRecording
            ? "border-red-300 ring-2 ring-red-300/30 shadow-lg shadow-red-50"
            : "border-gray-100 focus-within:ring-2 focus-within:ring-emerald-400/30 focus-within:shadow-lg"
        }
      `}
      >

        {/* TEXTAREA */}
        <textarea
          ref={textareaRef}
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            growTextarea();
          }}
          placeholder={
            isRecording
              ? "Listening… your speech will appear here in real time."
              : "Type your answer or use voice input..."
          }
          rows={6}
          readOnly={isRecording}
          className="
            w-full
            p-5
            pb-9
            text-[15px]
            text-gray-700
            bg-white/80
            rounded-2xl
            outline-none
            resize-none
            leading-relaxed
            placeholder-gray-300
          "
          style={{ minHeight: 170 }}
        />

        {/* PROGRESS BAR */}
        <div className="absolute bottom-3.5 left-5 right-5">

          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">

            <motion.div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />

          </div>

        </div>

      </div>

      {/* HINT */}
      <div className="flex justify-between text-[10px] text-gray-300">

        <span>
          Recommended: <span className="font-semibold text-gray-400">50–80 words</span>
        </span>

        <span>
          Press{" "}
          <kbd className="bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded text-[9px] font-mono">
            Ctrl + Enter
          </kbd>{" "}
          to submit
        </span>

      </div>

    </div>
  );
}

export default memo(AnswerTextarea);