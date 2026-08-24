"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  UploadCloud, FileText, X, RefreshCw, Sparkles, Briefcase, ShieldCheck, Layers, Gauge,
  CheckCircle2, Cpu, Zap,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea, Label } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/cn";
import { parseResumeFile, analyzeResume, type ParsedResume } from "@/services/resumeClient";
import { useResumeStore } from "@/store/resumeStore";
import { ROLE_LIST } from "@/data/keywordDictionaries";
import type { LucideIcon } from "lucide-react";

type UploadState = "idle" | "parsing" | "ready";
type AnalyzeState = "idle" | "analyzing" | "done";

const WHY = [
  { title: "Semantic Precision", detail: "AI-driven analysis that understands context, not just keywords." },
  { title: "Legacy Support", detail: "Formatting verification for the world's most rigid ATS systems." },
  { title: "Impact Scoring", detail: "Action-verb optimization tailored for executive recruiter impact." },
];

export default function OverviewPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const { jd, setJd, targetRole, setTargetRole, setFileMeta, addAnalysis, aiSource, activeAnalysis } = useResumeStore();

  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [analyzeState, setAnalyzeState] = useState<AnalyzeState>("idle");

  const current = activeAnalysis();

  async function handleFiles(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    if (!/\.(pdf|docx|txt)$/i.test(f.name)) { toast.error("Unsupported file. Please upload a PDF or DOCX."); return; }
    if (f.size > 10 * 1024 * 1024) { toast.error("File too large. Maximum size is 10MB."); return; }

    setFile({ name: f.name, size: f.size });
    setUploadState("parsing");
    setProgress(30);
    try {
      const p = await parseResumeFile(f);
      setProgress(100);
      setParsed(p);
      setUploadState("ready");
      setFileMeta({ id: `rf_${Date.now()}`, name: p.fileName, size: p.size, uploadedAt: new Date().toISOString(), pageCount: p.pageCount, wordCount: p.wordCount });
      toast.success("Resume uploaded and parsed.", { description: `${p.wordCount} words${p.pageCount ? ` · ${p.pageCount} page(s)` : ""}` });
    } catch {
      setUploadState("idle");
      setFile(null);
      toast.error("Could not read that file. Try a different PDF or DOCX.");
    }
  }

  function removeFile() {
    setFile(null); setParsed(null); setUploadState("idle"); setProgress(0); setAnalyzeState("idle"); setFileMeta(null);
  }

  async function runAnalysis(withJd: boolean) {
    if (uploadState !== "ready" || !parsed) { toast.error("Upload a resume first."); return; }
    setAnalyzeState("analyzing");
    try {
      const { analysis, source, note } = await analyzeResume({ parsed, jd: withJd ? jd : undefined, targetRole });
      await addAnalysis(analysis, source);
      setAnalyzeState("done");
      if (source === "gemini") toast.success("Analysis complete — powered by Gemini AI.");
      else if (source === "mock-fallback") toast.success("Analysis complete (offline mode).", { description: note });
      else toast.success("Analysis complete (offline mode).", { description: "Add a free Gemini key for AI-grade analysis." });
    } catch {
      setAnalyzeState("idle");
      toast.error("Analysis failed. Please try again.");
    }
  }

  const scoreCards: { label: string; value: number; icon: LucideIcon }[] = current
    ? [
        { label: "ATS Score", value: current.atsScore, icon: ShieldCheck },
        { label: "Job Match", value: current.jobMatch, icon: Briefcase },
        { label: "Resume Strength", value: current.breakdown.experienceRelevance * 5, icon: Gauge },
        { label: "Keyword Coverage", value: Math.round((current.breakdown.keywordMatch / 30) * 100), icon: Sparkles },
        { label: "Formatting", value: Math.round((current.breakdown.formatting / 20) * 100), icon: Layers },
      ]
    : [];

  return (
    <>
      <PageHeader
        eyebrow="AI Interviewer"
        title="Resume Intelligence"
        subtitle="Refine your professional narrative with our editorial-grade ATS analysis engine."
        actions={aiSource === "gemini" ? <Badge tone="cyan"><Zap className="h-3 w-3" /> Gemini AI</Badge> : <Badge tone="neutral">Offline mode</Badge>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-accent" />
              <CardTitle>Import Document</CardTitle>
            </div>

            {!file ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                className={cn("rounded-lg border-2 border-dashed transition-all p-10 text-center cursor-pointer",
                  dragOver ? "border-accent bg-accent/5 shadow-glow-sm" : "border-border-subtle hover:border-accent/50 bg-elevated/30")}
                onClick={() => inputRef.current?.click()}
              >
                <div className="mx-auto h-14 w-14 rounded-full bg-accent/10 border border-accent/25 grid place-items-center mb-4">
                  <UploadCloud className="h-6 w-6 text-accent" />
                </div>
                <div className="text-sm font-semibold text-text-primary">Drag &amp; drop resume here</div>
                <div className="text-xs text-text-muted mt-1">Supports PDF, DOCX (Max 10MB)</div>
                <Button variant="outline" size="sm" className="mt-4" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>Browse Files</Button>
                <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              </div>
            ) : (
              <div className="rounded-lg border border-border-subtle bg-elevated/40 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-accent/10 border border-accent/25 grid place-items-center shrink-0"><FileText className="h-5 w-5 text-accent" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-text-primary truncate">{file.name}</div>
                    <div className="text-xs text-text-muted">
                      {formatBytes(file.size)}
                      {uploadState === "ready" && <span className="text-score-green ml-2 inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Parsed</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => inputRef.current?.click()} className="h-8 w-8 grid place-items-center rounded-md text-text-muted hover:text-text-primary hover:bg-hover" title="Replace file"><RefreshCw className="h-4 w-4" /></button>
                    <button onClick={removeFile} className="h-8 w-8 grid place-items-center rounded-md text-text-muted hover:text-score-red hover:bg-hover" title="Remove file"><X className="h-4 w-4" /></button>
                  </div>
                </div>
                {uploadState === "parsing" && (
                  <div className="mt-3"><Progress value={progress} /><div className="text-[11px] text-text-muted mt-1.5">Reading document…</div></div>
                )}
                <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              </div>
            )}

            {/* Target role */}
            <div className="mt-6">
              <Label className="mb-2 block">Target Role</Label>
              <div className="flex flex-wrap gap-2">
                {ROLE_LIST.map((r) => (
                  <button key={r} onClick={() => setTargetRole(r)}
                    className={cn("px-3 h-8 rounded-full text-xs font-medium border transition-all",
                      targetRole === r ? "bg-accent/15 text-accent border-accent/40" : "border-border-subtle text-text-secondary hover:border-accent/30 hover:text-text-primary")}>
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* JD */}
            <div className="mt-6">
              <Label className="mb-2 block">Target Job Description (optional)</Label>
              <Textarea placeholder="Paste the target job description to match keywords…" value={jd} onChange={(e) => setJd(e.target.value)} className="min-h-[140px]" />
              <div className="text-[11px] text-text-muted mt-1.5">
                {jd.trim() ? `${jd.trim().split(/\s+/).length} words` : "Adding a JD unlocks role-aware keyword matching."}
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" size="lg" loading={analyzeState === "analyzing"} leftIcon={<Sparkles className="h-4 w-4" />} onClick={() => runAnalysis(false)}>Analyze Resume</Button>
              <Button variant="outline" className="flex-1" size="lg" disabled={!jd.trim() || analyzeState === "analyzing"} leftIcon={<Briefcase className="h-4 w-4" />} onClick={() => runAnalysis(true)}>Analyze Against Job</Button>
            </div>
          </Card>

          {analyzeState === "analyzing" && (
            <Card className="p-6">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                Analyzing architecture… reading your resume and scoring against {targetRole} norms.
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 rounded-lg bg-elevated/50 animate-pulse" />)}
              </div>
            </Card>
          )}

          {current && analyzeState !== "analyzing" && (
            <Card variant="glow" className="p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Analysis Results</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => router.push("/resume/ats-verdict")}>Full ATS Verdict →</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {scoreCards.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="rounded-lg border border-border-subtle bg-elevated/40 p-4 text-center">
                      <Icon className="h-4 w-4 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-text-primary">{Math.min(s.value, 100)}</div>
                      <div className="text-[10px] uppercase tracking-widest text-text-muted mt-1">{s.label}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm" variant="subtle" onClick={() => router.push("/resume/keywords")}>Keywords</Button>
                <Button size="sm" variant="subtle" onClick={() => router.push("/resume/experience")}>Experience</Button>
                <Button size="sm" variant="subtle" onClick={() => router.push("/resume/formatting")}>Formatting</Button>
                <Button size="sm" variant="subtle" onClick={() => router.push("/resume/ats-verdict")}>ATS Verdict</Button>
              </div>
            </Card>
          )}
        </div>

        <Card variant="glow" className="p-6 h-fit">
          <div className="text-sm font-semibold text-text-primary mb-4">Why Intelligence?</div>
          <ul className="space-y-4">
            {WHY.map((w) => (
              <li key={w.title} className="flex gap-3">
                <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-text-primary">{w.title}</div>
                  <div className="text-xs text-text-secondary mt-0.5">{w.detail}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-lg bg-gradient-to-br from-accent/10 to-transparent border border-accent/20 p-4">
            <Badge tone="cyan" className="mb-2"><Cpu className="h-3 w-3" /> Free AI</Badge>
            <p className="text-xs text-text-secondary">
              Add a free Google Gemini API key to <code className="text-accent">.env.local</code> for genuine AI analysis. Without one, a role-aware offline engine still scores your real resume.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
