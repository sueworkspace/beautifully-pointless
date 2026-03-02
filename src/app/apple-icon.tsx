import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const P = 15; // 12x12 grid

  const pixels: { x: number; y: number; c: string }[] = [];

  // 별빛
  pixels.push({ x: 1, y: 1, c: "#FCFCFC" });
  pixels.push({ x: 9, y: 2, c: "#3CBCFC" });
  pixels.push({ x: 3, y: 3, c: "#9878FC" });
  pixels.push({ x: 10, y: 5, c: "#FCFCFC" });
  pixels.push({ x: 1, y: 8, c: "#58D8D8" });
  pixels.push({ x: 10, y: 9, c: "#FF6E9C" });
  pixels.push({ x: 4, y: 10, c: "#FCFCFC" });

  // glow
  pixels.push({ x: 6, y: 5, c: "#1A1A2E" });
  pixels.push({ x: 7, y: 5, c: "#1A1A2E" });
  pixels.push({ x: 8, y: 5, c: "#1A1A2E" });

  // 커서
  pixels.push({ x: 6, y: 6, c: "#FCFCFC" });
  pixels.push({ x: 7, y: 6, c: "#FCFCFC" });
  pixels.push({ x: 8, y: 6, c: "#FCFCFC" });

  // 반사
  pixels.push({ x: 6, y: 7, c: "#1A1A2E" });
  pixels.push({ x: 7, y: 7, c: "#1A1A2E" });
  pixels.push({ x: 8, y: 7, c: "#1A1A2E" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
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
              left: p.x * P,
              top: p.y * P,
              width: P,
              height: P,
              background: p.c,
            }}
          />
        ))}
      </div>
    ),
    { ...size }
  );
}
