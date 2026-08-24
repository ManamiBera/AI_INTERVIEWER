"use client";

import { useRouter } from "next/navigation";
import { TrendingUp, TrendingDown, Award, Clock, Building2 } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScoreDial } from "@/components/ui/ScoreDial";
import { formatCardDate } from "@/lib/format";

const SESSIONS = [
  { id: "s1", date: "2026-08-23T10:00:00", role: "Software Engineer", company: "Google", type: "Technical", score: 84, duration: "22m" },
  { id: "s2", date: "2026-08-20T15:30:00", role: "Frontend Developer", company: "Meta", type: "Mixed", score: 78, duration: "20m" },
  { id: "s3", date: "2026-08-16T11:15:00", role: "Backend Developer", company: "Amazon", type: "Technical", score: 71, duration: "30m" },
  { id: "s4", date: "2026-08-12T09:45:00", role: "Software Engineer", company: "Startup", type: "Behavioral", score: 66, duration: "18m" },
  { id: "s5", date: "2026-08-08T14:00:00", role: "Software Engineer", company: "Microsoft", type: "Mixed", score: 62, duration: "25m" },
];

const TREND = [...SESSIONS].reverse().map((s, i) => ({
  name: `S${i + 1}`,
  score: s.score,
  date: new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
}));

export default function InterviewHistoryPage() {
  const router = useRouter();
  const best = SESSIONS.reduce((a, b) => (b.score > a.score ? b : a));
  const worst = SESSIONS.reduce((a, b) => (b.score < a.score ? b : a));

  return (
    <>
      <PageHeader
        eyebrow="Interview Prep"
        title="Interview History"
        subtitle="Every mock interview you've completed, with a performance trend and your strongest and weakest areas."
      />

      {/* Trend + insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Interview Score Over Time</CardTitle>
            <Badge tone="green"><TrendingUp className="h-3 w-3" /> +22 since first session</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TREND} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[40, 100]} stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", borderRadius: 8, color: "var(--text-primary)" }}
                  labelStyle={{ color: "var(--text-muted)" }}
                />
                <Line type="monotone" dataKey="score" stroke="var(--accent-cyan)" strokeWidth={2.5} dot={{ fill: "var(--accent-cyan)", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-score-green" /><span className="text-sm font-medium text-text-primary">Strongest Area</span></div>
            <div className="text-lg font-semibold text-text-primary">Behavioral</div>
            <div className="text-xs text-text-muted mt-0.5">Avg 81% across sessions</div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-1"><TrendingDown className="h-4 w-4 text-score-amber" /><span className="text-sm font-medium text-text-primary">Weakest Area</span></div>
            <div className="text-lg font-semibold text-text-primary">Communication</div>
            <div className="text-xs text-text-muted mt-0.5">Avg 64% — recommend practice</div>
          </Card>
        </div>
      </div>

      {/* Session list */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-text-primary">All Sessions</h2>
        <Badge tone="neutral">{SESSIONS.length}</Badge>
        <div className="ml-auto flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-text-muted"><Award className="h-3.5 w-3.5 text-score-green" /> Best: {best.score}</span>
          <span className="flex items-center gap-1 text-text-muted">Lowest: {worst.score}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {SESSIONS.map((s) => (
          <Card key={s.id} interactive className="p-5" onClick={() => router.push("/interview/mock")}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-text-primary">{s.role}</div>
                <div className="text-xs text-text-muted flex items-center gap-1 mt-0.5"><Building2 className="h-3 w-3" /> {s.company}</div>
              </div>
              <Badge tone="neutral">{s.type}</Badge>
            </div>
            <div className="text-[11px] text-text-muted mb-3">{formatCardDate(s.date)}</div>
            <div className="flex items-end justify-between pt-3 border-t border-border-subtle">
              <ScoreDial score={s.score} size="sm" label="SCORE" />
              <Badge tone="neutral"><Clock className="h-3 w-3" /> {s.duration}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
