"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { shareArt } from "@/lib/share";
import { trackEvent } from "@/lib/analytics";

interface ArtPhaseProps {
  answer: string;
  generatedText: string;
  nickname: string;
  cardId: string | null;
  onNewWrite: () => void;
  onArchive: () => void;
}

export default function ArtPhase({
  answer,
  generatedText,
  nickname,
  cardId,
  onNewWrite,
  onArchive,
}: ArtPhaseProps) {
  const { t } = useTranslation();
  const [linkCopied, setLinkCopied] = useState(false);

  const handleShare = useCallback(async () => {
    trackEvent("share_click");
    const result = await shareArt({
      answer,
      generatedText,
      nickname,
      title: t.shareTitle,
      shareText: t.shareText,
      fileName: t.downloadFileName,
      cardId,
    });
    if (result === "copied") {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }, [answer, generatedText, nickname, cardId, t]);

  const handleLinkCopy = useCallback(async () => {
    if (!cardId) return;
    const url = `${window.location.origin}/card/${cardId}`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      trackEvent("link_copy", { card_id: cardId });
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // 클립보드 API 미지원 시 무시
    }
  }, [cardId]);

  return (
    <motion.div
      className="phase-content min-h-screen flex flex-col justify-end items-center pointer-events-none"
      style={{ padding: "0 20px", paddingBottom: "clamp(24px, 4vh, 48px)" }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        className="text-center pointer-events-auto w-full max-w-[420px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15, delay: 0.8 }}
      >
        {/* 시적 텍스트 */}
        <div
          className="pixel-frame"
          style={{
            background: "rgba(15, 15, 35, 0.85)",
            padding: "20px",
            marginBottom: "clamp(24px, 6vh, 56px)",
            border: "2px solid rgba(88, 216, 216, 0.3)",
          }}
        >
          <p
            className="pixel-body"
            style={{
              color: "var(--pixel-cyan)",
              wordBreak: "keep-all",
              whiteSpace: "pre-line",
              lineHeight: 2,
              fontSize: "14px",
            }}
          >
            {generatedText}
          </p>
          <p
            className="pixel-label"
            style={{
              color: "var(--pixel-gray)",
              textAlign: "right",
              marginTop: "12px",
              fontSize: "12px",
            }}
          >
            — {nickname}
          </p>
          {/* AI 생성 안내 */}
          <p
            className="pixel-label"
            style={{
              color: "var(--pixel-dark-gray)",
              textAlign: "center",
              marginTop: "16px",
              fontSize: "10px",
            }}
          >
            {t.aiDisclaimer}
          </p>
        </div>

        {/* 버튼 2×2 그리드 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", maxWidth: "280px", margin: "0 auto" }}>
          <button onClick={onNewWrite} className="pixel-btn" style={{ width: "100%" }}>
            {t.rewrite}
          </button>
          <button onClick={onArchive} className="pixel-btn" style={{ width: "100%" }}>
            {t.archive}
          </button>
          {cardId && (
            <button onClick={handleLinkCopy} className="pixel-btn" style={{ width: "100%" }}>
              {linkCopied ? t.linkCopied : t.linkCopy}
            </button>
          )}
          <button onClick={handleShare} className="pixel-btn" style={{ width: "100%" }}>
            {t.share}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
