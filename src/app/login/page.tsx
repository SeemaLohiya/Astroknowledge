"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { FounderImage } from "@/components/animations/FounderImage";
import { PageTransition } from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/Button";
import { useProfile } from "@/components/profile/ProfileGate";
import { parseResponseJson } from "@/lib/fetch-json";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { User } from "@/lib/types";
import { BookOpen, Shield, Sparkles, Star } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

type AuthTab = "login" | "register";
type ForgotStep = null | "email" | "otp" | "reset";

function LoginContent() {
  const { c } = useLanguage();
  const a = c.auth;
  const router = useRouter();
  const { updateUser, user, authReady, loading } = useProfile();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";
  const [tab, setTab] = useState<AuthTab>("login");
  const [submitting, setSubmitting] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>(null);
  const [resetToken, setResetToken] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  useEffect(() => {
    if (!authReady || loading) return;
    if (!user) return;
    router.replace(user.role === "admin" ? "/admin" : redirect || "/dashboard");
  }, [authReady, loading, user, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (tab === "register") {
        if (form.password !== form.confirmPassword) {
          toast.error(a.passwordMismatch);
          setSubmitting(false);
          return;
        }
        if (form.password.length < 6) {
          toast.error(c.checkout.passwordMin);
          setSubmitting(false);
          return;
        }
      }

      const endpoint = tab === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = tab === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, phone: form.phone, password: form.password };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await parseResponseJson<{ error?: string; user?: Omit<User, "password"> }>(res);
      if (!res.ok || !data?.user) { toast.error(data?.error || a.loginFailed); return; }
      updateUser(data.user);
      toast.success(tab === "login" ? a.welcomeBack : a.accountCreated);
      router.replace(
        data.user.role === "admin" ? "/admin" : redirect || "/dashboard"
      );
    } catch {
      toast.error(a.somethingWrong);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (forgotStep === "email") {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });
        const data = await parseResponseJson<{ error?: string; message?: string }>(res);
        if (!res.ok) throw new Error(data?.error || a.otpSendFailed);
        toast.success(data?.message || a.otpSent);
        setForgotStep("otp");
        return;
      }

      if (forgotStep === "otp") {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, otp: form.otp }),
        });
        const data = await parseResponseJson<{ error?: string; resetToken?: string; message?: string }>(res);
        if (!res.ok || !data?.resetToken) throw new Error(data?.error || a.otpInvalid);
        setResetToken(data.resetToken);
        toast.success(data.message || a.otpVerified);
        setForgotStep("reset");
        setForm((f) => ({ ...f, password: "", confirmPassword: "" }));
        return;
      }

      if (forgotStep === "reset") {
        if (form.password.length < 6) {
          toast.error(c.checkout.passwordMin);
          return;
        }
        if (form.password !== form.confirmPassword) {
          toast.error(a.passwordMismatch);
          return;
        }
        const res = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            resetToken,
            password: form.password,
            confirmPassword: form.confirmPassword,
          }),
        });
        const data = await parseResponseJson<{ error?: string; message?: string }>(res);
        if (!res.ok) throw new Error(data?.error || a.resetFailed);
        toast.success(data?.message || a.resetSuccess);
        setForgotStep(null);
        setResetToken("");
        setTab("login");
        setForm((f) => ({ ...f, password: "", confirmPassword: "", otp: "" }));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : a.somethingWrong);
    } finally {
      setSubmitting(false);
    }
  };

  if (!authReady || loading) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center px-3 py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      </section>
    );
  }

  if (user) return null;

  const inputCls = "w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-gold focus:outline-none";

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-3 py-12 sm:px-4 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <FadeIn className="mb-8 flex flex-col items-center text-center">
          <FounderImage size="sm" showRing={false} />
          <h1 className="mt-4 font-display text-3xl font-bold text-text-primary">{a.welcomeTitle}</h1>
          <p className="mt-2 text-sm text-text-body">{a.welcomeSubtitle}</p>
        </FadeIn>

        <div className="mb-6 grid grid-cols-3 gap-2">
          {[
            { icon: Sparkles, text: a.featureKundli },
            { icon: Star, text: a.featureConsult },
            { icon: BookOpen, text: a.featureRemedies },
          ].map((f) => (
            <div key={f.text} className="rounded-xl border border-gold/15 bg-white/60 px-2 py-3 text-center">
              <f.icon className="mx-auto h-4 w-4 text-gold mb-1" />
              <p className="text-[10px] font-medium text-text-body leading-tight">{f.text}</p>
            </div>
          ))}
        </div>

        <FadeIn>
          <div className="rounded-2xl glass-card p-8">
            {forgotStep ? (
              <>
                <h2 className="mb-1 text-lg font-semibold text-text-primary">{a.forgotTitle}</h2>
                <p className="mb-5 text-sm text-text-body">
                  {forgotStep === "email" && a.forgotEmailHint}
                  {forgotStep === "otp" && a.forgotOtpHint}
                  {forgotStep === "reset" && a.forgotResetHint}
                </p>
                <form onSubmit={handleForgot} className="space-y-4">
                  {(forgotStep === "email" || forgotStep === "otp") && (
                    <input
                      type="email"
                      placeholder={a.emailPlaceholder}
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputCls}
                      disabled={forgotStep === "otp"}
                    />
                  )}
                  {forgotStep === "otp" && (
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      placeholder={a.otpPlaceholder}
                      required
                      value={form.otp}
                      onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                      className={inputCls}
                    />
                  )}
                  {forgotStep === "reset" && (
                    <>
                      <input
                        type="password"
                        placeholder={a.newPasswordPlaceholder}
                        required
                        minLength={6}
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className={inputCls}
                      />
                      <input
                        type="password"
                        placeholder={a.confirmPasswordPlaceholder}
                        required
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        className={inputCls}
                      />
                    </>
                  )}
                  <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={submitting}>
                    {submitting
                      ? c.pleaseWait
                      : forgotStep === "email"
                        ? a.sendOtp
                        : forgotStep === "otp"
                          ? a.verifyOtp
                          : a.resetPassword}
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep(null);
                      setResetToken("");
                      setForm((f) => ({ ...f, otp: "", password: "", confirmPassword: "" }));
                    }}
                    className="w-full text-center text-sm text-gold hover:underline"
                  >
                    {a.backToLogin}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-6 flex rounded-full bg-orange/5 p-1">
                  {(["login", "register"] as const).map((t) => (
                    <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all ${tab === t ? "bg-gold text-white" : "text-text-body"}`}>
                      {t === "login" ? a.login : a.createAccount}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {tab === "register" && (
                    <>
                      <input type="text" placeholder={a.namePlaceholder} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                      <input type="tel" placeholder={a.phonePlaceholder} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} />
                    </>
                  )}
                  <input type="email" placeholder={a.emailPlaceholder} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
                  <input type="password" placeholder={a.passwordPlaceholder} required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} />
                  {tab === "register" && (
                    <input type="password" placeholder={a.confirmPasswordPlaceholder} required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className={inputCls} />
                  )}
                  {tab === "login" && (
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => setForgotStep("email")}
                        className="text-sm font-medium text-gold hover:underline"
                      >
                        {a.forgotPassword}
                      </button>
                    </div>
                  )}
                  {tab === "register" && (
                    <p className="flex items-start gap-2 text-xs text-text-muted">
                      <Shield className="h-3.5 w-3.5 shrink-0 text-gold mt-0.5" />
                      {a.birthDetailsHint}
                    </p>
                  )}
                  <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? c.pleaseWait : tab === "login" ? a.login : a.createAccount}
                  </Button>
                </form>
              </>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <PageTransition>
      <Suspense><LoginContent /></Suspense>
    </PageTransition>
  );
}
