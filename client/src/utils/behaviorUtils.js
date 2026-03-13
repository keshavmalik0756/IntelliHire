/**
 * behaviorUtils.js
 * High-performance behavioral analysis utilities for MediaPipe FaceMesh + Hands.
 * Optimized for real-time interview analysis.
 */

//////////////////////////////////////////////////////
// CONFIGURATION
//////////////////////////////////////////////////////

export const CONFIG = {
  gazeDeviationWeight:   200,
  blinkThreshold:        0.18,
  postureDownThreshold:  0.04,
  postureUpThreshold:   -0.04,
  tiltLeftThreshold:     1.6,
  tiltRightThreshold:    0.6,
  smileRatioBase:        2.5,
  smileRatioRange:       6,
  nervousnessScale:      0.05,
  normalBlinkRateMin:    10,  // blinks/min — lower → unresponsive
  normalBlinkRateMax:    20,  // blinks/min — higher → nervous/stressed
};

//////////////////////////////////////////////////////
// LANDMARK INDICES
//////////////////////////////////////////////////////

export const LANDMARKS = {
  LEFT_EYE_OUTER:    33,
  LEFT_EYE_INNER:   133,
  RIGHT_EYE_OUTER:  263,
  RIGHT_EYE_INNER:  362,
  LEFT_IRIS_CENTER:  468,
  RIGHT_IRIS_CENTER: 473,

  LEFT_EYE_TOP:    159,
  LEFT_EYE_BOTTOM: 145,
  RIGHT_EYE_TOP:   386,
  RIGHT_EYE_BOTTOM:374,

  NOSE_TIP:   4,
  CHIN:       152,
  FOREHEAD:   10,
  LEFT_CHEEK: 234,
  RIGHT_CHEEK:454,

  UPPER_LIP: 13,
  LOWER_LIP: 14,
  LEFT_MOUTH: 61,
  RIGHT_MOUTH:291,
};

//////////////////////////////////////////////////////
// BASIC UTILITIES
//////////////////////////////////////////////////////

export function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

