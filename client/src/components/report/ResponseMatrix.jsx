import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronRight, FaBolt, FaEyeSlash, FaEye, FaStar } from "react-icons/fa";

const ResponseMatrix = ({ questions, itemVariants }) => {
  const [revealedAnswers, setRevealedAnswers] = useState({});

  const toggleReveal = (index) => {
    setRevealedAnswers(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const filteredQuestions = questions?.filter(q => q.answer) || [];

  return (
    <div className="space-y-6 pt-12">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4">
          <FaChevronRight className="text-emerald-500 text-sm" /> 
          Response Matrix <span className="text-slate-200">/</span> Detailed
        </h2>
        <div className="hidden sm:flex gap-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
             <div className="w-2 h-2 rounded-full bg-emerald-500" /> Technical
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
             <div className="w-2 h-2 rounded-full bg-blue-500" /> Communication
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredQuestions.map((q, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className="bg-white rounded-[2rem] border border-slate-200 group hover:border-emerald-200 hover:shadow-xl transition-all duration-500 overflow-hidden shadow-sm"
          >
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              {/* Question Side */}
              <div className="flex-1 p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs border border-emerald-100 text-center">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex gap-2">
                    <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-widest">{q.type || 'Tech'}</span>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                      q.difficulty === 'hard' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>{q.difficulty}</span>
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-slate-900 leading-snug">{q.question}</h4>
                
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 italic text-slate-500 text-sm leading-relaxed group-hover:text-slate-600 transition-colors">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Candidate Input</p>
                  "{q.answer}"
                </div>
              </div>

              {/* Feedback Side */}
              <div className="lg:w-96 p-8 bg-slate-50/50 relative">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score Assessment</p>
                    <p className="text-3xl font-black text-slate-900">{q.evaluation?.score}<span className="text-lg text-slate-300">/10</span></p>
                  </div>
                  <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-emerald-500 flex items-center justify-center">
                     <FaBolt className="text-emerald-500 text-xs" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">AI Feedback</p>
                    <p className="text-xs text-emerald-800/70 font-medium leading-relaxed">
                      {q.evaluation?.feedback || "Evaluation processing..."}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleReveal(i)}
                    className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${
                      revealedAnswers[i] 
                        ? "bg-slate-100 text-emerald-600 border-emerald-200" 
                        : "bg-emerald-600 text-white border-transparent hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
                    }`}
                  >
                    {revealedAnswers[i] ? <><FaEyeSlash /> Hide Solution</> : <><FaEye /> Reveal Guide</>}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {revealedAnswers[i] && q.evaluation?.modelAnswer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-slate-50 border-t border-slate-100"
                >
                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <FaStar className="text-amber-500 text-sm" />
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">AI Ideal Response</h5>
                    </div>
                    <p className="text-slate-600 text-sm italic font-medium leading-relaxed border-l-2 border-emerald-500 pl-6 py-1">
                      {q.evaluation.modelAnswer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ResponseMatrix);
