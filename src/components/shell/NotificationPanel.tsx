"use client";

import Link from "next/link";
import { Bell, Check, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/cn";
import { EmptyState } from "@/components/ui/EmptyState";

/** Phase 1 stub notifications — replaced with notificationStore in Phase 5. */
const STUB_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Your ATS score improved by 12%.",
    detail: "Software Engineer resume · Google JD",
    createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    kind: "success" as const,
    read: false,
    href: "/resume/ats-verdict",
  },
  {
    id: "n2",
    title: "Your resume is missing 4 keywords from the target job.",
    detail: "Next.js, AWS, Docker, GraphQL",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    kind: "warning" as const,
    read: false,
    href: "/resume/keywords",
  },
  {
    id: "n3",
    title: "You have 3 interview questions left today.",
    detail: "Complete today's set to keep your streak.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    kind: "info" as const,
    read: true,
    href: "/interview/questions",
  },
  {
    id: "n4",
    title: "Your interview readiness score increased to 78%.",
    detail: "+8% this week — nice pace.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    kind: "success" as const,
    read: true,
    href: "/interview",
  },
];

type NotificationPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const items = STUB_NOTIFICATIONS;
  const unread = items.filter((i) => !i.read).length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title="Notifications"
      description={unread ? `${unread} unread` : "You're all caught up"}
    >
      {items.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications yet" description="We'll ping you when something needs your attention." />
      ) : (
        <>
          <div className="flex items-center justify-end gap-2 mb-3">
            <Button variant="ghost" size="sm" leftIcon={<Check className="h-3.5 w-3.5" />}>
              Mark all as read
            </Button>
          </div>
          <ul className="space-y-2">
            {items.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.href ?? "#"}
                  onClick={onClose}
                  className={cn(
                    "block rounded-md p-3 border transition-all",
                    n.read
                      ? "bg-surface/60 border-border-subtle"
                      : "bg-elevated border-accent/30 shadow-glow-sm",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <ToneDot kind={n.kind} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-text-primary">{n.title}</div>
                      {n.detail && <div className="text-xs text-text-secondary mt-0.5">{n.detail}</div>}
                      <div className="text-[11px] text-text-muted mt-1">{formatRelative(n.createdAt)}</div>
                    </div>
                    <button
                      className="text-text-muted hover:text-score-red p-1 rounded transition-colors"
                      aria-label="Delete"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-border-subtle text-center">
            <Link
              href="/notifications"
              onClick={onClose}
              className="text-xs text-accent hover:text-accent/80"
            >
              View all notifications →
            </Link>
          </div>
        </>
      )}
    </Modal>
  );
}

function ToneDot({ kind }: { kind: "info" | "success" | "warning" | "error" }) {
  const cls =
    kind === "success"
      ? "bg-score-green"
      : kind === "warning"
      ? "bg-score-amber"
      : kind === "error"
      ? "bg-score-red"
      : "bg-accent";
  return <span className={cn("mt-1.5 h-2 w-2 rounded-full shadow-glow-sm shrink-0", cls)} />;
}
