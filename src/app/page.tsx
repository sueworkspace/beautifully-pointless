"use client";

import { useReducer, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import type { AppState, AppAction, CardData } from "@/types";
import PixelScene, { type SceneMode } from "@/components/PixelScene";
import QuestionPhase from "@/components/QuestionPhase";
import ShatterPhase from "@/components/ShatterPhase";
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
    case "SUBMIT":
      return {
        ...state,
        phase: "shatter",
        generatedText: action.generatedText,
        cardId: action.cardId,
        nickname: action.nickname,
      };
    case "SHATTER_DONE":
      return { ...state, phase: "art" };
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

  const handleShatterDone = useCallback(() => {
    dispatch({ type: "SHATTER_DONE" });
  }, []);

  const handleSubmit = useCallback(async (answer: string, nickname: string) => {
    dispatch({ type: "SET_ANSWER", answer });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, nickname }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();

      dispatch({
        type: "SUBMIT",
        generatedText: data.generatedText,
        cardId: data.id,
        nickname,
      });
    } catch {
      alert("오류가 발생했습니다. 다시 시도해주세요.");
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
          <QuestionPhase key="question" onSubmit={handleSubmit} />
        )}

        {state.phase === "shatter" && (
          <ShatterPhase
            key="shatter"
            answer={state.answer}
            onComplete={handleShatterDone}
          />
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
