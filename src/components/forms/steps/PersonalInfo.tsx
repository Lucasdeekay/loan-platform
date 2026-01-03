"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(10, "Please provide a complete address"),
  loanAmount: z.string().refine((val) => {
    const num = parseFloat(val);
    return num >= 10000 && num <= 5000000;
  }, "Loan amount must be between ₦10,000 and ₦5,000,000"),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

interface PersonalInfoProps {
  userId: string;
  onNext: () => void;
}

export default function PersonalInfo({ userId, onNext }: PersonalInfoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/loan/personal-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userId,
          loanAmount: parseFloat(data.loanAmount),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save personal information");
      }

      onNext();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600">
          Please provide your personal details to continue
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Full Name <span className="text-danger">*</span>
          </label>
          <input
            {...register("fullName")}
            type="text"
            id="fullName"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-danger">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Email Address <span className="text-danger">*</span>
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-danger">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Phone Number <span className="text-danger">*</span>
          </label>
          <input
            {...register("phone")}
            type="tel"
            id="phone"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="+234 800 000 0000"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-danger">{errors.phone.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Date of Birth <span className="text-danger">*</span>
          </label>
          <input
            {...register("dateOfBirth")}
            type="date"
            id="dateOfBirth"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-danger">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Residential Address <span className="text-danger">*</span>
          </label>
          <textarea
            {...register("address")}
            id="address"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter your complete residential address"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-danger">{errors.address.message}</p>
          )}
        </div>

        {/* Loan Amount */}
        <div>
          <label
            htmlFor="loanAmount"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Loan Amount (₦) <span className="text-danger">*</span>
          </label>
          <input
            {...register("loanAmount")}
            type="number"
            id="loanAmount"
            step="1000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., 100000"
          />
          {errors.loanAmount && (
            <p className="mt-1 text-sm text-danger">
              {errors.loanAmount.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Minimum: ₦10,000 | Maximum: ₦5,000,000
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
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
