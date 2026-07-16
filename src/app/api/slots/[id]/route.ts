import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isBirthProfileComplete } from "@/lib/profile";
import { getPaidServices, hasPaidServiceAccess } from "@/lib/purchases";
import { logNotification } from "@/lib/notifications-store";
import { slotsStore } from "@/lib/slots-store";
import { store } from "@/lib/store";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  if (body.action === "book") {
    if (!(await hasPaidServiceAccess(session.userId))) {
      return NextResponse.json(
        { error: "Purchase and pay for a consultation service or course first" },
        { status: 403 }
      );
    }
    const paidServices = await getPaidServices(session.userId);
    if (body.serviceId && !paidServices.some((s) => s.id === body.serviceId)) {
      return NextResponse.json(
        { error: "You can only book slots for services or courses you have purchased" },
        { status: 403 }
      );
    }
    if (body.serviceId) {
      const existing = await slotsStore.getActiveForItem(session.userId, body.serviceId);
      if (existing) {
        return NextResponse.json(
          {
            error:
              "You already have one slot booked for this item. Cancel it first to book a different time.",
            existingSlotId: existing.id,
          },
          { status: 409 }
        );
      }
    }
    const user = await store.users.findById(session.userId);
    if (!user || !isBirthProfileComplete(user)) {
      return NextResponse.json({ error: "Complete your birth details before booking a slot" }, { status: 403 });
    }
    let paymentAmount = body.paymentAmount;
    if (!paymentAmount && body.serviceId) {
      const { catalogStore } = await import("@/lib/catalog-store");
      const service =
        ((await catalogStore.getById("services", body.serviceId)) as { price?: number } | undefined) ||
        ((await catalogStore.getById("courses", body.serviceId)) as { price?: number } | undefined);
      paymentAmount = service?.price;
    }
    const slot = await slotsStore.book(id, {
      userId: session.userId,
      userName: body.userName || session.name,
      userEmail: body.userEmail || session.email,
      userPhone: body.userPhone || user?.phone || "",
      serviceId: body.serviceId,
      serviceName: body.serviceName,
      paymentAmount,
      dob: user.dob,
      birthTime: user.birthTime,
      birthPlace: user.birthPlace,
      dobUnknown: user.dobUnknown,
      birthTimeUnknown: user.birthTimeUnknown,
      birthPlaceUnknown: user.birthPlaceUnknown,
    });
    if (!slot) return NextResponse.json({ error: "Slot unavailable" }, { status: 409 });
    await logNotification({
      type: "slot_booked",
      userId: session.userId,
      userName: slot.userName,
      referenceId: slot.id,
      message: `${slot.userName} booked slot ${slot.date} ${slot.time} for ${slot.serviceName || "consultation"}`,
      channel: "system",
    });
    return NextResponse.json({
      slot,
      message: "Booking submitted for online consultation. Awaiting admin confirmation.",
    });
  }

  if (body.action === "cancel") {
    const slot = await slotsStore.cancelByUser(id, session.userId);
    if (!slot) {
      return NextResponse.json(
        { error: "Cannot cancel this slot. It may already be released or not belong to you." },
        { status: 400 }
      );
    }
    await logNotification({
      type: "slot_cancelled",
      userId: session.userId,
      userName: session.name,
      referenceId: id,
      message: `${session.name} cancelled their slot booking`,
      channel: "system",
    });
    return NextResponse.json({ slot, message: "Slot cancelled. You can now book a different time." });
  }

  if (session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (body.action === "confirm") {
    const slot = await slotsStore.confirm(id);
    if (!slot) return NextResponse.json({ error: "Cannot confirm" }, { status: 400 });
    await logNotification({
      type: "slot_confirmed",
      userId: slot.userId,
      userName: slot.userName,
      referenceId: slot.id,
      message: `Slot confirmed for ${slot.userName} — ${slot.date} ${slot.time}`,
      channel: "whatsapp",
    });
    return NextResponse.json({ slot });
  }

  if (body.action === "reject") {
    const slot = await slotsStore.reject(id);
    if (!slot) return NextResponse.json({ error: "Cannot reject" }, { status: 400 });
    return NextResponse.json({ slot });
  }

  if (body.paymentStatus) {
    const slot = await slotsStore.updatePaymentStatus(id, body.paymentStatus);
    if (!slot) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ slot });
  }

  if (body.status) {
    const slot = await slotsStore.updateStatus(id, body.status);
    if (!slot) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ slot });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await slotsStore.delete(id);
  return NextResponse.json({ success: true });
}
