import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo1 from '../../../imports/image-1.webp';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash screen for 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for fade out animation to finish before unmounting completely
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #061912 0%, #0A3320 50%, #082819 100%)' }}
        >
          {/* Subtle animated background elements */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1] 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full blur-[100px]"
            style={{ background: 'radial-gradient(circle, rgba(232,82,26,0.15) 0%, transparent 70%)' }}
          />

          <div className="relative flex items-center justify-center">
            {/* Outer animated rings */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{ rotate: { duration: 12, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border-[1px]"
              style={{ borderColor: 'rgba(232,82,26,0.3)', borderStyle: 'dashed' }}
            />
            <motion.div
              animate={{ rotate: -360, scale: [1, 1.02, 1] }}
              transition={{ rotate: { duration: 18, repeat: Infinity, ease: "linear" }, scale: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full border-[1px]"
              style={{ borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dotted' }}
            />

            {/* Glowing spinning circle */}
            <svg className="absolute w-44 h-44 sm:w-52 sm:h-52 animate-spin" viewBox="0 0 100 100" style={{ animationDuration: '2.5s' }}>
              <defs>
                <linearGradient id="spinnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8521A" stopOpacity="1" />
                  <stop offset="100%" stopColor="#E8521A" stopOpacity="0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <circle
                cx="50" cy="50" r="48"
                fill="none"
                stroke="url(#spinnerGrad)"
                strokeWidth="1.5"
                strokeDasharray="90 200"
                strokeLinecap="round"
                filter="url(#glow)"
              />
            </svg>

            {/* Center Logo */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center"
            >
              <motion.img 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                src={logo1} 
                alt="YCN Logo" 
                className="w-full h-full object-contain drop-shadow-2xl" 
              />
            </motion.div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
