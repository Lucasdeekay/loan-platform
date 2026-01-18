"use client";

import { useRouter } from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";

export default function LogoutButton() {
  const router = useRouter();
  const { startLoading } = useLoading();

  const handleLogout = async () => {
    startLoading();

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Small delay for better UX
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 500);
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
    >
      Logout
    </button>
  );
}
