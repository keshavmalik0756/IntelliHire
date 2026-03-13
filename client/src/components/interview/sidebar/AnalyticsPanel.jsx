import React from "react";
import { FaEye, FaBrain, FaShieldAlt } from "react-icons/fa";
import { GiHand } from "react-icons/gi";
import { motion } from "framer-motion";
import MetricRow from "./MetricRow";
import GestureBadge from "./GestureBadge";

function AnalyticsPanel({ metrics }) {
  return (
    <div className="px-4 pb-4">
      <div className="bg-white/50 backdrop-blur-sm border border-emerald-100/50 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-50/50 bg-emerald-50/20">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm shadow-emerald-200">
              <FaBrain className="text-white text-[10px]" />
            </div>
            <span className="text-slate-800 text-[11px] font-black uppercase tracking-widest italic">
              AI Insights
            </span>
          </div>
          <span className="text-[9px] text-emerald-600 font-black bg-emerald-100/50 px-2 py-0.5 rounded-full border border-emerald-200/50 animate-pulse">
            LIVE ANALYTICS
          </span>
        </div>

        <div className="p-4 space-y-3.5">
          <MetricRow
            icon={<FaEye className="text-emerald-500" />}
            label="Eye Contact"
            value={metrics.eyeContact}
          />
          <MetricRow
            icon={<FaBrain className="text-teal-500" />}
            label="Attention"
            value={metrics.attention}
          />
          <MetricRow
            icon={<FaShieldAlt className="text-cyan-500" />}
            label="Confidence"
            value={metrics.confidence}
          />

          <div className="h-px bg-emerald-100/30 my-2" />

          {/* 3-col Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            {/* Posture */}
            <div className="flex flex-col items-center bg-emerald-50/30 border border-emerald-100/30 rounded-xl py-2.5 px-1 transition-transform hover:scale-105">
              <span
                className={`text-[11px] font-black leading-none ${
                  metrics.posture === "Good" ? "text-emerald-600" : "text-amber-500"
                }`}
              >
                {metrics.posture}
              </span>
              <span className="text-slate-400 text-[8px] font-bold uppercase tracking-tighter mt-1">Posture</span>
            </div>

            {/* Blinks */}
            <div className="flex flex-col items-center bg-teal-50/30 border border-teal-100/30 rounded-xl py-2.5 px-1 transition-transform hover:scale-105">
              <span className="text-[11px] font-black text-teal-600 leading-none">
                {metrics.blinkCount}
              </span>
              <span
                className={`text-[8px] font-bold mt-0.5 ${
                  metrics.blinkRate.status === "Normal"
                    ? "text-emerald-500"
                    : metrics.blinkRate.status === "High"
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
              >
                {metrics.blinkRate.blinksPerMin}/min
              </span>
              <span className="text-slate-400 text-[8px] font-bold uppercase tracking-tighter mt-1">Blinks</span>
            </div>

            {/* Hands */}
            <div className="flex flex-col items-center bg-cyan-50/30 border border-cyan-100/30 rounded-xl py-2.5 px-1 transition-transform hover:scale-105">
              <GiHand
                className={`text-sm mb-0.5 ${
                  metrics.handNervousness < 30
                    ? "text-emerald-500"
                    : metrics.handNervousness < 65
                    ? "text-amber-500"
                    : "text-red-500"
                }`}
              />
              <span className="text-slate-400 text-[8px] font-bold uppercase tracking-tighter mt-1">Hands</span>
            </div>
          </div>

          <div className="h-px bg-emerald-100/30 my-2" />

          {/* Hand Nervousness Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Activity Level</span>
              <GestureBadge gesture={metrics.handGesture} />
            </div>
            <div className="h-1.5 w-full bg-emerald-50 rounded-full overflow-hidden border border-emerald-100/30">
              <motion.div
                className={`h-full rounded-full transition-all duration-700 ${
                  metrics.handNervousness < 30
                    ? "bg-emerald-500"
                    : metrics.handNervousness < 65
                    ? "bg-amber-400"
                    : "bg-red-400"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${metrics.handNervousness}%` }}
              />
            </div>
            <div className="flex justify-between text-[8px] font-bold uppercase tracking-tighter text-slate-400">
              <span>
                Status: <span className="text-emerald-600">{metrics.handActivityLabel}</span>
              </span>
              {!metrics.handsVisible && <span className="text-red-400 italic">Not in frame</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(AnalyticsPanel);
