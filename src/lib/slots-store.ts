import fs from "fs";
import path from "path";
import { isRemotePersistEnabled } from "./db/persist";
import * as mongoMeta from "./db/mongo-meta-repo";
import { BookingSlot } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const SLOTS_PATH = path.join(DATA_DIR, "slots.json");

function readSlots(): BookingSlot[] {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(SLOTS_PATH)) {
    fs.writeFileSync(SLOTS_PATH, "[]", "utf-8");
    return [];
  }
  try {
    const raw = fs.readFileSync(SLOTS_PATH, "utf-8").trim();
    if (!raw) return [];
    const slots = JSON.parse(raw) as BookingSlot[];
    return slots.map((s) => ({ ...s, duration: s.duration || "30 min" }));
  } catch {
    return [];
  }
}

function writeSlots(slots: BookingSlot[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(SLOTS_PATH, JSON.stringify(slots, null, 2), "utf-8");
}

async function loadSlots(): Promise<BookingSlot[]> {
  if (isRemotePersistEnabled()) return mongoMeta.mongoGetSlots();
  return readSlots();
}

async function persistSlots(slots: BookingSlot[]) {
  if (isRemotePersistEnabled()) {
    await mongoMeta.mongoSaveSlots(slots);
    return;
  }
  writeSlots(slots);
}

function clearBookingFields(slot: BookingSlot) {
  slot.status = "available";
  slot.userId = undefined;
  slot.userName = undefined;
  slot.userEmail = undefined;
  slot.userPhone = undefined;
  slot.dob = undefined;
  slot.birthTime = undefined;
  slot.birthPlace = undefined;
  slot.dobUnknown = undefined;
  slot.birthTimeUnknown = undefined;
  slot.birthPlaceUnknown = undefined;
  slot.serviceId = undefined;
  slot.serviceName = undefined;
  slot.paymentStatus = undefined;
  slot.paymentAmount = undefined;
  slot.bookedAt = undefined;
  slot.confirmedAt = undefined;
}

export const slotsStore = {
  getAll: async () => loadSlots(),
  getAvailable: async () => (await loadSlots()).filter((s) => s.status === "available"),
  getByUser: async (userId: string) =>
    (await loadSlots()).filter((s) => s.userId === userId && (s.status === "pending" || s.status === "booked")),
  /** Active slot for a user + purchased item (one slot per item policy). */
  getActiveForItem: async (userId: string, serviceId: string) =>
    (await loadSlots()).find(
      (s) =>
        s.userId === userId &&
        s.serviceId === serviceId &&
        (s.status === "pending" || s.status === "booked")
    ) || null,
  getPending: async () => (await loadSlots()).filter((s) => s.status === "pending"),
  getBooked: async () => (await loadSlots()).filter((s) => s.status === "booked"),
  create: async (slot: Omit<BookingSlot, "id" | "createdAt">) => {
    const slots = await loadSlots();
    const newSlot: BookingSlot = {
      ...slot,
      duration: slot.duration || "30 min",
      id: `slot-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    slots.push(newSlot);
    await persistSlots(slots);
    return newSlot;
  },
  book: async (
    id: string,
    data: {
      userId: string;
      userName: string;
      userEmail: string;
      userPhone: string;
      serviceId?: string;
      serviceName?: string;
      paymentAmount?: number;
      dob?: string;
      birthTime?: string;
      birthPlace?: string;
      dobUnknown?: boolean;
      birthTimeUnknown?: boolean;
      birthPlaceUnknown?: boolean;
    }
  ) => {
    const slots = await loadSlots();
    const index = slots.findIndex((s) => s.id === id);
    if (index === -1 || slots[index].status !== "available") return null;
    slots[index] = {
      ...slots[index],
      ...data,
      status: "pending",
      paymentStatus: "pending",
      paymentAmount: data.paymentAmount,
      bookedAt: new Date().toISOString(),
    };
    await persistSlots(slots);
    return slots[index];
  },
  confirm: async (id: string) => {
    const slots = await loadSlots();
    const slot = slots.find((s) => s.id === id);
    if (!slot || slot.status !== "pending") return null;
    slot.status = "booked";
    slot.confirmedAt = new Date().toISOString();
    await persistSlots(slots);
    return slot;
  },
  reject: async (id: string) => {
    const slots = await loadSlots();
    const slot = slots.find((s) => s.id === id);
    if (!slot || (slot.status !== "pending" && slot.status !== "booked")) return null;
    clearBookingFields(slot);
    await persistSlots(slots);
    return slot;
  },
  /** User cancels their pending/booked slot so they can book a different time. */
  cancelByUser: async (id: string, userId: string) => {
    const slots = await loadSlots();
    const slot = slots.find((s) => s.id === id);
    if (!slot || slot.userId !== userId) return null;
    if (slot.status !== "pending" && slot.status !== "booked") return null;
    clearBookingFields(slot);
    await persistSlots(slots);
    return slot;
  },
  updateStatus: async (id: string, status: BookingSlot["status"]) => {
    const slots = await loadSlots();
    const slot = slots.find((s) => s.id === id);
    if (!slot) return null;
    slot.status = status;
    if (status === "available") {
      clearBookingFields(slot);
      slot.status = "available";
    }
    await persistSlots(slots);
    return slot;
  },
  updatePaymentStatus: async (id: string, paymentStatus: BookingSlot["paymentStatus"]) => {
    const slots = await loadSlots();
    const slot = slots.find((s) => s.id === id);
    if (!slot) return null;
    slot.paymentStatus = paymentStatus;
    await persistSlots(slots);
    return slot;
  },
  delete: async (id: string) => {
    const slots = (await loadSlots()).filter((s) => s.id !== id);
    await persistSlots(slots);
    return true;
  },
  bulkCreate: async (items: { date: string; time: string; duration?: string; status?: BookingSlot["status"] }[]) => {
    const slots = await loadSlots();
    const created: BookingSlot[] = items.map((item, i) => ({
      date: item.date,
      time: item.time,
      duration: item.duration || "30 min",
      status: item.status || "available",
      id: `slot-${Date.now()}-${i}`,
      createdAt: new Date().toISOString(),
    }));
    slots.push(...created);
    await persistSlots(slots);
    return created;
  },
};
