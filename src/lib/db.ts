import { sql } from "@vercel/postgres";
import type { CardData } from "@/types";

/**
 * cards 테이블 생성 (없으면)
 */
export async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      nickname TEXT NOT NULL,
      answer TEXT NOT NULL,
      generated_text TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

/**
 * 카드 저장
 */
export async function saveCard(card: CardData) {
  await sql`
    INSERT INTO cards (id, nickname, answer, generated_text, created_at)
    VALUES (${card.id}, ${card.nickname}, ${card.answer}, ${card.generatedText}, ${card.createdAt})
    ON CONFLICT (id) DO NOTHING
  `;
}

/**
 * 실제 사용자 카드 랜덤 조회 (티커용, 샘플 제외)
 */
export async function getRandomCards(limit = 20): Promise<CardData[]> {
  const { rows } = await sql`
    SELECT id, nickname, answer, generated_text, created_at
    FROM cards
    WHERE id NOT LIKE 'sample-%'
    ORDER BY RANDOM()
    LIMIT ${limit}
  `;
  return rows.map((r) => ({
    id: r.id,
    nickname: r.nickname,
    answer: r.answer,
    generatedText: r.generated_text,
    createdAt: r.created_at,
  }));
}

/**
 * 전체 카드 조회 (최신순)
 */
export async function getAllCards(): Promise<CardData[]> {
  const { rows } = await sql`
    SELECT id, nickname, answer, generated_text, created_at
    FROM cards
    ORDER BY created_at DESC
  `;
  return rows.map((r) => ({
    id: r.id,
    nickname: r.nickname,
    answer: r.answer,
    generatedText: r.generated_text,
    createdAt: r.created_at,
  }));
}
