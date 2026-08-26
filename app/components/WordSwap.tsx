"use client";

import { useEffect, useState } from "react";

const WORDS = [
  "tuo asiakkaita.",
  "pysäyttää skrollauksen.",
  "tekee kauppaa.",
  "jää mieleen.",
];

/** Heron vaihtuva sana. Ensimmäinen sana on aktiivinen jo palvelimella. */
export default function WordSwap() {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let clear: ReturnType<typeof setTimeout> | undefined;
    const id = setInterval(() => {
      setActive((cur) => {
        setLeaving(cur);
        clear = setTimeout(() => setLeaving(null), 600);
        return (cur + 1) % WORDS.length;
      });
    }, 2900);

    return () => {
      clearInterval(id);
      if (clear) clearTimeout(clear);
    };
  }, []);

  return (
    <span className="swapclip">
      <span className="swap" id="swap">
        {WORDS.map((w, i) => (
          <span key={w} className={i === active ? "act" : i === leaving ? "out" : ""}>
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
