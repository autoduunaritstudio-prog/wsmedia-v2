/**
 * Numerorullauksen jasennys ja muotoilu.
 *
 * Omana moduulinaan kahdesta syysta: logiikka on puhdasta (ei DOMia), ja
 * monotonisuussimulaatio voi ajaa tasmalleen taman koodin sen sijaan etta
 * testaisi kopiota.
 *
 * Periaate: luku kasitellaan yhtena kokonaislukuna, ei merkki kerrallaan.
 * Aiempi merkkikohtainen odometri sai jokaisen numeron pyorimaan omaan
 * tahtiinsa, jolloin KOKO luku hyppi epaloogisesti (150:tta kohti menteassa
 * valilla 300, 500, 254). Kokonaisluku interpoloidaan 0:sta tavoitteeseen ja
 * muotoilu - tuhaterottimet, desimaalipilkku, etu- ja jalkiliitteet -
 * lasketaan vasta viimeisena vaiheena hetkellisesta arvosta.
 */

export type CountFormat = {
  /** Ennen lukua oleva kiintea osa, esim. "+". */
  prefix: string;
  /** Luvun jalkeen tuleva kiintea osa, esim. "+" tai " %" tai "/5". */
  suffix: string;
  /** Tavoitearvo kokonaislukuna, esim. "4,8/5" -> 48. */
  value: number;
  /** Desimaalien maara, esim. "4,8" -> 1. Erottimena pilkku. */
  decimals: number;
  /** Tuhaterotin sellaisena kuin se lahteessa on (usein sitomaton valilyonti). */
  groupSep: string;
  /** Nollatayton leveys. Sailyttaa placeholderien muodon, esim. "000 000". */
  pad: number;
};

/**
 * Poimii ensimmaisen numerojakson. Erotin kelpaa jaksoon vain jos sita
 * seuraa numero, joten "+00 %" -> "00" ja "4,8/5" -> "4,8".
 */
const RUN = /[0-9](?:[0-9]|[.,\u00A0 ](?=[0-9]))*/;

export function parseCount(raw: string): CountFormat | null {
  const m = RUN.exec(raw);
  if (!m) return null;

  const run = m[0];
  const digits = run.replace(/[^0-9]/g, "");
  const comma = run.search(/[.,]/);
  const decimals = comma === -1 ? 0 : run.slice(comma + 1).replace(/[^0-9]/g, "").length;
  const sep = run.match(/[\u00A0 ]/);

  return {
    prefix: raw.slice(0, m.index),
    suffix: raw.slice(m.index + run.length),
    value: Number(digits),
    decimals,
    groupSep: sep ? sep[0] : "",
    // Placeholderit kuten "000 000" alkavat nollalla: niissa nollatayte
    // sailyttaa muodon. Oikeissa luvuissa taytetaan vain sen verran etta
    // desimaalipilkulle jaa kokonaisosa.
    pad: digits[0] === "0" && digits.length > 1 ? digits.length : decimals + 1,
  };
}

/** Muotoilee hetkellisen kokonaisluvun lahteen mukaiseen asuun. */
export function formatCount(v: number, f: CountFormat): string {
  let s = String(v).padStart(f.pad, "0");
  let frac = "";
  if (f.decimals > 0) {
    frac = "," + s.slice(-f.decimals);
    s = s.slice(0, -f.decimals) || "0";
  }
  if (f.groupSep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, f.groupSep);
  return f.prefix + s + frac + f.suffix;
}

/** Nopea alku, pehmea pysahtyminen. Aidosti kasvava valilla [0,1]. */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
