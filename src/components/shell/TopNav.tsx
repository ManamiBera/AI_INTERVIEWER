"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Search, Settings as SettingsIcon, Menu } from "lucide-react";
import { TOP_NAV, isActive } from "@/lib/nav";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";

type TopNavProps = {
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
};

export function TopNav({ onOpenMobileNav, onOpenSearch, onOpenNotifications }: TopNavProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 shrink-0 border-b border-border-subtle",
        "bg-base/80 backdrop-blur-md",
      )}
    >
      <div className="h-full flex items-center gap-4 px-4 md:px-6">
        {/* Mobile menu */}
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden h-9 w-9 grid place-items-center rounded-md text-text-secondary hover:text-text-primary hover:bg-hover"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-8 rounded-md bg-cyan-gradient grid place-items-center shadow-glow-sm">
            <span className="text-[#04141C] font-bold text-sm">E</span>
          </div>
          <span className="text-sm md:text-base font-semibold text-text-primary tracking-tight hidden sm:inline">
            The Editorial Intelligence
          </span>
        </Link>

        {/* Top nav links */}
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {TOP_NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 h-9 rounded-md text-sm font-medium transition-colors flex items-center",
                  active
                    ? "text-accent"
                    : "text-text-secondary hover:text-text-primary hover:bg-hover",
                )}
              >
                {item.label}
                {active && (
                  <span className="ml-2 h-1 w-1 rounded-full bg-accent shadow-glow" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={onOpenSearch}
            className={cn(
              "hidden md:flex items-center gap-2 h-9 px-3 rounded-md text-sm",
              "text-text-muted bg-elevated/60 border border-border-subtle hover:border-accent/40 hover:text-text-secondary transition-colors",
            )}
          >
            <Search className="h-4 w-4" />
            <span>Search…</span>
            <kbd className="ml-2 hidden md:inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono bg-hover border border-border-subtle text-text-muted">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onOpenSearch}
            className="md:hidden h-9 w-9 grid place-items-center rounded-md text-text-secondary hover:text-text-primary hover:bg-hover"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <NotifBell onClick={onOpenNotifications} />

          <Link
            href="/settings"
            className="h-9 w-9 grid place-items-center rounded-md text-text-secondary hover:text-text-primary hover:bg-hover"
            aria-label="Settings"
          >
            <SettingsIcon className="h-4 w-4" />
          </Link>

          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

function NotifBell({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative h-9 w-9 grid place-items-center rounded-md text-text-secondary hover:text-text-primary hover:bg-hover"
      aria-label="Notifications"
    >
      <Bell className="h-4 w-4" />
      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent shadow-glow-sm ring-2 ring-base" />
    </button>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const email = data.user.email ?? "";
        const name = (data.user.user_metadata?.name as string) || email.split("@")[0] || "Account";
        setUser({ name, email });
      }
    });
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = (user?.name ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="h-9 w-9 rounded-full bg-cyan-gradient grid place-items-center text-[#04141C] font-semibold text-xs ml-1 shadow-glow-sm"
        aria-label="Profile menu"
      >
        {initials}
      </button>
      {open && (
        <div className="absolute right-0 top-11 w-52 card-elevated glow-border p-1 animate-fade-in z-40">
          <div className="px-3 py-2 border-b border-border-subtle mb-1">
            <div className="text-sm font-semibold text-text-primary truncate">{user?.name ?? "Account"}</div>
            <div className="text-xs text-text-muted truncate">{user?.email ?? ""}</div>
          </div>
          <Link href="/profile" className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-hover rounded">Profile</Link>
          <Link href="/settings" className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-hover rounded">Settings</Link>
          <Link href="/pricing" className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-hover rounded">Upgrade plan</Link>
          <div className="my-1 border-t border-border-subtle" />
          <button onMouseDown={signOut} className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-hover rounded">
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
