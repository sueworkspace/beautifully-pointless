import { ImageResponse } from "next/og";
import { getCardById } from "@/lib/db";

export const alt = "무용한 기쁨 — 카드";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CardOGImage({ params }: Props) {
  const { id } = await params;
  const card = await getCardById(id);

  // Galmuri 픽셀 폰트 로드
  const fontData = await fetch(
    "https://cdn.jsdelivr.net/npm/galmuri/dist/Galmuri14.ttf"
  ).then((res) => res.arrayBuffer());

  // 카드 없으면 기본 OG
  const answer = card?.answer ?? "카드를 찾을 수 없습니다";
  const text = card?.generatedText ?? "";
  const nickname = card?.nickname ?? "";

  // 텍스트 길이 제한 (OG 이미지 공간)
  const displayAnswer = answer.length > 30 ? answer.slice(0, 30) + "…" : answer;
  const displayText = text.length > 80 ? text.slice(0, 80) + "…" : text;

  // 별빛
  const stars = [
    { x: 60, y: 40, s: 4, c: "#FCFCFC" },
    { x: 180, y: 100, s: 3, c: "#3CBCFC" },
    { x: 340, y: 60, s: 4, c: "#9878FC" },
    { x: 520, y: 35, s: 3, c: "#FCFCFC" },
    { x: 700, y: 80, s: 4, c: "#FCE030" },
    { x: 880, y: 50, s: 3, c: "#FCFCFC" },
    { x: 1020, y: 75, s: 4, c: "#3CBCFC" },
    { x: 1140, y: 40, s: 3, c: "#58D8D8" },
    { x: 100, y: 560, s: 3, c: "#FF6E9C" },
    { x: 1080, y: 580, s: 3, c: "#9878FC" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0F0F23",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "Galmuri14",
        }}
      >
        {/* 별빛 */}
        {stars.map((s, i) => (
          <div
            key={`s${i}`}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: s.s,
              height: s.s,
              background: s.c,
            }}
          />
        ))}

        {/* NES 프레임 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid #FCFCFC",
            background: "#1A1A2E",
            padding: "40px 60px",
            maxWidth: "1000px",
            boxShadow: "inset -4px -4px 0 #4A4A5A, inset 4px 4px 0 #A0A0B0, 4px 4px 0 rgba(0,0,0,0.5)",
          }}
        >
          {/* 답변 (크게) */}
          <p
            style={{
              fontSize: "40px",
              color: "#58D8D8",
              textAlign: "center",
              lineHeight: 1.5,
              margin: 0,
              marginBottom: "24px",
              textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
            }}
          >
            &ldquo;{displayAnswer}&rdquo;
          </p>

          {/* 생성 텍스트 (작게) */}
          {displayText && (
            <p
              style={{
                fontSize: "22px",
                color: "#A0A0B0",
                textAlign: "center",
                lineHeight: 1.8,
                margin: 0,
                marginBottom: "16px",
              }}
            >
              {displayText}
            </p>
          )}

          {/* 닉네임 */}
          {nickname && (
            <p
              style={{
                fontSize: "18px",
                color: "#4A4A5A",
                textAlign: "right",
                width: "100%",
                margin: 0,
              }}
            >
              — {nickname}
            </p>
          )}
        </div>

        {/* 하단 질문 + URL */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <p
            style={{
              fontSize: "20px",
              color: "#4A4A5A",
              margin: 0,
            }}
          >
            나를 기쁘게 하는 아름답지만 무용한 것은?
          </p>
          <p
            style={{
              fontSize: "16px",
              color: "#3CBCFC",
              margin: 0,
            }}
          >
            pointless-joy.vercel.app
          </p>
        </div>

        {/* 스캔라인 오버레이 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Galmuri14",
          data: fontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
