"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { SavedAddresses } from "@/components/dashboard/SavedAddresses";
import { FillDetailsButton } from "@/components/profile/ProfileDetailsModal";
import { useProfile } from "@/components/profile/ProfileGate";
import { SITE } from "@/lib/constants";
import { isBirthProfileComplete } from "@/lib/profile";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Mail, Pencil, Phone, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const { c } = useLanguage();
  const d = c.dashboard;
  const { user } = useProfile();

  if (!user) return null;

  const complete = isBirthProfileComplete(user);

  return (
    <PageTransition>
      <FadeIn>
        <h1 className="font-display text-2xl font-bold text-text-primary mb-2">
          {d.profileTitle} <span className="text-gradient-gold">{d.profileTitleAccent}</span>
        </h1>
        <p className="text-sm text-text-muted mb-6">Manage your contact, birth details and delivery addresses.</p>
      </FadeIn>

      <FadeIn>
        <div className={`mb-6 rounded-xl px-4 py-2 text-sm ${complete ? "bg-green-500/10 text-green-700 border border-green-500/20" : "bg-yellow-500/10 text-yellow-800 border border-yellow-500/20"}`}>
          {complete ? d.birthComplete : d.birthIncomplete}
        </div>
      </FadeIn>

      <FadeIn>
        <div className="rounded-2xl glass-card p-6 md:p-8 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold to-orange shadow-md">
                <UserIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary">{user.name}</h2>
                <p className="text-sm text-text-muted">{d.memberSince} {user.createdAt}</p>
              </div>
            </div>
            <FillDetailsButton variant="outline" size="sm" label={d.edit} icon={Pencil} />
          </div>

          <div className="space-y-3 text-sm">
            {[
              { icon: UserIcon, label: d.nameLabel, value: user.name },
              { icon: Mail, label: d.email, value: user.email },
              { icon: Phone, label: d.phone, value: user.phone || d.notProvided },
            ].map((field) => (
              <div key={field.label} className="flex items-center gap-3 rounded-xl bg-orange/5 px-4 py-3">
                <field.icon className="h-4 w-4 text-gold" />
                <div>
                  <p className="text-xs text-text-muted">{field.label}</p>
                  <p className="text-text-primary">{field.value}</p>
                </div>
              </div>
            ))}
            {user.gender && <p><span className="text-text-muted">Gender:</span> {user.gender}</p>}
            <p><span className="text-text-muted">{d.dob}</span> {user.dobUnknown ? d.notKnown : user.dob || "—"}</p>
            <p><span className="text-text-muted">{d.birthTime}</span> {user.birthTimeUnknown ? d.notKnown : user.birthTime || "—"}</p>
            <p><span className="text-text-muted">{d.birthPlace}</span> {user.birthPlaceUnknown ? d.notKnown : user.birthPlace || "—"}</p>
          </div>

          {!complete && (
            <div className="mt-6 text-center">
              <FillDetailsButton variant="secondary" size="lg" />
            </div>
          )}

          <p className="mt-6 text-center text-sm text-text-muted">
            {d.needHelp} {SITE.acharya} {SITE.phone}
          </p>
        </div>
      </FadeIn>

      <FadeIn className="mt-8">
        <SavedAddresses />
      </FadeIn>
    </PageTransition>
  );
}
