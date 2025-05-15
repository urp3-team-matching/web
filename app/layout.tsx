import Header from "@/components/Header";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

export const pretendard = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
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
      <body
        className={`${pretendard.variable}  flex flex-col items-center antialiased `}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
