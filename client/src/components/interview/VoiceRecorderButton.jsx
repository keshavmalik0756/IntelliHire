import React from "react";
import { motion } from "framer-motion";
import { FaMicrophone, FaStop } from "react-icons/fa";

function VoiceRecorderButton({ isRecording, toggleRecording }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={toggleRecording}
      className={`
        relative flex items-center gap-2.5
        px-5 py-2.5
        rounded-xl
        text-sm font-semibold
        transition-all
        overflow-hidden
        ${
          isRecording
            ? "bg-red-500 text-white shadow-lg shadow-red-200"
            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:shadow-md"
        }
      `}
    >
      {/* Recording pulse */}
      {isRecording && (
        <motion.span
          className="absolute inset-0 rounded-xl bg-red-400/20"
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}

      {/* Icon */}
      <span className="relative flex items-center justify-center text-[13px]">
        {isRecording ? <FaStop /> : <FaMicrophone />}
      </span>

      {/* Label */}
      <span className="relative whitespace-nowrap">
        {isRecording ? "Stop Recording" : "Start Voice"}
      </span>

      {/* Recording indicator */}
      {isRecording && (
        <span className="relative flex h-2 w-2 ml-1">
          <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      )}
    </motion.button>
  );
}

export default React.memo(VoiceRecorderButton);