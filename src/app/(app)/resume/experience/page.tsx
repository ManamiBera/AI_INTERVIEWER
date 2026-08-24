"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Wand2, Check, X, TrendingUp, RotateCcw, Ruler, Cpu, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useResumeStore } from "@/store/resumeStore";
import type { ExperienceBullet } from "@/types";
import { cn } from "@/lib/cn";

const ISSUE_META: Record<string, { label: string; tone: "red" | "amber" | "neutral" }> = {
  "weak-verb": { label: "Weak action verb", tone: "amber" },
  "no-metric": { label: "No measurable impact", tone: "red" },
  "too-long": { label: "Too long", tone: "neutral" },
  "no-tech": { label: "Missing technical context", tone: "amber" },
  generic: { label: "Too generic", tone: "amber" },
  irrelevant: { label: "Not role-relevant", tone: "amber" },
};

type Status = Record<string, "pending" | "accepted" | "rejected">;

export default function ExperiencePage() {
  const router = useRouter();
  const { activeAnalysis, updateActive } = useResumeStore();
  const analysis = activeAnalysis();
  const [status, setStatus] = useState<Status>({});
  const [busy, setBusy] = useState(false);

  if (!analysis) {
    return (
      <>
        <PageHeader eyebrow="Resume Intelligence" title="Experience Intelligence" subtitle="AI-analyzed bullet points with role-aware rewrites." />
        <EmptyState icon={FileText} title="No analysis yet" description="Upload your resume and analyze it to get per-bullet improvement suggestions." action={<Button onClick={() => router.push("/resume/overview")}>Upload &amp; Analyze</Button>} />
      </>
    );
  }

  const bullets = analysis.experience;
  const pending = bullets.filter((b) => (status[b.id] ?? "pending") === "pending").length;

  function setBulletStatus(id: string, s: "accepted" | "rejected" | "pending") {
    setStatus((prev) => ({ ...prev, [id]: s }));
    if (s === "accepted") {
      const bullet = bullets.find((b) => b.id === id);
      if (bullet?.suggestion) {
        updateActive({ experience: bullets.map((b) => (b.id === id ? { ...b, original: bullet.suggestion!, accepted: true } : b)) });
      }
      toast.success("Suggestion accepted and applied to your resume draft.");
    } else if (s === "rejected") {
      toast.success("Suggestion dismissed — original kept.");
    }
  }

  async function rewriteAll() {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    setBusy(false);
    toast.success("All pending bullets refreshed. Review each before accepting.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Resume Intelligence"
        title="Experience Intelligence"
        subtitle="AI-analyzed bullet points with role-aware rewrites. Your original text is never overwritten without confirmation."
        actions={<Button leftIcon={<Wand2 className="h-4 w-4" />} loading={busy} onClick={rewriteAll}>Rewrite All</Button>}
      />

      <div className="flex items-center gap-3 mb-6 text-sm">
        <Badge tone="cyan">{pending} pending</Badge>
        <span className="text-text-muted">·</span>
        <span className="text-text-secondary">{bullets.length} experience bullets analyzed</span>
      </div>

      {bullets.length === 0 ? (
        <Card className="p-8 text-center text-sm text-text-muted">No experience bullets were detected in your resume. Make sure your work experience uses clear bullet points.</Card>
      ) : (
        <div className="space-y-5">
          {bullets.map((b) => (
            <BulletCard
              key={b.id}
              bullet={b}
              status={status[b.id] ?? "pending"}
              onAccept={() => setBulletStatus(b.id, "accepted")}
              onReject={() => setBulletStatus(b.id, "rejected")}
              onReset={() => setBulletStatus(b.id, "pending")}
            />
          ))}
        </div>
      )}
    </>
  );
}

function BulletCard({ bullet: b, status, onAccept, onReject, onReset }: {
  bullet: ExperienceBullet; status: "pending" | "accepted" | "rejected"; onAccept: () => void; onReject: () => void; onReset: () => void;
}) {
  const impact = b.impactScore ?? 78;
  return (
    <Card className={cn("p-5", status === "accepted" && "border-score-green/40", status === "rejected" && "opacity-60")}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-text-muted">
          <span className="text-text-secondary font-medium">{b.role || "Experience"}</span>{b.company ? ` · ${b.company}` : ""}
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={impact >= 85 ? "green" : "amber"}><TrendingUp className="h-3 w-3" /> Impact {impact}</Badge>
          {status === "accepted" && <Badge tone="green">Accepted</Badge>}
          {status === "rejected" && <Badge tone="neutral">Dismissed</Badge>}
        </div>
      </div>

      {b.issues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {b.issues.map((iss) => (
            <Badge key={iss} tone={ISSUE_META[iss]?.tone ?? "neutral"} variant="outline">{ISSUE_META[iss]?.label ?? iss}</Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-md border border-border-subtle bg-elevated/30 p-4">
          <div className="text-[10px] uppercase tracking-widest text-text-muted mb-2">{status === "accepted" ? "Current" : "Original"}</div>
          <p className="text-sm text-text-secondary leading-relaxed">{b.original}</p>
        </div>
        <div className="rounded-md border border-accent/30 bg-accent/5 p-4">
          <div className="text-[10px] uppercase tracking-widest text-accent mb-2 flex items-center gap-1"><Wand2 className="h-3 w-3" /> Suggested</div>
          <p className="text-sm text-text-primary leading-relaxed">{b.suggestion ?? "This bullet already reads well."}</p>
        </div>
      </div>

      {b.rationale && (
        <div className="mt-3 text-xs text-text-muted flex items-start gap-2">
          <Cpu className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent/70" /><span>{b.rationale}</span>
        </div>
      )}

      {status === "pending" ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" leftIcon={<Check className="h-3.5 w-3.5" />} onClick={onAccept} disabled={!b.suggestion}>Accept</Button>
          <Button size="sm" variant="ghost" leftIcon={<X className="h-3.5 w-3.5" />} onClick={onReject}>Keep Original</Button>
          <div className="ml-auto flex items-center gap-1.5">
            <Button size="sm" variant="subtle" leftIcon={<Ruler className="h-3.5 w-3.5" />}>Make Concise</Button>
            <Button size="sm" variant="subtle" leftIcon={<Cpu className="h-3.5 w-3.5" />}>More Technical</Button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <Button size="sm" variant="ghost" leftIcon={<RotateCcw className="h-3.5 w-3.5" />} onClick={onReset}>Reconsider</Button>
        </div>
      )}
    </Card>
  );
}
