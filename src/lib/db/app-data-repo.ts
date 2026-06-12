import fs from "fs";
import path from "path";
import { Booking, Order, PaymentRecord, User, Voucher } from "../types";
import { connectDB } from "./connect";
import { isRedisEnabled } from "./redis-connect";
import * as redis from "./redis-repo";
import { BookingModel, OrderModel, PaymentModel, UserModel, VoucherModel } from "./models";

const DATA_DIR = path.join(process.cwd(), "data");

function readJson<T>(filename: string, fallback: T): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return fallback;
  try {
    const raw = fs.readFileSync(filePath, "utf-8").trim();
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// ── Users ──

export async function mongoGetUsers(): Promise<User[]> {
  if (isRedisEnabled()) return redis.redisGetUsers();
  await connectDB();
  const users = await UserModel.find().lean();
  return users as User[];
}

export async function mongoSeedUsers(seed: User[]) {
  if (isRedisEnabled()) return redis.redisSeedUsers(seed);
  await connectDB();
  const count = await UserModel.countDocuments();
  if (count > 0) return;
  await UserModel.insertMany(seed);
}

export async function mongoFindUserByEmail(email: string) {
  if (isRedisEnabled()) return redis.redisFindUserByEmail(email);
  await connectDB();
  return (await UserModel.findOne({ email }).lean()) as User | null;
}

export async function mongoFindUserById(id: string) {
  if (isRedisEnabled()) return redis.redisFindUserById(id);
  await connectDB();
  return (await UserModel.findOne({ id }).lean()) as User | null;
}

export async function mongoCreateUser(user: User) {
  if (isRedisEnabled()) return redis.redisCreateUser(user);
  await connectDB();
  await UserModel.create(user);
  return user;
}

export async function mongoUpdateUser(id: string, patch: Partial<User>) {
  if (isRedisEnabled()) return redis.redisUpdateUser(id, patch);
  await connectDB();
  return (await UserModel.findOneAndUpdate({ id }, { $set: patch }, { new: true }).lean()) as User | null;
}

// ── Payments ──

export async function mongoGetPayments(): Promise<PaymentRecord[]> {
  if (isRedisEnabled()) return redis.redisGetPayments();
  await connectDB();
  const payments = await PaymentModel.find().lean();
  return (payments as PaymentRecord[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function mongoGetPaymentById(id: string) {
  if (isRedisEnabled()) return redis.redisGetPaymentById(id);
  await connectDB();
  return (await PaymentModel.findOne({ id }).lean()) as PaymentRecord | null;
}

export async function mongoSavePayment(payment: PaymentRecord) {
  if (isRedisEnabled()) return redis.redisSavePayment(payment);
  await connectDB();
  await PaymentModel.findOneAndUpdate({ id: payment.id }, payment, { upsert: true, new: true });
  return payment;
}

export async function mongoSeedPaymentsFromFile() {
  const existing = readJson<PaymentRecord[]>("payments.json", []);
  if (!existing.length) return;
  await connectDB();
  const count = await PaymentModel.countDocuments();
  if (count > 0) return;
  await PaymentModel.insertMany(existing);
}

// ── Vouchers ──

export async function mongoGetVouchers(): Promise<Voucher[]> {
  if (isRedisEnabled()) return redis.redisGetVouchers();
  await connectDB();
  return (await VoucherModel.find().lean()) as Voucher[];
}

export async function mongoSaveVoucher(voucher: Voucher) {
  if (isRedisEnabled()) return redis.redisSaveVoucher(voucher);
  await connectDB();
  await VoucherModel.findOneAndUpdate({ id: voucher.id }, voucher, { upsert: true, new: true });
  return voucher;
}

export async function mongoDeleteVoucher(id: string) {
  if (isRedisEnabled()) return redis.redisDeleteVoucher(id);
  await connectDB();
  const result = await VoucherModel.deleteOne({ id });
  return result.deletedCount > 0;
}

// ── Bookings ──

export async function mongoGetBookings(): Promise<Booking[]> {
  if (isRedisEnabled()) return redis.redisGetBookings();
  await connectDB();
  return (await BookingModel.find().lean()) as Booking[];
}

export async function mongoSaveBooking(booking: Booking) {
  if (isRedisEnabled()) return redis.redisSaveBooking(booking);
  await connectDB();
  await BookingModel.findOneAndUpdate({ id: booking.id }, booking, { upsert: true, new: true });
  return booking;
}

// ── Orders ──

export async function mongoGetOrders(): Promise<Order[]> {
  if (isRedisEnabled()) return redis.redisGetOrders();
  await connectDB();
  return (await OrderModel.find().lean()) as Order[];
}

export async function mongoSaveOrder(order: Order) {
  if (isRedisEnabled()) return redis.redisSaveOrder(order);
  await connectDB();
  await OrderModel.findOneAndUpdate({ id: order.id }, order, { upsert: true, new: true });
  return order;
}

export async function mongoGetOrderById(id: string) {
  if (isRedisEnabled()) return redis.redisGetOrderById(id);
  await connectDB();
  return (await OrderModel.findOne({ id }).lean()) as Order | null;
}
