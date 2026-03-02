import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const P = 4; // 8x8 grid

  const pixels = [
    // 별빛
    { x: 1, y: 1, c: "#FCFCFC" },
    { x: 6, y: 2, c: "#3CBCFC" },
    { x: 1, y: 5, c: "#9878FC" },
    { x: 6, y: 6, c: "#FCFCFC" },
    // glow
    { x: 4, y: 3, c: "#1A1A2E" },
    { x: 5, y: 3, c: "#1A1A2E" },
    // 커서
    { x: 4, y: 4, c: "#FCFCFC" },
    { x: 5, y: 4, c: "#FCFCFC" },
    // 반사
    { x: 4, y: 5, c: "#1A1A2E" },
    { x: 5, y: 5, c: "#1A1A2E" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "32px",
          height: "32px",
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
