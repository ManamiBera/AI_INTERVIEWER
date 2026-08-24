"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, FileText, BookOpen, LayoutTemplate, Presentation, History } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

type SearchResult = {
  id: string;
  group: "Resumes" | "Reports" | "Questions" | "Sessions" | "Templates";
  title: string;
  href: string;
  icon: LucideIcon;
};

/** Phase 1 stub — replaced with real searchService in Phase 5. */
const STUB_INDEX: SearchResult[] = [
  { id: "r1", group: "Resumes", title: "Software Engineer Resume", href: "/resume/overview", icon: FileText },
  { id: "r2", group: "Resumes", title: "Frontend_v3.pdf", href: "/resume/overview", icon: FileText },
  { id: "rep1", group: "Reports", title: "Google SWE ATS Analysis", href: "/resume/ats-verdict", icon: History },
  { id: "q1", group: "Questions", title: "Explain React hooks lifecycle", href: "/interview/questions", icon: BookOpen },
  { id: "q2", group: "Questions", title: "Design a URL shortener", href: "/interview/questions", icon: BookOpen },
  { id: "s1", group: "Sessions", title: "Mock: Senior Backend @ Amazon", href: "/interview/history", icon: Presentation },
  { id: "t1", group: "Templates", title: "Executive Elite Pro", href: "/templates", icon: LayoutTemplate },
  { id: "t2", group: "Templates", title: "ATS Ultra Clean", href: "/templates", icon: LayoutTemplate },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export function GlobalSearch({ open, onClose }: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return STUB_INDEX;
    return STUB_INDEX.filter((r) => r.title.toLowerCase().includes(q));
  }, [query]);

  const groups = useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    for (const r of results) {
      if (!map.has(r.group)) map.set(r.group, []);
      map.get(r.group)!.push(r);
    }
    return Array.from(map.entries());
  }, [results]);

  return (
    <Modal open={open} onClose={onClose} size="lg" className="max-h-[80vh]">
      <div className="-m-6">
        <div className="p-4 border-b border-border-subtle">
          <div className="flex items-center gap-3 h-11 px-3 rounded-md bg-elevated/60 border border-border-subtle focus-within:border-accent/60">
            <Search className="h-4 w-4 text-text-muted shrink-0" />
            <input
              autoFocus
              placeholder="Search resumes, reports, questions, templates…"
              className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd className="text-[10px] font-mono text-text-muted bg-hover px-1.5 py-0.5 rounded border border-border-subtle">
              ESC
            </kbd>
          </div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {results.length === 0 ? (
            <div className="text-center py-10 text-sm text-text-muted">
              No results for &quot;{query}&quot;
            </div>
          ) : (
            groups.map(([group, items]) => (
              <div key={group} className="mb-3 last:mb-0">
                <div className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-text-muted font-semibold">
                  {group}
                </div>
                <ul>
                  {items.map((r) => {
                    const Icon = r.icon;
                    return (
                      <li key={r.id}>
                        <Link
                          href={r.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center gap-3 px-3 h-10 rounded-md text-sm",
                            "text-text-secondary hover:text-text-primary hover:bg-hover",
                          )}
                        >
                          <Icon className="h-4 w-4 text-text-muted" />
                          <span className="truncate">{r.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
