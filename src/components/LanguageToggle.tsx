"use client";

import { useTranslation } from "@/lib/i18n/context";

export default function LanguageToggle() {
  const { locale, toggleLocale } = useTranslation();

  return (
    <button
      onClick={toggleLocale}
      className="pixel-btn hover-flash-text"
      style={{
        fontSize: "11px",
        padding: "6px 12px",
        minHeight: "auto",
      }}
    >
      {locale === "ko" ? "EN" : "KO"}
    </button>
  );
}
