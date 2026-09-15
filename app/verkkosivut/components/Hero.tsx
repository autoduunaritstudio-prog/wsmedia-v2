import HeroBrowserStage from "../../components/HeroBrowserStage";
import WordSwap from "../../components/WordSwap";

/**
 * VERKKOSIVUJEN HERO, SAMA RUNKO KUIN ETUSIVULLA JA LYHYTVIDEOSIVULLA.
 *
 * Kaksi palstaa: teksti vasemmalle, selainnayttamo oikealle. Aiemmin
 * otsikko, teksti ja nayttamo olivat pinossa, jolloin nayttamo jai
 * mitattuna taitteen alle eika ensimmaisessa ruudussa nakynyt yhtaan
 * todistetta siita mita sivu myy. Rinnakkain lupaus ja naytto ovat
 * samassa silmayksessa.
 *
 * ERO ETUSIVUUN ON TARKOITUKSELLINEN JA YHDENSUUNTAINEN. Etusivun hero
 * on tumma ja videopohjainen, tama on vaalea ja metallikuvion paalla.
 * Alasivu ei saa olla etusivua nayttavampi, mutta sen on luettava saman
 * sivuston sivuna: sama rakenne, sama typografia, sama logonauha ja
 * sama lukukaista coverin ylaosassa.
 *
 * Vain ensimmainen lause renderoityy palvelimella, jotta H1 pysyy
 * hakukoneelle yhtena lauseena.
 */
const WORDS = [
  "löytyvät Googlesta.",
  "latautuvat sekunnissa.",
  "muuttavat kävijät yhteydenotoiksi.",
  "kestävät vuosia.",
];

export default function Hero() {
  return (
    <header className="hero">
      <div className="wrap hero-split">
        <div className="hero-copy">
          <h1 className="li d2">
            Verkkosivut yritykselle, jotka
            <br />
            <WordSwap words={WORDS} deferToClient />
          </h1>
          <p className="sub li d3">
            Verkkosivujen suunnittelu ja toteutus avaimet käteen: sivurakenne, tekstit, tekninen
            hakukoneoptimointi ja julkaisu. Perussivustosta täysin räätälöityyn toteutukseen,
            kiinteällä projektihinnalla.
          </p>
          <div className="heroctas li d4">
            <a className="btn mag" href="#tarjous">
              Pyydä tarjous
            </a>
            <a className="tlink" href="#hinnoittelu">
              Katso mitä verkkosivut maksavat
            </a>
          </div>
          <p className="herotrust li d4">
            <span>
              <i />
              Kiinteä projektihinta, ei piilokuluja
            </span>
            <span>
              <i />
              Valmis 2–4 viikossa
            </span>
            <span>
              <i />
              Espoo · Helsinki · koko Suomi
            </span>
          </p>
        </div>

        <HeroBrowserStage />
      </div>
    </header>
  );
}
