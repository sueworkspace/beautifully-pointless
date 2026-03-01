"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { hashString, seededRandom } from "@/lib/hash";

interface ShatterPhaseProps {
  answer: string;
  onComplete: () => void;
}

/* ─── NES 팔레트 (PixelScene과 동일) ─── */

const PALETTE = {
  bg: "#0F0F23",
  text: [
    "#3CBCFC", // blue
    "#58D8D8", // cyan
    "#FCFCFC", // white
    "#9878FC", // purple
    "#FF6E9C", // pink
  ],
};

/* ─── 텍스트 줄바꿈 ─── */

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

/* ─── 텍스트 → 픽셀 좌표 추출 ─── */

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

  let lines = wrapText(ctx, text, maxWidth);
  if (lines.length > 1) {
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

/* ─── 픽셀 색상 (PixelScene과 동일 로직) ─── */

function getPixelColor(
  x: number,
  y: number,
  gridW: number,
  gridH: number,
  rng: () => number
): string {
  const nx = x / gridW;
  const ny = y / gridH;
  const idx =
    Math.floor((nx + ny * 0.5) * PALETTE.text.length) % PALETTE.text.length;
  if (rng() > 0.85) {
    return PALETTE.text[(idx + 1) % PALETTE.text.length];
  }
  return PALETTE.text[idx];
}

/* ─── 파티클 데이터 ─── */

interface Particle {
  // 그리드 좌표 (목표)
  tx: number;
  ty: number;
  // 현재 위치 (화면 좌표)
  cx: number;
  cy: number;
  // 시작 위치 (랜덤)
  sx: number;
  sy: number;
  // 산산조각 속도
  vx: number;
  vy: number;
  color: string;
  alpha: number;
}

/* ─── 메인 컴포넌트 ─── */

export default function ShatterPhase({ answer, onComplete }: ShatterPhaseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const isMobile = w < 768;
    const PIXEL_SIZE = isMobile ? 12 : 18;
    const GRID_W = isMobile ? 80 : 120;
    const GRID_H = isMobile ? 30 : 40;

    // 텍스트 → 픽셀
    const rawPixels = textToPixels(answer, GRID_W, GRID_H);
    const seed = hashString(answer);
    const rng = seededRandom(seed);

    const totalW = GRID_W * PIXEL_SIZE;
    const totalH = GRID_H * PIXEL_SIZE;
    const offsetX = Math.floor((w - totalW) / 2);
    const offsetY = Math.floor((h - totalH) / 2) - 30;

    // 파티클 생성
    const particles: Particle[] = rawPixels.map((p) => {
      const tx = offsetX + p.x * PIXEL_SIZE;
      const ty = offsetY + p.y * PIXEL_SIZE;
      // 랜덤 시작 위치 (화면 곳곳에서)
      const sx = rng() * w;
      const sy = rng() * h;
      // 산산조각 방향 (중심에서 바깥으로)
      const centerX = w / 2;
      const centerY = h / 2;
      const angle = Math.atan2(ty - centerY, tx - centerX) + (rng() - 0.5) * 0.8;
      const speed = 3 + rng() * 6;

      return {
        tx,
        ty,
        cx: sx,
        cy: sy,
        sx,
        sy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: getPixelColor(p.x, p.y, GRID_W, GRID_H, rng),
        alpha: 1,
      };
    });

    // 애니메이션 타이밍
    const ASSEMBLE_DURATION = 1000; // 1초: 조립
    const SHATTER_DURATION = 1000; // 1초: 산산조각
    const TOTAL_DURATION = ASSEMBLE_DURATION + SHATTER_DURATION;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / TOTAL_DURATION, 1);

      ctx.fillStyle = PALETTE.bg;
      ctx.fillRect(0, 0, w, h);

      if (elapsed < ASSEMBLE_DURATION) {
        // ── 1단계: 조립 ──
        const t = elapsed / ASSEMBLE_DURATION;
        // easeOutCubic
        const ease = 1 - Math.pow(1 - t, 3);

        for (const p of particles) {
          p.cx = p.sx + (p.tx - p.sx) * ease;
          p.cy = p.sy + (p.ty - p.sy) * ease;
          p.alpha = 0.3 + 0.7 * ease;

          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.cx, p.cy, PIXEL_SIZE, PIXEL_SIZE);
        }
      } else {
        // ── 2단계: 산산조각 ──
        const t = (elapsed - ASSEMBLE_DURATION) / SHATTER_DURATION;
        // easeInCubic
        const ease = t * t * t;

        for (const p of particles) {
          p.cx = p.tx + p.vx * ease * 60;
          p.cy = p.ty + p.vy * ease * 60;
          p.alpha = 1 - ease;

          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.cx, p.cy, PIXEL_SIZE, PIXEL_SIZE);
        }
      }

      ctx.globalAlpha = 1;

      if (progress >= 1) {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
        return;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    // 폰트 로드 후 시작
    const start = async () => {
      if (document.fonts) await document.fonts.ready;
      rafRef.current = requestAnimationFrame(render);
    };
    start();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [answer, onComplete]);

  return (
    <motion.div
      className="phase-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "linear" }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          imageRendering: "pixelated",
        }}
      />
    </motion.div>
  );
}
