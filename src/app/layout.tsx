import type { Metadata } from "next";
import { Noto_Serif_KR, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

/* 세리프 본문 — POV 감성 */
const notoSerifKR = Noto_Serif_KR({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/* 디스플레이 — Apple식 우아한 영문 */
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "아름답지만 무용한 것 — Pointless Joy",
  description:
    "나를 기쁘게 하는 아름답지만 무용한 것은 무엇인가요? 당신의 답을 아름다운 카드로 만들어드립니다.",
  openGraph: {
    title: "아름답지만 무용한 것 — Pointless Joy",
    description:
      "나를 기쁘게 하는 아름답지만 무용한 것은 무엇인가요?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSerifKR.variable} ${cormorant.variable}`}>
        {children}
      </body>
    </html>
  );
}
