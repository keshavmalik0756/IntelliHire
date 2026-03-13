import React from "react";

const GESTURE_COLORS = {
  Still:         "bg-emerald-50 text-emerald-600",
  Gesticulating: "bg-amber-50 text-amber-600",
  Fidgeting:     "bg-red-50 text-red-500",
};

function GestureBadge({ gesture }) {
  return (
    <span
      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
        GESTURE_COLORS[gesture] ?? "bg-gray-50 text-gray-400"
      }`}
    >
      {gesture}
    </span>
  );
}

export default React.memo(GestureBadge);
