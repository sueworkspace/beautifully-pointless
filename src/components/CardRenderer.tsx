"use client";

import { motion } from "framer-motion";

export type CardType = "postcard" | "card" | "typography";

export interface CardData {
  id: string;
  nickname?: string;
  answer: string;
  generatedText: string;
  cardType: CardType;
  colorTheme?: string;
  createdAt: string;
}

const CARD_COLORS: Record<string, { bg: string; text: string }> = {
  cream: { bg: "var(--card-cream)", text: "var(--text)" },
  sage: { bg: "var(--card-sage)", text: "#3D4A38" },
  sky: { bg: "var(--card-sky)", text: "#384A55" },
  blush: { bg: "var(--card-blush)", text: "#5A3D38" },
  lavender: { bg: "var(--card-lavender)", text: "#4A385A" },
};

function getColor(theme?: string) {
  return CARD_COLORS[theme || "cream"] || CARD_COLORS.cream;
}

/* ========== 엽서 (Postcard) — 5:7, 한지 텍스처 ========== */
function PostcardView({ data }: { data: CardData }) {
  const color = getColor(data.colorTheme);
  return (
    <div
      className="relative overflow-hidden"
      style={{
        aspectRatio: "5/7",
        background: `linear-gradient(145deg, ${color.bg}, var(--bg-warm))`,
        borderRadius: "2px",
      }}
    >
      {/* 워시 그라데이션 */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, var(--accent) 0%, transparent 60%)`,
        }}
      />
      {/* 테두리 라인 */}
      <div
        className="absolute inset-3 md:inset-5 border"
        style={{ borderColor: `${color.text}15` }}
      />
      {/* 콘텐츠 */}
      <div className="relative h-full flex flex-col justify-center items-center px-8 md:px-12 text-center">
        <div
          className="w-8 h-[1px] mb-8"
          style={{ background: "var(--accent)" }}
        />
        <p
          className="font-normal leading-[2.2] text-[0.95rem] md:text-[1.05rem]"
          style={{
            fontFamily: "var(--font-serif)",
            color: color.text,
            wordBreak: "keep-all",
          }}
        >
          {data.generatedText}
        </p>
        <div
          className="w-8 h-[1px] mt-8"
          style={{ background: "var(--accent)" }}
        />
        {data.nickname && (
          <p
            className="mt-8 text-[0.75rem] tracking-[0.2em] italic"
            style={{
              fontFamily: "var(--font-display)",
              color: `${color.text}88`,
            }}
          >
            — {data.nickname}
          </p>
        )}
      </div>
    </div>
  );
}

/* ========== 카드 (Card) — 4:3, 단색 파스텔 ========== */
function CardView({ data }: { data: CardData }) {
  const color = getColor(data.colorTheme);
  return (
    <div
      className="relative overflow-hidden"
      style={{
        aspectRatio: "4/3",
        background: color.bg,
        borderRadius: "2px",
      }}
    >
      <div className="h-full flex flex-col justify-center px-10 md:px-16">
        <p
          className="font-medium leading-[1.6] text-[1.3rem] md:text-[1.6rem]"
          style={{
            fontFamily: "var(--font-serif)",
            color: color.text,
            wordBreak: "keep-all",
          }}
        >
          {data.generatedText}
        </p>
        {data.nickname && (
          <p
            className="mt-8 text-[0.8rem] tracking-[0.15em]"
            style={{
              fontFamily: "var(--font-display)",
              color: `${color.text}66`,
            }}
          >
            {data.nickname}
          </p>
        )}
      </div>
    </div>
  );
}

/* ========== 타이포그래피 아트 (Typography) — 1:1, 글자가 시각 요소 ========== */
function TypographyView({ data }: { data: CardData }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        aspectRatio: "1/1",
        background: "var(--text)",
        borderRadius: "2px",
      }}
    >
      <div className="h-full flex flex-col justify-center items-center px-8 md:px-12 text-center">
        <p
          className="font-light leading-[1.8] text-[1.1rem] md:text-[1.3rem]"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--bg)",
            wordBreak: "keep-all",
          }}
        >
          {data.generatedText}
        </p>
        {data.nickname && (
          <p
            className="mt-6 text-[0.7rem] tracking-[0.3em] uppercase"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--accent)",
            }}
          >
            {data.nickname}
          </p>
        )}
      </div>
    </div>
  );
}

/* ========== 메인 렌더러 ========== */
export default function CardRenderer({
  data,
  animate = true,
}: {
  data: CardData;
  animate?: boolean;
}) {
  const content = (() => {
    switch (data.cardType) {
      case "postcard":
        return <PostcardView data={data} />;
      case "card":
        return <CardView data={data} />;
      case "typography":
        return <TypographyView data={data} />;
    }
  })();

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      {content}
    </motion.div>
  );
}
