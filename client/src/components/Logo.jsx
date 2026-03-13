import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const sizes = {
    sm: { icon: 20, text: 'text-lg' },
    md: { icon: 28, text: 'text-xl' },
    lg: { icon: 36, text: 'text-2xl' },
    xl: { icon: 48, text: 'text-3xl' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <Brain size={currentSize.icon} className="text-emerald-600" />
        </motion.div>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles size={currentSize.icon * 0.4} className="text-emerald-400" />
        </motion.div>
      </motion.div>
      
      {showText && (
        <motion.span
          className={`font-black tracking-tight ${currentSize.text} text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-slate-800`}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          IntelliHire
        </motion.span>
      )}
    </div>
  );
};

export default Logo;