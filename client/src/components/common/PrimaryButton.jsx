import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Loader2, Sparkles } from "lucide-react";

const PrimaryButton = ({ 
    onClick, 
    disabled, 
    isLoading, 
    loadingMessages = ["Preparing Environment...", "Gathering AI Context...", "Optimizing Session..."],
    children, 
    className = "" 
}) => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        let interval;
        if (isLoading) {
            interval = setInterval(() => {
                setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
            }, 2500);
        } else {
            setMessageIndex(0);
        }
        return () => clearInterval(interval);
    }, [isLoading, loadingMessages]);

    return (
        <motion.button
            disabled={disabled || isLoading}
            onClick={onClick}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className={`relative w-full overflow-hidden group py-5 rounded-[1.5rem] bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-extrabold shadow-xl shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ${className}`}
        >
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative z-10 flex items-center justify-center gap-3"
                    >
                        <Loader2 size={24} className="animate-spin text-emerald-200" />
                        <motion.span
                            key={messageIndex}
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            className="text-emerald-50"
                        >
                            {loadingMessages[messageIndex]}
                        </motion.span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative z-10 flex items-center justify-center gap-3"
                    >
                        <PlayCircle size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Animated Sparkles for premium feel during idle */}
            {!isLoading && (
                <div className="absolute top-0 right-4 h-full flex items-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Sparkles size={16} className="text-emerald-300 animate-pulse" />
                </div>
            )}
        </motion.button>
    );
};

export default PrimaryButton;
