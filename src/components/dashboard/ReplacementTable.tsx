interface Repayment {
  id: string;
  amount: number;
  transactionRef: string;
  status: string;
  createdAt: Date;
}

interface RepaymentTableProps {
  repayments: Repayment[];
}

export default function RepaymentTable({ repayments }: RepaymentTableProps) {
  if (!repayments || repayments.length === 0) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-success/10 text-success";
      case "PENDING":
        return "bg-warning/10 text-warning";
      case "FAILED":
        return "bg-danger/10 text-danger";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPaid = repayments
    .filter((r) => r.status === "COMPLETED")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Repayment History</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total Paid:{" "}
            <span className="font-bold text-success">
              ₦{totalPaid.toLocaleString()}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-primary-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">
            {repayments.length} Transaction{repayments.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Date
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
            {repayments.map((repayment) => (
              <tr
                key={repayment.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="py-4 px-4 text-sm text-gray-900">
                  {new Date(repayment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="py-4 px-4 text-sm font-bold text-gray-900">
                  ₦{repayment.amount.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      repayment.status
                    )}`}
                  >
                    {repayment.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 font-mono">
                  {repayment.transactionRef.slice(0, 16)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {repayments.map((repayment) => (
          <div
            key={repayment.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Amount</p>
                <p className="text-lg font-bold text-gray-900">
                  ₦{repayment.amount.toLocaleString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  repayment.status
                )}`}
              >
                {repayment.status}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-900 font-medium">
                  {new Date(repayment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div>
                <span className="text-gray-600 text-xs">Reference:</span>
                <p className="text-gray-900 font-mono text-xs mt-1 break-all">
                  {repayment.transactionRef}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
