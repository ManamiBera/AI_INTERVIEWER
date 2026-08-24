"use client";

import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { MobileDrawer } from "./MobileDrawer";
import { NotificationPanel } from "./NotificationPanel";
import { GlobalSearch } from "./GlobalSearch";
import { ExportModal } from "./ExportModal";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // ⌘K / Ctrl+K opens global search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar onExportClick={() => setExportOpen(true)} />
      </div>

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Sidebar
          onExportClick={() => {
            setMobileOpen(false);
            setExportOpen(true);
          }}
          onNavigate={() => setMobileOpen(false)}
        />
      </MobileDrawer>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          onOpenMobileNav={() => setMobileOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenNotifications={() => setNotifOpen(true)}
        />
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8 w-full max-w-[1400px] mx-auto">
          {children}
        </main>
      </div>

      {/* Overlays */}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
}
