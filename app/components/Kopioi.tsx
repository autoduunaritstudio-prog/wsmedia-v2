"use client";

import { useState } from "react";

/* Kopioi-nappi tietoriville: kopioi arvon leikepoydalle ja kertoo
   sen hetken ajan napin tekstissa. Ilman Clipboard-rajapintaa nappi
   ei tee mitaan, ja arvo on silti valittavissa kasin. */
export default function Kopioi({ arvo, nimi }: { arvo: string; nimi: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="kopioi"
      aria-label={`Kopioi ${nimi}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(arvo);
          setOk(true);
          setTimeout(() => setOk(false), 1600);
        } catch {}
      }}
    >
      {ok ? "Kopioitu" : "Kopioi"}
    </button>
  );
}
