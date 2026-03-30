import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full flex items-center px-1 focus:outline-none ${className}`}
      style={{
        background: isDark
          ? 'rgba(220,38,38,0.15)'
          : 'rgba(109,40,217,0.12)',
        border: isDark
          ? '1px solid rgba(220,38,38,0.25)'
          : '1px solid rgba(109,40,217,0.20)',
      }}
      whileTap={{ scale: 0.93 }}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Track glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: isDark
            ? 'rgba(220,38,38,0.08)'
            : 'rgba(109,40,217,0.08)',
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Sliding thumb */}
      <motion.div
        className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center shadow-md"
        animate={{
          x: isDark ? 0 : 28,
          background: isDark
            ? 'linear-gradient(135deg,#dc2626,#9333ea)'
            : 'linear-gradient(135deg,#f59e0b,#f97316)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.svg
              key="moon"
              initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0,   scale: 1 }}
              exit={{    opacity: 0, rotate:  30,  scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              initial={{ opacity: 0, rotate: 30,  scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0,   scale: 1 }}
              exit={{    opacity: 0, rotate: -30,  scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
