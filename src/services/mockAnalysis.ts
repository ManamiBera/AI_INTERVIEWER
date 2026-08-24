import type { Analysis, ATSScoreBreakdown, ExperienceBullet, FormattingIssue, Keyword, KeywordAnalysis } from "@/types";
import { KEYWORDS_BY_ROLE, GENERIC_WEAK_VERBS } from "@/data/keywordDictionaries";

/**
 * Deterministic, role-aware fallback analysis used when no Gemini key is set
 * (or the API call fails). It reads the actual resume text so results still
 * reflect the uploaded document — it never fabricates metrics.
 */
export function buildMockAnalysis(input: {
  resumeText: string;
  jd?: string;
  targetRole?: string;
  fileName?: string;
}): Analysis {
  const text = (input.resumeText || "").toLowerCase();
  const jd = (input.jd || "").toLowerCase();
  const role = input.targetRole || inferRole(text) || "Software Engineer";
  const dict = KEYWORDS_BY_ROLE[role] ?? KEYWORDS_BY_ROLE["Software Engineer"];

  // --- Keyword analysis ---
  const matched: Keyword[] = [];
  const missing: Keyword[] = [];
  for (const entry of dict) {
    const inResume = countOccurrences(text, entry.term.toLowerCase());
    const inJd = jd ? countOccurrences(jd, entry.term.toLowerCase()) : entry.baseFreq;
    const kw: Keyword = {
      term: entry.term,
      importance: entry.importance,
      frequency: Math.max(inJd, entry.baseFreq),
      resumeOccurrence: inResume,
      recommendation: inResume === 0 ? entry.hint : undefined,
    };
    if (inResume > 0) matched.push(kw);
    else missing.push(kw);
  }

  // Overused generic verbs actually present in the resume
  const overused: Keyword[] = GENERIC_WEAK_VERBS.map((v) => ({
    term: v.term,
    importance: "low" as const,
    frequency: 0,
    resumeOccurrence: countOccurrences(text, v.term.toLowerCase()),
    recommendation: v.hint,
  })).filter((k) => k.resumeOccurrence >= 2);

  const recommended: Keyword[] = missing
    .filter((k) => k.importance !== "low")
    .slice(0, 4)
    .map((k) => ({ ...k, recommendation: k.recommendation ?? `High-value for ${role} roles.` }));

  const keywords: KeywordAnalysis = { matched, missing, overused, recommended };

  // --- Scores (derived from real signals) ---
  const coverage = matched.length / Math.max(dict.length, 1); // 0..1
  const keywordMatch = Math.round(clamp(coverage * 30, 6, 30));
  const wordCount = countWords(input.resumeText);
  const structure = Math.round(clamp(11 + (hasSections(text) ? 3 : 0) + (wordCount > 250 ? 1 : -2), 6, 15));
  const formattingScore = Math.round(clamp(20 - overused.length - (looksTwoColumn(input.resumeText) ? 4 : 0), 10, 20));
  const experienceRelevance = Math.round(clamp(12 + coverage * 8, 8, 20));
  const skillsAlignment = Math.round(clamp(9 + coverage * 6, 6, 15));

  const breakdown: ATSScoreBreakdown = {
    keywordMatch,
    formatting: formattingScore,
    experienceRelevance,
    skillsAlignment,
    structure,
  };
  const atsScore = keywordMatch + formattingScore + experienceRelevance + skillsAlignment + structure;
  const jobMatch = jd ? Math.round(clamp(coverage * 100, 30, 98)) : Math.round(clamp(coverage * 88, 30, 90));

  // --- Experience bullets extracted from the resume ---
  const experience = extractBullets(input.resumeText, role).slice(0, 5);

  // --- Formatting issues ---
  const formatting: FormattingIssue[] = [];
  if (looksTwoColumn(input.resumeText))
    formatting.push({ id: "fm1", severity: "critical", title: "Possible multi-column layout", detail: "Multi-column layouts can break ATS parsing. Prefer a single column.", fixable: true });
  if (inconsistentDates(input.resumeText))
    formatting.push({ id: "fm2", severity: "warning", title: "Inconsistent date formatting", detail: "Standardize all dates to one format (e.g. 'Jan 2023').", fixable: true });
  if (wordCount > 900)
    formatting.push({ id: "fm3", severity: "warning", title: "Resume may exceed one page", detail: `~${wordCount} words detected. Consider tightening to a single page.`, fixable: false });
  formatting.push({ id: "fm4", severity: "good", title: "Readable section structure", detail: hasSections(text) ? "Standard headings detected." : "Add clear section headings (Experience, Education, Skills).", fixable: false });

  // --- Narrative ---
  const strengths = [
    matched.length ? `Strong coverage of ${matched.slice(0, 3).map((m) => m.term).join(", ")}.` : "Clear, readable formatting.",
    hasSections(text) ? "Well-structured sections aid ATS parsing." : "Concise, scannable content.",
    experience.some((e) => e.issues.length === 0) ? "Some bullets already show measurable impact." : "Relevant experience present.",
  ];
  const weaknesses = [
    missing.length ? `Missing ${missing.slice(0, 3).map((m) => m.term).join(", ")} for ${role} roles.` : "Minor keyword gaps.",
    overused.length ? `Overused generic verbs: ${overused.map((o) => o.term).join(", ")}.` : "Vary action verbs for impact.",
    experience.some((e) => e.issues.includes("no-metric")) ? "Several bullets lack measurable outcomes." : "Deepen technical specificity.",
  ];
  const criticalFixes = formatting.filter((f) => f.severity === "critical").map((f) => f.title);
  const recommendedImprovements = [
    recommended.length ? `Add where applicable: ${recommended.map((r) => r.term).join(", ")}.` : "Tailor keywords to each job description.",
    "Quantify outcomes where you have real numbers.",
    "Lead each bullet with a strong action verb.",
  ];

  const executiveSummary =
    `Your resume scores ${atsScore}/100 for a ${role} target${jd ? " against the provided job description" : ""}. ` +
    `Keyword coverage is ${Math.round(coverage * 100)}% of role-critical terms. ` +
    (criticalFixes.length ? `Address ${criticalFixes.length} critical formatting issue(s) first, then ` : "Focus next on ") +
    `closing keyword gaps and quantifying your strongest bullets to lift recruiter readiness.`;

  return {
    id: `an_${Date.now()}`,
    resumeId: input.fileName ?? "resume",
    jobTitle: role,
    company: undefined,
    targetRole: role,
    createdAt: new Date().toISOString(),
    atsScore,
    jobMatch,
    breakdown,
    keywords,
    experience,
    formatting,
    strengths,
    weaknesses,
    criticalFixes: criticalFixes.length ? criticalFixes : ["No critical blockers detected."],
    recommendedImprovements,
    executiveSummary,
  };
}

