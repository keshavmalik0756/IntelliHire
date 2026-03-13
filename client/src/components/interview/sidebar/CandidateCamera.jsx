import React from "react";
import { FaCheckCircle } from "react-icons/fa";

function CandidateCamera({
  webcamRef,
  canvasRef,
  cameraReady,
  metrics,
  DEV_MODE,
  fpsRef
}) {
  return (
    <div className="px-4 pb-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
          Your Camera
        </span>

        {cameraReady && (
          <span className="flex items-center space-x-1 text-emerald-400 text-[10px] font-bold">
            <FaCheckCircle className="text-[8px]" />
            <span>Camera Active</span>
          </span>
        )}
      </div>

      <div className="relative rounded-xl overflow-hidden border border-emerald-100 bg-gray-900 aspect-video">
        <video
          ref={webcamRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
        />

        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-full object-cover"
        />

        {!cameraReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
            <div className="w-7 h-7 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-emerald-400 text-[10px] font-medium">
              Starting camera…
            </span>
          </div>
        )}

        {/* Recording indicator */}
        <div className="absolute top-2 left-2 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
          <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white text-[9px] font-bold tracking-widest">REC</span>
        </div>

        {/* Emotion */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
          <span className="text-emerald-400 text-[9px] font-semibold">
            {metrics.emotion}
          </span>
        </div>

        {DEV_MODE && (
          <div className="absolute top-2 right-2 bg-black/60 px-1 py-0.5 rounded text-[8px] text-yellow-400 font-mono">
            {fpsRef.current} fps
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(CandidateCamera);
