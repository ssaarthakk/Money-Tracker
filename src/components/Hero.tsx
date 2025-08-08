"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import Footer from "@/components/Footer";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function Hero() {
    const [isLoading, setIsLoading] = useState(false);

    const handleGetStarted = async () => {
        setIsLoading(true);
        try {
            await signIn('google', { callbackUrl: '/' });
        } catch (error) {
            console.error('Sign in error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
            <section className="relative w-full overflow-hidden min-h-[100svh]">
                <BackgroundLines className="relative min-h-[100svh] w-full">
                    {/* Spotlight overlay */}
                    <Spotlight duration={9} translateY={-320} />
                    <div className="mx-auto max-w-6xl px-6 min-h-[100svh] flex flex-col relative">
                        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 relative z-50">
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                            Track income & expenses with ease
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                            MoneyTracker
                        </h1>
                        <p className="max-w-2xl text-base md:text-lg text-white/70">
                            Stay on top of your finances. Add transactions in seconds and visualize your cashflow.
                        </p>
                        <div className="flex items-center">
                            <Button size="lg" onClick={handleGetStarted} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>Sign in with Google</>
                                )}
                            </Button>
                        </div>
                    </div>
                                <div className="relative z-50">
                                    <Footer />
                                </div>
                </div>
            </BackgroundLines>
        </section>
    );
}