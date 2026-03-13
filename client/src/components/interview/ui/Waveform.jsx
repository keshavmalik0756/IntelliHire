import React from "react";
import { motion } from "framer-motion";

function Waveform() {
  return (
    <div className="flex items-center space-x-0.5">
      {[0.6, 1, 0.75, 0.9, 0.55, 0.8, 0.65].map((h, i) => (
        <motion.span
          key={i}
          className="inline-block w-0.5 bg-red-500 rounded-full"
          animate={{ scaleY: [h, h * 0.3, h, h * 0.6, h] }}
          transition={{ duration: 0.7 + i * 0.07, repeat: Infinity, ease: "easeInOut" }}
          style={{ height: 14, originY: 0.5 }}
        />
      ))}
    </div>
  );
}

export default React.memo(Waveform);
