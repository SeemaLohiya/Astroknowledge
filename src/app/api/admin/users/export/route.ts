import { NextRequest, NextResponse } from "next/server";
import { getSession, sanitizeUser } from "@/lib/auth";
import { addressesStore } from "@/lib/addresses-store";
import { paymentsStore } from "@/lib/payments-store";
import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

function escapeCsv(val: string) {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const format = req.nextUrl.searchParams.get("format") || "csv";
  const users = store.users.getAll().filter((u) => u.role === "user").map(sanitizeUser);

  const rows = users.map((u) => {
    const addrs = addressesStore.getByUser(u.id);
    const payments = paymentsStore.getByUser(u.id);
    const orders = store.orders.getAll().filter((o) => o.userId === u.id);
    const bookings = store.bookings.getAll().filter((b) => b.userId === u.id);
    const addrStr = addrs.map((a) => `${a.line1}, ${a.city}, ${a.state}, ${a.country || "India"} ${a.pincode}`).join(" | ");
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      gender: u.gender || "",
      dob: u.dobUnknown ? "Unknown" : u.dob || "",
      birthTime: u.birthTimeUnknown ? "Unknown" : u.birthTime || "",
      birthPlace: u.birthPlaceUnknown ? "Unknown" : u.birthPlace || "",
      joined: u.createdAt,
      addresses: addrStr,
      ordersCount: orders.length,
      paymentsCount: payments.length,
      bookingsCount: bookings.length,
      totalSpent: payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0),
    };
  });

  if (format === "json") {
    return NextResponse.json({ users: rows, exportedAt: new Date().toISOString() });
  }

  if (format === "html") {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>AstroKnowledge Users Export</title>
<style>body{font-family:Arial,sans-serif;padding:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;font-size:12px}th{background:#f59e0b;color:white}</style></head>
<body><h1>AstroKnowledge — User Data Export</h1><p>Generated: ${new Date().toLocaleString()}</p>
<table><thead><tr>${Object.keys(rows[0] || {}).map((k) => `<th>${k}</th>`).join("")}</tr></thead><tbody>
${rows.map((r) => `<tr>${Object.values(r).map((v) => `<td>${String(v)}</td>`).join("")}</tr>`).join("")}
</tbody></table></body></html>`;
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `attachment; filename="astroknowledge-users-${Date.now()}.html"`,
      },
    });
  }

  const headers = ["id", "name", "email", "phone", "gender", "dob", "birthTime", "birthPlace", "joined", "addresses", "ordersCount", "paymentsCount", "bookingsCount", "totalSpent"];
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escapeCsv(String(r[h as keyof typeof r] ?? ""))).join(",")),
  ].join("\n");

  const ext = format === "xlsx" ? "xlsx" : "csv";
  const mime = format === "xlsx" ? "application/vnd.ms-excel" : "text/csv; charset=utf-8";

  return new NextResponse(csv, {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `attachment; filename="astroknowledge-users-${Date.now()}.${ext}"`,
    },
  });
}
