import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AppSidebar } from "@/components/Header/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
            {/* ✅ 전체를 세로 레이아웃으로: (상단/본문/푸터) */}
            <div className="flex min-h-screen w-full flex-col overflow-hidden">
              {/* ✅ 본문(사이드바+콘텐츠)은 남은 높이 차지 */}
              <div className="flex flex-1 w-full overflow-hidden">
                {/* 사이드바 (좌측 고정) */}
                <AppSidebar />

                {/* 본문 영역 */}
                <div className="flex flex-col flex-1 min-w-0">
                  <Header />
                  <main className="container flex-1">{children}</main>
                </div>
              </div>

              {/* ✅ Footer는 '사이드바 포함 전체 폭'으로 하단에 위치 */}
              <Footer />

              <SpeedInsights />
              <Analytics />
            </div>
          </SidebarProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
