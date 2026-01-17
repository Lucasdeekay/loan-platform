import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "globals.css";
import { LoadingProvider } from "../context/LoadingContext";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <LoadingProvider>{children}</LoadingProvider>
      </body>
    </html>
  );
}
