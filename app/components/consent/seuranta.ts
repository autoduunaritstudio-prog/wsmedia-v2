/**
 * KONVERSIOT OLEMASSA OLEVAN GOOGLE-TAGIN KAUTTA (8.10.2026).
 *
 * Kayttaa Analytics.tsx:n lataaman tagin window.gtag-funktiota. Ei lataa
 * mitaan, ei tee config-kutsua eika lisaa toista tagia: Google Ads on saman
 * GA4-tagin kohde. window.gtag on olemassa vasta kun kavija on hyvaksynyt
 * evasteet ja tagi on ladattu. Jos suostumus on myohemmin peruttu, tagi on
 * yha sivulla, joten suostumus tarkistetaan erikseen ennen lahetysta.
 *
 * send_to-arvot (muotoa AW-.../...) tulevat kaannoksessa Vercelin
 * ymparistomuuttujista. Tyhja muuttuja = Ads-konversiota ei laheteta
 * (GA4-tapahtuma lahtee silti, ks. kampanjasuunnitelman varatapa).
 */
import { readConsent } from "./consent";

const SEND_TO = {
  lomake: process.env.NEXT_PUBLIC_GADS_SEND_TO_LOMAKE,
  varaus: process.env.NEXT_PUBLIC_GADS_SEND_TO_VARAUS,
  puhelu: process.env.NEXT_PUBLIC_GADS_SEND_TO_PUHELU,
} as const;

const GA4_TAPAHTUMA = { lomake: "generate_lead", varaus: "generate_lead", puhelu: "phone_click" } as const;

export type Konversio = keyof typeof SEND_TO;

export function kirjaaKonversio(laji: Konversio, tiedot: Record<string, string> = {}): void {
  try {
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g !== "function" || !readConsent()?.analytics) return;
    g("event", GA4_TAPAHTUMA[laji], { laji, ...tiedot });
    const s = SEND_TO[laji]?.trim();
    if (s) g("event", "conversion", { send_to: s });
  } catch {
    // Mittaus ei saa koskaan katkaista lomaketta tai varausta.
  }
}
