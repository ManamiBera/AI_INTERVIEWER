/** Core domain types used throughout the app. Kept minimal in Phase 1; extended per phase. */

export type Subscription = "free" | "pro" | "premium";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  currentRole?: string;
  targetRole?: string;
  yearsExperience?: number;
  targetCompanies?: string[];
  preferredIndustries?: string[];
  skills?: {
    technical: string[];
    soft: string[];
    languages: string[];
    tools: string[];
  };
  careerPrefs?: {
    salaryMin?: number;
    salaryMax?: number;
    location?: string;
    workMode?: "remote" | "hybrid" | "onsite";
    preferredCompanies?: string[];
  };
  subscription: Subscription;
};

export type ResumeFileMeta = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string; // ISO
  pageCount?: number;
  wordCount?: number;
};

export type Keyword = {
  term: string;
  importance: "high" | "medium" | "low";
  frequency: number; // count in the target JD / role dictionary
  resumeOccurrence: number; // count in the resume
  recommendation?: string;
};

export type KeywordAnalysis = {
  matched: Keyword[];
  missing: Keyword[];
  overused: Keyword[];
  recommended: Keyword[];
};

export type ExperienceBullet = {
  id: string;
  original: string;
  role: string;
  company: string;
  suggestion?: string;
  rationale?: string;
  impactScore?: number;
  issues: Array<"weak-verb" | "no-metric" | "too-long" | "no-tech" | "generic" | "irrelevant">;
  accepted?: boolean;
};

export type FormattingIssue = {
  id: string;
  severity: "critical" | "warning" | "good";
  title: string;
  detail: string;
  fixable: boolean;
};

export type ATSScoreBreakdown = {
  keywordMatch: number; // /30
  formatting: number; // /20
  experienceRelevance: number; // /20
  skillsAlignment: number; // /15
  structure: number; // /15
};

export type Analysis = {
  id: string;
  resumeId: string;
  jobTitle?: string;
  company?: string;
  targetRole?: string;
  createdAt: string;
  atsScore: number;
  jobMatch: number;
  breakdown: ATSScoreBreakdown;
  keywords: KeywordAnalysis;
  experience: ExperienceBullet[];
  formatting: FormattingIssue[];
  strengths: string[];
  weaknesses: string[];
  criticalFixes: string[];
  recommendedImprovements: string[];
  executiveSummary: string;
};

export type InterviewQuestion = {
  id: string;
  question: string;
  topic: string;
  category: "technical" | "behavioral" | "hr" | "dsa" | "system-design";
  difficulty: "easy" | "medium" | "hard";
  expectedConcepts: string[];
  suggestedAnswer?: string;
  hints?: string[];
};

export type MockInterviewAnswer = {
  questionId: string;
  answer: string;
  durationMs: number;
  score?: number;
  feedback?: string;
};

export type MockInterview = {
  id: string;
  role: string;
  company?: string;
  type: "technical" | "behavioral" | "hr" | "mixed";
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
  durationMs: number;
  answers: MockInterviewAnswer[];
  overallScore: number;
  breakdown: {
    technical: number;
    communication: number;
    structure: number;
    confidence: number;
    relevance: number;
  };
  strongAnswers: string[];
  weakAnswers: string[];
  missedPoints: string[];
  improvements: string[];
};

export type PrepPlanTask = {
  id: string;
  title: string;
  estimatedMinutes: number;
  completed: boolean;
};

export type PrepPlanDay = {
  day: number;
  title: string;
  tasks: PrepPlanTask[];
};

export type PreparationPlan = {
  id: string;
  role: string;
  createdAt: string;
  days: PrepPlanDay[];
};

export type Notification = {
  id: string;
  title: string;
  detail?: string;
  createdAt: string;
  read: boolean;
  href?: string;
  kind: "info" | "success" | "warning" | "error";
};

export type ResumeTemplate = {
  id: string;
  name: string;
  category:
    | "ats-friendly"
    | "software-engineering"
    | "data-science"
    | "product"
    | "consulting"
    | "finance"
    | "design"
    | "student"
    | "internship"
    | "executive";
  industry: string;
  description: string;
  atsCompatibility: number; // 0-100
  previewSlug: string; // used to render a mock preview
};
