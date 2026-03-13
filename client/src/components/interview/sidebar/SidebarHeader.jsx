import React from "react";
import { FaRobot } from "react-icons/fa";

function SidebarHeader() {
  return (
    <div className="px-5 pt-5 pb-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
          <FaRobot className="text-white text-xs" />
        </div>
        <span className="text-gray-800 font-bold text-sm tracking-tight">IntelliHire</span>
      </div>
      <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
        <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
        <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Live</span>
      </div>
    </div>
  );
}

export default React.memo(SidebarHeader);
