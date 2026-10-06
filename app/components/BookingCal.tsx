"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { helsinki, varattavatPaivat } from "../api/varaus/ajat";
import { haeVapaat, iso } from "./varausViikot";

/**
 * ETUSIVUN KALENTERI, TOIMIVA (5.10.2026).
 *
 * Aiemmin pelkka kuva kalenterista. Nyt ruudukko nayttaa oikeat paivat
 * (nelja viikkoa kerrallaan, nuolilla viikko eteen tai taakse), ja
 * varattavat paivat ovat samat kuin varausikkunassa: 3. arkipaivasta
 * kuukausi eteenpain (ajat.ts, 6.10.2026). Paiva ilman vapaita aikoja
 * (/api/varaus, haetaan kun kortti tulee lahelle) ei ole valittavissa. Kun lukija
 * valitsee paivan ja kellonajan, varausikkuna aukeaa ja aika on siina
 * valmiina (ws:varaus, detail.toive). Ikkuna tarkistaa vapauden
 * kalenterista: jos aika on varattu, se pyytaa valitsemaan toisen.
 *
 * Paivat lasketaan vasta selaimessa, jotta palvelimen ja selaimen
 * renderointi eivat eroa (paivamaara voi vaihtua valissa).
 */
const VKP = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"];
const AJAT: [number, number][] = [
  [9, 0],
  [10, 0],
  [11, 30],
  [13, 0],
  [14, 30],
  [16, 0],
];
const avain = (y: number, kk: number, pv: number) => `${y}-${kk}-${pv}`;
/** Montako viikkoa ruudukossa nakyy kerralla. */
const NAKYY = 4;

type Ruutu = { y: number; kk: number; pv: number; ohi: boolean };

/** Kaikki viikot kuluvasta viikosta viimeisen varattavan paivan viikkoon. */
function ruudut(vika: { y: number; kk: number; pv: number } | undefined): Ruutu[] {
  const nyt = new Date();
  const tanaan = new Date(nyt.getFullYear(), nyt.getMonth(), nyt.getDate());
  const ma = new Date(tanaan);
  ma.setDate(tanaan.getDate() - ((tanaan.getDay() + 6) % 7));
  const loppu = vika ? new Date(vika.y, vika.kk - 1, vika.pv) : ma;
  const viikkoja = Math.max(NAKYY, Math.floor((loppu.getTime() - ma.getTime()) / (7 * 86_400_000)) + 1);
  return Array.from({ length: viikkoja * 7 }, (_, i) => {
    const d = new Date(ma);
    d.setDate(ma.getDate() + i);
    return { y: d.getFullYear(), kk: d.getMonth() + 1, pv: d.getDate(), ohi: d < tanaan };
  });
}

type Tiedot = { lista: Ruutu[]; vapaat: Set<string>; eka: string | null };
let valimuisti: Tiedot | null = null;
const laske = (): Tiedot => {
  if (valimuisti) return valimuisti;
  const v = varattavatPaivat();
  valimuisti = {
    lista: ruudut(v[v.length - 1]),
    vapaat: new Set(v.map((p) => avain(p.y, p.kk, p.pv))),
    eka: v[0] ? avain(v[0].y, v[0].kk, v[0].pv) : null,
  };
  return valimuisti;
};
const tilaa = () => () => {};
const NUOLI: React.CSSProperties = { flex: "0 0 44px", width: "44px", height: "36px", padding: "0", display: "grid", placeItems: "center" };

