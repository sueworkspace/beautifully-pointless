"use client";

import { useReducer, useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { AppState, AppAction, CardData } from "@/types";
import PixelScene, { type SceneMode } from "@/components/PixelScene";
import QuestionPhase from "@/components/QuestionPhase";
import LoadingPhase from "@/components/LoadingPhase";
import ArtPhase from "@/components/ArtPhase";
import ArchivePhase from "@/components/ArchivePhase";
import PixelModal from "@/components/PixelModal";
import AdminPasswordModal from "@/components/AdminPasswordModal";
import { useTranslation } from "@/lib/i18n/context";
import { trackEvent } from "@/lib/analytics";

/* ===================================
   State Machine
   =================================== */

const initialState: AppState = {
  phase: "question",
  answer: "",
  nickname: "",
  generatedText: "",
  cardId: null,
  selectedArchiveId: null,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "GO_QUESTION":
      return { ...state, phase: "question" };
    case "SET_ANSWER":
      return { ...state, answer: action.answer };
    case "START_LOADING":
      return {
        ...state,
        phase: "loading",
        answer: action.answer,
        nickname: action.nickname,
      };
    case "SUBMIT":
      return {
        ...state,
        phase: "art",
        generatedText: action.generatedText,
        cardId: action.cardId,
        nickname: action.nickname,
      };
    case "GO_ARCHIVE":
      return { ...state, phase: "archive" };
    case "SELECT_ARCHIVE":
      return {
        ...state,
        phase: "art",
        answer: action.answer,
        nickname: action.nickname,
        generatedText: action.generatedText,
        cardId: action.id,
        selectedArchiveId: action.id,
      };
    case "GO_INTRO":
      return { ...initialState };
    case "NEW_WRITE":
      return {
        ...initialState,
        phase: "question",
      };
    default:
      return state;
  }
}

/* ===================================
   Main Page
   =================================== */

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [errorModal, setErrorModal] = useState(false);
  const { t, locale } = useTranslation();

  // 관리자 모드
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminError, setAdminError] = useState("");

  const sceneMode: SceneMode = state.phase === "art" ? "display" : "idle";
  const displayText = state.phase === "art" ? state.answer : "";

  /* ---- Handlers ---- */

  const handleSubmit = useCallback(async (answer: string, nickname: string) => {
    dispatch({ type: "START_LOADING", answer, nickname });
    trackEvent("answer_submit");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, nickname, locale }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      // localStorage에 deleteToken 저장
      if (data.deleteToken) {
        try {
          const tokens = JSON.parse(localStorage.getItem("deleteTokens") || "{}");
          tokens[data.id] = data.deleteToken;
          localStorage.setItem("deleteTokens", JSON.stringify(tokens));
        } catch {
          // localStorage 사용 불가 시 무시
        }
      }

      dispatch({
        type: "SUBMIT",
        generatedText: data.generatedText,
        cardId: data.id,
        nickname,
      });
    } catch {
      setErrorModal(true);
    }
  }, [locale]);

  const handleErrorClose = useCallback(() => {
    setErrorModal(false);
    dispatch({ type: "NEW_WRITE" });
  }, []);

  const handleNewWrite = useCallback(() => {
    dispatch({ type: "NEW_WRITE" });
  }, []);

  const handleGoArchive = useCallback(() => {
    trackEvent("archive_view");
    dispatch({ type: "GO_ARCHIVE" });
  }, []);

  const handleArchiveSelect = useCallback((card: CardData) => {
    dispatch({
      type: "SELECT_ARCHIVE",
      id: card.id,
      answer: card.answer,
      nickname: card.nickname,
      generatedText: card.generatedText,
    });
  }, []);

  const handleArchiveBack = useCallback(() => {
    dispatch({ type: "GO_INTRO" });
  }, []);

  // 관리자 모드 핸들러
  const handleAdminTrigger = useCallback(() => {
    if (isAdmin) return; // 이미 관리자면 무시
    setAdminError("");
    setShowAdminModal(true);
  }, [isAdmin]);

  const handleAdminSubmit = useCallback(async (password: string) => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAdmin(true);
        setAdminPassword(password);
        setShowAdminModal(false);
        setAdminError("");
        trackEvent("admin_login");
      } else {
        setAdminError("암호가 올바르지 않습니다.");
      }
    } catch {
      setAdminError("서버 오류가 발생했습니다.");
    }
  }, []);

  const handleAdminCancel = useCallback(() => {
    setShowAdminModal(false);
    setAdminError("");
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--pixel-bg)" }}>
      {/* 2D 픽셀 씬 */}
      <PixelScene text={displayText} mode={sceneMode} />

      {/* Phase UI */}
      <AnimatePresence mode="wait">
        {state.phase === "question" && (
          <QuestionPhase
            key="question"
            onSubmit={handleSubmit}
            onArchive={handleGoArchive}
            onAdminTrigger={handleAdminTrigger}
          />
        )}

        {state.phase === "loading" && (
          <LoadingPhase key="loading" />
        )}

        {state.phase === "art" && (
          <ArtPhase
            key="art"
            answer={state.answer}
            generatedText={state.generatedText}
            nickname={state.nickname}
            cardId={state.cardId}
            onNewWrite={handleNewWrite}
            onArchive={handleGoArchive}
          />
        )}

        {state.phase === "archive" && (
          <ArchivePhase
            key="archive"
            onSelect={handleArchiveSelect}
            onBack={handleArchiveBack}
            onNewWrite={handleNewWrite}
            isAdmin={isAdmin}
            adminPassword={adminPassword}
          />
        )}
      </AnimatePresence>

      {/* 에러 모달 */}
      <PixelModal
        open={errorModal}
        title={t.errorTitle}
        message={t.errorRetry}
        confirmLabel={t.confirm}
        onConfirm={handleErrorClose}
        variant="error"
      />

      {/* 관리자 암호 모달 */}
      <AdminPasswordModal
        open={showAdminModal}
        onSubmit={handleAdminSubmit}
        onCancel={handleAdminCancel}
        error={adminError}
      />
    </div>
  );
}
