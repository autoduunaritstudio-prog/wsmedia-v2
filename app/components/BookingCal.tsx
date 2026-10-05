"use client";

import { useState, useSyncExternalStore } from "react";

import { helsinki, varattavatPaivat } from "../api/varaus/ajat";

/**
 * ETUSIVUN KALENTERI, TOIMIVA (5.10.2026).
 *
 * Aiemmin pelkka kuva kalenterista. Nyt ruudukko nayttaa oikeat paivat
 * (kuluva viikko ja kolme seuraavaa), ja varattavat paivat ovat samat
 * kuin varausikkunassa: 3., 4. ja 5. arkipaiva (ajat.ts). Kun lukija
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

type Ruutu = { y: number; kk: number; pv: number; ohi: boolean };

function ruudut(): Ruutu[] {
  const nyt = new Date();
  const tanaan = new Date(nyt.getFullYear(), nyt.getMonth(), nyt.getDate());
  const ma = new Date(tanaan);
  ma.setDate(tanaan.getDate() - ((tanaan.getDay() + 6) % 7));
  return Array.from({ length: 28 }, (_, i) => {
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
    lista: ruudut(),
    vapaat: new Set(v.map((p) => avain(p.y, p.kk, p.pv))),
    eka: v[0] ? avain(v[0].y, v[0].kk, v[0].pv) : null,
  };
  return valimuisti;
};
const tilaa = () => () => {};

export default function BookingCal() {
  /* Palvelimella null, selaimessa lasketut paivat: ei hydraatioeroa. */
  const tiedot = useSyncExternalStore(tilaa, laske, () => null);
  const lista = tiedot?.lista ?? null;
  const vapaat = tiedot?.vapaat ?? new Set<string>();
  const [oma, setValittu] = useState<string | null>(null);
  const valittu = oma ?? tiedot?.eka ?? null;

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

  return (
    <div className="cal">
      <div className="cal-head">
        <b>Valitse sopiva aika</b>
        <span className="cal-len">30 min</span>
      </div>
      <div className="cal-grid" role="group" aria-label={kuukausi ? `Päivät, ${kuukausi}` : "Päivät"}>
        {VKP.map((d) => (
          <span className="cal-wd" key={d} aria-hidden="true">
            {d}
          </span>
        ))}
        {(lista ?? Array.from({ length: 28 }, (_, i) => ({ y: 0, kk: 0, pv: i + 1, ohi: false }))).map((r, i) => {
          const k = avain(r.y, r.kk, r.pv);
          const vapaa = vapaat.has(k);
          return vapaa ? (
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
