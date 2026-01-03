import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>

          <p className="text-lg sm:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have received fast and
            reliable loans. Apply now and get approved within 24 hours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/register"
              className="inline-block bg-white text-primary-700 px-10 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-all transform hover:scale-105 shadow-xl"
            >
              Start Application
            </Link>

            <Link
              href="/login"
              className="inline-block bg-transparent text-white px-10 py-4 rounded-lg font-bold text-lg border-2 border-white hover:bg-white hover:text-primary-700 transition-all"
            >
              Login to Dashboard
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-primary-100">Happy Customers</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">₦500M+</div>
              <div className="text-primary-100">Loans Disbursed</div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-primary-100">Approval Rate</div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-primary-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Bank-Level Security</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Licensed & Regulated</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
