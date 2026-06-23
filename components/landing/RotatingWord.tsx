"use client";

import { useEffect, useState } from "react";

type RotatingWordProps = {
  words: readonly string[];
  intervalMs?: number;
};

export function RotatingWord({ words, intervalMs = 2400 }: RotatingWordProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs, words.length]);

  const longest = words.reduce(
    (max, word) => Math.max(max, word.length),
    0
  );

  return (
    <span
      className="relative inline-block align-baseline text-left"
      style={{ minWidth: `${longest}ch` }}
    >
      {words.map((word, i) => (
        <span
          key={word}
          aria-hidden={i !== index}
          className={`landing-text-gradient absolute inset-0 transition-all duration-500 ${
            i === index
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }`}
        >
          {word}
        </span>
      ))}
      <span className="invisible">{words[0]}</span>
    </span>
  );
}
