"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search, ArrowUpDown, Copy, Trash2, Pencil, ExternalLink, MoreVertical, FileText, Briefcase, Mic, Award,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { ScoreDial } from "@/components/ui/ScoreDial";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCardDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useResumeStore } from "@/store/resumeStore";
import { useInterviewStore } from "@/store/interviewStore";
import { useEffect } from "react";

type Kind = "resume" | "job-match" | "interview" | "ats";
type Item = {
  id: string; kind: Kind; name: string; role: string; company: string;
  ats: number; match: number; date: string; improvement: number; status: "complete" | "draft";
};

const SEED: Item[] = [
  { id: "h1", kind: "ats", name: "Software_Engineer_Google.pdf", role: "Software Engineer", company: "Google", ats: 88, match: 92, date: "2026-08-22T14:20:00", improvement: 12, status: "complete" },
  { id: "h2", kind: "resume", name: "Sarah_Chen_Senior_UI.pdf", role: "Senior UI Engineer", company: "Meta", ats: 94, match: 97, date: "2026-08-20T09:15:00", improvement: 6, status: "complete" },
  { id: "h3", kind: "job-match", name: "Marcus_V_Product_Lead.pdf", role: "Product Lead", company: "Amazon", ats: 62, match: 55, date: "2026-08-18T16:45:00", improvement: -3, status: "complete" },
  { id: "h4", kind: "interview", name: "Mock — Backend @ Amazon", role: "Backend Developer", company: "Amazon", ats: 71, match: 0, date: "2026-08-16T11:15:00", improvement: 9, status: "complete" },
  { id: "h5", kind: "resume", name: "Elena_Rodriguez_Data_Sci.pdf", role: "Data Scientist", company: "Netflix", ats: 81, match: 89, date: "2026-08-14T11:30:00", improvement: 15, status: "complete" },
  { id: "h6", kind: "interview", name: "Mock — Frontend @ Meta", role: "Frontend Developer", company: "Meta", ats: 78, match: 0, date: "2026-08-12T13:10:00", improvement: 4, status: "complete" },
  { id: "h7", kind: "job-match", name: "Tom_K_Fullstack_Dev.pdf", role: "Full Stack Developer", company: "Stripe", ats: 76, match: 82, date: "2026-08-10T15:00:00", improvement: 7, status: "draft" },
  { id: "h8", kind: "ats", name: "Lila_W_Marketing_Spec.pdf", role: "Marketing Specialist", company: "HubSpot", ats: 45, match: 38, date: "2026-08-08T10:05:00", improvement: -1, status: "complete" },
];

const FILTERS: { id: Kind | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "resume", label: "Resume Analysis" },
  { id: "job-match", label: "Job Match" },
  { id: "interview", label: "Interview" },
  { id: "ats", label: "ATS Report" },
];

const KIND_META: Record<Kind, { label: string; icon: typeof FileText; tone: "cyan" | "green" | "amber" }> = {
  resume: { label: "Resume", icon: FileText, tone: "cyan" },
  "job-match": { label: "Job Match", icon: Briefcase, tone: "green" },
  interview: { label: "Interview", icon: Mic, tone: "amber" },
  ats: { label: "ATS Report", icon: Award, tone: "cyan" },
};

