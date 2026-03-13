import React from "react";
import { FaEye, FaBrain, FaShieldAlt } from "react-icons/fa";

function BehaviorMetrics({ metrics }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
        Behavior During This Answer
      </p>
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { icon: <FaEye />,       label: "Eye Contact", value: metrics.eyeContact, bgColor: "bg-emerald-50", borderColor: "border-emerald-100", textColor: "text-emerald-500", labelColor: "text-emerald-700" },
          { icon: <FaBrain />,     label: "Attention",   value: metrics.attention,  bgColor: "bg-blue-50",    borderColor: "border-blue-100",    textColor: "text-blue-500",    labelColor: "text-blue-700"    },
          { icon: <FaShieldAlt />, label: "Confidence",  value: metrics.confidence, bgColor: "bg-indigo-50",  borderColor: "border-indigo-100",  textColor: "text-indigo-500",  labelColor: "text-indigo-700"  },
        ].map(({ icon, label, value, bgColor, borderColor, textColor, labelColor }) => (
          <div key={label} className={`p-3 rounded-2xl ${bgColor} border ${borderColor} shadow-sm transition-all hover:scale-105 duration-300`}>
            <div className={`${textColor} flex justify-center mb-1.5 text-lg transition-transform group-hover:scale-110`}>{icon}</div>
            <span className={`block font-black ${labelColor} text-xl leading-none`}>{value}%</span>
            <span className="text-gray-400 text-[10px] mt-1 block font-medium uppercase tracking-tighter">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(BehaviorMetrics);
