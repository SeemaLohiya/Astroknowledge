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
  const user = await store.users.findById(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.role && (body.role === "admin" || body.role === "user")) {
    user.role = body.role;
  }
  if (body.name !== undefined) user.name = body.name?.trim() || user.name;
  if (body.email !== undefined) user.email = body.email?.trim() || user.email;
  if (body.phone !== undefined) user.phone = body.phone?.trim() || "";

  if (typeof body.password === "string") {
    const nextPassword = body.password.trim();
    if (nextPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    user.password = nextPassword;
  }

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

  if (body.courseResources !== undefined) {
    if (!Array.isArray(body.courseResources)) {
      return NextResponse.json({ error: "courseResources must be an array" }, { status: 400 });
    }
    user.courseResources = body.courseResources.map(
      (entry: { courseId?: string; links?: { id?: string; label?: string; url?: string }[] }) => ({
        courseId: String(entry.courseId || "").trim(),
        links: (entry.links || [])
          .filter((l) => l?.url?.trim())
          .map((l) => ({
            id: String(l.id || `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`),
            label: String(l.label || "Resource").trim() || "Resource",
            url: String(l.url).trim(),
          })),
      })
    ).filter((e: { courseId: string }) => e.courseId);
  }

  await store.users.persist(user);
  return NextResponse.json({ user: sanitizeUser(user) });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const user = await store.users.findById(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role === "admin") {
    return NextResponse.json({ error: "Cannot modify admin accounts" }, { status: 400 });
  }

  const action = req.nextUrl.searchParams.get("action") || "permanent";

  if (action === "suspend") {
    const updated = await store.users.suspend(id);
    if (!updated) return NextResponse.json({ error: "Could not suspend user" }, { status: 500 });
    return NextResponse.json({ user: sanitizeUser(updated), message: "User suspended temporarily" });
  }

  if (action === "restore") {
    const updated = await store.users.restore(id);
    if (!updated) return NextResponse.json({ error: "Could not restore user" }, { status: 500 });
    return NextResponse.json({ user: sanitizeUser(updated), message: "User restored" });
  }

  if (action === "permanent") {
    const ok = await store.users.remove(id);
    if (!ok) return NextResponse.json({ error: "Could not delete user" }, { status: 500 });
    return NextResponse.json({ success: true, message: "User permanently deleted" });
  }

  return NextResponse.json({ error: "Invalid action. Use suspend, restore, or permanent" }, { status: 400 });
}
