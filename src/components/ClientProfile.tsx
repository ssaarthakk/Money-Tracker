"use client";
import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from 'next-auth/react';
import LogoutButton from './LogoutButton';
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

function ClientProfile() {
    const { data: session } = useSession();
    const [openSet, setOpenSet] = useState(false);
    const [newPass, setNewPass] = useState("");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    
    if (!session?.user) return null;
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ''} />
                    <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 mr-5 mt-2'>
                <DropdownMenuItem className='flex gap-3 p-3'>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={session.user.image || ''} />
                        <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                        <span className="font-medium">{session.user.name}</span>
                        <span className="text-sm text-muted-foreground">{session.user.email}</span>
                    </div>
                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setOpenSet(true); }}>
                                        Set/Change password
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href="/reset-password">Forgot password</a>
                                </DropdownMenuItem>
                <DropdownMenuItem>
                    <LogoutButton />
                </DropdownMenuItem>
            </DropdownMenuContent>

                        {/* Set Password Dialog (for logged-in users, including OAuth) */}
                        <Dialog.Root open={openSet} onOpenChange={setOpenSet}>
                            <Dialog.Portal>
                                <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
                                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-[420px] rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <Dialog.Title className="text-lg font-semibold">Set or change password</Dialog.Title>
                                        <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
                                    </div>
                                                        <form
                                                            onSubmit={async (e) => {
                                            e.preventDefault();
                                            setBusy(true);
                                            setMsg(null);
                                            try {
                                                                    const res = await fetch('/api/auth/password/set', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ password: newPass }),
                                                });
                                                const data = await res.json();
                                                if (!res.ok) throw new Error(data?.message || 'Failed to set password');
                                                setMsg('Password updated.');
                                                setNewPass('');
                                            } catch (err: any) {
                                                setMsg(err.message || 'Something went wrong');
                                            } finally {
                                                setBusy(false);
                                            }
                                        }}
                                        className="space-y-3"
                                    >
                                        <input
                                            type="password"
                                            className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 outline-none focus:border-white/30"
                                            placeholder="New password (min 6 chars)"
                                            minLength={6}
                                            value={newPass}
                                            onChange={(e) => setNewPass(e.target.value)}
                                            required
                                        />
                                        <Button type="submit" disabled={busy} className="w-full">{busy ? 'Saving…' : 'Save password'}</Button>
                                        {msg && <p className="text-sm text-white/80">{msg}</p>}
                                    </form>
                                </Dialog.Content>
                            </Dialog.Portal>
                        </Dialog.Root>

                        {/* Forgot Password now navigates to dedicated page */}
        </DropdownMenu>
    );
}

export default ClientProfile;