export default function HistoryPage() {
  const router = useRouter();
  const analyses = useResumeStore((s) => s.analyses);
  const sessions = useInterviewStore((s) => s.sessions);
  const [items, setItems] = useState<Item[]>(SEED);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Kind | "all">("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  // Merge real saved analyses + interview sessions in front of the demo seed.
  useEffect(() => {
    const real: Item[] = [
      ...analyses.map((a) => ({
        id: a.id,
        kind: (a.jobTitle && a.jobMatch ? "job-match" : "ats") as Kind,
        name: a.resumeId || "Resume analysis",
        role: a.targetRole || "—",
        company: a.company || "—",
        ats: a.atsScore,
        match: a.jobMatch,
        date: a.createdAt,
        improvement: 0,
        status: "complete" as const,
      })),
      ...sessions.map((s) => ({
        id: s.id,
        kind: "interview" as Kind,
        name: `Mock — ${s.role}${s.company ? ` @ ${s.company}` : ""}`,
        role: s.role,
        company: s.company || "—",
        ats: s.overallScore,
        match: 0,
        date: s.createdAt,
        improvement: 0,
        status: "complete" as const,
      })),
    ];
    if (real.length) setItems([...real, ...SEED]);
  }, [analyses, sessions]);

  const visible = useMemo(() => {
    let list = items.filter((i) => (filter === "all" ? true : i.kind === filter));
    if (query.trim()) {
      const t = query.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(t) || i.role.toLowerCase().includes(t) || i.company.toLowerCase().includes(t));
    }
    return [...list].sort((a, b) => (sortDesc ? +new Date(b.date) - +new Date(a.date) : +new Date(a.date) - +new Date(b.date)));
  }, [items, filter, query, sortDesc]);

  function remove(id: string) {
    setItems((is) => is.filter((i) => i.id !== id));
    setMenuOpen(null);
    toast.success("Analysis deleted.");
  }
  function duplicate(id: string) {
    const orig = items.find((i) => i.id === id);
    if (!orig) return;
    setItems((is) => [{ ...orig, id: `${id}-copy-${Date.now()}`, name: orig.name.replace(/(\.\w+)?$/, " (copy)$1"), date: new Date().toISOString() }, ...is]);
    setMenuOpen(null);
    toast.success("Duplicated.");
  }
  function rename(id: string) {
    const next = prompt("Rename analysis:");
    if (!next) return;
    setItems((is) => is.map((i) => (i.id === id ? { ...i, name: next } : i)));
    setMenuOpen(null);
    toast.success("Renamed.");
  }
  function open(item: Item) {
    router.push(item.kind === "interview" ? "/interview/history" : "/resume/ats-verdict");
  }

  return (
    <>
      <PageHeader
        eyebrow="Track your progress"
        title="Analysis History"
        subtitle="Every resume analysis, job match, ATS report, and interview session in one place. Search, filter, and revisit any previous report."
      />

      {/* Toolbar */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input placeholder="Search by candidate name, role, or company…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
          </div>
          <Button variant="outline" leftIcon={<ArrowUpDown className="h-4 w-4" />} onClick={() => setSortDesc((s) => !s)}>
            {sortDesc ? "Newest first" : "Oldest first"}
          </Button>
        </div>
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-3 h-8 rounded-full text-xs font-medium border transition-all",
                filter === f.id ? "bg-accent/15 text-accent border-accent/40" : "border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent/30",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {visible.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No analyses yet."
          description="Upload your resume to generate your first intelligence report."
          action={<Button onClick={() => router.push("/resume/overview")}>Upload Resume</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((item) => {
            const meta = KIND_META[item.kind];
            const Icon = meta.icon;
            return (
              <Card key={item.id} className="p-5 relative group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-md bg-elevated border border-border-subtle grid place-items-center shrink-0"><Icon className="h-4 w-4 text-accent" /></div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-text-primary truncate" title={item.name}>{item.name}</div>
                      <div className="text-[11px] text-text-muted">{item.role} · {item.company}</div>
                    </div>
                  </div>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === item.id ? null : item.id)} className="h-7 w-7 grid place-items-center rounded-md text-text-muted hover:text-text-primary hover:bg-hover" aria-label="Actions">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {menuOpen === item.id && (
                      <div className="absolute right-0 top-8 w-40 card-elevated glow-border p-1 z-20 animate-fade-in" onMouseLeave={() => setMenuOpen(null)}>
                        <MenuBtn icon={ExternalLink} label="Open report" onClick={() => open(item)} />
                        <MenuBtn icon={Pencil} label="Rename" onClick={() => rename(item.id)} />
                        <MenuBtn icon={Copy} label="Duplicate" onClick={() => duplicate(item.id)} />
                        <div className="my-1 border-t border-border-subtle" />
                        <MenuBtn icon={Trash2} label="Delete" danger onClick={() => remove(item.id)} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-text-muted mb-3 flex items-center gap-2">
                  {formatCardDate(item.date)}
                  {item.status === "draft" && <Badge tone="amber">Draft</Badge>}
                </div>

                <div className="flex items-end justify-between pt-3 border-t border-border-subtle cursor-pointer" onClick={() => open(item)}>
                  <ScoreDial score={item.ats} size="md" label={item.kind === "interview" ? "SCORE" : "ATS SCORE"} />
                  <div className="flex flex-col gap-1.5 items-end">
                    {item.kind !== "interview" && (
                      <Badge tone={item.match >= 80 ? "green" : item.match >= 60 ? "amber" : "red"}>{item.match}% Match</Badge>
                    )}
                    <Badge tone={item.improvement >= 0 ? "green" : "red"}>
                      {item.improvement >= 0 ? "+" : ""}{item.improvement}% improvement
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

function MenuBtn({ icon: Icon, label, onClick, danger }: { icon: typeof Copy; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={cn("w-full flex items-center gap-2 px-2.5 py-1.5 text-sm rounded hover:bg-hover transition-colors", danger ? "text-score-red" : "text-text-secondary hover:text-text-primary")}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}
