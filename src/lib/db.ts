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
  await sql`ALTER TABLE cards ADD COLUMN IF NOT EXISTS delete_token TEXT`;
}

/**
 * 카드 저장
 */
export async function saveCard(card: CardData, deleteToken?: string) {
  await sql`
    INSERT INTO cards (id, nickname, answer, generated_text, created_at, delete_token)
    VALUES (${card.id}, ${card.nickname}, ${card.answer}, ${card.generatedText}, ${card.createdAt}, ${deleteToken ?? null})
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
/**
 * 카드 삭제
 */
export async function deleteCard(id: string, token: string) {
  const result = await sql`DELETE FROM cards WHERE id = ${id} AND delete_token = ${token}`;
  return (result.rowCount ?? 0) > 0;
}

/**
 * 관리자 카드 삭제 (토큰 불필요)
 */
export async function adminDeleteCard(id: string) {
  const result = await sql`DELETE FROM cards WHERE id = ${id}`;
  return (result.rowCount ?? 0) > 0;
}

/**
 * 관리자 전체 카드 삭제
 */
export async function adminDeleteAllCards() {
  await sql`DELETE FROM cards`;
}

/**
 * 카드 단건 조회
 */
export async function getCardById(id: string): Promise<CardData | null> {
  const { rows } = await sql`
    SELECT id, nickname, answer, generated_text, created_at
    FROM cards WHERE id = ${id} LIMIT 1
  `;
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    nickname: r.nickname,
    answer: r.answer,
    generatedText: r.generated_text,
    createdAt: r.created_at,
  };
}

/**
 * 전체 카드 수 조회
 */
export async function getCardCount(): Promise<number> {
  const { rows } = await sql`SELECT COUNT(*)::int AS count FROM cards`;
  return rows[0].count;
}

/**
 * 커서 기반 페이지네이션 조회 (최신순)
 */
export async function getCardsPaginated(cursor?: string, limit = 20): Promise<{ cards: CardData[]; nextCursor: string | null }> {
  const { rows } = cursor
    ? await sql`
        SELECT id, nickname, answer, generated_text, created_at
        FROM cards WHERE created_at < ${cursor}
        ORDER BY created_at DESC LIMIT ${limit}
      `
    : await sql`
        SELECT id, nickname, answer, generated_text, created_at
        FROM cards ORDER BY created_at DESC LIMIT ${limit}
      `;
  const cards = rows.map((r) => ({
    id: r.id,
    nickname: r.nickname,
    answer: r.answer,
    generatedText: r.generated_text,
    createdAt: r.created_at,
  }));
  const nextCursor = cards.length === limit ? cards[cards.length - 1].createdAt : null;
  return { cards, nextCursor };
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
