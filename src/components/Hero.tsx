"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";

// Simple, modern hero inspired by Aceternity-style aesthetics
export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-purple-600/10 to-transparent" />
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 relative">
        <div className="flex flex-col items-center text-center gap-6">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
            New · Track income & expenses with ease
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            MoneyTracker
          </h1>
          <p className="max-w-2xl text-base md:text-lg text-white/70">
            Stay on top of your finances. Add transactions in seconds, visualize your cashflow, and make better decisions—without the clutter.
          </p>
          <div className="flex items-center gap-3">
            <Button size="lg" onClick={() => signIn('google', { callbackUrl: '/' })}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <a
              href="#features"
              className="text-white/70 hover:text-white transition-colors text-sm md:text-base"
            >
              Learn more
            </a>
          </div>
        </div>
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-80" id="features">
          <FeatureCard title="Fast" desc="Add transactions instantly" />
          <FeatureCard title="Secure" desc="Google sign-in & sessions" />
          <FeatureCard title="Insights" desc="Income vs expense breakdown" />
          <FeatureCard title="Simple" desc="Minimal, focused design" />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-sm text-white/70">{desc}</p>
    </div>
  );
}
