/**
 * useBehaviorAnalytics.js
 *
 * Responsibility:
 *   - Receive raw landmarks (every ~80ms) from useMediaPipeCamera
 *   - Compute all behavior metrics
 *   - Store instantaneous values in refs (zero re-renders)
 *   - Flush aggregated, smoothed scores to React state every 500ms
 *   - Expose stable state object + per-question aggregation helpers
 *
 * This is the "analytics engine" — completely decoupled from the camera
 * and from the UI rendering.
 */

import { useRef, useState, useCallback, useEffect } from "react";
import {
  calculateEyeContact, calculateEAR, isBlink, detectPosture,
  calculateSmileScore, analyzePresence, calculateHeadMovement,
  calculateConfidenceScore, getEmotionLabel, clamp,
  getHandCentroid, calculateHandMovement, classifyHandGesture,
  calculateHandNervousness, getHandActivityLabel, calculateBlinkRate,
} from "../utils/behaviorUtils";

// ─── Config ──────────────────────────────────────────────────────────────────
const STATE_FLUSH_INTERVAL_MS = 500;  // How often to push metric averages to React state
const SLIDING_WINDOW_SIZE     = 30;   // Sliding window for score smoothing

// ─── Sliding window helper ────────────────────────────────────────────────────
function slidingAvg(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
}

function pushWindow(arr, val, size = SLIDING_WINDOW_SIZE) {
  arr.push(val);
  if (arr.length > size) arr.shift();
}

/**
 * @returns {{
 *   metrics: { eyeContact, attention, confidence, posture, smile, emotion, blinkCount, blinkRate, handGesture, handNervousness, handActivityLabel, handsVisible },
 *   processLandmarks: (face: Array|null, hands: Array[]) => void,
 *   getQuestionSummary: () => Object,
 *   resetQuestionAccumulator: () => void,
 *   sessionStartTime: number,
 * }}
 */
