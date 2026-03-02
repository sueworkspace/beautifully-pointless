import { NextRequest, NextResponse } from "next/server";
import { ensureTable, getRandomCards, getAllCards, getCardCount, deleteCard } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await ensureTable();

    const mode = req.nextUrl.searchParams.get("mode");

    if (mode === "random") {
      const cards = await getRandomCards(20);
      return NextResponse.json(cards);
    }

    if (mode === "count") {
      const count = await getCardCount();
      return NextResponse.json({ count });
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
    const token = req.nextUrl.searchParams.get("token");

    if (!id) {
      return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });
    }
    if (!token) {
      return NextResponse.json({ error: "삭제 권한이 없습니다." }, { status: 403 });
    }

    await ensureTable();
    const deleted = await deleteCard(id, token);
    if (!deleted) {
      return NextResponse.json({ error: "삭제 권한이 없습니다." }, { status: 403 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Card delete error:", error);
    return NextResponse.json(
      { error: "카드를 삭제할 수 없습니다." },
      { status: 500 }
    );
  }
}
