"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertOctagon, AlertTriangle, CheckCircle2, Wand2, ChevronDown, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useResumeStore } from "@/store/resumeStore";
import type { FormattingIssue } from "@/types";
import { cn } from "@/lib/cn";

const META = {
  critical: { label: "Critical", tone: "red" as const, icon: AlertOctagon },
  warning: { label: "Warning", tone: "amber" as const, icon: AlertTriangle },
  good: { label: "Good", tone: "green" as const, icon: CheckCircle2 },
};

export default function FormattingPage() {
  const router = useRouter();
  const { activeAnalysis, updateActive } = useResumeStore();
  const analysis = activeAnalysis();
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!analysis) {
    return (
      <>
        <PageHeader eyebrow="Resume Intelligence" title="Formatting Audit" subtitle="ATS-parsing checks across layout, typography, spacing, and structure." />
        <EmptyState icon={FileText} title="No analysis yet" description="Upload your resume and analyze it to run a full formatting audit." action={<Button onClick={() => router.push("/resume/overview")}>Upload &amp; Analyze</Button>} />
      </>
    );
  }

  const issues = analysis.formatting;
  const counts = {
    critical: issues.filter((i) => i.severity === "critical").length,
    warning: issues.filter((i) => i.severity === "warning").length,
    good: issues.filter((i) => i.severity === "good").length,
  };

  async function fixAll() {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1200));
    updateActive({ formatting: issues.map((i) => (i.fixable ? { ...i, severity: "good", title: `${i.title} — fixed` } : i)) });
    setBusy(false);
    toast.success("Auto-fixable formatting issues resolved.");
  }

  function fixOne(id: string) {
    updateActive({ formatting: issues.map((i) => (i.id === id ? { ...i, severity: "good", title: `${i.title} — fixed` } : i)) });
    toast.success("Issue fixed.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Resume Intelligence"
        title="Formatting Audit"
        subtitle="ATS-parsing checks across layout, typography, spacing, and structure. Fix issues automatically or review each in detail."
        actions={counts.critical + counts.warning > 0 ? <Button leftIcon={<Wand2 className="h-4 w-4" />} loading={busy} onClick={fixAll}>Fix Automatically</Button> : undefined}
      />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon={AlertOctagon} tone="text-score-red" value={counts.critical} label="Critical" />
        <StatCard icon={AlertTriangle} tone="text-score-amber" value={counts.warning} label="Warnings" />
        <StatCard icon={CheckCircle2} tone="text-score-green" value={counts.good} label="Passed" />
      </div>

      <div className="space-y-3">
        {issues.map((issue) => (
          <IssueRow key={issue.id} issue={issue} open={expanded === issue.id} onToggle={() => setExpanded(expanded === issue.id ? null : issue.id)} onFix={() => fixOne(issue.id)} />
        ))}
      </div>
    </>
  );
}

function StatCard({ icon: Icon, tone, value, label }: { icon: typeof AlertOctagon; tone: string; value: number; label: string }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <Icon className={cn("h-5 w-5", tone)} />
      <div>
        <div className="text-xl font-bold text-text-primary leading-none">{value}</div>
        <div className="text-[10px] uppercase tracking-widest text-text-muted mt-1">{label}</div>
      </div>
    </Card>
  );
}

function IssueRow({ issue, open, onToggle, onFix }: { issue: FormattingIssue; open: boolean; onToggle: () => void; onFix: () => void }) {
  const m = META[issue.severity];
  const Icon = m.icon;
  return (
    <Card className={cn("overflow-hidden", issue.severity === "critical" && "border-score-red/30")}>
      <button className="w-full flex items-center gap-3 p-4 text-left" onClick={onToggle}>
        <Icon className={cn("h-5 w-5 shrink-0", m.tone === "red" ? "text-score-red" : m.tone === "amber" ? "text-score-amber" : "text-score-green")} />
        <div className="flex-1 min-w-0"><div className="text-sm font-medium text-text-primary">{issue.title}</div></div>
        <Badge tone={m.tone}>{m.label}</Badge>
        <ChevronDown className={cn("h-4 w-4 text-text-muted transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-4 pb-4 pl-12 animate-fade-in">
          <p className="text-sm text-text-secondary">{issue.detail}</p>
          {issue.fixable && issue.severity !== "good" && (
            <Button size="sm" variant="outline" className="mt-3" leftIcon={<Wand2 className="h-3.5 w-3.5" />} onClick={onFix}>Fix this issue</Button>
          )}
        </div>
      )}
    </Card>
  );
}
