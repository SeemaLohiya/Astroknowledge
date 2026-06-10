import { Booking, Order, User } from "./types";
import { readJsonFile, writeJsonFile } from "./json-store";

const SEED_USERS: User[] = [
  {
    id: "admin-1",
    name: "Acharya Seema Lohiya",
    email: "admin@astroknowledge.com",
    phone: "+919876543210",
    password: "admin123",
    role: "admin",
    createdAt: "2020-01-01",
  },
  {
    id: "user-1",
    name: "Demo User",
    email: "user@demo.com",
    phone: "+919998887766",
    password: "user123",
    role: "user",
    createdAt: "2025-06-01",
  },
];

const SEED_BOOKINGS: Booking[] = [];
const SEED_ORDERS: Order[] = [];

function readUsers() {
  return readJsonFile<User[]>("users.json", SEED_USERS);
}
function writeUsers(users: User[]) {
  writeJsonFile("users.json", users);
}
function readBookings() {
  return readJsonFile<Booking[]>("bookings.json", SEED_BOOKINGS);
}
function writeBookings(bookings: Booking[]) {
  writeJsonFile("bookings.json", bookings);
}
function readOrders() {
  return readJsonFile<Order[]>("orders.json", SEED_ORDERS);
}
function writeOrders(orders: Order[]) {
  writeJsonFile("orders.json", orders);
}

function trackOrder(order: Order, status: Order["status"], note?: string) {
  if (!order.trackingHistory) order.trackingHistory = [];
  order.trackingHistory.push({ status, note, at: new Date().toISOString() });
}

export const store = {
  users: {
    getAll: () => readUsers(),
    findByEmail: (email: string) => readUsers().find((u) => u.email === email),
    findById: (id: string) => readUsers().find((u) => u.id === id),
    create: (user: Omit<User, "id" | "createdAt">) => {
      const users = readUsers();
      const newUser: User = {
        ...user,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      users.push(newUser);
      writeUsers(users);
      return newUser;
    },
    update: (id: string, patch: Partial<User>) => {
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      users[idx] = { ...users[idx], ...patch };
      writeUsers(users);
      return users[idx];
    },
    persist: (user: User) => {
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx === -1) return null;
      users[idx] = user;
      writeUsers(users);
      return user;
    },
  },
  bookings: {
    getAll: () => readBookings(),
    getByUser: (userId: string) => readBookings().filter((b) => b.userId === userId),
    create: (booking: Omit<Booking, "id" | "createdAt">) => {
      const bookings = readBookings();
      const newBooking: Booking = {
        ...booking,
        id: `bk-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      bookings.push(newBooking);
      writeBookings(bookings);
      return newBooking;
    },
    updateStatus: (id: string, status: Booking["status"]) => {
      const bookings = readBookings();
      const booking = bookings.find((b) => b.id === id);
      if (booking) {
        booking.status = status;
        writeBookings(bookings);
      }
      return booking || null;
    },
  },
  orders: {
    getAll: () => readOrders(),
    getByUser: (userId: string) => readOrders().filter((o) => o.userId === userId),
    findById: (id: string) => readOrders().find((o) => o.id === id) || null,
    create: (order: Omit<Order, "id" | "createdAt" | "trackingHistory">) => {
      const orders = readOrders();
      const newOrder: Order = {
        ...order,
        id: `ord-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
        trackingId: `AK-ORD-${String(orders.length + 1).padStart(4, "0")}`,
        trackingHistory: [{ status: "processing", note: "Order placed", at: new Date().toISOString() }],
      };
      orders.push(newOrder);
      writeOrders(orders);
      return newOrder;
    },
    updateStatus: (id: string, status: Order["status"], note?: string, trackingId?: string) => {
      const orders = readOrders();
      const order = orders.find((o) => o.id === id);
      if (!order) return null;
      order.status = status;
      if (trackingId) order.trackingId = trackingId;
      trackOrder(order, status, note);
      writeOrders(orders);
      return order;
    },
  },
};
