export const CITY_OTHERS_VALUE = "__others__";

export function normalizePhoneInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function isValidIndianPhone(phone: string) {
  return /^[6-9]\d{9}$/.test(normalizePhoneInput(phone));
}

export function formatPhoneDisplay(phone: string) {
  const digits = normalizePhoneInput(phone);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function isValidIndianPincode(pincode: string) {
  return /^\d{6}$/.test(pincode.trim());
}

export function normalizePincodeInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}
