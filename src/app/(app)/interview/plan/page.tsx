"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Circle, Clock, CalendarDays, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/cn";

type Task = { id: string; title: string; minutes: number; done: boolean };
type Day = { day: number; title: string; tasks: Task[] };

const INITIAL: Day[] = [
  { day: 1, title: "Resume + Introduction", tasks: [
    { id: "1a", title: "Polish your resume summary", minutes: 30, done: true },
    { id: "1b", title: "Prepare a 60-second self-introduction", minutes: 20, done: true },
    { id: "1c", title: "List 5 target companies", minutes: 15, done: false },
  ]},
  { day: 2, title: "JavaScript Fundamentals", tasks: [
    { id: "2a", title: "Closures, scope & hoisting", minutes: 40, done: false },
    { id: "2b", title: "Event loop & async", minutes: 35, done: false },
    { id: "2c", title: "5 easy JS questions", minutes: 30, done: false },
  ]},
  { day: 3, title: "React", tasks: [
    { id: "3a", title: "Hooks deep dive", minutes: 45, done: false },
    { id: "3b", title: "Rendering & performance", minutes: 40, done: false },
    { id: "3c", title: "Build a small component from scratch", minutes: 45, done: false },
  ]},
  { day: 4, title: "Data Structures & Algorithms", tasks: [
    { id: "4a", title: "Arrays & sliding window (3 problems)", minutes: 60, done: false },
    { id: "4b", title: "Linked lists & two pointers", minutes: 45, done: false },
  ]},
  { day: 5, title: "System Design", tasks: [
    { id: "5a", title: "Design a URL shortener", minutes: 50, done: false },
    { id: "5b", title: "Caching & scaling fundamentals", minutes: 40, done: false },
  ]},
  { day: 6, title: "Behavioral Questions", tasks: [
    { id: "6a", title: "Prepare 5 STAR stories", minutes: 50, done: false },
    { id: "6b", title: "Practice conflict & failure questions", minutes: 30, done: false },
  ]},
  { day: 7, title: "Full Mock Interview", tasks: [
    { id: "7a", title: "Run a 30-min mixed mock", minutes: 30, done: false },
    { id: "7b", title: "Review your report & note gaps", minutes: 25, done: false },
  ]},
];

export default function PreparationPlanPage() {
  const [days, setDays] = useState<Day[]>(INITIAL);

  const { total, done, pct } = useMemo(() => {
    const all = days.flatMap((d) => d.tasks);
    const done = all.filter((t) => t.done).length;
    return { total: all.length, done, pct: Math.round((done / all.length) * 100) };
  }, [days]);

  function toggle(dayNum: number, taskId: string) {
    setDays((ds) =>
      ds.map((d) =>
        d.day === dayNum ? { ...d, tasks: d.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) } : d,
      ),
    );
  }

  function regenerate() {
    toast.success("Plan regenerated for your target role & weak areas.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Interview Prep"
        title="7-Day Preparation Plan"
        subtitle="A personalized roadmap that adapts to your target role and weakest areas. Check off tasks as you complete them — progress updates automatically."
        actions={<Button variant="outline" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={regenerate}>Regenerate</Button>}
      />

      <Card variant="glow" className="p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-accent" />
            <CardTitle>Overall Progress</CardTitle>
          </div>
          <Badge tone={pct === 100 ? "green" : "cyan"}>{done}/{total} tasks · {pct}%</Badge>
        </div>
        <Progress value={pct} tone="auto" />
      </Card>

      <div className="space-y-4">
        {days.map((d) => {
          const dDone = d.tasks.filter((t) => t.done).length;
          const complete = dDone === d.tasks.length;
          const mins = d.tasks.reduce((s, t) => s + t.minutes, 0);
          return (
            <Card key={d.day} className={cn("p-5", complete && "border-score-green/30")}>
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("h-10 w-10 rounded-lg grid place-items-center font-bold shrink-0 border", complete ? "bg-score-green/15 text-score-green border-score-green/30" : "bg-accent/10 text-accent border-accent/25")}>
                  {d.day}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-text-primary">Day {d.day}: {d.title}</div>
                  <div className="text-xs text-text-muted flex items-center gap-2 mt-0.5">
                    <Clock className="h-3 w-3" /> ~{mins} min · {dDone}/{d.tasks.length} done
                  </div>
                </div>
                {complete && <Badge tone="green">Complete</Badge>}
              </div>
              <ul className="space-y-1.5 pl-1">
                {d.tasks.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => toggle(d.day, t.id)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-hover transition-colors text-left group"
                    >
                      {t.done ? <CheckCircle2 className="h-4 w-4 text-score-green shrink-0" /> : <Circle className="h-4 w-4 text-text-muted group-hover:text-accent shrink-0" />}
                      <span className={cn("text-sm flex-1", t.done ? "text-text-muted line-through" : "text-text-secondary")}>{t.title}</span>
                      <span className="text-[11px] text-text-muted">{t.minutes}m</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </>
  );
}
