/**
 * BOTTISUOJA, SELAINPUOLI (8.10.2026). Vercel BotID: nakymaton haaste,
 * ei CAPTCHA-ruutua. Palvelinpuoli: app/api/bottisuoja.ts.
 *
 * initBotId() kaarii window.fetchin niin, etta suojattuihin osoitteisiin
 * lahtevaan pyyntoon liitetaan haasteen ratkaisu. Haasteskripti (~25 kt
 * Vercelilta) haetaan vasta ensimmaisen suojatun lahetyksen yhteydessa.
 * Kirjastoa ei ladata jokaisella sivulatauksella (instrumentation-client),
 * vaan vasta kun kayttaja koskee lomakkeeseen: Kehotukset alustaa sen
 * ensimmaisesta lomakekentan fokuksesta, ja lahetyskohdat (lomake.ts,
 * VarausIkkuna) varmistavat alustuksen ennen lahetysta. MITATTU
 * (tuotantobuild, Chromium ja WebKit): sivulatauksessa 0 BotID-pyyntoa,
 * lahetykseen liittyy x-is-human-otsake.
 *
 * Suojatut: kaikki lomakkeet (/api/lomake) ja ajanvaraus (POST
 * /api/varaus). Vapaiden aikojen haku (GET /api/varaus) ei ole suojattu.
 */
let alustus: Promise<void> | null = null;

export function alustaBotId(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!alustus) {
    alustus = import("botid/client/core")
      .then(({ initBotId }) => {
        initBotId({
          protect: [
            { path: "/api/lomake", method: "POST" },
            { path: "/api/varaus", method: "POST" },
          ],
        });
      })
      /* Jos kirjasto ei lataudu (esto-ohjelma, verkko), lomake lahtee
         silti ja palvelin paattaa. Epaonnistunut alustus EI jaa
         muistiin: seuraava yritys yrittaa uudelleen. */
      .catch(() => {
        alustus = null;
      });
  }
  return alustus;
}

/**
 * AIKARAJA LAHETYKSELLE. BotID ratkaisee haasteen kaaritun fetchin
 * sisalla ennen kuin pyynto lahtee. Jos haasteskriptin lataus
 * epaonnistuu kerran, kirjasto jattaa script-elementin paikalleen ja
 * seuraava yritys jaa odottamaan loputtomiin (botid 1.5.11,
 * client/core: getChallenge). Aikaraja muuttaa jumin tavalliseksi
 * virheeksi, jolloin kayttaja nakee virheilmoituksen puhelinnumeroineen.
 * Raja kasvaa liitteiden koon mukaan (hidas yhteys, 4 Mt hakemus).
 */
export function aikarajalla<T>(lupaus: Promise<T>, liitteetTavua = 0): Promise<T> {
  const ms = 20_000 + Math.ceil(liitteetTavua / 25_000) * 1000;
  return new Promise<T>((ok, virhe) => {
    const t = window.setTimeout(() => virhe(new Error("aikaraja")), ms);
    lupaus.then(
      (v) => { window.clearTimeout(t); ok(v); },
      (e) => { window.clearTimeout(t); virhe(e); },
    );
  });
}
