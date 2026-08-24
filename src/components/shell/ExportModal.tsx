"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileText, Award, Presentation, Trophy } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

type ExportModalProps = {
  open: boolean;
  onClose: () => void;
};

type ExportKind = "ats" | "resume" | "interview" | "complete";
type Format = "pdf" | "docx";

const OPTIONS: Array<{ id: ExportKind; title: string; description: string; icon: LucideIcon; docx: boolean }> = [
  { id: "ats", title: "ATS Report", description: "Score breakdown, keyword coverage, and formatting audit.", icon: Award, docx: false },
  { id: "resume", title: "Resume", description: "Your active resume version.", icon: FileText, docx: true },
  { id: "interview", title: "Interview Report", description: "Latest mock interview transcript and scoring.", icon: Presentation, docx: false },
  { id: "complete", title: "Complete Career Report", description: "Everything — resume, ATS, interview history, plan.", icon: Trophy, docx: false },
];

export function ExportModal({ open, onClose }: ExportModalProps) {
  const [selected, setSelected] = useState<ExportKind>("ats");
  const [format, setFormat] = useState<Format>("pdf");
  const [exporting, setExporting] = useState(false);

  const selectedOption = OPTIONS.find((o) => o.id === selected)!;

  async function handleExport() {
    setExporting(true);
    // Simulated export — real jsPDF pipeline lands in Phase 5.
    await new Promise((r) => setTimeout(r, 900));
    setExporting(false);
    toast.success(`${selectedOption.title} exported as ${format.toUpperCase()}.`);
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Export"
      description="Generate a professional PDF or DOCX of your work."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {OPTIONS.map((o) => {
          const Icon = o.icon;
          const active = selected === o.id;
          return (
            <button
              key={o.id}
              onClick={() => setSelected(o.id)}
              className={cn(
                "text-left p-4 rounded-lg border transition-all",
                active
                  ? "border-accent/60 bg-accent/5 shadow-glow-sm"
                  : "border-border-subtle bg-surface/60 hover:border-accent/40",
              )}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={cn("h-8 w-8 rounded-md grid place-items-center", active ? "bg-cyan-gradient text-[#04141C]" : "bg-elevated text-text-secondary")}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-sm font-semibold text-text-primary">{o.title}</div>
              </div>
              <div className="text-xs text-text-secondary">{o.description}</div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted uppercase tracking-widest">Format</span>
          <div className="flex rounded-md border border-border-subtle overflow-hidden">
            <FormatBtn active={format === "pdf"} onClick={() => setFormat("pdf")}>PDF</FormatBtn>
            <FormatBtn
              active={format === "docx"}
              onClick={() => selectedOption.docx && setFormat("docx")}
              disabled={!selectedOption.docx}
            >
              DOCX
            </FormatBtn>
          </div>
          {!selectedOption.docx && (
            <span className="text-xs text-text-muted">DOCX not available for this report</span>
          )}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleExport} loading={exporting}>
            Export {selectedOption.title}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function FormatBtn({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-3 h-8 text-xs font-semibold transition-colors",
        active
          ? "bg-accent/20 text-accent"
          : disabled
          ? "bg-transparent text-text-muted cursor-not-allowed"
          : "bg-transparent text-text-secondary hover:bg-hover",
      )}
    >
      {children}
    </button>
  );
}
