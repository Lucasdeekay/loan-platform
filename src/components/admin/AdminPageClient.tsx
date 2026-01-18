"use client";

import { useState, useEffect, useCallback } from "react";
import LoadingLink from "@/components/ui/LoadingLink";
import LogoutButton from "@/components/ui/LogoutButton";
import LoanActionsClient from "@/components/admin/LoanActionsClient";

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
  };
}

interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  repaid: number;
  totalDisbursed: number;
}

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header skeleton */}
        <div className="bg-white shadow-sm border-b border-gray-200 mb-8 rounded-lg p-6">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-card p-6 border border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border-b border-gray-100 py-4">
                <div className="flex items-center gap-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPageClient() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    repaid: 0,
    totalDisbursed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchLoans = useCallback(async (page = 1, search = "", status = "") => {
    try {
      setError(null);
      if (page === 1) setLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (search) params.append("search", search);
      if (status) params.append("status", status);

      const response = await fetch(`/api/admin/loans?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch loans: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        if (page === 1) {
          setLoans(data.loans);
        } else {
          setLoans(prev => [...prev, ...data.loans]);
        }
        
        setStats(data.stats);
        setPagination(data.pagination);
      } else {
        setError(data.error || "Failed to load data");
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
      setError(error instanceof Error ? error.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, [pagination.limit]);

  useEffect(() => {
    // Start loading immediately
    fetchLoans(1, searchTerm, statusFilter);
  }, [fetchLoans, searchTerm, statusFilter]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Data</h1>
          <p className="text-gray-600 mb-6 text-sm">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => fetchLoans(1, searchTerm, statusFilter)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="REPAID">Repaid</option>
            </select>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Loan Applications
              </h2>
              <p className="text-sm text-gray-600">
                Showing {loans.length} of {pagination.total} applications
              </p>
            </div>
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
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-12 h-12 text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>No loan applications yet</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  loans.map((loan) => (
                    <tr
                      key={loan.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
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
                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
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
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchLoans(Math.max(1, pagination.page - 1), searchTerm, statusFilter)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchLoans(Math.min(pagination.totalPages, pagination.page + 1), searchTerm, statusFilter)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}