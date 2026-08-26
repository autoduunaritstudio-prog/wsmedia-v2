import Phone from "../../components/Phone";
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
      <div className="wrap">
        <p className="kick li d1">Lyhytvideotuotanto yrityksille</p>
        <h1 className="li d2" data-par="0.05">
          Lyhytvideot yrityksille, jotka
          <br />
          <WordSwap words={WORDS} deferToClient />
        </h1>
        <p className="sub li d3" data-par="0.035">
          Avaimet käteen -lyhytvideotuotanto yrityksille: TikTok, Instagram Reels ja YouTube Shorts.
          Strategia, käsikirjoitus, kuvaus ja editointi yhdeltä tiimiltä — kiinteällä
          kuukausihinnalla.
        </p>
        <div className="heroctas li d4" data-par="0.025">
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
        data-par="-0.03"
        aria-label="Esimerkkejä WS Median tuottamista lyhytvideoista"
      >
        <div className="chip-f cf1">
          <em>▲</em>
          <span>
            Näyttökerrat<small>[LUKU] / 30 pv</small>
          </span>
        </div>
        <div className="chip-f cf2">
          <em>✓</em>
          <span>
            Toimitettu<small>[X] arkipäivässä</small>
          </span>
        </div>
        <div className="chip-f cf3">
          <em>★</em>
          <span>
            {"[LUKU] / 5"}
            <small>Asiakastyytyväisyys</small>
          </span>
        </div>
        <Phone
          className="p2"
          depth={26}
          tag="TIKTOK"
          handle="@[asiakas]"
          caption="Ennen ja jälkeen. Katso muutos loppuun asti."
          likes="[LUKU]"
          comments="[LUKU]"
        />
        <Phone
          className="p1"
          depth={14}
          tag="REELS"
          handle="@wsmedia"
          caption="Näin teemme lyhytvideot jotka pysäyttävät. 30 s."
          likes="[LUKU]"
          comments="[LUKU]"
        />
        <Phone
          className="p3"
          depth={34}
          tag="SHORTS"
          handle="@[asiakas]"
          caption="Kolme virhettä jotka kaatavat somenäkyvyyden."
          likes="[LUKU]"
          comments="[LUKU]"
        />
      </div>
    </header>
  );
}
