import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import db from "@/lib/db";

// Cache configuration for admin data (5 minutes for stats, 1 minute for loans)
const CACHE_DURATION_STATS = 5 * 60; // 5 minutes
const CACHE_DURATION_LOANS = 60; // 1 minute

// Simple in-memory cache (consider Redis for production)
const cache = new Map<string, { data: any; timestamp: number }>();

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const loanId = formData.get("loanId") as string;
    const action = formData.get("action") as string;

    if (!loanId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate action
    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Get loan
    const loan = await db.loan.findUnique({
      where: { id: loanId },
    });

    if (!loan) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    // Check if loan is pending
    if (loan.status !== "PENDING") {
      return NextResponse.json(
        { error: "Loan is not pending" },
        { status: 400 }
      );
    }

    // Update loan status
    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";
    const updateData: any = {
      status: newStatus,
    };

    // If approving, set approval date and due date (30 days from now)
    if (action === "approve") {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // 30 days repayment period

      updateData.approvalDate = new Date();
      updateData.dueDate = dueDate;
    }

    await db.loan.update({
      where: { id: loanId },
      data: updateData,
    });

    // Redirect back to admin page with success message
    return NextResponse.redirect(new URL("/admin?success=true", request.url));
  } catch (error) {
    console.error("Admin Loan Action Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch loan details (for detail page) or all loans (for dashboard)
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const loanId = searchParams.get("loanId");

    if (loanId) {
      // For loan details, use minimal caching (recent data is important)
      const cacheKey = `loan-${loanId}`;
      const cached = cache.get(cacheKey);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < 30000) { // 30 seconds cache
        return NextResponse.json(cached.data, { status: 200 });
      }

      // Fetch specific loan with all related data
      const loan = await db.loan.findUnique({
        where: { id: loanId },
        include: {
          user: true,
          identityVerification: true,
          guarantor: true,
          bankDetails: true,
          repayments: {
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!loan) {
        return NextResponse.json({ error: "Loan not found" }, { status: 404 });
      }

      // Remove sensitive data
      const { password, ...userWithoutPassword } = loan.user;

      const responseData = {
        success: true,
        loan: {
          ...loan,
          user: userWithoutPassword,
        },
      };

      // Cache the response
      cache.set(cacheKey, { data: responseData, timestamp: now });

      return NextResponse.json(responseData, { status: 200 });
    } else {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const search = searchParams.get("search") || "";
      const status = searchParams.get("status") || "";
      
      const skip = (page - 1) * limit;
      const now = Date.now();

      // Check cache for stats (more cacheable)
      const statsCacheKey = `admin-stats`;
      let stats;
      const cachedStats = cache.get(statsCacheKey);
      
      if (cachedStats && (now - cachedStats.timestamp) < CACHE_DURATION_STATS) {
        stats = cachedStats.data;
      } else {
        // Calculate statistics
        const [total, pending, approved, rejected, repaid, totalDisbursedResult] = await Promise.all([
          db.loan.count(),
          db.loan.count({ where: { status: "PENDING" } }),
          db.loan.count({ where: { status: "APPROVED" } }),
          db.loan.count({ where: { status: "REJECTED" } }),
          db.loan.count({ where: { status: "REPAID" } }),
          db.loan.aggregate({
            where: {
              status: { in: ["APPROVED", "REPAID"] },
            },
            _sum: {
              amount: true,
            },
          }),
        ]);

        stats = {
          total,
          pending,
          approved,
          rejected,
          repaid,
          totalDisbursed: totalDisbursedResult._sum.amount || 0,
        };

        // Cache stats for longer
        cache.set(statsCacheKey, { data: stats, timestamp: now });
      }

      // Check cache for loans (less cacheable)
      const loansCacheKey = `loans-${page}-${limit}-${search}-${status}`;
      const cachedLoans = cache.get(loansCacheKey);
      
      if (cachedLoans && (now - cachedLoans.timestamp) < CACHE_DURATION_LOANS) {
        return NextResponse.json(
          {
            success: true,
            ...cachedLoans.data,
            stats,
          },
          { status: 200 }
        );
      }

      // Build where clause
      const where: any = {};
      
      if (status) {
        where.status = status;
      }
      
      if (search) {
        where.OR = [
          {
            user: {
              fullName: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            user: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ];
      }

      // Fetch loans with pagination and only necessary data
      const [loans, totalCount] = await Promise.all([
        db.loan.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            amount: true,
            interestRate: true,
            totalRepayment: true,
            status: true,
            applicationDate: true,
            approvalDate: true,
            dueDate: true,
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
              },
            },
          },
        }),
        db.loan.count({ where }),
      ]);

      const loansData = {
        loans,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };

      // Cache loans data
      cache.set(loansCacheKey, { data: loansData, timestamp: now });

      return NextResponse.json(
        {
          success: true,
          ...loansData,
          stats,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Get Loans Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
