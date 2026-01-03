interface Loan {
  id: string
  amount: number
  interestRate: number
  totalRepayment: number
  status: string
  applicationDate: Date
  approvalDate?: Date | null
  dueDate?: Date | null
}

interface LoanSummaryProps {
  loan: Loan
}

export default function LoanSummary({ loan }: LoanSummaryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-success/10 text-success border-success/20'
      case 'PENDING':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'REJECTED':
        return 'bg-danger/10 text-danger border-danger/20'
      case 'REPAID':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'PENDING':
        return (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )
      case 'REJECTED':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      case 'REPAID':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      default:
        return null
    }
  }

  const daysUntilDue = loan.dueDate 
    ? Math.ceil((new Date(loan.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Loan Summary</h2>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border font-semibold ${getStatusColor(loan.status)}`}>
          {getStatusIcon(loan.status)}
          <span className="text-sm">{loan.status}</span>
        </div>
      </div>

      {/* Loan Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Loan Amount */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200">
          <div className="flex items-center gap-2 text-primary-600 mb-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Loan Amount</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₦{loan.amount.toLocaleString()}</p>
        </div>

        {/* Interest Rate */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Interest Rate</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{loan.interestRate}%</p>
        </div>

        {/* Total Repayment */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Total Repayment</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₦{loan.totalRepayment.toLocaleString()}</p>
        </div>

        {/* Due Date */}
        {loan.dueDate && (
          <div className={`rounded-lg p-4 border ${
            daysUntilDue && daysUntilDue < 7
              ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
              : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
          }`}>
            <div className={`flex items-center gap-2 mb-1 ${
              daysUntilDue && daysUntilDue < 7 ? 'text-red-600' : 'text-blue-600'
            }`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Due Date</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {new Date(loan.dueDate).toLocaleDateString()}
            </p>
            {daysUntilDue !== null && (
              <p className={`text-sm mt-1 ${
                daysUntilDue < 7 ? 'text-red-600 font-semibold' : 'text-blue-600'
              }`}>
                {daysUntilDue > 0 ? `${daysUntilDue} days remaining` : 'Overdue'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 font-medium">Application Date:</span>
            <p className="text-gray-900">{new Date(loan.applicationDate).toLocaleDateString()}</p>
          </div>
          {loan.approvalDate && (
            <div>
              <span className="text-gray-600 font-medium">Approval Date:</span>
              <p className="text-gray-900">{new Date(loan.approvalDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action based on status */}
      {loan.status === 'PENDING' && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Under Review</p>
              <p>Your loan application is being reviewed. We'll notify you once a decision is made.</p>
            </div>
          </div>
        </div>
      )}

      {loan.status === 'APPROVED' && (
        <div className="mt-6">
          <a
            href="#repayment"
            className="block w-full bg-success text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-success/90 transition"
          >
            Make Repayment
          </a>
        </div>
      )}
    </div>
  )
}