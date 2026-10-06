"use client";

/* ETUSIVUN KARTOITUSKORTTI PUHELIMESSA: paivat ja ajat.

   Ulkoasu on suunnitelman (Puhelin.dc.html, KARTOITUS). Suunnitelman
   paivat olivat esimerkki (lokakuun 2026 kiinteat paivat); tassa ne ovat
   samat kuin tyopoydan kalenterissa ja varausikkunassa: 3. arkipaivasta
   kuukausi eteenpain (api/varaus/ajat.ts), viikko kerrallaan ma–pe
   nuolilla (6.10.2026). Paiva ilman vapaita aikoja on himmea eika
   valittavissa; maarat haetaan /api/varaus-reitilta kun kortti tulee
   lahelle nakymaa (varausViikot.ts). Ajat ovat samat kuin suunnitelmassa ja
   BookingCal.tsx:ssa. Varaa-nappi avaa sivuston varausikkunan valitulla
   ajalla (ws:varaus, detail.toive), joka tarkistaa vapauden kalenterista.

   Paivat lasketaan vasta selaimessa (sama syy kuin BookingCal: paivamaara
   voi vaihtua palvelimen ja selaimen valissa). Palvelimen HTML:ssa on
   saman kokoiset paikanpitajat, joten mitaan ei siirry. */

import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { helsinki, varattavatPaivat } from "@/app/api/varaus/ajat";
import { haeVapaat, iso, viikkoTeksti, viikot } from "@/app/components/varausViikot";

const VP = ["su", "ma", "ti", "ke", "to", "pe", "la"];
const AJAT: [string, number, number][] = [
  ["9.00", 9, 0],
  ["10.00", 10, 0],
  ["11.30", 11, 30],
  ["13.00", 13, 0],
  ["14.30", 14, 30],
  ["16.00", 16, 0],
];

type Paiva = { y: number; kk: number; pv: number; vp: string; iso: string };
const paivaksi = (d: string): Paiva => {
  const [y, kk, pv] = d.split("-").map(Number);
  return { y, kk, pv, iso: d, vp: VP[new Date(Date.UTC(y, kk - 1, pv, 12)).getUTCDay()] };
};
type Tiedot = { varattavat: Set<string>; viikot: Paiva[][] };
let valimuisti: Tiedot | null = null;
const laske = () => {
  if (valimuisti) return valimuisti;
  const v = varattavatPaivat().map((p) => iso(p.y, p.kk, p.pv));
  valimuisti = { varattavat: new Set(v), viikot: viikot(v).map((w) => w.map(paivaksi)) };
  return valimuisti;
};
const tilaa = () => () => {};
const NUOLI = (pois: boolean): React.CSSProperties => ({ width: "44px", height: "44px", display: "grid", placeItems: "center", padding: "0", border: "0", borderRadius: "12px", font: "inherit", color: "#eaf2f8", background: "rgba(255,255,255,.05)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12)", cursor: pois ? "default" : "pointer", opacity: pois ? 0.35 : 1 });

export default function EtuKalenteri() {
  const tiedot = useSyncExternalStore(tilaa, laske, () => null);
  /* Kuten suunnitelmassa: alussa mitaan paivaa ei ole valittu; ajan
     valinta valitsee nakyvan viikon ensimmaisen valittavan paivan. */
  const [paiva, setPaiva] = useState<string | null>(null);
  const [aika, setAika] = useState(-1);
  const [oma, setViikko] = useState<number | null>(null);
  const [vapaat, setVapaat] = useState<Map<string, number> | null>(null);
  const rivi = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rivi.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let peruttu = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        haeVapaat().then((m) => {
          if (!peruttu && m) setVapaat(m);
        });
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => {
      peruttu = true;
      io.disconnect();
    };
  }, []);
  const valittava = (d: Paiva) => !!tiedot?.varattavat.has(d.iso) && (!vapaat || (vapaat.get(d.iso) ?? 0) > 0);
  const kaikki = tiedot?.viikot ?? [];
  /* Ensimmaisena nakyy viikko, jolla on ensimmainen vapaa paiva. */
  const ekaViikko = Math.max(0, kaikki.findIndex((w) => w.some(valittava)));
  const viikko = Math.min(oma ?? ekaViikko, Math.max(0, kaikki.length - 1));
  const lista: (Paiva | null)[] = kaikki[viikko] ?? [null, null, null, null, null];
  const pv = (paiva ? lista.find((d) => d?.iso === paiva) : null) || lista.find((d) => d && valittava(d)) || null;
  const vaihda = (w: number) => {
    setViikko(w);
    setPaiva(null);
  };
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
      <div style={{ position: "relative", margin: "14px 0 8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", fontSize: "13px", fontWeight: "600", color: "#eaf2f8" }}>
        <span>{"1. Valitse päivä"}</span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button type="button" aria-label="Edellinen viikko" disabled={viikko <= 0} onClick={() => vaihda(viikko - 1)} style={NUOLI(viikko <= 0)}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span aria-live="polite" style={{ minWidth: "86px", textAlign: "center", color: "#8fa3b5", fontWeight: "500", fontVariantNumeric: "tabular-nums" }}>{kaikki[viikko] ? viikkoTeksti(kaikki[viikko].map((d) => d.iso)) : " "}</span>
          <button type="button" aria-label="Seuraava viikko" disabled={viikko >= kaikki.length - 1} onClick={() => vaihda(viikko + 1)} style={NUOLI(viikko >= kaikki.length - 1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </span>
      </div>
      {" "}
      <div ref={rivi} className="mo-rv" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "8px" }}>
        {lista.map((d, i) => {
          const ok = !!d && valittava(d);
          const on = ok && !!d && pv?.iso === d.iso && (paiva !== null || aika >= 0);
          return (
            <Fragment key={i}>
              {" "}
              <button
                type="button"
                className="mo-e-pv"
                disabled={!ok}
                onClick={() => d && setPaiva(d.iso)}
                aria-pressed={on}
                aria-label={d ? `${d.vp} ${d.pv}.${d.kk}.` : undefined}
                style={{ minWidth: "0", height: "70px", border: "0", borderRadius: "16px", font: "inherit", cursor: ok ? "pointer" : "default", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", background: on ? "#6fecff" : "rgba(255,255,255,.05)", color: on ? "#0b0f14" : "#eaf2f8", boxShadow: on ? "none" : "inset 0 0 0 1px rgba(255,255,255,.12)", transition: "background-color .2s, color .2s" }}
              >
                <span style={{ fontSize: "12px", fontWeight: "600", opacity: ok || !d ? ".75" : ".3", textTransform: "uppercase", letterSpacing: ".05em" }}>{d ? d.vp : " "}</span>
                <b style={{ fontSize: "20px", fontWeight: "700", letterSpacing: "-.02em", opacity: ok || !d ? 1 : 0.35 }}>{d ? `${d.pv}.` : " "}</b>
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
                  if (!paiva && pv) setPaiva(pv.iso);
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
