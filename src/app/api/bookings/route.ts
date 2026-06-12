import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isBirthProfileComplete } from "@/lib/profile";
import { logNotification } from "@/lib/notifications-store";
import { store } from "@/lib/store";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings =
    session.role === "admin"
      ? await store.bookings.getAll()
      : await store.bookings.getByUser(session.userId);

  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  const body = await req.json();
  const user = session ? await store.users.findById(session.userId) : null;
  const useProfileBirth = user && isBirthProfileComplete(user);

  const booking = await store.bookings.create({
    userId: session?.userId || "guest",
    userName: body.userName || user?.name,
    userEmail: body.userEmail || user?.email,
    userPhone: body.userPhone || user?.phone,
    serviceId: body.serviceId,
    serviceName: body.serviceName,
    date: body.date,
    time: body.time,
    status: "pending",
    notes: body.notes,
    dob: useProfileBirth ? user.dob : body.dob || undefined,
    birthTime: useProfileBirth ? user.birthTime : body.birthTime || undefined,
    birthPlace: useProfileBirth ? user.birthPlace : body.birthPlace || undefined,
    dobUnknown: useProfileBirth ? !!user.dobUnknown : !!body.dobUnknown,
    birthTimeUnknown: useProfileBirth ? !!user.birthTimeUnknown : !!body.birthTimeUnknown,
    birthPlaceUnknown: useProfileBirth ? !!user.birthPlaceUnknown : !!body.birthPlaceUnknown,
  });

  logNotification({
    type: "booking_submitted",
    userId: booking.userId,
    userName: booking.userName,
    referenceId: booking.id,
    message: `${booking.userName} requested ${booking.serviceName} on ${booking.date} ${booking.time}`,
    channel: "system",
  });

  return NextResponse.json({ booking }, { status: 201 });
}
