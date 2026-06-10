import { Lang } from "./i18n/translations";
import { uiStrings } from "./i18n/ui-strings";
import { CartItemType, Order, PaymentStatus } from "./types";

function statusLabels(lang: Lang) {
  return uiStrings[lang].status;
}

export function getDisplayStatus(
  paymentStatus: PaymentStatus,
  orderStatus?: Order["status"],
  itemType?: CartItemType,
  lang: Lang = "en"
): string {
  const s = statusLabels(lang);
  if (paymentStatus === "awaiting_approval") return s.pendingConfirmation;
  if (paymentStatus === "pending") return s.paymentPending;
  if (paymentStatus === "failed") return s.paymentFailed;
  if (paymentStatus === "refunded") return s.refunded;
  if (paymentStatus === "paid") {
    if (itemType === "product") {
      if (orderStatus === "delivered") return s.delivered;
      if (orderStatus === "shipped") return s.shipped;
      if (orderStatus === "processing") return s.processing;
      if (orderStatus === "pending") return s.ordered;
      if (orderStatus === "cancelled") return s.cancelled;
      return s.ordered;
    }
    if (orderStatus === "delivered") return s.delivered;
    if (orderStatus === "shipped") return s.shipped;
    if (orderStatus === "processing") return s.processing;
    if (orderStatus === "cancelled") return s.cancelled;
    return s.confirmed;
  }
  return paymentStatus;
}

const STYLE_KEYS: Record<string, string> = {
  pendingConfirmation: "bg-yellow-500/20 text-yellow-700",
  paymentPending: "bg-orange-500/20 text-orange-600",
  paymentFailed: "bg-red-500/20 text-red-500",
  refunded: "bg-gray-500/20 text-gray-600",
  ordered: "bg-gold/20 text-gold",
  delivered: "bg-green-500/20 text-green-600",
  shipped: "bg-blue-500/20 text-blue-600",
  processing: "bg-gold/20 text-gold",
  confirmed: "bg-gold/20 text-gold",
  cancelled: "bg-red-500/20 text-red-400",
};

function statusKey(
  paymentStatus: PaymentStatus,
  orderStatus?: Order["status"],
  itemType?: CartItemType
): keyof typeof STYLE_KEYS | null {
  if (paymentStatus === "awaiting_approval") return "pendingConfirmation";
  if (paymentStatus === "pending") return "paymentPending";
  if (paymentStatus === "failed") return "paymentFailed";
  if (paymentStatus === "refunded") return "refunded";
  if (paymentStatus === "paid") {
    if (itemType === "product") {
      if (orderStatus === "delivered") return "delivered";
      if (orderStatus === "shipped") return "shipped";
      if (orderStatus === "processing") return "processing";
      if (orderStatus === "pending") return "ordered";
      if (orderStatus === "cancelled") return "cancelled";
      return "ordered";
    }
    if (orderStatus === "delivered") return "delivered";
    if (orderStatus === "shipped") return "shipped";
    if (orderStatus === "processing") return "processing";
    if (orderStatus === "cancelled") return "cancelled";
    return "confirmed";
  }
  return null;
}

export function getStatusStyle(
  paymentStatus: PaymentStatus,
  orderStatus?: Order["status"],
  itemType?: CartItemType
): string {
  const key = statusKey(paymentStatus, orderStatus, itemType);
  if (key && STYLE_KEYS[key]) return STYLE_KEYS[key];
  return "bg-yellow-500/20 text-yellow-600";
}

/** @deprecated Use getStatusStyle(paymentStatus, orderStatus, itemType) */
export function getStatusStyleLegacy(displayStatus: string): string {
  const en = statusLabels("en");
  const hi = statusLabels("hi");
  const map: Record<string, keyof typeof STYLE_KEYS> = {
    [en.pendingConfirmation]: "pendingConfirmation",
    [hi.pendingConfirmation]: "pendingConfirmation",
    [en.paymentPending]: "paymentPending",
    [hi.paymentPending]: "paymentPending",
    [en.paymentFailed]: "paymentFailed",
    [hi.paymentFailed]: "paymentFailed",
    [en.refunded]: "refunded",
    [hi.refunded]: "refunded",
    [en.ordered]: "ordered",
    [hi.ordered]: "ordered",
    [en.delivered]: "delivered",
    [hi.delivered]: "delivered",
    [en.shipped]: "shipped",
    [hi.shipped]: "shipped",
    [en.processing]: "processing",
    [hi.processing]: "processing",
    [en.confirmed]: "confirmed",
    [hi.confirmed]: "confirmed",
    [en.cancelled]: "cancelled",
    [hi.cancelled]: "cancelled",
  };
  const key = map[displayStatus];
  return key ? STYLE_KEYS[key] : "bg-yellow-500/20 text-yellow-600";
}
