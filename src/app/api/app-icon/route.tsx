import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const SIZE = 1024;
  const P = 64; // 16x16 grid
  const SP = 16; // 별 크기: 1/4

  const pixels: { x: number; y: number; w: number; c: string }[] = [];

  // 배경 별빛 (작은 점)
  const stars = [
    { x: 2, y: 1, c: "#FCFCFC" },
    { x: 13, y: 2, c: "#3CBCFC" },
    { x: 5, y: 3, c: "#9878FC" },
    { x: 11, y: 4, c: "#FCFCFC" },
    { x: 1, y: 6, c: "#FCE030" },
    { x: 14, y: 7, c: "#FCFCFC" },
    { x: 3, y: 10, c: "#3CBCFC" },
    { x: 12, y: 12, c: "#FF6E9C" },
    { x: 6, y: 13, c: "#FCFCFC" },
    { x: 14, y: 14, c: "#9878FC" },
    { x: 0, y: 13, c: "#FCFCFC" },
    { x: 8, y: 2, c: "#58D8D8" },
  ];
  for (const s of stars) {
    pixels.push({ x: s.x * P, y: s.y * P, w: SP, c: s.c });
  }

  // 커서 위 glow
  const glow = [
    { x: 8, y: 6, c: "#1A1A2E" },
    { x: 9, y: 6, c: "#1A1A2E" },
    { x: 10, y: 6, c: "#1A1A2E" },
    { x: 7, y: 7, c: "#1A1A2E" },
    { x: 8, y: 7, c: "#2A2A3E" },
    { x: 9, y: 7, c: "#2A2A3E" },
    { x: 10, y: 7, c: "#2A2A3E" },
    { x: 11, y: 7, c: "#1A1A2E" },
  ];
  for (const g of glow) {
    pixels.push({ x: g.x * P, y: g.y * P, w: P, c: g.c });
  }

  // 커서 본체
  pixels.push({ x: 8 * P, y: 8 * P, w: P, c: "#FCFCFC" });
  pixels.push({ x: 9 * P, y: 8 * P, w: P, c: "#FCFCFC" });
  pixels.push({ x: 10 * P, y: 8 * P, w: P, c: "#FCFCFC" });

  // 커서 아래 반사
  const reflect = [
    { x: 7, y: 9, c: "#1A1A2E" },
    { x: 8, y: 9, c: "#2A2A3E" },
    { x: 9, y: 9, c: "#2A2A3E" },
    { x: 10, y: 9, c: "#2A2A3E" },
    { x: 11, y: 9, c: "#1A1A2E" },
    { x: 8, y: 10, c: "#1A1A2E" },
    { x: 9, y: 10, c: "#1A1A2E" },
    { x: 10, y: 10, c: "#1A1A2E" },
  ];
  for (const r of reflect) {
    pixels.push({ x: r.x * P, y: r.y * P, w: P, c: r.c });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: `${SIZE}px`,
          height: `${SIZE}px`,
          background: "#0F0F23",
          display: "flex",
          position: "relative",
        }}
      >
        {pixels.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: p.w,
              height: p.w,
              background: p.c,
            }}
          />
        ))}
      </div>
    ),
    { width: SIZE, height: SIZE }
  );
}
