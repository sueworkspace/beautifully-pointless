"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import Link from "next/link";
import CardRenderer, { type CardData, type CardType } from "@/components/CardRenderer";

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: d, ease },
  }),
};

type Step = "write" | "loading" | "result";

const CARD_TYPE_LABELS: Record<CardType, { ko: string; en: string }> = {
  postcard: { ko: "엽서", en: "Postcard" },
  card: { ko: "카드", en: "Card" },
  typography: { ko: "타이포그래피", en: "Typography" },
};

const COLOR_OPTIONS = [
  { key: "cream", label: "크림", color: "var(--card-cream)" },
  { key: "sage", label: "세이지", color: "var(--card-sage)" },
  { key: "sky", label: "스카이", color: "var(--card-sky)" },
  { key: "blush", label: "블러쉬", color: "var(--card-blush)" },
  { key: "lavender", label: "라벤더", color: "var(--card-lavender)" },
];

export default function WritePage() {
  const [step, setStep] = useState<Step>("write");
  const [answer, setAnswer] = useState("");
  const [nickname, setNickname] = useState("");
  const [cardType, setCardType] = useState<CardType>("postcard");
  const [colorTheme, setColorTheme] = useState("cream");
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setStep("loading");
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answer: answer.trim(),
          nickname: nickname.trim() || undefined,
          cardType,
          colorTheme,
        }),
      });

      if (!res.ok) throw new Error("생성에 실패했습니다.");

      const data = await res.json();
      // localStorage에 저장 (MVP: DB 대체)
      localStorage.setItem(`card-${data.id}`, JSON.stringify(data));
      setCardData(data);
      setStep("result");
    } catch {
      setError("카드 생성 중 문제가 발생했습니다. 다시 시도해 주세요.");
      setStep("write");
    }
  };

  const handleReset = () => {
    setStep("write");
    setCardData(null);
    setAnswer("");
    setError("");
  };

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center">
        <Link
          href="/"
          className="text-[0.8rem] tracking-[0.2em] transition-opacity hover:opacity-100"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-faint)",
            opacity: 0.6,
          }}
        >
          pointless joy
        </Link>
        <Link
          href="/archive"
          className="text-[0.75rem] tracking-[0.1em] italic transition-opacity hover:opacity-100"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-faint)",
            opacity: 0.5,
          }}
        >
          archive
        </Link>
      </header>

      <AnimatePresence mode="wait">
        {/* ========== 쓰기 단계 ========== */}
        {step === "write" && (
          <motion.div
            key="write"
            className="min-h-screen flex flex-col justify-center items-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full max-w-[560px]">
              {/* 질문 */}
              <motion.div
                className="text-center mb-16"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.3}
              >
                <p
                  className="text-[0.85rem] mb-6"
                  style={{ color: "var(--text-faint)" }}
                >
                  스승님이 물었다.
                </p>
                <p
                  className="font-normal leading-[2]"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                    color: "var(--text)",
                  }}
                >
                  나를 기쁘게 하는
                  <br />
                  아름답지만 무용한 것은?
                </p>
              </motion.div>

              {/* 텍스트 입력 */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.6}
              >
                <textarea
                  ref={textareaRef}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="당신의 답을 적어주세요..."
                  rows={5}
                  maxLength={500}
                  className="w-full resize-none border-0 border-b bg-transparent px-0 py-4 text-[1rem] leading-[2] outline-none placeholder:font-light"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 300,
                    color: "var(--text)",
                    borderColor: "var(--line)",
                    caretColor: "var(--accent)",
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span
                    className="text-[0.75rem]"
                    style={{ color: "var(--text-faint)" }}
                  >
                    {answer.length}/500
                  </span>
                </div>
              </motion.div>

              {/* 닉네임 */}
              <motion.div
                className="mt-10"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.8}
              >
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="이름 또는 닉네임 (선택)"
                  maxLength={50}
                  className="w-full border-0 border-b bg-transparent px-0 py-3 text-[0.9rem] outline-none placeholder:font-light"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 300,
                    color: "var(--text)",
                    borderColor: "var(--line)",
                    caretColor: "var(--accent)",
                  }}
                />
              </motion.div>

              {/* 카드 타입 선택 */}
              <motion.div
                className="mt-12"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1.0}
              >
                <p
                  className="text-[0.8rem] mb-4 tracking-[0.1em]"
                  style={{ color: "var(--text-faint)" }}
                >
                  카드 형태
                </p>
                <div className="flex gap-4">
                  {(Object.keys(CARD_TYPE_LABELS) as CardType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setCardType(type)}
                      className="px-5 py-2.5 text-[0.8rem] tracking-[0.05em] transition-all duration-300"
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontWeight: cardType === type ? 400 : 300,
                        color:
                          cardType === type
                            ? "var(--text)"
                            : "var(--text-faint)",
                        borderBottom:
                          cardType === type
                            ? "1px solid var(--accent)"
                            : "1px solid transparent",
                      }}
                    >
                      {CARD_TYPE_LABELS[type].ko}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* 색상 선택 */}
              {cardType !== "typography" && (
                <motion.div
                  className="mt-10"
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={1.2}
                >
                  <p
                    className="text-[0.8rem] mb-4 tracking-[0.1em]"
                    style={{ color: "var(--text-faint)" }}
                  >
                    색상
                  </p>
                  <div className="flex gap-3">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setColorTheme(c.key)}
                        className="w-8 h-8 rounded-full transition-all duration-300"
                        style={{
                          background: c.color,
                          boxShadow:
                            colorTheme === c.key
                              ? "0 0 0 2px var(--bg), 0 0 0 3px var(--accent)"
                              : "0 0 0 1px var(--line)",
                        }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 에러 메시지 */}
              {error && (
                <p className="mt-6 text-[0.85rem]" style={{ color: "#C47070" }}>
                  {error}
                </p>
              )}

              {/* 제출 버튼 */}
              <motion.div
                className="mt-14 text-center"
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1.4}
              >
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
                  className="px-10 py-4 text-[0.9rem] tracking-[0.15em] font-light transition-all duration-500 hover:tracking-[0.25em] disabled:opacity-30"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: "var(--text)",
                    borderBottom: "1px solid var(--accent)",
                    background: "transparent",
                    cursor: answer.trim() ? "pointer" : "default",
                  }}
                >
                  카드 만들기
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ========== 로딩 단계 ========== */}
        {step === "loading" && (
          <motion.div
            key="loading"
            className="min-h-screen flex flex-col justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full border-t"
              style={{ borderColor: "var(--accent)" }}
            />
            <p
              className="mt-8 text-[0.85rem] font-light"
              style={{ color: "var(--text-faint)" }}
            >
              당신의 무용한 것을 아름답게 만드는 중...
            </p>
          </motion.div>
        )}

        {/* ========== 결과 단계 ========== */}
        {step === "result" && cardData && (
          <motion.div
            key="result"
            className="min-h-screen flex flex-col justify-center items-center px-6 py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 카드 렌더링 */}
            <div className="w-full max-w-[440px]">
              <CardRenderer data={cardData} />
            </div>

            {/* 원본 답변 */}
            <motion.p
              className="mt-12 max-w-[440px] text-center text-[0.85rem] leading-[1.8] font-light"
              style={{ color: "var(--text-faint)", wordBreak: "keep-all" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              &ldquo;{cardData.answer}&rdquo;
            </motion.p>

            {/* 액션 버튼 */}
            <motion.div
              className="mt-12 flex gap-8 items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <button
                onClick={handleReset}
                className="text-[0.8rem] tracking-[0.1em] font-light transition-opacity hover:opacity-100"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--text-faint)",
                  opacity: 0.6,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                다시 적기
              </button>

              <Link
                href={`/card/${cardData.id}`}
                className="text-[0.85rem] tracking-[0.1em] font-light px-6 py-3 transition-all duration-300"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--text)",
                  borderBottom: "1px solid var(--accent)",
                }}
              >
                카드 보기
              </Link>

              <Link
                href="/archive"
                className="text-[0.8rem] tracking-[0.1em] italic font-light transition-opacity hover:opacity-100"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--text-faint)",
                  opacity: 0.6,
                }}
              >
                아카이브
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
