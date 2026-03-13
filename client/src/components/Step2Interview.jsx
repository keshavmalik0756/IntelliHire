/**
 * Step2Interview.jsx  (Refactored — modular architecture)
 *
 * This file owns ALL state, logic, hooks, and refs.
 * UI is fully delegated to components/interview/*.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";

import aiVideo from "../assets/demo.mp4";
import { useMediaPipeCamera }   from "../hooks/useMediaPipeCamera";
import { useBehaviorAnalytics } from "../hooks/useBehaviorAnalytics";
import { useSpeechSynthesis }   from "../hooks/useSpeechSynthesis";
import { useInterviewSession } from "../hooks/useInterviewSession";

import InterviewLayout from "./interview/InterviewLayout";
import Sidebar         from "./interview/sidebar/Sidebar";

const Step2Interview = ({ interviewData, onFinish }) => {
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const speechRef = useRef(null);
  const aiVideoRef = useRef(null);

  const DEV_MODE = import.meta.env.MODE === "development";

  // 1. Behavior Analytics
  const { metrics, processLandmarks, getQuestionSummary, resetQuestionAccumulator } = useBehaviorAnalytics();

  // 2. Camera & MediaPipe
  const onCameraReady = useCallback((ready) => {
    queueMicrotask(() => setCameraReady(ready));
  }, []);

  const { webcamRef, canvasRef, fpsRef } = useMediaPipeCamera({
    onLandmarks: processLandmarks,
    onReady: onCameraReady,
  });

  // 3. Interview Session (New Hook)
  const {
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
  } = useInterviewSession(interviewData, onFinish, getQuestionSummary, resetQuestionAccumulator);

  // 4. Speech Synthesis (New Hook)
  const { isSpeaking, speak, cancel } = useSpeechSynthesis(aiVideoRef);
  const hasSpokenRef = useRef(false);

  // ── AI Video & Speech Sync Effect ──────────────────────────────────────────
  useEffect(() => {
    // Reset "has spoken" flag when question index changes
    hasSpokenRef.current = false;
  }, [currentIndex]);

  useEffect(() => {
    const qText = currentQuestion?.question || currentQuestion?.text || (typeof currentQuestion === 'string' ? currentQuestion : "");
    
    if (qText && !showFeedback && !isSubmitting && !hasSpokenRef.current) {
      const timeout = setTimeout(() => {
        speak(qText);
        hasSpokenRef.current = true;
      }, 800);

      return () => {
        clearTimeout(timeout);
        if (showFeedback || isSubmitting) {
          cancel();
        }
      };
    }
  }, [currentIndex, currentQuestion, showFeedback, isSubmitting, speak, cancel]);

  // ── Speech recognition ─────────────────────────────────────────────────────
  const toggleRecording = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { toast.error("Speech recognition not supported in this browser."); return; }

    if (isRecording) {
      speechRef.current?.stop();
      setIsRecording(false);
      toast.success("Stopped listening.");
      return;
    }

    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;

    let finalText = answer;

    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += (finalText ? " " : "") + t.trim();
        else interim = t;
      }
      setAnswer(finalText + (interim ? " " + interim : ""));
      growTextarea();
    };
    rec.onerror = (e) => {
      if (e.error !== "aborted") toast.error("Mic error: " + e.error);
      setIsRecording(false);
    };
    rec.onend = () => setIsRecording(false);

    speechRef.current = rec;
    rec.start();
    setIsRecording(true);
    toast.success("Listening… speak now.");
  }, [isRecording, answer, setAnswer, growTextarea]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-[1440px] h-[96vh] bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.1)] border border-emerald-100 flex flex-col lg:flex-row overflow-hidden">

        {/* ══ LEFT SIDEBAR ════════════════════════════════════════════════════ */}
        <Sidebar
          aiVideo={aiVideo}
          aiVideoRef={aiVideoRef}
          isSpeaking={isSpeaking}
          webcamRef={webcamRef}
          canvasRef={canvasRef}
          cameraReady={cameraReady}
          metrics={metrics}
          DEV_MODE={DEV_MODE}
          fpsRef={fpsRef}
        />

        {/* ══ MAIN CONTENT (via InterviewLayout) ══════════════════════════════ */}
        <InterviewLayout
          questions={questions}
          currentIndex={currentIndex}
          currentQuestion={currentQuestion}
          showFeedback={showFeedback}
          evaluation={evaluation}
          metrics={metrics}
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
          handleNext={handleNext}
          textareaRef={textareaRef}
          growTextarea={growTextarea}
        />

      </div>
    </div>
  );
};

export default Step2Interview;