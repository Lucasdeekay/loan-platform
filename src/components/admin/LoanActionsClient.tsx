"use client";

import { useRouter } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import { approveLoan, rejectLoan } from "@/lib/actions/loanActions";
import LoadingLink from "../ui/LoadingLink";

interface LoanActionsClientProps {
  loan: {
    id: string;
    status: string;
  };
}

export default function LoanActionsClient({ loan }: LoanActionsClientProps) {
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

  return (
    <div className="flex items-center gap-2">
      {loan.status === "PENDING" && (
        <>
          <button
            onClick={handleApprove}
            className="bg-success text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-success/90 transition"
          >
            Approve
          </button>

          <button
            onClick={handleReject}
            className="bg-danger text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-danger/90 transition"
          >
            Reject
          </button>
        </>
      )}

      <LoadingLink
        href={`/admin/loans/${loan.id}`}
        className="bg-primary-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-primary-700 transition"
      >
        View Details
      </LoadingLink>
    </div>
  );
}
