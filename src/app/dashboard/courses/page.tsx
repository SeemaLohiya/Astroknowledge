"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { PurchaseHistoryList } from "@/components/dashboard/PurchaseHistoryList";
import { fetchJson } from "@/lib/fetch-json";
import { cn } from "@/lib/cn";
import { Course, CourseResourceLink, UserPurchase } from "@/lib/types";
import { BookOpen, ExternalLink, Link2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

const DEFAULT_LABELS = ["Join WhatsApp community", "Recorded lectures", "Study material", "Certificates"];

type CourseTab = "purchases" | "resources";

const TABS: { id: CourseTab; label: string; icon: typeof BookOpen }[] = [
  { id: "purchases", label: "My Courses", icon: BookOpen },
  { id: "resources", label: "Resources", icon: Link2 },
];

function CoursesTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as CourseTab) || "purchases";
  const [courses, setCourses] = useState<Course[]>([]);
  const [userLinks, setUserLinks] = useState<{ courseId: string; links: CourseResourceLink[] }[]>([]);
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);

  const setTab = (next: CourseTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", next);
    router.replace(`/dashboard/courses?${params.toString()}`);
  };

  useEffect(() => {
    void Promise.all([
      fetchJson<{ items?: Course[] }>("/api/catalog/courses", { cache: "no-store" }),
      fetchJson<{ user?: { courseResources?: { courseId: string; links: CourseResourceLink[] }[] } }>("/api/auth/me", {
        cache: "no-store",
      }),
      fetchJson<{ purchases?: UserPurchase[] }>("/api/orders", { cache: "no-store" }),
    ]).then(([cat, me, orders]) => {
      setCourses(cat.data?.items || []);
      setUserLinks(me.data?.user?.courseResources || []);
      setPurchases(orders.data?.purchases || []);
    });
  }, []);

  const courseMap = useMemo(() => new Map(courses.map((c) => [c.id, c])), [courses]);

  const enrolledCourseIds = useMemo(() => {
    const ids = new Set<string>();
    purchases
      .filter((p) => p.paymentStatus === "paid")
      .forEach((p) => p.items.filter((i) => i.itemType === "course").forEach((i) => ids.add(i.id)));
    return ids;
  }, [purchases]);

  const allResources = useMemo(() => {
    const rows: {
      courseId: string;
      courseName: string;
      id: string;
      label: string;
      url: string;
      source: "course" | "admin";
    }[] = [];

    userLinks
      .filter((entry) => enrolledCourseIds.has(entry.courseId))
      .forEach((entry) => {
        const course = courseMap.get(entry.courseId);
        entry.links
          .filter((l) => l.url)
          .forEach((link) => {
            rows.push({
              courseId: entry.courseId,
              courseName: course?.title || "Course",
              id: link.id,
              label: link.label,
              url: link.url,
              source: "admin",
            });
          });
      });

    courses
      .filter((course) => enrolledCourseIds.has(course.id))
      .forEach((course) => {
        const defaults = course.resources?.length
          ? course.resources
          : DEFAULT_LABELS.map((label, i) => ({ id: `default-${course.id}-${i}`, label, url: "" }));
        defaults
          .filter((l) => l.url)
          .forEach((link) => {
            if (rows.some((r) => r.courseId === course.id && r.url === link.url)) return;
            rows.push({
              courseId: course.id,
              courseName: course.title,
              id: link.id,
              label: link.label,
              url: link.url,
              source: "course",
            });
          });
      });

    return rows;
  }, [courses, courseMap, userLinks, enrolledCourseIds]);

  return (
    <>
      <FadeIn className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          My <span className="text-gradient-gold">Courses</span>
        </h1>
        <p className="mt-1 text-sm text-text-muted">Purchase history and learning resources for your enrolled courses</p>
      </FadeIn>

      <FadeIn className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                active ? "bg-gold text-white shadow-md shadow-gold/20" : "glass-card text-text-body hover:text-gold"
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </FadeIn>

      {tab === "purchases" && (
        <PurchaseHistoryList
          itemType="course"
          title="My"
          titleAccent="Courses"
          emptyLabel="No course purchases yet"
          hideNextStep
          hideHeader
          renderExtra={({ item, purchase }) => {
            if (purchase.paymentStatus !== "paid") return null;
            const course = courseMap.get(item.id);
            const defaults = course?.resources?.length
              ? course.resources
              : DEFAULT_LABELS.map((label, i) => ({ id: `default-${i}`, label, url: "" }));
            const personal = userLinks.find((u) => u.courseId === item.id)?.links || [];
            const links = [
              ...defaults.filter((l) => l.url).map((l) => ({ ...l, source: "course" as const })),
              ...personal.filter((l) => l.url).map((l) => ({ ...l, source: "admin" as const })),
            ];

            if (links.length === 0) return null;

            return (
              <FadeIn className="mt-4">
                <div className="rounded-xl border border-gold/20 bg-white/70 px-4 py-3">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <Link2 className="h-4 w-4 text-gold" /> Resources
                  </p>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={`${link.source}-${link.id}`}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          {link.label}
                        </a>
                        {link.source === "admin" && (
                          <span className="ml-2 text-[10px] font-medium uppercase tracking-wide text-text-muted">
                            Shared with you
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            );
          }}
        />
      )}

      {tab === "resources" && (
        <FadeIn>
          <div className="rounded-2xl glass-card p-5">
            <h2 className="mb-1 flex items-center gap-2 font-display text-lg font-bold text-text-primary">
              <Link2 className="h-5 w-5 text-gold" /> All Resources
            </h2>
            <p className="mb-4 text-sm text-text-muted">Links shared for your enrolled courses appear here</p>
            {allResources.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gold/25 py-12 text-center text-sm text-text-muted">
                No resources yet. They will appear once your course links are added by the admin.
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(
                  allResources.reduce<Record<string, typeof allResources>>((acc, row) => {
                    if (!acc[row.courseName]) acc[row.courseName] = [];
                    acc[row.courseName].push(row);
                    return acc;
                  }, {})
                ).map(([courseName, links]) => (
                  <div key={courseName} className="rounded-xl border border-gold/15 bg-white/70 p-4">
                    <p className="mb-2 text-sm font-semibold text-text-primary">{courseName}</p>
                    <ul className="space-y-2">
                      {links.map((link) => (
                        <li key={`${link.source}-${link.id}`}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            {link.label}
                          </a>
                          {link.source === "admin" && (
                            <span className="ml-2 text-[10px] font-medium uppercase tracking-wide text-text-muted">
                              Shared with you
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      )}
    </>
  );
}

export default function DashboardCoursesPage() {
  return (
    <PageTransition>
      <Suspense fallback={<p className="text-sm text-text-muted">Loading courses…</p>}>
        <CoursesTabs />
      </Suspense>
    </PageTransition>
  );
}
