"use client";

import { useState } from "react";

export default function SpoilerText({ text }) {
  const [revealed, setRevealed] = useState(false);

  if (typeof text !== "string") {
    return <span>{String(text)}</span>;
  }

  // Regex to match ||text||
  const parts = text.split(/(\|\|.*?\|\|)/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith("||") && part.endsWith("||")) {
          const content = part.slice(2, -2);
          return (
            <span
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setRevealed(!revealed);
              }}
              className={`cursor-pointer px-1 rounded transition-all duration-300 ${
                revealed
                  ? "bg-black/5 dark:bg-white/5"
                  : "bg-gray-400 text-transparent blur-[4px] select-none"
              }`}
            >
              {content}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}