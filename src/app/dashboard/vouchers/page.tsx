"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { fetchJson } from "@/lib/fetch-json";
import { Voucher } from "@/lib/types";
import { motion } from "framer-motion";
import { Copy, Gift, IndianRupee } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function DashboardVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJson<{ vouchers?: Voucher[] }>("/api/vouchers").then((res) => {
      setVouchers(res.data?.vouchers || []);
      setLoading(false);
    });
  }, []);

  const copyCode = (code: string) => {
    void navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  return (
    <PageTransition>
      <FadeIn>
        <h1 className="font-display text-2xl font-bold text-text-primary flex items-center gap-2">
          <Gift className="h-7 w-7 text-gold" />
          My Vouchers
        </h1>
        <p className="mt-1 text-sm text-text-body">Private offers assigned to you — apply at checkout</p>
      </FadeIn>

      {loading ? (
        <p className="mt-8 text-center text-text-muted">Loading...</p>
      ) : vouchers.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {vouchers.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/10 via-white to-orange/5 p-5"
            >
              <p className="font-semibold text-text-primary">{v.label}</p>
              {v.description && <p className="mt-1 text-sm text-text-body">{v.description}</p>}
              <div className="mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => copyCode(v.code)}
                  className="flex items-center gap-2 rounded-xl bg-gold/15 px-4 py-2 font-mono text-lg font-bold text-gold"
                >
                  {v.code}
                  <Copy className="h-4 w-4" />
                </button>
                <span className="text-sm font-semibold text-text-primary flex items-center">
                  <IndianRupee className="h-4 w-4 text-gold" />
                  {v.discountType === "percent" ? `${v.discountValue}%` : v.discountValue}
                </span>
              </div>
              <p className="mt-3 text-xs text-text-muted">Valid until {v.validUntil}</p>
              <p className="mt-2 text-xs text-text-body">
                Applies to:{" "}
                <span className="font-medium text-text-primary">
                  {!v.applicableItemTypes?.length
                    ? "All items"
                    : v.applicableItemTypes.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}
                </span>
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-gold/30 p-12 text-center">
          <Gift className="mx-auto h-12 w-12 text-gold/40" />
          <p className="mt-4 text-text-muted">No vouchers assigned yet</p>
          <Link href="/checkout" className="mt-4 inline-block text-sm font-semibold text-gold hover:underline">
            Continue shopping →
          </Link>
        </div>
      )}
    </PageTransition>
  );
}
