import { NextRequest, NextResponse } from "next/server";
import { hasGeminiKey, generateJson } from "@/lib/gemini";
import { buildMockAnalysis } from "@/services/mockAnalysis";
import type { Analysis } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

type AnalyzeBody = {
  resumeText?: string;
  base64?: string; // PDF only, no data: prefix
  mimeType?: string;
  fileName?: string;
  jd?: string;
  targetRole?: string;
};

const SCHEMA_HINT = `Return ONLY a JSON object with exactly this shape (no markdown):
{
  "atsScore": number 0-100,
  "jobMatch": number 0-100,
  "targetRole": string,
  "breakdown": { "keywordMatch": number(0-30), "formatting": number(0-20), "experienceRelevance": number(0-20), "skillsAlignment": number(0-15), "structure": number(0-15) },
  "keywords": {
    "matched":   [{ "term": string, "importance": "high"|"medium"|"low", "frequency": number, "resumeOccurrence": number, "recommendation": string|null }],
    "missing":   [{ "term": string, "importance": "high"|"medium"|"low", "frequency": number, "resumeOccurrence": 0, "recommendation": string }],
    "overused":  [{ "term": string, "importance": "low", "frequency": 0, "resumeOccurrence": number, "recommendation": string }],
    "recommended":[{ "term": string, "importance": "high"|"medium"|"low", "frequency": number, "resumeOccurrence": 0, "recommendation": string }]
  },
  "experience": [{ "original": string, "suggestion": string, "rationale": string, "impactScore": number 0-100, "issues": ("weak-verb"|"no-metric"|"too-long"|"no-tech"|"generic"|"irrelevant")[] }],
  "formatting": [{ "severity": "critical"|"warning"|"good", "title": string, "detail": string, "fixable": boolean }],
  "strengths": string[], "weaknesses": string[], "criticalFixes": string[], "recommendedImprovements": string[],
  "executiveSummary": string
}`;

export async function POST(req: NextRequest) {
  let body: AnalyzeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { resumeText, base64, mimeType, fileName, jd, targetRole } = body;

  if (!resumeText && !base64) {
    return NextResponse.json({ error: "No resume content provided" }, { status: 400 });
  }

  // If no key configured, return the deterministic mock immediately.
  if (!hasGeminiKey()) {
    const analysis = buildMockAnalysis({ resumeText: resumeText ?? "", jd, targetRole, fileName });
    return NextResponse.json({ analysis, source: "mock" });
  }

  try {
    const prompt = buildPrompt({ resumeText, jd, targetRole, fileName });
    const raw = await generateJson<Partial<Analysis>>({
      prompt,
      inlineData: base64 && mimeType === "application/pdf" ? { mimeType, data: base64 } : undefined,
      temperature: 0.4,
    });
    const analysis = coerce(raw, { resumeText: resumeText ?? "", jd, targetRole, fileName });
    return NextResponse.json({ analysis, source: "gemini" });
  } catch (err) {
    // Any failure → graceful fallback, still a full report.
    const analysis = buildMockAnalysis({ resumeText: resumeText ?? "", jd, targetRole, fileName });
    return NextResponse.json({
      analysis,
      source: "mock-fallback",
      note: err instanceof Error ? err.message : "AI unavailable — used offline analysis.",
    });
  }
}

function buildPrompt(o: { resumeText?: string; jd?: string; targetRole?: string; fileName?: string }) {
  return [
    "You are an expert ATS analyst and technical recruiter.",
    "Analyze the candidate's resume for ATS compatibility and job fit.",
    o.targetRole ? `Target role: ${o.targetRole}.` : "Infer the most likely target role from the resume.",
    o.jd ? `\nTarget job description:\n"""${o.jd.slice(0, 6000)}"""` : "No job description provided — evaluate against strong norms for the role.",
    o.resumeText ? `\nResume text:\n"""${o.resumeText.slice(0, 12000)}"""` : "The resume is attached as a PDF document.",
    "\nRULES:",
    "- Be specific and reference the ACTUAL content of the resume.",
    "- NEVER invent metrics, companies, degrees, or experience. If a bullet lacks a number, suggest 'Consider adding a measurable result if you have one.' instead of fabricating one.",
    "- Prioritize keywords that are genuinely relevant to the target role. Do not encourage keyword stuffing.",
    "- For 'experience', pull real bullet points from the resume as 'original'.",
    "- Scores must be internally consistent (breakdown parts sum to atsScore).",
    "\n" + SCHEMA_HINT,
  ].join("\n");
}

/** Merge model output onto a mock baseline so the shape is always complete & valid. */
function coerce(raw: Partial<Analysis>, fallbackInput: { resumeText: string; jd?: string; targetRole?: string; fileName?: string }): Analysis {
  const base = buildMockAnalysis(fallbackInput);
  const b = raw.breakdown ?? base.breakdown;
  const breakdown = {
    keywordMatch: num(b.keywordMatch, base.breakdown.keywordMatch, 0, 30),
    formatting: num(b.formatting, base.breakdown.formatting, 0, 20),
    experienceRelevance: num(b.experienceRelevance, base.breakdown.experienceRelevance, 0, 20),
    skillsAlignment: num(b.skillsAlignment, base.breakdown.skillsAlignment, 0, 15),
    structure: num(b.structure, base.breakdown.structure, 0, 15),
  };
  const atsScore = num(raw.atsScore, breakdown.keywordMatch + breakdown.formatting + breakdown.experienceRelevance + breakdown.skillsAlignment + breakdown.structure, 0, 100);

  return {
    ...base,
    atsScore,
    jobMatch: num(raw.jobMatch, base.jobMatch, 0, 100),
    targetRole: raw.targetRole ?? base.targetRole,
    breakdown,
    keywords: {
      matched: arr(raw.keywords?.matched, base.keywords.matched),
      missing: arr(raw.keywords?.missing, base.keywords.missing),
      overused: arr(raw.keywords?.overused, base.keywords.overused),
      recommended: arr(raw.keywords?.recommended, base.keywords.recommended),
    },
    experience: raw.experience?.length
      ? raw.experience.map((e, i) => ({
          id: `bl_${i}`,
          original: String(e.original ?? ""),
          role: raw.targetRole ?? base.targetRole ?? "",
          company: "",
          suggestion: e.suggestion,
          rationale: e.rationale,
          impactScore: num(e.impactScore, 78, 0, 100),
          issues: Array.isArray(e.issues) ? e.issues : [],
          accepted: false,
        }))
      : base.experience,
    formatting: raw.formatting?.length
      ? raw.formatting.map((f, i) => ({
          id: `fm_${i}`,
          severity: (["critical", "warning", "good"].includes(f.severity as string) ? f.severity : "warning") as "critical" | "warning" | "good",
          title: String(f.title ?? "Formatting note"),
          detail: String(f.detail ?? ""),
          fixable: !!f.fixable,
        }))
      : base.formatting,
    strengths: arr(raw.strengths, base.strengths),
    weaknesses: arr(raw.weaknesses, base.weaknesses),
    criticalFixes: arr(raw.criticalFixes, base.criticalFixes),
    recommendedImprovements: arr(raw.recommendedImprovements, base.recommendedImprovements),
    executiveSummary: raw.executiveSummary ?? base.executiveSummary,
  };
}

function num(v: unknown, fallback: number, min: number, max: number): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(Math.round(n), min), max);
}
function arr<T>(v: T[] | undefined, fallback: T[]): T[] {
  return Array.isArray(v) && v.length ? v : fallback;
}
