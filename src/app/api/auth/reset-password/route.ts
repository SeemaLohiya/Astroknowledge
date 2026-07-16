import { NextRequest, NextResponse } from "next/server";
import { passwordResetStore } from "@/lib/password-reset-store";
import { store } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { email, resetToken, password, confirmPassword } = await req.json();
    const normalized = String(email || "").trim().toLowerCase();
    const token = String(resetToken || "").trim();
    const nextPassword = String(password || "");
    const confirm = String(confirmPassword || "");

    if (!normalized || !token) {
      return NextResponse.json({ error: "Invalid reset session. Start again." }, { status: 400 });
    }
    if (nextPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    if (nextPassword !== confirm) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    const consumed = await passwordResetStore.consumeResetToken(normalized, token);
    if (!consumed.ok) {
      return NextResponse.json({ error: consumed.error }, { status: 400 });
    }

    const user = await store.users.findByEmail(normalized);
    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    if (user.accountStatus === "suspended") {
      return NextResponse.json({ error: "Account is suspended. Contact support." }, { status: 403 });
    }

    const updated = await store.users.update(user.id, { password: nextPassword });
    if (!updated) {
      return NextResponse.json({ error: "Could not update password" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. You can log in now.",
    });
  } catch (err) {
    console.error("Reset password failed:", err);
    return NextResponse.json({ error: "Could not reset password" }, { status: 500 });
  }
}
