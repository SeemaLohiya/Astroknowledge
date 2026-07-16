import { NextRequest, NextResponse } from "next/server";
import { passwordResetStore } from "@/lib/password-reset-store";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    const normalized = String(email || "").trim().toLowerCase();
    const code = String(otp || "").trim();

    if (!normalized || !code) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const result = await passwordResetStore.verifyOtp(normalized, code);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      resetToken: result.resetToken,
      message: "OTP verified. You can now set a new password.",
    });
  } catch (err) {
    console.error("Verify OTP failed:", err);
    return NextResponse.json({ error: "Could not verify OTP" }, { status: 500 });
  }
}
