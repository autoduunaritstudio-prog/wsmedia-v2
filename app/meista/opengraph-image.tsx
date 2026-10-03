import { OG_KOKO, OG_TYYPPI, ogKuva } from "../og-kuva";

export const alt = "WS Media, espoolainen mainostoimisto";
export const size = OG_KOKO;
export const contentType = OG_TYYPPI;

export default function Image() {
  return ogKuva({
    kick: "Meistä",
    otsikko: "Kuvaamme, rakennamme",
    korostus: "ja hoidamme näkyvyyden.",
  });
}
