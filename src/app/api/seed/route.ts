import { NextResponse } from "next/server";
import { ensureTable, saveCard } from "@/lib/db";
import { sampleCards } from "@/lib/sampleCards";

export async function POST() {
  try {
    await ensureTable();

    for (const card of sampleCards) {
      await saveCard(card);
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
