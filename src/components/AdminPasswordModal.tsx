"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AdminPasswordModalProps {
  open: boolean;
  onSubmit: (password: string) => void;
  onCancel: () => void;
  error?: string;
}

export default function AdminPasswordModal({
  open,
  onSubmit,
  onCancel,
  error,
}: AdminPasswordModalProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!password.trim()) return;
    onSubmit(password.trim());
    setPassword("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(15, 15, 35, 0.85)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          onClick={onCancel}
        >
          <motion.div
            className="pixel-frame"
            style={{
              background: "var(--pixel-bg-alt)",
              padding: "24px 28px",
              maxWidth: "320px",
              width: "calc(100% - 40px)",
              textAlign: "center",
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className="pixel-label"
              style={{
                color: "var(--pixel-gold)",
                marginBottom: "16px",
                fontSize: "12px",
              }}
            >
              ADMIN MODE
            </p>
            <p
              className="pixel-body"
              style={{
                color: "var(--pixel-white)",
                marginBottom: "16px",
                fontSize: "13px",
              }}
            >
              관리자 암호를 입력하세요
            </p>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="password"
              autoFocus
              className="pixel-input-field"
              style={{ width: "100%", marginBottom: "8px" }}
            />

            {error && (
              <p
                className="pixel-label"
                style={{
                  color: "var(--pixel-red)",
                  marginBottom: "8px",
                  fontSize: "11px",
                }}
              >
                {error}
              </p>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
              <button
                onClick={onCancel}
                className="pixel-btn"
                style={{ fontSize: "12px", padding: "8px 16px", minWidth: "80px" }}
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="pixel-btn"
                style={{
                  fontSize: "12px",
                  padding: "8px 16px",
                  minWidth: "80px",
                  background: "var(--pixel-gold)",
                  borderColor: "var(--pixel-gold)",
                  color: "var(--pixel-bg)",
                }}
              >
                확인
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
