import type { Metadata, Viewport } from "next";
import SiteHeader from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI Learning Portfolio",
    template: "%s｜AI Learning Portfolio",
  },
  description: "將 AI 與資料科學作業重新設計為新手友善的互動教學作品集。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-TW">
      <body>
        <SiteHeader />
        {children}
        <footer className="mt-20 border-t border-slate-200 bg-white/70">
          <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-slate-500">
            AI Learning Portfolio — 從作業開始，把每一次練習變成能分享的知識。
          </div>
        </footer>
      </body>
    </html>
  );
}
