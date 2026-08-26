"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Valilehdet ARIA:n tab-patternin mukaisesti.
 *
 * - tablist / tab / tabpanel -roolit ja aria-selected, aria-controls,
 *   aria-labelledby
 * - Rullaava tabindex: vain valittu valilehti on tab-jarjestyksessa, joten
 *   Tab vie suoraan paneeliin eika kaikkien valilehtien lapi
 * - Nuolinappaimet vaihtavat valilehtea ja kiertavat paista toiseen,
 *   Home ja End hyppaavat ensimmaiseen ja viimeiseen
 *
 * Paneelit renderoidaan kaikki DOM:iin ja piilotetaan CSS:lla (.on), jotta
 * sisalto on hakukoneelle luettavissa ilman vuorovaikutusta.
 */

export type Tab = {
  id: string;
  label: string;
  content: ReactNode;
};

type Props = {
  tabs: Tab[];
  /** Saavutettava nimi tablistille. */
  label: string;
};

export default function Tabs({ tabs, label }: Props) {
  const [active, setActive] = useState(0);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (idx: number) => {
    setActive(idx);
    btnRefs.current[idx]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const last = tabs.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = idx === last ? 0 : idx + 1;
    else if (e.key === "ArrowLeft") next = idx === 0 ? last : idx - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    focusTab(next);
  };

  return (
    <div className="rv">
      <div className="tabbar" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`t-${t.id}`}
            aria-controls={`p-${t.id}`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            ref={(el) => {
              btnRefs.current[i] = el;
            }}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tabs.map((t, i) => (
        <div
          key={t.id}
          className={`tabpanel${i === active ? " on" : ""}`}
          id={`p-${t.id}`}
          role="tabpanel"
          aria-labelledby={`t-${t.id}`}
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
