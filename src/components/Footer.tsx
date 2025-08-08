export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-10">
      <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-white/60 flex items-center justify-between">
        <span>© {new Date().getFullYear()} MoneyTracker</span>
        <span>Built with Next.js, shadcn/ui, and love.</span>
      </div>
    </footer>
  )
}
