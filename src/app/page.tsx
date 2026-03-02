"use client";

import { useReducer, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import type { AppState, AppAction, CardData } from "@/types";
import PixelScene, { type SceneMode } from "@/components/PixelScene";
import QuestionPhase from "@/components/QuestionPhase";
import LoadingPhase from "@/components/LoadingPhase";
import ArtPhase from "@/components/ArtPhase";
import ArchivePhase from "@/components/ArchivePhase";

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

  const sceneMode: SceneMode = state.phase === "art" ? "display" : "idle";
  const displayText = state.phase === "art" ? state.answer : "";

  /* ---- Handlers ---- */

  const handleSubmit = useCallback(async (answer: string, nickname: string) => {
    dispatch({ type: "START_LOADING", answer, nickname });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, nickname }),
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
      alert("오류가 발생했습니다. 다시 시도해주세요.");
      dispatch({ type: "NEW_WRITE" });
    }
  }, []);

  const handleNewWrite = useCallback(() => {
    dispatch({ type: "NEW_WRITE" });
  }, []);

  const handleGoArchive = useCallback(() => {
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

  return (
    <div className="min-h-screen" style={{ background: "var(--pixel-bg)" }}>
      {/* 2D 픽셀 씬 */}
      <PixelScene text={displayText} mode={sceneMode} />

      {/* Phase UI */}
      <AnimatePresence mode="wait">
        {state.phase === "question" && (
          <QuestionPhase key="question" onSubmit={handleSubmit} onArchive={handleGoArchive} />
        )}

        {state.phase === "loading" && (
          <LoadingPhase key="loading" />
        )}

        {state.phase === "art" && (
          <ArtPhase
            key="art"
            generatedText={state.generatedText}
            nickname={state.nickname}
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}
