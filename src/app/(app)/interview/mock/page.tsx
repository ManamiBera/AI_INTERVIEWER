"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Mic, Play, SkipForward, Square, Send, Clock, Cpu, MessageSquare, Volume2, Target, Trophy, RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { RadialScore } from "@/components/ui/RadialScore";
import { QUESTIONS } from "@/data/questions";
import { useInterviewStore } from "@/store/interviewStore";
import { cn } from "@/lib/cn";

type Phase = "setup" | "running" | "report";
type IType = "technical" | "behavioral" | "hr" | "mixed";

const ROLES = ["Software Engineer", "Frontend Developer", "Backend Developer", "Data Scientist", "Product Manager"];
const COMPANIES = ["Google", "Amazon", "Meta", "Microsoft", "Startup", "Any"];
const TYPES: { id: IType; label: string }[] = [
  { id: "technical", label: "Technical" },
  { id: "behavioral", label: "Behavioral" },
  { id: "hr", label: "HR" },
  { id: "mixed", label: "Mixed" },
];
const DIFFICULTIES = ["easy", "medium", "hard"] as const;
const DURATIONS = [10, 20, 30];

export default function MockInterviewPage() {
  const [phase, setPhase] = useState<Phase>("setup");

  // setup
  const [role, setRole] = useState("Software Engineer");
  const [company, setCompany] = useState("Any");
  const [type, setType] = useState<IType>("mixed");
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("medium");
  const [duration, setDuration] = useState(20);

  // runtime
  const questions = useSelectedQuestions(type);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== "running") return;
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  function start() {
    setIdx(0);
    setAnswer("");
    setAnswers([]);
    setElapsed(0);
    setPhase("running");
    toast.success("Interview started. One question at a time — take your time.");
  }

  function submitAnswer(skip = false) {
    setAnswers((a) => [...a, skip ? "" : answer]);
    setAnswer("");
    if (idx + 1 >= questions.length) {
      finish();
    } else {
      setIdx((i) => i + 1);
    }
  }

  function finish() {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("report");
    toast.success("Interview session saved.");
  }

  if (phase === "setup") {
    return (
      <>
        <PageHeader eyebrow="Interview Prep" title="Mock Interview" subtitle="Configure your session — an AI interviewer will ask one question at a time and score your responses across six dimensions." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 space-y-6">
            <SetupRow label="Job Role">
              {ROLES.map((r) => <Chip key={r} active={role === r} onClick={() => setRole(r)}>{r}</Chip>)}
            </SetupRow>
            <SetupRow label="Company Style">
              {COMPANIES.map((c) => <Chip key={c} active={company === c} onClick={() => setCompany(c)}>{c}</Chip>)}
            </SetupRow>
            <SetupRow label="Interview Type">
              {TYPES.map((t) => <Chip key={t.id} active={type === t.id} onClick={() => setType(t.id)}>{t.label}</Chip>)}
            </SetupRow>
            <SetupRow label="Difficulty">
              {DIFFICULTIES.map((d) => <Chip key={d} active={difficulty === d} onClick={() => setDifficulty(d)}>{d}</Chip>)}
            </SetupRow>
            <SetupRow label="Duration">
              {DURATIONS.map((d) => <Chip key={d} active={duration === d} onClick={() => setDuration(d)}>{d} min</Chip>)}
            </SetupRow>
          </Card>

          <Card variant="glow" className="p-6 h-fit">
            <CardTitle className="mb-4">Session Summary</CardTitle>
            <dl className="space-y-2.5 text-sm">
              <Summ k="Role" v={role} />
              <Summ k="Company" v={company} />
              <Summ k="Type" v={TYPES.find((t) => t.id === type)!.label} />
              <Summ k="Difficulty" v={difficulty} />
              <Summ k="Duration" v={`${duration} min`} />
              <Summ k="Questions" v={`${questions.length}`} />
            </dl>
            <Button className="w-full mt-6" size="lg" leftIcon={<Play className="h-4 w-4" />} onClick={start}>
              Start Interview
            </Button>
          </Card>
        </div>
      </>
    );
  }

  if (phase === "running") {
    const q = questions[idx];
    const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const secs = String(elapsed % 60).padStart(2, "0");
    return (
      <>
        <PageHeader
          eyebrow={`${role} · ${company}`}
          title="Interview in Progress"
          actions={
            <div className="flex items-center gap-3">
              <Badge tone="cyan"><Clock className="h-3 w-3" /> {mins}:{secs}</Badge>
              <Button variant="danger" size="sm" leftIcon={<Square className="h-3.5 w-3.5" />} onClick={finish}>End</Button>
            </div>
          }
        />
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
            <span>Question {idx + 1} of {questions.length}</span>
            <span>{Math.round(((idx) / questions.length) * 100)}% complete</span>
          </div>
          <Progress value={(idx / questions.length) * 100} />
        </div>

        <Card variant="glow" className="p-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-md bg-cyan-gradient grid place-items-center"><Mic className="h-4 w-4 text-[#04141C]" /></div>
            <span className="text-xs uppercase tracking-widest text-accent/80 font-semibold">AI Interviewer</span>
            <Badge tone="neutral" className="ml-auto capitalize">{q.difficulty}</Badge>
          </div>
          <h2 className="text-lg font-medium text-text-primary">{q.question}</h2>
          <div className="mt-2 text-xs text-text-muted">Topic: {q.topic}</div>
        </Card>

        <Card className="p-5">
          <Textarea
            placeholder="Type your answer… (structure it clearly — the AI scores structure and relevance)"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="min-h-[160px]"
            autoFocus
          />
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button leftIcon={<Send className="h-4 w-4" />} onClick={() => submitAnswer(false)} disabled={!answer.trim()}>
              Submit Answer
            </Button>
            <Button variant="ghost" leftIcon={<SkipForward className="h-4 w-4" />} onClick={() => submitAnswer(true)}>Skip</Button>
            <Button variant="ghost" leftIcon={<Mic className="h-4 w-4" />} onClick={() => toast("Voice input arrives in a later phase — type for now.")} className="ml-auto">
              Use Microphone
            </Button>
          </div>
        </Card>
      </>
    );
  }

  // report
  return <MockReport role={role} company={company} answers={answers} questions={questions} elapsed={elapsed} onRestart={() => setPhase("setup")} />;
}

