"use client";

import { useEffect, useState } from "react";

type Props = {
  words: string[];
  /**
   * Kun tosi, palvelin renderoi vain ensimmaisen lauseen ja loput lisataan
   * vasta selaimessa. Alasivun mockup tekee nain tarkoituksella: H1 pysyy
   * hakukoneelle yhtena lauseena. Etusivulla kaikki lauseet ovat HTML:ssa.
   */
  deferToClient?: boolean;
};

export default function WordSwap({ words, deferToClient = false }: Props) {
  const [ready, setReady] = useState(!deferToClient);
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setReady(true);

    let clear: ReturnType<typeof setTimeout> | undefined;
    const id = setInterval(() => {
      setActive((cur) => {
        setLeaving(cur);
        clear = setTimeout(() => setLeaving(null), 600);
        return (cur + 1) % words.length;
      });
    }, 2900);

    return () => {
      clearInterval(id);
      if (clear) clearTimeout(clear);
    };
  }, [words.length]);

  const visible = ready ? words : words.slice(0, 1);

  return (
    <span className="swapclip">
      <span className="swap" id="swap">
        {visible.map((w, i) => (
          <span key={w} className={i === active ? "act" : i === leaving ? "out" : ""}>
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
