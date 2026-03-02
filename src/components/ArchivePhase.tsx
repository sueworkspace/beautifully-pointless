"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import type { CardData } from "@/types";
import { useTranslation } from "@/lib/i18n/context";
import PixelModal from "@/components/PixelModal";

interface ArchivePhaseProps {
  onSelect: (card: CardData) => void;
  onBack: () => void;
  onNewWrite: () => void;
  isAdmin?: boolean;
  adminPassword?: string;
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
  isAdmin = false,
  adminPassword = "",
}: ArchivePhaseProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownedTokens, setOwnedTokens] = useState<Record<string, string>>({});
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    try {
      const tokens = JSON.parse(localStorage.getItem("deleteTokens") || "{}");
      setOwnedTokens(tokens);
    } catch {
      // localStorage 사용 불가 시 무시
    }
  }, []);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // 관리자이거나 본인 토큰이 있는 경우만
    if (!isAdmin && !ownedTokens[id]) return;
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTargetId) return;

    try {
      let res: Response;
      if (isAdmin) {
        // 관리자 삭제 — 토큰 불필요
        res = await fetch(`/api/cards?id=${deleteTargetId}&adminPassword=${encodeURIComponent(adminPassword)}`, { method: "DELETE" });
      } else {
        const token = ownedTokens[deleteTargetId];
        if (!token) return;
        res = await fetch(`/api/cards?id=${deleteTargetId}&token=${encodeURIComponent(token)}`, { method: "DELETE" });
      }

      if (res.ok) {
        setCards((prev) => prev.filter((c) => c.id !== deleteTargetId));
        if (ownedTokens[deleteTargetId]) {
          const updated = { ...ownedTokens };
          delete updated[deleteTargetId];
          setOwnedTokens(updated);
          localStorage.setItem("deleteTokens", JSON.stringify(updated));
        }
      }
    } catch {
      // ignore
    }
    setDeleteTargetId(null);
  }, [deleteTargetId, ownedTokens, isAdmin, adminPassword]);

  // 전체 삭제 (관리자 전용)
  const handleDeleteAllConfirm = useCallback(async () => {
    setShowDeleteAll(false);
    try {
      const res = await fetch(`/api/cards?all=true&adminPassword=${encodeURIComponent(adminPassword)}`, { method: "DELETE" });
      if (res.ok) {
        setCards([]);
        setOwnedTokens({});
        localStorage.setItem("deleteTokens", "{}");
      }
    } catch {
      // ignore
    }
  }, [adminPassword]);

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
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* 헤더 */}
      <div className="pt-6 md:pt-8 pb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="pixel-label" style={{ color: "var(--pixel-dark-gray)" }}>
            {t.archiveLabel}
          </span>
          {isAdmin && (
            <span
              className="pixel-label"
              style={{
                color: "var(--pixel-gold)",
                fontSize: "10px",
                border: "1px solid var(--pixel-gold)",
                padding: "2px 6px",
              }}
            >
              ADMIN
            </span>
          )}
        </div>
        <button
          onClick={onBack}
          className="pixel-btn"
          style={{ fontSize: "11px", padding: "4px 12px" }}
        >
          {t.goBack}
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
          {t.archiveTitle1}
          <br />
          <span style={{ color: "var(--pixel-red)" }}>{t.archiveTitle2}</span>
        </h2>
        <div className="flex items-center gap-4 mt-3 md:mt-4">
          <p className="pixel-label" style={{ color: "var(--pixel-dark-gray)" }}>
            {t.records(cards.length)}
          </p>
          {isAdmin && cards.length > 0 && (
            <button
              onClick={() => setShowDeleteAll(true)}
              className="pixel-btn"
              style={{
                fontSize: "10px",
                padding: "4px 10px",
                minHeight: "auto",
                background: "var(--pixel-red)",
                borderColor: "var(--pixel-red)",
                color: "var(--pixel-white)",
              }}
            >
              전체 삭제
            </button>
          )}
        </div>
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
            {t.noRecords}
          </p>
          <p className="pixel-body mb-8" style={{ color: "var(--pixel-dark-gray)" }}>
            {t.noRecordsHint}
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
            {t.firstRecord}
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
                className="text-left cursor-pointer hover-flash-border archive-card"
                style={{
                  background: "var(--pixel-bg-alt)",
                  padding: "14px",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.1 }}
                whileHover={{ backgroundColor: "rgba(26, 26, 46, 1)" }}
              >
                {/* 넘버링 + 날짜 */}
                <div className="flex justify-between items-center mb-3">
                  <span className="pixel-label" style={{ color: "var(--pixel-gold)" }}>
                    NO.{String(cards.length - index).padStart(3, "0")}
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
                      {t.view}
                    </span>
                    {(isAdmin || ownedTokens[card.id]) && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => handleDeleteClick(e, card.id)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleDeleteClick(e as unknown as React.MouseEvent, card.id); }}
                        className="pixel-label p-1"
                        style={{ color: isAdmin ? "var(--pixel-red)" : "var(--pixel-dark-gray)", cursor: "pointer", fontSize: "13px" }}
                      >
                        X
                      </span>
                    )}
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
              {t.newWrite}
            </button>
          </motion.div>
        </>
      )}

      {/* 개별 삭제 확인 모달 */}
      <PixelModal
        open={!!deleteTargetId}
        message={t.deleteConfirm}
        confirmLabel={t.delete}
        cancelLabel={t.cancel}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
        variant="confirm"
      />

      {/* 전체 삭제 확인 모달 (관리자) */}
      <PixelModal
        open={showDeleteAll}
        title="ADMIN"
        message={`전체 ${cards.length}개의 기록을 삭제합니다.`}
        confirmLabel="전체 삭제"
        cancelLabel={t.cancel}
        onConfirm={handleDeleteAllConfirm}
        onCancel={() => setShowDeleteAll(false)}
        variant="confirm"
      />
    </motion.div>
  );
}
