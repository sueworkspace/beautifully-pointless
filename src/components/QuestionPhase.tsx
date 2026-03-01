"use client";

import { motion } from "framer-motion";
import { useState, useRef, useMemo } from "react";
import { generateNickname } from "@/lib/nickname";

const sampleAnswers = [
  { nickname: "졸린펭귄", answer: "비 오는 날 창밖 바라보기" },
  { nickname: "빨간딸기", answer: "고양이 발바닥 젤리" },
  { nickname: "금빛수달", answer: "쓸모없는 예쁜 돌멩이 줍기" },
  { nickname: "느린거북이", answer: "해 질 녘 하늘 색 변화" },
  { nickname: "보라앵두", answer: "오래된 LP판 잡음" },
  { nickname: "신난토끼", answer: "뽁뽁이 터뜨리기" },
  { nickname: "하얀고래", answer: "밤하늘에 별 세기" },
  { nickname: "초록여우", answer: "낙엽 밟는 소리" },
  { nickname: "파란사슴", answer: "쓰지 않는 예쁜 노트 모으기" },
  { nickname: "분홍곰", answer: "구름 모양 상상하기" },
  { nickname: "은빛참새", answer: "새벽 공기 한 모금" },
  { nickname: "노란판다", answer: "오래된 동전 수집" },
];

interface QuestionPhaseProps {
  onSubmit: (answer: string, nickname: string) => void;
}

export default function QuestionPhase({ onSubmit }: QuestionPhaseProps) {
  const [nickname, setNickname] = useState("");
  const [answer, setAnswer] = useState("");
  const [focused, setFocused] = useState(false);
  const [nicknameFocused, setNicknameFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 마운트 시 한 번만 섞어서 고정
  const shuffled = useMemo(() => {
    const arr = [...sampleAnswers];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const canSubmit = nickname.trim() && answer.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "linear" }}
    >
      <div className="w-full max-w-[520px]">
        {/* NES 다이얼로그 프레임 */}
        <div className="pixel-frame p-5 md:p-10">
          {/* 질문 */}
          <motion.h1
            className="pixel-heading text-center"
            style={{ marginTop: "40px", marginBottom: "20px", fontSize: "32px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.1 }}
          >
            나를 기쁘게 하는
            <br />
            아름답지만
            <br />
            <span style={{ color: "var(--pixel-cyan)" }}>무용한 것은?</span>
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
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="당신의 답을 적어주세요..."
              rows={3}
              maxLength={500}
              className="w-full resize-none outline-none"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "16px",
                lineHeight: 1.8,
                color: "var(--pixel-white)",
                background: "var(--pixel-bg)",
                border: focused
                  ? "2px solid var(--pixel-blue)"
                  : "2px solid var(--pixel-dark-gray)",
                caretColor: "var(--pixel-green)",
                padding: "12px",
                imageRendering: "auto",
                WebkitFontSmoothing: "none",
              }}
            />

            {/* 닉네임 입력 */}
            <div style={{ display: "flex", gap: "8px", marginTop: "12px", alignItems: "stretch" }}>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onFocus={() => setNicknameFocused(true)}
                onBlur={() => setNicknameFocused(false)}
                placeholder="닉네임을 입력하세요"
                maxLength={20}
                className="outline-none"
                style={{
                  flex: 1,
                  fontFamily: "var(--font-pixel)",
                  fontSize: "14px",
                  lineHeight: 1.8,
                  color: "var(--pixel-white)",
                  background: "var(--pixel-bg)",
                  border: nicknameFocused
                    ? "2px solid var(--pixel-blue)"
                    : "2px solid var(--pixel-dark-gray)",
                  caretColor: "var(--pixel-green)",
                  padding: "10px 12px",
                  imageRendering: "auto",
                  WebkitFontSmoothing: "none",
                }}
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
                title="랜덤 닉네임 생성"
              >
                랜덤
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
                시작 &gt;
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* 힌트 — 모바일에서는 숨김 */}
        <p
          className="pixel-label text-center mt-4 hidden md:block"
          style={{ color: "var(--pixel-dark-gray)" }}
        >
          Ctrl+Enter to submit
        </p>
      </div>

      {/* 다른 사람들의 답변 티커 */}
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
          다른 사람들의 무용한 기쁨
        </p>
        <div style={{ overflow: "hidden", maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <div className="marquee-track" style={{ gap: "32px" }}>
            {[...shuffled, ...shuffled].map((item, i) => (
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
    </motion.div>
  );
}
