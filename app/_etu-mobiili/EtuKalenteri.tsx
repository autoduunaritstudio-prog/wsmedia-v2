"use client";

/* ETUSIVUN KARTOITUSKORTTI PUHELIMESSA: paivat ja ajat.

   Ulkoasu on suunnitelman (Puhelin.dc.html, KARTOITUS). Suunnitelman
   paivat olivat esimerkki (lokakuun 2026 kiinteat paivat); tassa ne ovat
   samat kuin tyopoydan kalenterissa ja varausikkunassa: 3., 4. ja 5.
   arkipaiva (api/varaus/ajat.ts). Ajat ovat samat kuin suunnitelmassa ja
   BookingCal.tsx:ssa. Varaa-nappi avaa sivuston varausikkunan valitulla
   ajalla (ws:varaus, detail.toive), joka tarkistaa vapauden kalenterista.

   Paivat lasketaan vasta selaimessa (sama syy kuin BookingCal: paivamaara
   voi vaihtua palvelimen ja selaimen valissa). Palvelimen HTML:ssa on
   saman kokoiset paikanpitajat, joten mitaan ei siirry. */

import { Fragment, useState, useSyncExternalStore } from "react";
import { helsinki, varattavatPaivat } from "@/app/api/varaus/ajat";

const VP = ["su", "ma", "ti", "ke", "to", "pe", "la"];
const AJAT: [string, number, number][] = [
  ["9.00", 9, 0],
  ["10.00", 10, 0],
  ["11.30", 11, 30],
  ["13.00", 13, 0],
  ["14.30", 14, 30],
  ["16.00", 16, 0],
];

type Paiva = { y: number; kk: number; pv: number; vp: string };
let valimuisti: Paiva[] | null = null;
const laske = () => {
  if (valimuisti) return valimuisti;
  valimuisti = varattavatPaivat().map((p) => ({ ...p, vp: VP[new Date(Date.UTC(p.y, p.kk - 1, p.pv, 12)).getUTCDay()] }));
  return valimuisti;
};
const tilaa = () => () => {};

export default function EtuKalenteri() {
  const paivat = useSyncExternalStore(tilaa, laske, () => null);
  /* Kuten suunnitelmassa: alussa mitaan paivaa ei ole valittu; ajan
     valinta valitsee ensimmaisen paivan, jos paivaa ei ole valittu. */
  const [paiva, setPaiva] = useState(-1);
  const [aika, setAika] = useState(-1);
  const kuukausi = paivat?.length
    ? new Intl.DateTimeFormat("fi-FI", { month: "long" }).format(new Date(paivat[0].y, paivat[0].kk - 1, 1))
    : " ";
  const lista = paivat ?? [null, null, null];
  const pv = paivat?.[paiva < 0 ? 0 : paiva] ?? null;
  const teksti = aika >= 0 && pv ? `Varaa ${pv.vp} ${pv.pv}.${pv.kk}. klo ${AJAT[aika][0]}` : "Varaa aika";
  const toive = aika >= 0 && pv ? helsinki(pv.y, pv.kk, pv.pv, AJAT[aika][1], AJAT[aika][2]).toISOString() : undefined;

  const varaa = (e: React.MouseEvent) => {
    if (!toive) return; // ilman valintaa Kehotukset avaa varausikkunan tavalliseen tapaan
    e.preventDefault();
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("ws:varaus", { detail: { toive } }));
  };

  return (
    <>
      <p style={{ position: "relative", margin: "20px 0 10px", display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "600", color: "#eaf2f8" }}>
        <span>{"1. Valitse päivä"}</span>
        <span style={{ color: "#8fa3b5", fontWeight: "500" }}>{kuukausi}</span>
      </p>
      {" "}
      <div className="mo-e-x mo-rv" style={{ position: "relative", gap: "8px", margin: "0 -20px", padding: "0 20px 2px", scrollSnapType: "x proximity" }}>
        {lista.map((d, i) => {
          const on = !!d && paiva === i;
          return (
            <Fragment key={i}>
              {" "}
              <button
                type="button"
                className="mo-e-pv"
                disabled={!d}
                onClick={() => setPaiva(i)}
                aria-pressed={on}
                aria-label={d ? `${d.vp} ${d.pv}.${d.kk}.` : undefined}
                style={{ flex: "0 0 62px", height: "70px", border: "0", borderRadius: "16px", font: "inherit", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", background: on ? "#6fecff" : "rgba(255,255,255,.05)", color: on ? "#0b0f14" : "#eaf2f8", boxShadow: on ? "none" : "inset 0 0 0 1px rgba(255,255,255,.12)", transition: "background-color .2s, color .2s" }}
              >
                <span style={{ fontSize: "12px", fontWeight: "600", opacity: ".75", textTransform: "uppercase", letterSpacing: ".05em" }}>{d ? d.vp : " "}</span>
                <b style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-.02em" }}>{d ? `${d.pv}.` : " "}</b>
              </button>
            </Fragment>
          );
        })}
        {" "}
      </div>
      {" "}
      <p style={{ position: "relative", margin: "18px 0 10px", fontSize: "13px", fontWeight: "600", color: "#eaf2f8" }}>{"2. Valitse aika"}</p>
      {" "}
      <div className="mo-rv-s" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px" }}>
        {AJAT.map(([t], i) => {
          const on = aika === i;
          return (
            <Fragment key={t}>
              {" "}
              <button
                type="button"
                className="mo-e-aika"
                onClick={() => {
                  setAika(i);
                  if (paiva < 0) setPaiva(0);
                }}
                aria-pressed={on}
                style={{ height: "44px", border: "0", background: on ? "#6fecff" : "rgba(255,255,255,.04)", color: on ? "#0b0f14" : "#eaf2f8", boxShadow: on ? "none" : "inset 0 0 0 1px rgba(255,255,255,.12)" }}
              >
                {t}
              </button>
            </Fragment>
          );
        })}
        {" "}
      </div>
      {" "}
      <a href="/yhteystiedot" data-varaus="" onClick={varaa} className="mo-e-btn mo-e-p" style={{ position: "relative", width: "100%", marginTop: "18px", opacity: 1 }}>
        {teksti}
      </a>
    </>
  );
}
