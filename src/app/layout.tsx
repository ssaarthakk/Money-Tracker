import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthWrapper from "@/context/AuthWrapper";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoneyTracker",
  description: "Track your income and expenses effortlessly with MoneyTracker",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-neutral-950 text-white">
      <head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </head>
      <body className={inter.className + ' w-screen'}>
        <AuthWrapper>
          {children}
          <Toaster />
        </AuthWrapper>
      </body>
    </html>
  );
}
