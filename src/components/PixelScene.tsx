"use client";

import { useRef, useEffect, useCallback } from "react";
import { hashString, seededRandom } from "@/lib/hash";

export type SceneMode = "idle" | "display";

interface PixelSceneProps {
  text: string;
  mode: SceneMode;
}

/* ─── NES 팔레트 ─── */

const PALETTE = {
  bg: "#0F0F23",
  stars: ["#FCFCFC", "#3CBCFC", "#FCE030", "#9878FC"],
  text: [
    "#3CBCFC", // blue
    "#58D8D8", // cyan
    "#FCFCFC", // white
    "#9878FC", // purple
    "#FF6E9C", // pink
  ],
  shimmer: "#F8B800", // gold
};

/* ─── 텍스트 → 픽셀 좌표 추출 ─── */

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const chars = [...text];
  const lines: string[] = [];
  let current = "";

  for (const ch of chars) {
    const test = current + ch;
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      lines.push(current);
      current = ch;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function textToPixels(
  text: string,
  gridW: number,
  gridH: number
): { x: number; y: number }[] {
  const canvas = document.createElement("canvas");
  canvas.width = gridW;
  canvas.height = gridH;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, gridW, gridH);

  const maxWidth = gridW * 0.85;
  let fontSize = Math.floor(gridH * 0.75);
  ctx.font = `${fontSize}px Galmuri14, monospace`;

  // 한 줄에 안 들어가면 줄바꿈, 폰트 크기도 줄 수에 맞게 조절
  let lines = wrapText(ctx, text, maxWidth);
  if (lines.length > 1) {
    // 줄 수에 맞게 폰트 축소
    fontSize = Math.floor(gridH / (lines.length * 1.5));
    fontSize = Math.max(fontSize, 6);
    ctx.font = `${fontSize}px Galmuri14, monospace`;
    lines = wrapText(ctx, text, maxWidth);
  }

  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lineHeight = fontSize * 1.4;
  const totalHeight = lines.length * lineHeight;
  const startY = (gridH - totalHeight) / 2 + lineHeight / 2;

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], gridW / 2, startY + i * lineHeight);
  }

  const imageData = ctx.getImageData(0, 0, gridW, gridH);
  const pixels: { x: number; y: number }[] = [];

  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const i = (y * gridW + x) * 4;
      if (imageData.data[i + 3] > 80) {
        pixels.push({ x, y });
      }
    }
  }

  return pixels;
}

/* ─── 별 데이터 ─── */

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  blinkPhase: number;
  blinkSpeed: number;
}

function generateStars(w: number, h: number, count: number): Star[] {
  const stars: Star[] = [];
  const rng = seededRandom(42);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.floor(rng() * w),
      y: Math.floor(rng() * h),
      size: rng() > 0.7 ? 4 : 2,
      color: PALETTE.stars[Math.floor(rng() * PALETTE.stars.length)],
      blinkPhase: Math.floor(rng() * 60),
      blinkSpeed: 40 + Math.floor(rng() * 40),
    });
  }
  return stars;
}

/* ─── 텍스트 픽셀 색상 ─── */

function getPixelColor(
  x: number,
  y: number,
  gridW: number,
  gridH: number,
  rng: () => number
): string {
  const nx = x / gridW;
  const ny = y / gridH;
  // 위치 기반 팔레트 인덱스
  const idx = Math.floor((nx + ny * 0.5) * PALETTE.text.length) % PALETTE.text.length;
  // 약간의 랜덤 변주
  if (rng() > 0.85) {
    return PALETTE.text[(idx + 1) % PALETTE.text.length];
  }
  return PALETTE.text[idx];
}

/* ─── 메인 컴포넌트 ─── */

