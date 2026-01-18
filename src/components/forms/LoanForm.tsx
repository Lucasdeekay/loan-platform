"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PersonalInfo from "./steps/PersonalInfo";
import IdentityVerification from "./steps/IdentityVerification";
import GuarantorInfo from "./steps/GuarantorInfo";
import BankDetails from "./steps/BankDetails";
import ReviewSubmit from "./steps/ReviewSubmit";
import { useLoading } from "@/contexts/LoadingContext";

interface LoanFormProps {
  userId: string;
  currentStep: number;
  existingLoan: any;
}

export default function LoanForm({
  userId,
  currentStep,
  existingLoan,
}: LoanFormProps) {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();
  const [step, setStep] = useState(currentStep);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStepComplete = async (nextStep: number) => {
    setStep(nextStep);
    // Update user's current step in database
    await fetch("/api/user/update-step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: nextStep }),
    });
    router.refresh();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinalSubmit = async () => {
    startLoading();
    setIsSubmitting(true);
    try {
      // Mark application as complete
      await fetch("/api/user/complete-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // Redirect to dashboard
      router.push("/dashboard?application=submitted");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
      stopLoading();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
      {/* Step Content */}
      <div className="min-h-[500px]">
        {step === 1 && (
          <PersonalInfo userId={userId} onNext={() => handleStepComplete(2)} />
        )}

        {step === 2 && (
          <IdentityVerification
            userId={userId}
            loanId={existingLoan?.id}
            onNext={() => handleStepComplete(3)}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <GuarantorInfo
            userId={userId}
            loanId={existingLoan?.id}
            onNext={() => handleStepComplete(4)}
            onBack={handleBack}
          />
        )}

        {step === 4 && (
          <BankDetails
            userId={userId}
            loanId={existingLoan?.id}
            onNext={() => handleStepComplete(5)}
            onBack={handleBack}
          />
        )}

        {step === 5 && (
          <ReviewSubmit
            userId={userId}
            loanId={existingLoan?.id}
            onBack={handleBack}
            onSubmit={handleFinalSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h4 className="font-semibold text-primary-900 mb-1">Need Help?</h4>
            <p className="text-sm text-primary-700">
              Your progress is automatically saved. You can logout and resume
              your application anytime. If you have questions, contact our
              support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
