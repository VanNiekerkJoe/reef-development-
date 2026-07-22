import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import reefLogo from "@/assets/reef-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Sign in — Reef Ops" },
      { name: "description", content: "Sign in to Reef Energy Engineering Fuels operations platform." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [signupRole, setSignupRole] = useState<"worker" | "owner" | "manager">("worker");
  const [loading, setLoading] = useState(false);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    navigate({ to: "/" });
  };

  const onSignup = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, role: signupRole },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — check your email if confirmation is required.");
  };

  const onGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) return toast.error(result.error.message ?? "Google sign-in failed");
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{ background: "linear-gradient(180deg, oklch(0.18 0.03 250) 0%, oklch(0.13 0.025 250) 100%)" }}>
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
           style={{ backgroundImage: "repeating-linear-gradient(135deg, #c9a227 0 1px, transparent 1px 14px)" }} />
      <Card className="w-full max-w-md relative border-accent/20 shadow-2xl">
        <div className="mining-rule" />
        <CardHeader className="text-center space-y-4 pt-8">
          <div className="mx-auto rounded-md px-4 py-3" style={{ backgroundColor: "#0d1b2a" }}>
            <img src={reefLogo.url} alt="R.E.E.F — Resource Energy Engineering Fuels" className="h-14 w-auto mx-auto" />
          </div>
          <CardDescription className="tracking-[0.2em] text-xs uppercase">Operations Platform · Est. 2014</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4 mt-4">
              <form onSubmit={onLogin} className="space-y-3">
                <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label>Password</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button type="submit" className="w-full" disabled={loading}>Sign in</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4 mt-4">
              <form onSubmit={onSignup} className="space-y-3">
                <div><Label>Full name</Label><Input required value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label>Password</Label><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <div>
                  <Label>Role</Label>
                  <Select value={signupRole} onValueChange={(v) => setSignupRole(v as any)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worker">Worker — mobile logging</SelectItem>
                      <SelectItem value="manager">Manager — full dashboard</SelectItem>
                      <SelectItem value="owner">Owner — full dashboard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>Create account</Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>
          <Button variant="outline" className="w-full" onClick={onGoogle}>Continue with Google</Button>
        </CardContent>
      </Card>
    </div>
  );
}