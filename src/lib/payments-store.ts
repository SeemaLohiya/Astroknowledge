import fs from "fs";
import path from "path";
import { CartItem, PaymentRecord, PaymentStatus } from "./types";
import { store } from "./store";

const DATA_DIR = path.join(process.cwd(), "data");
const PAYMENTS_PATH = path.join(DATA_DIR, "payments.json");

function normalizePayment(raw: Partial<PaymentRecord> & Pick<PaymentRecord, "id">): PaymentRecord {
  const amount = raw.amount ?? 0;
  const description = raw.description ?? "";
  return {
    id: raw.id,
    type: raw.type ?? "checkout",
    referenceId: raw.referenceId ?? "",
    userId: raw.userId ?? "",
    userName: raw.userName ?? "",
    userEmail: raw.userEmail ?? "",
    userPhone: raw.userPhone ?? "",
    description,
    amount,
    status: raw.status ?? "pending",
    method: raw.method,
    transactionRefId: raw.transactionRefId,
    paymentProofImage: raw.paymentProofImage,
    items:
      raw.items ??
      (description
        ? [
            {
              id: raw.referenceId || raw.id,
              itemType: "product",
              name: description,
              price: amount,
              quantity: 1,
              image: "/images/products/p1.jpg",
            },
          ]
        : []),
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

function readPayments(): PaymentRecord[] {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PAYMENTS_PATH)) {
    fs.writeFileSync(PAYMENTS_PATH, "[]", "utf-8");
    return [];
  }
  try {
    const raw = fs.readFileSync(PAYMENTS_PATH, "utf-8").trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<PaymentRecord>[];
    return parsed.map((p) => normalizePayment({ ...p, id: p.id || `pay-${Date.now()}` }));
  } catch {
    return [];
  }
}

function writePayments(payments: PaymentRecord[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(PAYMENTS_PATH, JSON.stringify(payments, null, 2), "utf-8");
}

function createOrderFromPayment(payment: PaymentRecord) {
  return store.orders.create({
    userId: payment.userId,
    userName: payment.userName,
    items: payment.items.map((i) => ({
      productId: `${i.itemType}-${i.id}`,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
    })),
    total: payment.amount,
    status: "processing",
  });
}

export const paymentsStore = {
  getAll: () => readPayments().sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  getById: (id: string) => readPayments().find((p) => p.id === id) || null,

  getByUser: (userId: string) => readPayments().filter((p) => p.userId === userId),

  hasPaidAccess: (userId: string) =>
    readPayments().some((p) => p.userId === userId && p.status === "paid"),

  createCheckout: (data: {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    items: CartItem[];
    total: number;
    subtotal?: number;
    discountAmount?: number;
    voucherCode?: string;
    voucherId?: string;
  }) => {
    const payments = readPayments();
    const payment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      type: "checkout",
      referenceId: "",
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      userPhone: data.userPhone,
      description: data.items.map((i) => i.name).join(", "),
      amount: data.total,
      subtotal: data.subtotal ?? data.total,
      discountAmount: data.discountAmount,
      voucherCode: data.voucherCode,
      voucherId: data.voucherId,
      status: "pending",
      items: data.items.map((i) => ({
        id: i.id,
        itemType: i.itemType,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      createdAt: new Date().toISOString(),
    };
    payments.push(payment);
    writePayments(payments);
    return payment;
  },

  processPayment: (
    id: string,
    method: "razorpay" | "admin_approval",
    extras?: { transactionRefId?: string; paymentProofImage?: string }
  ) => {
    const payments = readPayments();
    const payment = payments.find((p) => p.id === id);
    if (!payment) return null;

    if (method === "admin_approval") {
      payment.method = "admin_approval";
      payment.status = "awaiting_approval";
      payment.transactionRefId = extras?.transactionRefId?.trim();
      payment.paymentProofImage = extras?.paymentProofImage;
    } else {
      payment.method = "razorpay";
      payment.status = "paid";
      const order = createOrderFromPayment(payment);
      payment.referenceId = order.id;
    }
    writePayments(payments);
    return payment;
  },

  approvePayment: (id: string, adminComment?: string) => {
    const payments = readPayments();
    const payment = payments.find((p) => p.id === id);
    if (!payment || payment.status !== "awaiting_approval") return null;
    payment.status = "paid";
    if (adminComment?.trim()) payment.adminComment = adminComment.trim();
    const order = createOrderFromPayment(payment);
    payment.referenceId = order.id;
    writePayments(payments);
    return payment;
  },

  rejectPayment: (id: string, adminComment?: string) => {
    const payments = readPayments();
    const payment = payments.find((p) => p.id === id);
    if (!payment || payment.status !== "awaiting_approval") return null;
    payment.status = "failed";
    if (adminComment?.trim()) payment.adminComment = adminComment.trim();
    writePayments(payments);
    return payment;
  },

  confirmRazorpayPayment: (
    id: string,
    data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }
  ) => {
    const payments = readPayments();
    const payment = payments.find((p) => p.id === id);
    if (!payment || payment.status === "paid") return null;

    payment.method = "razorpay";
    payment.status = "paid";
    payment.transactionRefId = data.razorpayPaymentId;
    const order = createOrderFromPayment(payment);
    payment.referenceId = order.id;
    writePayments(payments);
    return payment;
  },

  updateStatus: (id: string, status: PaymentStatus) => {
    const payments = readPayments();
    const payment = payments.find((p) => p.id === id);
    if (!payment) return null;
    payment.status = status;
    if (status === "paid" && !payment.referenceId) {
      const order = createOrderFromPayment(payment);
      payment.referenceId = order.id;
    }
    writePayments(payments);
    return payment;
  },
};
