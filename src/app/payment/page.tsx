"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { SafeImage } from "@/components/ui/SafeImage";
import { UpiPaymentPanel } from "@/components/payment/UpiPaymentPanel";
import { SITE } from "@/lib/constants";
import { useCartStore } from "@/lib/cart-store";
import { fetchJson, parseResponseJson } from "@/lib/fetch-json";
import { PaymentRecord } from "@/lib/types";
import { CreditCard, IndianRupee, ShieldCheck, Upload, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function PaymentContent() {
  const { c } = useLanguage();
  const p = c.payment;
  const d = c.dashboard;
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("id");
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [transactionRefId, setTransactionRefId] = useState("");
  const [paymentProofImage, setPaymentProofImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!paymentId) {
      router.push("/cart");
      return;
    }
    void fetchJson<{ payment?: PaymentRecord }>(`/api/payments/${paymentId}`).then((res) => {
      if (res.data?.payment) setPayment(res.data.payment);
      else router.push("/cart");
      setLoading(false);
    });
    void loadRazorpayScript().then(setRazorpayReady);
  }, [paymentId, router]);

  const handleUploadProof = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/payment-proof", { method: "POST", body: formData });
      const data = await parseResponseJson<{ url?: string; error?: string }>(res);
      if (!res.ok || !data?.url) throw new Error(data?.error || p.uploadFailed);
      setPaymentProofImage(data.url!);
      toast.success(p.screenshotUploaded);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : p.uploadFailed);
    } finally {
      setUploading(false);
    }
  };

  const finalizePayment = async (
    method: "razorpay" | "admin_approval",
    extras?: Record<string, string>
  ) => {
    const res = await fetch("/api/checkout/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId, method, ...extras }),
    });
    const data = await parseResponseJson<{ error?: string }>(res);
    if (!res.ok) throw new Error(data?.error || p.paymentFailed);
    clearCart();
    if (method === "razorpay") {
      toast.success(p.paymentSuccess);
      router.push("/dashboard/slots");
    } else {
      toast.success(p.submittedVerification);
      router.push("/dashboard/purchases");
    }
  };

  const handleRazorpay = async () => {
    if (!paymentId || !payment) return;
    setPaying("razorpay");
    try {
      const orderRes = await fetchJson<{
        orderId?: string;
        amount?: number;
        keyId?: string;
        userName?: string;
        userEmail?: string;
        userPhone?: string;
        error?: string;
      }>("/api/checkout/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });

      if (!orderRes.ok || !orderRes.data?.orderId) {
        throw new Error(orderRes.error || orderRes.data?.error || p.razorpayDisabledDesc);
      }

      const { orderId, amount, keyId, userName, userEmail, userPhone } = orderRes.data;
      const loaded = razorpayReady || (await loadRazorpayScript());
      if (!loaded || !window.Razorpay) throw new Error("Could not load Razorpay checkout");

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency: "INR",
        name: SITE.name,
        description: payment.description || "AstroKnowledge purchase",
        order_id: orderId,
        prefill: { name: userName, email: userEmail, contact: userPhone },
        theme: { color: "#d97706" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await finalizePayment("razorpay", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
          } catch (e) {
            toast.error(e instanceof Error ? e.message : p.paymentFailed);
          } finally {
            setPaying(null);
          }
        },
        modal: {
          ondismiss: () => setPaying(null),
        },
      });
      rzp.open();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : p.paymentFailed);
      setPaying(null);
    }
  };

  const handleAdminApproval = async () => {
    if (!transactionRefId.trim()) {
      toast.error(p.enterRefId);
      return;
    }
    if (!paymentProofImage) {
      toast.error(p.uploadProof);
      return;
    }

    setPaying("admin_approval");
    try {
      await finalizePayment("admin_approval", {
        transactionRefId: transactionRefId.trim(),
        paymentProofImage,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : p.paymentFailed);
    } finally {
      setPaying(null);
    }
  };

  if (loading || !payment) {
    return <p className="py-20 text-center text-text-muted">{p.loading}</p>;
  }

  if (payment.status === "paid") {
    return (
      <div className="py-20 text-center">
        <ShieldCheck className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-xl font-bold text-text-primary">{p.completeTitle}</h2>
        <p className="text-text-body mt-2">{p.completeDesc}</p>
        <Button href="/dashboard/slots" variant="secondary" className="mt-6">{d.bookConsultation}</Button>
      </div>
    );
  }

  if (payment.status === "awaiting_approval") {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <ShieldCheck className="mx-auto h-16 w-16 text-gold mb-4" />
        <h2 className="text-xl font-bold text-text-primary">{p.pendingTitle}</h2>
        <p className="text-text-body mt-2">{p.pendingDesc}</p>
        {payment.transactionRefId && (
          <p className="mt-3 text-sm text-text-muted">{p.refId} <strong className="text-text-primary">{payment.transactionRefId}</strong></p>
        )}
        <Button href="/dashboard/purchases" variant="secondary" className="mt-6">{d.purchases}</Button>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl px-4">
        <FadeIn>
          <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
            {p.optionsTitle} <span className="text-gradient-gold">{p.optionsAccent}</span>
          </h1>
          <p className="text-sm text-text-body mb-8">{p.chooseHow}</p>
        </FadeIn>

        <FadeIn className="rounded-2xl glass-card p-6 mb-6">
          <p className="text-sm text-text-muted">{p.orderFor} <strong className="text-text-primary">{payment.userName}</strong> · {payment.userPhone}</p>
          <div className="mt-4 space-y-2">
            {(payment.items ?? []).map((item) => (
              <div key={`${item.itemType}-${item.id}`} className="flex items-center gap-3 rounded-xl bg-orange/5 p-2">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                  <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <span className="flex-1 text-sm text-text-primary">{item.name} × {item.quantity}</span>
                <span className="text-sm text-gold font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-xl font-bold border-t border-gold/15 pt-4">
            <span>{c.cart.total}</span>
            <span className="flex items-center text-gold"><IndianRupee className="h-5 w-5" />{payment.amount.toLocaleString("en-IN")}</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.05} className="mb-6 rounded-2xl border-2 border-gold/30 bg-gradient-to-br from-gold/10 to-orange/5 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-orange text-white shadow-md">
              <Zap className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-text-primary">{p.razorpayTitle}</h3>
              <p className="mt-1 text-xs text-text-body">{p.razorpayDesc}</p>
              <Button
                onClick={handleRazorpay}
                variant="secondary"
                size="lg"
                className="mt-4 w-full"
                disabled={!!paying}
              >
                <CreditCard className="h-4 w-4" />
                {paying === "razorpay" ? p.submitting : `Pay ₹${payment.amount.toLocaleString("en-IN")} via Razorpay`}
              </Button>
              <p className="mt-2 text-[10px] text-text-muted">UPI, Cards, Net Banking — instant access after payment</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="mb-4 text-center">
          <span className="inline-block rounded-full bg-gold/10 px-4 py-1 text-xs font-semibold text-gold">OR</span>
        </FadeIn>

        <FadeIn className="rounded-2xl glass-card p-6 space-y-4">
          <div className="flex items-start gap-3 mb-2">
            <ShieldCheck className="h-8 w-8 text-gold shrink-0" />
            <div>
              <h3 className="font-semibold text-text-primary">{p.adminTitle}</h3>
              <p className="text-xs text-text-muted">{p.adminDesc}</p>
            </div>
          </div>

          <UpiPaymentPanel
            amount={payment.amount}
            note={`${SITE.name} order ${payment.id}`}
          />

          <h4 className="font-medium text-text-primary text-sm">{p.verificationDetails}</h4>
          <p className="text-xs text-text-muted">{p.verificationHint}</p>

          <div>
            <label className="block text-xs text-text-muted mb-1">{p.transactionRef}</label>
            <input
              value={transactionRefId}
              onChange={(e) => setTransactionRefId(e.target.value)}
              placeholder={p.transactionPlaceholder}
              className="w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-text-muted mb-1">{p.screenshot}</label>
            <div className="relative mb-2 h-40 overflow-hidden rounded-xl border border-gold/20 bg-orange/5">
              {paymentProofImage ? (
                <SafeImage src={paymentProofImage} alt={p.screenshot} fill className="object-contain" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-text-muted">{p.uploadScreenshot}</div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadProof(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gold/40 bg-gold/5 py-3 text-sm text-gold hover:bg-gold/10 disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {uploading ? p.uploading : paymentProofImage ? p.changeScreenshot : p.uploadPhoto}
            </button>
          </div>

          <Button
            onClick={handleAdminApproval}
            variant="outline"
            size="lg"
            className="w-full"
            disabled={!!paying}
          >
            {paying === "admin_approval" ? p.submitting : p.submitAdmin}
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}

export default function PaymentPage() {
  return (
    <PageTransition>
      <Suspense><PaymentContent /></Suspense>
    </PageTransition>
  );
}
