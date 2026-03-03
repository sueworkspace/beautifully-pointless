"use client";

import PixelScene from "@/components/PixelScene";

interface CardClientProps {
  answer: string;
  children: React.ReactNode;
}

export default function CardClient({ answer, children }: CardClientProps) {
  return (
    <div className="min-h-screen" style={{ background: "var(--pixel-bg)" }}>
      <PixelScene text={answer} mode="display" />
      {children}
    </div>
  );
}
