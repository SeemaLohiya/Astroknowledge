import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession, sanitizeUser } from "@/lib/auth";
import { isBirthProfileComplete } from "@/lib/profile";
import { store } from "@/lib/store";

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = store.users.findById(session.userId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const {
    dob,
    birthTime,
    birthPlace,
    birthCountry,
    birthState,
    birthCity,
    dobUnknown,
    birthTimeUnknown,
    birthPlaceUnknown,
    name,
    phone,
    fatherName,
    gotra,
    gender,
  } = body;

  if (name?.trim()) user.name = name.trim();
  if (phone !== undefined) user.phone = phone?.trim() || "";
  if (fatherName !== undefined) user.fatherName = fatherName?.trim() || undefined;
  if (gotra !== undefined) user.gotra = gotra?.trim() || undefined;
  if (gender !== undefined) user.gender = gender || undefined;

  const updatingBirth =
    dob !== undefined ||
    birthTime !== undefined ||
    birthPlace !== undefined ||
    birthCountry !== undefined ||
    birthState !== undefined ||
    birthCity !== undefined ||
    dobUnknown !== undefined ||
    birthTimeUnknown !== undefined ||
    birthPlaceUnknown !== undefined;

  if (updatingBirth) {
    user.dob = dobUnknown ? undefined : dob?.trim() || undefined;
    user.birthTime = birthTimeUnknown ? undefined : birthTime?.trim() || undefined;
    user.birthCountry = birthPlaceUnknown ? undefined : birthCountry?.trim() || undefined;
    user.birthState = birthPlaceUnknown ? undefined : birthState?.trim() || undefined;
    user.birthCity = birthPlaceUnknown ? undefined : birthCity?.trim() || undefined;
    user.birthPlace = birthPlaceUnknown
      ? undefined
      : birthPlace?.trim() ||
        [birthCity, birthState, birthCountry].filter((v) => v?.trim()).join(", ") ||
        undefined;
    user.dobUnknown = !!dobUnknown;
    user.birthTimeUnknown = !!birthTimeUnknown;
    user.birthPlaceUnknown = !!birthPlaceUnknown;

    if (!isBirthProfileComplete(user)) {
      return NextResponse.json(
        { error: "Please provide each birth detail or mark it as not known" },
        { status: 400 }
      );
    }
    user.birthDetailsUpdatedAt = new Date().toISOString();
  }

  store.users.persist(user);
  return NextResponse.json({ user: sanitizeUser(user) });
}
