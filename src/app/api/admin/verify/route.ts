import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "관리자 모드가 설정되지 않았습니다." }, { status: 503 });
    }

    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: "암호가 올바르지 않습니다." }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
