import HeroBrowserStage from "../../components/HeroBrowserStage";
import WordSwap from "../../components/WordSwap";

import Rakentuu, { Mittakisko } from "./Rakentuu";

/**
 * VERKKOSIVUJEN HERO.
 *
 * Otsikko ja leipateksti olivat ylhaalla keskella ja nayttamo niiden
 * alla, jolloin ensimmainen ruutu oli pelkkaa tekstia ja todiste jai
 * taitteen alle. Nyt teksti on VASEMMALLA sivussa ja nayttamo
 * oikealla, eli lupaus ja naytto ovat samassa silmayksessa. Sama
 * vasen reuna kuin muulla sivulla, joten hero ei ole enaa sivun ainoa
 * keskitetty kohta.
 *
 * NAYTTAMO ON TIIVIS. Se oli lahes koko ruudun korkuinen ja tayttyi
 * omilla kuplillaan: latausaika, toimitusaika ja hakutulossijoitus
 * kelluivat sen ympärilla. Ne sanoivat saman minka kolme riviä
 * tekstia sanoo paremmin heti vieressa, ja ne peittivat itse
 * mockupin. Yksi lipuke jaa: PageSpeed-pistemittari, koska se on
 * ainoa joka kertoo jotain mita teksti ei kerro.
 *
 * TAUSTA RAKENTUU VIERITTAESSA. Ks. Rakentuu.tsx.
 */
const WORDS = [
  "löytyvät Googlesta.",
  "latautuvat sekunnissa.",
  "muuttavat kävijät yhteydenotoiksi.",
  "kestävät vuosia.",
];

export default function Hero() {
  return (
    <header className="hero vs-hero">
      <Rakentuu />
      <div className="wrap hero-split">
        <Mittakisko />
        <div className="hero-copy">
          {/* KAKSI TAITTOA, EI YKSI. Otsikko nousi 48,5px:sta 69px:aan,
              ja silloin "Verkkosivut yritykselle, jotka" vaatii 890px
              mutta palsta on 736px. Yhdella taitolla rivi katkesi
              itsestaan ja "jotka" jai yksin omalle rivilleen. Taitto
              kirjoitetaan siis auki: kaksi tasapainoista riviä ja
              vaihtuva lause omanaan. */}
          <h1 className="li d2">
            Verkkosivut
            <br />
            yritykselle, jotka
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
