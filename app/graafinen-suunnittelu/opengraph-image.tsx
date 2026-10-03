import { OG_KOKO, OG_TYYPPI, ogKuva } from "../og-kuva";

export const alt = "WS Media, graafinen suunnittelu yritykselle";
export const size = OG_KOKO;
export const contentType = OG_TYYPPI;

export default function Image() {
  return ogKuva({
    kick: "Graafinen suunnittelu",
    otsikko: "Logosta",
    korostus: "auton kylkeen.",
  });
}
