import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addressesStore } from "@/lib/addresses-store";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ addresses: await addressesStore.getByUser(session.userId) });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const address = await addressesStore.create({
    userId: session.userId,
    label: body.label?.trim() || "Home",
    name: body.name?.trim() || session.name,
    phone: body.phone?.trim() || "",
    line1: body.line1?.trim() || "",
    line2: body.line2?.trim(),
    city: body.city?.trim() || "",
    state: body.state?.trim() || "",
    country: body.country?.trim() || "India",
    pincode: body.pincode?.trim() || "",
    isDefault: !!body.isDefault,
  });
  return NextResponse.json({ address }, { status: 201 });
}
