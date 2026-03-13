import React, { memo } from "react";
import Timer from "./Timer";
import { TOTAL_ANSWER_TIME } from "./constants";

function StatusBar({ questions = [], currentIndex = 0, timeLeft }) {

  const totalQuestions = questions.length;
  const currentQuestion = currentIndex + 1;

  return (
    <div
      className="
        flex items-center justify-between
        px-6 py-3
        bg-white/70 backdrop-blur-md
        border border-emerald-100
        rounded-2xl
        shadow-sm
        shrink-0
      "
    >

      {/* Question Counter */}
      <div className="flex items-center space-x-3">

        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Question
        </span>

        <div className="flex items-center space-x-1.5 text-sm font-black">

          <span className="text-emerald-600 text-xl tracking-tighter">
            {currentQuestion.toString().padStart(2, '0')}
          </span>

          <span className="text-slate-200">/</span>

          <span className="text-slate-400">
            {totalQuestions.toString().padStart(2, '0')}
          </span>

        </div>

      </div>

      {/* Timer */}
      <div className="flex items-center">
        <Timer
          timeLeft={timeLeft}
          totalTime={TOTAL_ANSWER_TIME}
        />
      </div>

    </div>
  );
}

export default memo(StatusBar);