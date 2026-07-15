import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-bold tracking-tight text-ink">
          AI Learning Portfolio
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/courses" className="hover:text-brand">課程目錄</Link>
          <Link href="/sources" className="hover:text-brand">來源專案</Link>
          <a href="https://github.com/gshan1209-cell" target="_blank" rel="noreferrer" className="hover:text-brand">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
