import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { store } from "@/lib/store";
import { sanitizeUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const search = req.nextUrl.searchParams.get("search")?.toLowerCase() || "";
  const role = req.nextUrl.searchParams.get("role");
  const includeSuspended = req.nextUrl.searchParams.get("includeSuspended") === "1";

  let users = (await store.users.getAll()).map(sanitizeUser);

  if (role && role !== "all") {
    users = users.filter((u) => u.role === role);
  }
  if (!includeSuspended) {
    users = users.filter((u) => u.accountStatus !== "suspended");
  }
  if (search) {
    users = users.filter((u) =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search) ||
      u.phone?.toLowerCase().includes(search) ||
      u.id.toLowerCase().includes(search) ||
      u.dob?.toLowerCase().includes(search) ||
      u.birthTime?.toLowerCase().includes(search) ||
      u.birthPlace?.toLowerCase().includes(search) ||
      u.createdAt.toLowerCase().includes(search)
    );
  }

  return NextResponse.json({ users });
}
