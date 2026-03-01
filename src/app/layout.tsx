import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "무용한 기쁨",
  description:
    "나를 기쁘게 하는 아름답지만 무용한 것은 무엇인가요?",
  openGraph: {
    title: "무용한 기쁨",
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
      <body>{children}</body>
    </html>
  );
}
