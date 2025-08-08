"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const search = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => search.get("token") || "", [search]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to reset password");
      setMessage("Password reset. You can sign in now.");
      setPassword("");
      setTimeout(() => router.push("/"), 1200);
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[70vh] w-full">
      <div className="mx-auto max-w-md px-6 py-12">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-2">Reset password</h1>
          <p className="text-white/70 text-sm mb-6">Enter a new password for your account.</p>
          {!token && (
            <p className="text-amber-400/90 text-sm mb-4">Missing or invalid token. Please use the link from your email.</p>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="password"
              className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
              placeholder="New password (min 6 chars)"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading || !token} className="w-full">
              {loading ? "Resetting…" : "Reset password"}
            </Button>
            {message && <p className="text-sm text-white/80">{message}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}
