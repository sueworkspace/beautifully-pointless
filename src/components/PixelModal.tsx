"use client";

import { motion, AnimatePresence } from "framer-motion";

interface PixelModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "confirm" | "error";
}

export default function PixelModal({
  open,
  title,
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  onConfirm,
  onCancel,
  variant = "confirm",
}: PixelModalProps) {
  const isError = variant === "error";
  const showCancel = !isError && onCancel;

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
            background: "rgba(15, 15, 35, 0.8)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          onClick={onCancel ?? onConfirm}
        >
          <motion.div
            className="pixel-frame"
            style={{
              background: "var(--pixel-bg-alt)",
              padding: "24px 28px",
              maxWidth: "300px",
              width: "calc(100% - 40px)",
              textAlign: "center",
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <p
                className="pixel-label"
                style={{
                  color: isError ? "var(--pixel-red)" : "var(--pixel-gold)",
                  marginBottom: "12px",
                  fontSize: "12px",
                }}
              >
                {title}
              </p>
            )}
            <p
              className="pixel-body"
              style={{
                color: "var(--pixel-white)",
                marginBottom: "8px",
                fontSize: "14px",
              }}
            >
              {message}
            </p>
            {!isError && onCancel && (
              <p
                className="pixel-label"
                style={{
                  color: "var(--pixel-dark-gray)",
                  marginBottom: "24px",
                }}
              />
            )}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
              {showCancel && (
                <button
                  onClick={onCancel}
                  className="pixel-btn"
                  style={{ fontSize: "12px", padding: "8px 16px", minWidth: "80px" }}
                >
                  {cancelLabel}
                </button>
              )}
              <button
                onClick={onConfirm}
                className="pixel-btn"
                style={{
                  fontSize: "12px",
                  padding: "8px 16px",
                  minWidth: "80px",
                  ...(showCancel
                    ? {
                        background: "var(--pixel-red)",
                        borderColor: "var(--pixel-red)",
                        color: "var(--pixel-white)",
                      }
                    : {}),
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
