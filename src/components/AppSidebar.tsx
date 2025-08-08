"use client";
import { useState } from "react";
import { useSidebar, Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconHome } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const links = [
  {
    label: "Dashboard",
    href: "/",
    icon: <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />,
  },
];

export default function AppSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen bg-neutral-900 text-white overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-6">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          {session?.user && (
            <div className="border-t border-white/10 pt-4 mt-2">
              <div className="flex items-center gap-3 px-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || ''} />
                  <AvatarFallback>{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{session.user.name}</p>
                  <p className="text-xs text-white/60 truncate">{session.user.email}</p>
                </div>
              </div>
              <div className="mt-3 px-1">
                <Button variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: '/' })}>
                  Logout
                </Button>
              </div>
            </div>
          )}
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 min-w-0 h-full overflow-y-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <span className="font-medium text-black dark:text-white whitespace-pre">
        MoneyTracker
      </span>
    </div>
  );
}
