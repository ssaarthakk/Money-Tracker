import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { auth } from '@/auth';
import LogoutButton from './LogoutButton';

async function Proifle() {
    const session = await auth();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={session?.user?.image || ''} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='mr-5 mt-2'>
                <DropdownMenuItem className='flex gap-3'>
                    <span>
                    <Avatar>
                        <AvatarImage src={session?.user?.image || ''} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    </span>
                    <span className='flex flex-col'>
                    <span>{session?.user?.name}</span>
                    <span>{session?.user?.email}</span>
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <LogoutButton />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Proifle