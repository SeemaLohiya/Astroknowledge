/** Tracks which user the persisted cart belongs to */
let cartUserId = "guest";

export function getCartUserId() {
  return cartUserId;
}

export function setCartUserId(userId: string | null) {
  cartUserId = userId || "guest";
}

export function cartStorageKey(base = "astroknowledge-cart") {
  return `${base}-${cartUserId}`;
}
