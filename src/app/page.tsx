"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

/* ===================================
   랜딩 페이지
   Apple식 풀스크린 히어로 + POV식 스크롤 스토리텔링
   =================================== */

/* 페이드인 애니메이션 variant */
const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, delay, ease },
  }),
};

/* 시 한 줄씩 등장하는 variant */
const lineReveal = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.2, ease },
  }),
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  /* 스크롤 진행률 바 너비 */
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef}>
      {/* 스크롤 프로그레스 바 */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] z-[999]"
        style={{
          width: progressWidth,
          background: "var(--accent)",
        }}
      />

      {/* 연도 사이드 노트 */}
      <div className="fixed right-8 bottom-8 text-xs tracking-[0.2em] opacity-40 hidden md:block"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--text-faint)",
          writingMode: "vertical-rl",
        }}
      >
        二〇二六
      </div>

      {/* 배경 플로팅 서클 */}
      <div className="fixed -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full opacity-[0.04] pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          animation: "floatSlow 20s ease-in-out infinite",
        }}
      />
      <div className="fixed -bottom-[100px] -left-[150px] w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
          animation: "floatSlow 25s ease-in-out infinite reverse",
        }}
      />

      {/* ========== 히어로 섹션 ========== */}
      <section className="h-screen flex flex-col justify-center items-center relative">
        <motion.h1
          className="text-center font-normal tracking-[0.15em]"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "var(--text)",
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
        >
          아름답지만 무용한 것
        </motion.h1>

        <motion.p
          className="mt-6 text-center tracking-[0.3em] italic font-light"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
            color: "var(--text-faint)",
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.5}
        >
          on beautiful uselessness
        </motion.p>

        {/* 스크롤 힌트 */}
        <motion.div
          className="absolute bottom-12"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2.5}
        >
          <span
            className="block w-[1px] h-10 mx-auto"
            style={{
              background: "var(--text-faint)",
              animation: "scrollPulse 2s ease infinite",
            }}
          />
        </motion.div>
      </section>

      {/* ========== 질문 섹션 ========== */}
      <div className="max-w-[680px] mx-auto px-8 md:px-4">
        <motion.section
          className="text-center py-[15vh] relative"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          custom={0}
        >
          <p
            className="text-[0.95rem] mb-12"
            style={{ color: "var(--text-light)" }}
          >
            스승님이 물었다.
          </p>
          <div className="relative inline-block">
            <div
              className="w-10 h-[1px] mx-auto mb-8"
              style={{ background: "var(--accent)" }}
            />
            <p
              className="font-normal leading-[2.2]"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(1.3rem, 3.5vw, 1.8rem)",
                color: "var(--text)",
              }}
            >
              나를 기쁘게 하는
              <br />
              아름답지만
              <br />
              무용한 것은?
            </p>
            <div
              className="w-10 h-[1px] mx-auto mt-8"
              style={{ background: "var(--accent)" }}
            />
          </div>
        </motion.section>

        {/* ========== 에세이 발췌 ========== */}
        <motion.section
          className="py-[8vh]"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          custom={0}
        >
          <p
            className="text-justify mb-7"
            style={{ wordBreak: "keep-all" }}
          >
            쉬운 질문 같았다. 석양, 꽃, 음악, 별빛 — 아름답지만 쓸모없는
            것들은 얼마든지 떠올릴 수 있으니까. 그런데 막상 답하려 하면
            이상한 일이 생긴다. 세 개의 조건이 동시에 성립하지 않는다.
          </p>
          <p
            className="text-justify mb-7"
            style={{ wordBreak: "keep-all" }}
          >
            무용한 것은 이름 붙이지 않는 동안에만 무용할 수 있다. 누군가
            그것을 알아보고, 아름답다고 느끼고, 기쁘다고 말하는 순간, 그것은
            이미 그 사람의 세계 안에서 자리를 얻는다.
          </p>
        </motion.section>

        {/* 구분선 */}
        <Divider />

        <motion.section
          className="py-[8vh]"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          custom={0}
        >
          <p
            className="text-justify mb-7"
            style={{ wordBreak: "keep-all" }}
          >
            스승님은 아마 유용과 무용의 이분법을 따지라고 이 질문을 던진 것이
            아니었을 것이다. 우리가 살아가면서 이 질문의 답에 해당하는 것들을{" "}
            <span style={{ fontWeight: 400, color: "var(--accent-deep)" }}>
              더 많이 했으면 하는 마음에서
            </span>{" "}
            물으신 것이다.
          </p>
          <p
            className="text-justify mb-7"
            style={{ wordBreak: "keep-all" }}
          >
            멍하니 하늘을 보는 시간, 의미 없는 수다, 괜히 먼 길로 돌아가는
            산책 — 그런 것을 더 많이 하며 살라는 뜻이었을 것이다.
          </p>
        </motion.section>

        {/* 구분선 */}
        <Divider />

        {/* 핵심 문장 — 강조 */}
        <motion.section
          className="py-[8vh]"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          custom={0}
        >
          <p
            className="text-justify mb-7"
            style={{ wordBreak: "keep-all" }}
          >
            무용하지만 나를 기쁘게 하고 아름답기 때문에 좋아하거나 자주 하는
            것.{" "}
            <span style={{ fontWeight: 400, color: "var(--accent-deep)" }}>
              그것이 꾸미거나 포장할 수 없는, 그 사람의 진짜 모양이다.
            </span>
          </p>
        </motion.section>
      </div>

      {/* ========== 시 섹션 ========== */}
      <div
        className="relative py-[10vh] md:py-[10vh]"
        style={{ background: "var(--bg-warm)" }}
      >
        {/* 위아래 그라데이션 라인 */}
        <div
          className="absolute top-0 left-0 w-full h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--line), transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--line), transparent)",
          }}
        />

        <div className="max-w-[680px] mx-auto px-8 md:px-4">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <p
              className="text-center mb-16 italic tracking-[0.3em] text-[0.85rem]"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--text-faint)",
              }}
            >
              — 무 용 —
            </p>
          </motion.div>

          <div className="text-center leading-[2.4] text-[0.95rem]" style={{ color: "var(--text-light)" }}>
            <PoemStanza lines={["빼도 되는 말을 붙이는 건", "네가 다칠까 봐서였고"]} startIndex={0} />
            <PoemStanza lines={["돌아가도 되는 길을 걷는 건", "아직 끝내기 싫어서였고"]} startIndex={2} />
            <PoemStanza lines={["지나간 날을 자꾸 꺼내 보는 건", "거기 네가 웃고 있어서였다"]} startIndex={4} />
            <PoemStanza lines={["쓸모를 물으면 아무것도 아닌 것들이", "나를 여기까지 데려왔다"]} startIndex={6} />
            <PoemStanza lines={["가성비 없는 오후가 있었고", "생산적이지 않은 대화가 있었고", "아무 목적 없이 나란히 걷는 밤이 있었다"]} startIndex={8} />
            <PoemStanza lines={["아무것도 남기지 않았는데", "전부 남아 있다"]} startIndex={11} />
            <PoemStanza lines={["나는 아직 답하는 중이다", "답할 때마다 무용이 무너지고", "무너질 때마다 아름다워지므로"]} startIndex={13} />
          </div>
        </div>
      </div>

      {/* ========== 클로징 + CTA ========== */}
      <div className="max-w-[680px] mx-auto px-8 md:px-4">
        <motion.section
          className="text-center py-[15vh]"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          <p
            className="font-normal leading-[2.2]"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
              color: "var(--text)",
            }}
          >
            나를 기쁘게 하는
            <br />
            아름답지만 무용한 것은 무엇인가.
          </p>

          <p
            className="mt-16 text-[0.9rem] font-light"
            style={{ color: "var(--text-faint)" }}
          >
            어쩌면 우리 삶의 진정한 아름다움은
            <br />
            무용함에 있을지도 모른다.
          </p>

          {/* CTA 버튼 */}
          <motion.div
            className="mt-20"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.3}
          >
            <Link
              href="/write"
              className="inline-block px-10 py-4 text-[0.9rem] tracking-[0.15em] font-light transition-all duration-500 hover:tracking-[0.25em]"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--text)",
                borderBottom: "1px solid var(--accent)",
              }}
            >
              나의 답을 적어보기
            </Link>
          </motion.div>

          {/* 아카이브 링크 */}
          <motion.div
            className="mt-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.5}
          >
            <Link
              href="/archive"
              className="inline-block text-[0.85rem] tracking-[0.1em] transition-opacity duration-300 hover:opacity-100"
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                color: "var(--text-faint)",
                opacity: 0.6,
              }}
            >
              다른 사람들의 무용한 것들 보기
            </Link>
          </motion.div>
        </motion.section>

        {/* 푸터 */}
        <footer
          className="text-center pb-16 text-[0.75rem] tracking-[0.2em]"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--text-faint)",
            opacity: 0.4,
          }}
        >
          pointless joy
        </footer>
      </div>

      {/* 키프레임 스타일 */}
      <style jsx global>{`
        @keyframes floatSlow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 20px); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(1.3); }
        }
      `}</style>
    </div>
  );
}

/* ========== 서브 컴포넌트 ========== */

/* 구분선 (세 개의 점) */
function Divider() {
  return (
    <motion.div
      className="text-center py-[6vh]"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={0}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block w-[6px] h-[6px] rounded-full mx-3 opacity-60"
          style={{ background: "var(--accent)" }}
        />
      ))}
    </motion.div>
  );
}

/* 시 연(stanza) — 한 줄씩 등장 */
function PoemStanza({ lines, startIndex }: { lines: string[]; startIndex: number }) {
  return (
    <motion.div
      className="mb-10 last:mb-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
    >
      {lines.map((line, i) => (
        <motion.div key={i} variants={lineReveal} custom={startIndex + i}>
          {line}
        </motion.div>
      ))}
    </motion.div>
  );
}
