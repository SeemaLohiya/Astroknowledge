import fs from "fs";
import path from "path";
import { CartItem, PaymentRecord, PaymentStatus } from "./types";
import { store } from "./store";
import { isRemotePersistEnabled } from "./db/persist";
import * as mongo from "./db/app-data-repo";

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

async function getPaymentsList(): Promise<PaymentRecord[]> {
  if (isRemotePersistEnabled()) return mongo.mongoGetPayments();
  return readPayments();
}

async function savePaymentsList(payments: PaymentRecord[]) {
  if (isRemotePersistEnabled()) {
    for (const p of payments) await mongo.mongoSavePayment(p);
    return;
  }
  writePayments(payments);
}

async function createOrderFromPayment(payment: PaymentRecord) {
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
  getAll: async () => (await getPaymentsList()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  getById: async (id: string) => {
    if (isRemotePersistEnabled()) return mongo.mongoGetPaymentById(id);
    return readPayments().find((p) => p.id === id) || null;
  },

  getByUser: async (userId: string) => (await getPaymentsList()).filter((p) => p.userId === userId),

  hasPaidAccess: async (userId: string) =>
    (await getPaymentsList()).some((p) => p.userId === userId && p.status === "paid"),

  createCheckout: async (data: {
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
    const payments = await getPaymentsList();
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
    if (isRemotePersistEnabled()) await mongo.mongoSavePayment(payment);
    else writePayments(payments);
    return payment;
  },

  processPayment: async (
    id: string,
    method: "razorpay" | "admin_approval",
    extras?: { transactionRefId?: string; paymentProofImage?: string }
  ) => {
    const payments = await getPaymentsList();
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
      const order = await createOrderFromPayment(payment);
      payment.referenceId = order.id;
    }
    await savePaymentsList(payments);
    return payment;
  },

  approvePayment: async (id: string, adminComment?: string) => {
    const payments = await getPaymentsList();
    const payment = payments.find((p) => p.id === id);
    if (!payment || payment.status !== "awaiting_approval") return null;
    payment.status = "paid";
    if (adminComment?.trim()) payment.adminComment = adminComment.trim();
    const order = await createOrderFromPayment(payment);
    payment.referenceId = order.id;
    await savePaymentsList(payments);
    return payment;
  },

  rejectPayment: async (id: string, adminComment?: string) => {
    const payments = await getPaymentsList();
    const payment = payments.find((p) => p.id === id);
    if (!payment || payment.status !== "awaiting_approval") return null;
    payment.status = "failed";
    if (adminComment?.trim()) payment.adminComment = adminComment.trim();
    await savePaymentsList(payments);
    return payment;
  },

  confirmRazorpayPayment: async (
    id: string,
    data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }
  ) => {
    const payments = await getPaymentsList();
    const payment = payments.find((p) => p.id === id);
    if (!payment || payment.status === "paid") return null;

    payment.method = "razorpay";
    payment.status = "paid";
    payment.transactionRefId = data.razorpayPaymentId;
    const order = await createOrderFromPayment(payment);
    payment.referenceId = order.id;
    await savePaymentsList(payments);
    return payment;
  },

  updateStatus: async (id: string, status: PaymentStatus) => {
    const payments = await getPaymentsList();
    const payment = payments.find((p) => p.id === id);
    if (!payment) return null;
    payment.status = status;
    if (status === "paid" && !payment.referenceId) {
      const order = await createOrderFromPayment(payment);
      payment.referenceId = order.id;
    }
    await savePaymentsList(payments);
    return payment;
  },
};
