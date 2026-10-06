import HeroScrub from "./HeroScrub";
import WordSwap from "./WordSwap";

const WORDS = [
  "tuo asiakkaita.",
  "pysäyttää skrollauksen.",
  "tekee kauppaa.",
  "jää mieleen.",
];

export default function Hero() {
  return (
    <>
      <header className="hero">
        <HeroScrub />
        {/* Ylagradientti h1:n taakse. Taydessa voimassaan p = 0:sta, koska
            h1 on nakyvissa heti - alfa on siksi kirjoitettu suoraan
            variin eika muuttujaan. */}
        <div className="hero-glow-top" aria-hidden="true" />
        {/* Alanurkan gradientti .sub + .heroctas -ryhman taakse.
            --hero-glow seuraa niiden ikkunoita. */}
        <div className="hero-glow-bot" aria-hidden="true" />
        {/* Globaali scrim: tunnelmaa, ei luettavuutta. */}
        <div className="hero-scrim" aria-hidden="true" />
        {/* h1 omana lohkonaan nakyman ylaosassa, vaakakeskitettyna. Ei
            opacity- eika translate-animaatiota: se on LCP-elementti, ja
            opacity 0 poistaisi sen LCP-ehdokkaista latushetkella. */}
        <div className="wrap heroh1">
          <h1>
            Sisältöä, joka{" "}
            <br />
            {/* deferToClient: palvelimen HTML:ssa vain ensimmainen lause, jolloin
                H1 on hakukoneelle yksi luettava lause. */}
            <WordSwap words={WORDS} deferToClient />
          </h1>
          {/* .sub nousi otsikon yhteyteen. Vali on .hero .sub -saannon
              oma margin-top 22px, sama kuin alkuperaisessa pinotussa
              asettelussa - ei uutta lukua. */}
          <p className="sub">
            Espoolainen mainostoimisto, jolta saat lyhytvideot, verkkosivut ja graafisen ilmeen.
            Kiinteä hinta, ei pitkiä sopimuksia. Sinä hyväksyt, me hoidamme loput.
          </p>
          {/* Nappirivi nousi samaan ryhmaan. Vali on .heroctas-saannon
              oma margin-top 34px, sama kuin alkuperaisessa pinotussa
              asettelussa - ei uutta lukua.

              Napit avaavat ikkunat Kehotukset.tsx:n kautta (5.10.2026):
              "Pyydä tarjous" yhteyslomakkeen (data-yhteys) ja "Varaa
              kartoitus" varauskalenterin (data-varaus). */}
          <div className="heroctas">
            <button className="btn mag" type="button" data-yhteys="">
              Pyydä tarjous
            </button>
            <button className="btn alt" type="button" data-varaus="">
              Varaa kartoitus
            </button>
            <a className="tlink" href="#tulokset">
              Katso tuloksia
            </a>
          </div>
        </div>
      </header>
      <div className="hero-spacer" aria-hidden="true" />
    </>
  );
}
