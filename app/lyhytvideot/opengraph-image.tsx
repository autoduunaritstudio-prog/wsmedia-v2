import { OG_KOKO, OG_TYYPPI, ogKuva } from "../og-kuva";

export const alt = "WS Media, lyhytvideotuotanto yrityksille";
export const size = OG_KOKO;
export const contentType = OG_TYYPPI;

export default function Image() {
  return ogKuva({
    kick: "Lyhytvideotuotanto",
    otsikko: "Lyhytvideot yrityksille,",
    korostus: "avaimet käteen.",
  });
}
