"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LogoutButton from "@/components/ui/LogoutButton";
import LoanActions from "@/components/admin/LoanActions";
import Loader from "@/components/ui/Loader";

interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  totalRepayment: number;
  status: string;
  applicationDate: string;
  approvalDate?: string;
  dueDate?: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    address?: string;
  };
  identityVerification?: {
    bvn: string;
    nin: string;
    facePhotoUrl: string;
    passportUrl?: string;
  };
  guarantor?: {
    fullName: string;
    phone: string;
    address: string;
    relationship: string;
    photoUrl: string;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  repayments: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function AdminLoanDetailClient({ params }: PageProps) {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoan();
  }, [params.id]);

  const fetchLoan = async () => {
    try {
      const response = await fetch(`/api/admin/loans?loanId=${params.id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch loan details");
      }

      const data = await response.json();
      
      if (data.success) {
        setLoan(data.loan);
      } else {
        setError(data.error || "Failed to load loan details");
      }
    } catch (error) {
      console.error("Error fetching loan:", error);
      setError("Failed to load loan details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/admin"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={fetchLoan}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Loan Not Found
          </h1>
          <Link
            href="/admin"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const totalRepaid = loan.repayments
    .filter((r) => r.status === "COMPLETED")
    .reduce((sum, r) => sum + r.amount, 0);

  const remainingBalance = loan.totalRepayment - totalRepaid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/admin"
                className="text-primary-600 hover:text-primary-700 font-semibold mb-2 inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Admin Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Loan Application Details
              </h1>
              <p className="text-gray-600">Application ID: {loan.id}</p>
            </div>
            <div className="flex items-center gap-4">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status and Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Status</p>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold inline-block ${
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
              </div>

              {loan.status === "APPROVED" && (
                <div className="ml-8">
                  <p className="text-sm text-gray-600 mb-1">
                    Repayment Progress
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-48 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-success rounded-full h-3 transition-all"
                        style={{
                          width: `${
                            (totalRepaid / loan.totalRepayment) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {((totalRepaid / loan.totalRepayment) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {loan.status === "PENDING" && (
              <div className="flex items-center gap-3">
                <LoanActionsClient loan={loan} />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Applicant Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="font-semibold text-gray-900">
                    {loan.user.fullName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">
                    {loan.user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-semibold text-gray-900">
                    {loan.user.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                  <p className="font-semibold text-gray-900">
                    {loan.user.dateOfBirth
                      ? new Date(loan.user.dateOfBirth).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="font-semibold text-gray-900">
                    {loan.user.address || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Identity Verification */}
            {loan.identityVerification && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-primary-600"
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
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">BVN</p>
                    <p className="font-semibold text-gray-900 font-mono">
                      {loan.identityVerification.bvn}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">NIN</p>
                    <p className="font-semibold text-gray-900 font-mono">
                      {loan.identityVerification.nin}
                    </p>
                  </div>
                </div>

                {/* Photos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-semibold">
                      Face Photo
                    </p>
                    <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={loan.identityVerification.facePhotoUrl}
                        alt="Face Photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {loan.identityVerification.passportUrl && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2 font-semibold">
                        Passport Photo
                      </p>
                      <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={loan.identityVerification.passportUrl}
                          alt="Passport Photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Guarantor Information */}
            {loan.guarantor && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Guarantor Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900">
                      {loan.guarantor.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">
                      {loan.guarantor.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Relationship</p>
                    <p className="font-semibold text-gray-900">
                      {loan.guarantor.relationship}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="font-semibold text-gray-900">
                      {loan.guarantor.address}
                    </p>
                  </div>
                </div>

                {/* Guarantor Photo */}
                <div>
                  <p className="text-sm text-gray-600 mb-2 font-semibold">
                    Guarantor Photo
                  </p>
                  <div className="relative w-full max-w-sm aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={loan.guarantor.photoUrl}
                      alt="Guarantor Photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bank Details */}
            {loan.bankDetails && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-primary-600"
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
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bank Name</p>
                    <p className="font-semibold text-gray-900">
                      {loan.bankDetails.bankName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Account Number</p>
                    <p className="font-semibold text-gray-900 font-mono">
                      {loan.bankDetails.accountNumber}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Account Name</p>
                    <p className="font-semibold text-gray-900">
                      {loan.bankDetails.accountName}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Loan Summary & Repayments */}
          <div className="space-y-6">
            {/* Loan Summary */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-bold mb-4">Loan Summary</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-primary-100 text-sm mb-1">Loan Amount</p>
                  <p className="text-3xl font-bold">
                    ₦{loan.amount.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-primary-100 text-sm mb-1">
                      Interest Rate
                    </p>
                    <p className="text-xl font-bold">{loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-primary-100 text-sm mb-1">
                      Interest Amount
                    </p>
                    <p className="text-xl font-bold">
                      ₦{(loan.totalRepayment - loan.amount).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-primary-400">
                  <p className="text-primary-100 text-sm mb-1">
                    Total Repayment
                  </p>
                  <p className="text-3xl font-bold">
                    ₦{loan.totalRepayment.toLocaleString()}
                  </p>
                </div>

                {loan.status === "APPROVED" && (
                  <>
                    <div className="pt-4 border-t border-primary-400">
                      <p className="text-primary-100 text-sm mb-1">
                        Amount Paid
                      </p>
                      <p className="text-2xl font-bold text-success">
                        ₦{totalRepaid.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-primary-100 text-sm mb-1">
                        Remaining Balance
                      </p>
                      <p className="text-2xl font-bold text-warning">
                        ₦{remainingBalance.toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-primary-400 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-100">Applied:</span>
                  <span className="font-semibold">
                    {new Date(loan.applicationDate).toLocaleDateString()}
                  </span>
                </div>
                {loan.approvalDate && (
                  <div className="flex justify-between">
                    <span className="text-primary-100">Approved:</span>
                    <span className="font-semibold">
                      {new Date(loan.approvalDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {loan.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-primary-100">Due Date:</span>
                    <span className="font-semibold">
                      {new Date(loan.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Repayment History */}
            {loan.repayments.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Repayment History
                </h2>
                <div className="space-y-3">
                  {loan.repayments.map((repayment) => (
                    <div
                      key={repayment.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          ₦{repayment.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(repayment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          repayment.status === "COMPLETED"
                            ? "bg-success/10 text-success"
                            : repayment.status === "PENDING"
                              ? "bg-warning/10 text-warning"
                              : "bg-danger/10 text-danger"
                        }`}
                      >
                        {repayment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}