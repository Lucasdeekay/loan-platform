import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_BASE_URL = "https://api.paystack.co";

// Axios instance with Paystack auth
const paystackAPI = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

// Create Dedicated Virtual Account
export async function createDedicatedVirtualAccount(
  email: string,
  firstName: string,
  lastName: string,
  phone?: string
) {
  try {
    const response = await paystackAPI.post("/dedicated_account", {
      email,
      first_name: firstName,
      last_name: lastName,
      phone,
      preferred_bank: "wema-bank", // or 'test-bank' for testing
    });

    return {
      success: true,
      data: {
        accountNumber: response.data.data.account_number,
        accountName: response.data.data.account_name,
        bankName: response.data.data.bank.name,
        accountReference: response.data.data.id,
      },
    };
  } catch (error: any) {
    console.error(
      "Paystack Create Account Error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to create virtual account",
    };
  }
}

// Initialize Transaction (for manual repayments)
export async function initializeTransaction(
  email: string,
  amount: number, // in kobo (multiply naira by 100)
  reference: string,
  metadata?: any
) {
  try {
    const response = await paystackAPI.post("/transaction/initialize", {
      email,
      amount,
      reference,
      metadata,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/paystack/callback`,
    });

    return {
      success: true,
      data: {
        authorizationUrl: response.data.data.authorization_url,
        accessCode: response.data.data.access_code,
        reference: response.data.data.reference,
      },
    };
  } catch (error: any) {
    console.error(
      "Paystack Initialize Transaction Error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to initialize transaction",
    };
  }
}

// Verify Transaction
export async function verifyTransaction(reference: string) {
  try {
    const response = await paystackAPI.get(`/transaction/verify/${reference}`);

    return {
      success: true,
      data: {
        status: response.data.data.status,
        amount: response.data.data.amount / 100, // convert from kobo to naira
        paidAt: response.data.data.paid_at,
        channel: response.data.data.channel,
        metadata: response.data.data.metadata,
      },
    };
  } catch (error: any) {
    console.error(
      "Paystack Verify Transaction Error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to verify transaction",
    };
  }
}

// Verify Webhook Signature
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(payload)
    .digest("hex");

  return hash === signature;
}

// List Transactions
export async function listTransactions(perPage: number = 50, page: number = 1) {
  try {
    const response = await paystackAPI.get("/transaction", {
      params: {
        perPage,
        page,
      },
    });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error(
      "Paystack List Transactions Error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to list transactions",
    };
  }
}

// Get Transaction
export async function getTransaction(transactionId: string) {
  try {
    const response = await paystackAPI.get(`/transaction/${transactionId}`);

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error(
      "Paystack Get Transaction Error:",
      error.response?.data || error.message
    );
    return {
      success: false,
      error: error.response?.data?.message || "Failed to get transaction",
    };
  }
}

export default {
  createDedicatedVirtualAccount,
  initializeTransaction,
  verifyTransaction,
  verifyWebhookSignature,
  listTransactions,
  getTransaction,
};
