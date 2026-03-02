/**
 * SNS 공유 유틸리티
 * - 1080×1080 카드 이미지 생성 (NES 스타일)
 * - Web Share API (모바일) / PNG 다운로드 (데스크톱)
 */

import { seededRandom } from "@/lib/hash";

const CARD = 1080;

const PALETTE = {
  bg: "#0F0F23",
  stars: ["#FCFCFC", "#3CBCFC", "#FCE030", "#9878FC", "#58D8D8", "#FF6E9C"],
  text: ["#3CBCFC", "#58D8D8", "#FCFCFC", "#9878FC", "#FF6E9C"],
};

interface ShareOptions {
  answer: string;
  generatedText: string;
  nickname: string;
  title: string;
  shareText: string;
  fileName: string;
}

/* ─── 텍스트 줄바꿈 (한글 지원) ─── */

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  // 줄바꿈 문자로 먼저 분리
  const paragraphs = text.split("\n");
  const allLines: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      allLines.push("");
      continue;
    }
    const chars = [...para];
    let current = "";

    for (const ch of chars) {
      const test = current + ch;
      if (ctx.measureText(test).width > maxWidth && current.length > 0) {
        allLines.push(current);
        current = ch;
      } else {
        current = test;
      }
    }
    if (current) allLines.push(current);
  }
  return allLines;
}

/* ─── 별 배경 ─── */

function drawStars(ctx: CanvasRenderingContext2D) {
  const rng = seededRandom(777);
  const count = 35;

  for (let i = 0; i < count; i++) {
    const x = Math.floor(rng() * CARD);
    const y = Math.floor(rng() * CARD);
    const size = rng() > 0.75 ? 4 : 2;
    const color = PALETTE.stars[Math.floor(rng() * PALETTE.stars.length)];

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.4 + rng() * 0.6;
    ctx.fillRect(x, y, size, size);
  }
  ctx.globalAlpha = 1;
}

/* ─── NES 프레임 (이중 테두리) ─── */

function drawFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // 외곽 테두리
  ctx.strokeStyle = "rgba(88, 216, 216, 0.25)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);

  // 내부 테두리 (NES 느낌)
  ctx.strokeStyle = "rgba(88, 216, 216, 0.1)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 6, y + 6, w - 12, h - 12);

  // 코너 도트 (NES 스타일)
  const dotSize = 6;
  ctx.fillStyle = "rgba(88, 216, 216, 0.3)";
  ctx.fillRect(x - 1, y - 1, dotSize, dotSize);
  ctx.fillRect(x + w - dotSize + 1, y - 1, dotSize, dotSize);
  ctx.fillRect(x - 1, y + h - dotSize + 1, dotSize, dotSize);
  ctx.fillRect(x + w - dotSize + 1, y + h - dotSize + 1, dotSize, dotSize);
}

/* ─── 프레임 내부: 답변 + 생성 텍스트 ─── */

