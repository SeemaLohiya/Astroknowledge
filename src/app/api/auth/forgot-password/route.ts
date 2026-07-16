import { NextRequest, NextResponse } from "next/server";
import { sendPasswordOtpEmail } from "@/lib/email";
import { passwordResetStore } from "@/lib/password-reset-store";
import { store } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const normalized = String(email || "").trim().toLowerCase();
    if (!normalized || !normalized.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    const user = await store.users.findByEmail(normalized);

    // Always return success to avoid email enumeration
    if (!user || user.accountStatus === "suspended") {
      return NextResponse.json({
        success: true,
        message: "If an account exists for this email, a verification code has been sent.",
      });
    }

    if (!process.env.RESEND_API_KEY?.trim()) {
      return NextResponse.json(
        { error: "Email service is not configured. Please contact support." },
        { status: 503 }
      );
    }

    const { otp } = await passwordResetStore.createOtp(normalized);
    await sendPasswordOtpEmail(normalized, otp, user.name);

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email. Check inbox and spam folder.",
    });
  } catch (err) {
    console.error("Forgot password failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not send OTP. Try again." },
      { status: 500 }
    );
  }
}
