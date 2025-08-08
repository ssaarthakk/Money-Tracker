"use client";
import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from 'next-auth/react';
import LogoutButton from './LogoutButton';

function ClientProfile() {
    const { data: session } = useSession();
    
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
                <DropdownMenuItem>
                    <LogoutButton />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ClientProfile;
