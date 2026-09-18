import WordSwap from "../../components/WordSwap";

import HeroFilm from "./HeroFilm";

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
 * YKSI VIERITYKSEEN SIDOTTU LIIKE, EI KAHTA. Herossa oli rautalanka-
 * malli (Rakentuu) ja sen mittakisko, jotka rakensivat sivun
 * vierityksen mukana. Kun elokuva tekee saman asian oikealla
 * materiaalilla, kaksi vierityksen ohjaamaa animaatiota samassa
 * nakymassa kilpailee keskenaan eika kumpaakaan ehdi katsoa.
 * Rautalanka ja kisko poistuivat, elokuva jai.
 *
 * NAYTTAMON TILALLA ON ELOKUVA. HeroBrowserStage oli staattinen
 * selainmockup oikeassa palstassa. Sen tilalla on nyt koko heron
 * kokoinen vierityselokuva (HeroFilm): kamera peruuttaa koodinaytolta
 * laajaan tyopoytakuvaan ja valojuovat rakentavat verkkosivun
 * elementti kerrallaan. Mockup naytti valmiin sivun, elokuva nayttaa
 * sen syntymisen, ja se on sama asia kuin mita sivu myy.
 *
 * Teksti, WordSwap, napit ja luottamusrivi jaavat DOM-overlayksi
 * elokuvan paalle: ne ovat sivun sisaltoa, eivat kuvaa, ja ne on
 * luettava myos ilman JS:aa ja ruudunlukijalla.
 */
/* VAIHTUVAN RIVIN ON MAHDUTTAVA YHDELLE RIVILLE.
   Kolme lausetta oli yhden rivin mittaisia ja neljas kahden, joten
   otsikko hyppasi korkeutta kesken vaihdon. Mitattu 82px:n koolla
   otsikon omalla fontilla: 720, 837, 1278 ja 600 pikselia, kun palsta
   on 880. Vain kolmas ylitti, ja se lyheni samaa asiaa sanovaksi:
   1278 -> 839. Nyt pisin on 839 eli 41px palstaa kapeampi. */
const WORDS = [
  "löytyvät Googlesta.",
  "latautuvat sekunnissa.",
  "tuovat yhteydenottoja.",
  "kestävät vuosia.",
];

export default function Hero() {
  return (
    <header className="hero vs-hero">
      <HeroFilm />
      <div className="wrap hero-split">
        <div className="hero-copy">
          {/* KAKSI TAITTOA, EI YKSI. Otsikko nousi 48,5px:sta 69px:aan,
              ja silloin "Verkkosivut yritykselle, jotka" vaatii 890px
              mutta palsta on 736px. Yhdella taitolla rivi katkesi
              itsestaan ja "jotka" jai yksin omalle rivilleen. Taitto
              kirjoitetaan siis auki: kaksi tasapainoista riviä ja
              vaihtuva lause omanaan. */}
          <h1 className="li d2" id="paasisalto" tabIndex={-1}>
            Verkkosivut{" "}
            <br />
            yritykselle, jotka{" "}
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
        </div>
      </div>
    </header>
  );
}
