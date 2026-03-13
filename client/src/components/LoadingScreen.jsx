import { motion } from 'framer-motion';
import Logo from './Logo';

const LoadingScreen = ({ message = "Initializing..." }) => {
  return (
    <div className="fixed inset-0 bg-slate-50 z-[100] flex items-center justify-center overflow-hidden">
      {/* Ambient Background - Emerald/Slate Theme */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-50/60 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-100/60 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Pulsing Logo Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 relative"
        >
          {/* Orbital Ring 1 */}
          <motion.div
            className="absolute inset-0 -m-8 border border-emerald-200/50 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full absolute -top-1 left-1/2 -translate-x-1/2 shadow-lg shadow-emerald-500/50" />
          </motion.div>

          {/* Orbital Ring 2 */}
          <motion.div
            className="absolute inset-0 -m-4 border border-teal-200/50 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-2 h-2 bg-teal-400 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 shadow-lg shadow-teal-500/50" />
          </motion.div>

          {/* Logo with specific scale and glow */}
          <div className="relative">
            <motion.div 
              className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <Logo size="xl" className="relative z-10" />
          </div>
        </motion.div>

        {/* Loading Progress Bar */}
        <div className="w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6 relative shadow-inner">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-slate-800"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Loading Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-400 font-medium text-sm tracking-widest uppercase"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingScreen;