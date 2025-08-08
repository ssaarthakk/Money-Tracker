import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10">
      <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-white/70">
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 flex items-center justify-between gap-4">
          <span>
            © {new Date().getFullYear()} MoneyTracker · Built with Next.js and shadcn/ui
          </span>
          <nav className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
