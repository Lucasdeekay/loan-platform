"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function approveLoan(loanId: string) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const loan = await db.loan.findUnique({
      where: { id: loanId },
    });

    if (!loan || loan.status !== "PENDING") {
      throw new Error("Invalid loan");
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    await db.loan.update({
      where: { id: loanId },
      data: {
        status: "APPROVED",
        approvalDate: new Date(),
        dueDate,
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function rejectLoan(loanId: string) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const loan = await db.loan.findUnique({
      where: { id: loanId },
    });

    if (!loan || loan.status !== "PENDING") {
      throw new Error("Invalid loan");
    }

    await db.loan.update({
      where: { id: loanId },
      data: {
        status: "REJECTED",
      },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
