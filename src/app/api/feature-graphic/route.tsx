import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const W = 1024;
  const H = 500;

  const fontData = await fetch(
    "https://cdn.jsdelivr.net/npm/galmuri/dist/Galmuri14.ttf"
  ).then((res) => res.arrayBuffer());

  // 별빛 (NES 팔레트, 1024×500 비율에 맞춤)
  const stars = [
    { x: 50, y: 30, s: 4, c: "#FCFCFC" },
    { x: 150, y: 80, s: 3, c: "#3CBCFC" },
    { x: 290, y: 45, s: 4, c: "#9878FC" },
    { x: 440, y: 25, s: 3, c: "#FCFCFC" },
    { x: 600, y: 60, s: 4, c: "#FCE030" },
    { x: 750, y: 35, s: 3, c: "#FCFCFC" },
    { x: 870, y: 55, s: 4, c: "#3CBCFC" },
    { x: 970, y: 30, s: 3, c: "#58D8D8" },
    { x: 80, y: 150, s: 3, c: "#FF6E9C" },
    { x: 920, y: 130, s: 3, c: "#9878FC" },
    { x: 40, y: 320, s: 3, c: "#3CBCFC" },
    { x: 200, y: 420, s: 4, c: "#FCFCFC" },
    { x: 800, y: 440, s: 3, c: "#FCE030" },
    { x: 960, y: 360, s: 4, c: "#FCFCFC" },
    { x: 640, y: 460, s: 3, c: "#9878FC" },
    { x: 350, y: 380, s: 3, c: "#58D8D8" },
    { x: 500, y: 450, s: 4, c: "#FF6E9C" },
  ];

  // 커서 픽셀아트 (좌측 배치)
  const P = 16;
  const cx = 280;
  const cy = 200;

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
          width: `${W}px`,
          height: `${H}px`,
          background: "#0F0F23",
          display: "flex",
          flexDirection: "row",
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

        {/* 텍스트 (우측 배치) */}
        <div
          style={{
            position: "absolute",
            right: 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "4px",
          }}
        >
          <p
            style={{
              fontSize: "48px",
              color: "#FCFCFC",
              textShadow: "2px 2px 0 rgba(0,0,0,0.5)",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            무용한 기쁨
          </p>
          <p
            style={{
              fontSize: "22px",
              color: "#58D8D8",
              textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
              margin: 0,
              marginTop: "8px",
              lineHeight: 1.5,
            }}
          >
            나를 기쁘게 하는
          </p>
          <p
            style={{
              fontSize: "22px",
              color: "#58D8D8",
              textShadow: "1px 1px 0 rgba(0,0,0,0.5)",
              margin: 0,
              lineHeight: 1.5,
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
      width: W,
      height: H,
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
