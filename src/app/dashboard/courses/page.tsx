"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { PurchaseHistoryList } from "@/components/dashboard/PurchaseHistoryList";
import { fetchJson } from "@/lib/fetch-json";
import { Course, CourseResourceLink } from "@/lib/types";
import { ExternalLink, Link2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_LABELS = ["Join WhatsApp community", "Recorded lectures", "Study material", "Certificates"];

export default function DashboardCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userLinks, setUserLinks] = useState<{ courseId: string; links: CourseResourceLink[] }[]>([]);

  useEffect(() => {
    void Promise.all([
      fetchJson<{ items?: Course[] }>("/api/catalog/courses", { cache: "no-store" }),
      fetchJson<{ user?: { courseResources?: { courseId: string; links: CourseResourceLink[] }[] } }>("/api/auth/me", {
        cache: "no-store",
      }),
    ]).then(([cat, me]) => {
      setCourses(cat.data?.items || []);
      setUserLinks(me.data?.user?.courseResources || []);
    });
  }, []);

  const courseMap = useMemo(() => new Map(courses.map((c) => [c.id, c])), [courses]);

  return (
    <PageTransition>
      <PurchaseHistoryList
        itemType="course"
        title="My"
        titleAccent="Courses"
        subtitle="Purchase history and learning resources for your enrolled courses"
        emptyLabel="No course purchases yet"
        hideNextStep
        renderExtra={({ item, purchase }) => {
          if (purchase.paymentStatus !== "paid") return null;
          const course = courseMap.get(item.id);
          const defaults = course?.resources?.length
            ? course.resources
            : DEFAULT_LABELS.map((label, i) => ({ id: `default-${i}`, label, url: "" }));
          const personal = userLinks.find((u) => u.courseId === item.id)?.links || [];
          const links = [...defaults.filter((l) => l.url), ...personal.filter((l) => l.url)];

          return (
            <FadeIn className="mt-4">
              <div className="rounded-xl border border-gold/20 bg-white/70 px-4 py-3">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                  <Link2 className="h-4 w-4 text-gold" /> Resources
                </p>
                {links.length === 0 ? (
                  <p className="text-xs text-text-muted">
                    Resources will appear here once your course links are added by the admin.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.id}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </FadeIn>
          );
        }}
      />
    </PageTransition>
  );
}
