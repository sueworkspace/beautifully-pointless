"use client";

import { motion } from "framer-motion";

interface ArtPhaseProps {
  generatedText: string;
  nickname: string;
  onNewWrite: () => void;
  onArchive: () => void;
}

export default function ArtPhase({
  generatedText,
  nickname,
  onNewWrite,
  onArchive,
}: ArtPhaseProps) {
  return (
    <motion.div
      className="phase-content min-h-screen flex flex-col justify-end items-center pointer-events-none pb-8 md:pb-12"
      style={{ padding: "0 20px", paddingBottom: "32px" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "linear" }}
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
            marginBottom: "40px",
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
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 md:gap-4 items-center justify-center flex-col min-[481px]:flex-row">
          <button onClick={onNewWrite} className="pixel-btn" style={{ minWidth: "120px" }}>
            다시 쓰기
          </button>
          <span
            className="hidden md:inline"
            style={{
              color: "var(--pixel-dark-gray)",
              fontFamily: "var(--font-pixel)",
              fontSize: "12px",
            }}
          >
            &gt;&gt;&gt;
          </span>
          <button onClick={onArchive} className="pixel-btn" style={{ minWidth: "120px" }}>
            아카이브
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
