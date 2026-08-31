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
        {/* Ruutuscrub koko heron kokoisena. Canvas ei ole LCP-ehdokas. */}
        <HeroScrub />
        {/* Paikallinen gradientti vasemmasta alanurkasta: vastaa TEKSTIN
            luettavuudesta. Voimakkuus --hero-glow seuraa tekstin
            ilmestymista. */}
        <div className="hero-glow" aria-hidden="true" />
        {/* Globaali scrim: tunnelmaa, ei luettavuutta. --hero-scrim kasvaa
            nollasta p:n mukana ja jatkaa coverin noustessa. */}
        <div className="hero-scrim" aria-hidden="true" />
        <div className="wrap">
          {/* Ei .li-luokkia eika data-paria: ilmestyminen tulee kokonaan
              --st1..--st3:sta, jotka ovat puhtaita funktioita scrollista.
              Latausanimaatio ja parallaksi olisivat ajasta ja rectista
              riippuvia, eivatka purkautuisi taaksepain scrollatessa. */}
          <p className="kick">Lyhytvideot · Verkkosivut · Tapahtumat</p>
          <h1>
            Sisältöä, joka
            <br />
            <WordSwap words={WORDS} />
          </h1>
          <p className="sub">
            Lyhytvideot, verkkosivut ja tapahtumat samalta tiimiltä. Kiinteä hinta, ei pitkiä
            sopimuksia. Sinä hyväksyt, me hoidamme loput.
          </p>
          <div className="heroctas">
            <a className="btn mag" href="#lomake">
              Pyydä tarjous
            </a>
            <a className="tlink" href="#tulokset">
              Katso tuloksia
            </a>
          </div>
        </div>
      </header>
      {/* Scrollimatka scrubille. */}
      <div className="hero-spacer" aria-hidden="true" />
    </>
  );
}
