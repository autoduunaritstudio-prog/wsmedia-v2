import Phone from "./Phone";
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
          <a className="tlink" href="#tyot">
            Katso työnäytteet
          </a>
        </div>
      </div>

      <div
        className="stage li d5"
        id="stage"
        data-par="-0.03"
        aria-label="Esimerkkejä lyhytvideoista, paikat varattu"
      >
        <div className="chip-f cf1">
          <em>▲</em>
          <span>
            Näkyvyys<small>+240 % / 30 pv</small>
          </span>
        </div>
        <div className="chip-f cf2">
          <em>✓</em>
          <span>
            Julkaistu<small>Toimitettu ajallaan</small>
          </span>
        </div>
        <div className="chip-f cf3">
          <em>★</em>
          <span>
            4,9 / 5<small>Asiakastyytyväisyys</small>
          </span>
        </div>
        <Phone
          className="p2"
          depth={26}
          tag="ASIAKASVIDEO"
          handle="@asiakas"
          caption="Ennen ja jälkeen. Katso muutos loppuun asti."
          likes="24,1k"
          comments="312"
        />
        <Phone
          className="p1"
          depth={14}
          tag="SHOWREEL"
          handle="@wsmedia"
          caption="Näin teemme sisällöt jotka pysäyttävät. 30 s."
          likes="48,7k"
          comments="926"
        />
        <Phone
          className="p3"
          depth={34}
          tag="ASIAKASVIDEO"
          handle="@asiakas"
          caption="Kolme virhettä jotka kaatavat somenäkyvyyden."
          likes="17,9k"
          comments="204"
        />
      </div>
    </header>
  );
}
