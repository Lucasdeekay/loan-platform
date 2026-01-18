import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminLoanDetailClient from "@/components/admin/AdminLoanDetailClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function AdminLoanDetailPage({ params }: PageProps) {
  // Check if user is admin
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <AdminLoanDetailClient params={params} />;
}