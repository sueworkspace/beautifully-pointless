"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export default function LoadingPhase() {
  const [dots, setDots] = useState("");
  const dotsRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      dotsRef.current = (dotsRef.current + 1) % 4;
      setDots(".".repeat(dotsRef.current));
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      className="phase-content min-h-screen flex flex-col justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "linear" }}
    >
      <p
        className="pixel-body"
        style={{
          color: "var(--pixel-cyan)",
          fontSize: "16px",
          letterSpacing: "0.05em",
        }}
      >
        무용한 생각 적는중{dots}
      </p>
    </motion.div>
  );
}
