"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Plus, Sparkles, Search, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useResumeStore } from "@/store/resumeStore";
import type { Keyword } from "@/types";
import { cn } from "@/lib/cn";

export default function KeywordsPage() {
  const router = useRouter();
  const { activeAnalysis } = useResumeStore();
  const analysis = activeAnalysis();
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState<string[]>([]);

  if (!analysis) return <NoAnalysis router={router} />;

  const { matched, missing, overused, recommended } = analysis.keywords;

  function addKeyword(term: string) {
    if (added.includes(term)) return;
    setAdded((a) => [...a, term]);
    toast.success(`"${term}" queued — we'll suggest where to insert it naturally.`, { description: "No keyword stuffing — placement is context-aware." });
  }

  const filter = (list: Keyword[]) => (query.trim() ? list.filter((k) => k.term.toLowerCase().includes(query.toLowerCase())) : list);

  return (
    <>
      <PageHeader
        eyebrow="Resume Intelligence"
        title="Keyword Intelligence"
        subtitle="Match your resume against role-specific hard skills, tools, technologies, and action verbs — without keyword stuffing."
        actions={
          <div className="relative w-56 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input placeholder="Filter keywords…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryStat label="Matched" value={matched.length} tone="green" icon={CheckCircle2} />
        <SummaryStat label="Missing" value={missing.length} tone="red" icon={XCircle} />
        <SummaryStat label="Overused" value={overused.length} tone="amber" icon={AlertTriangle} />
        <SummaryStat label="Recommended" value={recommended.length} tone="cyan" icon={Sparkles} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KeywordSection title="Matched Keywords" tone="green" icon={CheckCircle2} items={filter(matched)} />
        <KeywordSection title="Missing Keywords" tone="red" icon={XCircle} items={filter(missing)} onAdd={addKeyword} added={added} />
        <KeywordSection title="Overused Keywords" tone="amber" icon={AlertTriangle} items={filter(overused)} />
        <KeywordSection title="Recommended Keywords" tone="cyan" icon={Sparkles} items={filter(recommended)} onAdd={addKeyword} added={added} />
      </div>
    </>
  );
}

function NoAnalysis({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <>
      <PageHeader eyebrow="Resume Intelligence" title="Keyword Intelligence" subtitle="Match your resume against role-specific keywords." />
      <EmptyState icon={FileText} title="No analysis yet" description="Upload your resume and run an analysis to see matched, missing, overused, and recommended keywords." action={<Button onClick={() => router.push("/resume/overview")}>Upload &amp; Analyze</Button>} />
    </>
  );
}

function SummaryStat({ label, value, tone, icon: Icon }: { label: string; value: number; tone: "green" | "red" | "amber" | "cyan"; icon: typeof CheckCircle2 }) {
  const toneCls = { green: "text-score-green", red: "text-score-red", amber: "text-score-amber", cyan: "text-accent" }[tone];
  return (
    <Card className="p-4 flex items-center gap-3">
      <Icon className={cn("h-5 w-5", toneCls)} />
      <div>
        <div className="text-xl font-bold text-text-primary leading-none">{value}</div>
        <div className="text-[10px] uppercase tracking-widest text-text-muted mt-1">{label}</div>
      </div>
    </Card>
  );
}

function KeywordSection({ title, tone, icon: Icon, items, onAdd, added = [] }: {
  title: string; tone: "green" | "red" | "amber" | "cyan"; icon: typeof CheckCircle2; items: Keyword[]; onAdd?: (term: string) => void; added?: string[];
}) {
  const toneCls = { green: "text-score-green", red: "text-score-red", amber: "text-score-amber", cyan: "text-accent" }[tone];
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={cn("h-4 w-4", toneCls)} />
        <CardTitle>{title}</CardTitle>
        <Badge tone={tone} className="ml-auto">{items.length}</Badge>
      </div>
      {items.length === 0 ? (
        <div className="text-sm text-text-muted py-6 text-center">No keywords in this group.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((k) => (
            <li key={k.term} className="rounded-md border border-border-subtle bg-elevated/40 p-3 hover:border-border-glow transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-text-primary truncate">{k.term}</span>
                  <Badge tone={k.importance === "high" ? "cyan" : k.importance === "medium" ? "amber" : "neutral"} variant="outline" className="shrink-0 capitalize">{k.importance}</Badge>
                </div>
                {onAdd && (
                  <Button size="sm" variant={added.includes(k.term) ? "subtle" : "outline"} leftIcon={<Plus className="h-3 w-3" />} onClick={() => onAdd(k.term)} disabled={added.includes(k.term)}>
                    {added.includes(k.term) ? "Queued" : "Add"}
                  </Button>
                )}
              </div>
              <div className="mt-2 flex items-center gap-4 text-[11px] text-text-muted">
                <span>In resume: <b className="text-text-secondary">{k.resumeOccurrence}×</b></span>
                <span>JD frequency: <b className="text-text-secondary">{k.frequency}×</b></span>
              </div>
              {k.recommendation && <div className="mt-1.5 text-xs text-text-secondary">{k.recommendation}</div>}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