export default function BookingCal() {
  /* Palvelimella null, selaimessa lasketut paivat: ei hydraatioeroa. */
  const tiedot = useSyncExternalStore(tilaa, laske, () => null);
  const [maarat, setMaarat] = useState<Map<string, number> | null>(null);
  const juuri = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = juuri.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let peruttu = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        haeVapaat().then((m) => {
          if (!peruttu && m) setMaarat(m);
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
  const kaikki = tiedot?.lista ?? null;
  /* Varattava paiva on valittavissa, jos sille on vapaita aikoja (tai
     maaria ei saatu, jolloin varausikkuna tarkistaa ajan itse). */
  const vapaa = (r: Ruutu) =>
    !!tiedot?.vapaat.has(avain(r.y, r.kk, r.pv)) && (!maarat || (maarat.get(iso(r.y, r.kk, r.pv)) ?? 0) > 0);
  const viikkoja = kaikki ? kaikki.length / 7 : NAKYY;
  const ekaVapaa = kaikki ? kaikki.findIndex(vapaa) : -1;
  /* Ensimmaisena nakyy jakso, jonka ensimmainen viikko on ensimmaisen vapaan paivan viikko tai aiempi. */
  const alkuun = Math.max(0, Math.min(viikkoja - NAKYY, ekaVapaa < 0 ? 0 : Math.floor(ekaVapaa / 7)));
  const [omaSiirto, setSiirto] = useState<number | null>(null);
  const siirto = Math.max(0, Math.min(viikkoja - NAKYY, omaSiirto ?? (ekaVapaa >= NAKYY * 7 ? alkuun : 0)));
  const lista = kaikki ? kaikki.slice(siirto * 7, (siirto + NAKYY) * 7) : null;
  const [oma, setValittu] = useState<string | null>(null);
  const ekaRuutu = lista?.find(vapaa);
  const valittu = oma ?? (ekaRuutu ? avain(ekaRuutu.y, ekaRuutu.kk, ekaRuutu.pv) : null);

  const valitseAika = (h: number, m: number) => {
    if (!valittu) return;
    const [y, kk, pv] = valittu.split("-").map(Number);
    const toive = helsinki(y, kk, pv, h, m).toISOString();
    window.dispatchEvent(new CustomEvent("ws:varaus", { detail: { toive } }));
  };

  const kuukausi = lista
    ? new Intl.DateTimeFormat("fi-FI", { month: "long" }).format(
        new Date(lista[lista.length - 1].y, lista[lista.length - 1].kk - 1, 1),
      )
    : null;
  const vaihda = (s: number) => {
    setSiirto(s);
    setValittu(null);
  };
  const jakso = lista ? `${lista[0].pv}.${lista[0].kk}.–${lista[lista.length - 1].pv}.${lista[lista.length - 1].kk}.` : "";

  return (
    <div className="cal" ref={juuri}>
      <div className="cal-head">
        <b>Valitse sopiva aika</b>
        <span className="cal-len">30 min</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", margin: "-4px 0 12px" }}>
        <button type="button" className="cal-slot" aria-label="Edellinen viikko" disabled={!lista || siirto <= 0} onClick={() => vaihda(siirto - 1)} style={NUOLI}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className="cal-len" aria-live="polite" style={{ fontVariantNumeric: "tabular-nums" }}>{jakso}</span>
        <button type="button" className="cal-slot" aria-label="Seuraava viikko" disabled={!lista || siirto >= viikkoja - NAKYY} onClick={() => vaihda(siirto + 1)} style={NUOLI}>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div className="cal-grid" role="group" aria-label={kuukausi ? `Päivät, ${kuukausi}` : "Päivät"}>
        {VKP.map((d) => (
          <span className="cal-wd" key={d} aria-hidden="true">
            {d}
          </span>
        ))}
        {(lista ?? Array.from({ length: 28 }, (_, i) => ({ y: 0, kk: 0, pv: i + 1, ohi: false }))).map((r, i) => {
          const k = avain(r.y, r.kk, r.pv);
          return r.y && vapaa(r) ? (
            <button
              type="button"
              key={i}
              className={`cal-day free${valittu === k ? " sel" : ""}`}
              aria-pressed={valittu === k}
              aria-label={`${r.pv}.${r.kk}.`}
              onClick={() => setValittu(k)}
            >
              {r.pv}
            </button>
          ) : (
            <span key={i} className={`cal-day${r.ohi ? " ohi" : ""}`} aria-hidden="true">
              {r.pv}
            </span>
          );
        })}
      </div>
      <div className="cal-slots" role="group" aria-label="Kellonaika">
        {AJAT.map(([h, m]) => (
          <button
            type="button"
            key={`${h}.${m}`}
            className="cal-slot"
            disabled={!valittu}
            onClick={() => valitseAika(h, m)}
          >
            {h}.{String(m).padStart(2, "0")}
          </button>
        ))}
      </div>
      <p className="cal-vihje">Valitse päivä ja kellonaika, niin varaus aukeaa valmiiksi täytettynä.</p>
    </div>
  );
}
