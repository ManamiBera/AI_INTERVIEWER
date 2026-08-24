"use client";

import { useState } from "react";
import { toast } from "sonner";
import { User, Briefcase, Wrench, Target, Plus, X, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Label } from "@/components/ui/Input";

export default function ProfilePage() {
  const [saving, setSaving] = useState(false);
  const [skills, setSkills] = useState({
    technical: ["React", "TypeScript", "Node.js", "REST APIs"],
    soft: ["Communication", "Ownership", "Collaboration"],
    languages: ["English", "Hindi"],
    tools: ["Git", "Docker", "Figma"],
  });
  const [companies, setCompanies] = useState(["Google", "Stripe", "Vercel"]);

  async function save() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success("Profile saved.");
  }

  return (
    <>
      <PageHeader
        eyebrow="Your account"
        title="Profile"
        subtitle="Keep your information current — the AI uses your target role and skills to tailor every analysis and interview."
        actions={<Button leftIcon={<Save className="h-4 w-4" />} loading={saving} onClick={save}>Save Changes</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal */}
        <Section icon={User} title="Personal Information">
          <Field label="Full Name" defaultValue="Aditya Sharma" />
          <Field label="Email" defaultValue="aditya@editorial.ai" type="email" />
          <Field label="Phone" defaultValue="+91 98765 43210" />
          <Field label="Location" defaultValue="Bengaluru, India" />
          <Field label="LinkedIn" defaultValue="linkedin.com/in/aditya" />
          <Field label="GitHub" defaultValue="github.com/aditya" />
          <Field label="Portfolio" defaultValue="aditya.dev" />
        </Section>

        {/* Career */}
        <Section icon={Briefcase} title="Career Information">
          <Field label="Current Role" defaultValue="Software Engineer" />
          <Field label="Education" defaultValue="B.Tech, Computer Science" />
          <Field label="Years of Experience" defaultValue="3" type="number" />
          <Field label="Target Role" defaultValue="Senior Software Engineer" />
          <div>
            <Label className="mb-2 block">Target Companies</Label>
            <TagEditor tags={companies} setTags={setCompanies} placeholder="Add a company…" />
          </div>
          <Field label="Preferred Industries" defaultValue="Tech, Fintech" />
        </Section>

        {/* Skills */}
        <Section icon={Wrench} title="Skills">
          <SkillGroup label="Technical Skills" tags={skills.technical} setTags={(t) => setSkills((s) => ({ ...s, technical: t }))} />
          <SkillGroup label="Soft Skills" tags={skills.soft} setTags={(t) => setSkills((s) => ({ ...s, soft: t }))} />
          <SkillGroup label="Languages" tags={skills.languages} setTags={(t) => setSkills((s) => ({ ...s, languages: t }))} />
          <SkillGroup label="Tools" tags={skills.tools} setTags={(t) => setSkills((s) => ({ ...s, tools: t }))} />
        </Section>

        {/* Career preferences */}
        <Section icon={Target} title="Career Preferences">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Salary Min (₹ LPA)" defaultValue="24" type="number" />
            <Field label="Salary Max (₹ LPA)" defaultValue="40" type="number" />
          </div>
          <Field label="Preferred Location" defaultValue="Bengaluru / Remote" />
          <div>
            <Label className="mb-2 block">Work Mode</Label>
            <div className="flex gap-2">
              {["Remote", "Hybrid", "On-site"].map((m, i) => (
                <button key={m} className={`px-3 h-9 rounded-md text-sm border transition-colors ${i === 1 ? "bg-accent/15 text-accent border-accent/40" : "border-border-subtle text-text-secondary hover:border-accent/30"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof User; title: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-5">
        <Icon className="h-4 w-4 text-accent" />
        <CardTitle>{title}</CardTitle>
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue?: string; type?: string }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <Input defaultValue={defaultValue} type={type} />
    </div>
  );
}

function SkillGroup({ label, tags, setTags }: { label: string; tags: string[]; setTags: (t: string[]) => void }) {
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <TagEditor tags={tags} setTags={setTags} placeholder={`Add a ${label.toLowerCase().replace(/s$/, "")}…`} />
    </div>
  );
}

function TagEditor({ tags, setTags, placeholder }: { tags: string[]; setTags: (t: string[]) => void; placeholder: string }) {
  const [val, setVal] = useState("");
  function add() {
    const v = val.trim();
    if (!v || tags.includes(v)) return;
    setTags([...tags, v]);
    setVal("");
  }
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((t) => (
          <Badge key={t} tone="cyan" className="pr-1">
            {t}
            <button onClick={() => setTags(tags.filter((x) => x !== t))} className="ml-1 hover:text-score-red" aria-label={`Remove ${t}`}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} placeholder={placeholder} className="h-9" />
        <Button size="sm" variant="outline" onClick={add} aria-label="Add"><Plus className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
