import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCardById } from "@/lib/db";
import CardClient from "./CardClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = await getCardById(id);

  if (!card) {
    return { title: "카드를 찾을 수 없습니다" };
  }

  return {
    title: `${card.answer} — 무용한 기쁨`,
    description: card.generatedText,
    openGraph: {
      title: `${card.answer} — 무용한 기쁨`,
      description: card.generatedText,
      type: "article",
    },
  };
}

export default async function CardPage({ params }: Props) {
  const { id } = await params;
  const card = await getCardById(id);

  if (!card) {
    notFound();
  }

  return (
    <CardClient answer={card.answer}>
      <div
        className="phase-content min-h-screen flex flex-col justify-center items-center"
        style={{ padding: "20px" }}
      >
      <div className="w-full max-w-[520px]">
        {/* NES 프레임 안에 카드 내용 */}
        <div className="pixel-frame p-5 md:p-10">
          {/* 답변 (크게) */}
          <h1
            className="pixel-heading text-center"
            style={{
              color: "var(--pixel-cyan)",
              fontSize: "24px",
              marginBottom: "24px",
              wordBreak: "keep-all",
              lineHeight: 1.6,
            }}
          >
            &ldquo;{card.answer}&rdquo;
          </h1>

          {/* 생성 텍스트 */}
          <p
            className="pixel-body"
            style={{
              color: "var(--pixel-gray)",
              whiteSpace: "pre-line",
              lineHeight: 2,
              fontSize: "14px",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            {card.generatedText}
          </p>

          {/* 닉네임 */}
          <p
            className="pixel-label"
            style={{
              color: "var(--pixel-dark-gray)",
              textAlign: "right",
              fontSize: "12px",
            }}
          >
            — {card.nickname}
          </p>
        </div>

        {/* 질문 문구 */}
        <p
          className="pixel-label text-center mt-6"
          style={{ color: "var(--pixel-dark-gray)", fontSize: "11px" }}
        >
          나를 기쁘게 하는 아름답지만 무용한 것은?
        </p>

        {/* CTA 버튼 */}
        <div className="text-center mt-4">
          <Link href="/" className="pixel-btn" style={{ textDecoration: "none", fontSize: "14px", padding: "10px 24px" }}>
            나도 써보기 &gt;
          </Link>
        </div>
      </div>
      </div>
    </CardClient>
  );
}
