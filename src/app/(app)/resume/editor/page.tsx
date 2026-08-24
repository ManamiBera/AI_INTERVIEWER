"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  User, AlignLeft, Briefcase, GraduationCap, Wrench, FolderGit2, Award, Trophy, Users,
  Undo2, Redo2, Save, Download, Wand2, Zap, Ruler, Target, ShieldCheck, Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

type Section = { id: string; label: string; icon: LucideIcon; filled: boolean };

const SECTIONS: Section[] = [
  { id: "header", label: "Header", icon: User, filled: true },
  { id: "summary", label: "Summary", icon: AlignLeft, filled: true },
  { id: "experience", label: "Experience", icon: Briefcase, filled: true },
  { id: "education", label: "Education", icon: GraduationCap, filled: true },
  { id: "skills", label: "Skills", icon: Wrench, filled: true },
  { id: "projects", label: "Projects", icon: FolderGit2, filled: false },
  { id: "certifications", label: "Certifications", icon: Award, filled: false },
  { id: "achievements", label: "Achievements", icon: Trophy, filled: false },
  { id: "extracurriculars", label: "Extracurriculars", icon: Users, filled: false },
];

const AI_ACTIONS: Array<{ label: string; icon: LucideIcon; desc: string }> = [
  { label: "Improve Writing", icon: Wand2, desc: "Sharpen tone and clarity" },
  { label: "Make Concise", icon: Ruler, desc: "Tighten wordy sentences" },
  { label: "Add Impact", icon: Zap, desc: "Strengthen action verbs" },
  { label: "Improve ATS", icon: ShieldCheck, desc: "Boost parse-ability" },
  { label: "Add Metrics", icon: Target, desc: "Prompt for measurable results" },
  { label: "Match Job Description", icon: Sparkles, desc: "Align to a target JD" },
];

