import React from "react";
import { FaRobot, FaVideo } from "react-icons/fa";

function AIInterviewerVideo({ aiVideo, aiVideoRef, isSpeaking }) {
  return (
    <div className="px-4 pb-3">
      <div className="relative rounded-2xl overflow-hidden border border-emerald-100 shadow-xl bg-gray-900">
        <video
          ref={aiVideoRef}
          loop
          muted
          playsInline
          preload="auto"
          className={`w-full aspect-video object-cover transition-opacity duration-500 ${isSpeaking ? "opacity-100" : "opacity-60"}`}
        >
          <source src={aiVideo} type="video/mp4" />
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />
        {/* Bottom label */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-lg transition-colors duration-300 ${isSpeaking ? "bg-emerald-500" : "bg-slate-600"}`}>
              <FaRobot className="text-white text-[10px]" />
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-none">AI Interviewer</p>
              <p className="text-emerald-400 text-[9px] font-medium mt-0.5">IntelliHire v2</p>
            </div>
          </div>
          <div className={`flex items-center space-x-1 backdrop-blur-sm px-2 py-1 rounded-md transition-all duration-300 ${isSpeaking ? "bg-emerald-500/20 ring-1 ring-emerald-500/50" : "bg-black/50"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`} />
            <span className={`text-[9px] font-bold ${isSpeaking ? "text-emerald-400" : "text-slate-300"}`}>
              {isSpeaking ? "SPEAKING" : "IDLE"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(AIInterviewerVideo);
