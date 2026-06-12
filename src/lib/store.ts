import { Booking, Order, User } from "./types";
import { readJsonFile, writeJsonFile } from "./json-store";
import { isRemotePersistEnabled } from "./db/persist";
import * as mongo from "./db/app-data-repo";

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

let usersSeeded = false;

async function ensureUsersSeeded() {
  if (!isRemotePersistEnabled() || usersSeeded) return;
  await mongo.mongoSeedUsers(SEED_USERS);
  usersSeeded = true;
}

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
    getAll: async () => {
      if (isRemotePersistEnabled()) {
        await ensureUsersSeeded();
        return mongo.mongoGetUsers();
      }
      return readUsers();
    },
    findByEmail: async (email: string) => {
      if (isRemotePersistEnabled()) {
        await ensureUsersSeeded();
        return mongo.mongoFindUserByEmail(email);
      }
      return readUsers().find((u) => u.email === email);
    },
    findById: async (id: string) => {
      if (isRemotePersistEnabled()) {
        await ensureUsersSeeded();
        return mongo.mongoFindUserById(id);
      }
      return readUsers().find((u) => u.id === id);
    },
    create: async (user: Omit<User, "id" | "createdAt">) => {
      const newUser: User = {
        ...user,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      if (isRemotePersistEnabled()) {
        await ensureUsersSeeded();
        return mongo.mongoCreateUser(newUser);
      }
      const users = readUsers();
      users.push(newUser);
      writeUsers(users);
      return newUser;
    },
    update: async (id: string, patch: Partial<User>) => {
      if (isRemotePersistEnabled()) {
        await ensureUsersSeeded();
        return mongo.mongoUpdateUser(id, patch);
      }
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      users[idx] = { ...users[idx], ...patch };
      writeUsers(users);
      return users[idx];
    },
    persist: async (user: User) => {
      if (isRemotePersistEnabled()) {
        await ensureUsersSeeded();
        return mongo.mongoUpdateUser(user.id, user);
      }
      const users = readUsers();
      const idx = users.findIndex((u) => u.id === user.id);
      if (idx === -1) return null;
      users[idx] = user;
      writeUsers(users);
      return user;
    },
  },
  bookings: {
    getAll: async () => {
      if (isRemotePersistEnabled()) return mongo.mongoGetBookings();
      return readBookings();
    },
    getByUser: async (userId: string) => {
      const bookings = isRemotePersistEnabled() ? await mongo.mongoGetBookings() : readBookings();
      return bookings.filter((b) => b.userId === userId);
    },
    create: async (booking: Omit<Booking, "id" | "createdAt">) => {
      const newBooking: Booking = {
        ...booking,
        id: `bk-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      if (isRemotePersistEnabled()) return mongo.mongoSaveBooking(newBooking);
      const bookings = readBookings();
      bookings.push(newBooking);
      writeBookings(bookings);
      return newBooking;
    },
    updateStatus: async (id: string, status: Booking["status"]) => {
      const bookings = isRemotePersistEnabled() ? await mongo.mongoGetBookings() : readBookings();
      const booking = bookings.find((b) => b.id === id);
      if (booking) {
        booking.status = status;
        if (isRemotePersistEnabled()) await mongo.mongoSaveBooking(booking);
        else writeBookings(bookings);
      }
      return booking || null;
    },
  },
  orders: {
    getAll: async () => {
      if (isRemotePersistEnabled()) return mongo.mongoGetOrders();
      return readOrders();
    },
    getByUser: async (userId: string) => {
      const orders = isRemotePersistEnabled() ? await mongo.mongoGetOrders() : readOrders();
      return orders.filter((o) => o.userId === userId);
    },
    findById: async (id: string) => {
      if (isRemotePersistEnabled()) return mongo.mongoGetOrderById(id);
      return readOrders().find((o) => o.id === id) || null;
    },
    create: async (order: Omit<Order, "id" | "createdAt" | "trackingHistory">) => {
      const orders = isRemotePersistEnabled() ? await mongo.mongoGetOrders() : readOrders();
      const newOrder: Order = {
        ...order,
        id: `ord-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
        trackingId: `AK-ORD-${String(orders.length + 1).padStart(4, "0")}`,
        trackingHistory: [{ status: "processing", note: "Order placed", at: new Date().toISOString() }],
      };
      if (isRemotePersistEnabled()) return mongo.mongoSaveOrder(newOrder);
      orders.push(newOrder);
      writeOrders(orders);
      return newOrder;
    },
    updateStatus: async (id: string, status: Order["status"], note?: string, trackingId?: string) => {
      const orders = isRemotePersistEnabled() ? await mongo.mongoGetOrders() : readOrders();
      const order = orders.find((o) => o.id === id);
      if (!order) return null;
      order.status = status;
      if (trackingId) order.trackingId = trackingId;
      trackOrder(order, status, note);
      if (isRemotePersistEnabled()) await mongo.mongoSaveOrder(order);
      else writeOrders(orders);
      return order;
    },
  },
};
