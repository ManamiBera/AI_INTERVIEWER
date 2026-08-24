"use client";

import { create } from "zustand";
import type { Analysis, ResumeFileMeta } from "@/types";
import { listAnalyses, insertAnalysis, updateAnalysisData, deleteAnalysisRow } from "@/services/db";

type ResumeState = {
  fileMeta: ResumeFileMeta | null;
  jd: string;
  targetRole: string;
  analyses: Analysis[]; // newest first
  activeAnalysisId: string | null;
  aiSource: string | null;
  hydrated: boolean;

  hydrate: () => Promise<void>;
  setFileMeta: (m: ResumeFileMeta | null) => void;
  setJd: (jd: string) => void;
  setTargetRole: (r: string) => void;
  addAnalysis: (a: Analysis, source: string) => Promise<void>;
  setActive: (id: string) => void;
  updateActive: (patch: Partial<Analysis>) => Promise<void>;
  deleteAnalysis: (id: string) => Promise<void>;

  activeAnalysis: () => Analysis | null;
};

export const useResumeStore = create<ResumeState>()((set, get) => ({
  fileMeta: null,
  jd: "",
  targetRole: "Software Engineer",
  analyses: [],
  activeAnalysisId: null,
  aiSource: null,
  hydrated: false,

  hydrate: async () => {
    try {
      const { analyses, sources } = await listAnalyses();
      set({
        analyses,
        activeAnalysisId: analyses[0]?.id ?? null,
        aiSource: analyses[0] ? sources[analyses[0].id] ?? "mock" : null,
        hydrated: true,
      });
    } catch {
      set({ hydrated: true });
    }
  },

  setFileMeta: (m) => set({ fileMeta: m }),
  setJd: (jd) => set({ jd }),
  setTargetRole: (targetRole) => set({ targetRole }),

  addAnalysis: async (a, source) => {
    set((s) => ({ analyses: [a, ...s.analyses], activeAnalysisId: a.id, aiSource: source }));
    await insertAnalysis(a, source);
  },

  setActive: (id) => set({ activeAnalysisId: id }),

  updateActive: async (patch) => {
    const s = get();
    const active = s.analyses.find((a) => a.id === s.activeAnalysisId);
    if (!active) return;
    const updated = { ...active, ...patch };
    set({ analyses: s.analyses.map((a) => (a.id === updated.id ? updated : a)) });
    await updateAnalysisData(updated);
  },

  deleteAnalysis: async (id) => {
    const s = get();
    const analyses = s.analyses.filter((a) => a.id !== id);
    set({ analyses, activeAnalysisId: s.activeAnalysisId === id ? (analyses[0]?.id ?? null) : s.activeAnalysisId });
    await deleteAnalysisRow(id);
  },

  activeAnalysis: () => {
    const s = get();
    return s.analyses.find((a) => a.id === s.activeAnalysisId) ?? s.analyses[0] ?? null;
  },
}));