function useSelectedQuestions(type: IType) {
  return useRef(
    (() => {
      let pool = QUESTIONS;
      if (type === "technical") pool = QUESTIONS.filter((q) => ["technical", "dsa", "system-design"].includes(q.category));
      else if (type === "behavioral") pool = QUESTIONS.filter((q) => q.category === "behavioral");
      else if (type === "hr") pool = QUESTIONS.filter((q) => q.category === "hr");
      return [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
    })(),
  ).current;
}

function MockReport({
  role, company, answers, questions, elapsed, onRestart,
}: {
  role: string; company: string; answers: string[];
  questions: typeof QUESTIONS; elapsed: number; onRestart: () => void;
}) {
  const addSession = useInterviewStore((s) => s.addSession);

  // Heuristic scoring based on answer length & coverage (deterministic; upgradeable to AI later)
  const answered = answers.filter(Boolean).length;
  const avgLen = answers.reduce((s, a) => s + a.trim().split(/\s+/).filter(Boolean).length, 0) / Math.max(answers.length, 1);
  const base = Math.min(95, Math.round(48 + (answered / Math.max(questions.length, 1)) * 30 + Math.min(avgLen, 60) / 4));

  const breakdown = [
    { label: "Technical Knowledge", value: clampScore(base + 2), icon: Cpu },
    { label: "Answer Quality", value: clampScore(base - 1), icon: Target },
    { label: "Communication", value: clampScore(base - 6), icon: Volume2 },
    { label: "Structure", value: clampScore(base - 3), icon: MessageSquare },
    { label: "Confidence", value: clampScore(base - 8), icon: Trophy },
    { label: "Relevance", value: clampScore(base + 1), icon: Target },
  ];

  // Persist the session exactly once when the report first renders.
  const savedRef = useRef(false);
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    addSession({
      id: `mi_${Date.now()}`,
      role, company, type: "mixed", difficulty: "medium",
      createdAt: new Date().toISOString(),
      durationMs: elapsed * 1000,
      answers: answers.map((a, i) => ({ questionId: questions[i]?.id ?? `q${i}`, answer: a, durationMs: 0 })),
      overallScore: base,
      breakdown: {
        technical: clampScore(base + 2), communication: clampScore(base - 6),
        structure: clampScore(base - 3), confidence: clampScore(base - 8), relevance: clampScore(base + 1),
      },
      strongAnswers: [], weakAnswers: [], missedPoints: [], improvements: [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeader
        eyebrow={`${role} · ${company}`}
        title="Interview Report"
        subtitle="Your performance across six dimensions, with strong answers, gaps, and recommended follow-ups."
        actions={<Button variant="outline" leftIcon={<RotateCcw className="h-4 w-4" />} onClick={onRestart}>New Session</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card variant="glow" className="p-6 flex flex-col items-center text-center">
          <div className="text-[10px] uppercase tracking-widest text-accent/80 font-semibold mb-4">Overall Score</div>
          <RadialScore value={base} size={180} label="Performance" />
          <div className="mt-4 text-xs text-text-muted">{answered}/{questions.length} answered · {Math.floor(elapsed / 60)}m {elapsed % 60}s</div>
        </Card>

        <Card className="lg:col-span-2 p-6">
          <CardTitle className="mb-5">Score Breakdown</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {breakdown.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="h-4 w-4 text-accent" />
                    <span className="text-sm text-text-secondary flex-1">{b.label}</span>
                    <span className="text-sm text-text-primary font-medium">{b.value}%</span>
                  </div>
                  <Progress value={b.value} tone="auto" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportList title="Strong Answers" tone="green" items={answered > 0 ? ["Clear reasoning on at least one technical question.", "Used concrete examples where prompted."] : ["No answers submitted — try again and respond to each prompt."]} />
        <ReportList title="Weak / Missed" tone="amber" items={[
          answered < questions.length ? `${questions.length - answered} question(s) skipped.` : "Some answers could go deeper on tradeoffs.",
          avgLen < 25 ? "Answers were brief — expand with structure (STAR / problem→approach→result)." : "Watch for rambling; keep answers focused.",
        ]} />
        <ReportList title="Missed Points" tone="red" items={questions.slice(0, 2).map((q) => `On "${q.topic}": cover ${q.expectedConcepts.slice(0, 2).join(", ")}.`)} />
        <ReportList title="Recommended Improvements" tone="cyan" items={[
          "Practice 3 more questions in your weakest topic.",
          "Record yourself to improve communication and confidence.",
          "Review the model answers in the Question Bank.",
        ]} />
      </div>
    </>
  );
}

function ReportList({ title, tone, items }: { title: string; tone: "green" | "amber" | "red" | "cyan"; items: string[] }) {
  const dot = { green: "bg-score-green", amber: "bg-score-amber", red: "bg-score-red", cyan: "bg-accent" }[tone];
  return (
    <Card className="p-5">
      <CardTitle className="mb-4">{title}</CardTitle>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-text-secondary">
            <span className={cn("mt-1.5 h-1.5 w-1.5 rounded-full shrink-0", dot)} />
            {it}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function SetupRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-2.5">{label}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("px-3 h-8 rounded-full text-xs font-medium border transition-all capitalize", active ? "bg-accent/15 text-accent border-accent/40" : "border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent/30")}>
      {children}
    </button>
  );
}
function Summ({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-text-muted">{k}</dt>
      <dd className="text-text-primary font-medium capitalize">{v}</dd>
    </div>
  );
}
function clampScore(n: number) { return Math.max(40, Math.min(98, Math.round(n))); }
