import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://github.com/Lucasdeekay/loan-platform/blob/main/src/images/hero-bg.jpg"
          alt="Business background"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 via-primary-700/30 to-primary-900/1"></div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10 z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Get Your Loan in
              <span className="block text-primary-200">Minutes, Not Days</span>
            </h1>

            <p className="text-lg sm:text-xl text-primary-100 mb-8 leading-relaxed">
              Fast, secure, and transparent loan processing. Apply online with
              verified documents and get instant decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-block bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-all transform hover:scale-105 shadow-lg text-center"
              >
                Apply Now
              </Link>

              <Link
                href="/login"
                className="inline-block bg-primary-800/80 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-900/80 transition-all border-2 border-white/20 text-center"
              >
                Login
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap gap-8 items-center">
              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary-200"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-primary-100">100% Secure</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary-200"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-primary-100">Quick Approval</span>
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary-200"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-primary-100">No Hidden Fees</span>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-2 gap-4 animate-slide-up">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
              <div className="text-4xl font-bold mb-2">₦5M</div>
              <div className="text-primary-100">Maximum Loan</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
              <div className="text-4xl font-bold mb-2">5%</div>
              <div className="text-primary-100">Interest Rate</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
              <div className="text-4xl font-bold mb-2">24hrs</div>
              <div className="text-primary-100">Approval Time</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-xl">
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-primary-100">Digital Process</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
