/**
 * VARAUSKALENTERIN VIIKOT (6.10.2026).
 *
 * Varattavia paivia on nyt noin kuukausi (api/varaus/ajat.ts), joten
 * kalenterit nayttavat ne viikko kerrallaan (ma–pe). Tama tiedosto
 * jakaa paivat viikkoihin ja hakee vapaiden aikojen maarat paivittain,
 * jotta paiva ilman vapaita aikoja voidaan nayttaa himmeana.
 *
 * Paivat ovat muotoa "2026-10-09" (Helsingin paivamaara).
 */

export const iso = (y: number, kk: number, pv: number) =>
  `${y}-${String(kk).padStart(2, "0")}-${String(pv).padStart(2, "0")}`;

const utc = (paiva: string) => {
  const [y, kk, pv] = paiva.split("-").map(Number);
  return Date.UTC(y, kk - 1, pv, 12);
};
const takaisin = (t: number) => {
  const d = new Date(t);
  return iso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
};

/** Viikon maanantai annetulle paivalle. */
export function maanantai(paiva: string): string {
  const t = utc(paiva);
  const vp = (new Date(t).getUTCDay() + 6) % 7; // ma = 0
  return takaisin(t - vp * 86_400_000);
}

/** Viikot (ma–pe) ensimmaisen paivan viikosta viimeisen paivan viikkoon. */
export function viikot(paivat: string[]): string[][] {
  if (!paivat.length) return [];
  const eka = utc(maanantai(paivat[0]));
  const vika = utc(maanantai(paivat[paivat.length - 1]));
  const out: string[][] = [];
  for (let t = eka; t <= vika; t += 7 * 86_400_000) {
    out.push(Array.from({ length: 5 }, (_, i) => takaisin(t + i * 86_400_000)));
  }
  return out;
}

/** Viikon otsikko, esim. "12.–16.10." tai "29.9.–3.10.". */
export function viikkoTeksti(viikko: string[]): string {
  const [, k1, p1] = viikko[0].split("-").map(Number);
  const [, k2, p2] = viikko[viikko.length - 1].split("-").map(Number);
  return k1 === k2 ? `${p1}.–${p2}.${k2}.` : `${p1}.${k1}.–${p2}.${k2}.`;
}

/** Vapaiden aikojen maara paivittain (Teams, lyhin puskuri: jos sille ei
 *  ole aikaa, ei ole paikan paalle -kaynnillekaan). Haetaan kerran
 *  sivulatauksessa; virheessa null, jolloin kalenteri nayttaa paivat
 *  ilman maaria kuten ennenkin. */
let haku: Promise<Map<string, number> | null> | null = null;
export function haeVapaat(): Promise<Map<string, number> | null> {
  if (!haku)
    haku = fetch("/api/varaus?tapa=teams", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { paivat?: { paiva: string; ajat: string[] }[] } | null) =>
        j?.paivat ? new Map(j.paivat.map((p) => [p.paiva, p.ajat.length])) : null,
      )
      .catch(() => null);
  return haku;
}
