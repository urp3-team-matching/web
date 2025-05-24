import Header from "@/components/Header";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
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
          <Header />
          <div className="container">{children}</div>
        </NuqsAdapter>
      <body className={`${pretendard.variable} antialiased`}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full overflow-hidden">
            {/* 사이드바 (좌측 고정) */}
            <AppSidebar />

            {/* 본문 영역 */}
            <div className="flex flex-col flex-1 min-w-0">
              <Header />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
