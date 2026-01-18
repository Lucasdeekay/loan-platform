import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { LoadingProvider } from "../contexts/LoadingContext";

export const metadata: Metadata = {
  title: "LoanPlatform - Fast & Secure Loans",
  description: "Get your loan approved in minutes with our secure platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LoadingProvider>{children}</LoadingProvider>
      </body>
    </html>
  );
}
