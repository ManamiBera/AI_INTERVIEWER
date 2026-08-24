"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mic, BookOpen, CalendarDays, ChevronRight, Cpu, MessageSquare, Volume2, Brain } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RadialScore } from "@/components/ui/RadialScore";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/cn";

const ROLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "Data Scientist", "Product Manager", "Consultant",
];

const READINESS = [
  { label: "Technical", value: 68, icon: Cpu },
  { label: "Behavioral", value: 81, icon: MessageSquare },
  { label: "Communication", value: 64, icon: Volume2 },
  { label: "Role Knowledge", value: 74, icon: Brain },
];

const TODAY = [
  { label: "5 Technical Questions", href: "/interview/questions", icon: BookOpen },
  { label: "3 Behavioral Questions", href: "/interview/questions", icon: MessageSquare },
  { label: "1 Mock Interview", href: "/interview/mock", icon: Mic },
];

export default function InterviewDashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState("Software Engineer");

  return (
    <>
      <PageHeader
        eyebrow="Interview Prep"
        title="Prepare with confidence."
        subtitle="Track your interview readiness across technical, behavioral, and communication dimensions — then close the gaps with targeted practice."
        actions={
          <Button leftIcon={<Mic className="h-4 w-4" />} onClick={() => router.push("/interview/mock")}>
            Start Mock Interview
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card variant="glow" className="p-6 flex flex-col items-center text-center">
          <div className="text-[10px] uppercase tracking-widest text-accent/80 font-semibold mb-4">Interview Readiness</div>
          <RadialScore value={72} size={180} label="Overall" />
          <Badge tone="green" className="mt-4">+8% this week</Badge>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <CardTitle className="mb-5">Readiness Breakdown</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            {READINESS.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.label}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="h-4 w-4 text-accent" />
                    <span className="text-sm text-text-secondary flex-1">{r.label}</span>
                    <span className="text-sm text-text-primary font-medium">{r.value}%</span>
                  </div>
                  <Progress value={r.value} tone="auto" />
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-6 border-t border-border-subtle">
            <div className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-3">Target Role</div>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); toast.success(`Target role set to ${r}`); }}
                  className={cn(
                    "px-3 h-8 rounded-full text-xs font-medium border transition-all",
                    role === r ? "bg-accent/15 text-accent border-accent/40" : "border-border-subtle text-text-secondary hover:border-accent/30 hover:text-text-primary",
                  )}
                >
                  {r}
                </button>
              ))}
              <button
                onClick={() => toast("Add a custom role in Profile → Career Info")}
                className="px-3 h-8 rounded-full text-xs font-medium border border-dashed border-border-subtle text-text-muted hover:text-text-secondary"
              >
                + Custom
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Today&apos;s Preparation</CardTitle>
            <Badge tone="cyan">3 tasks · ~35 min</Badge>
          </div>
          <div className="space-y-3">
            {TODAY.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.label}
                  onClick={() => router.push(t.href)}
                  className="w-full flex items-center gap-3 p-4 rounded-md border border-border-subtle bg-elevated/40 hover:border-accent/40 hover:bg-elevated transition-all group text-left"
                >
                  <div className="h-9 w-9 rounded-md bg-accent/10 border border-accent/25 grid place-items-center text-accent"><Icon className="h-4 w-4" /></div>
                  <span className="text-sm font-medium text-text-primary flex-1">{t.label}</span>
                  <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-accent" />
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <CardTitle className="mb-4">Jump To</CardTitle>
          <div className="space-y-2">
            <QuickLink label="Question Bank" desc="200+ curated questions" icon={BookOpen} onClick={() => router.push("/interview/questions")} />
            <QuickLink label="Preparation Plan" desc="Your 7-day roadmap" icon={CalendarDays} onClick={() => router.push("/interview/plan")} />
            <QuickLink label="Interview History" desc="Past sessions & trends" icon={Mic} onClick={() => router.push("/interview/history")} />
          </div>
        </Card>
      </div>
    </>
  );
}

function QuickLink({ label, desc, icon: Icon, onClick }: { label: string; desc: string; icon: typeof BookOpen; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-hover transition-colors text-left group">
      <Icon className="h-4 w-4 text-accent" />
      <div className="flex-1">
        <div className="text-sm font-medium text-text-primary">{label}</div>
        <div className="text-[11px] text-text-muted">{desc}</div>
      </div>
      <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-accent" />
    </button>
  );
}
