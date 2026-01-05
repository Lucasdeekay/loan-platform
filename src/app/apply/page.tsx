import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../../lib/auth";
import db from "@/lib/db";
import LoanForm from "@/components/forms/LoanForm";

export default async function ApplyPage() {
  // Get current user
  const user = await getCurrentUser();

  if (user && user.role === "ADMIN") {
    redirect("/admin");
  }

  if (!user) {
    redirect("/login");
  }

  // Fetch user data to get current step and existing loan
  const userData = await db.user.findUnique({
    where: { id: user.userId },
    include: {
      loans: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          identityVerification: true,
          guarantor: true,
          bankDetails: true,
        },
      },
    },
  });

  if (!userData) {
    redirect("/login");
  }

  // Check if user has a pending or approved loan
  const activeLoan = userData.loans.find(
    (loan) => loan.status === "PENDING" || loan.status === "APPROVED"
  );

  if (activeLoan && userData.applicationComplete) {
    redirect("/dashboard");
  }

  // Get current step and existing loan data
  const currentStep = userData.currentStep;
  const existingLoan = userData.loans[0] || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Loan Application
          </h1>
          <p className="text-lg text-gray-600">
            Complete the following steps to apply for your loan
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                    step < currentStep
                      ? "bg-success text-white"
                      : step === currentStep
                      ? "bg-primary-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {step < currentStep ? (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? "bg-success" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2">
            <span>Personal</span>
            <span>Identity</span>
            <span>Guarantor</span>
            <span>Bank</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Component */}
        <LoanForm
          userId={user.userId}
          currentStep={currentStep}
          existingLoan={existingLoan}
        />
      </div>
    </div>
  );
}
