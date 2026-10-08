/**
 * BOTTISUOJA, PALVELINPUOLI (8.10.2026). Vercel BotID, ks.
 * app/components/botid.ts.
 *
 * Tarkistus tehdaan ennen mitaan muuta kasittelya, ettei botin lahetysta
 * lueta, tallenneta eika siita lahde sahkopostia. Botin vastaus on 403,
 * jolloin lomake nayttaa tavallisen virheilmoituksen puhelinnumeroineen:
 * jos ihminen luokitellaan joskus vaarin, han nakee virheen eika viesti
 * katoa hiljaa.
 *
 * VIKATILANNE PAASTAA LAPI. Jos BotID-palvelu ei vastaa tai ymparisto ei
 * ole Vercel (paikallinen next start: VERCEL_OIDC_TOKEN puuttuu),
 * tarkistus kirjataan lokiin ja pyynto kasitellaan. Menetetty
 * yhteydenotto on pahempi kuin yksittainen roskaviesti, ja lomakkeiden
 * ansakentta suojaa silloinkin. Kehitystilassa BotID palauttaa aina
 * "ihminen".
 */
import { checkBotId } from "botid/server";

export async function onBotti(): Promise<boolean> {
  try {
    const v = await checkBotId();
    return v.isBot;
  } catch (e) {
    console.error("botid: tarkistus ei onnistunut, pyynto paastetaan", e);
    return false;
  }
}
