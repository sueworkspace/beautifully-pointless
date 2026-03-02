import { ImageResponse } from "next/og";

export const alt = "무용한 기쁨 — Pointless Joy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  // NES 팔레트 별 데이터 (시드 기반 고정 위치)
  const stars = [
    { x: 80, y: 50, s: 6, c: "#FCFCFC" },
    { x: 200, y: 120, s: 4, c: "#3CBCFC" },
    { x: 350, y: 80, s: 6, c: "#FCE030" },
    { x: 500, y: 40, s: 4, c: "#9878FC" },
    { x: 700, y: 100, s: 6, c: "#FCFCFC" },
    { x: 850, y: 60, s: 4, c: "#3CBCFC" },
    { x: 1000, y: 90, s: 6, c: "#FCE030" },
    { x: 1100, y: 50, s: 4, c: "#FCFCFC" },
    { x: 150, y: 200, s: 4, c: "#9878FC" },
    { x: 1050, y: 180, s: 4, c: "#FF6E9C" },
    { x: 50, y: 400, s: 4, c: "#3CBCFC" },
    { x: 300, y: 500, s: 6, c: "#FCFCFC" },
    { x: 900, y: 520, s: 4, c: "#FCE030" },
    { x: 1130, y: 450, s: 6, c: "#9878FC" },
    { x: 600, y: 560, s: 4, c: "#FCFCFC" },
  ];

  // 중앙 sparkle 픽셀 (큰 버전)
  const P = 12;
  const cx = 540; // center X offset
  const cy = 180; // center Y offset
  const sparkle = [
    { x: 5, y: 0, c: "#3CBCFC" },
    { x: 5, y: 1, c: "#58D8D8" },
    { x: 0, y: 5, c: "#3CBCFC" },
    { x: 1, y: 5, c: "#58D8D8" },
    { x: 2, y: 3, c: "#FCFCFC" },
    { x: 3, y: 3, c: "#FCFCFC" },
    { x: 4, y: 3, c: "#FCFCFC" },
    { x: 5, y: 3, c: "#FCFCFC" },
    { x: 6, y: 3, c: "#FCFCFC" },
    { x: 7, y: 3, c: "#FCFCFC" },
    { x: 8, y: 3, c: "#FCFCFC" },
    { x: 2, y: 4, c: "#FCFCFC" },
    { x: 3, y: 4, c: "#F8B800" },
    { x: 4, y: 4, c: "#FCFCFC" },
    { x: 5, y: 4, c: "#F8B800" },
    { x: 6, y: 4, c: "#FCFCFC" },
    { x: 7, y: 4, c: "#F8B800" },
    { x: 8, y: 4, c: "#FCFCFC" },
    { x: 2, y: 5, c: "#FCFCFC" },
    { x: 3, y: 5, c: "#FCFCFC" },
    { x: 4, y: 5, c: "#F8B800" },
    { x: 5, y: 5, c: "#FCFCFC" },
    { x: 6, y: 5, c: "#F8B800" },
    { x: 7, y: 5, c: "#FCFCFC" },
    { x: 8, y: 5, c: "#FCFCFC" },
    { x: 2, y: 6, c: "#FCFCFC" },
    { x: 3, y: 6, c: "#F8B800" },
    { x: 4, y: 6, c: "#FCFCFC" },
    { x: 5, y: 6, c: "#F8B800" },
    { x: 6, y: 6, c: "#FCFCFC" },
    { x: 7, y: 6, c: "#F8B800" },
    { x: 8, y: 6, c: "#FCFCFC" },
    { x: 2, y: 7, c: "#FCFCFC" },
    { x: 3, y: 7, c: "#FCFCFC" },
    { x: 4, y: 7, c: "#FCFCFC" },
    { x: 5, y: 7, c: "#FCFCFC" },
    { x: 6, y: 7, c: "#FCFCFC" },
    { x: 7, y: 7, c: "#FCFCFC" },
    { x: 8, y: 7, c: "#FCFCFC" },
    { x: 9, y: 5, c: "#58D8D8" },
    { x: 10, y: 5, c: "#3CBCFC" },
    { x: 5, y: 8, c: "#58D8D8" },
    { x: 5, y: 9, c: "#3CBCFC" },
    // 장식
    { x: 1, y: 1, c: "#9878FC" },
    { x: 9, y: 1, c: "#FF6E9C" },
    { x: 1, y: 9, c: "#FF6E9C" },
    { x: 10, y: 9, c: "#9878FC" },
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
        }}
      >
        {/* 별 */}
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

        {/* 중앙 sparkle 픽셀아트 */}
        {sparkle.map((p, i) => (
          <div
            key={`p${i}`}
            style={{
              position: "absolute",
              left: cx + p.x * P,
              top: cy + p.y * P,
              width: P,
              height: P,
              background: p.c,
            }}
          />
        ))}

        {/* 타이틀 */}
        <div
          style={{
            position: "absolute",
            bottom: 160,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p
            style={{
              fontSize: "56px",
              color: "#FCFCFC",
              textShadow: "3px 3px 0 rgba(0,0,0,0.6)",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            무용한 기쁨
          </p>
        </div>

        {/* 서브타이틀 */}
        <div
          style={{
            position: "absolute",
            bottom: 100,
            display: "flex",
          }}
        >
          <p
            style={{
              fontSize: "22px",
              color: "#58D8D8",
              margin: 0,
            }}
          >
            나를 기쁘게 하는 아름답지만 무용한 것은?
          </p>
        </div>

        {/* 하단 라벨 */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#4A4A5A",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            POINTLESS JOY
          </p>
        </div>

        {/* 스캔라인 오버레이 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
