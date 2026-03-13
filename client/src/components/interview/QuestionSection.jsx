import React from "react";
import { motion } from "framer-motion";
import InterviewerHeader from "./InterviewerHeader";
import QuestionCard from "./QuestionCard";
import AnswerSection from "./AnswerSection";
import StatusBar from "./StatusBar";

function QuestionSection({
  questions,
  currentIndex,
  currentQuestion,
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
  textareaRef,
  growTextarea,
}) {
  return (
    <motion.div
      key="qa-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="p-4 sm:p-6 lg:p-8 xl:p-12 space-y-6 sm:space-y-8 mx-auto w-full max-w-4xl"
      onKeyDown={(e) => {
        if (e.ctrlKey && e.key === "Enter" && answer.trim() && !isSubmitting) handleSubmit();
      }}
    >
      <div className="space-y-2">
        <InterviewerHeader />
        <StatusBar
          questions={questions}
          currentIndex={currentIndex}
          currentQuestion={currentQuestion}
          timeLeft={timeLeft}
        />
      </div>

      <QuestionCard 
        question={currentQuestion} 
        index={currentIndex} 
        isSpeaking={isSpeaking}
        speak={speak}
        cancel={cancel}
      />

      <AnswerSection
        answer={answer}
        setAnswer={setAnswer}
        isRecording={isRecording}
        isSubmitting={isSubmitting}
        toggleRecording={toggleRecording}
        handleSubmit={handleSubmit}
        textareaRef={textareaRef}
        growTextarea={growTextarea}
      />
    </motion.div>
  );
}

export default React.memo(QuestionSection);
