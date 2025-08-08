"use client";
import { useState } from "react";
import { useSidebar, Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconDashboard, IconHome, IconCreditCard, IconUser, IconSettings } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import ClientProfile from "./ClientProfile";

const links = [
  {
    label: "Dashboard",
    href: "/",
    icon: <IconHome className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />,
  },
  {
    label: "Transactions", 
    href: "#transactions",
    icon: <IconCreditCard className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />,
  },
];

export default function AppSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          {session?.user && (
            <div>
              <ClientProfile />
            </div>
          )}
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
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
