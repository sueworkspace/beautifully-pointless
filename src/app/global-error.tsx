"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: "2rem", textAlign: "center", fontFamily: "monospace" }}>
          <h2>문제가 발생했습니다</h2>
          <button
            onClick={reset}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              border: "2px solid #000",
              background: "#fff",
              fontFamily: "monospace",
            }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
