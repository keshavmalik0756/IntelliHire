/**
 * useMediaPipeCamera.js
 *
 * Responsibility:
 *   - Start/stop the webcam stream
 *   - Initialize MediaPipe FaceMesh + Hands (loaded once)
 *   - Pump frames via MediaPipe Camera utility
 *   - Throttle processing to ~12 FPS (every 80 ms)
 *   - Store latest raw landmarks in refs (no React state)
 *   - Expose webcamRef, canvasRef, and latest landmarks ref
 *
 * This hook never triggers React re-renders itself.
 * All heavy work stays off the React render cycle.
 */

import { useRef, useEffect, useCallback } from "react";

// ─── Config ──────────────────────────────────────────────────────────────────
const PROCESS_INTERVAL_MS  = 80;   // ~12 FPS processing
const CANVAS_WIDTH  = 640;
const CANVAS_HEIGHT = 480;

// ─── CDN base paths ───────────────────────────────────────────────────────────
const faceLocate = (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`;
const handLocate = (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`;

/**
 * @param {Object} options
 * @param {(faceLandmarks: Array|null, handLandmarks: Array[]) => void} options.onLandmarks
 *   Callback fired every ~80ms with the latest detected landmarks.
 * @param {(ready: boolean) => void} options.onReady
 *   Called once the camera stream is running.
 * @returns {{ webcamRef, canvasRef, fpsRef }}
 */
export function useMediaPipeCamera({ onLandmarks, onReady }) {
  const webcamRef    = useRef(null);
  const canvasRef    = useRef(null);
  const cameraRef    = useRef(null);
  const faceMeshRef  = useRef(null);
  const handsRef     = useRef(null);
  const drawUtilsRef = useRef(null);

  // Latest raw landmark storage — refs so no re-render
  const latestFaceLandmarks  = useRef(null);
  const latestHandLandmarks  = useRef([]);

  // Throttle
  const lastProcessTime = useRef(0);

  // Performance: FPS counter
  const fpsRef       = useRef(0);
  const frameCount   = useRef(0);
  const fpsTimerRef  = useRef(null);

  // ── Canvas drawing (called every frame for visual smoothness) ──────────────
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const video  = webcamRef.current;
    if (!canvas || !video || video.readyState < 2) return;

    const ctx = canvas.getContext("2d");
    const du  = drawUtilsRef.current;
    if (!du) return;

    const { drawConnectors, drawLandmarks, FACEMESH_TESSELATION, FACEMESH_RIGHT_EYE, FACEMESH_LEFT_EYE, HAND_CONNECTIONS } = du;

    ctx.save();
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Face mesh
    const face = latestFaceLandmarks.current;
    if (face) {
      drawConnectors(ctx, face, FACEMESH_TESSELATION,  { color: "rgba(16,185,129,0.12)", lineWidth: 0.4 });
      drawConnectors(ctx, face, FACEMESH_RIGHT_EYE,    { color: "rgba(16,185,129,0.85)", lineWidth: 1.2 });
      drawConnectors(ctx, face, FACEMESH_LEFT_EYE,     { color: "rgba(16,185,129,0.85)", lineWidth: 1.2 });
      // Iris dots
      if (face[468] && face[473]) {
        drawLandmarks(ctx, [face[468], face[473]], { color: "#10b981", radius: 2 });
      }
    }

    // Hand landmarks
    const hands = latestHandLandmarks.current;
    if (hands && HAND_CONNECTIONS) {
      for (const hand of hands) {
        drawConnectors(ctx, hand, HAND_CONNECTIONS, { color: "rgba(99,102,241,0.6)", lineWidth: 1.5 });
        drawLandmarks(ctx, hand, { color: "#818cf8", radius: 2 });
      }
    }

    ctx.restore();
  }, []);

  // ── MediaPipe onResults handlers ────────────────────────────────────────────
  const onFaceResults = useCallback((results) => {
    latestFaceLandmarks.current =
      results.multiFaceLandmarks?.length > 0
        ? results.multiFaceLandmarks[0]
        : null;
  }, []);

  const onHandResults = useCallback((results) => {
    latestHandLandmarks.current = results.multiHandLandmarks ?? [];
  }, []);

  // ── Main frame pump (called by Camera utility every frame) ─────────────────
  const onFrame = useCallback(async () => {
    const video = webcamRef.current;
    if (!video) return;

    const now = performance.now();
    frameCount.current++;

    // ── VISUAL: always draw the canvas at full frame rate ──
    drawCanvas();

    // ── ANALYTICS: throttled to PROCESS_INTERVAL_MS ──
    if (now - lastProcessTime.current < PROCESS_INTERVAL_MS) return;
    lastProcessTime.current = now;

    // Send frame to both models concurrently
    const promises = [];
    if (faceMeshRef.current) promises.push(faceMeshRef.current.send({ image: video }));
    if (handsRef.current)    promises.push(handsRef.current.send({ image: video }));
    await Promise.all(promises);

    // Fire landmark callback for behavior analytics
    if (onLandmarks) {
      onLandmarks(latestFaceLandmarks.current, latestHandLandmarks.current);
    }
  }, [drawCanvas, onLandmarks]);

  // ── Initialization ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        // ── Step 1: load drawing utils + camera (no WASM, safe to parallel) ──
        const [drawUtils, { Camera }] = await Promise.all([
          import("@mediapipe/drawing_utils"),
          import("@mediapipe/camera_utils"),
        ]);

        if (cancelled) return;

        // Get HAND_CONNECTIONS from @mediapipe/hands (NOT drawing_utils)
        const { Hands, HAND_CONNECTIONS } = await import("@mediapipe/hands");

        if (cancelled) return;

        // Store draw utilities + hand connections together
        drawUtilsRef.current = {
          drawConnectors:       drawUtils.drawConnectors,
          drawLandmarks:        drawUtils.drawLandmarks,
          FACEMESH_TESSELATION: drawUtils.FACEMESH_TESSELATION,
          FACEMESH_RIGHT_EYE:   drawUtils.FACEMESH_RIGHT_EYE,
          FACEMESH_LEFT_EYE:    drawUtils.FACEMESH_LEFT_EYE,
          HAND_CONNECTIONS,
        };

        // ── Step 2: FaceMesh first (fully initialize before Hands) ─────────
        const { FaceMesh } = await import("@mediapipe/face_mesh");
        if (cancelled) return;

        const faceMesh = new FaceMesh({ locateFile: faceLocate });
        faceMesh.setOptions({
          maxNumFaces:            1,
          refineLandmarks:        true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence:  0.5,
        });
        faceMesh.onResults(onFaceResults);
        // Initialize (loads WASM) before creating Hands
        await faceMesh.initialize();
        faceMeshRef.current = faceMesh;

        if (cancelled) return;

        // ── Step 3: Hands second (WASM fully separate now) ─────────────────
        const hands = new Hands({ locateFile: handLocate });
        hands.setOptions({
          maxNumHands:            2,
          modelComplexity:        1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence:  0.5,
        });
        hands.onResults(onHandResults);
        await hands.initialize();
        handsRef.current = hands;

        if (cancelled) return;

        // ── Step 4: Start camera ────────────────────────────────────────────
        if (webcamRef.current) {
          const camera = new Camera(webcamRef.current, {
            onFrame,
            width:  CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
          });
          await camera.start();
          cameraRef.current = camera;
          if (onReady) onReady(true);

          // FPS counter
          fpsTimerRef.current = setInterval(() => {
            fpsRef.current    = frameCount.current;
            frameCount.current = 0;
          }, 1000);
        }
      } catch (err) {
        console.error("[useMediaPipeCamera] init error:", err);
        if (onReady) onReady(false);
      }
    };

    init();

    return () => {
      cancelled = true;

      // Stop camera stream
      if (cameraRef.current) {
        try { cameraRef.current.stop(); } catch (_) {}
        cameraRef.current = null;
      }

      // Dispose models
      if (faceMeshRef.current) {
        try { faceMeshRef.current.close(); } catch (_) {}
        faceMeshRef.current = null;
      }
      if (handsRef.current) {
        try { handsRef.current.close(); } catch (_) {}
        handsRef.current = null;
      }

      // Stop FPS counter
      clearInterval(fpsTimerRef.current);

      // Clear canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      if (onReady) onReady(false);
    };
  }, []); // only run once

  return { webcamRef, canvasRef, fpsRef };
}
