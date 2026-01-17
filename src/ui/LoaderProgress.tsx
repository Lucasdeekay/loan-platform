"use client";

import { useEffect, useState } from "react";

export default function LoaderProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-600/95 to-primary-900/95 backdrop-blur-sm">
      <div className="text-center text-white w-full max-w-md px-8">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <h3 className="text-2xl font-bold mb-2">Processing Request</h3>
          <p className="text-primary-100">Please wait...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-primary-100 mt-2">{progress}%</p>
      </div>
    </div>
  );
}
