"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sparkles,
  Upload,
  Briefcase,
  Wand2,
  Mic,
  ListChecks,
  FileText,
  History as HistoryIcon,
  TrendingUp,
  Flame,
  Award,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatTile } from "@/components/dashboard/StatTile";
import { ScoreDial } from "@/components/ui/ScoreDial";
import { RadialScore } from "@/components/ui/RadialScore";
import { Progress } from "@/components/ui/Progress";
import { formatCardDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

const QUICK_ACTIONS: Array<{ title: string; description: string; href: string; icon: LucideIcon }> = [
  { title: "Upload Resume", description: "PDF or DOCX up to 10MB", href: "/resume/overview", icon: Upload },
  { title: "Analyze Job Description", description: "Compare against a JD", href: "/resume/overview", icon: Briefcase },
  { title: "Improve Resume", description: "AI rewrites weak bullets", href: "/resume/experience", icon: Wand2 },
  { title: "Start Mock Interview", description: "Practice with an AI interviewer", href: "/interview/mock", icon: Mic },
  { title: "Generate Interview Questions", description: "Tailored to your role", href: "/interview/questions", icon: ListChecks },
  { title: "View Previous Reports", description: "Track your progress", href: "/history", icon: HistoryIcon },
];

const RECENT: Array<{ name: string; date: string; score: number; keywords: number; match: number }> = [
  { name: "Software_Engineer_Google.pdf", date: "2026-08-22T14:20:00", score: 88, keywords: 12, match: 92 },
  { name: "Sarah_Chen_Senior_UI.pdf",     date: "2026-08-20T09:15:00", score: 94, keywords: 18, match: 97 },
  { name: "Marcus_V_Product_Lead.pdf",    date: "2026-08-18T16:45:00", score: 62, keywords:  8, match: 55 },
];

const RECOMMENDED: Array<{ title: string; href: string }> = [
  { title: "Improve 3 weak resume bullets", href: "/resume/experience" },
  { title: "Practice system design questions", href: "/interview/questions" },
  { title: "Review missing keywords", href: "/resume/keywords" },
  { title: "Complete behavioral interview set", href: "/interview/mock" },
];

const READINESS_BREAKDOWN = [
  { label: "Technical",     value: 68 },
  { label: "Behavioral",    value: 81 },
  { label: "Resume",        value: 88 },
  { label: "Communication", value: 64 },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <>
      {/* Hero */}
      <PageHeader
        eyebrow="Welcome back, Aditya"
        title="Your career, intelligently prepared."
        subtitle="AI Interviewer analyzes your resume against real recruiter signals and coaches you through interviews with role-aware precision."
        actions={
          <>
            <Button
              variant="ghost"
              leftIcon={<Mic className="h-4 w-4" />}
              onClick={() => router.push("/interview/mock")}
            >
              Practice Interview
            </Button>
            <Button
              leftIcon={<Sparkles className="h-4 w-4" />}
              onClick={() => router.push("/resume/overview")}
            >
              Analyze Resume
            </Button>
          </>
        }
      />

      {/* Stat row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatTile label="Resume Health" value="88" delta="+6 this month" icon={FileText} tone="green" />
        <StatTile label="ATS Score" value="87" delta="+12% since last week" icon={Award} tone="cyan" />
        <StatTile label="Job Match" value="92%" delta="Target role: Sr. SWE" icon={Briefcase} tone="cyan" />
        <StatTile label="Interview Ready" value="72%" delta="+8% this week" icon={TrendingUp} tone="amber" />
      </div>

      {/* Main grid: readiness card + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Interview Readiness — spans 1 */}
        <Card variant="glow" className="lg:col-span-1 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-accent/80 font-semibold">
                Interview Readiness
              </div>
              <div className="mt-1 text-lg font-semibold text-text-primary">Overall Score</div>
            </div>
            <Badge tone="green">
              <Flame className="h-3 w-3" />
              +8% this week
            </Badge>
          </div>
          <div className="flex-1 grid place-items-center py-2">
            <RadialScore value={72} size={168} label="Readiness" />
          </div>
          <div className="mt-4 space-y-3">
            {READINESS_BREAKDOWN.map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-text-secondary">{b.label}</span>
                  <span className="text-text-primary font-medium">{b.value}%</span>
                </div>
                <Progress value={b.value} tone="auto" />
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-5 w-full"
            rightIcon={<ChevronRight className="h-4 w-4" />}
            onClick={() => router.push("/interview")}
          >
            Open Interview Dashboard
          </Button>
        </Card>

        {/* Quick Actions — spans 2 */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Quick Actions</CardTitle>
            <span className="text-xs text-text-muted">Jump straight in</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.title}
                  onClick={() => router.push(a.href)}
                  className={cn(
                    "text-left p-4 rounded-lg border transition-all group",
                    "border-border-subtle bg-elevated/40 hover:border-accent/40 hover:bg-elevated hover:shadow-glow-sm",
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-9 w-9 rounded-md grid place-items-center bg-accent/10 border border-accent/25 text-accent">
                      <Icon className="h-4 w-4" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-text-muted group-hover:text-accent transition-colors" />
                  </div>
                  <div className="text-sm font-semibold text-text-primary">{a.title}</div>
                  <div className="mt-1 text-xs text-text-secondary">{a.description}</div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent + Recommended row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Recent Analyses</h2>
              <p className="text-xs text-text-muted mt-0.5">Your latest resume intelligence reports</p>
            </div>
            <Link
              href="/history"
              className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {RECENT.map((r) => (
              <Card
                key={r.name}
                interactive
                className="p-4"
                onClick={() => {
                  toast.success(`Opening report for ${r.name}`);
                  router.push("/resume/ats-verdict");
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="text-sm font-semibold text-text-primary truncate pr-2" title={r.name}>
                    {r.name}
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-text-muted shrink-0" />
                </div>
                <div className="text-[11px] text-text-muted mt-1">{formatCardDate(r.date)}</div>
                <div className="mt-4 pt-4 border-t border-border-subtle flex items-end justify-between">
                  <ScoreDial score={r.score} size="md" label="ATS SCORE" />
                  <div className="flex flex-col gap-1.5 items-end">
                    <Badge tone="cyan">{r.keywords} Keywords</Badge>
                    <Badge tone={r.match >= 80 ? "green" : r.match >= 60 ? "amber" : "red"}>
                      {r.match}% Match
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recommended Next Steps</CardTitle>
          </div>
          <ol className="space-y-2">
            {RECOMMENDED.map((r, i) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md border transition-all",
                    "border-border-subtle hover:border-accent/40 hover:bg-hover group",
                  )}
                >
                  <div className="h-7 w-7 rounded-full bg-accent/10 border border-accent/25 grid place-items-center text-xs font-semibold text-accent shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm text-text-secondary group-hover:text-text-primary flex-1">
                    {r.title}
                  </span>
                  <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-accent" />
                </Link>
              </li>
            ))}
          </ol>
          <div className="mt-5 p-4 rounded-md bg-accent/5 border border-accent/20">
            <div className="text-xs font-semibold text-accent mb-1 uppercase tracking-widest">
              Daily prep tip
            </div>
            <p className="text-sm text-text-secondary">
              Frame answers with STAR: Situation, Task, Action, Result — recruiters look for the Result last but weigh it heaviest.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
