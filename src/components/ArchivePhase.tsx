"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import type { CardData } from "@/types";

interface ArchivePhaseProps {
  onSelect: (card: CardData) => void;
  onBack: () => void;
  onNewWrite: () => void;
}

/* 텍스트 기반 로딩 스피너 */
function PixelSpinner() {
  const frames = ["/", "-", "\\", "|"];
  const [frame, setFrame] = useState(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      frameRef.current = (frameRef.current + 1) % frames.length;
      setFrame(frameRef.current);
    }, 200);
    return () => clearInterval(id);
  }, [frames.length]);

  return (
    <span
      style={{
        fontFamily: "var(--font-pixel)",
        fontSize: "20px",
        color: "var(--pixel-gold)",
      }}
    >
      {frames[frame]} LOADING...
    </span>
  );
}

export default function ArchivePhase({
  onSelect,
  onBack,
  onNewWrite,
}: ArchivePhaseProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/cards?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCards((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetch("/api/cards")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCards(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      className="phase-content min-h-screen pb-8"
      style={{ paddingLeft: "20px", paddingRight: "20px", paddingBottom: "32px", background: "var(--pixel-bg)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "linear" }}
    >
      {/* 헤더 */}
      <div className="pt-6 md:pt-8 pb-4 flex justify-between items-center">
        <span className="pixel-label" style={{ color: "var(--pixel-dark-gray)" }}>
          03 / ARCHIVE
        </span>
        <button
          onClick={onBack}
          className="pixel-btn"
          style={{ fontSize: "11px", padding: "4px 12px" }}
        >
          &lt; 돌아가기
        </button>
      </div>

      {/* 디바이더 */}
      <div className="pixel-divider mb-6 md:mb-8" />

      {/* 타이틀 */}
      <motion.div
        className="mb-8 md:mb-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, delay: 0.1 }}
      >
        <h2 className="pixel-heading">
          무용한 것들의
          <br />
          <span style={{ color: "var(--pixel-red)" }}>아카이브</span>
        </h2>
        <p className="pixel-label mt-3 md:mt-4" style={{ color: "var(--pixel-dark-gray)" }}>
          {cards.length} RECORDS
        </p>
      </motion.div>

      {/* 카드 리스트 */}
      {loading ? (
        <div className="flex justify-center py-20">
          <PixelSpinner />
        </div>
      ) : cards.length === 0 ? (
        <motion.div
          className="py-16 md:py-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <p className="pixel-body mb-2" style={{ color: "var(--pixel-gray)" }}>
            아직 기록이 없습니다.
          </p>
          <p className="pixel-body mb-8" style={{ color: "var(--pixel-dark-gray)" }}>
            첫 번째 답을 적어보세요.
          </p>
          <button
            onClick={onNewWrite}
            className="pixel-btn"
            style={{
              background: "var(--pixel-red)",
              borderColor: "var(--pixel-red)",
              color: "var(--pixel-white)",
            }}
          >
            첫 기록 남기기 &gt;
          </button>
        </motion.div>
      ) : (
        <>
          {/* 카드 그리드 — 모바일 1열, 태블릿 2열, 데스크톱 3열 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {cards.map((card, index) => (
              <motion.button
                key={card.id}
                onClick={() => onSelect(card)}
                className="text-left cursor-pointer hover-flash-border"
                style={{
                  background: "var(--pixel-bg-alt)",
                  border: "2px solid var(--pixel-dark-gray)",
                  padding: "14px",
                  transition: "border-color 0.1s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--pixel-blue)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--pixel-dark-gray)"; }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.1 }}
                whileHover={{ backgroundColor: "rgba(26, 26, 46, 1)" }}
              >
                {/* 넘버링 + 날짜 */}
                <div className="flex justify-between items-center mb-3">
                  <span className="pixel-label" style={{ color: "var(--pixel-gold)" }}>
                    NO.{String(index + 1).padStart(3, "0")}
                  </span>
                  <span className="pixel-label" style={{ color: "var(--pixel-dark-gray)" }}>
                    {new Date(card.createdAt).toLocaleDateString("ko-KR", {
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>

                {/* 답변 */}
                <p
                  className="mb-2 line-clamp-2"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "13px",
                    color: "var(--pixel-white)",
                    lineHeight: 1.6,
                  }}
                >
                  {card.answer}
                </p>

                {/* 구분선 */}
                <div
                  style={{
                    borderTop: "1px solid var(--pixel-dark-gray)",
                    marginBottom: "8px",
                    opacity: 0.5,
                  }}
                />

                {/* 생성 텍스트 미리보기 */}
                <p
                  className="line-clamp-2 mb-3"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "11px",
                    color: "var(--pixel-dark-gray)",
                    lineHeight: 1.7,
                  }}
                >
                  {card.generatedText}
                </p>

                {/* 닉네임 + VIEW ART + 삭제 */}
                <div className="flex justify-between items-center">
                  {card.nickname && (
                    <span
                      className="pixel-label"
                      style={{ color: "var(--pixel-gray)", fontSize: "10px" }}
                    >
                      — {card.nickname}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="pixel-label hover-flash-text" style={{ color: "var(--pixel-blue)" }}>
                      보기 &gt;
                    </span>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => handleDelete(e, card.id)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleDelete(e as unknown as React.MouseEvent, card.id); }}
                      className="pixel-label p-1"
                      style={{ color: "var(--pixel-dark-gray)", cursor: "pointer", fontSize: "13px" }}
                    >
                      X
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* 하단 디바이더 */}
          <div className="pixel-divider mt-3 md:mt-4" />

          {/* 새 글 쓰기 */}
          <motion.div
            className="py-8 md:py-10 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button onClick={onNewWrite} className="pixel-btn hover-flash-text">
              + 새로 쓰기
            </button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
