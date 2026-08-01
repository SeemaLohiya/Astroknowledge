import { CartItemType, OrderStatus } from "./types";

export const BOOKING_ITEM_TYPES: CartItemType[] = ["pooja", "healing"];

export const BOOKING_ORDER_STATUSES: OrderStatus[] = ["pending", "processing", "delivered", "cancelled"];

const SHARED_LABELS: Record<OrderStatus, string> = {
  pending: "Purchased",
  processing: "Our team will connect you",
  shipped: "Our team will connect you",
  delivered: "",
  cancelled: "Cancelled",
};

const COMPLETED_LABELS: Partial<Record<CartItemType, string>> = {
  pooja: "Pooja completed",
  healing: "Healing completed",
};

const STATUS_NOTES: Record<"pooja" | "healing", Record<OrderStatus, string>> = {
  pooja: {
    pending: "Payment received — your pooja booking is confirmed.",
    processing: "Our team will contact you shortly to schedule the ritual.",
    shipped: "Our team will contact you shortly to schedule the ritual.",
    delivered: "Pooja has been completed successfully.",
    cancelled: "This pooja order was cancelled.",
  },
  healing: {
    pending: "Payment received — your healing session is confirmed.",
    processing: "Our team will contact you shortly to schedule your session.",
    shipped: "Our team will contact you shortly to schedule your session.",
    delivered: "Healing session has been completed successfully.",
    cancelled: "This healing order was cancelled.",
  },
};

export function isBookingItemType(itemType?: CartItemType): itemType is "pooja" | "healing" {
  return itemType === "pooja" || itemType === "healing";
}

export function bookingStatusLabel(status: OrderStatus, itemType: CartItemType): string {
  if (status === "delivered" && isBookingItemType(itemType)) {
    return COMPLETED_LABELS[itemType] || "Completed";
  }
  return SHARED_LABELS[status] || status;
}

export function bookingStatusNote(status: OrderStatus, itemType: CartItemType): string {
  if (isBookingItemType(itemType)) {
    return STATUS_NOTES[itemType][status] || `Status updated to ${bookingStatusLabel(status, itemType)}`;
  }
  return `Status updated to ${status}`;
}
