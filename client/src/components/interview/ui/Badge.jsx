import React from "react";

function Badge({ label, colorClass }) {
  return (
    <span
      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider border ${colorClass}`}
    >
      {label}
    </span>
  );
}

export default React.memo(Badge);
