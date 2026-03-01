import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureTable, saveCard } from "@/lib/db";
import { sampleCards } from "@/lib/sampleCards";

export async function POST() {
  try {
    await ensureTable();

    for (const card of sampleCards) {
      // sample- ID를 UUID로 변환하여 일반 사용자 카드로 저장
      const newId = crypto.randomUUID();
      await sql`DELETE FROM cards WHERE id = ${card.id}`;
      await saveCard({ ...card, id: newId });
    }

    return NextResponse.json({ seeded: sampleCards.length });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "시드 실패" },
      { status: 500 }
    );
  }
}
