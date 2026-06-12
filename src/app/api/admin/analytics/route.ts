import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { paymentsStore } from "@/lib/payments-store";
import { slotsStore } from "@/lib/slots-store";
import { store } from "@/lib/store";
import { PaymentRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Count verified paid transactions (admin-approved or Razorpay). */
function isRealPaidPayment(p: PaymentRecord) {
  if (p.status !== "paid") return false;
  if (!p.userId || !p.amount || p.amount <= 0) return false;
  return true;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await paymentsStore.getAll();
    const paid = payments.filter(isRealPaidPayment);
    const pendingPayments = payments.filter((p) => p.status === "awaiting_approval" || p.status === "pending");
    const revenue = paid.reduce((s, p) => s + p.amount, 0);
    const slots = await slotsStore.getAll();
    const pendingSlots = slots.filter((s) => s.status === "pending").length;
    const allBookings = await store.bookings.getAll();
    const legacyPending = allBookings.filter((b) => b.status === "pending").length;
    const allOrders = await store.orders.getAll();
    const users = (await store.users.getAll()).filter((u) => u.role === "user");

    const serviceCounts: Record<string, number> = {};
    const categoryRevenue: Record<string, number> = { product: 0, service: 0, course: 0, pooja: 0, healing: 0 };
    const categoryCounts: Record<string, number> = { product: 0, service: 0, course: 0, pooja: 0, healing: 0 };
    const methodRevenue = { razorpay: 0, admin_approval: 0 };
    const methodCounts = { razorpay: 0, admin_approval: 0 };

    paid.forEach((p) => {
      const method = p.method || "admin_approval";
      if (method === "razorpay") {
        methodRevenue.razorpay += p.amount;
        methodCounts.razorpay += 1;
      } else {
        methodRevenue.admin_approval += p.amount;
        methodCounts.admin_approval += 1;
      }
      (p.items ?? []).forEach((i) => {
        serviceCounts[i.name] = (serviceCounts[i.name] || 0) + i.quantity;
        const cat = i.itemType || "product";
        categoryRevenue[cat] = (categoryRevenue[cat] || 0) + i.price * i.quantity;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + i.quantity;
      });
    });

    const topItems = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    const now = new Date();
    const monthlyMap: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyMap[monthKey(d.toISOString())] = 0;
    }
    paid.forEach((p) => {
      const key = monthKey(p.createdAt);
      if (key in monthlyMap) monthlyMap[key] += p.amount;
    });
    const monthlyRevenue = Object.entries(monthlyMap).map(([key, amount]) => {
      const [, m] = key.split("-");
      return { month: MONTH_LABELS[parseInt(m, 10) - 1], amount };
    });

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const newUsersThisMonth = users.filter((u) => new Date(u.createdAt) >= thirtyDaysAgo).length;

    const bookingStats = {
      total: slots.filter((s) => s.status === "booked" || s.status === "pending").length + allBookings.length,
      pending: pendingSlots + legacyPending,
      confirmed: slots.filter((s) => s.status === "booked").length + allBookings.filter((b) => b.status === "confirmed").length,
      completed: allBookings.filter((b) => b.status === "completed").length,
    };

    const orderRevenue = allOrders.reduce((s, o) => s + o.total, 0);
    const avgOrderValue =
      allOrders.length > 0
        ? Math.round(orderRevenue / allOrders.length)
        : paid.length > 0
          ? Math.round(revenue / paid.length)
          : 0;
    const checkoutAttempts = payments.filter((p) => p.type === "checkout" || p.type === "order").length;
    const conversionRate = checkoutAttempts > 0 ? Math.round((paid.length / checkoutAttempts) * 100) : 0;

    return NextResponse.json({
      revenue,
      paidCount: paid.length,
      pendingPayments: pendingPayments.length,
      pendingBookings: pendingSlots + legacyPending,
      totalOrders: allOrders.length,
      totalPayments: payments.length,
      awaitingApproval: payments.filter((p) => p.status === "awaiting_approval").length,
      totalUsers: users.length,
      newUsersThisMonth,
      avgOrderValue,
      conversionRate,
      topItems,
      methodRevenue,
      methodCounts,
      categoryRevenue,
      categoryCounts,
      monthlyRevenue,
      bookingStats,
      recentRevenue: [...paid]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 10)
        .map((p) => ({
        id: p.id,
        userName: p.userName,
        amount: p.amount,
        method: p.method,
        createdAt: p.createdAt,
      })),
    });
  } catch (err) {
    console.error("[admin/analytics]", err);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
