import { paymentsStore } from "./payments-store";
import { CourseResourceLink, User } from "./types";

export async function getUserIdsWithPaidCourse(courseId: string): Promise<string[]> {
  const payments = await paymentsStore.getAll();
  const userIds = new Set<string>();
  for (const p of payments) {
    if (p.status !== "paid" || !p.userId) continue;
    for (const item of p.items ?? []) {
      if (item.itemType === "course" && item.id === courseId) {
        userIds.add(p.userId);
      }
    }
  }
  return [...userIds];
}

export function mergeCourseResourceLinks(
  existing: User["courseResources"],
  courseId: string,
  newLinks: CourseResourceLink[]
): NonNullable<User["courseResources"]> {
  const list = [...(existing || [])];
  const idx = list.findIndex((e) => e.courseId === courseId);
  if (idx >= 0) {
    const merged = [...list[idx].links];
    for (const link of newLinks) {
      const byUrl = merged.find((l) => l.url === link.url);
      if (byUrl) {
        byUrl.label = link.label;
      } else {
        merged.push(link);
      }
    }
    list[idx] = { courseId, links: merged };
  } else {
    list.push({ courseId, links: newLinks });
  }
  return list;
}
