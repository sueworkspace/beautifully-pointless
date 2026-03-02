import { ImageResponse } from "next/og";

export const alt = "무용한 기쁨 — 나를 기쁘게 하는 아름답지만 무용한 것은?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  // Galmuri 픽셀 폰트 로드
  const fontData = await fetch(
    "https://cdn.jsdelivr.net/npm/galmuri/dist/Galmuri14.ttf"
  ).then((res) => res.arrayBuffer());

  // 별빛 (작은 점, 앱 아이콘과 동일한 NES 팔레트)
  const stars = [
    { x: 60, y: 40, s: 4, c: "#FCFCFC" },
    { x: 180, y: 100, s: 3, c: "#3CBCFC" },
    { x: 340, y: 60, s: 4, c: "#9878FC" },
    { x: 520, y: 35, s: 3, c: "#FCFCFC" },
    { x: 700, y: 80, s: 4, c: "#FCE030" },
    { x: 880, y: 50, s: 3, c: "#FCFCFC" },
    { x: 1020, y: 75, s: 4, c: "#3CBCFC" },
    { x: 1140, y: 40, s: 3, c: "#58D8D8" },
    { x: 100, y: 180, s: 3, c: "#FF6E9C" },
    { x: 1080, y: 160, s: 3, c: "#9878FC" },
    { x: 50, y: 380, s: 3, c: "#3CBCFC" },
    { x: 250, y: 500, s: 4, c: "#FCFCFC" },
    { x: 950, y: 520, s: 3, c: "#FCE030" },
    { x: 1130, y: 430, s: 4, c: "#FCFCFC" },
    { x: 750, y: 560, s: 3, c: "#9878FC" },
  ];

  // 커서 픽셀아트 (앱 아이콘 반영)
  const P = 20;
  const cx = 750;
  const cy = 260;

  const glow = [
    { dx: -1, dy: -2, c: "#1A1A2E" },
    { dx: 0, dy: -2, c: "#1A1A2E" },
    { dx: 1, dy: -2, c: "#1A1A2E" },
    { dx: -2, dy: -1, c: "#1A1A2E" },
    { dx: -1, dy: -1, c: "#2A2A3E" },
    { dx: 0, dy: -1, c: "#2A2A3E" },
    { dx: 1, dy: -1, c: "#2A2A3E" },
    { dx: 2, dy: -1, c: "#1A1A2E" },
  ];

  const cursor = [
    { dx: -1, dy: 0, c: "#FCFCFC" },
    { dx: 0, dy: 0, c: "#FCFCFC" },
    { dx: 1, dy: 0, c: "#FCFCFC" },
  ];

  const reflect = [
    { dx: -2, dy: 1, c: "#1A1A2E" },
    { dx: -1, dy: 1, c: "#2A2A3E" },
    { dx: 0, dy: 1, c: "#2A2A3E" },
    { dx: 1, dy: 1, c: "#2A2A3E" },
    { dx: 2, dy: 1, c: "#1A1A2E" },
    { dx: -1, dy: 2, c: "#1A1A2E" },
    { dx: 0, dy: 2, c: "#1A1A2E" },
    { dx: 1, dy: 2, c: "#1A1A2E" },
  ];

  const cursorPixels = [...glow, ...cursor, ...reflect];

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

        {/* 커서 픽셀아트 */}
        {cursorPixels.map((p, i) => (
          <div
            key={`c${i}`}
            style={{
              position: "absolute",
              left: cx + p.dx * P,
              top: cy + p.dy * P,
              width: P,
              height: P,
              background: p.c,
            }}
          />
        ))}

        {/* 질문 (Galmuri 픽셀 폰트, 아래쪽 배치) */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <p
            style={{
              fontSize: "44px",
              color: "#58D8D8",
              textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
              margin: 0,
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            나를 기쁘게 하는
          </p>
          <p
            style={{
              fontSize: "44px",
              color: "#58D8D8",
              textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
              margin: 0,
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            아름답지만 무용한 것은?
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
