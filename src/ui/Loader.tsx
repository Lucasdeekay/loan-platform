"use client";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="text-center">
        {/* Animated Logo/Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-4 border-primary-200 rounded-full animate-ping"></div>

          {/* Middle Ring */}
          <div className="absolute inset-2 border-4 border-primary-400 rounded-full animate-spin"></div>

          {/* Inner Ring */}
          <div
            className="absolute inset-4 border-4 border-t-primary-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"
            style={{ animationDuration: "1s" }}
          ></div>

          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary-600 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 animate-pulse">
            Processing...
          </h3>
          <p className="text-sm text-gray-600">
            Please wait while we process your request
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2 mt-4">
          <div
            className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
