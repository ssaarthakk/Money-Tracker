import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthWrapper from "@/context/AuthWrapper";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budget Management",
  description: "Personalised budget management suited for your needs",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-neutral-950 text-white">
      <AuthWrapper>
      <body className={inter.className + '  w-screen'}>
      {children}
      <Toaster />
      </body>
      
      </AuthWrapper>
    </html>
  );
}
