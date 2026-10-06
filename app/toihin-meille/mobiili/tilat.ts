/* TOIHIN MEILLE, PUHELINVERSIO: valilehtien, karusellin ja valintojen
   tilakohtaiset tyylit suunnitelman renderVals()-funktiosta sanasta
   sanaan (Toihin.dc.html). Sama lahde palvelinmerkinnalle (alkutila)
   ja Efektit.tsx:lle (vaihdot), jotta arvot eivat erkane. */

/** roolit: bg, fg, reuna */
export const rooliTyyli = (on: boolean) => ({
  bg: on ? "rgba(111,236,255,.14)" : "rgba(255,255,255,.035)",
  fg: on ? "#eafcff" : "#9fb0bf",
  reuna: on ? "inset 0 0 0 1.5px #6fecff" : "inset 0 0 0 1px rgba(255,255,255,.08)",
});

/** mallit: tabBg, tabFg */
export const malliTyyli = (on: boolean) => ({
  tabBg: on ? "#6fecff" : "transparent",
  tabFg: on ? "#0b0f14" : "#c9d6e2",
});

/** askeleet: i <= askel = on, i === askel = nyt */
export const askelTyyli = (i: number, askel: number) => {
  const on = i <= askel;
  const nyt = i === askel;
  return {
    nBg: on ? "#6fecff" : "#0b131d",
    nFg: on ? "#0b0f14" : "#8fa3b5",
    bg: nyt ? "linear-gradient(180deg, rgba(111,236,255,.1), #0e161f)" : "#0e161f",
    reuna: nyt ? "inset 0 0 0 1px rgba(111,236,255,.4)" : "inset 0 0 0 1px rgba(255,255,255,.08)",
  };
};

/** od: 0 = Odotamme (syaani), 1 = Emme vaadi (oranssi) */
export const odTyyli = (nappi: 0 | 1, od: number) => {
  const on = od === nappi;
  return {
    bg: on ? (nappi === 0 ? "#6fecff" : "#ff9a4d") : "transparent",
    fg: on ? "#0b0f14" : "#c9d6e2",
  };
};

/** taidot: bg, fg, reuna */
export const taitoTyyli = (on: boolean) => ({
  bg: on ? "#6fecff" : "rgba(255,255,255,.05)",
  fg: on ? "#0b0f14" : "#dbe5ee",
  reuna: on ? "none" : "inset 0 0 0 1px rgba(255,255,255,.14)",
});

/** hMalli: bg, fg */
export const hMalliTyyli = (on: boolean) => ({
  bg: on ? "#6fecff" : "transparent",
  fg: on ? "#0b0f14" : "#c9d6e2",
});

export const HMALLIT = ["Toimeksianto", "Työsuhde", "Kumpi tahansa"];
