import { createFileRoute, Outlet, redirect, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/worker")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: WorkerLayout,
});

function WorkerLayout() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 border-b bg-card flex items-center gap-2 px-3 sticky top-0 z-10">
        <Link to="/worker" className="p-2 -ml-2 rounded hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 font-bold text-lg">Reef Ops</div>
        <div className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</div>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="w-4 h-4" />
        </Button>
      </header>
      <main className="flex-1 p-4 max-w-lg w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
}