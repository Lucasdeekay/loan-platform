interface Wallet {
  id: string;
  accountNumber: string | null;
  accountName: string | null;
  bankName: string | null;
  accountReference: string | null;
  balance: number;
}

interface WalletCardProps {
  wallet: Wallet | null;
}

export default function WalletCard({ wallet }: WalletCardProps) {
  if (!wallet) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Wallet</h2>
        <p className="text-gray-600">
          No wallet found. Please contact support.
        </p>
      </div>
    );
  }

  const hasVirtualAccount = wallet.accountNumber && wallet.bankName;

  return (
    <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-primary-100">My Wallet</h2>
          <svg
            className="w-8 h-8 text-primary-200"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path
              fillRule="evenodd"
              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Balance */}
        <div className="mb-1">
          <p className="text-sm text-primary-100 mb-1">Available Balance</p>
          <p className="text-4xl font-bold">
            ₦{wallet.balance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Virtual Account Details */}
      {hasVirtualAccount ? (
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <p className="text-xs text-primary-100 mb-3 font-semibold">
            Paystack Virtual Account
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-primary-200 mb-1">Bank Name</p>
              <p className="font-semibold text-sm">{wallet.bankName}</p>
            </div>

            <div>
              <p className="text-xs text-primary-200 mb-1">Account Number</p>
              <p className="font-bold text-lg tracking-wider">
                {wallet.accountNumber}
              </p>
            </div>

            <div>
              <p className="text-xs text-primary-200 mb-1">Account Name</p>
              <p className="font-semibold text-sm">{wallet.accountName}</p>
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-primary-200 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-primary-100">
                Transfer to this account to fund your wallet or make loan
                repayments
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold text-sm mb-1">
                Virtual Account Pending
              </p>
              <p className="text-xs text-primary-100">
                Your Paystack virtual account is being created. This usually
                takes a few minutes. Refresh the page to check status.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Copy Account Number Button */}
      {hasVirtualAccount && (
        <div className="relative z-10 mt-4">
          <button
            onClick={() => {
              if (wallet.accountNumber) {
                navigator.clipboard.writeText(wallet.accountNumber);
                alert("Account number copied to clipboard!");
              }
            }}
            className="w-full bg-white text-primary-700 px-4 py-2 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            Copy Account Number
          </button>
        </div>
      )}
    </div>
  );
}