export function useBehaviorAnalytics() {

  // ── React state (flushed every 500ms, drives UI) ───────────────────────────
  const [metrics, setMetrics] = useState({
    eyeContact:        0,
    attention:         100,
    confidence:        0,
    posture:           "Initializing...",
    smile:             0,
    emotion:           "Detecting...",
    blinkCount:        0,
    blinkRate:         { blinksPerMin: 0, status: "Normal" },
    handGesture:       "No hands",
    handNervousness:   0,
    handActivityLabel: "—",
    handsVisible:      false,
  });

  // ── Sliding-window accumulators (refs — never trigger renders) ────────────
  const windows = useRef({
    eyeContact:      [],
    attention:       [],
    confidence:      [],
    handNervousness: [],
    smile:           [],
  });

  // ── Instant metric refs ────────────────────────────────────────────────────
  const instant = useRef({
    posture:           "Initializing...",
    emotion:           "Detecting...",
    handGesture:       "No hands",
    handActivityLabel: "—",
    handsVisible:      false,
    blinkCount:        0,
    blinkRate:         { blinksPerMin: 0, status: "Normal" },
  });

  // ── Per-question accumulators ─────────────────────────────────────────────
  const questionAccum = useRef({
    eyeContact:  [],
    attention:   [],
    confidence:  [],
    samples:     0,
  });

  // ── Hand tracking state ───────────────────────────────────────────────────
  const prevHandCentroid    = useRef(null);
  const handMovementHistory = useRef([]);

  // ── Blink tracking ────────────────────────────────────────────────────────
  const blinkState   = useRef(false);
  const blinkCount   = useRef(0);
  const prevNose     = useRef(null);
  const sessionStart = useRef(Date.now());

  // ── Flush timer ───────────────────────────────────────────────────────────
  const flushTimerRef = useRef(null);

  // ── Process incoming landmarks ─────────────────────────────────────────────
  const processLandmarks = useCallback((face, hands) => {

    // ─── FACE ────────────────────────────────────────────────────────────────
    if (face && face.length >= 10) {
      // Eye contact
      const ec = calculateEyeContact(face);
      pushWindow(windows.current.eyeContact, ec);

      // EAR / blink
      const ear = calculateEAR(face);
      if (isBlink(ear) && !blinkState.current) {
        blinkState.current = true;
        blinkCount.current += 1;
      } else if (!isBlink(ear)) {
        blinkState.current = false;
      }

      // Blink rate
      const elapsedSecs = (Date.now() - sessionStart.current) / 1000;
      instant.current.blinkCount = blinkCount.current;
      instant.current.blinkRate  = calculateBlinkRate(blinkCount.current, elapsedSecs);

      // Posture
      const posture = detectPosture(face);
      instant.current.posture = posture;

      // Smile
      const smile = calculateSmileScore(face);
      pushWindow(windows.current.smile, smile);

      // Presence / attention
      const { centered } = analyzePresence(face);
      const attn = centered ? clamp(ec * 0.6 + 40, 0, 100) : 20;
      pushWindow(windows.current.attention, attn);

      // Confidence
      const conf = calculateConfidenceScore({
        eyeContact:    ec,
        smileScore:    smile,
        postureStatus: posture,
        attentionScore: attn,
      });
      pushWindow(windows.current.confidence, conf);
      pushWindow(windows.current.handNervousness, 0); // placeholder until hand data

      // Emotion
      instant.current.emotion = getEmotionLabel(smile, ec);

      // Head micro-movement
      const headMov = calculateHeadMovement(face, prevNose.current);
      prevNose.current = face[4];

      // Question accumulation
      questionAccum.current.eyeContact.push(ec);
      questionAccum.current.attention.push(attn);
      questionAccum.current.confidence.push(conf);
      questionAccum.current.samples++;
    } else {
      // Face lost
      pushWindow(windows.current.eyeContact, 0);
      pushWindow(windows.current.attention, 0);
      pushWindow(windows.current.confidence, windows.current.confidence.at(-1) ?? 0);
      instant.current.posture = "Face not visible";
      instant.current.emotion = "Away";
    }

    // ─── HANDS ───────────────────────────────────────────────────────────────
    if (hands && hands.length > 0) {
      instant.current.handsVisible = true;

      const primaryHand = hands[0];
      const centroid    = getHandCentroid(primaryHand);
      const movement    = calculateHandMovement(centroid, prevHandCentroid.current);
      prevHandCentroid.current = centroid;

      const history = handMovementHistory.current;
      history.push(movement);
      if (history.length > 30) history.shift();

      const nervousness = calculateHandNervousness(history);
      const gesture     = classifyHandGesture(movement);
      const label       = getHandActivityLabel(nervousness);

      // Overwrite handNervousness window with real data
      pushWindow(windows.current.handNervousness, nervousness);
      instant.current.handGesture       = gesture;
      instant.current.handActivityLabel = label;
    } else {
      instant.current.handsVisible      = false;
      instant.current.handGesture       = "No hands";
      instant.current.handActivityLabel = "—";
      prevHandCentroid.current          = null;
    }
  }, []);

  // ── State flush — runs every 500ms ─────────────────────────────────────────
  useEffect(() => {
    flushTimerRef.current = setInterval(() => {
      const w = windows.current;
      const i = instant.current;

      setMetrics({
        eyeContact:        slidingAvg(w.eyeContact),
        attention:         slidingAvg(w.attention),
        confidence:        slidingAvg(w.confidence),
        smile:             slidingAvg(w.smile),
        posture:           i.posture,
        emotion:           i.emotion,
        blinkCount:        i.blinkCount,
        blinkRate:         i.blinkRate,
        handGesture:       i.handGesture,
        handNervousness:   slidingAvg(w.handNervousness),
        handActivityLabel: i.handActivityLabel,
        handsVisible:      i.handsVisible,
      });
    }, STATE_FLUSH_INTERVAL_MS);

    return () => clearInterval(flushTimerRef.current);
  }, []);

  // ── Question helpers ───────────────────────────────────────────────────────
  const getQuestionSummary = useCallback(() => {
    const avg = (arr) => arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;
    const q   = questionAccum.current;
    return {
      eyeContactScore:   avg(q.eyeContact),
      attentionScore:    avg(q.attention),
      confidenceScore:   avg(q.confidence),
      postureStatus:     instant.current.posture,
      handGesture:       instant.current.handGesture,
      handNervousness:   slidingAvg(windows.current.handNervousness),
    };
  }, []);

  const resetQuestionAccumulator = useCallback(() => {
    questionAccum.current = { eyeContact: [], attention: [], confidence: [], samples: 0 };
  }, []);

  return {
    metrics,
    processLandmarks,
    getQuestionSummary,
    resetQuestionAccumulator,
    sessionStartTime: sessionStart.current,
  };
}
