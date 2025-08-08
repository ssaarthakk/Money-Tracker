"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { safeFetch } from "@/lib/http";
import { toast } from "@/components/ui/use-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const verifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await safeFetch("/api/auth/password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      // safeFetch will toast on error
      if (!data?.exists) {
        toast({ title: "Not found", description: "No account found for this email.", variant: "destructive" })
        return;
      }
      setStep("password");
      setMessage(null);
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
  const res = await safeFetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
  // safeFetch will toast on error
      setMessage("Password updated. You can sign in now.");
      setPassword("");
      setTimeout(() => router.push("/"), 1200);
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100svh] w-full flex items-center justify-center">
      <div className="w-full max-w-md px-6 py-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-2">Reset password</h1>
          {step === "email" && (
            <>
              <p className="text-white/70 text-sm mb-6">Enter your account email to continue.</p>
              <form onSubmit={verifyEmail} className="space-y-4">
                <input
                  type="email"
                  className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Checking…" : "Continue"}
                </Button>
                {message && <p className="text-sm text-white/80">{message}</p>}
              </form>
            </>
          )}

          {step === "password" && (
            <>
              <p className="text-white/70 text-sm mb-6">Set a new password for {email}.</p>
              <form onSubmit={resetPassword} className="space-y-4">
                <input
                  type="password"
                  className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
                  placeholder="New password (min 6 chars)"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="flex items-center gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep("email")} disabled={loading}>
                    Back
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Saving…" : "Reset password"}
                  </Button>
                </div>
                {message && <p className="text-sm text-white/80">{message}</p>}
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
