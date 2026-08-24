/** Role-aware keyword dictionaries used by the fallback analysis. Contextual, not stuffed. */

export type KeywordDictEntry = {
  term: string;
  importance: "high" | "medium" | "low";
  baseFreq: number; // typical JD frequency when no JD provided
  hint: string; // where to naturally add it
};

export const KEYWORDS_BY_ROLE: Record<string, KeywordDictEntry[]> = {
  "Software Engineer": [
    { term: "React", importance: "high", baseFreq: 5, hint: "Reference in a frontend project or role." },
    { term: "TypeScript", importance: "high", baseFreq: 4, hint: "Mention in any typed JS work." },
    { term: "Node.js", importance: "high", baseFreq: 4, hint: "Add to backend/service experience." },
    { term: "REST APIs", importance: "medium", baseFreq: 3, hint: "Cite API design or integration work." },
    { term: "System design", importance: "high", baseFreq: 3, hint: "Describe an architecture decision you made." },
    { term: "CI/CD", importance: "medium", baseFreq: 2, hint: "Mention deployment pipelines you used." },
    { term: "Testing", importance: "medium", baseFreq: 2, hint: "Reference unit/integration testing." },
    { term: "AWS", importance: "high", baseFreq: 4, hint: "Add any cloud deployment experience." },
    { term: "Docker", importance: "medium", baseFreq: 3, hint: "Cite containerization work." },
    { term: "SQL", importance: "medium", baseFreq: 3, hint: "Mention database query work." },
  ],
  "Frontend Developer": [
    { term: "React", importance: "high", baseFreq: 6, hint: "Central to frontend roles." },
    { term: "TypeScript", importance: "high", baseFreq: 5, hint: "Mention typed component work." },
    { term: "Next.js", importance: "high", baseFreq: 4, hint: "Add SSR/SSG project experience." },
    { term: "CSS", importance: "medium", baseFreq: 4, hint: "Reference styling/layout work." },
    { term: "Accessibility", importance: "high", baseFreq: 3, hint: "Mention a11y practices (ARIA, semantics)." },
    { term: "Performance", importance: "high", baseFreq: 3, hint: "Cite load-time or rendering optimizations." },
    { term: "Testing", importance: "medium", baseFreq: 2, hint: "Jest / React Testing Library." },
    { term: "Responsive design", importance: "medium", baseFreq: 3, hint: "Mention mobile-first work." },
  ],
  "Backend Developer": [
    { term: "Node.js", importance: "high", baseFreq: 5, hint: "Core backend runtime." },
    { term: "APIs", importance: "high", baseFreq: 5, hint: "Describe API design and versioning." },
    { term: "Databases", importance: "high", baseFreq: 4, hint: "Mention schema design." },
    { term: "Microservices", importance: "medium", baseFreq: 3, hint: "Cite service decomposition." },
    { term: "Docker", importance: "medium", baseFreq: 3, hint: "Containerization experience." },
    { term: "AWS", importance: "high", baseFreq: 4, hint: "Cloud infrastructure work." },
    { term: "Caching", importance: "medium", baseFreq: 2, hint: "Redis / CDN caching." },
    { term: "SQL", importance: "high", baseFreq: 4, hint: "Query optimization." },
  ],
  "Data Scientist": [
    { term: "Python", importance: "high", baseFreq: 6, hint: "Core DS language." },
    { term: "SQL", importance: "high", baseFreq: 5, hint: "Data extraction and analysis." },
    { term: "Machine Learning", importance: "high", baseFreq: 5, hint: "Cite a model you built." },
    { term: "Statistics", importance: "high", baseFreq: 4, hint: "Mention hypothesis testing." },
    { term: "Pandas", importance: "medium", baseFreq: 4, hint: "Data wrangling work." },
    { term: "NumPy", importance: "medium", baseFreq: 3, hint: "Numerical computing." },
    { term: "Scikit-learn", importance: "medium", baseFreq: 3, hint: "Classical ML models." },
    { term: "Experimentation", importance: "high", baseFreq: 3, hint: "A/B testing experience." },
  ],
  "Product Manager": [
    { term: "Roadmap", importance: "high", baseFreq: 5, hint: "Describe roadmap ownership." },
    { term: "Stakeholder", importance: "high", baseFreq: 4, hint: "Cross-functional alignment." },
    { term: "Metrics", importance: "high", baseFreq: 4, hint: "KPIs you moved." },
    { term: "User research", importance: "medium", baseFreq: 3, hint: "Discovery work." },
    { term: "A/B testing", importance: "medium", baseFreq: 3, hint: "Experiment-driven decisions." },
    { term: "Prioritization", importance: "high", baseFreq: 3, hint: "Framework you used (RICE, etc.)." },
    { term: "Go-to-market", importance: "medium", baseFreq: 2, hint: "Launch experience." },
  ],
};

export const GENERIC_WEAK_VERBS = [
  { term: "Developed", hint: "Vary with 'Engineered', 'Built', 'Shipped'." },
  { term: "Created", hint: "Vary with 'Designed', 'Launched'." },
  { term: "Responsible for", hint: "Replace with a strong action verb." },
  { term: "Worked on", hint: "Replace with 'Built', 'Led', or 'Delivered'." },
  { term: "Helped", hint: "Replace with what you specifically drove." },
];

export const ROLE_LIST = Object.keys(KEYWORDS_BY_ROLE);
