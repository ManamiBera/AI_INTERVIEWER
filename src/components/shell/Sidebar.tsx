"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, LifeBuoy, FileSpreadsheet, Sparkles } from "lucide-react";
import { TOP_LEVEL_SIDEBAR, isActive, type NavGroup, type NavItem } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

type SidebarProps = {
  onExportClick: () => void;
  /** Optional close handler used when rendered inside the mobile drawer. */
  onNavigate?: () => void;
};

export function Sidebar({ onExportClick, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  // The sidebar structure stays the same across routes so the workspace feels unified;
  // active state highlights whichever section the user is currently in.
  const groups: NavGroup[] = TOP_LEVEL_SIDEBAR;

  return (
    <aside
      className={cn(
        "flex flex-col h-full w-[240px] shrink-0 border-r border-border-subtle bg-elevated/60",
        "backdrop-blur-sm",
      )}
    >
      {/* Product card */}
      <div className="p-3">
        <Link
          href="/resume/overview"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg p-3 transition-all",
            "bg-surface border border-border-subtle hover:border-accent/40 hover:shadow-glow-sm",
          )}
        >
          <div className="h-9 w-9 rounded-md bg-cyan-gradient grid place-items-center shrink-0 shadow-glow-sm">
            <FileSpreadsheet className="h-4 w-4 text-[#04141C]" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-text-primary truncate">AI Interviewer</div>
            <div className="text-[10px] uppercase tracking-widest text-accent/80 font-semibold">
              Resume &amp; Interview Prep
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 pb-3 space-y-4">
        {groups.map((group, gi) => (
          <NavSection
            key={gi}
            group={group}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-border-subtle space-y-2">
        <Button
          variant="primary"
          size="md"
          leftIcon={<Download className="h-4 w-4" />}
          onClick={onExportClick}
          className="w-full"
        >
          Export PDF
        </Button>
        <Link
          href="/support"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2 px-3 h-9 rounded-md text-sm text-text-secondary",
            "hover:text-text-primary hover:bg-hover transition-colors",
          )}
        >
          <LifeBuoy className="h-4 w-4" />
          Support Center
        </Link>
      </div>
    </aside>
  );
}

function NavSection({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div>
      {group.label && (
        <div className="px-3 mt-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-accent/60" />
          {group.label}
        </div>
      )}
      <ul className="space-y-0.5">
        {group.items.map((item) => (
          <NavRow key={item.href} item={item} active={isActive(pathname, item.href)} onNavigate={onNavigate} />
        ))}
      </ul>
    </div>
  );
}

function NavRow({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "group relative flex items-center gap-3 px-3 h-9 rounded-md text-sm transition-all",
          active
            ? "bg-accent/10 text-text-primary border border-accent/30 shadow-glow-sm"
            : "text-text-secondary hover:text-text-primary hover:bg-hover border border-transparent",
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-accent shadow-glow" />
        )}
        <Icon
          className={cn("h-4 w-4 shrink-0", active ? "text-accent" : "text-text-muted group-hover:text-text-secondary")}
        />
        <span className="truncate">{item.label}</span>
      </Link>
    </li>
  );
}
