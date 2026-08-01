import { OrderStatus } from "./types";
import { BOOKING_ORDER_STATUSES, bookingStatusLabel, bookingStatusNote } from "./booking-order-status";

/** @deprecated Import from booking-order-status instead */
export const POOJA_ORDER_STATUSES = BOOKING_ORDER_STATUSES;

/** @deprecated Use bookingStatusLabel(status, "pooja") */
export function poojaStatusLabel(status: OrderStatus): string {
  return bookingStatusLabel(status, "pooja");
}

/** @deprecated Use bookingStatusNote(status, "pooja") */
export function poojaStatusNote(status: OrderStatus): string {
  return bookingStatusNote(status, "pooja");
}
