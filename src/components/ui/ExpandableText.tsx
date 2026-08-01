"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type ExpandableTextProps = {
  text: string;
  /** Approx line clamp before Show more (CSS). Default 3. */
  maxLines?: number;
  /** Character fallback when line clamp cannot be measured. */
  maxChars?: number;
  className?: string;
  showMoreLabel?: string;
  showLessLabel?: string;
  asParagraphs?: boolean;
  paragraphClassName?: string;
  /** Use inside <Link> — prevents navigation when toggling Show more */
  preventNavigation?: boolean;
};

export function ExpandableText({
  text,
  maxLines = 3,
  maxChars = 220,
  className,
  showMoreLabel = "Show more",
  showLessLabel = "Show less",
  asParagraphs = false,
  paragraphClassName,
  preventNavigation = false,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const full = text.trim();

  useEffect(() => {
    setExpanded(false);
  }, [full]);

  useEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    // Detect overflow when clamped
    const check = () => {
      if (asParagraphs) {
        setNeedsToggle(full.length > maxChars);
        return;
      }
      setNeedsToggle(el.scrollHeight > el.clientHeight + 1 || full.length > maxChars * 2);
    };
    check();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(check) : null;
    ro?.observe(el);
    return () => ro?.disconnect();
  }, [full, expanded, maxChars, asParagraphs, maxLines]);

  if (!full) return null;

  const toggle = (e?: React.MouseEvent) => {
    if (preventNavigation && e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpanded((v) => !v);
  };

  if (asParagraphs) {
    const needs = full.length > maxChars;
    const shown = !needs || expanded ? full : `${full.slice(0, maxChars).trimEnd()}…`;
    const paras = shown.split(/\n\n+/).filter(Boolean);
    return (
      <div className={className}>
        <div className="space-y-2">
          {paras.map((para, i) => (
            <p key={i} className={paragraphClassName || "text-xs leading-relaxed text-text-body"}>
              {para.trim()}
            </p>
          ))}
        </div>
        {needs && (
          <button
            type="button"
            onClick={toggle}
            className="mt-2 text-xs font-semibold text-gold hover:underline"
          >
            {expanded ? showLessLabel : showMoreLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        ref={ref}
        className={cn(!expanded && "overflow-hidden")}
        style={!expanded ? { display: "-webkit-box", WebkitLineClamp: maxLines, WebkitBoxOrient: "vertical" } : undefined}
      >
        {full}
      </div>
      {(needsToggle || expanded) && (
        <button
          type="button"
          onClick={toggle}
          className="mt-1 text-xs font-semibold text-gold hover:underline"
        >
          {expanded ? showLessLabel : showMoreLabel}
        </button>
      )}
    </div>
  );
}
