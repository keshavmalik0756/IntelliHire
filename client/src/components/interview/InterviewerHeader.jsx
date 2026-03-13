import React from "react";
import { FaRobot } from "react-icons/fa";

function InterviewerHeader() {
  return (
    <div className="flex items-center justify-between">

      {/* LEFT SIDE */}
      <div className="flex items-center space-x-3">

        {/* AI Avatar */}
        <div className="relative shrink-0">

          <div className="
            w-11 h-11
            rounded-xl
            flex items-center justify-center
            text-white
            bg-gradient-to-br from-emerald-500 to-teal-600
            shadow-md
          ">
            <FaRobot className="text-[15px]" />
          </div>

          {/* Live indicator */}
          <span className="
            absolute -top-0.5 -right-0.5
            h-3 w-3
            rounded-full
            bg-emerald-400
            border-2 border-white
            animate-pulse
          "/>

        </div>

        {/* TEXT */}
        <div className="flex flex-col">

          <span className="text-sm font-extrabold text-gray-800 leading-none">
            IntelliHire AI Expert
          </span>

          <span className="text-[11px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
            Intelligent Assessment System
          </span>

        </div>

      </div>

      {/* RIGHT STATUS */}
      <div className="
        flex items-center
        space-x-1.5
        bg-emerald-50
        border border-emerald-200
        px-2.5 py-1
        rounded-full
      ">

        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />

        <span className="
          text-[10px]
          font-bold
          text-emerald-600
          uppercase
          tracking-widest
        ">
          Active
        </span>

      </div>

    </div>
  );
}

export default React.memo(InterviewerHeader);