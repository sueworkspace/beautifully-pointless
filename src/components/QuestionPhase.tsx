"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { generateNickname } from "@/lib/nickname";
import { useTranslation } from "@/lib/i18n/context";

interface QuestionPhaseProps {
  onSubmit: (answer: string, nickname: string) => void;
  onArchive: () => void;
  onAdminTrigger: () => void;
}

export default function QuestionPhase({ onSubmit, onArchive, onAdminTrigger }: QuestionPhaseProps) {
  const [nickname, setNickname] = useState("");
  const [answer, setAnswer] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tickerItems, setTickerItems] = useState<{ nickname: string; answer: string }[]>([]);
  const [cardCount, setCardCount] = useState<number | null>(null);
  const { t } = useTranslation();

  // 질문 제목 트리플탭 감지 (관리자 모드)
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTitleClick = useCallback(() => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      onAdminTrigger();
      return;
    }

    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 1500);
  }, [onAdminTrigger]);

  // DB에서 랜덤 카드 + 카드 수 가져오기
  useEffect(() => {
    fetch("/api/cards?mode=random")
      .then((res) => res.json())
      .then((cards) => {
        if (Array.isArray(cards)) {
          setTickerItems(cards.map((c: { nickname: string; answer: string }) => ({
            nickname: c.nickname,
            answer: c.answer,
          })));
        }
      })
      .catch(() => {});

    fetch("/api/cards?mode=count")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.count === "number") setCardCount(data.count);
      })
      .catch(() => {});
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const canSubmit = nickname.trim() && answer.trim() && !submitting;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitting(true);
    onSubmit(answer.trim(), nickname.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      className="phase-content min-h-screen flex flex-col justify-center items-center"
      style={{ padding: "0 20px" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* 우측 상단 아카이브 버튼 */}
      <button
        onClick={onArchive}
        className="pixel-btn hover-flash-text"
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          fontSize: "11px",
          padding: "6px 12px",
          zIndex: 10,
          minHeight: "auto",
        }}
      >
        {t.archive}
      </button>

      <div className="w-full max-w-[520px]">
        {/* NES 다이얼로그 프레임 */}
        <div className="pixel-frame p-5 md:p-10">
          {/* 질문 — 트리플탭으로 관리자 모드 */}
          <motion.h1
            className="pixel-heading text-center"
            style={{ marginTop: "40px", marginBottom: "20px", fontSize: "32px", cursor: "default" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.1 }}
            onClick={handleTitleClick}
          >
            {t.questionLine1}
            <br />
            {t.questionLine2}
            <br />
            <span style={{ color: "var(--pixel-cyan)" }}>{t.questionLine3}</span>
          </motion.h1>

          {/* 답변 입력 필드 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.2 }}
          >
            <textarea
              ref={textareaRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.answerPlaceholder(cardCount)}
              rows={3}
              maxLength={500}
              className="pixel-textarea-field"
            />

            {/* 닉네임 입력 */}
            <div className="flex gap-2 mt-3 items-stretch flex-col min-[481px]:flex-row" style={{ width: "98%", margin: "0 auto" }}>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t.nicknamePlaceholder}
                maxLength={20}
                className="pixel-input-field"
              />
              <button
                type="button"
                onClick={() => setNickname(generateNickname())}
                className="pixel-btn"
                style={{
                  fontSize: "12px",
                  padding: "8px 12px",
                  whiteSpace: "nowrap",
                }}
                title={t.nicknameRandom}
              >
                {t.nicknameRandom}
              </button>
            </div>

            {/* 제출 버튼 */}
            <motion.div
              className="mt-6 text-center"
              animate={{ opacity: canSubmit ? 1 : 0 }}
              transition={{ duration: 0.1 }}
            >
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="pixel-btn"
                style={{
                  fontSize: "14px",
                  padding: "10px 24px",
                }}
              >
                {t.submit}
              </button>

              {/* 동의 안내 */}
              <p
                className="pixel-label"
                style={{
                  color: "var(--pixel-dark-gray)",
                  marginTop: "12px",
                  fontSize: "10px",
                  letterSpacing: "0.05em",
                  textTransform: "none",
                }}
              >
                {t.consentPrefix}
                <a href="/terms" target="_blank" style={{ color: "var(--pixel-blue)", textDecoration: "underline" }}>
                  {t.termsOfService}
                </a>
                {t.consentAnd}
                <a href="/privacy" target="_blank" style={{ color: "var(--pixel-blue)", textDecoration: "underline" }}>
                  {t.privacyPolicy}
                </a>
                {t.consentSuffix}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* 힌트 — 모바일에서는 숨김 */}
        <p
          className="pixel-label text-center mt-4 hidden md:block"
          style={{ color: "var(--pixel-dark-gray)" }}
        >
          {t.submitHint}
        </p>
      </div>

      {/* 다른 사람들의 답변 티커 — 데이터 없으면 숨김 */}
      {tickerItems.length > 0 && (
        <motion.div
          className="w-full max-w-[520px] mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          style={{ overflow: "hidden" }}
        >
          <p
            className="pixel-label mb-2"
            style={{ color: "var(--pixel-dark-gray)", textAlign: "center" }}
          >
            {t.tickerLabel}
          </p>
          <div style={{ overflow: "hidden", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
            <div className="marquee-track" style={{ gap: "32px" }}>
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "12px",
                    color: "var(--pixel-gray)",
                    whiteSpace: "nowrap",
                    padding: "0 16px",
                  }}
                >
                  <span style={{ color: "var(--pixel-cyan)" }}>{item.nickname}</span>
                  {" : "}
                  {item.answer}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
