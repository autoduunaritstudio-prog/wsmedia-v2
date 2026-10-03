import { OG_KOKO, OG_TYYPPI, ogKuva } from "../og-kuva";

export const alt = "Töihin WS Medialle";
export const size = OG_KOKO;
export const contentType = OG_TYYPPI;

export default function Image() {
  return ogKuva({
    kick: "Töihin meille",
    otsikko: "Tekijöitä videoon,",
    korostus: "webiin ja ilmeeseen.",
  });
}
