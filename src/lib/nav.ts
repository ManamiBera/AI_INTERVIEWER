import {
  LayoutDashboard,
  History,
  LayoutTemplate,
  CreditCard,
  FileText,
  Sparkles,
  Briefcase,
  AlignLeft,
  Award,
  Pencil,
  Presentation,
  BookOpen,
  Mic,
  Timer,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
};

/** Persistent top navigation. */
export const TOP_NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "History", href: "/history", icon: History },
  { label: "Templates", href: "/templates", icon: LayoutTemplate },
  { label: "Pricing", href: "/pricing", icon: CreditCard },
];

/** Sidebar nav when on a top-level route (Dashboard / History / Templates / Pricing / Profile / Settings / Notifications / Support). */
export const TOP_LEVEL_SIDEBAR: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "History", href: "/history", icon: History },
      { label: "Templates", href: "/templates", icon: LayoutTemplate },
      { label: "Pricing", href: "/pricing", icon: CreditCard },
    ],
  },
  {
    label: "RESUME INTELLIGENCE",
    items: [
      { label: "Overview", href: "/resume/overview", icon: FileText },
      { label: "Keywords", href: "/resume/keywords", icon: Sparkles },
      { label: "Experience", href: "/resume/experience", icon: Briefcase },
      { label: "Formatting", href: "/resume/formatting", icon: AlignLeft },
      { label: "ATS Verdict", href: "/resume/ats-verdict", icon: Award },
      { label: "Resume Editor", href: "/resume/editor", icon: Pencil },
    ],
  },
  {
    label: "INTERVIEW PREP",
    items: [
      { label: "Interview Dashboard", href: "/interview", icon: Presentation },
      { label: "Question Bank", href: "/interview/questions", icon: BookOpen },
      { label: "Mock Interview", href: "/interview/mock", icon: Mic },
      { label: "Interview History", href: "/interview/history", icon: Timer },
      { label: "Preparation Plan", href: "/interview/plan", icon: CalendarDays },
    ],
  },
];

/** Sidebar shown inside /resume/* and /interview/* — same structure so the workspace feels unified. */
export const WORKSPACE_SIDEBAR: NavGroup[] = [
  {
    label: "RESUME INTELLIGENCE",
    items: [
      { label: "Overview", href: "/resume/overview", icon: FileText },
      { label: "Keywords", href: "/resume/keywords", icon: Sparkles },
      { label: "Experience", href: "/resume/experience", icon: Briefcase },
      { label: "Formatting", href: "/resume/formatting", icon: AlignLeft },
      { label: "ATS Verdict", href: "/resume/ats-verdict", icon: Award },
      { label: "Resume Editor", href: "/resume/editor", icon: Pencil },
    ],
  },
  {
    label: "INTERVIEW PREP",
    items: [
      { label: "Interview Dashboard", href: "/interview", icon: Presentation },
      { label: "Question Bank", href: "/interview/questions", icon: BookOpen },
      { label: "Mock Interview", href: "/interview/mock", icon: Mic },
      { label: "Interview History", href: "/interview/history", icon: Timer },
      { label: "Preparation Plan", href: "/interview/plan", icon: CalendarDays },
    ],
  },
];

/** Check whether the given nav href matches the current pathname (exact or prefix for /resume/, /interview/). */
export function isActive(pathname: string, href: string): boolean {
  if (href === pathname) return true;
  // Root Interview Dashboard sits at /interview — don't let it swallow /interview/questions etc.
  if (href === "/interview") return pathname === "/interview";
  return pathname.startsWith(href + "/");
}
