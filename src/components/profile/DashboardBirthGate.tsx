"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { parseResponseJson } from "@/lib/fetch-json";
import { isBirthProfileComplete } from "@/lib/profile";
import { User } from "@/lib/types";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BirthDetailsForm, BirthFormState } from "./BirthDetailsForm";
import { useProfile } from "./ProfileGate";

function formatUpdatedAt(iso?: string) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

/** Dashboard layout wrapper — birth popup removed; collection happens in Book Consultation */
export function DashboardBirthGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function BirthOverviewCard({ user }: { user: Omit<User, "password"> }) {
  const { c } = useLanguage();
  const d = c.dashboard;
  const { refresh } = useProfile();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const complete = isBirthProfileComplete(user);
  const updatedLabel = formatUpdatedAt(user.birthDetailsUpdatedAt);

  const handleSaveBirth = async (form: BirthFormState) => {
    setSaving(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await parseResponseJson<{ error?: string }>(res);
      if (!res.ok) throw new Error(data?.error || d.failedSave);
      toast.success(d.birthUpdatedToast);
      await refresh();
      setEditing(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : d.failedSave);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl glass-card p-6">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h2 className="font-semibold text-text-primary">{d.birthDetails}</h2>
        {complete && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1 text-xs font-semibold text-gold hover:bg-gold/10"
          >
            <Pencil className="h-3 w-3" /> {d.edit}
          </button>
        )}
      </div>
      <p className="text-xs text-text-muted mb-4">{d.birthDetailsHint}</p>

      {editing ? (
        <div>
          <BirthDetailsForm
            onSubmit={handleSaveBirth}
            loading={saving}
            initial={user}
            submitLabel={d.saveChanges}
          />
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="mt-3 text-xs text-text-muted hover:text-text-primary"
          >
            {d.cancel}
          </button>
        </div>
      ) : complete ? (
        <div className="space-y-2 text-sm text-text-body">
          <p><span className="text-text-muted">{d.dob}</span> {user.dobUnknown ? d.notKnown : user.dob || "—"}</p>
          <p><span className="text-text-muted">{d.birthTime}</span> {user.birthTimeUnknown ? d.notKnown : user.birthTime || "—"}</p>
          <p><span className="text-text-muted">{d.birthPlace}</span> {user.birthPlaceUnknown ? d.notKnown : user.birthPlace || "—"}</p>
          {updatedLabel && (
            <p className="pt-2 text-xs text-text-muted">{d.lastUpdated} {updatedLabel}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gold bg-gold/10 rounded-xl px-4 py-3">
          {d.birthPending}
        </p>
      )}
    </div>
  );
}
