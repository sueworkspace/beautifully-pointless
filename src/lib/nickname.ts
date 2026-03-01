const adjectives = [
  "졸린", "신난", "빠른", "느린", "작은",
  "용감한", "수줍은", "배고픈", "행복한", "한가한",
];

const colors = [
  "빨간", "파란", "초록", "노란", "분홍",
  "하얀", "보라", "은빛", "금빛", "검은",
];

const fruits = [
  "사과", "배", "포도", "감", "귤",
  "딸기", "수박", "망고", "키위", "자두",
  "살구", "앵두", "밤", "대추", "참외",
];

const animals = [
  "고양이", "토끼", "여우", "곰", "사슴",
  "펭귄", "고래", "판다", "수달", "부엉이",
  "너구리", "참새", "거북이", "오리", "두더지",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 형용사/색상 + 과일/동물 조합의 랜덤 닉네임 생성 (10자 이내)
 */
export function generateNickname(): string {
  const prefix = pick([...adjectives, ...colors]);
  const suffix = pick([...fruits, ...animals]);
  const name = prefix + suffix;

  // 10자 초과 시 재생성
  if (name.length > 10) return generateNickname();
  return name;
}
