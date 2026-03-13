import React from "react";
import { motion } from "framer-motion";

const Confetti = () => {
  // Optimized for performance: reduced count
  const pieces = Array.from({ length: 25 });
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: -20, 
            left: `${Math.random() * 100}%`, 
            rotate: 0, 
            opacity: 1,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            top: '120%', 
            left: `${Math.random() * 100}%`, 
            rotate: 360 * 5, 
            opacity: 0,
            scale: 0.2
          }}
          transition={{ 
            duration: Math.random() * 3 + 2, 
            ease: "easeOut", 
            delay: Math.random() * 2 
          }}
          className="absolute w-2 h-2 rounded-sm shadow-sm"
          style={{ 
            backgroundColor: ['#10b981', '#34d399', '#059669', '#3b82f6', '#8b5cf6'][Math.floor(Math.random() * 5)] 
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(Confetti);
