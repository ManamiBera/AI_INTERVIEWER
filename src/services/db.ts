"use client";

import { createClient } from "@/lib/supabase/client";
import type { Analysis, MockInterview } from "@/types";

/** Supabase-backed data access. All reads/writes are scoped to the signed-in user by RLS. */

export async function getUserId(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// ---------- Analyses ----------
export async function listAnalyses(): Promise<{ analyses: Analysis[]; sources: Record<string, string> }> {
  const supabase = createClient();
  const { data, error } = await supabase.from("analyses").select("id, ai_source, data").order("created_at", { ascending: false });
  if (error) throw error;
  const analyses = (data ?? []).map((r) => r.data as Analysis);
  const sources: Record<string, string> = {};
  (data ?? []).forEach((r) => { sources[r.id as string] = (r.ai_source as string) ?? "mock"; });
  return { analyses, sources };
}

export async function insertAnalysis(a: Analysis, source: string): Promise<void> {
  const supabase = createClient();
  const userId = await getUserId();
  if (!userId) throw new Error("Not signed in");
  const { error } = await supabase.from("analyses").insert({
    id: a.id,
    user_id: userId,
    file_name: a.resumeId,
    target_role: a.targetRole,
    ats_score: a.atsScore,
    job_match: a.jobMatch,
    ai_source: source,
    data: a,
    created_at: a.createdAt,
  });
  if (error) throw error;
}

export async function updateAnalysisData(a: Analysis): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("analyses").update({ data: a, ats_score: a.atsScore, job_match: a.jobMatch }).eq("id", a.id);
  if (error) throw error;
}

export async function deleteAnalysisRow(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("analyses").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Interview sessions ----------
export async function listSessions(): Promise<MockInterview[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("interview_sessions").select("data").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => r.data as MockInterview);
}

export async function insertSession(s: MockInterview): Promise<void> {
  const supabase = createClient();
  const userId = await getUserId();
  if (!userId) throw new Error("Not signed in");
  const { error } = await supabase.from("interview_sessions").insert({
    id: s.id, user_id: userId, role: s.role, company: s.company, overall_score: s.overallScore, data: s, created_at: s.createdAt,
  });
  if (error) throw error;
}

export async function deleteSessionRow(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("interview_sessions").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Question progress ----------
export async function listQuestionProgress(): Promise<{ learned: string[]; practice: string[] }> {
  const supabase = createClient();
  const { data, error } = await supabase.from("question_progress").select("question_id, status");
  if (error) throw error;
  const learned: string[] = [];
  const practice: string[] = [];
  (data ?? []).forEach((r) => {
    if (r.status === "learned") learned.push(r.question_id as string);
    else practice.push(r.question_id as string);
  });
  return { learned, practice };
}

export async function setQuestionProgress(questionId: string, status: "learned" | "practice", on: boolean): Promise<void> {
  const supabase = createClient();
  const userId = await getUserId();
  if (!userId) throw new Error("Not signed in");
  if (on) {
    const { error } = await supabase.from("question_progress").upsert({ user_id: userId, question_id: questionId, status });
    if (error) throw error;
  } else {
    const { error } = await supabase.from("question_progress").delete().eq("question_id", questionId).eq("status", status);
    if (error) throw error;
  }
}