export default function PixelScene({ text, mode }: PixelSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const textPixelsRef = useRef<{ x: number; y: number; color: string }[]>([]);
  const revealRowRef = useRef(0);
  const frameCountRef = useRef(0);
  const shimmerRef = useRef<Set<number>>(new Set());
  const shimmerTimerRef = useRef<Map<number, number>>(new Map());
  const modeRef = useRef(mode);
  const textRef = useRef(text);
  const dimensionsRef = useRef({ w: 0, h: 0 });

  modeRef.current = mode;
  textRef.current = text;

  // 픽셀 블록 크기 & 그리드 설정 (모바일 대응)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const PIXEL_SIZE = isMobile ? 12 : 18;
  const GRID_W = isMobile ? 80 : 120;
  const GRID_H = isMobile ? 30 : 40;
  const FRAME_SKIP = 6; // ~10fps at 60fps RAF

  const buildTextPixels = useCallback(() => {
    if (!textRef.current) {
      textPixelsRef.current = [];
      return;
    }

    const pixels = textToPixels(textRef.current, GRID_W, GRID_H);
    const seed = hashString(textRef.current);
    const rng = seededRandom(seed);

    textPixelsRef.current = pixels.map((p) => ({
      ...p,
      color: getPixelColor(p.x, p.y, GRID_W, GRID_H, rng),
    }));

    revealRowRef.current = 0;
    shimmerRef.current.clear();
    shimmerTimerRef.current.clear();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      dimensionsRef.current = { w: window.innerWidth, h: window.innerHeight };

      // 별 재생성
      const starCount = window.innerWidth < 768 ? 40 : 70;
      starsRef.current = generateStars(window.innerWidth, window.innerHeight, starCount);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      rafRef.current = requestAnimationFrame(render);
      frameCountRef.current++;

      // 프레임 스킵으로 레트로 느낌
      if (frameCountRef.current % FRAME_SKIP !== 0) return;

      const { w, h } = dimensionsRef.current;

      // 배경
      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, w, h);

      // 별 그리기
      const stars = starsRef.current;
      const frame = frameCountRef.current / FRAME_SKIP;

      for (const star of stars) {
        const visible = (frame + star.blinkPhase) % star.blinkSpeed < star.blinkSpeed * 0.7;
        if (visible) {
          ctx.fillStyle = star.color;
          ctx.fillRect(star.x, star.y, star.size, star.size);
        }
      }

      // 텍스트 픽셀 (display 모드)
      if (modeRef.current === "display" && textPixelsRef.current.length > 0) {
        const pixels = textPixelsRef.current;
        const totalW = GRID_W * PIXEL_SIZE;
        const totalH = GRID_H * PIXEL_SIZE;
        const offsetX = Math.floor((w - totalW) / 2);
        const offsetY = Math.floor((h - totalH) / 2) - 30;

        // 행별 reveal 애니메이션
        if (revealRowRef.current < GRID_H) {
          revealRowRef.current += 1;
        }

        // shimmer 효과
        if (revealRowRef.current >= GRID_H && frame % 8 === 0) {
          // 이전 shimmer 타이머 체크
          for (const [idx, endFrame] of shimmerTimerRef.current) {
            if (frame >= endFrame) {
              shimmerRef.current.delete(idx);
              shimmerTimerRef.current.delete(idx);
            }
          }
          // 새 shimmer 추가
          const count = 2 + Math.floor(Math.random() * 3);
          for (let i = 0; i < count; i++) {
            const idx = Math.floor(Math.random() * pixels.length);
            shimmerRef.current.add(idx);
            shimmerTimerRef.current.set(idx, frame + 3);
          }
        }

        for (let i = 0; i < pixels.length; i++) {
          const p = pixels[i];
          if (p.y >= revealRowRef.current) continue;

          const px = offsetX + p.x * PIXEL_SIZE;
          const py = offsetY + p.y * PIXEL_SIZE;

          ctx.fillStyle = shimmerRef.current.has(i) ? PALETTE.shimmer : p.color;
          ctx.fillRect(px, py, PIXEL_SIZE, PIXEL_SIZE);
        }
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // text/mode 변경 감지
  useEffect(() => {
    if (mode === "display" && text) {
      const build = async () => {
        if (document.fonts) await document.fonts.ready;
        buildTextPixels();
      };
      build();
    } else if (mode === "idle") {
      textPixelsRef.current = [];
      revealRowRef.current = 0;
    }
  }, [text, mode, buildTextPixels]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        imageRendering: "pixelated",
      }}
    />
  );
}
