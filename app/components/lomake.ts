/**
 * LOMAKKEEN LAHETYS SELAIMESTA (6.10.2026), ks. app/api/lomake/route.ts.
 *
 * Kaikki sivuston lomakkeet lahettavat taman kautta: yhteysikkuna,
 * tarjouspyynto ja avoin hakemus. Tyhjat kentat jatetaan pois.
 */
export type LomakeTyyppi = "yhteys" | "tarjous" | "hakemus";

/** Liitteiden yhteiskoko enintaan 4 Mt (palvelimen raja 4,5 Mt). */
export const LIITTEET_MAX = 4 * 1024 * 1024;
export const liitteetLiianIsot = (t: File[]) => t.reduce((s, x) => s + x.size, 0) > LIITTEET_MAX;

export async function lahetaLomake(
  tyyppi: LomakeTyyppi,
  kentat: Record<string, string | undefined | null>,
  liitteet: File[] = [],
): Promise<boolean> {
  const f = new FormData();
  f.set("tyyppi", tyyppi);
  for (const [k, v] of Object.entries(kentat)) {
    const arvo = (v ?? "").trim();
    if (arvo) f.set(k, arvo);
  }
  if (!f.has("sivu")) f.set("sivu", location.pathname);
  for (const t of liitteet) f.append("liite", t, t.name);
  try {
    const r = await fetch("/api/lomake", { method: "POST", body: f });
    return r.ok;
  } catch {
    return false;
  }
}
