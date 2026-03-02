"use client";

import { motion } from "framer-motion";

interface IntroPhaseProps {
  onEnter: () => void;
}

const MARQUEE_TEXT = "POINTLESS JOY * 무용한 기쁨 * BEAUTIFUL USELESSNESS * 아름답지만 무용한 것 * ";

export default function IntroPhase({ onEnter }: IntroPhaseProps) {
  return (
    <motion.div
      className="phase-content h-screen flex flex-col justify-center cursor-pointer select-none overflow-hidden"
      onClick={onEnter}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "linear" }}
    >
      {/* 상단 마퀴 */}
      <motion.div
        className="absolute top-0 left-0 w-full overflow-hidden py-3"
        style={{ borderBottom: "2px solid var(--pixel-dark-gray)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.15 }}
      >
        <div className="marquee-track">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="pixel-label"
              style={{ color: "var(--pixel-dark-gray)", letterSpacing: "0.3em" }}
            >
              {MARQUEE_TEXT.repeat(4)}
            </span>
          ))}
        </div>
      </motion.div>

      {/* 좌상단 라벨 */}
      <motion.div
        className="absolute top-12 left-6 md:left-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.15 }}
      >
        <p className="pixel-label" style={{ color: "var(--pixel-dark-gray)" }}>
          EST. 2026
        </p>
      </motion.div>

      {/* 우상단 라벨 */}
      <motion.div
        className="absolute top-12 right-6 md:right-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.15 }}
      >
        <p className="pixel-label" style={{ color: "var(--pixel-dark-gray)" }}>
          VOL. 001
        </p>
      </motion.div>

      {/* 메인 타이틀 */}
      <div className="px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: 0.1 }}
        >
          <h1 className="pixel-title hover-flash-text" style={{ display: "inline-block" }}>
            무용한
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: 0.2 }}
        >
          <h1
            className="pixel-title hover-glitch"
            style={{
              color: "var(--pixel-red)",
              paddingLeft: "48px",
              display: "inline-block",
              textShadow: "0 0 20px rgba(228, 0, 88, 0.4), 2px 2px 0 rgba(0, 0, 0, 0.6)",
            }}
          >
            기쁨
          </h1>
        </motion.div>

        {/* 서브 텍스트 */}
        <motion.div
          className="mt-6"
          style={{ paddingLeft: "48px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.15 }}
        >
          <div className="pixel-divider mb-4" style={{ maxWidth: "120px" }} />
          <p className="pixel-body" style={{ color: "var(--pixel-gray)" }}>
            나를 기쁘게 하는
            <br />
            아름답지만 무용한 것은?
          </p>
        </motion.div>
      </div>

      {/* 하단 — 엔터 힌트 */}
      <motion.div
        className="absolute bottom-12 left-6 md:left-10 right-6 md:right-10 flex justify-between items-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.15 }}
      >
        <div>
          <p className="pixel-label" style={{ color: "var(--pixel-dark-gray)" }}>
            CLICK ANYWHERE
          </p>
          <p className="pixel-label mt-1" style={{ color: "var(--pixel-dark-gray)" }}>
            TO BEGIN<span className="blink">_</span>
          </p>
        </div>

        <p className="pixel-label hidden md:block" style={{ color: "var(--pixel-dark-gray)" }}>
          ON BEAUTIFUL USELESSNESS
        </p>
      </motion.div>

      {/* 하단 마퀴 */}
      <motion.div
        className="absolute bottom-0 left-0 w-full overflow-hidden py-3"
        style={{ borderTop: "2px solid var(--pixel-dark-gray)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.15 }}
      >
        <div className="marquee-track" style={{ animationDirection: "reverse" }}>
          {[0, 1].map((i) => (
            <span
              key={i}
              className="pixel-label"
              style={{ color: "var(--pixel-dark-gray)", letterSpacing: "0.3em" }}
            >
              {MARQUEE_TEXT.repeat(4)}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
