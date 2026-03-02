"use client";

import { motion } from "framer-motion";
import { useCallback } from "react";
import { useTranslation } from "@/lib/i18n/context";
import { shareArt } from "@/lib/share";

interface ArtPhaseProps {
  answer: string;
  generatedText: string;
  nickname: string;
  onNewWrite: () => void;
  onArchive: () => void;
}

export default function ArtPhase({
  answer,
  generatedText,
  nickname,
  onNewWrite,
  onArchive,
}: ArtPhaseProps) {
  const { t } = useTranslation();

  const handleShare = useCallback(async () => {
    await shareArt({
      answer,
      generatedText,
      nickname,
      title: t.shareTitle,
      shareText: t.shareText,
      fileName: t.downloadFileName,
    });
  }, [answer, generatedText, nickname, t]);

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
            marginBottom: "clamp(16px, 4vh, 40px)",
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

        {/* 버튼 */}
        <div className="flex gap-2 md:gap-4 items-center justify-center flex-col min-[481px]:flex-row">
          <button onClick={onNewWrite} className="pixel-btn" style={{ minWidth: "120px" }}>
            {t.rewrite}
          </button>
          <button onClick={handleShare} className="pixel-btn" style={{ minWidth: "120px" }}>
            {t.share}
          </button>
          <button onClick={onArchive} className="pixel-btn" style={{ minWidth: "120px" }}>
            {t.archive}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
