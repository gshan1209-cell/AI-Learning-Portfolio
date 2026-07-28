import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-bold tracking-tight text-ink">
          AI Learning Portfolio
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-4 text-sm font-medium text-slate-600">
          <Link href="/courses" className="hover:text-brand">課程目錄</Link>
          <Link href="/ml-algorithms" className="hover:text-brand">十大演算法</Link>
          <Link href="/ai-governance" className="hover:text-brand">AI 治理</Link>
          <Link href="/sources" className="hover:text-brand">移植中心</Link>
          <a href="https://github.com/gshan1209-cell/AI-Learning-Portfolio" target="_blank" rel="noreferrer" className="hover:text-brand">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
