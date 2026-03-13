import React, { Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import StatusBar from "./StatusBar";
import QuestionSection from "./QuestionSection";

// Lazy-load FeedbackView to keep the critical Q&A path fast
const FeedbackView = React.lazy(() => import("./FeedbackView"));

function InterviewLayout({
  questions,
  currentIndex,
  currentQuestion,
  showFeedback,
  evaluation,
  metrics,
  timeLeft,
  answer,
  setAnswer,
  isRecording,
  isSubmitting,
  isSpeaking,
  speak,
  cancel,
  toggleRecording,
  handleSubmit,
  handleNext,
  textareaRef,
  growTextarea,
}) {
  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-white/30">

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {!showFeedback ? (
            <QuestionSection
              key="qa-view"
              questions={questions}
              currentIndex={currentIndex}
              currentQuestion={currentQuestion}
              timeLeft={timeLeft}
              answer={answer}
              setAnswer={setAnswer}
              isRecording={isRecording}
              isSubmitting={isSubmitting}
              isSpeaking={isSpeaking}
              speak={speak}
              cancel={cancel}
              toggleRecording={toggleRecording}
              handleSubmit={handleSubmit}
              textareaRef={textareaRef}
              growTextarea={growTextarea}
            />
          ) : (
            <Suspense
              key="feedback-view"
              fallback={
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <FeedbackView
                questions={questions}
                currentIndex={currentIndex}
                evaluation={evaluation}
                metrics={metrics}
                timeLeft={timeLeft}
                handleNext={handleNext}
              />
            </Suspense>
          )}
        </AnimatePresence>
      </div>

    </main>
  );
}

export default React.memo(InterviewLayout);
