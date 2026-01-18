"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoading } from "@/contexts/LoadingContext";

const bankDetailsSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z
    .string()
    .length(10, "Account number must be exactly 10 digits"),
  accountName: z.string().min(2, "Account name is required"),
});

type BankDetailsFormData = z.infer<typeof bankDetailsSchema>;

interface BankDetailsProps {
  userId: string;
  loanId?: string;
  onNext: () => void;
  onBack: () => void;
}

export default function BankDetails({
  userId,
  loanId,
  onNext,
  onBack,
}: BankDetailsProps) {
  const { startLoading, stopLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankDetailsFormData>({
    resolver: zodResolver(bankDetailsSchema),
  });

  const nigerianBanks = [
    "Access Bank",
    "Citibank Nigeria",
    "Ecobank Nigeria",
    "Fidelity Bank",
    "First Bank of Nigeria",
    "First City Monument Bank (FCMB)",
    "Globus Bank",
    "Guaranty Trust Bank (GTBank)",
    "Heritage Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Providus Bank",
    "Stanbic IBTC Bank",
    "Standard Chartered Bank",
    "Sterling Bank",
    "SunTrust Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa (UBA)",
    "Unity Bank",
    "Wema Bank",
    "Zenith Bank",
  ];

  const onSubmit = async (data: BankDetailsFormData) => {
    startLoading();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/loan/bank-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userId,
          loanId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save bank details");
      }

      onNext();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bank Details</h2>
        <p className="text-gray-600">
          Provide your bank account information for loan disbursement
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bank Name */}
        <div>
          <label
            htmlFor="bankName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Bank Name <span className="text-danger">*</span>
          </label>
          <select
            {...register("bankName")}
            id="bankName"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select your bank</option>
            {nigerianBanks.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
          {errors.bankName && (
            <p className="mt-1 text-sm text-danger">
              {errors.bankName.message}
            </p>
          )}
        </div>

        {/* Account Number */}
        <div>
          <label
            htmlFor="accountNumber"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Account Number <span className="text-danger">*</span>
          </label>
          <input
            {...register("accountNumber")}
            type="text"
            id="accountNumber"
            maxLength={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter 10-digit account number"
          />
          {errors.accountNumber && (
            <p className="mt-1 text-sm text-danger">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        {/* Account Name */}
        <div>
          <label
            htmlFor="accountName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Account Name <span className="text-danger">*</span>
          </label>
          <input
            {...register("accountName")}
            type="text"
            id="accountName"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter account name as it appears on your bank"
          />
          {errors.accountName && (
            <p className="mt-1 text-sm text-danger">
              {errors.accountName.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Enter your name exactly as it appears on your bank account
          </p>
        </div>

        {/* Security Notice */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-1">Secure Information</p>
              <p>
                Your bank details are encrypted and will only be used for loan
                disbursement. We never share your financial information with
                third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Info Notice */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
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
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Important</p>
              <p>
                Once approved, your loan will be disbursed directly to this
                account. Please ensure all details are correct.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}
