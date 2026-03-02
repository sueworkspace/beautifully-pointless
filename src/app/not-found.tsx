"use client";

import { useEffect, useState } from "react";
import type { CardData } from "@/types";
import { useTranslation } from "@/lib/i18n/context";

/* 깜빡이는 커서 */
function BlinkCursor() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ color: "var(--pixel-gold)", opacity: visible ? 1 : 0 }}>
      _
    </span>
  );
}

export default function NotFound() {
  const [card, setCard] = useState<CardData | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetch("/api/cards?mode=random")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCard(data[Math.floor(Math.random() * data.length)]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "var(--pixel-bg)", padding: "20px" }}
    >
      {/* 404 ASCII 아트 */}
      <div className="mb-6" style={{ textAlign: "center" }}>
        <pre
          className="pixel-title"
          style={{
            fontSize: "clamp(28px, 8vw, 64px)",
            color: "var(--pixel-red)",
            lineHeight: 1.1,
            letterSpacing: "0.1em",
          }}
        >
          404
        </pre>
      </div>

      {/* 메시지 */}
      <p
        className="pixel-body mb-2"
        style={{ color: "var(--pixel-gray)", textAlign: "center" }}
      >
        {t.pageNotFound}
      </p>
      <p
        className="pixel-body"
        style={{
          fontSize: "13px",
          color: "var(--pixel-dark-gray)",
          textAlign: "center",
          lineHeight: 1.8,
        }}
      >
        {t.notFoundMsg1}
        <br />
        {t.notFoundMsg2}
        <BlinkCursor />
      </p>

      {/* 돌아가기 버튼 */}
      <div style={{ paddingTop: "16px", paddingBottom: "16px" }}>
        <a
          href="/"
          className="pixel-btn hover-flash-text"
          style={{ textDecoration: "none" }}
        >
          {t.notFoundBack}
        </a>
      </div>

      {/* 랜덤 카드 */}
      {card && (
        <div className="w-full" style={{ maxWidth: "400px" }}>
          <div className="pixel-divider mb-6" />

          <p
            className="pixel-label mb-4"
            style={{ color: "var(--pixel-dark-gray)", textAlign: "center" }}
          >
            {t.notFoundLabel}
          </p>

          <a
            href="/"
            className="block archive-card"
            style={{
              background: "var(--pixel-bg-alt)",
              padding: "16px",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {/* 답변 */}
            <p
              className="pixel-body"
              style={{
                fontSize: "13px",
                color: "var(--pixel-white)",
                lineHeight: 1.7,
                marginBottom: "8px",
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

            {/* 생성 텍스트 */}
            <p
              className="pixel-body"
              style={{
                fontSize: "11px",
                color: "var(--pixel-gray)",
                lineHeight: 1.8,
                whiteSpace: "pre-line",
              }}
            >
              {card.generatedText}
            </p>

            {/* 닉네임 */}
            {card.nickname && (
              <p
                className="pixel-label mt-3"
                style={{ color: "var(--pixel-dark-gray)", textAlign: "right", fontSize: "10px" }}
              >
                — {card.nickname}
              </p>
            )}
          </a>
        </div>
      )}
    </div>
  );
}
