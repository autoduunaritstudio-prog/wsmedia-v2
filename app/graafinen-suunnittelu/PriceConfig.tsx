"use client";

import { useState } from "react";

/**
 * Hintakonfiguraattori. Summa lasketaan Reactin tilasta, ei DOMia lukemalla:
 * valittujen kohteiden indeksit ovat tilassa ja summa johdetaan niista
 * renderin yhteydessa.
 *
 * Luvut ovat mockupin omia data-min/data-max -arvoja sellaisenaan.
 * Muotoilu toLocaleString("fi-FI"):lla, joka kayttaa tuhaterottimena
 * sitomatonta valilyontia - juuri sita mita luvussa halutaan, jottei
 * "1 490" katkea riville.
 */

type Item = { label: string; desc: string; min: number; max: number; on: boolean };

const ITEMS: Item[] = [
  { label: "Logo ja tunnus", desc: "Logopaketti eri tiedostomuodoissa", min: 690, max: 1900, on: true },
  { label: "Väripaletti, typografia ja graafinen ohjeisto", desc: "Ilmeen pelisäännöt yhteen PDF-tiedostoon", min: 800, max: 2400, on: true },
  { label: "Käyntikortit", desc: "Suunnittelu ja painatus", min: 190, max: 490, on: false },
  { label: "Flyer tai esite", desc: "Nelisivuinen, haitari tai kolmitaitteinen", min: 280, max: 1200, on: false },
  { label: "Roll-up", desc: "Suunnittelu, tulostus ja teline", min: 290, max: 690, on: false },
  { label: "Ajoneuvo: logoteippaus", desc: "Logot ja yhteystiedot, per ajoneuvo", min: 590, max: 900, on: false },
  { label: "Ajoneuvo: osateippaus", desc: "Kyljet ja takaosa, per ajoneuvo", min: 1190, max: 2200, on: false },
  { label: "Ajoneuvo: yliteippaus", desc: "Koko auto värinvaihtokalvolla, per ajoneuvo", min: 3400, max: 5200, on: false },
  { label: "Ikkuna- tai julkisivuteippaus", desc: "Toimitilan pinnat, laajuuden mukaan", min: 890, max: 3500, on: false },
  { label: "Valomainos tai kyltti", desc: "Valokirjaimet, kotelo tai opaste", min: 900, max: 5500, on: false },
];

const fmt = (n: number) => n.toLocaleString("fi-FI");

export default function PriceConfig() {
  const [picked, setPicked] = useState<boolean[]>(() => ITEMS.map((it) => it.on));

  const n = picked.filter(Boolean).length;
  const lo = ITEMS.reduce((s, it, k) => (picked[k] ? s + it.min : s), 0);
  const hi = ITEMS.reduce((s, it, k) => (picked[k] ? s + it.max : s), 0);

  const toggle = (k: number) =>
    setPicked((p) => p.map((v, j) => (j === k ? !v : v)));

  return (
    <div className="conf rv" id="conf">
      <p className="ct">Kokoa oma kokonaisuutesi</p>
      <p className="cs">
        Hinnat ovat avaimet käteen -hintoja: ne sisältävät suunnittelun, materiaalit, tuotannon ja
        asennuksen.
      </p>

      <div className="cgrid">
        {ITEMS.map((it, k) => (
          <label className={picked[k] ? "copt on" : "copt"} key={it.label}>
            <input type="checkbox" checked={picked[k]} onChange={() => toggle(k)} />
            <span>
              <b>{it.label}</b>
              <s>{it.desc}</s>
            </span>
          </label>
        ))}
      </div>

      <div className="cres">
        <div>
          <div className="amt" id="camt">
            {n === 0 ? (
              "\u2014"
            ) : (
              <>
                {fmt(lo)} &ndash; {fmt(hi)} <small>€</small>
              </>
            )}
          </div>
          <p className="lbl" id="clbl">
            {n === 0
              ? "Valitse vähintään yksi kohde, niin näet arvion."
              : n === 1
                ? "Arvio yhdelle valitulle kohteelle. Hintaan lisätään arvonlisävero 25,5 %."
                : `Arvio ${n} valitulle kohteelle. Hintaan lisätään arvonlisävero 25,5 %.`}
          </p>
        </div>
        <a className="btn" href="#tarjous">
          Pyydä tarkka tarjous
        </a>
      </div>
    </div>
  );
}
