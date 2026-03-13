import React from "react";
import { motion } from "framer-motion";

const scoreColor    = (v) => v >= 70 ? "text-emerald-600" : v >= 40 ? "text-amber-500" : "text-red-500";
const scoreBarColor = (v) => v >= 70 ? "bg-gradient-to-r from-emerald-400 to-emerald-500"  : v >= 40 ? "bg-gradient-to-r from-amber-300 to-amber-400"  : "bg-gradient-to-r from-red-400 to-red-500";

function MetricRow({ icon, label, value }) {
  return (
    <div className="space-y-1.5 group">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 text-gray-500 group-hover:text-gray-700 transition-colors">
          {icon && <span className="text-xs transform group-hover:scale-110 transition-transform">{icon}</span>}
          <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        <span className={`text-[11px] font-black tabular-nums ${scoreColor(value)}`}>{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-emerald-50 rounded-full overflow-hidden border border-emerald-100/50">
        <motion.div
          className={`h-full ${scoreBarColor(value)} rounded-full relative`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 -translate-x-full animate-[shine_2s_infinite]" />
        </motion.div>
      </div>
    </div>
  );
}

export default React.memo(MetricRow);
