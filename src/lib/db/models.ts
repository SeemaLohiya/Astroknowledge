import mongoose, { Schema } from "mongoose";

const catalogSchema = new Schema(
  {
    _id: { type: String, default: "main" },
    products: { type: [Schema.Types.Mixed], default: [] },
    services: { type: [Schema.Types.Mixed], default: [] },
    courses: { type: [Schema.Types.Mixed], default: [] },
    pooja: { type: [Schema.Types.Mixed], default: [] },
    healing: { type: [Schema.Types.Mixed], default: [] },
    categories: { type: [Schema.Types.Mixed], default: [] },
  },
  { _id: false, timestamps: true }
);

const userSchema = new Schema({}, { _id: false, strict: false });

const paymentSchema = new Schema({}, { _id: false, strict: false });

const voucherSchema = new Schema({}, { _id: false, strict: false });

const bookingSchema = new Schema({}, { _id: false, strict: false });

const orderSchema = new Schema({}, { _id: false, strict: false });

export const CatalogModel =
  mongoose.models.Catalog ?? mongoose.model("Catalog", catalogSchema, "catalog");

export const UserModel = mongoose.models.User ?? mongoose.model("User", userSchema, "users");

export const PaymentModel =
  mongoose.models.Payment ?? mongoose.model("Payment", paymentSchema, "payments");

export const VoucherModel =
  mongoose.models.Voucher ?? mongoose.model("Voucher", voucherSchema, "vouchers");

export const BookingModel =
  mongoose.models.Booking ?? mongoose.model("Booking", bookingSchema, "bookings");

export const OrderModel = mongoose.models.Order ?? mongoose.model("Order", orderSchema, "orders");
