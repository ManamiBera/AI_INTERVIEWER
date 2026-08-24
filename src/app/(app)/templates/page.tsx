"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Search, Eye, ShieldCheck, FileText, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/data/templates";
import type { ResumeTemplate } from "@/types";
import { cn } from "@/lib/cn";

export default function TemplatesPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [preview, setPreview] = useState<ResumeTemplate | null>(null);

  const featured = TEMPLATES[0];

  const visible = useMemo(() => {
    return TEMPLATES.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return t.name.toLowerCase().includes(q) || t.industry.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [query, category]);

  function useTemplate(t: ResumeTemplate) {
    toast.success(`Loading "${t.name}" into the editor…`);
    router.push("/resume/editor");
  }

  return (
    <>
      <PageHeader
        eyebrow="Resume Templates"
        title="Template Marketplace"
        subtitle="Professionally designed, ATS-tested resume templates across every industry. Preview any template or load it straight into the editor."
      />

      {/* Featured hero */}
      <Card variant="glow" className="p-6 md:p-8 mb-8 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <Badge tone="cyan" className="mb-3"><Star className="h-3 w-3" /> Featured this week</Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">{featured.name}</h2>
            <p className="text-sm text-text-secondary mt-2 max-w-lg">{featured.description}</p>
            <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-score-green" /> {featured.atsCompatibility}% ATS compatible</span>
              <span>·</span>
              <span>{featured.industry}</span>
            </div>
            <div className="flex gap-2 mt-5">
              <Button leftIcon={<FileText className="h-4 w-4" />} onClick={() => useTemplate(featured)}>Use This Template</Button>
              <Button variant="outline" leftIcon={<Eye className="h-4 w-4" />} onClick={() => setPreview(featured)}>Preview</Button>
            </div>
          </div>
          <div className="w-full md:w-64 shrink-0">
            <TemplateThumb slug={featured.previewSlug} large />
          </div>
        </div>
      </Card>

      {/* Toolbar */}
      <Card className="p-4 mb-6">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input placeholder="Search templates by name or industry…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {TEMPLATE_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={cn(
                "px-3 h-8 rounded-full text-xs font-medium border transition-all",
                category === c.id ? "bg-accent/15 text-accent border-accent/40" : "border-border-subtle text-text-secondary hover:text-text-primary hover:border-accent/30",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </Card>

      {visible.length === 0 ? (
        <EmptyState icon={Search} title="No templates found" description="Try a different category or search term." action={<Button variant="outline" onClick={() => { setQuery(""); setCategory("all"); }}>Reset</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visible.map((t) => (
            <Card key={t.id} className="p-4 flex flex-col group">
              <div className="mb-3 rounded-md overflow-hidden border border-border-subtle">
                <TemplateThumb slug={t.previewSlug} />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="text-sm font-semibold text-text-primary">{t.name}</div>
                <Badge tone={t.atsCompatibility >= 95 ? "green" : "amber"} className="shrink-0">{t.atsCompatibility}%</Badge>
              </div>
              <div className="text-[11px] text-text-muted mt-0.5">{t.industry}</div>
              <p className="text-xs text-text-secondary mt-2 flex-1">{t.description}</p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1" onClick={() => useTemplate(t)}>Use Template</Button>
                <Button size="sm" variant="outline" onClick={() => setPreview(t)} aria-label="Preview"><Eye className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} size="lg" title={preview?.name} description={preview ? `${preview.industry} · ${preview.atsCompatibility}% ATS compatible` : undefined}>
        {preview && (
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-56 shrink-0">
              <TemplateThumb slug={preview.previewSlug} large />
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-secondary">{preview.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-score-green" /> Single-column, ATS-safe structure</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-score-green" /> Standard section headings</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-score-green" /> Metric-ready bullet formatting</li>
              </ul>
              <Button className="mt-6 w-full" onClick={() => { useTemplate(preview); setPreview(null); }}>Use This Template</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

/** Renders a stylized mock resume thumbnail (no external images — CSS only). */
function TemplateThumb({ slug, large }: { slug: string; large?: boolean }) {
  const accent =
    slug === "exec" ? "#22D3EE" : slug === "data" ? "#22C55E" : slug === "finance" ? "#F59E0B" :
    slug === "design" ? "#a78bfa" : slug === "product" ? "#22D3EE" : slug === "consult" ? "#38bdf8" : "#8AA0C5";
  return (
    <div className={cn("bg-white rounded p-3", large ? "aspect-[3/4]" : "aspect-[3/4]")}>
      <div className="h-2 w-2/3 rounded" style={{ background: accent }} />
      <div className="h-1 w-1/2 bg-gray-300 rounded mt-1.5" />
      <div className="mt-3 space-y-1">
        <div className="h-1 w-full bg-gray-200 rounded" />
        <div className="h-1 w-11/12 bg-gray-200 rounded" />
        <div className="h-1 w-4/5 bg-gray-200 rounded" />
      </div>
      <div className="h-1.5 w-1/3 rounded mt-3" style={{ background: accent, opacity: 0.6 }} />
      <div className="mt-1.5 space-y-1">
        <div className="h-1 w-full bg-gray-200 rounded" />
        <div className="h-1 w-10/12 bg-gray-200 rounded" />
        <div className="h-1 w-11/12 bg-gray-200 rounded" />
      </div>
      <div className="h-1.5 w-1/4 rounded mt-3" style={{ background: accent, opacity: 0.6 }} />
      <div className="mt-1.5 flex gap-1 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-1.5 w-6 bg-gray-200 rounded" />)}
      </div>
    </div>
  );
}
