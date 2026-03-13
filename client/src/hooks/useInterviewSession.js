import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import api from "../utils/api";
import { TOTAL_ANSWER_TIME } from "../components/interview/constants";

/**
 * Hook to manage the core interview session state and logic
 */
export const useInterviewSession = (interviewData, onFinish, getQuestionSummary, resetQuestionAccumulator) => {
  const [questions] = useState(interviewData.questions || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_ANSWER_TIME);
  const [evaluation, setEvaluation] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  const completeInterview = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post("/interview/complete", { interviewId: interviewData.interviewId });
      if (res.data.success) {
        toast.success("Interview complete! Generating report…");
        onFinish(res.data.data);
      }
    } catch {
      toast.error("Error completing interview.");
    } finally {
      setIsSubmitting(false);
    }
  }, [interviewData.interviewId, onFinish]);

  const handleNext = useCallback(() => {
    setShowFeedback(false);
    setEvaluation(null);
    setAnswer("");
    setTimeLeft(TOTAL_ANSWER_TIME);
    resetQuestionAccumulator();
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      completeInterview();
    }
  }, [currentIndex, questions.length, resetQuestionAccumulator, completeInterview]);

  const handleSubmit = useCallback(async () => {
    // If auto-submit (timeLeft === 0), we allow empty answers
    if (!answer.trim() && timeLeft > 0) {
      toast.error("Please write an answer before submitting.");
      return;
    }
    setIsSubmitting(true);

    const summary = getQuestionSummary();
    api.post("/interview/analyze-confidence", {
      interviewId: interviewData.interviewId,
      questionId: currentQuestion?.id,
      ...summary,
    }).catch((e) => console.warn("[behavior post]", e));

    try {
      const res = await api.post("/interview/submit-answer", {
        interviewId: interviewData.interviewId,
        questionId: currentQuestion?.id,
        answer: answer || "No answer provided.",
      });
      if (res.data.success) {
        const ev = res.data.data.evaluation;
        setEvaluation(ev);
        setShowFeedback(true);
        toast.success(`Score: ${ev.score}/10`);
      }
    } catch {
      toast.error("Evaluation failed. Moving to next question.");
      handleNext();
    } finally {
      setIsSubmitting(false);
    }
  }, [answer, timeLeft, currentQuestion, interviewData.interviewId, getQuestionSummary, handleNext]);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting && !showFeedback) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && !showFeedback) {
      handleSubmit();
    }
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, isSubmitting, showFeedback, handleSubmit]);

  const growTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 380) + "px";
  }, []);

  return {
    questions,
    currentIndex,
    currentQuestion,
    answer,
    setAnswer,
    isSubmitting,
    timeLeft,
    evaluation,
    showFeedback,
    handleNext,
    handleSubmit,
    textareaRef,
    growTextarea
  };
};
