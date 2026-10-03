import { OG_KOKO, OG_TYYPPI, ogKuva } from "../og-kuva";

export const alt = "WS Median yhteystiedot";
export const size = OG_KOKO;
export const contentType = OG_TYYPPI;

export default function Image() {
  return ogKuva({
    kick: "Yhteystiedot",
    otsikko: "040 564 8770",
    korostus: "info@wsmedia.fi",
  });
}
