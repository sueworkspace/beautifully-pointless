import { NextRequest, NextResponse } from "next/server";
import { ensureTable, getRandomCards, getAllCards } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await ensureTable();

    const mode = req.nextUrl.searchParams.get("mode");

    if (mode === "random") {
      const cards = await getRandomCards(20);
      return NextResponse.json(cards);
    }

    const cards = await getAllCards();
    return NextResponse.json(cards);
  } catch (error) {
    console.error("Cards API error:", error);
    return NextResponse.json(
      { error: "카드를 불러올 수 없습니다." },
      { status: 500 }
    );
  }
}
