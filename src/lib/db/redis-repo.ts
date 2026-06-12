import { Booking, BookingSlot, Order, PaymentRecord, User, Voucher } from "../types";
import { CatalogType } from "../types";
import { connectRedis } from "./redis-connect";
import type { CatalogData } from "./catalog-repo";

const PREFIX = "ak";

async function getJson<T>(key: string, fallback: T): Promise<T> {
  const redis = await connectRedis();
  const raw = await redis.get(`${PREFIX}:${key}`);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function setJson<T>(key: string, value: T): Promise<void> {
  const redis = await connectRedis();
  await redis.set(`${PREFIX}:${key}`, JSON.stringify(value));
}

// ── Catalog ──

export async function redisGetCatalogDoc(): Promise<CatalogData> {
  return getJson<CatalogData>("catalog", {
    products: [],
    services: [],
    courses: [],
    pooja: [],
    healing: [],
    categories: [],
  });
}

async function redisSaveCatalog(data: CatalogData) {
  await setJson("catalog", data);
}

export async function redisGetAll<T extends CatalogType>(type: T): Promise<CatalogData[T]> {
  const data = await redisGetCatalogDoc();
  return data[type] as CatalogData[T];
}

export async function redisGetById(type: CatalogType, id: string) {
  const items = await redisGetAll(type);
  return (items as { id: string }[]).find((item) => item.id === id);
}

export async function redisCreate(type: CatalogType, item: Record<string, unknown>) {
  const data = await redisGetCatalogDoc();
  const id = (item.id as string) || `${type.slice(0, 3)}-${Date.now()}`;
  const newItem = { ...item, id };
  (data[type] as unknown[]).push(newItem);
  await redisSaveCatalog(data);
  return newItem;
}

export async function redisUpdate(type: CatalogType, id: string, updates: Record<string, unknown>) {
  const data = await redisGetCatalogDoc();
  const items = data[type] as { id: string }[];
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated = { ...items[index], ...updates, id };
  (data[type] as unknown[])[index] = updated;
  await redisSaveCatalog(data);
  return updated;
}

export async function redisDelete(type: CatalogType, id: string) {
  const data = await redisGetCatalogDoc();
  const items = data[type] as { id: string }[];
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  await redisSaveCatalog(data);
  return true;
}

export async function redisGetCategories() {
  const data = await redisGetCatalogDoc();
  return data.categories;
}

export async function redisCreateCategory(cat: Record<string, unknown> & { id?: string; name: string }) {
  const data = await redisGetCatalogDoc();
  const id =
    cat.id ||
    cat.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 48);
  const newCat = { ...cat, id };
  data.categories.push(newCat);
  await redisSaveCatalog(data);
  return newCat;
}

export async function redisUpdateCategory(id: string, updates: Record<string, unknown>) {
  const data = await redisGetCatalogDoc();
  const index = (data.categories as { id: string }[]).findIndex((c) => c.id === id);
  if (index === -1) return null;
  data.categories[index] = { ...(data.categories[index] as object), ...updates, id };
  await redisSaveCatalog(data);
  return data.categories[index];
}

export async function redisDeleteCategory(id: string) {
  const data = await redisGetCatalogDoc();
  data.categories = (data.categories as { id: string }[]).filter((c) => c.id !== id);
  await redisSaveCatalog(data);
  return true;
}

export async function redisSeedCatalog(seed: CatalogData) {
  const existing = await redisGetCatalogDoc();
  const hasData =
    existing.products.length +
      existing.services.length +
      existing.courses.length +
      existing.pooja.length +
      existing.healing.length >
    0;
  if (hasData) return existing;
  await redisSaveCatalog(seed);
  return seed;
}

// ── Users ──

export async function redisGetUsers(): Promise<User[]> {
  return getJson<User[]>("users", []);
}

export async function redisSeedUsers(seed: User[]) {
  const users = await redisGetUsers();
  if (users.length > 0) return;
  await setJson("users", seed);
}

export async function redisFindUserByEmail(email: string) {
  const users = await redisGetUsers();
  return users.find((u) => u.email === email) ?? null;
}

export async function redisFindUserById(id: string) {
  const users = await redisGetUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function redisCreateUser(user: User) {
  const users = await redisGetUsers();
  users.push(user);
  await setJson("users", users);
  return user;
}

export async function redisUpdateUser(id: string, patch: Partial<User>) {
  const users = await redisGetUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...patch };
  await setJson("users", users);
  return users[idx];
}

// ── Payments ──

export async function redisGetPayments(): Promise<PaymentRecord[]> {
  const payments = await getJson<PaymentRecord[]>("payments", []);
  return payments.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function redisGetPaymentById(id: string) {
  const payments = await redisGetPayments();
  return payments.find((p) => p.id === id) ?? null;
}

export async function redisSavePayment(payment: PaymentRecord) {
  const payments = await getJson<PaymentRecord[]>("payments", []);
  const idx = payments.findIndex((p) => p.id === payment.id);
  if (idx === -1) payments.push(payment);
  else payments[idx] = payment;
  await setJson("payments", payments);
  return payment;
}

// ── Vouchers ──

export async function redisGetVouchers(): Promise<Voucher[]> {
  return getJson<Voucher[]>("vouchers", []);
}

export async function redisSaveVoucher(voucher: Voucher) {
  const vouchers = await redisGetVouchers();
  const idx = vouchers.findIndex((v) => v.id === voucher.id);
  if (idx === -1) vouchers.push(voucher);
  else vouchers[idx] = voucher;
  await setJson("vouchers", vouchers);
  return voucher;
}

export async function redisDeleteVoucher(id: string) {
  const vouchers = await redisGetVouchers();
  const next = vouchers.filter((v) => v.id !== id);
  if (next.length === vouchers.length) return false;
  await setJson("vouchers", next);
  return true;
}

// ── Bookings ──

export async function redisGetBookings(): Promise<Booking[]> {
  return getJson<Booking[]>("bookings", []);
}

export async function redisSaveBooking(booking: Booking) {
  const bookings = await redisGetBookings();
  const idx = bookings.findIndex((b) => b.id === booking.id);
  if (idx === -1) bookings.push(booking);
  else bookings[idx] = booking;
  await setJson("bookings", bookings);
  return booking;
}

// ── Orders ──

export async function redisGetOrders(): Promise<Order[]> {
  return getJson<Order[]>("orders", []);
}

export async function redisSaveOrder(order: Order) {
  const orders = await redisGetOrders();
  const idx = orders.findIndex((o) => o.id === order.id);
  if (idx === -1) orders.push(order);
  else orders[idx] = order;
  await setJson("orders", orders);
  return order;
}

export async function redisGetOrderById(id: string) {
  const orders = await redisGetOrders();
  return orders.find((o) => o.id === id) ?? null;
}

// ── Slots ──

export async function redisGetSlots(): Promise<BookingSlot[]> {
  const slots = await getJson<BookingSlot[]>("slots", []);
  return slots.map((s) => ({ ...s, duration: s.duration || "30 min" }));
}

export async function redisSaveSlots(slots: BookingSlot[]) {
  await setJson("slots", slots);
}
