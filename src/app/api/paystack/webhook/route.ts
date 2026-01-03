import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import db from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Get signature from headers
    const signature = request.headers.get("x-paystack-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Get raw body
    const body = await request.text();

    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse event data
    const event = JSON.parse(body);
    console.log("Paystack Webhook Event:", event.event, event.data?.reference);

    // Handle different event types
    switch (event.event) {
      case "charge.success":
        await handleChargeSuccess(event.data);
        break;

      case "transfer.success":
      case "transfer.failed":
        await handleTransfer(event.data, event.event);
        break;

      case "dedicatedaccount.assign.success":
        console.log("Dedicated account assigned:", event.data);
        break;

      default:
        console.log("Unhandled event type:", event.event);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handle successful charge (payment received)
async function handleChargeSuccess(data: any) {
  try {
    const reference = data.reference;
    const amount = data.amount / 100; // Convert from kobo to naira
    const channel = data.channel;
    const metadata = data.metadata;

    // Find transaction by reference
    const transaction = await db.transaction.findUnique({
      where: { reference },
      include: { user: true },
    });

    if (!transaction) {
      console.error("Transaction not found:", reference);
      return;
    }

    // Check if already processed
    if (transaction.status === "SUCCESS") {
      console.log("Transaction already processed:", reference);
      return;
    }

    // Update transaction status
    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        status: "SUCCESS",
        paystackData: JSON.stringify(data),
      },
    });

    // If it's a repayment, update repayment and loan
    if (transaction.type === "REPAYMENT" && metadata?.loanId) {
      // Update repayment status
      const repayment = await db.repayment.findFirst({
        where: {
          transactionRef: reference,
          loanId: metadata.loanId,
        },
      });

      if (repayment) {
        await db.repayment.update({
          where: { id: repayment.id },
          data: { status: "COMPLETED" },
        });

        // Check if loan is fully repaid
        const loan = await db.loan.findUnique({
          where: { id: metadata.loanId },
          include: {
            repayments: {
              where: { status: "COMPLETED" },
            },
          },
        });

        if (loan) {
          const totalRepaid = loan.repayments.reduce(
            (sum, r) => sum + r.amount,
            0
          );

          // If fully repaid, update loan status
          if (totalRepaid >= loan.totalRepayment) {
            await db.loan.update({
              where: { id: loan.id },
              data: { status: "REPAID" },
            });
            console.log("Loan fully repaid:", loan.id);
          }
        }
      }
    }

    // If it's a deposit, update wallet balance
    if (transaction.type === "DEPOSIT") {
      await db.wallet.update({
        where: { userId: transaction.userId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
      console.log("Wallet balance updated for user:", transaction.userId);
    }

    console.log("Charge success processed:", reference);
  } catch (error) {
    console.error("Error handling charge success:", error);
  }
}

// Handle transfer events
async function handleTransfer(data: any, eventType: string) {
  try {
    const reference = data.reference;
    const status = eventType === "transfer.success" ? "SUCCESS" : "FAILED";

    // Find transaction by reference
    const transaction = await db.transaction.findUnique({
      where: { reference },
    });

    if (!transaction) {
      console.error("Transaction not found:", reference);
      return;
    }

    // Update transaction status
    await db.transaction.update({
      where: { id: transaction.id },
      data: {
        status,
        paystackData: JSON.stringify(data),
      },
    });

    console.log(`Transfer ${status.toLowerCase()}:`, reference);
  } catch (error) {
    console.error("Error handling transfer:", error);
  }
}
