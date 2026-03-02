import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 — 무용한 기쁨",
  description: "무용한 기쁨 서비스 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ background: "var(--pixel-bg)", padding: "40px 20px" }}
    >
      <div className="w-full max-w-[640px]">
        {/* 헤더 */}
        <div className="mb-8">
          <Link
            href="/"
            className="pixel-label"
            style={{ color: "var(--pixel-blue)", textDecoration: "none" }}
          >
            &lt; 돌아가기
          </Link>
        </div>

        <div className="pixel-frame p-5 md:p-10">
          <h1
            className="pixel-heading text-center"
            style={{ marginBottom: "32px", fontSize: "24px" }}
          >
            개인정보처리방침
          </h1>

          <div
            className="pixel-body"
            style={{ color: "var(--pixel-gray)", lineHeight: 2.2, fontSize: "13px" }}
          >
            <p style={{ marginBottom: "16px", color: "var(--pixel-dark-gray)" }}>
              &ldquo;무용한 기쁨&rdquo;(이하 &ldquo;서비스&rdquo;)은 개인정보보호법 제30조에 따라
              이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록
              다음과 같이 개인정보처리방침을 수립·공개합니다.
            </p>

            <Section title="1. 수집하는 개인정보 항목">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "8px",
                  fontSize: "12px",
                }}
              >
                <thead>
                  <tr>
                    <Th>항목</Th>
                    <Th>필수/선택</Th>
                    <Th>설명</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <Td>닉네임</Td>
                    <Td>필수</Td>
                    <Td>실명이 아닌 임의 식별자. 랜덤 생성 가능</Td>
                  </tr>
                  <tr>
                    <Td>답변 텍스트</Td>
                    <Td>필수</Td>
                    <Td>사용자가 직접 입력한 답변 내용</Td>
                  </tr>
                </tbody>
              </table>
              <p style={{ marginTop: "8px", color: "var(--pixel-dark-gray)", fontSize: "11px" }}>
                * 이메일, 전화번호 등 민감 개인정보는 수집하지 않습니다.
              </p>
            </Section>

            <Section title="2. 개인정보의 이용 목적">
              <ol style={{ paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}>서비스 제공: AI 텍스트 생성 및 카드 표시</li>
                <li style={{ marginBottom: "8px" }}>공개 아카이브: 생성된 카드를 아카이브에 게시</li>
                <li style={{ marginBottom: "8px" }}>공유: 카드별 고유 URL 및 SNS 공유 기능 제공</li>
                <li style={{ marginBottom: "8px" }}>서비스 개선: 이용 통계 분석 (Google Analytics)</li>
              </ol>
            </Section>

            <Section title="3. 개인정보의 보유 및 이용 기간">
              <p>
                수집된 정보는 서비스 운영 기간 동안 보유됩니다. 사용자가 카드를 삭제하면 해당 정보는
                즉시 파기됩니다. 서비스 종료 시 모든 정보를 지체 없이 파기합니다.
              </p>
            </Section>

            <Section title="4. 제3자 제공">
              <p>
                수집된 개인정보는 제3자에게 제공하지 않습니다. 다만, 법령에 의한 요청이 있는 경우는
                예외로 합니다.
              </p>
            </Section>

            <Section title="5. 쿠키 및 분석 도구">
              <p>
                서비스는 Google Analytics를 사용하여 방문자 통계를 수집합니다. 이는 개인을 식별하지
                않는 집계 데이터이며, 브라우저 설정을 통해 쿠키를 거부할 수 있습니다.
              </p>
            </Section>

            <Section title="6. 이용자의 권리">
              <ol style={{ paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}>
                  삭제권: 본인이 생성한 카드는 삭제 토큰을 통해 삭제할 수 있습니다.
                </li>
                <li style={{ marginBottom: "8px" }}>
                  열람권: 아카이브에서 본인의 카드를 확인할 수 있습니다.
                </li>
              </ol>
            </Section>

            <Section title="7. 개인정보 보호책임자">
              <p>
                서비스 운영에 관한 문의사항은 아래로 연락해주세요.
              </p>
              <p style={{ marginTop: "8px", color: "var(--pixel-cyan)" }}>
                이메일: pointlessjoy@proton.me
              </p>
            </Section>

            <p
              className="pixel-label"
              style={{ color: "var(--pixel-dark-gray)", marginTop: "32px", textAlign: "center" }}
            >
              시행일: 2026년 3월 4일
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <h2
        style={{
          fontFamily: "var(--font-pixel-lg)",
          fontSize: "15px",
          color: "var(--pixel-cyan)",
          marginBottom: "12px",
        }}
      >
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        border: "1px solid var(--pixel-dark-gray)",
        padding: "8px",
        textAlign: "left",
        color: "var(--pixel-cyan)",
        background: "var(--pixel-bg)",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td
      style={{
        border: "1px solid var(--pixel-dark-gray)",
        padding: "8px",
      }}
    >
      {children}
    </td>
  );
}
