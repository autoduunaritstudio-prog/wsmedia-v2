import { OG_KOKO, OG_TYYPPI, ogKuva } from "./og-kuva";

export const alt = "WS Media, mainostoimisto Espoossa";
export const size = OG_KOKO;
export const contentType = OG_TYYPPI;

export default function Image() {
  return ogKuva({
    kick: "Mainostoimisto Espoossa",
    otsikko: "Lyhytvideot, verkkosivut",
    korostus: "ja näkyvyys samasta tiimistä.",
  });
}
