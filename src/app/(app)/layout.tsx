import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { DataHydrator } from "@/components/providers/DataHydrator";
import { createClient } from "@/lib/supabase/server";

export default async function AppGroupLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth — middleware already gates, but never render the app to an anonymous request.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <>
      <DataHydrator />
      <AppShell>{children}</AppShell>
    </>
  );
}
