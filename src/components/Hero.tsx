"use client";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import Footer from "@/components/Footer";
import { Spotlight } from "@/components/ui/spotlight-new";
import RegisterForm from "@/components/RegisterForm";
import * as Dialog from "@radix-ui/react-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Hero() {
    const router = useRouter();
    const [isEmailLoading, setIsEmailLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authOpen, setAuthOpen] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            await signIn('google', { callbackUrl: '/' });
        } catch (error) {
            console.error('Sign in error:', error);
            toast({ title: 'Sign-in failed', description: 'Could not sign in with Google.', variant: 'destructive' })
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEmailLoading(true);
        try {
            const result = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/' });
            if (result?.error) {
                toast({ title: 'Invalid credentials', description: 'Please check your email and password.', variant: 'destructive' })
                return;
            }
            setAuthOpen(false);
                const target = (result as any)?.url || '/';
                router.replace(target);
            router.refresh();
        } catch (error) {
            console.error('Sign in error:', error);
            toast({ title: 'Sign-in failed', description: 'Something went wrong. Please try again.', variant: 'destructive' })
        } finally {
            setIsEmailLoading(false);
        }
    }

    return (
        <section className="relative w-full overflow-hidden min-h-[100svh]">
            <BackgroundLines className="relative min-h-[100svh] w-full">
                {/* Spotlight overlay */}
                <Spotlight duration={9} translateY={-320} />
                                <div className={`mx-auto max-w-6xl px-6 min-h-[100svh] flex flex-col relative transition-all duration-300 ease-in-out ${authOpen ? 'md:pr-[460px]' : ''}`}>
                                    <div className={`flex-1 flex flex-col items-center justify-center text-center gap-6 relative z-40 transition-transform duration-300 ease-in-out ${authOpen ? 'md:-translate-x-4' : ''}`}>
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                            Track income & expenses with ease
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                            MoneyTracker
                        </h1>
                        <p className="max-w-2xl text-base md:text-lg text-white/70">
                            Stay on top of your finances. Add transactions in seconds and visualize your cashflow.
                        </p>
                                                <div className="flex items-center gap-3">
                                                        <Button size="lg" onClick={() => setAuthOpen(true)}>Get started</Button>
                                                </div>
                    </div>
                    <div className="relative z-50">
                        <Footer />
                    </div>
                </div>

                                {/* Centered Floaty Glass Modal */}
                                <Dialog.Root open={authOpen} onOpenChange={setAuthOpen}>
                                    <Dialog.Portal>
                                    <Dialog.Overlay className="fixed inset-0 bg-transparent z-40 data-[state=open]:animate-in data-[state=closed]:animate-out" />
                                    <Dialog.Content className="fixed top-1/2 -translate-y-1/2 z-50 left-1/2 -translate-x-1/2 w-[92vw] max-w-[520px] sm:left-auto sm:right-6 sm:translate-x-0 sm:w-[420px] max-h-[90svh] overflow-y-auto rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 sm:p-7 shadow-2xl supports-[backdrop-filter]:bg-white/10 focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95">
                                            <div className="flex items-center justify-between mb-4">
                                                <Dialog.Title className="text-xl font-semibold">Welcome</Dialog.Title>
                                        <Dialog.Close className="rounded-md p-1 hover:bg-white/10">
                                                    <X className="h-5 w-5" />
                                                    <span className="sr-only">Close</span>
                                                </Dialog.Close>
                                            </div>

                                            <Tabs defaultValue="signin" className="w-full">
                                                <TabsList className="w-full grid grid-cols-2">
                                                    <TabsTrigger value="signin">Sign in</TabsTrigger>
                                                    <TabsTrigger value="signup">Sign up</TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="signin" className="mt-4">
                                                    <form onSubmit={handleCredentialsLogin} className="w-full space-y-3">
                                                        <input
                                                            type="email"
                                                            className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
                                                            placeholder="Email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            required
                                                        />
                                                        <input
                                                            type="password"
                                                            className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
                                                            placeholder="Password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            required
                                                        />
                                                        <Button type="submit" size="lg" disabled={isEmailLoading || isGoogleLoading} className="w-full">
                                                            {isEmailLoading ? (
                                                                <>
                                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                    Signing in...
                                                                </>
                                                            ) : (
                                                                <>Sign in with Email</>
                                                            )}
                                                        </Button>
                                                    </form>
                                                                                                            <div className="flex items-center justify-between mt-2">
                                                                                                                <a href="/reset-password" className="text-sm text-white/70 hover:text-white underline-offset-2 hover:underline">
                                                                                                                    Forgot password?
                                                                                                                </a>
                                                                                                            </div>
                                                    <div className="flex items-center gap-2 opacity-70 text-sm my-3">
                                                        <span>or</span>
                                                    </div>
                                                    <Button size="lg" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isEmailLoading} className="w-full">
                                                        {isGoogleLoading ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Signing in...
                                                            </>
                                                        ) : (
                                                            <>Continue with Google</>
                                                        )}
                                                    </Button>
                                                </TabsContent>

                                                <TabsContent value="signup" className="mt-4">
                                                    <p className="text-sm mb-2 text-white/70">Create your account</p>
                                                    <RegisterForm />
                                                </TabsContent>
                                            </Tabs>
                                        </Dialog.Content>
                                    </Dialog.Portal>
                                </Dialog.Root>
            </BackgroundLines>
        </section>
    );
}