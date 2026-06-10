import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { slotsStore } from "@/lib/slots-store";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const mine = req.nextUrl.searchParams.get("mine");
  const status = req.nextUrl.searchParams.get("status");
  const date = req.nextUrl.searchParams.get("date");
  const client = req.nextUrl.searchParams.get("client")?.toLowerCase();
  const service = req.nextUrl.searchParams.get("service");

  if (mine === "true" && session) {
    return NextResponse.json({ slots: slotsStore.getByUser(session.userId) });
  }

  let slots = session?.role === "admin" ? slotsStore.getAll() : slotsStore.getAvailable();

  if (status && status !== "all") slots = slots.filter((s) => s.status === status);
  if (date) slots = slots.filter((s) => s.date === date);
  if (client) slots = slots.filter((s) => s.userName?.toLowerCase().includes(client));
  if (service && service !== "all") slots = slots.filter((s) => s.serviceId === service || s.serviceName === service);

  return NextResponse.json({ slots, pendingCount: slotsStore.getPending().length });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();

  if (body.bulk && Array.isArray(body.slots)) {
    const created = slotsStore.bulkCreate(body.slots);
    return NextResponse.json({ slots: created, count: created.length }, { status: 201 });
  }

  const slot = slotsStore.create({
    date: body.date,
    time: body.time,
    duration: body.duration || "30 min",
    status: body.status || "available",
  });
  return NextResponse.json({ slot }, { status: 201 });
}
