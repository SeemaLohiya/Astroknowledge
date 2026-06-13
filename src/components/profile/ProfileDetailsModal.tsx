"use client";

import { Button } from "@/components/ui/Button";
import { parseResponseJson } from "@/lib/fetch-json";
import { useHydrated } from "@/lib/use-hydrated";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, User, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { ProfileDetailsForm, ProfileFormState } from "./ProfileDetailsForm";
import { useProfile } from "./ProfileGate";

interface ProfileDetailsModalContextValue {
  openProfileModal: () => void;
}

const ProfileDetailsModalContext = createContext<ProfileDetailsModalContextValue>({
  openProfileModal: () => {},
});

export function useProfileDetailsModal() {
  return useContext(ProfileDetailsModalContext);
}

interface ProfileDetailsModalProps {
  open: boolean;
  onClose: () => void;
}

function ProfileDetailsModal({ open, onClose }: ProfileDetailsModalProps) {
  const { c } = useLanguage();
  const d = c.dashboard;
  const { user, refresh, loading } = useProfile();
  const hydrated = useHydrated();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) void refresh({ silent: true });
  }, [open, refresh]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const handleSave = async (form: ProfileFormState) => {
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
      await refresh({ silent: true });
      onClose();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : d.failedSave);
    } finally {
      setSaving(false);
    }
  };

  if (!hydrated) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="profile-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[300] flex min-h-[100dvh] items-center justify-center bg-black/45 p-4 backdrop-blur-[6px]"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-details-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="relative flex w-full max-w-lg max-h-[90dvh] flex-col rounded-3xl border border-gold/25 bg-gradient-to-b from-cream via-white to-orange/5 shadow-2xl shadow-gold/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full bg-orange/15 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />

            <div className="relative border-b border-gold/15 px-6 py-5">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1.5 text-text-muted transition-colors hover:bg-gold/10 hover:text-gold"
                aria-label={c.closeAria}
              >
                <X className="h-5 w-5" />
              </button>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="flex items-center gap-3 pr-10"
              >
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-orange shadow-md shadow-gold/25">
                  <User className="h-6 w-6 text-white" />
                  <motion.span
                    className="absolute -right-1 -top-1"
                    animate={{ rotate: [0, 12, -8, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Sparkles className="h-4 w-4 text-gold" />
                  </motion.span>
                </div>
                <div>
                  <h2 id="profile-details-title" className="font-display text-xl font-bold text-text-primary">
                    {d.fillDetails}
                  </h2>
                  <p className="text-xs text-text-muted">{d.fillDetailsHint}</p>
                </div>
              </motion.div>
            </div>

            <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">
              {loading || !user ? (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
                  <p className="text-sm text-text-muted">{c.common.loading}</p>
                </div>
              ) : (
                <>
                  <ProfileDetailsForm
                    key={`${user.id}-${open}`}
                    animated
                    onSubmit={handleSave}
                    loading={saving}
                    initial={user}
                    submitLabel={d.saveChanges}
                  />
                  <Button type="button" variant="ghost" className="mt-3 w-full text-text-muted" onClick={onClose}>
                    {d.cancel}
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function FillDetailsButton({
  variant = "secondary",
  size = "sm",
  className = "",
  label,
  icon: Icon,
}: {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const { c } = useLanguage();
  const { openProfileModal } = useProfileDetailsModal();
  const { refresh } = useProfile();

  const handleClick = () => {
    void refresh({ silent: true }).then(() => openProfileModal());
  };

  return (
    <Button variant={variant} size={size} className={className} onClick={handleClick}>
      {Icon && <Icon className="h-4 w-4" />}
      {label ?? c.dashboard.fillDetails}
    </Button>
  );
}

export function ProfileDetailsModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openProfileModal = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <ProfileDetailsModalContext.Provider value={{ openProfileModal }}>
      {children}
      <ProfileDetailsModal open={open} onClose={close} />
    </ProfileDetailsModalContext.Provider>
  );
}
