"use client";

import { useState, useEffect } from "react";

interface ReviewSubmitProps {
  userId: string;
  loanId?: string;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

interface ApplicationData {
  user: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    address: string;
  };
  loan: {
    amount: number;
    interestRate: number;
    totalRepayment: number;
  };
  identity: {
    bvn: string;
    nin: string;
    facePhotoUrl: string;
    passportUrl?: string;
  };
  guarantor: {
    fullName: string;
    phone: string;
    address: string;
    relationship: string;
    photoUrl: string;
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export default function ReviewSubmit({
  userId,
  loanId,
  onBack,
  onSubmit,
  isSubmitting,
}: ReviewSubmitProps) {
  const [data, setData] = useState<ApplicationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplicationData();
  }, []);

  const fetchApplicationData = async () => {
    try {
      const response = await fetch(
        `/api/loan/review?userId=${userId}&loanId=${loanId}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch application data");
      }

      setData(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-danger/10 border border-danger/20 rounded-lg text-danger">
        {error || "Failed to load application data"}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review & Submit
        </h2>
        <p className="text-gray-600">
          Please review your application before submitting
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-primary-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 font-medium">Full Name:</span>
              <p className="text-gray-900">{data.user.fullName}</p>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Email:</span>
              <p className="text-gray-900">{data.user.email}</p>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Phone:</span>
              <p className="text-gray-900">{data.user.phone}</p>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Date of Birth:</span>
              <p className="text-gray-900">
                {new Date(data.user.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-600 font-medium">Address:</span>
              <p className="text-gray-900">{data.user.address}</p>
            </div>
          </div>
        </div>

        {/* Loan Details */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-primary-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                clipRule="evenodd"
              />
            </svg>
            Loan Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 font-medium">Loan Amount:</span>
              <p className="text-gray-900 text-xl font-bold text-primary-600">
                ₦{data.loan.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Interest Rate:</span>
              <p className="text-gray-900 text-xl font-bold">
                {data.loan.interestRate}%
              </p>
            </div>
            <div>
              <span className="text-gray-600 font-medium">
                Total Repayment:
              </span>
              <p className="text-gray-900 text-xl font-bold text-success">
                ₦{data.loan.totalRepayment.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Identity Verification */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-primary-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Identity Verification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 font-medium">BVN:</span>
              <p className="text-gray-900">
                ****** {data.identity.bvn.slice(-4)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 font-medium">NIN:</span>
              <p className="text-gray-900">
                ****** {data.identity.nin.slice(-4)}
              </p>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Face Photo:</span>
              <p className="text-success flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Uploaded
              </p>
            </div>
            {data.identity.passportUrl && (
              <div>
                <span className="text-gray-600 font-medium">
                  Passport Photo:
                </span>
                <p className="text-success flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Uploaded
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Guarantor Information */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-primary-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            Guarantor Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 font-medium">Full Name:</span>
              <p className="text-gray-900">{data.guarantor.fullName}</p>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Phone:</span>
              <p className="text-gray-900">{data.guarantor.phone}</p>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Relationship:</span>
              <p className="text-gray-900">{data.guarantor.relationship}</p>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Photo:</span>
              <p className="text-success flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Uploaded
              </p>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-600 font-medium">Address:</span>
              <p className="text-gray-900">{data.guarantor.address}</p>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-primary-600"
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
            Bank Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 font-medium">Bank Name:</span>
              <p className="text-gray-900">{data.bankDetails.bankName}</p>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Account Number:</span>
              <p className="text-gray-900">{data.bankDetails.accountNumber}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-600 font-medium">Account Name:</span>
              <p className="text-gray-900">{data.bankDetails.accountName}</p>
            </div>
          </div>
        </div>

        {/* Confirmation */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Please Confirm</p>
              <p>
                By submitting this application, you confirm that all information
                provided is accurate and complete. False information may result
                in application rejection.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-success text-white px-8 py-3 rounded-lg font-semibold hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Submit Application
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
