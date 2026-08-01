import mongoose, { Schema } from "mongoose";
import {
  AdminNotification,
  BookingSlot,
  EditableSiteContent,
  SavedAddress,
  SupportMessage,
  SupportThread,
} from "../types";
import type { AdminRevenueData } from "../admin-revenue-store";
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
const supportBundleSchema = new Schema(
  {
    _id: { type: String, default: "main" },
    threads: { type: [Schema.Types.Mixed], default: [] },
    messages: { type: [Schema.Types.Mixed], default: [] },
  },
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
const SupportBundleModel =
  mongoose.models.SupportBundle ??
  mongoose.model("SupportBundle", supportBundleSchema, "support_chats");

const adminRevenueBundleSchema = new Schema(
  {
    _id: { type: String, default: "main" },
    overrides: { type: Schema.Types.Mixed, default: {} },
    extraRows: { type: [Schema.Types.Mixed], default: [] },
    summaryNote: { type: String },
  },
  { _id: false, timestamps: true }
);

const AdminRevenueBundleModel =
  mongoose.models.AdminRevenueBundle ??
  mongoose.model("AdminRevenueBundle", adminRevenueBundleSchema, "admin_revenue");

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

export async function mongoGetSupport(): Promise<{
  threads: SupportThread[];
  messages: SupportMessage[];
}> {
  await connectDB();
  const doc = await SupportBundleModel.findById("main").lean();
  return {
    threads: (doc?.threads as SupportThread[]) ?? [],
    messages: (doc?.messages as SupportMessage[]) ?? [],
  };
}

export async function mongoSaveSupport(data: {
  threads: SupportThread[];
  messages: SupportMessage[];
}) {
  await connectDB();
  await SupportBundleModel.findByIdAndUpdate(
    "main",
    { $set: { threads: data.threads, messages: data.messages } },
    { upsert: true, new: true }
  );
}

export async function mongoGetAdminRevenue(): Promise<AdminRevenueData> {
  await connectDB();
  const doc = await AdminRevenueBundleModel.findById("main").lean();
  return {
    overrides: (doc?.overrides as AdminRevenueData["overrides"]) ?? {},
    extraRows: (doc?.extraRows as AdminRevenueData["extraRows"]) ?? [],
    summaryNote: (doc?.summaryNote as string) || undefined,
  };
}

export async function mongoSaveAdminRevenue(data: AdminRevenueData) {
  await connectDB();
  await AdminRevenueBundleModel.findByIdAndUpdate(
    "main",
    { $set: { overrides: data.overrides, extraRows: data.extraRows, summaryNote: data.summaryNote } },
    { upsert: true, new: true }
  );
}
