"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const guarantorSchema = z.object({
  fullName: z.string().min(2, "Guarantor full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(10, "Please provide a complete address"),
  relationship: z.string().min(2, "Relationship is required"),
});

type GuarantorFormData = z.infer<typeof guarantorSchema>;

interface GuarantorInfoProps {
  userId: string;
  loanId?: string;
  onNext: () => void;
  onBack: () => void;
}

export default function GuarantorInfo({
  userId,
  loanId,
  onNext,
  onBack,
}: GuarantorInfoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [guarantorPhoto, setGuarantorPhoto] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuarantorFormData>({
    resolver: zodResolver(guarantorSchema),
  });

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGuarantorPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: GuarantorFormData) => {
    if (!guarantorPhoto) {
      setError("Please upload guarantor photo");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/loan/guarantor-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userId,
          loanId,
          guarantorPhoto,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save guarantor information");
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
          Guarantor Information
        </h2>
        <p className="text-gray-600">Provide details of a reliable guarantor</p>
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
            Guarantor Full Name <span className="text-danger">*</span>
          </label>
          <input
            {...register("fullName")}
            type="text"
            id="fullName"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter guarantor's full name"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-danger">
              {errors.fullName.message}
            </p>
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

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Address <span className="text-danger">*</span>
          </label>
          <textarea
            {...register("address")}
            id="address"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter guarantor's complete address"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-danger">{errors.address.message}</p>
          )}
        </div>

        {/* Relationship */}
        <div>
          <label
            htmlFor="relationship"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Relationship <span className="text-danger">*</span>
          </label>
          <select
            {...register("relationship")}
            id="relationship"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select relationship</option>
            <option value="Family Member">Family Member</option>
            <option value="Friend">Friend</option>
            <option value="Colleague">Colleague</option>
            <option value="Business Partner">Business Partner</option>
            <option value="Neighbor">Neighbor</option>
            <option value="Other">Other</option>
          </select>
          {errors.relationship && (
            <p className="mt-1 text-sm text-danger">
              {errors.relationship.message}
            </p>
          )}
        </div>

        {/* Guarantor Photo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Guarantor Photo <span className="text-danger">*</span>
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Upload a clear photo of your guarantor (passport, ID card, or recent
            photo)
          </p>

          {!guarantorPhoto ? (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <img
                src={guarantorPhoto}
                alt="Guarantor"
                className="w-full max-w-sm rounded-lg border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={() => setGuarantorPhoto(null)}
                className="text-danger hover:underline text-sm"
              >
                Remove and upload different photo
              </button>
            </div>
          )}
        </div>

        {/* Info Box */}
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
              <p className="font-semibold mb-1">Important Information</p>
              <p>
                Your guarantor should be someone who knows you well and can
                vouch for your credibility. They may be contacted during the
                verification process.
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
