import fs from "fs";
import path from "path";
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

export const slotsStore = {
  getAll: () => readSlots(),
  getAvailable: () => readSlots().filter((s) => s.status === "available"),
  getByUser: (userId: string) => readSlots().filter((s) => s.userId === userId && (s.status === "pending" || s.status === "booked")),
  getPending: () => readSlots().filter((s) => s.status === "pending"),
  getBooked: () => readSlots().filter((s) => s.status === "booked"),
  create: (slot: Omit<BookingSlot, "id" | "createdAt">) => {
    const slots = readSlots();
    const newSlot: BookingSlot = {
      ...slot,
      duration: slot.duration || "30 min",
      id: `slot-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    slots.push(newSlot);
    writeSlots(slots);
    return newSlot;
  },
  book: (id: string, data: {
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
  }) => {
    const slots = readSlots();
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
    writeSlots(slots);
    return slots[index];
  },
  confirm: (id: string) => {
    const slots = readSlots();
    const slot = slots.find((s) => s.id === id);
    if (!slot || slot.status !== "pending") return null;
    slot.status = "booked";
    slot.confirmedAt = new Date().toISOString();
    writeSlots(slots);
    return slot;
  },
  reject: (id: string) => {
    const slots = readSlots();
    const slot = slots.find((s) => s.id === id);
    if (!slot || slot.status !== "pending") return null;
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
    writeSlots(slots);
    return slot;
  },
  updateStatus: (id: string, status: BookingSlot["status"]) => {
    const slots = readSlots();
    const slot = slots.find((s) => s.id === id);
    if (!slot) return null;
    slot.status = status;
    if (status === "available") {
      slot.userId = undefined;
      slot.userName = undefined;
      slot.userEmail = undefined;
      slot.userPhone = undefined;
      slot.serviceId = undefined;
      slot.serviceName = undefined;
      slot.paymentStatus = undefined;
      slot.paymentAmount = undefined;
      slot.bookedAt = undefined;
      slot.confirmedAt = undefined;
    }
    writeSlots(slots);
    return slot;
  },
  updatePaymentStatus: (id: string, paymentStatus: BookingSlot["paymentStatus"]) => {
    const slots = readSlots();
    const slot = slots.find((s) => s.id === id);
    if (!slot) return null;
    slot.paymentStatus = paymentStatus;
    writeSlots(slots);
    return slot;
  },
  delete: (id: string) => {
    const slots = readSlots().filter((s) => s.id !== id);
    writeSlots(slots);
    return true;
  },
  bulkCreate: (items: { date: string; time: string; duration?: string; status?: BookingSlot["status"] }[]) => {
    const slots = readSlots();
    const created: BookingSlot[] = items.map((item, i) => ({
      date: item.date,
      time: item.time,
      duration: item.duration || "30 min",
      status: item.status || "available",
      id: `slot-${Date.now()}-${i}`,
      createdAt: new Date().toISOString(),
    }));
    slots.push(...created);
    writeSlots(slots);
    return created;
  },
};
