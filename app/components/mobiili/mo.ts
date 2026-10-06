export const mo = (s?: string | null) =>
  s ? s.split(/\s+/).filter(Boolean).map((c) => "mo-" + c).join(" ") : "";

/** Laiskan kuvan paikanpitaja: lapinakyva 1x1 GIF, ei verkkopyyntoa. Oikea osoite on data-mo-src:ssa. */
export const TYHJA = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/* Logonauhan kuvasuhteet (public/mobiili/logot ja /meista/*-valk, 80 px
   korkeat). width- ja height-attribuutit varaavat leveyden ennen latausta,
   jottei nauhan max-content-leveys ja translateX(-50%) hypi. */
const LOGO_SUHDE: Record<string, number> = {
  colormaster: 188 / 80,
  "ls-monogram-color": 1,
  "porsche-club-finland": 265 / 80,
  "tesla-owners-finland-color": 83 / 80,
  "ydr-autohuolto": 265 / 80,
};
export const logoLeveys = (src: string, h: number) => {
  const nimi = (src.split("/").pop() || "").replace(/(-valk)?\.(webp|png)$/, "");
  return Math.round(h * (LOGO_SUHDE[nimi] ?? 1));
};
