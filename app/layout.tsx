import type { Metadata, Viewport } from "next";
import { connection } from "next/server";
import "pretendard/dist/web/static/pretendard.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/600.css";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { AdminProvider } from "@/components/admin/AdminProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AppShell } from "@/components/layout/AppShell";
import { getAllLectures } from "@/lib/lectures";
import { getSearchIndex } from "@/lib/search";
import { readCatalog } from "@/lib/catalog";
import { readCollection, withoutBody } from "@/lib/content";
import { adminPassword } from "@/lib/access";

export const metadata: Metadata = {
  title: { default: "HJS STUDY", template: "%s | HJS STUDY" },
  description: "제가 공부한 자료들을 정리해놓은 사이트입니당",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
    { media: "(prefers-color-scheme: dark)", color: "#161614" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Local admin edits must be read on every development request. Production content is
  // generated once at build time so Vercel can serve the pages from its static cache.
  if (process.env.NODE_ENV === "development") await connection();
  const lectures = getAllLectures();
  const exams = readCollection("practice").map(withoutBody);
  const catalog = readCatalog();
  const shell = <>
    <a href="#main-content" className="skip-link">본문으로 바로가기</a>
    <Header lectures={lectures} exams={exams} catalog={catalog} searchIndex={getSearchIndex()} />
    <AppShell sidebar={<Sidebar lectures={lectures} exams={exams} catalog={catalog} />}>{children}</AppShell>
  </>;
  return <html lang="ko" suppressHydrationWarning><body><Providers>
    {process.env.NODE_ENV === "development" ? <AdminProvider expectedPassword={adminPassword()}>{shell}</AdminProvider> : shell}
  </Providers></body></html>;
}
