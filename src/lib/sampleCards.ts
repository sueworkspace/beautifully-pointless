import type { CardData } from "@/types";

export const sampleCards: CardData[] = [
  {
    id: "sample-001",
    nickname: "졸린펭귄",
    answer: "비 오는 날 창밖 바라보기",
    generatedText: "빗줄기가 유리 위에 글을 쓴다\n읽을 수 없는 언어로\n그저 바라보는 것만으로\n하루가 완성되는 오후",
    createdAt: "2026-02-20T10:00:00.000Z",
  },
  {
    id: "sample-002",
    nickname: "빨간딸기",
    answer: "고양이 발바닥 젤리",
    generatedText: "분홍빛 작은 구슬 네 개\n아무 쓸모 없이 말랑한 것이\n세상에서 가장\n확실한 위로가 된다",
    createdAt: "2026-02-21T14:30:00.000Z",
  },
  {
    id: "sample-003",
    nickname: "금빛수달",
    answer: "쓸모없는 예쁜 돌멩이 줍기",
    generatedText: "주머니 속 돌멩이 하나\n아무 가치 없는 것이\n손끝에 닿을 때마다\n작은 우주가 열린다",
    createdAt: "2026-02-22T09:15:00.000Z",
  },
  {
    id: "sample-004",
    nickname: "느린거북이",
    answer: "해 질 녘 하늘 색 변화",
    generatedText: "매일 다른 빛으로 물드는\n아무도 주문하지 않은 그림\n느리게 번지는 것들이\n가장 오래 남는다",
    createdAt: "2026-02-23T17:45:00.000Z",
  },
  {
    id: "sample-005",
    nickname: "보라앵두",
    answer: "오래된 LP판 잡음",
    generatedText: "치직거리는 소리 사이로\n음악보다 먼저 도착하는 시간\n불완전한 것이\n완전한 것보다 따뜻하다",
    createdAt: "2026-02-24T20:00:00.000Z",
  },
  {
    id: "sample-006",
    nickname: "신난토끼",
    answer: "뽁뽁이 터뜨리기",
    generatedText: "톡, 톡, 톡\n아무것도 만들어지지 않는 소리\n아무것도 해결되지 않는 손끝에서\n기쁨이 터진다",
    createdAt: "2026-02-25T11:20:00.000Z",
  },
  {
    id: "sample-007",
    nickname: "하얀고래",
    answer: "밤하늘에 별 세기",
    generatedText: "셀 수 없다는 걸 알면서\n그래도 세어보는 밤\n무용한 숫자들이\n우주를 채운다",
    createdAt: "2026-02-25T23:10:00.000Z",
  },
  {
    id: "sample-008",
    nickname: "초록여우",
    answer: "낙엽 밟는 소리",
    generatedText: "바스락, 한 발자국\n계절이 부서지는 소리를\n일부러 찾아 밟는 발걸음\n그것이 산책의 이유",
    createdAt: "2026-02-26T08:30:00.000Z",
  },
  {
    id: "sample-009",
    nickname: "파란사슴",
    answer: "쓰지 않는 예쁜 노트 모으기",
    generatedText: "빈 페이지들이 쌓여간다\n쓰지 않아서 완벽한 것들\n가능성만으로 존재하는\n작은 직사각형의 우주",
    createdAt: "2026-02-26T15:00:00.000Z",
  },
  {
    id: "sample-010",
    nickname: "분홍곰",
    answer: "구름 모양 상상하기",
    generatedText: "토끼였다가 고래였다가\n아무것도 아닌 것이 되는\n하늘 위의 놀이\n정답이 없어서 좋다",
    createdAt: "2026-02-27T12:40:00.000Z",
  },
  {
    id: "sample-011",
    nickname: "은빛참새",
    answer: "새벽 공기 한 모금",
    generatedText: "아무도 깨지 않은 시간\n차가운 공기가 폐를 채울 때\n살아 있다는 것이\n이유 없이 선명해진다",
    createdAt: "2026-02-28T05:30:00.000Z",
  },
  {
    id: "sample-012",
    nickname: "노란판다",
    answer: "오래된 동전 수집",
    generatedText: "누군가의 주머니에서\n잊혀진 시간이 동그랗게 남아\n쓸 수 없는 돈이\n가장 값진 것이 된다",
    createdAt: "2026-02-28T19:00:00.000Z",
  },
];

/**
 * localStorage에 샘플 카드가 없으면 시드
 */
export function seedSampleCards() {
  const alreadySeeded = sampleCards.some(
    (card) => localStorage.getItem(`card-${card.id}`) !== null
  );
  if (alreadySeeded) return;

  for (const card of sampleCards) {
    localStorage.setItem(`card-${card.id}`, JSON.stringify(card));
  }
}

/**
 * localStorage에서 모든 카드를 읽어 반환
 */
export function loadAllCards(): CardData[] {
  const cards: CardData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("card-")) {
      try {
        cards.push(JSON.parse(localStorage.getItem(key)!));
      } catch {
        // skip
      }
    }
  }
  return cards;
}
