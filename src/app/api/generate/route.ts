import { NextRequest, NextResponse } from "next/server";

/* ===================================
   카드 생성 API
   MVP: Claude API 연동 전 — mock 변환 로직
   TODO: Anthropic SDK로 교체
   =================================== */

const POETIC_TRANSFORMS = [
  (answer: string) =>
    `무용하기에 아름다운 것 —\n${answer}\n그것이 당신의 진짜 모양입니다.`,
  (answer: string) =>
    `${answer}\n\n쓸모를 물으면 아무것도 아닌 것이\n당신을 여기까지 데려왔습니다.`,
  (answer: string) =>
    `아무것도 남기지 않았는데\n전부 남아 있는 것 —\n\n${answer}`,
  (answer: string) =>
    `${answer}\n\n— 가성비 없는 오후,\n생산적이지 않은 대화,\n아무 목적 없이 걷는 밤.`,
  (answer: string) =>
    `답할 때마다 무용이 무너지고\n무너질 때마다 아름다워지는 것 —\n\n${answer}`,
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answer, nickname, cardType, colorTheme } = body;

    if (!answer || typeof answer !== "string" || !answer.trim()) {
      return NextResponse.json(
        { error: "답변을 입력해주세요." },
        { status: 400 }
      );
    }

    // MVP: mock 변환 (나중에 Claude API로 교체)
    const transform =
      POETIC_TRANSFORMS[Math.floor(Math.random() * POETIC_TRANSFORMS.length)];
    const generatedText = transform(answer.trim());

    const id = crypto.randomUUID();
    const cardData = {
      id,
      nickname: nickname || undefined,
      answer: answer.trim(),
      generatedText,
      cardType: cardType || "postcard",
      colorTheme: colorTheme || "cream",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(cardData);
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
