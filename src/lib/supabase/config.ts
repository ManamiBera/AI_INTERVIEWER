/**
 * Supabase connection values.
 *
 * These read from environment variables first (recommended), falling back to
 * the project's PUBLIC values so the app works out-of-the-box on any host.
 *
 * Both values are safe to expose: the URL is public, and the anon/publishable
 * key is designed to ship to the browser — all data access is protected by
 * Postgres Row-Level Security. The server-only GEMINI_API_KEY is NOT here.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://kyzcdqzfjpajzujaatpb.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_zIRlz2-s40DYckGtHewXQw_Y5HNXc61";
