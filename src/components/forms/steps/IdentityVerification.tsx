"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoading } from "@/context/LoadingContext";

const identitySchema = z.object({
  bvn: z.string().length(11, "BVN must be exactly 11 digits"),
  nin: z.string().length(11, "NIN must be exactly 11 digits"),
});

type IdentityFormData = z.infer<typeof identitySchema>;

interface IdentityVerificationProps {
  userId: string;
  loanId?: string;
  onNext: () => void;
  onBack: () => void;
}

export default function IdentityVerification({
  userId,
  loanId,
  onNext,
  onBack,
}: IdentityVerificationProps) {
  const { startLoading, stopLoading } = useLoading();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [facePhoto, setFacePhoto] = useState<string | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<string | null>(null);
  const [captureMode, setCaptureMode] = useState<"upload" | "camera">("upload");
  const [isCameraActive, setIsCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
  });

  // Start camera for live capture
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      alert("Unable to access camera. Please use file upload instead.");
      setCaptureMode("upload");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const photoData = canvas.toDataURL("image/jpeg", 0.8);
        setFacePhoto(photoData);
        stopCamera();
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "face" | "passport"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === "face") {
          setFacePhoto(result);
        } else {
          setPassportPhoto(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: IdentityFormData) => {
    if (!facePhoto) {
      setError("Please capture or upload your face photo");
      return;
    }

    startLoading();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/loan/identity-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userId,
          loanId,
          facePhoto,
          passportPhoto,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save identity verification");
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Identity Verification
        </h2>
        <p className="text-gray-600">
          Verify your identity with BVN, NIN, and photo
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* BVN */}
        <div>
          <label
            htmlFor="bvn"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Bank Verification Number (BVN){" "}
            <span className="text-danger">*</span>
          </label>
          <input
            {...register("bvn")}
            type="text"
            id="bvn"
            maxLength={11}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter 11-digit BVN"
          />
          {errors.bvn && (
            <p className="mt-1 text-sm text-danger">{errors.bvn.message}</p>
          )}
        </div>

        {/* NIN */}
        <div>
          <label
            htmlFor="nin"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            National Identification Number (NIN){" "}
            <span className="text-danger">*</span>
          </label>
          <input
            {...register("nin")}
            type="text"
            id="nin"
            maxLength={11}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter 11-digit NIN"
          />
          {errors.nin && (
            <p className="mt-1 text-sm text-danger">{errors.nin.message}</p>
          )}
        </div>

        {/* Face Photo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Face Photo <span className="text-danger">*</span>
          </label>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                setCaptureMode("upload");
                stopCamera();
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                captureMode === "upload"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Upload Photo
            </button>
            <button
              type="button"
              onClick={() => {
                setCaptureMode("camera");
                startCamera();
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                captureMode === "camera"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Use Camera
            </button>
          </div>

          {captureMode === "upload" && !facePhoto && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "face")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          )}

          {captureMode === "camera" && !facePhoto && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg border-2 border-gray-300"
              />
              {isCameraActive && (
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-700"
                >
                  Capture Photo
                </button>
              )}
            </div>
          )}

          {facePhoto && (
            <div className="space-y-2">
              <img
                src={facePhoto}
                alt="Face"
                className="w-full max-w-sm rounded-lg border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={() => setFacePhoto(null)}
                className="text-danger hover:underline text-sm"
              >
                Remove and retake
              </button>
            </div>
          )}
        </div>

        {/* Passport Photo (Optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Passport Photo (Optional)
          </label>
          {!passportPhoto ? (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "passport")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          ) : (
            <div className="space-y-2">
              <img
                src={passportPhoto}
                alt="Passport"
                className="w-full max-w-sm rounded-lg border-2 border-gray-300"
              />
              <button
                type="button"
                onClick={() => setPassportPhoto(null)}
                className="text-danger hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          )}
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
