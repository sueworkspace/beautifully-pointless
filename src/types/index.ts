/* Phase 타입 */
export type Phase = "intro" | "question" | "loading" | "art" | "archive";

/* 앱 상태 */
export interface AppState {
  phase: Phase;
  answer: string;
  nickname: string;
  generatedText: string;
  cardId: string | null;
  selectedArchiveId: string | null;
}

/* 앱 액션 */
export type AppAction =
  | { type: "GO_QUESTION" }
  | { type: "SET_ANSWER"; answer: string }
  | { type: "START_LOADING"; answer: string; nickname: string }
  | { type: "SUBMIT"; generatedText: string; cardId: string; nickname: string }
  | { type: "GO_ARCHIVE" }
  | { type: "SELECT_ARCHIVE"; id: string; generatedText: string; answer: string; nickname: string }
  | { type: "GO_INTRO" }
  | { type: "NEW_WRITE" };

/* 카드 데이터 (localStorage 저장용) */
export interface CardData {
  id: string;
  answer: string;
  nickname: string;
  generatedText: string;
  createdAt: string;
}
