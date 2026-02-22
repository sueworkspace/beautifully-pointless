"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import CardRenderer, { type CardData } from "@/components/CardRenderer";

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function ArchivePage() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MVP: localStorage에서 모든 카드 로드
    const allCards: CardData[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("card-")) {
        try {
          allCards.push(JSON.parse(localStorage.getItem(key)!));
        } catch {
          // skip invalid entries
        }
      }
    }
    // 최신순 정렬
    allCards.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setCards(allCards);
    setLoading(false);
  }, []);

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
          href="/write"
          className="text-[0.8rem] tracking-[0.1em] font-light transition-opacity hover:opacity-100"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--text-faint)",
            opacity: 0.6,
          }}
        >
          쓰기
        </Link>
      </header>

      {/* 타이틀 */}
      <div className="pt-[20vh] pb-[8vh] text-center px-6">
        <motion.h1
          className="font-normal tracking-[0.2em]"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            color: "var(--text)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
        >
          무용한 것들의 아카이브
        </motion.h1>
        <motion.p
          className="mt-4 italic tracking-[0.3em] font-light"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
            color: "var(--text-faint)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          an archive of pointless joys
        </motion.p>
      </div>

      {/* 카드 그리드 */}
      <div className="max-w-[1200px] mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full border-t"
              style={{ borderColor: "var(--accent)" }}
            />
          </div>
        ) : cards.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p
              className="text-[0.95rem] font-light mb-4"
              style={{ color: "var(--text-faint)" }}
            >
              아직 아카이브가 비어 있습니다.
            </p>
            <p
              className="text-[0.85rem] font-light mb-12"
              style={{ color: "var(--text-faint)", opacity: 0.6 }}
            >
              첫 번째 카드를 만들어 보세요.
            </p>
            <Link
              href="/write"
              className="px-8 py-3 text-[0.85rem] tracking-[0.15em] font-light transition-all duration-300"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--text)",
                borderBottom: "1px solid var(--accent)",
              }}
            >
              나의 답을 적어보기
            </Link>
          </motion.div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                className="mb-6 break-inside-avoid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease,
                }}
              >
                <Link href={`/card/${card.id}`} className="block group">
                  <div className="transition-transform duration-500 group-hover:scale-[1.02]">
                    <CardRenderer data={card} animate={false} />
                  </div>
                  <div className="mt-3 px-1">
                    <p
                      className="text-[0.75rem] font-light truncate"
                      style={{
                        color: "var(--text-faint)",
                        wordBreak: "keep-all",
                      }}
                    >
                      &ldquo;{card.answer}&rdquo;
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      {card.nickname && (
                        <span
                          className="text-[0.7rem] italic"
                          style={{
                            fontFamily: "var(--font-display)",
                            color: "var(--text-faint)",
                            opacity: 0.6,
                          }}
                        >
                          {card.nickname}
                        </span>
                      )}
                      <span
                        className="text-[0.65rem]"
                        style={{
                          color: "var(--text-faint)",
                          opacity: 0.4,
                        }}
                      >
                        {new Date(card.createdAt).toLocaleDateString("ko-KR", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 푸터 */}
      <footer
        className="text-center pb-16 text-[0.75rem] tracking-[0.2em]"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--text-faint)",
          opacity: 0.4,
        }}
      >
        pointless joy
      </footer>
    </div>
  );
}
