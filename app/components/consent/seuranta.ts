/**
 * GOOGLE ADS -KONVERSIOT (8.10.2026).
 *
 * Kayttaa Analytics.tsx:n lataaman gtag.js:n window.gtag-funktiota. Ads ei
 * ole GA4-tagin kohde (eri Google-tunnukset), joten Analytics.tsx tekee
 * gtag('config', 'AW-...') kerran jokaiselle AW_TUNNUKSET-tunnukselle samaan
 * gtag.js:aan. Toista skriptia ei ladata. window.gtag on olemassa vasta kun
 * kavija on hyvaksynyt evasteet ja tagi on ladattu. Jos suostumus on
 * myohemmin peruttu, tagi on yha sivulla, joten suostumus tarkistetaan
 * erikseen ennen lahetysta.
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

/** Tarkistaa send_to-arvon ja palauttaa sen AW-tunnuksen
 *  ("AW-123/abc" -> { sendTo: "AW-123/abc", aw: "AW-123" }) tai null.
 *  Arvon on alettava "AW-" ja sisallettava kauttaviiva, ja tunnusosassa saa
 *  olla vain kirjaimia, numeroita, "-" ja "_", koska se kirjoitetaan
 *  init-skriptiin. Sama tarkistus koskee configia ja conversion-tapahtumaa. */
const SEND_TO_MUOTO = /^(AW-[A-Za-z0-9_-]+)\/\S+$/;
function tarkistaSendTo(arvo: string | undefined): { sendTo: string; aw: string } | null {
  const sendTo = arvo?.trim() ?? "";
  const m = SEND_TO_MUOTO.exec(sendTo);
  return m ? { sendTo, aw: m[1] } : null;
}

/** send_to-arvojen AW-tunnukset, uniikit. Virheelliset ohitetaan hiljaa. */
export const AW_TUNNUKSET: string[] = [
  ...new Set(
    Object.values(SEND_TO).flatMap((v) => {
      const t = tarkistaSendTo(v);
      return t ? [t.aw] : [];
    }),
  ),
];

const GA4_TAPAHTUMA = { lomake: "generate_lead", varaus: "generate_lead", puhelu: "phone_click" } as const;

export type Konversio = keyof typeof SEND_TO;

export function kirjaaKonversio(laji: Konversio, tiedot: Record<string, string> = {}): void {
  try {
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g !== "function" || !readConsent()?.analytics) return;
    g("event", GA4_TAPAHTUMA[laji], { laji, ...tiedot });
    const t = tarkistaSendTo(SEND_TO[laji]);
    if (t) g("event", "conversion", { send_to: t.sendTo });
  } catch {
    // Mittaus ei saa koskaan katkaista lomaketta tai varausta.
  }
}
