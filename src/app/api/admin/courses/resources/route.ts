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
  const target = body.target === "user" ? "user" : body.target === "all" ? "all" : "enrolled";
  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
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

  let userIds: string[] = [];
  if (target === "user") {
    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });
    const user = await store.users.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    userIds = [userId];
  } else if (target === "all") {
    userIds = (await store.users.getAll()).filter((u) => u.role === "user").map((u) => u.id);
  } else {
    userIds = await getUserIdsWithPaidCourse(courseId);
    if (userIds.length === 0) {
      return NextResponse.json(
        { error: "No users have purchased this course yet", updatedCount: 0 },
        { status: 404 }
      );
    }
  }

  let updatedCount = 0;
  for (const uid of userIds) {
    const user = await store.users.findById(uid);
    if (!user) continue;
    user.courseResources = mergeCourseResourceLinks(user.courseResources, courseId, links);
    await store.users.persist(user);
    updatedCount += 1;
  }

  const targetLabel =
    target === "all" ? "all users" : target === "user" ? "the selected user" : "all enrolled students";

  return NextResponse.json({
    ok: true,
    updatedCount,
    message: `Resource links sent to ${updatedCount} user(s) (${targetLabel})`,
  });
}
