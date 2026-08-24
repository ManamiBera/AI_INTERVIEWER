import type { ResumeTemplate } from "@/types";

export const TEMPLATE_CATEGORIES: { id: ResumeTemplate["category"] | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ats-friendly", label: "ATS Friendly" },
  { id: "software-engineering", label: "Software Engineering" },
  { id: "data-science", label: "Data Science" },
  { id: "product", label: "Product" },
  { id: "consulting", label: "Consulting" },
  { id: "finance", label: "Finance" },
  { id: "design", label: "Design" },
  { id: "student", label: "Student" },
  { id: "internship", label: "Internship" },
  { id: "executive", label: "Executive" },
];

export const TEMPLATES: ResumeTemplate[] = [
  { id: "t1",  name: "Executive Elite Pro", category: "executive", industry: "Leadership", description: "Refined single-column layout for senior leaders. Emphasizes impact and scope.", atsCompatibility: 98, previewSlug: "exec" },
  { id: "t2",  name: "ATS Ultra Clean", category: "ats-friendly", industry: "General", description: "Maximum parse reliability. Zero tables, single column, standard headings.", atsCompatibility: 100, previewSlug: "clean" },
  { id: "t3",  name: "Engineer Focus", category: "software-engineering", industry: "Tech", description: "Skills-forward layout with a prominent projects section.", atsCompatibility: 96, previewSlug: "eng" },
  { id: "t4",  name: "Backend Systems", category: "software-engineering", industry: "Tech", description: "Emphasizes systems, scale, and infrastructure work.", atsCompatibility: 95, previewSlug: "eng" },
  { id: "t5",  name: "Data Scientist Grid", category: "data-science", industry: "Data / ML", description: "Highlights models, experiments, and quantified outcomes.", atsCompatibility: 94, previewSlug: "data" },
  { id: "t6",  name: "ML Research", category: "data-science", industry: "Research", description: "Publication-friendly layout with a research emphasis.", atsCompatibility: 92, previewSlug: "data" },
  { id: "t7",  name: "Product Narrative", category: "product", industry: "Product", description: "Outcome-driven storytelling for PMs. Metrics up top.", atsCompatibility: 93, previewSlug: "product" },
  { id: "t8",  name: "Growth PM", category: "product", industry: "Product", description: "Experiment and growth-metric focused.", atsCompatibility: 91, previewSlug: "product" },
  { id: "t9",  name: "Consulting Case", category: "consulting", industry: "Consulting", description: "Structured, results-first format favored by MBB recruiters.", atsCompatibility: 95, previewSlug: "consult" },
  { id: "t10", name: "Finance Analyst", category: "finance", industry: "Finance", description: "Conservative, metric-heavy layout for banking & PE.", atsCompatibility: 96, previewSlug: "finance" },
  { id: "t11", name: "Investment Track", category: "finance", industry: "Finance", description: "Deal-experience forward for IB and markets roles.", atsCompatibility: 94, previewSlug: "finance" },
  { id: "t12", name: "Design Portfolio Lite", category: "design", industry: "Design", description: "Tasteful accents while staying ATS-safe. Links to portfolio.", atsCompatibility: 88, previewSlug: "design" },
  { id: "t13", name: "Product Designer", category: "design", industry: "Design", description: "Process and impact balanced with visual restraint.", atsCompatibility: 87, previewSlug: "design" },
  { id: "t14", name: "Student First Resume", category: "student", industry: "Entry Level", description: "Education-forward with room for coursework and projects.", atsCompatibility: 97, previewSlug: "student" },
  { id: "t15", name: "New Grad SWE", category: "student", industry: "Tech", description: "Projects and internships highlighted for new grads.", atsCompatibility: 96, previewSlug: "student" },
  { id: "t16", name: "Internship Ready", category: "internship", industry: "Entry Level", description: "One-page format optimized for internship applications.", atsCompatibility: 98, previewSlug: "student" },
  { id: "t17", name: "Summer Analyst", category: "internship", industry: "Finance", description: "Internship layout tuned for finance recruiting.", atsCompatibility: 95, previewSlug: "finance" },
  { id: "t18", name: "Minimal Mono", category: "ats-friendly", industry: "General", description: "Monospace headings, ultra-legible, recruiter-approved.", atsCompatibility: 99, previewSlug: "clean" },
  { id: "t19", name: "Timeline Pro", category: "software-engineering", industry: "Tech", description: "Chronological emphasis with a clean skills sidebar (single-column safe).", atsCompatibility: 90, previewSlug: "eng" },
  { id: "t20", name: "Impact Executive", category: "executive", industry: "Leadership", description: "Board-ready, achievement-first narrative.", atsCompatibility: 97, previewSlug: "exec" },
];
