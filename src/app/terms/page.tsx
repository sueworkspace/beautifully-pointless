import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관 — 무용한 기쁨",
  description: "무용한 기쁨 서비스 이용약관",
};

export default function TermsPage() {
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
            이용약관
          </h1>

          <div
            className="pixel-body"
            style={{ color: "var(--pixel-gray)", lineHeight: 2.2, fontSize: "13px" }}
          >
            <Section title="제1조 (목적)">
              이 약관은 &ldquo;무용한 기쁨&rdquo;(이하 &ldquo;서비스&rdquo;)의 이용 조건 및 절차에 관한
              사항을 규정합니다.
            </Section>

            <Section title="제2조 (서비스 내용)">
              서비스는 사용자가 입력한 답변을 바탕으로 AI가 시적 텍스트를 생성하고, 이를 픽셀아트와 함께
              표시하는 창작 체험 서비스입니다.
            </Section>

            <Section title="제3조 (콘텐츠 공개 및 활용)">
              <ol style={{ paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}>
                  사용자가 제출한 답변, 닉네임, AI 생성 텍스트는 공개 아카이브에 게시됩니다.
                </li>
                <li style={{ marginBottom: "8px" }}>
                  제출된 콘텐츠는 서비스 운영, 홍보, SNS 공유 목적으로 활용될 수 있습니다.
                </li>
                <li style={{ marginBottom: "8px" }}>
                  각 카드에는 고유 URL이 부여되며, 해당 URL을 통해 누구나 열람할 수 있습니다.
                </li>
              </ol>
            </Section>

            <Section title="제4조 (금지사항)">
              사용자는 다음 행위를 해서는 안 됩니다.
              <ol style={{ paddingLeft: "20px", marginTop: "8px" }}>
                <li style={{ marginBottom: "8px" }}>타인의 권리를 침해하는 내용 입력</li>
                <li style={{ marginBottom: "8px" }}>욕설, 혐오 표현, 불법 콘텐츠 게시</li>
                <li style={{ marginBottom: "8px" }}>서비스의 정상적 운영을 방해하는 행위</li>
                <li style={{ marginBottom: "8px" }}>자동화된 방법을 이용한 대량 요청</li>
              </ol>
            </Section>

            <Section title="제5조 (면책)">
              <ol style={{ paddingLeft: "20px" }}>
                <li style={{ marginBottom: "8px" }}>
                  AI가 생성한 텍스트의 정확성이나 적절성을 보장하지 않습니다.
                </li>
                <li style={{ marginBottom: "8px" }}>
                  서비스는 예고 없이 변경되거나 종료될 수 있습니다.
                </li>
                <li style={{ marginBottom: "8px" }}>
                  사용자가 입력한 콘텐츠로 인한 분쟁에 대해 서비스 운영자는 책임을 지지 않습니다.
                </li>
              </ol>
            </Section>

            <Section title="제6조 (콘텐츠 삭제)">
              사용자는 본인이 생성한 카드를 삭제 토큰을 통해 삭제할 수 있습니다. 삭제된 콘텐츠는 복구할 수
              없습니다.
            </Section>

            <Section title="제7조 (분쟁해결)">
              서비스 이용과 관련한 분쟁은 대한민국 법률을 따르며, 서울중앙지방법원을 관할 법원으로 합니다.
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
