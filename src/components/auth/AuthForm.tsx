"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, User, FileSpreadsheet } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name || email.split("@")[0] } },
        });
        if (error) throw error;
        if (!data.session) {
          // Email confirmation is on — user must verify.
          toast.success("Account created — check your email to confirm, then log in.");
          router.push("/login");
          return;
        }
        toast.success("Welcome to AI Interviewer!");
        router.push(next);
        router.refresh();
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="h-10 w-10 rounded-lg bg-cyan-gradient grid place-items-center shadow-glow-sm">
            <FileSpreadsheet className="h-5 w-5 text-[#04141C]" />
          </div>
          <span className="text-lg font-semibold text-text-primary tracking-tight">AI Interviewer</span>
        </div>

        <Card variant="glow" className="p-8">
          <h1 className="text-2xl font-bold text-gradient-cyan text-center">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-text-secondary text-center mt-2 mb-6">
            {mode === "login" ? "Sign in to continue your career prep." : "Start analyzing resumes and prepping for interviews."}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <Field icon={User} label="Name">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="pl-9" autoComplete="name" />
              </Field>
            )}
            <Field icon={Mail} label="Email">
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-9" autoComplete="email" />
            </Field>
            <Field icon={Lock} label="Password">
              <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="pl-9" autoComplete={mode === "login" ? "current-password" : "new-password"} />
            </Field>

            {error && <div className="text-xs text-score-red bg-score-red/10 border border-score-red/25 rounded-md px-3 py-2">{error}</div>}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-text-secondary">
            {mode === "login" ? (
              <>Don&apos;t have an account? <Link href="/signup" className="text-accent hover:text-accent/80">Sign up</Link></>
            ) : (
              <>Already have an account? <Link href="/login" className="text-accent hover:text-accent/80">Sign in</Link></>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }: { icon: typeof Mail; label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted z-10" />
        {children}
      </div>
    </div>
  );
}
