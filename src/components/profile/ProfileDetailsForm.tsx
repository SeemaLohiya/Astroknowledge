"use client";

import { Button } from "@/components/ui/Button";
import { User } from "@/lib/types";
import { motion } from "framer-motion";
import { Calendar, Clock, Mail, Phone, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BirthFormState, birthFormFromUser, isBirthFormValid } from "./BirthDetailsForm";
import { BirthPlacePicker, composeBirthPlace, type BirthPlaceValue } from "./BirthPlacePicker";
import { BirthTimeFields, DobFields } from "./DateTimeFields";

export interface ProfileFormState extends BirthFormState {
  name: string;
  phone: string;
  email: string;
  gender: "" | "male" | "female" | "other";
}

export function profileFormFromUser(user?: Partial<User> | null): ProfileFormState {
  return {
    ...birthFormFromUser(user),
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    gender: user?.gender || "",
  };
}

export function isProfileFormValid(form: ProfileFormState): boolean {
  return !!form.name.trim() && isBirthFormValid(form);
}

interface ProfileDetailsFormProps {
  onSubmit: (form: ProfileFormState) => Promise<void>;
  loading?: boolean;
  initial?: Partial<User> | null;
  submitLabel?: string;
  animated?: boolean;
}

const inputCls =
  "w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-sm text-text-primary transition-all focus:border-gold focus:ring-2 focus:ring-gold/15 focus:outline-none";

const sectionMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

function FormSection({
  animated,
  delay,
  children,
  className,
}: {
  animated?: boolean;
  delay: number;
  children: React.ReactNode;
  className?: string;
}) {
  if (!animated) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      {...sectionMotion}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ProfileDetailsForm({
  onSubmit,
  loading,
  initial,
  submitLabel = "Save Profile",
  animated = false,
}: ProfileDetailsFormProps) {
  const [form, setForm] = useState<ProfileFormState>(() => profileFormFromUser(initial));

  useEffect(() => {
    setForm(profileFormFromUser(initial));
  }, [initial]);

  const setPlace = (place: BirthPlaceValue) => {
    setForm((f) => ({
      ...f,
      ...place,
      birthPlace: composeBirthPlace(place),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProfileFormValid(form)) {
      toast.error("Please fill your name and birth details (or mark unknown)");
      return;
    }
    await onSubmit({
      ...form,
      birthPlace: form.birthPlaceUnknown ? "" : composeBirthPlace(form),
    });
  };

  const SubmitWrap = animated ? motion.div : "div";
  const submitProps = animated
    ? { ...sectionMotion, transition: { delay: 0.35, duration: 0.4 } }
    : {};

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormSection animated={animated} delay={0.05}>
        <p className="rounded-xl border border-gold/15 bg-orange/5 px-4 py-3 text-sm text-text-body">
          Complete your profile for accurate consultations and order delivery.
        </p>
      </FormSection>

      <FormSection
        animated={animated}
        delay={0.12}
        className="rounded-2xl border border-gold/15 bg-white/70 p-5 space-y-4 shadow-sm"
      >
        <h3 className="flex items-center gap-2 text-sm font-bold text-gold">
          <UserIcon className="h-4 w-4" /> Basic Details
        </h3>

        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Full Name *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Your full name" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-text-muted">
              <Phone className="h-3 w-3 text-gold" /> Phone
            </label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} placeholder="+91..." />
          </div>
          <div>
            <label className="mb-1 flex items-center gap-1 text-xs font-medium text-text-muted">
              <Mail className="h-3 w-3 text-gold" /> Email
            </label>
            <input type="email" readOnly value={form.email} className={`${inputCls} opacity-70 cursor-not-allowed`} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Gender</label>
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as ProfileFormState["gender"] })} className={inputCls}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </FormSection>

      <FormSection
        animated={animated}
        delay={0.22}
        className="rounded-2xl border border-gold/15 bg-white/70 p-5 space-y-4 shadow-sm"
      >
        <h3 className="flex items-center gap-2 text-sm font-bold text-gold">
          <Calendar className="h-4 w-4" /> Birth Details
        </h3>
        <p className="text-xs text-text-muted">Required for Kundali analysis and consultation accuracy.</p>

        <div>
          <label className="mb-2 block text-xs text-text-muted">Date of Birth *</label>
          <DobFields
            value={form.dob}
            disabled={form.dobUnknown}
            onChange={(dob) => setForm({ ...form, dob })}
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-text-body">
            <input type="checkbox" checked={form.dobUnknown} onChange={(e) => setForm({ ...form, dobUnknown: e.target.checked, dob: e.target.checked ? "" : form.dob })} />
            I don&apos;t know my date of birth
          </label>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-1 text-xs text-text-muted">
            <Clock className="h-3.5 w-3.5 text-gold" /> Time of Birth *
          </label>
          <BirthTimeFields
            value={form.birthTime}
            disabled={form.birthTimeUnknown}
            onChange={(birthTime) => setForm({ ...form, birthTime })}
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-text-body">
            <input type="checkbox" checked={form.birthTimeUnknown} onChange={(e) => setForm({ ...form, birthTimeUnknown: e.target.checked, birthTime: e.target.checked ? "" : form.birthTime })} />
            I don&apos;t know my time of birth
          </label>
        </div>

        <div>
          <label className="mb-2 block text-xs text-text-muted">Place of Birth *</label>
          <BirthPlacePicker
            value={{ birthCountry: form.birthCountry, birthState: form.birthState, birthCity: form.birthCity }}
            onChange={setPlace}
            disabled={form.birthPlaceUnknown}
            inputCls=""
          />
          <label className="mt-2 flex items-center gap-2 text-sm text-text-body">
            <input
              type="checkbox"
              checked={form.birthPlaceUnknown}
              onChange={(e) =>
                setForm({
                  ...form,
                  birthPlaceUnknown: e.target.checked,
                  birthPlace: e.target.checked ? "" : composeBirthPlace(form),
                  birthCountry: e.target.checked ? "" : form.birthCountry,
                  birthState: e.target.checked ? "" : form.birthState,
                  birthCity: e.target.checked ? "" : form.birthCity,
                })
              }
            />
            I don&apos;t know my place of birth
          </label>
        </div>
      </FormSection>

      <SubmitWrap {...submitProps}>
        <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={loading || !isProfileFormValid(form)}>
          {loading ? "Saving..." : submitLabel}
        </Button>
      </SubmitWrap>
    </form>
  );
}