function drawFrameContent(
  ctx: CanvasRenderingContext2D,
  answer: string,
  generatedText: string,
  frameX: number,
  frameY: number,
  frameW: number,
  frameH: number
) {
  const padding = 40;
  const maxWidth = frameW - padding * 2;
  const availableH = frameH - padding * 2;
  const centerX = frameX + frameW / 2;

  // 답변 폰트 크기 자동 조정 (큰 텍스트)
  const answerMaxFont = 36;
  const answerMinFont = 20;
  let answerSize = answerMaxFont;
  let answerLines: string[] = [];

  for (let fs = answerMaxFont; fs >= answerMinFont; fs -= 2) {
    ctx.font = `${fs}px Galmuri14, monospace`;
    answerLines = wrapText(ctx, answer, maxWidth);
    const totalH = answerLines.length * fs * 2.0;
    if (totalH <= availableH * 0.4) {
      answerSize = fs;
      break;
    }
    answerSize = fs;
  }

  // 생성 텍스트 폰트 크기 (답변보다 작게)
  const genSize = Math.max(14, answerSize - 10);
  ctx.font = `${genSize}px Galmuri14, monospace`;
  const genLines = wrapText(ctx, generatedText, maxWidth);

  // 레이아웃 계산
  const answerLineH = answerSize * 2.0;
  const gap = 40; // 답변과 생성 텍스트 사이 간격
  const genLineH = genSize * 1.8;

  const answerBlockH = answerLines.length * answerLineH;
  const genBlockH = genLines.length * genLineH;
  const totalH = answerBlockH + gap + genBlockH;

  const startY = frameY + (availableH - totalH) / 2 + padding;

  // 답변 그리기 (NES 팔레트 색상)
  ctx.font = `${answerSize}px Galmuri14, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  for (let i = 0; i < answerLines.length; i++) {
    if (!answerLines[i].trim()) continue;
    ctx.fillStyle = PALETTE.text[i % PALETTE.text.length];
    ctx.fillText(answerLines[i], centerX, startY + i * answerLineH);
  }

  // 생성 텍스트 그리기 (시안 계열, 작은 폰트)
  ctx.font = `${genSize}px Galmuri14, monospace`;
  const genStartY = startY + answerBlockH + gap;

  for (let i = 0; i < genLines.length; i++) {
    if (!genLines[i].trim()) continue;
    ctx.fillStyle = "rgba(88, 216, 216, 0.7)";
    ctx.fillText(genLines[i], centerX, genStartY + i * genLineH);
  }
}

/* ─── 1080×1080 카드 생성 ─── */

async function renderShareCard(options: ShareOptions): Promise<Blob> {
  if (document.fonts) await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = CARD;
  canvas.height = CARD;
  const ctx = canvas.getContext("2d")!;

  // 1. 배경
  ctx.fillStyle = PALETTE.bg;
  ctx.fillRect(0, 0, CARD, CARD);

  // 2. 별
  drawStars(ctx);

  // 3. 프레임 영역
  const frameX = 80;
  const frameY = 100;
  const frameW = CARD - 160;
  const frameH = 620;

  drawFrame(ctx, frameX, frameY, frameW, frameH);

  // 4. 답변 + 생성 텍스트 (프레임 내부)
  drawFrameContent(ctx, options.answer, options.generatedText, frameX, frameY, frameW, frameH);

  // 5. 닉네임
  ctx.font = "18px Galmuri11, monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#A0A0B0";
  ctx.fillText(`— ${options.nickname}`, frameX + frameW - 20, frameY + frameH + 28);

  // 6. 구분선
  const divY = frameY + frameH + 80;
  ctx.strokeStyle = "rgba(160, 160, 176, 0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(CARD / 2 - 120, divY);
  ctx.lineTo(CARD / 2 + 120, divY);
  ctx.stroke();

  // 7. 질문 문구
  ctx.font = "16px Galmuri11, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(160, 160, 176, 0.4)";
  ctx.fillText("나를 기쁘게 하는 아름답지만 무용한 것은?", CARD / 2, divY + 16);

  // 8. URL
  ctx.font = "12px Galmuri9, monospace";
  ctx.fillStyle = "rgba(160, 160, 176, 0.25)";
  ctx.fillText("pointless-joy.vercel.app", CARD / 2, CARD - 40);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

/* ─── PNG 다운로드 ─── */

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── Web Share API ─── */

function canWebShare(): boolean {
  return (
    typeof navigator !== "undefined" &&
    !!navigator.share &&
    !!navigator.canShare
  );
}

/* ─── 공유 실행 ─── */

export async function shareArt(options: ShareOptions): Promise<void> {
  const cardBlob = await renderShareCard(options);

  if (canWebShare()) {
    const file = new File([cardBlob], `${options.fileName}.png`, {
      type: "image/png",
    });
    const shareData: ShareData = {
      title: options.title,
      text: options.shareText,
      files: [file],
    };

    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
  }

  // 폴백: PNG 다운로드
  downloadBlob(cardBlob, options.fileName);
}
