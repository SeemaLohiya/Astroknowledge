import type { ReactNode } from "react";
import Link from "next/link";

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;
const BOLD_PATTERN = /\*\*([^*]+)\*\*/g;
const ITALIC_PATTERN = /\*([^*]+)\*/g;

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let remaining = text;
  let index = 0;

  while (remaining.length > 0) {
    const linkMatch = LINK_PATTERN.exec(remaining);
    LINK_PATTERN.lastIndex = 0;

    if (linkMatch && linkMatch.index === 0) {
      const [, label, href] = linkMatch;
      const isExternal = href.startsWith("http");
      nodes.push(
        isExternal ? (
          <a
            key={`${keyPrefix}-link-${index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold"
          >
            {label}
          </a>
        ) : (
          <Link
            key={`${keyPrefix}-link-${index}`}
            href={href}
            className="font-medium text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold"
          >
            {label}
          </Link>
        )
      );
      remaining = remaining.slice(linkMatch[0].length);
      index += 1;
      continue;
    }

    const boldMatch = BOLD_PATTERN.exec(remaining);
    BOLD_PATTERN.lastIndex = 0;

    if (boldMatch && boldMatch.index === 0) {
      nodes.push(
        <strong key={`${keyPrefix}-bold-${index}`} className="font-semibold text-text-primary">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      index += 1;
      continue;
    }

    const italicMatch = ITALIC_PATTERN.exec(remaining);
    ITALIC_PATTERN.lastIndex = 0;

    if (italicMatch && italicMatch.index === 0) {
      nodes.push(
        <em key={`${keyPrefix}-italic-${index}`} className="italic text-text-primary">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      index += 1;
      continue;
    }

    const nextSpecial = remaining.search(/\[(?:[^\]]+)\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*/);
    const end = nextSpecial === -1 ? remaining.length : nextSpecial;
    if (end > 0) {
      nodes.push(remaining.slice(0, end));
      remaining = remaining.slice(end);
      index += 1;
    } else {
      nodes.push(remaining);
      break;
    }
  }

  return nodes;
}

export function RichText({ text, className }: { text: string; className?: string }) {
  return <span className={className}>{parseInline(text, "rt")}</span>;
}
