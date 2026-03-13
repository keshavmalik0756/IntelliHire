import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Hook to manage AI speech synthesis and sync with video
 */
export const useSpeechSynthesis = (aiVideoRef) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lastSpokenIndex = useRef(-1);

  const findBestVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Filter English voices
    const englishVoices = voices.filter(v => v.lang.startsWith("en"));
    if (!englishVoices.length) return voices[0];

    // Priority 1: Specifically known male voice names or "Male" keyword
    const maleKeywords = ["Male", "David", "Mark", "James", "Daniel", "Guy", "Stefan"];
    const maleVoice = englishVoices.find(v => 
      maleKeywords.some(keyword => v.name.includes(keyword))
    );

    // Priority 2: Natural/Premium voices (might be female, but often higher quality)
    const naturalVoice = englishVoices.find(v => v.name.includes("Natural"));
    
    // Priority 3: Google voices
    const googleVoice = englishVoices.find(v => v.name.includes("Google"));

    return maleVoice || naturalVoice || googleVoice || englishVoices[0];
  }, []);

  const speak = useCallback((text) => {
    if (!text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = findBestVoice();
    utterance.rate  = 0.9;
    utterance.pitch = 1.0; // Slightly lower pitch for male tone
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (aiVideoRef.current) {
        aiVideoRef.current.play().catch(err => console.warn("Video play error:", err));
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (aiVideoRef.current) {
        aiVideoRef.current.pause();
      }
    };

    utterance.onerror = (e) => {
      if (e.error === "interrupted" || e.error === "canceled") return;
      console.error("Speech error:", e);
      setIsSpeaking(false);
      if (aiVideoRef.current) aiVideoRef.current.pause();
    };

    window.speechSynthesis.speak(utterance);
  }, [aiVideoRef, findBestVoice]);

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    if (aiVideoRef.current) aiVideoRef.current.pause();
  }, [aiVideoRef]);

  useEffect(() => {
    const loadVoices = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return {
    isSpeaking,
    speak,
    cancel,
    lastSpokenIndex
  };
};
