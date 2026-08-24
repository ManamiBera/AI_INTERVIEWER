"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { User, SlidersHorizontal, Bell, Shield, Palette, Save, Trash2, Sun, Moon, Monitor } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";

type ThemeMode = "dark" | "light" | "system";

const TABS = [
  { id: "account", label: "Account", icon: User },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
] as const;

export default function SettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("account");
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Apply theme by toggling the `light` class on <html> (tokens defined in globals.css)
  useEffect(() => {
    const root = document.documentElement;
    const apply = (mode: ThemeMode) => {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      const light = mode === "light" || (mode === "system" && prefersLight);
      root.classList.toggle("light", light);
    };
    apply(theme);
  }, [theme]);

  function saveTheme(mode: ThemeMode) {
    setTheme(mode);
    toast.success(`Theme set to ${mode}.`);
  }

  return (
    <>
      <PageHeader eyebrow="Your account" title="Settings" subtitle="Manage your account, preferences, notifications, privacy, and appearance." />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <Card className="lg:col-span-1 p-2 h-fit">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 h-10 rounded-md text-sm transition-colors",
                  tab === t.id ? "bg-accent/10 text-text-primary border border-accent/30" : "text-text-secondary hover:bg-hover border border-transparent",
                )}
              >
                <Icon className={cn("h-4 w-4", tab === t.id ? "text-accent" : "text-text-muted")} />
                {t.label}
              </button>
            );
          })}
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {tab === "account" && (
            <Card className="p-6">
              <CardTitle className="mb-5">Account</CardTitle>
              <div className="space-y-4 max-w-md">
                <div><Label className="mb-1.5 block">Name</Label><Input defaultValue="Aditya Sharma" /></div>
                <div><Label className="mb-1.5 block">Email</Label><Input defaultValue="aditya@editorial.ai" type="email" /></div>
                <div><Label className="mb-1.5 block">Password</Label><Input type="password" defaultValue="••••••••" /></div>
                <div className="flex gap-2 pt-2">
                  <Button leftIcon={<Save className="h-4 w-4" />} onClick={() => toast.success("Account updated.")}>Save</Button>
                </div>
                <div className="pt-6 mt-6 border-t border-border-subtle">
                  <div className="text-sm font-medium text-score-red mb-1">Danger Zone</div>
                  <p className="text-xs text-text-muted mb-3">Permanently delete your account and all associated data.</p>
                  <Button variant="danger" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => setDeleteOpen(true)}>Delete Account</Button>
                </div>
              </div>
            </Card>
          )}

          {tab === "preferences" && (
            <Card className="p-6">
              <CardTitle className="mb-5">Preferences</CardTitle>
              <div className="space-y-4 max-w-md">
                <SelectRow label="Language" options={["English", "Hindi", "Spanish"]} />
                <SelectRow label="Default Resume" options={["Software_Engineer_Google.pdf", "Sarah_Chen_Senior_UI.pdf"]} />
                <SelectRow label="Default Job Role" options={["Software Engineer", "Frontend Developer", "Data Scientist"]} />
                <Button leftIcon={<Save className="h-4 w-4" />} onClick={() => toast.success("Preferences saved.")}>Save</Button>
              </div>
            </Card>
          )}

          {tab === "notifications" && (
            <Card className="p-6">
              <CardTitle className="mb-5">Notifications</CardTitle>
              <div className="space-y-1">
                <ToggleRow label="Email notifications" desc="Receive important updates by email" defaultOn />
                <ToggleRow label="Interview reminders" desc="Nudge me about scheduled practice" defaultOn />
                <ToggleRow label="Resume recommendations" desc="Weekly suggestions to improve my resume" defaultOn />
                <ToggleRow label="Product updates" desc="New features and announcements" />
              </div>
            </Card>
          )}

          {tab === "privacy" && (
            <Card className="p-6">
              <CardTitle className="mb-5">Privacy</CardTitle>
              <div className="space-y-1">
                <ToggleRow label="Data usage analytics" desc="Help improve the product with anonymized usage" defaultOn />
                <ToggleRow label="Resume storage" desc="Store my resumes for quick re-analysis" defaultOn />
                <ToggleRow label="AI processing" desc="Allow AI to process my documents for analysis" defaultOn />
              </div>
              <p className="text-xs text-text-muted mt-4">Your data is stored locally in this build. Nothing leaves your device.</p>
            </Card>
          )}

          {tab === "appearance" && (
            <Card className="p-6">
              <CardTitle className="mb-5">Appearance</CardTitle>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                <ThemeCard mode="dark" active={theme === "dark"} icon={Moon} onClick={() => saveTheme("dark")} />
                <ThemeCard mode="light" active={theme === "light"} icon={Sun} onClick={() => saveTheme("light")} />
                <ThemeCard mode="system" active={theme === "system"} icon={Monitor} onClick={() => saveTheme("system")} />
              </div>
            </Card>
          )}
        </div>
      </div>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete account?" description="This action cannot be undone.">
        <p className="text-sm text-text-secondary mb-4">All your resumes, analyses, and interview history will be permanently removed. Are you absolutely sure?</p>
        <div className="flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={() => { setDeleteOpen(false); toast.error("Account deletion requested (simulated)."); }}>Delete forever</Button>
        </div>
      </Modal>
    </>
  );
}

function ThemeCard({ mode, active, icon: Icon, onClick }: { mode: string; active: boolean; icon: typeof Sun; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn("p-4 rounded-lg border flex flex-col items-center gap-2 transition-all capitalize", active ? "border-accent/60 bg-accent/5 shadow-glow-sm" : "border-border-subtle hover:border-accent/40")}>
      <Icon className={cn("h-5 w-5", active ? "text-accent" : "text-text-muted")} />
      <span className={cn("text-sm", active ? "text-text-primary" : "text-text-secondary")}>{mode}</span>
    </button>
  );
}

function SelectRow({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <select className="w-full h-10 px-3 text-sm bg-elevated/60 border border-border-subtle text-text-primary rounded-md focus:border-accent/60 focus:outline-none">
        {options.map((o) => <option key={o} className="bg-elevated">{o}</option>)}
      </select>
    </div>
  );
}

function ToggleRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-border-subtle/60 last:border-0">
      <div>
        <div className="text-sm text-text-primary">{label}</div>
        <div className="text-xs text-text-muted">{desc}</div>
      </div>
      <button
        onClick={() => { setOn((o) => !o); toast.success(`${label} ${!on ? "enabled" : "disabled"}.`); }}
        className={cn("relative h-6 w-11 rounded-full transition-colors shrink-0", on ? "bg-accent" : "bg-elevated border border-border-subtle")}
        aria-label={label}
      >
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform", on ? "translate-x-5" : "translate-x-0.5")} />
      </button>
    </div>
  );
}
