import { Resend } from "resend";
import { SITE } from "./constants";

function getResend() {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

export function getPasswordResetFromEmail() {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    `AstroKnowledge <noreply@astroknowledge.in>`
  );
}

export async function sendPasswordOtpEmail(to: string, otp: string, name?: string) {
  const resend = getResend();
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const greeting = name ? `Namaste ${name},` : "Namaste,";
  const html = `
    <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #fffaf3; color: #2c1810;">
      <h1 style="color: #c45c26; font-size: 22px; margin-bottom: 8px;">${SITE.name}</h1>
      <p style="margin: 0 0 16px; color: #6b4f3a;">Password reset verification</p>
      <p>${greeting}</p>
      <p>Use this one-time code to reset your password. It expires in <strong>10 minutes</strong>.</p>
      <p style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #c45c26; text-align: center; padding: 16px; background: #fff; border: 1px solid #f0d4b8; border-radius: 12px;">
        ${otp}
      </p>
      <p style="font-size: 13px; color: #8a6a52;">If you did not request this, you can ignore this email. Your password will stay the same.</p>
      <p style="font-size: 12px; color: #a08068; margin-top: 24px;">— ${SITE.acharya}<br/>${SITE.name}</p>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: getPasswordResetFromEmail(),
    to: [to],
    subject: `${otp} is your ${SITE.name} password reset code`,
    html,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email");
  }
  return data;
}
