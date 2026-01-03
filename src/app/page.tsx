import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Eligibility from "@/components/landing/Eligibility";
import CTA from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Hero />
      <HowItWorks />
      <Eligibility />
      <CTA />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LoanPlatform</h3>
              <p className="text-gray-400">
                Fast, secure, and reliable loan services tailored to your needs.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#eligibility"
                    className="hover:text-white transition"
                  >
                    Eligibility
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-white transition">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/register" className="hover:text-white transition">
                    Register
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@loanplatform.com</li>
                <li>Phone: +234 800 000 0000</li>
                <li>Address: Lagos, Nigeria</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LoanPlatform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
