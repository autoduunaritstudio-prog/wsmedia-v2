/**
 * KARTOITUSAJAT (4.10.2026).
 *
 * - Kesto 30 min. Ensimmainen varattava paiva on 3. arkipaiva tasta
 *   paivasta, ja arkipaivia tarjotaan siita 30 kalenteripaivaa eteenpain
 *   (6.10.2026, ennen vain 3.–5. arkipaiva).
 * - Ma–pe 9.00–18.00 Suomen aikaa, alkuajat puolen tunnin valein.
 * - Paikan paalla (paakaupunkiseutu): 45 min puskuri ennen ja jalkeen
 *   (siirtyminen). Teams: 15 min puskuri.
 * - Aika on vapaa vain, jos kalentereissa ei ole mitaan puskurin
 *   sisalla.
 */
import type { Varattu } from "./google";

export type Tapa = "paikalla" | "teams";
export const KESTO_MIN = 30;
const PUSKURI: Record<Tapa, number> = { paikalla: 45, teams: 15 };
const ALKU_H = 9;
const LOPPU_H = 18;
const TZ = "Europe/Helsinki";

/** Helsingin aikavyohykkeen siirtyma minuutteina annettuna hetkena. */
function siirtyma(d: Date): number {
  const s = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "shortOffset" })
    .formatToParts(d)
    .find((p) => p.type === "timeZoneName")!.value; // "GMT+3"
  const m = /GMT([+-]\d+)(?::(\d+))?/.exec(s);
  return m ? Number(m[1]) * 60 + Math.sign(Number(m[1])) * Number(m[2] ?? 0) : 0;
}

/** Helsingin paivamaara (y, kk, pv) kellonaikana h:m -> UTC-hetki. */
export function helsinki(y: number, kk: number, pv: number, h: number, m = 0): Date {
  const arvio = new Date(Date.UTC(y, kk - 1, pv, h, m));
  return new Date(arvio.getTime() - siirtyma(arvio) * 60_000);
}

function helsinkiPaiva(d: Date) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" }).formatToParts(d);
  const g = (t: string) => p.find((x) => x.type === t)!.value;
  return { y: Number(g("year")), kk: Number(g("month")), pv: Number(g("day")), vp: g("weekday") };
}

/** Paasiaissunnuntai (gregoriaaninen, Meeus/Jones/Butcher). */
function paasiainen(y: number): [number, number] {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const kk = Math.floor((h + l - 7 * m + 114) / 31);
  return [kk, ((h + l - 7 * m + 114) % 31) + 1];
}

/** Arkipaivalle osuvat pyhat ja aatot, joina kartoituksia ei pideta. */
function pyha(y: number, kk: number, pv: number): boolean {
  const k = `${kk}-${pv}`;
  if (["1-1", "1-6", "5-1", "12-6", "12-24", "12-25", "12-26"].includes(k)) return true;
  if (kk === 6 && pv >= 19 && pv <= 25 && new Date(Date.UTC(y, 5, pv)).getUTCDay() === 5) return true; // juhannusaatto
  const [pk, pp] = paasiainen(y);
  const p = Date.UTC(y, pk - 1, pp);
  const t = Date.UTC(y, kk - 1, pv);
  const ero = Math.round((t - p) / 86_400_000);
  return ero === -2 || ero === 1 || ero === 39; // pitkaperjantai, 2. paasiaispaiva, helatorstai
}

/** Montako kalenteripaivaa ensimmaisesta varattavasta paivasta tarjotaan. */
export const JAKSO_PV = 30;

/** Varattavat arkipaivat: ensimmainen on 3. arkipaiva tanaan laskettuna,
 *  ja siita eteenpain kaikki arkipaivat JAKSO_PV kalenteripaivan ajan
 *  (ensimmainen paiva mukaan lukien). Pyhat eivat ole arkipaivia. */
export function varattavatPaivat(nyt = new Date()): { y: number; kk: number; pv: number }[] {
  const out: { y: number; kk: number; pv: number }[] = [];
  let arkipaivia = 0;
  let eka = -1;
  for (let i = 1; i < 60; i++) {
    if (eka >= 0 && i >= eka + JAKSO_PV) break;
    const d = new Date(nyt.getTime() + i * 86_400_000);
    const h = helsinkiPaiva(d);
    if (h.vp === "Sat" || h.vp === "Sun" || pyha(h.y, h.kk, h.pv)) continue;
    arkipaivia++;
    if (arkipaivia >= 3) {
      if (eka < 0) eka = i;
      out.push({ y: h.y, kk: h.kk, pv: h.pv });
    }
  }
  return out;
}

export function vapaat(paivat: { y: number; kk: number; pv: number }[], varatut: Varattu[], tapa: Tapa) {
  const puskuri = PUSKURI[tapa] * 60_000;
  return paivat.map((p) => {
    const ajat: string[] = [];
    for (let min = ALKU_H * 60; min + KESTO_MIN <= LOPPU_H * 60; min += 30) {
      const alku = helsinki(p.y, p.kk, p.pv, Math.floor(min / 60), min % 60);
      const loppu = new Date(alku.getTime() + KESTO_MIN * 60_000);
      const a = alku.getTime() - puskuri;
      const l = loppu.getTime() + puskuri;
      if (!varatut.some((v) => v.alku < l && v.loppu > a)) ajat.push(alku.toISOString());
    }
    return { paiva: `${p.y}-${String(p.kk).padStart(2, "0")}-${String(p.pv).padStart(2, "0")}`, ajat };
  });
}

export function onVarattavissa(iso: string, varatut: Varattu[], tapa: Tapa, nyt = new Date()): boolean {
  const lista = vapaat(varattavatPaivat(nyt), varatut, tapa);
  return lista.some((p) => p.ajat.includes(iso));
}
