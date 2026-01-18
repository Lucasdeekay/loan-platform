import { redirect } from "next/navigation";
import { logout } from "@/lib/actions/logout";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import LoanSummary from "@/components/dashboard/LoanSummary";
import WalletCard from "@/components/dashboard/WalletCard";
import RepaymentTable from "@/components/dashboard/RepaymentTable";
import Link from "next/link";
import LoadingLink from "@/components/ui/LoadingLink";
import LogoutButton from "@/components/ui/LogoutButton";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  // Fetch user data with loans, wallet, and transactions
  const userData = await db.user.findUnique({
    where: { id: user.userId },
    include: {
      loans: {
        orderBy: { createdAt: "desc" },
        include: {
          repayments: {
            orderBy: { createdAt: "desc" },
          },
        },
      },
      wallet: true,
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!userData) {
    redirect("/login");
  }

  const activeLoan =
    userData.loans.find(
      (loan) => loan.status === "APPROVED" || loan.status === "PENDING",
    ) || null;

  const hasApplicationInProgress =
    !userData.applicationComplete && userData.currentStep > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {userData.fullName || "User"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <LoadingLink
                href="/"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Home
              </LoadingLink>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Application in Progress Alert */}
        {hasApplicationInProgress && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">
                  Application In Progress
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  You have an incomplete loan application. Continue where you
                  left off.
                </p>
                <Link
                  href="/apply"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Continue Application
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* No Loan State */}
        {!activeLoan && !hasApplicationInProgress && (
          <div className="mb-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Active Loan
            </h3>
            <p className="text-gray-600 mb-6">
              You don't have any active loans. Apply now to get funds quickly
              and securely.
            </p>
            <Link
              href="/apply"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition transform hover:scale-105"
            >
              Apply for Loan
            </Link>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Loan Summary */}
          {activeLoan && (
            <div className="lg:col-span-2">
              <LoanSummary loan={activeLoan} />
            </div>
          )}

          {/* Wallet Card */}
          <div className={activeLoan ? "" : "lg:col-span-3"}>
            <WalletCard wallet={userData.wallet} />
          </div>
        </div>

        {/* Repayment History */}
        {activeLoan && activeLoan.repayments.length > 0 && (
          <div className="mb-8">
            <RepaymentTable repayments={activeLoan.repayments} />
          </div>
        )}

        {/* Transaction History */}
        {userData.transactions.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent Transactions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userData.transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === "DEPOSIT"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                        ₦{transaction.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === "SUCCESS"
                              ? "bg-success/10 text-success"
                              : transaction.status === "PENDING"
                                ? "bg-warning/10 text-warning"
                                : "bg-danger/10 text-danger"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-mono">
                        {transaction.reference.slice(0, 12)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
