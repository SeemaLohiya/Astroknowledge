import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserIdsWithPaidCourse, mergeCourseResourceLinks } from "@/lib/course-resources";
import { store } from "@/lib/store";
import { CourseResourceLink } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const courseId = typeof body.courseId === "string" ? body.courseId.trim() : "";
  const rawLinks = Array.isArray(body.links) ? body.links : [];

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const links: CourseResourceLink[] = rawLinks
    .map((l: { label?: string; url?: string; id?: string }, i: number) => ({
      id: typeof l.id === "string" ? l.id : `link-${Date.now()}-${i}`,
      label: String(l.label || "").trim(),
      url: String(l.url || "").trim(),
    }))
    .filter((l: CourseResourceLink) => l.label && l.url);

  if (links.length === 0) {
    return NextResponse.json({ error: "Add at least one link with label and URL" }, { status: 400 });
  }

  const userIds = await getUserIdsWithPaidCourse(courseId);
  if (userIds.length === 0) {
    return NextResponse.json(
      { error: "No users have purchased this course yet", updatedCount: 0 },
      { status: 404 }
    );
  }

  let updatedCount = 0;
  for (const userId of userIds) {
    const user = await store.users.findById(userId);
    if (!user) continue;
    user.courseResources = mergeCourseResourceLinks(user.courseResources, courseId, links);
    await store.users.persist(user);
    updatedCount += 1;
  }

  return NextResponse.json({
    ok: true,
    updatedCount,
    message: `Resource links sent to ${updatedCount} enrolled student(s)`,
  });
}