// ---------- helpers ----------
function clamp(n: number, min: number, max: number) { return Math.min(Math.max(n, min), max); }
function countOccurrences(hay: string, needle: string) {
  if (!needle) return 0;
  const re = new RegExp(`\\b${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
  return (hay.match(re) || []).length;
}
function countWords(t: string) { return (t.trim().match(/\S+/g) || []).length; }
function hasSections(t: string) { return /experience|education|skills|projects/.test(t); }
function looksTwoColumn(t: string) { return /\t{2,}| {6,}\S+ {6,}\S/.test(t); }
function inconsistentDates(t: string) {
  const slash = /\b\d{1,2}\/\d{4}\b/.test(t);
  const named = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\b/i.test(t);
  return slash && named;
}
function inferRole(t: string): string | null {
  if (/data scien|machine learning|pandas|numpy/.test(t)) return "Data Scientist";
  if (/product manager|roadmap|stakeholder/.test(t)) return "Product Manager";
  if (/react|frontend|css|accessibility/.test(t)) return "Frontend Developer";
  if (/node|backend|api|database|microservice/.test(t)) return "Backend Developer";
  return null;
}

function extractBullets(raw: string, role: string): ExperienceBullet[] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.replace(/^[\s•\-*·▪◦]+/, "").trim())
    .filter((l) => l.length > 25 && /[a-z]/i.test(l));

  // Prefer lines that look like accomplishments
  const candidates = lines.filter((l) => /\b(built|developed|created|led|designed|implemented|managed|worked|responsible|improved|optimized|engineered|delivered)\b/i.test(l));
  const chosen = (candidates.length ? candidates : lines).slice(0, 5);

  return chosen.map((original, i) => {
    const issues: ExperienceBullet["issues"] = [];
    if (/\b(worked on|responsible for|helped)\b/i.test(original)) issues.push("weak-verb");
    if (!/\d/.test(original)) issues.push("no-metric");
    if (countWords(original) > 25) issues.push("too-long");
    if (!/(react|node|python|api|sql|aws|docker|ml|design|data)/i.test(original)) issues.push("no-tech");
    if (/\b(various|things|stuff|etc)\b/i.test(original)) issues.push("generic");

    const suggestion = improveBullet(original, issues);
    return {
      id: `bl_${i}`,
      original,
      role,
      company: "",
      suggestion,
      rationale: "Rule-based rewrite: strengthens verbs and specificity. Metric prompts are suggestions only — no numbers are invented.",
      impactScore: clamp(70 + (5 - issues.length) * 5, 55, 95),
      issues,
      accepted: false,
    };
  });
}

function improveBullet(original: string, issues: ExperienceBullet["issues"]): string {
  let s = original
    .replace(/^worked on\b/i, "Built")
    .replace(/^responsible for\b/i, "Owned")
    .replace(/^helped (to )?/i, "Drove ")
    .replace(/^developed\b/i, "Engineered")
    .replace(/^created\b/i, "Designed");
  s = s.charAt(0).toUpperCase() + s.slice(1);
  if (issues.includes("no-metric")) s += " Consider adding a measurable result if you have one.";
  return s;
}
