import { NuqsAdapter } from "nuqs/adapters/next/app";

import Header from "@/components/Header";
import { cn } from "@/lib/utils";
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
      </body>
    </html>
  );
}
