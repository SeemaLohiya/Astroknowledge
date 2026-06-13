export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin";
  createdAt: string;
  /** active = normal; suspended = temporary block (admin can restore) */
  accountStatus?: "active" | "suspended";
  suspendedAt?: string;
  dob?: string;
  birthTime?: string;
  birthPlace?: string;
  birthCountry?: string;
  birthState?: string;
  birthCity?: string;
  fatherName?: string;
  gotra?: string;
  gender?: "male" | "female" | "other";
  dobUnknown?: boolean;
  birthTimeUnknown?: boolean;
  birthPlaceUnknown?: boolean;
  birthDetailsUpdatedAt?: string;
}

export interface Service {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  features: string[];
  popular?: boolean;
}

export interface Course {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  sessionDescription?: string;
  duration: string;
  price: number;
  image: string;
  features: string[];
  popular?: boolean;
}

export type CatalogType = "products" | "services" | "courses" | "pooja" | "healing";

export interface BookingSlot {
  id: string;
  date: string;
  time: string;
  duration: string;
  serviceId?: string;
  serviceName?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  dob?: string;
  birthTime?: string;
  birthPlace?: string;
  dobUnknown?: boolean;
  birthTimeUnknown?: boolean;
  birthPlaceUnknown?: boolean;
  status: "available" | "pending" | "booked" | "blocked";
  paymentStatus?: "unpaid" | "pending" | "paid" | "refunded";
  paymentAmount?: number;
  bookedAt?: string;
  confirmedAt?: string;
  createdAt: string;
}

export type CartItemType = "product" | "service" | "course" | "pooja" | "healing";

export type VoucherDiscountType = "percent" | "fixed";

export interface Voucher {
  id: string;
  code: string;
  label: string;
  description?: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  assignedUserIds: string[];
  applicableItemTypes?: CartItemType[];
  applicableItemIds?: string[];
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface HealingService {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  duration: string;
  price: number;
  image: string;
  benefits: string[];
  popular?: boolean;
}

export type PaymentMethod = "razorpay" | "admin_approval";

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed" | "awaiting_approval";

export interface PaymentRecord {
  id: string;
  type: "checkout" | "order" | "slot";
  referenceId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  description: string;
  amount: number;
  subtotal?: number;
  discountAmount?: number;
  voucherCode?: string;
  voucherId?: string;
  status: PaymentStatus;
  method?: PaymentMethod;
  transactionRefId?: string;
  paymentProofImage?: string;
  adminComment?: string;
  items: { id: string; itemType: CartItemType; name: string; price: number; quantity: number; image: string }[];
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi?: string;
  image: string;
}

export interface AchievementPhoto {
  id: string;
  image: string;
  title: string;
  titleHindi: string;
  alt: string;
  description?: string;
}

export interface CertificationEntry {
  id: string;
  title: string;
  titleHindi?: string;
  subtitle?: string;
}

export interface Product {
  id: string;
  name: string;
  nameHindi: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  energized: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameHindi: string;
  icon: string;
  description: string;
  image: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  dob?: string;
  birthTime?: string;
  birthPlace?: string;
  dobUnknown?: boolean;
  birthTimeUnknown?: boolean;
  birthPlaceUnknown?: boolean;
  createdAt: string;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderTrackingEvent {
  status: OrderStatus;
  note?: string;
  at: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  total: number;
  status: OrderStatus;
  trackingId?: string;
  shippingAddress?: string;
  trackingHistory?: OrderTrackingEvent[];
  createdAt: string;
}

export interface SavedAddress {
  id: string;
  userId: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  type: "payment_approved" | "payment_rejected" | "payment_received" | "booking_confirmed" | "order_shipped" | "payment_submitted" | "booking_submitted" | "slot_booked" | "slot_confirmed";
  userId?: string;
  userName?: string;
  referenceId?: string;
  message: string;
  channel: "system" | "whatsapp";
  createdAt: string;
}

export interface EditableSiteContent {
  faqs: { en: { q: string; a: string }[]; hi: { q: string; a: string }[] };
  reviews: Review[];
  achievementPhotos: AchievementPhoto[];
  certifications: CertificationEntry[];
  problemCategories: ProblemCategory[];
}

export interface UnifiedBookingItem {
  id: string;
  source: "request" | "slot";
  serviceName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface UserPurchase {
  id: string;
  paymentId?: string;
  orderId?: string;
  paymentStatus: PaymentStatus;
  orderStatus?: Order["status"];
  method?: PaymentMethod;
  transactionRefId?: string;
  paymentProofImage?: string;
  adminComment?: string;
  items: { id: string; itemType: CartItemType; name: string; price: number; quantity: number; image: string }[];
  total: number;
  createdAt: string;
}

export interface Rashifal {
  sign: string;
  signHindi: string;
  symbol: string;
  date: string;
  prediction: string;
  luckyNumber: number;
  luckyColor: string;
  health: string;
  career: string;
  love: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  publishedAt: string;
  readTime: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  commentHindi?: string;
  date: string;
  service?: string;
}

export interface ProblemCategory {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  icon: string;
  image: string;
  remedies: string[];
}

export interface PoojaService {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  price: number;
  duration: string;
  benefits: string[];
  image: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryTime: string;
  includes: string[];
  image: string;
  pages: string;
  popular?: boolean;
  instant?: boolean;
}

export interface ReportComparisonFeature {
  name: string;
  kundli: boolean | string;
  health: boolean | string;
  love: boolean | string;
  fortune: boolean | string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface KundaliRequest {
  id: string;
  name: string;
  dob: string;
  time: string;
  place: string;
  userId?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  itemType: CartItemType;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
