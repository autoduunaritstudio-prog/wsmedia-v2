import PhoneReel from "../../components/PhoneReel";
import WordSwap from "../../components/WordSwap";

/**
 * Ensimmainen lause on H1:ssa jo palvelimella, loput lisataan selaimessa.
 * Nain H1 pysyy hakukoneelle yhtena lauseena, kuten mockup edellyttaa.
 */
const WORDS = [
  "algoritmi nostaa.",
  "pysäyttävät skrollauksen.",
  "tuovat yhteydenottoja.",
  "katsotaan loppuun.",
];

export default function Hero() {
  return (
    <header className="hero">
      {/* KAKSI PALSTAA: teksti vasemmalle, mockupit oikealle.
          Pystysuuntainen jarjestys (otsikko - puhelimet - teksti) toimi
          vain jos jokin niista sai jaada taitteen alle. Rinnakkain
          kaikki mahtuu samaan ruutuun: lukija saa otsikon, lupauksen ja
          napin yhdella silmayksella ja naytteet niiden vieressa. */}
      <div className="wrap hero-split">
        <div className="hero-copy">
          <h1 className="li d2">
            Lyhytvideot yrityksille, jotka
            <br />
            <WordSwap words={WORDS} deferToClient />
          </h1>
          <p className="sub li d3">
            Avaimet käteen -lyhytvideotuotanto yrityksille: TikTok, Instagram Reels ja YouTube
            Shorts. Strategia, käsikirjoitus, kuvaus ja editointi yhdeltä tiimiltä, kiinteällä
            kuukausihinnalla.
          </p>
          <div className="heroctas li d4">
            <a className="btn mag" href="#tarjous">
              Pyydä tarjous
            </a>
            <a className="tlink" href="#hinnoittelu">
              Katso lyhytvideopaketit
            </a>
          </div>
          <p className="herotrust li d4">
            <span>
              <i />
              Vastaamme 24 tunnissa
            </span>
            <span>
              <i />
              Ei pitkiä sopimuksia
            </span>
            <span>
              <i />
              Espoo · Helsinki · koko Suomi
            </span>
          </p>
        </div>

        <div
          className="stage li d5"
          id="stage"
          aria-label="Esimerkkejä WS Median tuottamista lyhytvideoista"
        >
        <div className="chip-f cf1">
          <em>▲</em>
          <span>
            1,7 milj.<small>katselukertaa</small>
          </span>
        </div>
        {/* cf2 oikealle, cf3 vasemmalle - ks. .stickysub .stage .cfN
            globals.css:ssa. Jarjestys DOMissa ei ohjaa sijaintia. */}
        <div className="chip-f cf2">
          <em>✓</em>
          <span>
            Toimitettu<small>7 päivässä</small>
          </span>
        </div>
        <div className="chip-f cf3">
          <em>★</em>
          <span>
            5 / 5<small>Asiakastyytyväisyys</small>
          </span>
        </div>
        <PhoneReel
          className="p2"
          depth={26}
          variant="tiktok"
          src="/hero/laaksolahti-hero.mp4"
          poster="/hero/laaksolahti-hero.webp"
          handle="laaksolahdensahko"
          avatar="/hero/laaksolahti-ava.webp"
          caption="TOP 3 mallit alle 1400 eurolla jotka tuovat viilennystä kesähelteille."
          music="Alkuperäinen ääni · laaksolahdensahko"
          likes={[820, 2140]}
          comments={[38, 121]}
          shares={[24, 96]}
          saves={[62, 188]}
        />
        {/* Kaikissa kolmessa on asiakkaan oma video ja alustan oma
            kayttoliittyma. Videot ovat 540x960 ja 10 s, yhteensa 1,3 MB,
            ja jokainen alkaa vasta kun mockup on nakyvissa. */}
        <PhoneReel
          className="p1"
          depth={14}
          src="/hero/white-star-hero.mp4"
          poster="/hero/white-star-hero.webp"
          handle="whitestardetailing"
          avatar="/hero/whitestar-ava.webp"
          caption="Tarvitsetko nopean auton muodonmuutoksen? White Star hoitaa homman."
          music="whitestardetailing · Alkuperäinen ääni"
          likes={[1240, 3180]}
          comments={[86, 214]}
          shares={[41, 132]}
        />
        <PhoneReel
          className="p3"
          depth={34}
          src="/hero/vauhtiveikot-hero.mp4"
          poster="/hero/vauhtiveikot-hero.webp"
          handle="vauhtiveikot.fi"
          avatar="/hero/vauhtiveikot-ava.webp"
          caption="Meiltä löydät yli 22 000 tuotetta auton virittämiseen ja huoltoon."
          music="vauhtiveikot.fi · Alkuperäinen ääni"
          likes={[540, 1490]}
          comments={[27, 88]}
          shares={[19, 74]}
        />
      </div>

      </div>
    </header>
  );
}
