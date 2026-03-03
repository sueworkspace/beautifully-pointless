import { NextRequest, NextResponse } from "next/server";
import { ensureTable, getRandomCards, getCardsPaginated, getCardCount, deleteCard, adminDeleteCard, adminDeleteAllCards } from "@/lib/db";

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

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 20, 100);
    const result = await getCardsPaginated(cursor, limit);
    return NextResponse.json(result);
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
    const adminPasswordParam = req.nextUrl.searchParams.get("adminPassword");
    const adminPassword = process.env.ADMIN_PASSWORD;

    // 관리자 인증 확인
    const isAdmin = adminPassword && adminPasswordParam === adminPassword;

    // 전체 삭제 (관리자 전용)
    const deleteAll = req.nextUrl.searchParams.get("all");
    if (deleteAll === "true") {
      if (!isAdmin) {
        return NextResponse.json({ error: "관리자 권한이 필요합니다." }, { status: 403 });
      }
      await ensureTable();
      await adminDeleteAllCards();
      return NextResponse.json({ success: true });
    }

    // 개별 삭제
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });
    }

    await ensureTable();

    if (isAdmin) {
      // 관리자 삭제 — 토큰 불필요
      const deleted = await adminDeleteCard(id);
      if (!deleted) {
        return NextResponse.json({ error: "카드를 찾을 수 없습니다." }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    // 일반 사용자 삭제 — 토큰 필요
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "삭제 권한이 없습니다." }, { status: 403 });
    }

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
