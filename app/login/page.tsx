"use client";
import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Car, User, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Mode = "select" | "login" | "signup";

const GUEST = { username: "guest_user", password: "guest1234" };

export default function AuthPage() {
  const { login, signup } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("select");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const go = (path: string) => router.push(path);

  const handleGuestLogin = async () => {
    setLoading(true);
    // Ensure guest account exists
    await signup(GUEST.username, GUEST.password).catch(() => {});
    const ok = await login(GUEST.username, GUEST.password);
    setLoading(false);
    if (ok) go("/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    let ok = false;
    if (mode === "login") {
      ok = await login(username, password);
      if (!ok) setError("Invalid username or password");
    } else {
      ok = await signup(username, password);
      if (!ok) setError("Username already taken");
    }
    setLoading(false);
    if (ok) go("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <Car className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold">RideHub</span>
        </div>

        <AnimatePresence mode="wait">
          {mode === "select" && (
            <motion.div key="select" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-lg">How do you want to continue?</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {/* Guest */}
                  <button
                    onClick={handleGuestLogin}
                    disabled={loading}
                    className="group flex items-start gap-4 rounded-xl border border-border p-4 hover:bg-accent transition-colors text-left"
                  >
                    <div className="mt-0.5 h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                      <Zap className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-semibold">Try as Guest</div>
                      <div className="text-sm text-muted-foreground">Explore RideHub instantly — no sign-up needed</div>
                    </div>
                  </button>

                  {/* Login */}
                  <button
                    onClick={() => { setMode("login"); setError(null); }}
                    className="group flex items-start gap-4 rounded-xl border border-border p-4 hover:bg-accent transition-colors text-left"
                  >
                    <div className="mt-0.5 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Log In</div>
                      <div className="text-sm text-muted-foreground">Sign in to your existing account</div>
                    </div>
                  </button>

                  {/* Signup */}
                  <button
                    onClick={() => { setMode("signup"); setError(null); }}
                    className="group flex items-start gap-4 rounded-xl border border-primary/40 p-4 hover:bg-primary/5 transition-colors text-left"
                  >
                    <div className="mt-0.5 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Create Account</div>
                      <div className="text-sm text-muted-foreground">New here? Sign up in seconds</div>
                    </div>
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {(mode === "login" || mode === "signup") && (
            <motion.div key={mode} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{mode === "login" ? "Log In" : "Create Account"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      placeholder="Username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      required autoFocus
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
                    </Button>
                  </form>
                  <button
                    className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => { setMode("select"); setError(null); setUsername(""); setPassword(""); }}
                  >
                    ← Back
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
