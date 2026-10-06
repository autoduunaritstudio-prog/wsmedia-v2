export const mo = (s?: string | null) =>
  s ? s.split(/\s+/).filter(Boolean).map((c) => "mo-" + c).join(" ") : "";

/** Laiskan kuvan paikanpitaja: lapinakyva 1x1 GIF, ei verkkopyyntoa. Oikea osoite on data-mo-src:ssa. */
export const TYHJA = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
