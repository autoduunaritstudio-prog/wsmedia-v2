"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

const DEFAULT_MIN = 500;
const DEFAULT_MAX = 15000;
const DEFAULT_INITIAL = 2000;

/**
 * Tuhaterotin kiinteänä sitomattomana välilyöntinä. Intl.NumberFormat antaisi
 * fi-FI:lle eri välilyöntimerkin ICU-versiosta riippuen, mikä rikkoisi
 * palvelin- ja selainrenderin vastaavuuden.
 */
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

type Props = {
  budgetLabel?: string;
  messageLabel?: string;
  /** Liukurin ala- ja ylaraja seka aloitusarvo. Oletukset sailyttavat
   *  aiempien sivujen kayttaytymisen muuttumattomana. */
  min?: number;
  max?: number;
  initial?: number;
};

export default function BudgetForm({
  budgetLabel = "Budjetti",
  messageLabel = "Mitä tarvitset? Videot, sivusto, tapahtuma vai kokonaisuus?",
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  initial = DEFAULT_INITIAL,
}: Props) {
  const [budget, setBudget] = useState(initial);
  const pct = ((budget - min) / (max - min)) * 100;

  return (
    <div className="card fcard rv" data-par="0.02">
      <label htmlFor="bud">{budgetLabel}</label>
      <div className="budget">
        <input
          type="range"
          id="bud"
          min={min}
          max={max}
          step={250}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          style={{ "--p": `${pct}%` } as CSSProperties}
        />
        <output id="budout" htmlFor="bud">
          {fmt(budget)} €
        </output>
      </div>
      <div className="row2">
        <div>
          <label htmlFor="nimi">Nimi</label>
          <input type="text" id="nimi" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="mail">Sähköposti</label>
          <input type="email" id="mail" autoComplete="email" />
        </div>
        <div>
          <label htmlFor="puh">Puhelinnumero</label>
          <input type="text" id="puh" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="pk">Paikkakunta</label>
          <input type="text" id="pk" />
        </div>
      </div>
      <label htmlFor="lisa">{messageLabel}</label>
      <textarea id="lisa" rows={3} />
      <button className="btn" type="button">
        Lähetä tarjouspyyntö
      </button>
      <p className="fnote">Vastaamme 24 tunnin sisällä. Ei sitoumuksia.</p>
    </div>
  );
}
