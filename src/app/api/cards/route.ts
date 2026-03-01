import { NextRequest, NextResponse } from "next/server";
import { ensureTable, getRandomCards, getAllCards, deleteCard } from "@/lib/db";

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

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });
    }

    await ensureTable();
    await deleteCard(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Card delete error:", error);
    return NextResponse.json(
      { error: "카드를 삭제할 수 없습니다." },
      { status: 500 }
    );
  }
}
