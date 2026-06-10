"use client";

import { Button } from "@/components/ui/Button";
import { User } from "@/lib/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BirthPlacePicker,
  composeBirthPlace,
  isBirthPlaceValid,
  parseBirthPlace,
  type BirthPlaceValue,
} from "./BirthPlacePicker";

export interface BirthFormState {
  dob: string;
  birthTime: string;
  birthPlace: string;
  birthCountry: string;
  birthState: string;
  birthCity: string;
  dobUnknown: boolean;
  birthTimeUnknown: boolean;
  birthPlaceUnknown: boolean;
}

export function birthFormFromUser(user?: Partial<User> | null): BirthFormState {
  const place = parseBirthPlace(user?.birthPlace, user);
  return {
    dob: user?.dob || "",
    birthTime: user?.birthTime || "",
    birthPlace: user?.birthPlace || composeBirthPlace(place),
    ...place,
    dobUnknown: !!user?.dobUnknown,
    birthTimeUnknown: !!user?.birthTimeUnknown,
    birthPlaceUnknown: !!user?.birthPlaceUnknown,
  };
}

export function isBirthFormValid(form: BirthFormState): boolean {
  return (
    (form.dobUnknown || !!form.dob.trim()) &&
    (form.birthTimeUnknown || !!form.birthTime.trim()) &&
    isBirthPlaceValid(
      { birthCountry: form.birthCountry, birthState: form.birthState, birthCity: form.birthCity },
      form.birthPlaceUnknown
    )
  );
}

interface BirthDetailsFormProps {
  onSubmit: (form: BirthFormState) => Promise<void>;
  loading?: boolean;
  initial?: Partial<User> | null;
  submitLabel?: string;
}

export function BirthDetailsForm({ onSubmit, loading, initial, submitLabel = "Save & Continue" }: BirthDetailsFormProps) {
  const [form, setForm] = useState<BirthFormState>(() => birthFormFromUser(initial));

  useEffect(() => {
    setForm(birthFormFromUser(initial));
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
    if (!isBirthFormValid(form)) {
      toast.error("Please fill each birth detail or mark it as not known");
      return;
    }
    const payload = {
      ...form,
      birthPlace: form.birthPlaceUnknown ? "" : composeBirthPlace(form),
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-text-body">
        Birth details are required for accurate consultations. Tick the box if you do not know a detail.
      </p>

      <div>
        <label className="block text-xs text-text-muted mb-1">Date of Birth *</label>
        <input
          type="date"
          value={form.dob}
          disabled={form.dobUnknown}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-sm disabled:opacity-50"
        />
        <label className="mt-2 flex items-center gap-2 text-sm text-text-body">
          <input
            type="checkbox"
            checked={form.dobUnknown}
            onChange={(e) => setForm({ ...form, dobUnknown: e.target.checked, dob: e.target.checked ? "" : form.dob })}
          />
          I don&apos;t know my date of birth
        </label>
      </div>

      <div>
        <label className="block text-xs text-text-muted mb-1">Time of Birth *</label>
        <input
          type="time"
          value={form.birthTime}
          disabled={form.birthTimeUnknown}
          onChange={(e) => setForm({ ...form, birthTime: e.target.value })}
          className="w-full rounded-xl border border-gold/20 bg-orange/5 px-4 py-3 text-sm disabled:opacity-50"
        />
        <label className="mt-2 flex items-center gap-2 text-sm text-text-body">
          <input
            type="checkbox"
            checked={form.birthTimeUnknown}
            onChange={(e) => setForm({ ...form, birthTimeUnknown: e.target.checked, birthTime: e.target.checked ? "" : form.birthTime })}
          />
          I don&apos;t know my time of birth
        </label>
      </div>

      <div>
        <label className="block text-xs text-text-muted mb-2">Place of Birth *</label>
        <BirthPlacePicker
          value={{ birthCountry: form.birthCountry, birthState: form.birthState, birthCity: form.birthCity }}
          onChange={setPlace}
          disabled={form.birthPlaceUnknown}
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

      <Button type="submit" variant="secondary" size="lg" className="w-full" disabled={loading || !isBirthFormValid(form)}>
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
