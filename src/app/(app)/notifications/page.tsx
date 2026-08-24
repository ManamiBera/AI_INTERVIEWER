"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Bell, Check, Trash2, CheckCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Notification } from "@/types";

const SEED: Notification[] = [
  { id: "n1", title: "Your ATS score improved by 12%.", detail: "Software Engineer resume · Google JD", createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(), read: false, kind: "success", href: "/resume/ats-verdict" },
  { id: "n2", title: "Your resume is missing 4 keywords from the target job.", detail: "Next.js, AWS, Docker, GraphQL", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), read: false, kind: "warning", href: "/resume/keywords" },
  { id: "n3", title: "You have 3 interview questions left today.", detail: "Complete today's set to keep your streak.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), read: false, kind: "info", href: "/interview/questions" },
  { id: "n4", title: "Your interview readiness score increased to 78%.", detail: "+8% this week — nice pace.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), read: true, kind: "success", href: "/interview" },
  { id: "n5", title: "New template added: Impact Executive.", detail: "Board-ready, achievement-first narrative.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(), read: true, kind: "info", href: "/templates" },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Notification[]>(SEED);
  const unread = items.filter((i) => !i.read).length;

  return (
    <>
      <PageHeader
        eyebrow="Stay in the loop"
        title="Notifications"
        subtitle="Score changes, keyword alerts, interview reminders, and product news — all in one place."
        actions={
          <Button variant="outline" leftIcon={<CheckCheck className="h-4 w-4" />} disabled={!unread} onClick={() => { setItems((is) => is.map((i) => ({ ...i, read: true }))); toast.success("All marked as read."); }}>
            Mark all read
          </Button>
        }
      />

      {items.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up. We'll let you know when something needs attention." />
      ) : (
        <div className="space-y-2 max-w-3xl">
          {unread > 0 && <Badge tone="cyan" className="mb-2">{unread} unread</Badge>}
          {items.map((n) => (
            <Card key={n.id} className={cn("p-4 flex items-start gap-3 transition-all", !n.read && "border-accent/30")}>
              <span className={cn("mt-1.5 h-2 w-2 rounded-full shrink-0", n.kind === "success" ? "bg-score-green" : n.kind === "warning" ? "bg-score-amber" : n.kind === "error" ? "bg-score-red" : "bg-accent")} />
              <button
                className="flex-1 min-w-0 text-left"
                onClick={() => { setItems((is) => is.map((i) => (i.id === n.id ? { ...i, read: true } : i))); if (n.href) router.push(n.href); }}
              >
                <div className={cn("text-sm", n.read ? "text-text-secondary" : "text-text-primary font-medium")}>{n.title}</div>
                {n.detail && <div className="text-xs text-text-muted mt-0.5">{n.detail}</div>}
                <div className="text-[11px] text-text-muted mt-1">{formatRelative(n.createdAt)}</div>
              </button>
              <div className="flex items-center gap-1 shrink-0">
                {!n.read && (
                  <button onClick={() => setItems((is) => is.map((i) => (i.id === n.id ? { ...i, read: true } : i)))} className="h-7 w-7 grid place-items-center rounded-md text-text-muted hover:text-accent hover:bg-hover" aria-label="Mark read" title="Mark read">
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button onClick={() => { setItems((is) => is.filter((i) => i.id !== n.id)); toast.success("Notification deleted."); }} className="h-7 w-7 grid place-items-center rounded-md text-text-muted hover:text-score-red hover:bg-hover" aria-label="Delete" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
