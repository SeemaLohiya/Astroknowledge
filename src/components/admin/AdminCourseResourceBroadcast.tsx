"use client";

import { fetchJson, parseResponseJson } from "@/lib/fetch-json";
import { Course, User } from "@/lib/types";
import { Link2, Plus, Send, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type TargetMode = "enrolled" | "user" | "all";

interface AdminCourseResourceBroadcastProps {
  courses: Course[];
}

export function AdminCourseResourceBroadcast({ courses }: AdminCourseResourceBroadcastProps) {
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [targetMode, setTargetMode] = useState<TargetMode>("enrolled");
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [rows, setRows] = useState([{ label: "", url: "" }]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    void fetchJson<{ users?: User[] }>("/api/users").then((res) => {
      const list = (res.data?.users || []).filter((u) => u.role === "user");
      setUsers(list);
      if (list[0]) setUserId(list[0].id);
    });
  }, []);

  useEffect(() => {
    if (courses[0] && !courseId) setCourseId(courses[0].id);
  }, [courses, courseId]);

  const addRow = () => setRows((prev) => [...prev, { label: "", url: "" }]);
  const removeRow = (i: number) => setRows((prev) => prev.filter((_, idx) => idx !== i));

  const send = async () => {
    if (!courseId) {
      toast.error("Select a course");
      return;
    }
    if (targetMode === "user" && !userId) {
      toast.error("Select a user");
      return;
    }
    const links = rows.filter((r) => r.label.trim() && r.url.trim());
    if (links.length === 0) {
      toast.error("Add at least one link");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/admin/courses/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          links,
          target: targetMode,
          userId: targetMode === "user" ? userId : undefined,
        }),
      });
      const data = await parseResponseJson<{ message?: string; error?: string }>(res);
      if (!res.ok) throw new Error(data?.error || "Failed to send");
      toast.success(data?.message || "Resources sent");
      setRows([{ label: "", url: "" }]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setSending(false);
    }
  };

  if (courses.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-gold/30 py-12 text-center text-sm text-text-muted">
        Add courses in Shop &amp; Photos first, then send resource links here.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/5 to-orange/5 p-6">
      <h2 className="mb-1 flex items-center gap-2 font-semibold text-text-primary">
        <Link2 className="h-5 w-5 text-gold" />
        Send course resources
      </h2>
      <p className="mb-4 text-xs text-text-muted">
        Share links with enrolled students, a specific user, or all users on the platform.
      </p>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Course</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full rounded-xl border border-gold/20 bg-white px-3 py-2.5 text-sm"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-text-muted">Send to</label>
          <select
            value={targetMode}
            onChange={(e) => setTargetMode(e.target.value as TargetMode)}
            className="w-full rounded-xl border border-gold/20 bg-white px-3 py-2.5 text-sm"
          >
            <option value="enrolled">All enrolled users (paid for this course)</option>
            <option value="user">Specific user</option>
            <option value="all">All users</option>
          </select>
        </div>
      </div>

      {targetMode === "user" && (
        <div className="mb-4">
          <label className="mb-1 block text-xs font-medium text-text-muted">User</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full rounded-xl border border-gold/20 bg-white px-3 py-2.5 text-sm"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-wrap gap-2">
            <input
              value={row.label}
              onChange={(e) =>
                setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, label: e.target.value } : r)))
              }
              placeholder="Label (e.g. WhatsApp group)"
              className="min-w-[140px] flex-1 rounded-xl border border-gold/20 bg-white px-3 py-2 text-sm"
            />
            <input
              value={row.url}
              onChange={(e) =>
                setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, url: e.target.value } : r)))
              }
              placeholder="https://..."
              className="min-w-[200px] flex-[2] rounded-xl border border-gold/20 bg-white px-3 py-2 text-sm"
            />
            {rows.length > 1 && (
              <button type="button" onClick={() => removeRow(i)} className="rounded-lg p-2 text-red-400 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10"
        >
          <Plus className="h-3.5 w-3.5" /> Add link
        </button>
        <button
          type="button"
          disabled={sending}
          onClick={() => void send()}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-bold text-white hover:bg-gold-bright disabled:opacity-50"
        >
          {targetMode === "all" ? <Users className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          {sending ? "Sending…" : "Send resources"}
        </button>
      </div>
    </div>
  );
}
