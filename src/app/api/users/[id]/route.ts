import { NextRequest, NextResponse } from "next/server";
import { getSession, sanitizeUser } from "@/lib/auth";
import { store } from "@/lib/store";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const user = store.users.findById(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.role && (body.role === "admin" || body.role === "user")) {
    user.role = body.role;
  }
  if (body.name !== undefined) user.name = body.name?.trim() || user.name;
  if (body.email !== undefined) user.email = body.email?.trim() || user.email;
  if (body.phone !== undefined) user.phone = body.phone?.trim() || "";

  if (body.dobUnknown !== undefined) user.dobUnknown = !!body.dobUnknown;
  if (body.birthTimeUnknown !== undefined) user.birthTimeUnknown = !!body.birthTimeUnknown;
  if (body.birthPlaceUnknown !== undefined) user.birthPlaceUnknown = !!body.birthPlaceUnknown;

  if (body.dobUnknown) user.dob = undefined;
  else if (body.dob !== undefined) user.dob = body.dob?.trim() || undefined;

  if (body.birthTimeUnknown) user.birthTime = undefined;
  else if (body.birthTime !== undefined) user.birthTime = body.birthTime?.trim() || undefined;

  if (body.birthPlaceUnknown) user.birthPlace = undefined;
  else if (body.birthPlace !== undefined) user.birthPlace = body.birthPlace?.trim() || undefined;

  const birthTouched =
    body.dob !== undefined ||
    body.birthTime !== undefined ||
    body.birthPlace !== undefined ||
    body.dobUnknown !== undefined ||
    body.birthTimeUnknown !== undefined ||
    body.birthPlaceUnknown !== undefined;
  if (birthTouched) user.birthDetailsUpdatedAt = new Date().toISOString();

  store.users.persist(user);
  return NextResponse.json({ user: sanitizeUser(user) });
}