export default function EditorPage() {
  const [active, setActive] = useState("summary");
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [summary, setSummary] = useState(
    "Software engineer with experience building React and TypeScript applications. Passionate about clean, accessible interfaces and measurable product impact.",
  );

  async function runAi(label: string) {
    setAiBusy(label);
    await new Promise((r) => setTimeout(r, 1100));
    setAiBusy(null);
    toast.success(`${label} applied to ${active}. Review before saving.`, {
      description: "Original preserved in version history.",
    });
  }

  async function save() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success("Changes saved.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Resume Intelligence"
        title="Resume Editor"
        subtitle="Edit sections, preview live, and let the AI assistant refine your writing — with undo, redo, and auto-save."
        actions={
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={() => toast("Undid last change")} aria-label="Undo"><Undo2 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => toast("Redid change")} aria-label="Redo"><Redo2 className="h-4 w-4" /></Button>
            <Button variant="outline" leftIcon={<Save className="h-4 w-4" />} loading={saving} onClick={save}>Save</Button>
            <Button leftIcon={<Download className="h-4 w-4" />} onClick={() => toast.success("Preparing PDF export…")}>Download</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left — sections */}
        <Card className="lg:col-span-3 p-3 h-fit">
          <div className="text-[10px] uppercase tracking-widest text-text-muted font-semibold px-2 py-2">Sections</div>
          <ul className="space-y-0.5">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => setActive(s.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 h-9 rounded-md text-sm transition-colors",
                      active === s.id ? "bg-accent/10 text-text-primary border border-accent/30" : "text-text-secondary hover:bg-hover border border-transparent",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active === s.id ? "text-accent" : "text-text-muted")} />
                    <span className="flex-1 text-left">{s.label}</span>
                    {!s.filled && <span className="h-1.5 w-1.5 rounded-full bg-text-muted/50" title="Empty" />}
                  </button>
                </li>
              );
            })}
          </ul>
          <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => toast("Add a new section")}>+ Add Section</Button>
        </Card>

        {/* Center — live preview */}
        <Card className="lg:col-span-6 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 h-11 border-b border-border-subtle bg-elevated/40">
            <span className="text-xs text-text-muted uppercase tracking-widest">Live Preview</span>
            <Badge tone="green"><span className="h-1.5 w-1.5 rounded-full bg-score-green" /> Auto-saved</Badge>
          </div>
          <div className="p-8 bg-white text-[#111] max-h-[640px] overflow-y-auto">
            {/* A simplified résumé preview rendered on a white "paper" surface */}
            <div className="text-center border-b border-gray-300 pb-4 mb-4">
              <div className="text-2xl font-bold">Aditya Sharma</div>
              <div className="text-sm text-gray-600 mt-1">Software Engineer · aditya@editorial.ai · Bengaluru, IN</div>
              <div className="text-xs text-gray-500 mt-1">linkedin.com/in/aditya · github.com/aditya</div>
            </div>

            <PreviewSection title="Summary" active={active === "summary"}>
              {active === "summary" ? (
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full text-sm text-gray-800 leading-relaxed bg-yellow-50/60 border border-yellow-200 rounded p-2 outline-none resize-y min-h-[70px]"
                />
              ) : (
                <p className="text-sm text-gray-800 leading-relaxed">{summary}</p>
              )}
            </PreviewSection>

            <PreviewSection title="Experience" active={active === "experience"}>
              <div className="mb-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">Software Engineer — Nimbus Labs</span>
                  <span className="text-xs text-gray-500">2022 — Present</span>
                </div>
                <ul className="list-disc ml-5 mt-1 text-sm text-gray-800 space-y-1">
                  <li>Engineered responsive React interfaces for the analytics dashboard.</li>
                  <li>Optimized rendering performance via memoization and lazy loading.</li>
                </ul>
              </div>
            </PreviewSection>

            <PreviewSection title="Education" active={active === "education"}>
              <div className="flex justify-between text-sm">
                <span className="font-semibold">B.Tech, Computer Science — IIT Example</span>
                <span className="text-xs text-gray-500">2018 — 2022</span>
              </div>
            </PreviewSection>

            <PreviewSection title="Skills" active={active === "skills"}>
              <p className="text-sm text-gray-800">React · TypeScript · Node.js · REST APIs · CI/CD · Git</p>
            </PreviewSection>
          </div>
        </Card>

        {/* Right — AI assistant */}
        <Card variant="glow" className="lg:col-span-3 p-4 h-fit">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-7 w-7 rounded-md bg-cyan-gradient grid place-items-center"><Sparkles className="h-3.5 w-3.5 text-[#04141C]" /></div>
            <span className="text-sm font-semibold text-text-primary">AI Assistant</span>
          </div>
          <p className="text-xs text-text-muted mb-4">Editing: <b className="text-text-secondary capitalize">{active}</b></p>
          <div className="space-y-2">
            {AI_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  onClick={() => runAi(a.label)}
                  disabled={aiBusy !== null}
                  className={cn(
                    "w-full text-left p-3 rounded-md border transition-all group",
                    "border-border-subtle bg-elevated/40 hover:border-accent/40 hover:bg-elevated disabled:opacity-50",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-text-primary">{a.label}</span>
                    {aiBusy === a.label && <span className="ml-auto h-3 w-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />}
                  </div>
                  <div className="text-[11px] text-text-muted mt-0.5 ml-6">{a.desc}</div>
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border-subtle space-y-2">
            <Button variant="subtle" size="sm" className="w-full" onClick={() => toast.success("Version saved to history.")}>Save Version</Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" size="sm" onClick={() => toast.success("Downloading PDF…")}>PDF</Button>
              <Button variant="ghost" size="sm" onClick={() => toast.success("Downloading DOCX…")}>DOCX</Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function PreviewSection({ title, active, children }: { title: string; active: boolean; children: React.ReactNode }) {
  return (
    <div className={cn("mb-4 rounded", active && "ring-2 ring-cyan-400/40 ring-offset-2 p-2 -m-0.5")}>
      <div className="text-xs font-bold uppercase tracking-wider text-gray-700 border-b border-gray-200 pb-1 mb-2">{title}</div>
      {children}
    </div>
  );
}
