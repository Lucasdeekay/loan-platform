"use client";

import { useRouter } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import { approveLoan, rejectLoan } from "@/lib/actions/loanActions";

interface LoanActionsProps {
  loan: {
    id: string;
    status: string;
  };
}

export default function LoanActions({ loan }: LoanActionsProps) {
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const handleApprove = async () => {
    if (!confirm("Are you sure you want to approve this loan?")) {
      return;
    }

    startLoading();

    try {
      const result = await approveLoan(loan.id);

      if (!result.success) {
        throw new Error(result.error || "Failed to approve loan");
      }

      // Small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.refresh();
      stopLoading();
    } catch (error: any) {
      alert(error.message);
      stopLoading();
    }
  };

  const handleReject = async () => {
    if (!confirm("Are you sure you want to reject this loan?")) {
      return;
    }

    startLoading();

    try {
      const result = await rejectLoan(loan.id);

      if (!result.success) {
        throw new Error(result.error || "Failed to reject loan");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      router.refresh();
      stopLoading();
    } catch (error: any) {
      alert(error.message);
      stopLoading();
    }
  };

  if (loan.status !== "PENDING") {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleApprove}
        className="bg-success text-white px-6 py-3 rounded-lg font-semibold hover:bg-success/90 transition flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Approve Loan
      </button>

      <button
        onClick={handleReject}
        className="bg-danger text-white px-6 py-3 rounded-lg font-semibold hover:bg-danger/90 transition flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        Reject Loan
      </button>
    </div>
  );
}