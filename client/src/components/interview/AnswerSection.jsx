import React from "react";
import AnswerTextarea from "./AnswerTextarea";
import VoiceRecorderButton from "./VoiceRecorderButton";
import SubmitActions from "./SubmitActions";

function AnswerSection({
  answer,
  setAnswer,
  isRecording,
  isSubmitting,
  toggleRecording,
  handleSubmit,
  textareaRef,
  growTextarea,
}) {
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="space-y-4">

      <AnswerTextarea
        answer={answer}
        setAnswer={setAnswer}
        isRecording={isRecording}
        textareaRef={textareaRef}
        growTextarea={growTextarea}
        wordCount={wordCount}
      />

      <div className="flex items-center justify-between gap-4 pt-1">
        <VoiceRecorderButton isRecording={isRecording} toggleRecording={toggleRecording} />
        <SubmitActions
          answer={answer}
          isRecording={isRecording}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          setAnswer={setAnswer}
          textareaRef={textareaRef}
        />
      </div>

    </div>
  );
}

export default React.memo(AnswerSection);
