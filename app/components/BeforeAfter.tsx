"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

/**
 * Ennen/jalkeen-liuku. Jakoviivan paikka on yksi custom property --x, joka
 * ohjaa seka uuden kerroksen clip-pathia etta kahvan sijaintia.
 *
 * Vetaminen hoituu koko alueen peittavalla lapinakyvalla range-inputilla:
 * se toimii hiirella, kosketuksella ja nappaimistolla ilman omaa
 * osoitinlogiikkaa, ja tuo saavutettavuuden mukana (aria-label, arvot).
 */

/** Toinen puoli liu'usta. Sisalto on placeholder kunnes oikeat kuvat ovat. */
function Layer({ variant, id }: { variant: "old" | "new"; id?: string }) {
  return (
    <div className={`lay ${variant}`} id={id}>
      <div className="fnav">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="bl" />
      <div className="bl" />
      <div className="bbtn" />
      <div className="btxt">
        <span />
        <span />
        <span />
      </div>
      <div className="bcards">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  const [x, setX] = useState(50);

  return (
    <div className="ba" id="ba" style={{ "--x": `${x}%` } as CSSProperties}>
      <Layer variant="old" />
      <Layer variant="new" id="baNew" />
      <span className="tag l">Ennen</span>
      <span className="tag r">Jälkeen</span>
      <span className="handle" id="baHandle" />
      <input
        type="range"
        id="baRange"
        min={0}
        max={100}
        value={x}
        onChange={(e) => setX(Number(e.target.value))}
        aria-label="Vertaa vanhaa ja uutta sivustoa"
      />
    </div>
  );
}
