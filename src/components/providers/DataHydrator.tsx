"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useResumeStore } from "@/store/resumeStore";
import { useInterviewStore } from "@/store/interviewStore";

/** Loads the signed-in user's data from Supabase into the stores, and re-hydrates on auth changes. */
export function DataHydrator() {
  const hydrateResume = useResumeStore((s) => s.hydrate);
  const hydrateInterview = useInterviewStore((s) => s.hydrate);

  useEffect(() => {
    hydrateResume();
    hydrateInterview();

    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        hydrateResume();
        hydrateInterview();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [hydrateResume, hydrateInterview]);

  return null;
}
