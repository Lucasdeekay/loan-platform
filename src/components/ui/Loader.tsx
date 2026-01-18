"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="relative flex flex-col items-center"
      >
        {/* Animated Gradient Rings */}
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />

          {/* Main Spinner Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-l-blue-400 animate-spin [animation-duration:1s]" />

          {/* Counter-Rotating Ring */}
          <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-indigo-500 border-r-indigo-300 animate-spin-reverse [animation-duration:2s]" />

          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl flex items-center justify-center"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Text Section */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Securing Connection
          </h3>
          <p className="text-slate-500 font-medium">
            Verifying your details...
          </p>
        </div>

        {/* Modern Shimmer Progress Bar */}
        <div className="mt-8 w-40 h-1 bg-slate-100 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
