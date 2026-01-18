export default function LoaderLogo() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-primary-600 animate-pulse">
            Loan<span className="text-primary-800">Platform</span>
          </h1>
        </div>

        {/* Animated Underline */}
        <div className="w-48 h-1 mx-auto bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 rounded-full">
          <div className="h-full bg-white rounded-full animate-pulse"></div>
        </div>

        <p className="mt-6 text-gray-600 animate-pulse">
          Loading your experience...
        </p>
      </div>
    </div>
  );
}
