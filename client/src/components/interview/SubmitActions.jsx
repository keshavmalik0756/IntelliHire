import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";

function SubmitActions({ answer, isRecording, isSubmitting, handleSubmit, setAnswer, textareaRef }) {
  return (
    <div className="flex items-center justify-between gap-4 pt-1">

      {/* Voice button is rendered in AnswerSection; this handles submit + clear */}
      <div className="flex items-center space-x-2 ml-auto">

        {/* Clear */}
        <AnimatePresence>
          {answer.length > 0 && !isRecording && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setAnswer("");
                if (textareaRef?.current) textareaRef.current.style.height = "auto";
              }}
              className="text-xs text-gray-400 hover:text-red-400 px-3 py-2 rounded-xl hover:bg-red-50 transition-all"
            >
              Clear
            </motion.button>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={isSubmitting || !answer.trim()}
          className="relative flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-7 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden"
        >
          <span className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-all rounded-xl" />
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Evaluating…</span>
            </>
          ) : (
            <>
              <FaPaperPlane className="text-xs" />
              <span>Submit Answer</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

export default React.memo(SubmitActions);
