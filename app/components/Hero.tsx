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
        {/* Ruutuscrub koko heron kokoisena. Canvas ei ole LCP-ehdokas
            (spesifikaatio laskee vain img, svg image, videon posterin,
            taustakuvalliset lohkot ja tekstisolmut), joten LCP pysyy
            h1:ssa. */}
        <HeroScrub />
        {/* Tummennus tekstin luettavuutta varten. Alfa on mitattu
            ruutujen 001, 038 ja 076 todellisista pikseleista siita
            kohdasta jossa teksti on - ks. globals.css. */}
        <div className="hero-scrim" aria-hidden="true" />
        <div className="wrap">
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
        {/* Coverin nousun tummennus. Eri kerros kuin .hero-scrim: tama
            on sidottu coverin sijaintiin, ei tekstin luettavuuteen, ja
            SiteEffects paivittaa sen --scrim-opacityn kautta. */}
        <div id="hero-scrim" aria-hidden="true" />
      </header>
      {/* Scrollimatka scrubille. Hero on pinnattuna sen ajan; kun spacer
          on kulutettu, .coverin ylareuna on tasan nakyman alareunassa. */}
      <div className="hero-spacer" aria-hidden="true" />
    </>
  );
}
