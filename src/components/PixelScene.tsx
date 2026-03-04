"use client";

import { useRef, useEffect, useCallback } from "react";
import { hashString, seededRandom } from "@/lib/hash";
import { getPixelGridConfig, getOffsetY } from "@/lib/pixelGrid";

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
  const idx = Math.floor((nx + ny * 0.5) * PALETTE.text.length) % PALETTE.text.length;
  if (rng() > 0.85) {
    return PALETTE.text[(idx + 1) % PALETTE.text.length];
  }
  return PALETTE.text[idx];
}

/* ─── 텍스트 모드: 캔버스 줄바꿈 (띄어쓰기 단위) ─── */

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/(\s+)/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current + word;
    if (ctx.measureText(test).width > maxWidth && current.trim().length > 0) {
      lines.push(current.trimEnd());
      current = word.trimStart();
    } else {
      current = test;
    }
  }
  if (current.trim()) lines.push(current.trimEnd());
  return lines;
}

/* ─── 메인 컴포넌트 ─── */

function PixelScene({ text, mode }: PixelSceneProps) {
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

    // 텍스트 모드 refs
    const renderModeRef = useRef<"pixel" | "text">("pixel");
    const styledTextLinesRef = useRef<string[]>([]);
    const styledFontSizeRef = useRef(20);
    const revealLineRef = useRef(0);
    const textShimmerIdxRef = useRef(-1);
    const textShimmerEndRef = useRef(0);

    // 그리드 설정을 ref로 관리 (resize 시 재계산)
    const gridConfigRef = useRef(
      typeof window !== "undefined"
        ? getPixelGridConfig(window.innerWidth)
        : { GRID_W: 120, GRID_H: 40, PIXEL_SIZE: 6, isMobile: false }
    );

    const FRAME_SKIP = 6;

    modeRef.current = mode;
    textRef.current = text;

    const buildTextPixels = useCallback(() => {
      const currentText = textRef.current;
      if (!currentText) {
        textPixelsRef.current = [];
        styledTextLinesRef.current = [];
        renderModeRef.current = "pixel";
        return;
      }

      const sw = window.innerWidth;
      const sh = window.innerHeight;
      const config = getPixelGridConfig(sw);
      gridConfigRef.current = config;
      const threshold = 3;
      const charCount = [...currentText].length;

      if (charCount > threshold) {
        renderModeRef.current = "text";
        textPixelsRef.current = [];

        const maxWidth = config.isMobile ? sw * 0.8 : Math.min(sw * 0.6, 700);
        const availableH = sh * (config.isMobile ? 0.45 : 0.55);

        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d")!;

        const maxFont = config.isMobile ? 22 : 32;
        const minFont = config.isMobile ? 12 : 14;
        let bestSize = maxFont;
        let bestLines: string[] = [];

        for (let fs = maxFont; fs >= minFont; fs -= 2) {
          tempCtx.font = `${fs}px Galmuri14, monospace`;
          const lines = wrapCanvasText(tempCtx, currentText, maxWidth);
          const lineH = fs * 1.8;
          const totalH = lines.length * lineH;
          if (totalH <= availableH) {
            bestSize = fs;
            bestLines = lines;
            break;
          }
          bestSize = fs;
          bestLines = lines;
        }

        styledFontSizeRef.current = bestSize;
        styledTextLinesRef.current = bestLines;

        revealLineRef.current = 0;
        textShimmerIdxRef.current = -1;
        textShimmerEndRef.current = 0;
      } else {
        renderModeRef.current = "pixel";
        styledTextLinesRef.current = [];

        const pixels = textToPixels(currentText, config.GRID_W, config.GRID_H);
        const seed = hashString(currentText);
        const rng = seededRandom(seed);

        textPixelsRef.current = pixels.map((p) => ({
          ...p,
          color: getPixelColor(p.x, p.y, config.GRID_W, config.GRID_H, rng),
        }));
      }

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

        // 그리드 설정 재계산
        gridConfigRef.current = getPixelGridConfig(window.innerWidth);

        // 별 재생성
        const starCount = window.innerWidth < 768 ? 40 : 70;
        starsRef.current = generateStars(window.innerWidth, window.innerHeight, starCount);

        // display 모드면 텍스트 픽셀 재계산
        if (modeRef.current === "display" && textRef.current) {
          buildTextPixels();
        }
      };

      resize();
      window.addEventListener("resize", resize);

      const render = () => {
        rafRef.current = requestAnimationFrame(render);
        frameCountRef.current++;

        if (frameCountRef.current % FRAME_SKIP !== 0) return;

        const { w, h } = dimensionsRef.current;
        const config = gridConfigRef.current;

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

        // 텍스트 (display 모드)
        if (modeRef.current === "display") {
          if (renderModeRef.current === "pixel" && textPixelsRef.current.length > 0) {
            drawPixelMode(ctx, w, h, frame, config);
          } else if (renderModeRef.current === "text" && styledTextLinesRef.current.length > 0) {
            drawStyledText(ctx, w, h, frame, config);
          }
        }
      };

      const drawPixelMode = (
        ctx: CanvasRenderingContext2D,
        w: number,
        h: number,
        frame: number,
        config: ReturnType<typeof getPixelGridConfig>
      ) => {
        const pixels = textPixelsRef.current;
        const totalW = config.GRID_W * config.PIXEL_SIZE;
        const totalH = config.GRID_H * config.PIXEL_SIZE;
        const offsetX = Math.floor((w - totalW) / 2);
        const offsetY = getOffsetY(h, totalH, config.isMobile);

        if (revealRowRef.current < config.GRID_H) {
          revealRowRef.current += 1;
        }

        if (revealRowRef.current >= config.GRID_H && frame % 16 === 0) {
          for (const [idx, endFrame] of shimmerTimerRef.current) {
            if (frame >= endFrame) {
              shimmerRef.current.delete(idx);
              shimmerTimerRef.current.delete(idx);
            }
          }
          const count = 1 + Math.floor(Math.random() * 2);
          for (let i = 0; i < count; i++) {
            const idx = Math.floor(Math.random() * pixels.length);
            shimmerRef.current.add(idx);
            shimmerTimerRef.current.set(idx, frame + 3);
          }
        }

        for (let i = 0; i < pixels.length; i++) {
          const p = pixels[i];
          if (p.y >= revealRowRef.current) continue;

          const px = offsetX + p.x * config.PIXEL_SIZE;
          const py = offsetY + p.y * config.PIXEL_SIZE;

          ctx.fillStyle = shimmerRef.current.has(i) ? PALETTE.shimmer : p.color;
          ctx.fillRect(px, py, config.PIXEL_SIZE, config.PIXEL_SIZE);
        }
      };

      const drawStyledText = (
        ctx: CanvasRenderingContext2D,
        w: number,
        h: number,
        frame: number,
        config: ReturnType<typeof getPixelGridConfig>
      ) => {
        const lines = styledTextLinesRef.current;
        const fontSize = styledFontSizeRef.current;
        const lineHeight = fontSize * 1.8;
        const totalH = lines.length * lineHeight;
        const startY = config.isMobile
          ? Math.floor(h * 0.3 - totalH / 2)
          : Math.floor((h - totalH) / 2) - 30;

        ctx.font = `${fontSize}px Galmuri14, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (revealLineRef.current < lines.length) {
          revealLineRef.current += 0.5;
        }

        const revealedCount = Math.floor(revealLineRef.current);

        if (revealedCount >= lines.length && frame % 20 === 0) {
          textShimmerIdxRef.current = Math.floor(Math.random() * lines.length);
          textShimmerEndRef.current = frame + 4;
        }
        if (frame >= textShimmerEndRef.current) {
          textShimmerIdxRef.current = -1;
        }

        for (let i = 0; i < Math.min(revealedCount, lines.length); i++) {
          const y = startY + i * lineHeight;

          const color = textShimmerIdxRef.current === i
            ? PALETTE.shimmer
            : PALETTE.text[i % PALETTE.text.length];

          const isJustRevealed = i === revealedCount - 1 && revealedCount < lines.length;
          ctx.globalAlpha = isJustRevealed ? 0.7 : 1;

          ctx.fillStyle = color;
          ctx.fillText(lines[i], w / 2, y);
        }

        ctx.globalAlpha = 1;
      };

      render();

      return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(rafRef.current);
      };
    }, [buildTextPixels]);

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
        styledTextLinesRef.current = [];
        revealRowRef.current = 0;
        revealLineRef.current = 0;
        renderModeRef.current = "pixel";
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

export default PixelScene;
