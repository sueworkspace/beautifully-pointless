"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import CardRenderer, { type CardData } from "@/components/CardRenderer";

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function CardPage() {
  const params = useParams();
  const id = params.id as string;
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MVP: localStorage에서 카드 데이터 로드
    const stored = localStorage.getItem(`card-${id}`);
    if (stored) {
      setCard(JSON.parse(stored));
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full border-t"
          style={{ borderColor: "var(--accent)" }}
        />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-6">
        <p
          className="text-[1rem] font-light mb-8"
          style={{ color: "var(--text-faint)" }}
        >
          카드를 찾을 수 없습니다.
        </p>
        <Link
          href="/write"
          className="text-[0.85rem] tracking-[0.15em] font-light"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--text)",
            borderBottom: "1px solid var(--accent)",
          }}
        >
          나의 답을 적어보기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-[0.8rem] tracking-[0.2em] transition-opacity hover:opacity-100"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-faint)",
            opacity: 0.6,
          }}
        >
          pointless joy
        </Link>
        <Link
          href="/archive"
          className="text-[0.75rem] tracking-[0.1em] italic transition-opacity hover:opacity-100"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-faint)",
            opacity: 0.5,
          }}
        >
          archive
        </Link>
      </header>

      <div className="min-h-screen flex flex-col justify-center items-center px-6 py-24">
        {/* 카드 */}
        <motion.div
          className="w-full max-w-[480px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <CardRenderer data={card} />
        </motion.div>

        {/* 원본 답변 */}
        <motion.div
          className="mt-14 max-w-[480px] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <p
            className="text-[0.85rem] leading-[1.8] font-light"
            style={{ color: "var(--text-light)", wordBreak: "keep-all" }}
          >
            &ldquo;{card.answer}&rdquo;
          </p>
          {card.nickname && (
            <p
              className="mt-4 text-[0.75rem] tracking-[0.15em] italic"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-faint)",
              }}
            >
              — {card.nickname}
            </p>
          )}
          <p
            className="mt-6 text-[0.7rem] tracking-[0.1em]"
            style={{ color: "var(--text-faint)", opacity: 0.5 }}
          >
            {new Date(card.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </motion.div>

        {/* 액션 */}
        <motion.div
          className="mt-14 flex gap-8 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link
            href="/write"
            className="text-[0.85rem] tracking-[0.1em] font-light px-6 py-3 transition-all duration-300 hover:tracking-[0.15em]"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--text)",
              borderBottom: "1px solid var(--accent)",
            }}
          >
            나의 답을 적어보기
          </Link>
          <Link
            href="/archive"
            className="text-[0.8rem] tracking-[0.1em] italic font-light transition-opacity hover:opacity-100"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--text-faint)",
              opacity: 0.6,
            }}
          >
            아카이브
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
