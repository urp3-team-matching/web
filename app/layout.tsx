import Header from "@/components/Header";
import { AppSidebar } from "@/components/Header/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import "@/lib/env";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "융합연구학점제 팀 모집 플랫폼",
  description: "성균관대학교 융합연구학점제 팀 모집 플랫폼",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={cn(notoSansKR.className, "flex flex-col items-center")}>
        <NuqsAdapter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-hidden">
              {/* 사이드바 (좌측 고정) */}
              <AppSidebar />

              {/* 본문 영역 */}
              <div className="flex flex-col flex-1 min-w-0">
                <Header />
                <main className="container">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