export function distance(a, b) {
  if (!a || !b) return 0;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z || 0) - (b.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

//////////////////////////////////////////////////////
// EYE CONTACT
//////////////////////////////////////////////////////

/**
 * Calculates eye contact score (0–100).
 * Uses iris position relative to eye corners to estimate gaze direction.
 */
export function calculateEyeContact(landmarks) {
  if (!landmarks || landmarks.length < 478) return 0;

  const L = LANDMARKS;

  const leftOuter  = landmarks[L.LEFT_EYE_OUTER];
  const leftInner  = landmarks[L.LEFT_EYE_INNER];
  const leftIris   = landmarks[L.LEFT_IRIS_CENTER];

  const rightOuter = landmarks[L.RIGHT_EYE_OUTER];
  const rightInner = landmarks[L.RIGHT_EYE_INNER];
  const rightIris  = landmarks[L.RIGHT_IRIS_CENTER];

  const leftRatio  = (leftIris.x  - leftOuter.x)  / ((leftInner.x  - leftOuter.x)  || 1);
  const rightRatio = (rightIris.x - rightOuter.x) / ((rightInner.x - rightOuter.x) || 1);

  const deviation = (Math.abs(leftRatio - 0.5) + Math.abs(rightRatio - 0.5)) / 2;

  return Math.round(clamp(100 - deviation * CONFIG.gazeDeviationWeight, 0, 100));
}

//////////////////////////////////////////////////////
// BLINK DETECTION
//////////////////////////////////////////////////////

/**
 * Returns Eye Aspect Ratio (EAR). EAR < blinkThreshold → blink.
 */
export function calculateEAR(landmarks) {
  if (!landmarks || landmarks.length < 400) return 1;

  const L = LANDMARKS;

  const leftEAR  = distance(landmarks[L.LEFT_EYE_TOP],  landmarks[L.LEFT_EYE_BOTTOM])
                 / (distance(landmarks[L.LEFT_EYE_OUTER], landmarks[L.LEFT_EYE_INNER]) || 1);

  const rightEAR = distance(landmarks[L.RIGHT_EYE_TOP], landmarks[L.RIGHT_EYE_BOTTOM])
                 / (distance(landmarks[L.RIGHT_EYE_OUTER],landmarks[L.RIGHT_EYE_INNER]) || 1);

  return (leftEAR + rightEAR) / 2;
}

export function isBlink(ear) {
  return ear < CONFIG.blinkThreshold;
}

/**
 * Calculates blink rate (blinks per minute) and interprets stress level.
 *
 * @param {number} blinkCount   - Total blinks recorded
 * @param {number} elapsedSecs  - Elapsed time in seconds
 * @returns {{ blinksPerMin: number, status: string }}
 *
 * Status:
 *   'Low'    → staring / unresponsive  (< normalBlinkRateMin)
 *   'Normal' → calm / composed         (10–20 bpm)
 *   'High'   → nervous / stressed      (> normalBlinkRateMax)
 */
export function calculateBlinkRate(blinkCount, elapsedSecs) {
  if (!elapsedSecs || elapsedSecs < 1) return { blinksPerMin: 0, status: 'Normal' };

  const blinksPerMin = Math.round((blinkCount / elapsedSecs) * 60);

  let status = 'Normal';
  if (blinksPerMin < CONFIG.normalBlinkRateMin) status = 'Low';
  if (blinksPerMin > CONFIG.normalBlinkRateMax) status = 'High';

  return { blinksPerMin, status };
}

//////////////////////////////////////////////////////
// HEAD POSTURE
//////////////////////////////////////////////////////

/**
 * Detects head posture.
 * Returns: 'Good' | 'Looking Down' | 'Looking Up' | 'Tilted Left' | 'Tilted Right'
 */
export function detectPosture(landmarks) {
  if (!landmarks || landmarks.length < 460) return 'Unknown';

  const L = LANDMARKS;

  const nose      = landmarks[L.NOSE_TIP];
  const chin      = landmarks[L.CHIN];
  const forehead  = landmarks[L.FOREHEAD];
  const leftCheek = landmarks[L.LEFT_CHEEK];
  const rightCheek= landmarks[L.RIGHT_CHEEK];

  const midY = (forehead.y + chin.y) / 2;
  const verticalOffset = nose.y - midY;

  if (verticalOffset >  CONFIG.postureDownThreshold) return 'Looking Down';
  if (verticalOffset <  CONFIG.postureUpThreshold)   return 'Looking Up';

  const tiltRatio = Math.abs(nose.x - leftCheek.x) / (Math.abs(nose.x - rightCheek.x) || 0.0001);

  if (tiltRatio > CONFIG.tiltLeftThreshold)  return 'Tilted Left';
  if (tiltRatio < CONFIG.tiltRightThreshold) return 'Tilted Right';

  return 'Good';
}

//////////////////////////////////////////////////////
// SMILE DETECTION
//////////////////////////////////////////////////////

/**
 * Smile score (0–100) based on mouth width-to-height ratio.
 */
export function calculateSmileScore(landmarks) {
  if (!landmarks || landmarks.length < 300) return 0;

  const L = LANDMARKS;

  const width  = distance(landmarks[L.LEFT_MOUTH],  landmarks[L.RIGHT_MOUTH]);
  const height = distance(landmarks[L.UPPER_LIP],   landmarks[L.LOWER_LIP]);

  if (!height) return 0;

  return Math.round(clamp(((width / height) - CONFIG.smileRatioBase) / CONFIG.smileRatioRange * 100, 0, 100));
}

//////////////////////////////////////////////////////
// FACE PRESENCE
//////////////////////////////////////////////////////

/**
 * Checks if face is present and centered in the frame.
 */
export function analyzePresence(landmarks) {
  if (!landmarks || landmarks.length < 10) return { present: false, centered: false };

  const nose = landmarks[LANDMARKS.NOSE_TIP];
  const centered = nose.x > 0.25 && nose.x < 0.75 && nose.y > 0.15 && nose.y < 0.85;

  return { present: true, centered };
}

//////////////////////////////////////////////////////
// HEAD MOVEMENT
//////////////////////////////////////////////////////

/**
 * Measures head micro-movement magnitude between frames.
 */
export function calculateHeadMovement(landmarks, previousNose) {
  if (!previousNose || !landmarks) return 0;
  return distance(landmarks[LANDMARKS.NOSE_TIP], previousNose);
}

//////////////////////////////////////////////////////
// CONFIDENCE SCORE
//////////////////////////////////////////////////////

/**
 * Composite confidence score (0–100).
 * Weights: Eye Contact 40%, Attention 25%, Posture 20%, Smile 15%
 */
export function calculateConfidenceScore({ eyeContact, smileScore, postureStatus, attentionScore }) {
  const postureScore =
    postureStatus === 'Good'             ? 100 :
    postureStatus?.includes('Down')      ?  40 : 60;

  return Math.round(clamp(
    eyeContact    * 0.40 +
    smileScore    * 0.15 +
    postureScore  * 0.20 +
    attentionScore* 0.25,
    0, 100
  ));
}

//////////////////////////////////////////////////////
// EMOTION LABEL
//////////////////////////////////////////////////////

export function getEmotionLabel(smileScore, eyeContact) {
  if (smileScore > 60 && eyeContact > 60) return 'Confident & Engaging';
  if (smileScore > 40)                    return 'Positive';
  if (eyeContact < 30)                    return 'Distracted';
  if (smileScore < 15 && eyeContact < 40) return 'Stressed';
  return 'Neutral';
}

//////////////////////////////////////////////////////
// HAND MOVEMENT
//////////////////////////////////////////////////////

// Hand landmark indices
const HAND_POINTS = [0, 8, 12, 16, 20]; // wrist + fingertips

/**
 * Returns the centroid (average position) of key hand landmarks.
 * Used to track overall hand position between frames.
 */
export function getHandCentroid(handLandmarks) {
  if (!handLandmarks || handLandmarks.length === 0) return null;

  const sum = HAND_POINTS.reduce(
    (acc, i) => ({ x: acc.x + handLandmarks[i].x, y: acc.y + handLandmarks[i].y }),
    { x: 0, y: 0 }
  );

  return { x: sum.x / HAND_POINTS.length, y: sum.y / HAND_POINTS.length };
}

/**
 * Calculates movement magnitude between two hand centroids.
 */
export function calculateHandMovement(current, previous) {
  if (!current || !previous) return 0;
  const dx = current.x - previous.x;
  const dy = current.y - previous.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Classifies hand activity based on movement velocity.
 * Still < 0.008 < Gesticulating < 0.035 < Fidgeting
 */
export function classifyHandGesture(magnitude) {
  if (magnitude < 0.008) return 'Still';
  if (magnitude < 0.035) return 'Gesticulating';
  return 'Fidgeting';
}

/**
 * Computes hand nervousness score (0–100) from a rolling movement history.
 */
export function calculateHandNervousness(history = []) {
  if (!history.length) return 0;
  const avg = history.reduce((s, v) => s + v, 0) / history.length;
  return Math.round(clamp((avg / CONFIG.nervousnessScale) * 100, 0, 100));
}

/**
 * Human-readable label for current hand activity level.
 */
export function getHandActivityLabel(score) {
  if (score < 20) return 'Calm';
  if (score < 50) return 'Active';
  if (score < 75) return 'Restless';
  return 'Nervous';
}
