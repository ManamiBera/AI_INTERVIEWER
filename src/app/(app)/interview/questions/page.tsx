"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, Eye, EyeOff, Lightbulb, Check, BookmarkPlus, Filter } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { QUESTIONS, QUESTION_CATEGORIES } from "@/data/questions";
import { useInterviewStore } from "@/store/interviewStore";
import type { InterviewQuestion } from "@/types";
import { cn } from "@/lib/cn";

const DIFFICULTIES: InterviewQuestion["difficulty"][] = ["easy", "medium", "hard"];

const CATEGORY_LABEL: Record<string, string> = {
  technical: "Technical",
  behavioral: "Behavioral",
  hr: "HR",
  dsa: "DSA",
  "system-design": "System Design",
};

export default function QuestionBankPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const learned = useInterviewStore((s) => s.learned);
  const practiceList = useInterviewStore((s) => s.practiceList);
  const toggleLearnedStore = useInterviewStore((s) => s.toggleLearned);
  const togglePracticeStore = useInterviewStore((s) => s.togglePractice);

  const filtered = useMemo(() => {
    return QUESTIONS.filter((q) => {
      if (category && q.category !== category) return false;
      if (difficulty && q.difficulty !== difficulty) return false;
      if (query.trim()) {
        const t = query.toLowerCase();
        return q.question.toLowerCase().includes(t) || q.topic.toLowerCase().includes(t);
      }
      return true;
    });
  }, [query, category, difficulty]);

  function toggleLearned(id: string) {
    toggleLearnedStore(id);
  }
  function togglePractice(id: string) {
    const has = practiceList.includes(id);
    toast[has ? "message" : "success"](has ? "Removed from practice list" : "Added to practice list");
    togglePracticeStore(id);
  }

  return (
    <>
      <PageHeader
        eyebrow="Interview Prep"
        title="Question Bank"
        subtitle="A searchable database of technical, behavioral, DSA, and system-design questions with expected concepts, hints, and model answers."
        actions={
          <Badge tone="cyan">
            {learned.length} learned · {practiceList.length} in practice
          </Badge>
        }
      />

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input placeholder="Search questions or topics…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="h-4 w-4 text-text-muted mr-1" />
            <FilterChip label="All" active={!category} onClick={() => setCategory(null)} />
            {QUESTION_CATEGORIES.map((c) => (
              <FilterChip key={c} label={CATEGORY_LABEL[c]} active={category === c} onClick={() => setCategory(c)} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <span className="text-[10px] uppercase tracking-widest text-text-muted mr-1">Difficulty</span>
          <FilterChip label="Any" active={!difficulty} onClick={() => setDifficulty(null)} small />
          {DIFFICULTIES.map((d) => (
            <FilterChip key={d} label={d} active={difficulty === d} onClick={() => setDifficulty(d)} small />
          ))}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching questions"
          description="Try clearing a filter or searching a different topic."
          action={<Button variant="outline" onClick={() => { setQuery(""); setCategory(null); setDifficulty(null); }}>Reset filters</Button>}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((q) => (
            <QuestionRow
              key={q.id}
              q={q}
              learned={learned.includes(q.id)}
              inPractice={practiceList.includes(q.id)}
              onLearned={() => toggleLearned(q.id)}
              onPractice={() => togglePractice(q.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}

function FilterChip({ label, active, onClick, small }: { label: string; active: boolean; onClick: () => void; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full font-medium border transition-all capitalize",
        small ? "px-2.5 h-7 text-[11px]" : "px-3 h-8 text-xs",
        active ? "bg-accent/15 text-accent border-accent/40" : "border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent/30",
      )}
    >
      {label}
    </button>
  );
}

function QuestionRow({
  q, learned, inPractice, onLearned, onPractice,
}: {
  q: InterviewQuestion;
  learned: boolean;
  inPractice: boolean;
  onLearned: () => void;
  onPractice: () => void;
}) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const diffTone = q.difficulty === "easy" ? "green" : q.difficulty === "medium" ? "amber" : "red";

  return (
    <Card className={cn("p-5", learned && "border-score-green/30")}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge tone="neutral">{q.topic}</Badge>
            <Badge tone={diffTone} variant="outline" className="capitalize">{q.difficulty}</Badge>
            {learned && <Badge tone="green"><Check className="h-3 w-3" /> Learned</Badge>}
          </div>
          <h3 className="text-base font-medium text-text-primary">{q.question}</h3>
          <div className="mt-2 text-xs text-text-muted">
            Expected concepts: <span className="text-text-secondary">{q.expectedConcepts.join(" · ")}</span>
          </div>
        </div>
      </div>

      {!showAnswer && !showHints && (
        <div className="mt-3 text-xs italic text-text-muted">Think through your answer first, then reveal.</div>
      )}

      {showHints && q.hints && (
        <div className="mt-3 rounded-md border border-score-amber/25 bg-score-amber/5 p-3 animate-fade-in">
          <div className="text-[10px] uppercase tracking-widest text-score-amber font-semibold mb-1.5 flex items-center gap-1"><Lightbulb className="h-3 w-3" /> Hints</div>
          <ul className="list-disc ml-4 text-sm text-text-secondary space-y-0.5">
            {q.hints.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </div>
      )}

      {showAnswer && (
        <div className="mt-3 rounded-md border border-accent/25 bg-accent/5 p-3 animate-fade-in">
          <div className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-1.5">Model Answer</div>
          <p className="text-sm text-text-secondary leading-relaxed">
            {q.suggestedAnswer ?? "A strong answer covers the expected concepts above with a concrete example. Structure it clearly and finish with the outcome or tradeoff."}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" leftIcon={showAnswer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />} onClick={() => setShowAnswer((s) => !s)}>
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </Button>
        {q.hints && (
          <Button size="sm" variant="ghost" leftIcon={<Lightbulb className="h-3.5 w-3.5" />} onClick={() => setShowHints((s) => !s)}>
            {showHints ? "Hide Hints" : "Show Hints"}
          </Button>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="sm" variant={inPractice ? "subtle" : "ghost"} leftIcon={<BookmarkPlus className="h-3.5 w-3.5" />} onClick={onPractice}>
            {inPractice ? "In Practice" : "Add to Practice"}
          </Button>
          <Button size="sm" variant={learned ? "subtle" : "ghost"} leftIcon={<Check className="h-3.5 w-3.5" />} onClick={onLearned}>
            {learned ? "Learned" : "Mark Learned"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
