"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, ArrowRight, Award, FileText, Zap } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RadialScore } from "@/components/ui/RadialScore";
import { Progress } from "@/components/ui/Progress";
import { EmptyState } from "@/components/ui/EmptyState";
import { useResumeStore } from "@/store/resumeStore";

export default function ATSVerdictPage() {
  const router = useRouter();
  const { activeAnalysis, aiSource } = useResumeStore();
  const analysis = activeAnalysis();

  if (!analysis) {
    return (
      <>
        <PageHeader eyebrow="Report Alpha · The Final Word" title="ATS Verdict" subtitle="Your composite recruiter-readiness score." />
        <EmptyState icon={FileText} title="No analysis yet" description="Upload your resume and analyze it to generate your ATS verdict." action={<Button onClick={() => router.push("/resume/overview")}>Upload &amp; Analyze</Button>} />
      </>
    );
  }

  const b = analysis.breakdown;
  const BREAKDOWN = [
    { label: "Keyword Match", score: b.keywordMatch, max: 30 },
    { label: "Formatting", score: b.formatting, max: 20 },
    { label: "Experience Relevance", score: b.experienceRelevance, max: 20 },
    { label: "Skills Alignment", score: b.skillsAlignment, max: 15 },
    { label: "Structure", score: b.structure, max: 15 },
  ];
  const META = [
    { label: "Recruiter Readiness", value: Math.round((analysis.atsScore + analysis.jobMatch) / 2) },
    { label: "ATS Compatibility", value: Math.round((b.formatting / 20) * 100) },
    { label: "Job Match", value: analysis.jobMatch },
    { label: "Impact Score", value: Math.round((b.experienceRelevance / 20) * 100) },
  ];
  const verdictLabel = analysis.atsScore >= 80 ? "Highly Compatible" : analysis.atsScore >= 60 ? "Moderately Compatible" : "Needs Work";
  const verdictTone = analysis.atsScore >= 80 ? "green" : analysis.atsScore >= 60 ? "amber" : "red";

  return (
    <>
      <PageHeader
        eyebrow="Report Alpha · The Final Word"
        title="ATS Verdict"
        subtitle="Your composite recruiter-readiness score, broken down by weighted category with an AI-generated executive summary."
        actions={
          <div className="flex items-center gap-2">
            {aiSource === "gemini" && <Badge tone="cyan"><Zap className="h-3 w-3" /> Gemini AI</Badge>}
            <Button leftIcon={<Sparkles className="h-4 w-4" />} onClick={() => { toast.success("Opening the editor to build an improved draft…"); router.push("/resume/editor"); }}>
              Generate Improved Resume
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card variant="glow" className="p-6 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-accent/80 font-semibold mb-4"><Award className="h-3.5 w-3.5" /> Overall Score</div>
          <RadialScore value={analysis.atsScore} size={200} strokeWidth={14} label="ATS Verdict" />
          <div className="mt-4"><Badge tone={verdictTone}>{verdictLabel}</Badge></div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <CardTitle className="mb-5">Score Breakdown</CardTitle>
          <div className="space-y-4">
            {BREAKDOWN.map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-text-secondary">{row.label}</span>
                  <span className="text-text-primary font-medium">{row.score}<span className="text-text-muted">/{row.max}</span></span>
                </div>
                <Progress value={(row.score / row.max) * 100} tone="auto" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border-subtle">
            {META.map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-2xl font-bold text-text-primary">{m.value}%</div>
                <div className="text-[10px] uppercase tracking-widest text-text-muted mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card variant="glow" className="p-6 mb-8">
        <div className="flex items-center gap-2 mb-3"><Sparkles className="h-4 w-4 text-accent" /><CardTitle>Executive Summary</CardTitle></div>
        <p className="text-sm text-text-secondary leading-relaxed">{analysis.executiveSummary}</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <VerdictList title="Strengths" tone="green" icon={CheckCircle2} items={analysis.strengths} />
        <VerdictList title="Weaknesses" tone="amber" icon={AlertTriangle} items={analysis.weaknesses} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VerdictList title="Critical Fixes" tone="red" icon={XCircle} items={analysis.criticalFixes} action={{ label: "Open Formatting", href: "/resume/formatting" }} />
        <VerdictList title="Recommended Improvements" tone="cyan" icon={Sparkles} items={analysis.recommendedImprovements} action={{ label: "Open Keywords", href: "/resume/keywords" }} />
      </div>
    </>
  );
}

function VerdictList({ title, tone, icon: Icon, items, action }: {
  title: string; tone: "green" | "amber" | "red" | "cyan"; icon: typeof CheckCircle2; items: string[]; action?: { label: string; href: string };
}) {
  const router = useRouter();
  const iconCls = { green: "text-score-green", amber: "text-score-amber", red: "text-score-red", cyan: "text-accent" }[tone];
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4"><Icon className={`h-4 w-4 ${iconCls}`} /><CardTitle>{title}</CardTitle></div>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-text-secondary">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${iconCls.replace("text-", "bg-")}`} />{it}
          </li>
        ))}
      </ul>
      {action && (
        <Button variant="ghost" size="sm" className="mt-4" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} onClick={() => router.push(action.href)}>{action.label}</Button>
      )}
    </Card>
  );
}
