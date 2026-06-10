"use client";

import { FillDetailsButton } from "@/components/profile/ProfileDetailsModal";
import { fetchJson } from "@/lib/fetch-json";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Check, Circle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProgressStep {
  key: string;
  done: boolean;
  current?: boolean;
  href?: string;
}

export function ProgressTimeline() {
  const { c } = useLanguage();
  const d = c.dashboard;
  const [steps, setSteps] = useState<ProgressStep[]>([]);

  const labels: Record<string, string> = {
    account: d.stepAccount,
    birth: d.stepBirth,
    purchase: d.stepPurchase,
    payment: d.stepPayment,
    book: d.stepBook,
    confirm: d.stepConfirm,
  };

  useEffect(() => {
    void fetchJson<{ steps?: ProgressStep[] }>("/api/dashboard/progress").then((res) => {
      setSteps(res.data?.steps || []);
    });
  }, []);

  if (steps.length === 0) return null;

  const doneCount = steps.filter((s) => s.done).length;
  const progress = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-white/90 via-cream to-orange/5 p-6 shadow-sm">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/10 blur-2xl" />
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-semibold text-text-primary">{d.progressTitle}</h2>
        <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold">{progress}%</span>
      </div>

      <div className="mb-5 h-2 overflow-hidden rounded-full bg-orange/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-gold to-orange transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-1">
        {steps.map((step, i) => {
          const inner = (
            <div className="flex items-center gap-3 py-1.5">
              <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                step.done ? "border-green-500 bg-green-500/15 text-green-600 shadow-sm shadow-green-500/20" :
                step.current ? "border-gold bg-gold/15 text-gold animate-pulse-glow" :
                "border-gold/25 text-text-muted"
              }`}>
                {step.done ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${step.done ? "text-text-primary" : step.current ? "text-gold" : "text-text-body"}`}>
                  {labels[step.key] || step.key}
                </p>
                {step.current && !step.done && (
                  <p className="text-xs text-gold">{d.stepInProgress}</p>
                )}
              </div>
              {step.done && <span className="text-[10px] font-bold uppercase text-green-600">Done</span>}
            </div>
          );
          const isBirthStep = step.key === "birth" && !step.done;
          return (
            <div key={step.key}>
              {isBirthStep ? (
                <div className="rounded-xl px-2 py-1 -mx-2">
                  {inner}
                  <div className="ml-12 mt-1 mb-1">
                    <FillDetailsButton variant="secondary" size="sm" />
                  </div>
                </div>
              ) : step.href && !step.done ? (
                <Link href={step.href} className="block rounded-xl px-2 py-0.5 -mx-2 transition-colors hover:bg-gold/5">
                  {inner}
                </Link>
              ) : inner}
              {i < steps.length - 1 && (
                <div className={`ml-[18px] h-4 border-l-2 ${step.done ? "border-green-500/30" : "border-gold/15"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
