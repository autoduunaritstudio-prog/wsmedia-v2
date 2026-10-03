import { OG_KOKO, OG_TYYPPI, ogKuva } from "../og-kuva";

export const alt = "WS Media, hakukoneoptimointi yritykselle";
export const size = OG_KOKO;
export const contentType = OG_TYYPPI;

export default function Image() {
  return ogKuva({
    kick: "Hakukoneoptimointi",
    otsikko: "Löydy silloin,",
    korostus: "kun asiakas etsii palvelua.",
  });
}
