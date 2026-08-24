"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, X, Sparkles, Crown, Rocket } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

type Plan = {
  id: "free" | "pro" | "premium";
  name: string;
  icon: LucideIcon;
  monthly: number;
  yearly: number;
  tagline: string;
  features: string[];
  recommended?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "free", name: "Free", icon: Sparkles, monthly: 0, yearly: 0,
    tagline: "Get started with the essentials",
    features: ["2 resume analyses / month", "Basic ATS score", "Basic keyword analysis", "Limited interview questions"],
  },
  {
    id: "pro", name: "Pro", icon: Rocket, monthly: 299, yearly: 2990,
    tagline: "For serious job seekers", recommended: true,
    features: ["Unlimited resume analysis", "Advanced ATS analysis", "Job matching", "AI resume rewriting", "Unlimited interview practice", "Interview performance analytics"],
  },
  {
    id: "premium", name: "Career", icon: Crown, monthly: 999, yearly: 9990,
    tagline: "Everything to land the offer",
    features: ["Everything in Pro", "Advanced mock interviews", "Personalized preparation plan", "Industry-specific question banks", "Detailed communication analysis", "Priority AI processing"],
  },
];

const COMPARISON: { feature: string; free: boolean | string; pro: boolean | string; premium: boolean | string }[] = [
  { feature: "Resume analyses", free: "2 / mo", pro: "Unlimited", premium: "Unlimited" },
  { feature: "ATS scoring", free: "Basic", pro: "Advanced", premium: "Advanced" },
  { feature: "Job description matching", free: false, pro: true, premium: true },
  { feature: "AI resume rewriting", free: false, pro: true, premium: true },
  { feature: "Interview practice", free: "Limited", pro: "Unlimited", premium: "Unlimited" },
  { feature: "Mock interviews", free: false, pro: "Standard", premium: "Advanced" },
  { feature: "Preparation plan", free: false, pro: false, premium: true },
  { feature: "Communication analysis", free: false, pro: false, premium: true },
  { feature: "Priority AI processing", free: false, pro: false, premium: true },
];

