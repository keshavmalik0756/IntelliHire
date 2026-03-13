import React from "react";
import { motion } from "framer-motion";
import { FaChevronRight, FaExternalLinkAlt, FaRetweet, FaShareAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FooterActions = ({ itemVariants }) => {
  const navigate = useNavigate();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Report link copied to clipboard!");
  };

  return (
    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12 pb-20">
      <button 
        onClick={() => navigate('/dashboard')}
        className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black uppercase text-xs tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-3 group"
      >
        <FaChevronRight className="text-[10px] rotate-180 group-hover:-translate-x-1 transition-transform" />
        Dashboard
      </button>

      <button 
        onClick={() => navigate('/interview')}
        className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center gap-4 group"
      >
        <FaRetweet className="text-sm group-hover:rotate-180 transition-transform duration-500" />
        Retake Interview
      </button>
      
      <div className="flex gap-4">
        <button 
          onClick={handleShare}
          className="p-4 bg-white text-slate-400 border border-slate-200 rounded-2xl hover:text-emerald-500 hover:border-emerald-200 transition-all shadow-sm"
          title="Share Report"
        >
          <FaShareAlt className="text-sm" />
        </button>
        <button 
          onClick={() => window.print()}
          className="p-4 bg-white text-slate-400 border border-slate-200 rounded-2xl hover:text-blue-500 hover:border-blue-200 transition-all shadow-sm"
          title="Download PDF"
        >
          <FaExternalLinkAlt className="text-sm" />
        </button>
      </div>
    </motion.div>
  );
};

export default React.memo(FooterActions);
