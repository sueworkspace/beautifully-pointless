"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/context";

/* NES 스타일 5블록 순차 펄스 */
function PixelBlocks() {
  const [activeIdx, setActiveIdx] = useState(0);
  const idxRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % 5;
      setActiveIdx(idxRef.current);
    }, 300);
    return () => clearInterval(id);
  }, []);

  const colors = [
    "var(--pixel-blue)",
    "var(--pixel-cyan)",
    "var(--pixel-green)",
    "var(--pixel-gold)",
    "var(--pixel-pink)",
  ];

  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
      {colors.map((color, i) => (
        <div
          key={i}
          style={{
            width: "10px",
            height: "10px",
            background: i === activeIdx ? color : "var(--pixel-dark-gray)",
            transition: "background 0.1s",
          }}
        />
      ))}
    </div>
  );
}

export default function LoadingPhase() {
  const [dots, setDots] = useState("");
  const dotsRef = useRef(0);
  const { t } = useTranslation();

  useEffect(() => {
    const id = setInterval(() => {
      dotsRef.current = (dotsRef.current + 1) % 4;
      setDots(".".repeat(dotsRef.current));
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="phase-content min-h-screen flex flex-col justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "linear" }}
    >
      <PixelBlocks />
      <p
        className="pixel-body"
        style={{
          color: "var(--pixel-cyan)",
          fontSize: "16px",
          letterSpacing: "0.05em",
        }}
      >
        {t.loading}{dots}
      </p>
    </motion.div>
  );
}
