import type { CSSProperties } from "react";
import type { ServiceMenuItem } from "./site-data";

/**
 * Palvelusivujen viivamerkit taysvalikkoon (4.10.2026).
 *
 * Jokainen merkki tiivistaa oman sivunsa paavisuaalin: puhelin ja
 * toistonappi (lyhytvideot), selainikkuna (verkkosivut), Bezier-kayra
 * kahvoineen (graafinen suunnittelu) ja suurennuslasi nousevin pylvain
 * (SEO). Merkit piirtyvat viiva kerrallaan: jokaisella polulla on
 * pathLength 1, joten stroke-dashoffset 1 -> 0 piirtaa sen alusta
 * loppuun pituudesta riippumatta. --j porrastaa polut.
 *
 * Vain <path>-elementteja: pathLength rect- ja circle-elementeilla ei ole
 * kaikissa Safareissa luotettava.
 */
const POLUT: Record<ServiceMenuItem["icon"], string[]> = {
  video: [
    "M18 5h12a4 4 0 0 1 4 4v30a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4z",
    "M21.5 18.5 30 24l-8.5 5.5z",
    "M22 9.5h4",
  ],
  site: [
    "M8 9h32a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3z",
    "M5 16h38",
    "M10 23h14M10 28h10M10 33h12",
    "M30 22h8v11h-8z",
  ],
  design: [
    "M8 37C14 10 34 38 40 11",
    "M8 37 15 15M40 11 33 33",
    "M6 35h4v4H6zM38 9h4v4h-4z",
    "M13.4 15a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0M31.4 33a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0-3.2 0",
  ],
  seo: [
    "M20 9a11 11 0 1 1 0 22a11 11 0 1 1 0-22z",
    "M28 28l12 12",
    "M15 25v-3M20 25v-7M25 25v-11",
  ],
  event: [
    "M8 12h32v28H8z",
    "M8 19h32",
    "M16 8v7M32 8v7",
  ],
};

export default function PalveluMerkki({
  p,
  className,
}: {
  p: ServiceMenuItem["icon"];
  className: string;
}) {
  return (
    <svg className={className} data-p={p} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      {POLUT[p].map((d, j) => (
        <path key={d} d={d} pathLength={1} style={{ "--j": j } as CSSProperties} />
      ))}
    </svg>
  );
}
