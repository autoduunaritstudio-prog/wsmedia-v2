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
            Sisältöä, joka
            <br />
            <WordSwap words={WORDS} />
          </h1>
          {/* .sub nousi otsikon yhteyteen. Vali on .hero .sub -saannon
              oma margin-top 22px, sama kuin alkuperaisessa pinotussa
              asettelussa - ei uutta lukua. */}
          <p className="sub">
            Lyhytvideot, verkkosivut ja tapahtumat samalta tiimiltä. Kiinteä hinta, ei pitkiä
            sopimuksia. Sinä hyväksyt, me hoidamme loput.
          </p>
          {/* Nappirivi nousi samaan ryhmaan. Vali on .heroctas-saannon
              oma margin-top 34px, sama kuin alkuperaisessa pinotussa
              asettelussa - ei uutta lukua.

              "Varaa kartoitus" on <button type="button">, ei <a>:
              napilla ei ole viela kohdetta, ja href="#" hyppaisi sivun
              alkuun kun taas <a> ilman hrefia putoaisi pois
              nappaimistojarjestyksesta. Ei disabled-attribuuttia, jotta
              nappi nayttaa ja kayttaytyy aktiivisena. Ulkoasu on
              sivuston oma sekundaarityyli .btn.alt. */}
          <div className="heroctas">
            <a className="btn mag" href="#lomake">
              Pyydä tarjous
            </a>
            <button className="btn alt" type="button">
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
