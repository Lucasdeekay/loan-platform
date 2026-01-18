import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminPageClient from "@/components/admin/AdminPageClient";

export default async function AdminPage() {
  // Check if user is admin
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <AdminPageClient />;
}