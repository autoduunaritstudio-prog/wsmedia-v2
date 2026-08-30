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
    <header className="hero">
      <div className="wrap">
        <div className="herogrid">
          <div className="herotext">
            <p className="kick li d1">Lyhytvideot · Verkkosivut · Tapahtumat</p>
            <h1 className="li d2" data-par="0.05">
              Sisältöä, joka
              <br />
              <WordSwap words={WORDS} />
            </h1>
            <p className="sub li d3" data-par="0.035">
              Lyhytvideot, verkkosivut ja tapahtumat samalta tiimiltä. Kiinteä hinta, ei pitkiä
              sopimuksia. Sinä hyväksyt, me hoidamme loput.
            </p>
            <div className="heroctas li d4" data-par="0.025">
              <a className="btn mag" href="#lomake">
                Pyydä tarjous
              </a>
              <a className="tlink" href="#tulokset">
                Katso tuloksia
              </a>
            </div>
          </div>

          {/* Ruutuscrub. Canvas ei ole LCP-ehdokas (spesifikaatio laskee
              vain img, svg image, videon posterin, taustakuvalliset lohkot
              ja tekstisolmut), joten LCP pysyy h1:ssa. */}
          <HeroScrub />
        </div>
      </div>

      {/* Tummennus omana kerroksenaan heron sisalla: se ei ole sidottu
          mihinkaan heron sisaltoon, joten scrub-canvas sen alla voi
          muuttua vapaasti. Voimakkuus tulee --scrim-opacity-muuttujasta
          jonka SiteEffects paivittaa. */}
      <div id="hero-scrim" aria-hidden="true" />
    </header>
  );
}