const FAQ = [
  { q: "Can I cancel anytime?", a: "Yes — cancel from Settings at any time. You keep access until the end of your billing period." },
  { q: "Is there a student discount?", a: "Students on the Free plan get 4 analyses/month instead of 2 by verifying an .edu email in Profile." },
  { q: "Do you store my resume?", a: "Your data stays local in this build. When cloud sync is enabled you'll control storage in Settings → Privacy." },
  { q: "What payment methods are supported?", a: "Cards and UPI. Checkout is simulated in this preview build — no real charge occurs." },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [checkout, setCheckout] = useState<Plan | null>(null);
  const [current, setCurrent] = useState<Plan["id"]>("free");

  return (
    <>
      <PageHeader
        eyebrow="Plans & Pricing"
        title="Invest in your next offer."
        subtitle="Choose the plan that matches your job search. Upgrade, downgrade, or cancel anytime."
        actions={
          <div className="flex items-center gap-2 bg-elevated border border-border-subtle rounded-full p-1">
            <button onClick={() => setYearly(false)} className={cn("px-3 h-8 rounded-full text-xs font-medium transition-colors", !yearly ? "bg-accent/20 text-accent" : "text-text-secondary")}>Monthly</button>
            <button onClick={() => setYearly(true)} className={cn("px-3 h-8 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5", yearly ? "bg-accent/20 text-accent" : "text-text-secondary")}>
              Yearly <Badge tone="green" className="h-4">-17%</Badge>
            </button>
          </div>
        }
      />

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {PLANS.map((p) => {
          const Icon = p.icon;
          const price = yearly ? p.yearly : p.monthly;
          const isCurrent = current === p.id;
          return (
            <Card
              key={p.id}
              variant={p.recommended ? "glow" : "surface"}
              className={cn("p-6 flex flex-col relative", p.recommended && "ring-1 ring-accent/40")}
            >
              {p.recommended && (
                <Badge tone="cyan" className="absolute -top-3 left-1/2 -translate-x-1/2">Recommended</Badge>
              )}
              <div className="flex items-center gap-2 mb-1">
                <div className={cn("h-9 w-9 rounded-md grid place-items-center", p.recommended ? "bg-cyan-gradient text-[#04141C]" : "bg-elevated text-accent border border-border-subtle")}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-lg font-semibold text-text-primary">{p.name}</span>
              </div>
              <p className="text-xs text-text-muted mb-4">{p.tagline}</p>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-4xl font-bold text-text-primary">₹{price.toLocaleString("en-IN")}</span>
                <span className="text-sm text-text-muted">/{yearly ? "yr" : "mo"}</span>
              </div>
              <ul className="space-y-2.5 flex-1 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm text-text-secondary">
                    <Check className="h-4 w-4 text-score-green shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={p.recommended ? "primary" : "outline"}
                className="w-full"
                disabled={isCurrent}
                onClick={() => (p.id === "free" ? (setCurrent("free"), toast.success("Switched to Free plan.")) : setCheckout(p))}
              >
                {isCurrent ? "Current Plan" : p.id === "free" ? "Downgrade to Free" : `Get ${p.name}`}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Comparison table */}
      <h2 className="text-lg font-semibold text-text-primary mb-4">Feature Comparison</h2>
      <Card className="p-0 mb-12 overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="border-b border-border-subtle text-text-muted">
              <th className="text-left font-medium px-5 py-3">Feature</th>
              <th className="px-5 py-3 font-medium">Free</th>
              <th className="px-5 py-3 font-medium text-accent">Pro</th>
              <th className="px-5 py-3 font-medium">Career</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row, i) => (
              <tr key={row.feature} className={cn("border-b border-border-subtle/60", i % 2 && "bg-elevated/20")}>
                <td className="px-5 py-3 text-text-secondary">{row.feature}</td>
                <Cell v={row.free} />
                <Cell v={row.pro} highlight />
                <Cell v={row.premium} />
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* FAQ */}
      <h2 className="text-lg font-semibold text-text-primary mb-4">Frequently Asked Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {FAQ.map((f) => (
          <Card key={f.q} className="p-5">
            <div className="text-sm font-semibold text-text-primary mb-1.5">{f.q}</div>
            <p className="text-sm text-text-secondary">{f.a}</p>
          </Card>
        ))}
      </div>

      {/* Checkout modal */}
      <Modal open={!!checkout} onClose={() => setCheckout(null)} title="Confirm subscription" description={checkout ? `${checkout.name} · ₹${(yearly ? checkout.yearly : checkout.monthly).toLocaleString("en-IN")}/${yearly ? "yr" : "mo"}` : undefined}>
        {checkout && (
          <div>
            <div className="rounded-lg border border-border-subtle bg-elevated/40 p-4 mb-4">
              <div className="flex justify-between text-sm mb-1"><span className="text-text-muted">Plan</span><span className="text-text-primary font-medium">{checkout.name}</span></div>
              <div className="flex justify-between text-sm mb-1"><span className="text-text-muted">Billing</span><span className="text-text-primary font-medium">{yearly ? "Yearly" : "Monthly"}</span></div>
              <div className="flex justify-between text-sm pt-2 mt-2 border-t border-border-subtle"><span className="text-text-muted">Total</span><span className="text-text-primary font-bold">₹{(yearly ? checkout.yearly : checkout.monthly).toLocaleString("en-IN")}</span></div>
            </div>
            <p className="text-xs text-text-muted mb-4">This is a simulated checkout — no real payment is processed. Subscription state is stored locally.</p>
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setCheckout(null)}>Cancel</Button>
              <Button className="flex-1" onClick={() => { setCurrent(checkout.id); setCheckout(null); toast.success(`You're now on the ${checkout.name} plan.`); }}>
                Confirm & Subscribe
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

function Cell({ v, highlight }: { v: boolean | string; highlight?: boolean }) {
  return (
    <td className={cn("px-5 py-3 text-center", highlight && "bg-accent/[0.04]")}>
      {typeof v === "boolean" ? (
        v ? <Check className="h-4 w-4 text-score-green mx-auto" /> : <X className="h-4 w-4 text-text-muted/50 mx-auto" />
      ) : (
        <span className="text-text-primary">{v}</span>
      )}
    </td>
  );
}
