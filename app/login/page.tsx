"use client";
import { useAuth } from "@/components/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { Car, User, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

type Mode = "select" | "login" | "signup";

const GUEST = { username: "guest", password: "guest1234" };

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AuthPageInner() {
  const { login, signup } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("select");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const go = (path: string) => router.push(path);

  // Handle Google OAuth callback
  useEffect(() => {
    const gId = searchParams.get("google_id");
    const gUsername = searchParams.get("google_username");
    if (gId && gUsername) {
      const userData = { id: gId, username: gUsername };
      localStorage.setItem("ridehub_user", JSON.stringify(userData));
      // Small delay to ensure context updates
      setTimeout(() => go("/"), 100);
    }
  }, [searchParams, go]);

  const handleGuestLogin = async () => {
    setLoading(true);
    await signup(GUEST.username, GUEST.password).catch(() => {});
    const ok = await login(GUEST.username, GUEST.password);
    setLoading(false);
    if (ok) go("/");
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth — update URL when backend OAuth is configured
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/auth/google`;
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
                  {/* Google */}
                  <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                    <GoogleIcon /> Continue with Google
                  </Button>

                  <div className="flex items-center gap-2">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground">or</span>
                    <Separator className="flex-1" />
                  </div>

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

export default function AuthPage() {
  return (
    <Suspense>
      <AuthPageInner />
    </Suspense>
  );
}
