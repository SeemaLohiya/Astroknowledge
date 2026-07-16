import mongoose, { Schema } from "mongoose";
import { AdminNotification, BookingSlot, EditableSiteContent, SavedAddress } from "../types";
import type { PasswordResetRecord } from "../password-reset-store";
import { connectDB } from "./connect";

const slotBundleSchema = new Schema(
  { _id: { type: String, default: "main" }, slots: { type: [Schema.Types.Mixed], default: [] } },
  { _id: false, timestamps: true }
);

const siteContentSchema = new Schema(
  { _id: { type: String, default: "main" }, data: { type: Schema.Types.Mixed, required: true } },
  { _id: false, timestamps: true }
);

const notificationSchema = new Schema({}, { _id: false, strict: false });
const addressSchema = new Schema({}, { _id: false, strict: false });
const passwordResetBundleSchema = new Schema(
  { _id: { type: String, default: "main" }, records: { type: [Schema.Types.Mixed], default: [] } },
  { _id: false, timestamps: true }
);

const SlotBundleModel =
  mongoose.models.SlotBundle ?? mongoose.model("SlotBundle", slotBundleSchema, "slot_bundles");
const SiteContentModel =
  mongoose.models.SiteContent ?? mongoose.model("SiteContent", siteContentSchema, "site_content");
const NotificationModel =
  mongoose.models.Notification ?? mongoose.model("Notification", notificationSchema, "notifications");
const AddressModel =
  mongoose.models.Address ?? mongoose.model("Address", addressSchema, "addresses");
const PasswordResetBundleModel =
  mongoose.models.PasswordResetBundle ??
  mongoose.model("PasswordResetBundle", passwordResetBundleSchema, "password_resets");

export async function mongoGetSlots(): Promise<BookingSlot[]> {
  await connectDB();
  const doc = await SlotBundleModel.findById("main").lean();
  return (doc?.slots as BookingSlot[]) ?? [];
}

export async function mongoSaveSlots(slots: BookingSlot[]) {
  await connectDB();
  await SlotBundleModel.findByIdAndUpdate("main", { $set: { slots } }, { upsert: true, new: true });
}

export async function mongoGetContent(): Promise<EditableSiteContent | null> {
  await connectDB();
  const doc = await SiteContentModel.findById("main").lean();
  return (doc?.data as EditableSiteContent) ?? null;
}

export async function mongoSaveContent(content: EditableSiteContent) {
  await connectDB();
  await SiteContentModel.findByIdAndUpdate("main", { $set: { data: content } }, { upsert: true, new: true });
}

export async function mongoGetNotifications(): Promise<AdminNotification[]> {
  await connectDB();
  return (await NotificationModel.find().lean()) as AdminNotification[];
}

export async function mongoSaveNotifications(notifications: AdminNotification[]) {
  await connectDB();
  await NotificationModel.deleteMany({});
  if (notifications.length) await NotificationModel.insertMany(notifications);
}

export async function mongoGetAddresses(): Promise<SavedAddress[]> {
  await connectDB();
  return (await AddressModel.find().lean()) as SavedAddress[];
}

export async function mongoSaveAddresses(addresses: SavedAddress[]) {
  await connectDB();
  await AddressModel.deleteMany({});
  if (addresses.length) await AddressModel.insertMany(addresses);
}

export async function mongoGetPasswordResets(): Promise<PasswordResetRecord[]> {
  await connectDB();
  const doc = await PasswordResetBundleModel.findById("main").lean();
  return (doc?.records as PasswordResetRecord[]) ?? [];
}

export async function mongoSavePasswordResets(records: PasswordResetRecord[]) {
  await connectDB();
  await PasswordResetBundleModel.findByIdAndUpdate(
    "main",
    { $set: { records } },
    { upsert: true, new: true }
  );
}
