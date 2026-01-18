import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";
import LoadingLink from "@/components/ui/LoadingLink";
import LogoutButton from "@/components/ui/LogoutButton";
import LoanActionsClient from "@/components/admin/LoanActionsClient";

export default async function AdminPage() {
  // Check if user is admin
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all loans with user details
  const loans = await db.loan.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
        },
      },
      identityVerification: true,
      guarantor: true,
      bankDetails: true,
    },
  });

  // Statistics
  const stats = {
    total: loans.length,
    pending: loans.filter((l) => l.status === "PENDING").length,
    approved: loans.filter((l) => l.status === "APPROVED").length,
    rejected: loans.filter((l) => l.status === "REJECTED").length,
    repaid: loans.filter((l) => l.status === "REPAID").length,
    totalDisbursed: loans
      .filter((l) => l.status === "APPROVED" || l.status === "REPAID")
      .reduce((sum, l) => sum + l.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Manage loan applications</p>
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
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-card p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-yellow-50 rounded-lg shadow-card p-6 border border-yellow-200">
            <p className="text-sm text-yellow-700 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-900">
              {stats.pending}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg shadow-card p-6 border border-green-200">
            <p className="text-sm text-green-700 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-900">
              {stats.approved}
            </p>
          </div>

          <div className="bg-red-50 rounded-lg shadow-card p-6 border border-red-200">
            <p className="text-sm text-red-700 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-900">{stats.rejected}</p>
          </div>

          <div className="bg-blue-50 rounded-lg shadow-card p-6 border border-blue-200">
            <p className="text-sm text-blue-700 mb-1">Total Disbursed</p>
            <p className="text-2xl font-bold text-blue-900">
              ₦{stats.totalDisbursed.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Loan Applications
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Applicant
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Applied
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No loan applications yet
                    </td>
                  </tr>
                ) : (
                  loans.map((loan) => (
                    <tr
                      key={loan.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {loan.user.fullName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {loan.user.email}
                          </p>
                          <p className="text-xs text-gray-600">
                            {loan.user.phone}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-bold text-gray-900">
                          ₦{loan.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          Interest: {loan.interestRate}%
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            loan.status === "PENDING"
                              ? "bg-warning/10 text-warning"
                              : loan.status === "APPROVED"
                                ? "bg-success/10 text-success"
                                : loan.status === "REJECTED"
                                  ? "bg-danger/10 text-danger"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(loan.applicationDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <LoanActionsClient loan={loan} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
