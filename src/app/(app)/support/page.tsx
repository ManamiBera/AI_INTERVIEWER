"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, LifeBuoy, FileText, Award, Presentation, CreditCard, User, Wrench, ChevronDown, Send, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

const CATEGORIES: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "resume", label: "Resume Analysis", icon: FileText },
  { id: "ats", label: "ATS", icon: Award },
  { id: "interview", label: "Interview Preparation", icon: Presentation },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "account", label: "Account", icon: User },
  { id: "technical", label: "Technical Issues", icon: Wrench },
];

const FAQ: { q: string; a: string; cat: string }[] = [
  { q: "How is my ATS score calculated?", a: "It's a weighted composite of keyword match (30), formatting (20), experience relevance (20), skills alignment (15), and structure (15).", cat: "ats" },
  { q: "Why is my resume flagged for a two-column layout?", a: "Many ATS engines read multi-column resumes out of order. We recommend a single-column layout — use Fix Automatically in the Formatting page.", cat: "resume" },
  { q: "How do mock interviews get scored?", a: "The AI evaluates technical knowledge, answer quality, communication, structure, confidence, and relevance based on your responses.", cat: "interview" },
  { q: "Can I cancel my subscription?", a: "Yes, from Settings → Account. You keep access until the end of the billing period.", cat: "billing" },
  { q: "How do I change my email?", a: "Go to Settings → Account, update the email field, and save.", cat: "account" },
  { q: "The analysis is stuck — what do I do?", a: "Refresh the page and re-upload. If it persists, submit a ticket below with the file details.", cat: "technical" },
];

export default function SupportPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const faqs = useMemo(() => {
    return FAQ.filter((f) => {
      if (cat && f.cat !== cat) return false;
      if (query.trim()) return f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase());
      return true;
    });
  }, [query, cat]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    toast.success("Support ticket submitted. We'll reply by email.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <PageHeader eyebrow="We're here to help" title="Support Center" subtitle="Search the knowledge base, browse FAQs by topic, or contact our team directly." />

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input placeholder="Search help articles…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 h-11" />
        </div>
      </Card>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCat(active ? null : c.id)}
              className={cn("p-4 rounded-lg border flex flex-col items-center gap-2 text-center transition-all", active ? "border-accent/60 bg-accent/5 shadow-glow-sm" : "border-border-subtle bg-surface/60 hover:border-accent/40")}
            >
              <Icon className={cn("h-5 w-5", active ? "text-accent" : "text-text-muted")} />
              <span className={cn("text-xs", active ? "text-text-primary" : "text-text-secondary")}>{c.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Frequently Asked Questions</h2>
          {faqs.length === 0 ? (
            <Card className="p-8 text-center text-sm text-text-muted">No articles match your search.</Card>
          ) : (
            <div className="space-y-2">
              {faqs.map((f) => (
                <Card key={f.q} className="overflow-hidden">
                  <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setOpen(open === f.q ? null : f.q)}>
                    <span className="text-sm font-medium text-text-primary flex-1">{f.q}</span>
                    <ChevronDown className={cn("h-4 w-4 text-text-muted transition-transform", open === f.q && "rotate-180")} />
                  </button>
                  {open === f.q && <div className="px-4 pb-4 text-sm text-text-secondary animate-fade-in">{f.a}</div>}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4"><LifeBuoy className="h-4 w-4 text-accent" /><CardTitle>Contact Support</CardTitle></div>
            <form className="space-y-3" onSubmit={submit}>
              <div><Label className="mb-1.5 block">Subject</Label><Input required placeholder="Brief summary" /></div>
              <div>
                <Label className="mb-1.5 block">Category</Label>
                <select required className="w-full h-10 px-3 text-sm bg-elevated/60 border border-border-subtle text-text-primary rounded-md focus:border-accent/60 focus:outline-none">
                  {CATEGORIES.map((c) => <option key={c.id} className="bg-elevated">{c.label}</option>)}
                </select>
              </div>
              <div><Label className="mb-1.5 block">Description</Label><Textarea required placeholder="Describe your issue in detail…" /></div>
              <div>
                <Label className="mb-1.5 block">Attachment (optional)</Label>
                <input type="file" className="w-full text-xs text-text-muted file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-elevated file:text-text-secondary file:text-xs" />
              </div>
              <Button type="submit" className="w-full" loading={submitting} leftIcon={<Send className="h-4 w-4" />}>Submit Ticket</Button>
            </form>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-score-amber" /><span className="text-sm font-medium text-text-primary">Report a Problem</span></div>
            <p className="text-xs text-text-muted mb-3">Found a bug or something broken? Let us know and we'll investigate.</p>
            <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success("Problem report form opened.")}>Report a Problem</Button>
          </Card>
        </div>
      </div>
    </>
  );
}
