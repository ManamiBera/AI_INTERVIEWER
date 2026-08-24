"use client";

import { create } from "zustand";
import type { MockInterview } from "@/types";
import { listSessions, insertSession, deleteSessionRow, listQuestionProgress, setQuestionProgress } from "@/services/db";

type InterviewState = {
  sessions: MockInterview[];
  learned: string[];
  practiceList: string[];
  targetRole: string;
  hydrated: boolean;

  hydrate: () => Promise<void>;
  addSession: (s: MockInterview) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  toggleLearned: (id: string) => Promise<void>;
  togglePractice: (id: string) => Promise<void>;
  setTargetRole: (r: string) => void;
};

export const useInterviewStore = create<InterviewState>()((set, get) => ({
  sessions: [],
  learned: [],
  practiceList: [],
  targetRole: "Software Engineer",
  hydrated: false,

  hydrate: async () => {
    try {
      const [sessions, progress] = await Promise.all([listSessions(), listQuestionProgress()]);
      set({ sessions, learned: progress.learned, practiceList: progress.practice, hydrated: true });
    } catch {
      set({ hydrated: true });
    }
  },

  addSession: async (s) => {
    set((st) => ({ sessions: [s, ...st.sessions] }));
    await insertSession(s);
  },

  deleteSession: async (id) => {
    set((st) => ({ sessions: st.sessions.filter((x) => x.id !== id) }));
    await deleteSessionRow(id);
  },

  toggleLearned: async (id) => {
    const on = !get().learned.includes(id);
    set((st) => ({ learned: on ? [...st.learned, id] : st.learned.filter((x) => x !== id) }));
    await setQuestionProgress(id, "learned", on);
  },

  togglePractice: async (id) => {
    const on = !get().practiceList.includes(id);
    set((st) => ({ practiceList: on ? [...st.practiceList, id] : st.practiceList.filter((x) => x !== id) }));
    await setQuestionProgress(id, "practice", on);
  },

  setTargetRole: (targetRole) => set({ targetRole }),
}));
