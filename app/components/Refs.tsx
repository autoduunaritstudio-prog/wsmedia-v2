"use client";

import type { CSSProperties } from "react";
import { useCallback } from "react";

/**
 * REFERENSSIT: toinen sticky+cover-pari samalla sivulla.
 *
 * MIKSI VAIN TAPAHTUMAT-PANEELI PINNAUTUU, EI KOKO PALVELUT-RUUDUKKO:
 * hero+coverista opittu ehto on ettei cover saa olla pinnattavaa sisaltoa
 * matalampi - muuten pinnattu sisalto paljastuu coverin YLAPUOLELLE siina
 * hetkessa kun se irtoaa. Koko Palvelut-ruudukko on n. 3000px korkea,
 * joten Referenssit-osion olisi pitanyt olla yhta korkea. Yksittainen
 * paneeli on n. 500px, ja viiden 9:16-kortin ruudukko ylittaa sen
 * reilusti, joten ehto tayttyy luonnostaan.
 *
 * Paneeli on siksi irrotettu Services.tsx:sta omaksi lohkokseen: sticky-
 * elementti ja sen cover on oltava saman kaareen lapsia, jotta coverilla
 * on matkaa liukua pinnatun paalle. Palvelut-osion kolme muuta paneelia
 * vierivat normaalisti sen ylitse ennen kuin talle paastaan.
 *
 * PINOAMINEN: .refzone on position: relative ILMAN z-indexia, joten se ei
 * luo omaa pinoamiskontekstia ja lapset asettuvat .coverin kontekstiin:
 * .metalbd (0) < .refsticky (1) < .refs (2). Sama porrastus kuin
 * hero (1) / cover (2). Metallikuvion oma sticky-pane ei hairitse: sticky-
 * elementit ovat toisistaan riippumattomia ja kiinnittyvat kukin omaan
 * kaareensa. Yhtaan overflow-rajausta ei lisatty, koska se katkaisisi
 * metallikuvion paneen kiinnityksen.
 */

/** TODO: taytetaan oikeilla referensseilla kun videot ovat saatavilla. */
const CARDS = [
  { title: "[Asiakas 1]", meta: "Lyhytvideot · [tulos]" },
  { title: "[Asiakas 2]", meta: "Tapahtumat · [pvm]" },
  { title: "[Asiakas 3]", meta: "Lyhytvideot · [tulos]" },
  { title: "[Asiakas 4]", meta: "Verkkosivut · [toimiala]" },
  { title: "[Asiakas 5]", meta: "Tapahtumat · [pvm]" },
];

export default function Refs() {
  // Hover-kaynnistys, EI IntersectionObserveria: ruudukossa on viisi
  // korttia yhta aikaa nakyvissa, ja automaattitoisto kaynnistaisi ne
  // kaikki. play() palauttaa promisen joka hylkaytyy kun srcia ei viela
  // ole - se nielaistaan, jottei konsoliin tule virhetta ennen kuin
  // oikeat videot lisataan.
  //
  // KOSKETUSLAITTEET: kortit jaavat staattisiksi. Selain emuloi napautuksella
  // mouseenterin mutta ei mouseleavea, joten ilman tata vartijaa napautettu
  // video jaisi soimaan kunnes kayttaja napauttaa muualle - ja viisi korttia
  // vierekkain tarkoittaisi etta selailu kaynnistaisi niita vahingossa.
  // Tap-to-play hylattiin myos siksi, etta napautus kilpailisi vierityksen
  // kanssa ruudukossa. Kosketuksella nakyy siis poster-kuva, mika on myos
  // kevyin vaihtoehto mobiilidatalle.
  const onEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const v = e.currentTarget.querySelector("video");
    v?.play().catch(() => {});
  }, []);
  const onLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const v = e.currentTarget.querySelector("video");
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  }, []);

  return (
    <div className="refzone">
      {/* Pinnautuva osa. Scrim on paneelin sisalla ja sen paalla
          (z-index 5), kuten #hero-scrim heron sisalla. */}
      <section className="refsticky" aria-label="Tapahtumat">
        <div className="wrap">
            {/* 4. Tapahtumat */}
            <div className="svc rev rv">
              <div className="svc-visual" data-par="0.02">
                <span className="deco deco-dot" style={{ left: "-2%", top: "10%" }} />
                <span className="deco deco-ring deco-ring-sm" style={{ right: "4%", bottom: "-10px" }} />
                <div className="event" data-tilt="-y" data-tilt-profile="mockup">
                  <div className="lights" />
                  <div className="truss" />
                  <span className="chip">[Tapahtuman nimi] · [pvm]</span>
                  <div className="play" />
                  <div className="crowd" />
                  <div className="cap">
                    <b>Aftermovie</b>
                    <s>Täytetään tapahtumareferenssillä</s>
                  </div>
                </div>
                <div className="float-tag ft-a">
                  <i />
                  Kävijät
                  <br />
                  {"[X] henkeä"}
                </div>
              </div>
              <div className="svc-txt" data-par="0.035">
                <span className="kick">Tapahtumat</span>
                <h3>Tapahtumat, joista puhutaan vielä viikkoja.</h3>
                <p>
                  Suunnittelusta toteutukseen ja taltiointiin. Tapahtuma tuottaa samalla sisältöä someen
                  ja sivuillesi, yksi ilta ruokkii koko vuoden markkinointia.
                </p>
                <ul>
                  <li>[Tapahtumapalvelun sisältö 1, täytetään]</li>
                  <li>[Tapahtumapalvelun sisältö 2, täytetään]</li>
                  <li>Aftermovie ja some-nostot samasta tuotannosta</li>
                </ul>
                {/* Tapahtumat-sivua ei ole viela; ankkuri pitaa kayttajan
                    paikallaan sen sijaan etta tyhja "#" hyppaisi sivun ylalaitaan. */}
                <a className="tlink" href="#palvelut">
                  Lue lisää tapahtumista
                </a>
              </div>
            </div>
        </div>
        <div className="refscrim" aria-hidden="true" />
      </section>

      {/* Cover: nousee normaalissa dokumenttivirtauksessa pinnatun paneelin
          paalle. Tausta on lapinakymaton (--dark) kolmesta syysta: cover-
          mekanismi VAATII peittavan taustan, 9:16-videokortit lukeutuvat
          parhaiten tummalla, ja sivustolla on jo sama tumma kaista-idiomi
          (/lyhytvideot .work). */}
      <section className="refs" id="referenssit">
        <div className="wrap">
          <div className="shead center rv" data-par="0.03">
            <span className="kick">Referenssit</span>
            <h2>Katso miltä työmme näyttää.</h2>
          </div>
          <div className="refgrid stagger">
            {CARDS.map((c, i) => (
              <article
                className="refcard rv"
                style={{ "--i": i } as CSSProperties}
                key={c.title}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
              >
                {/* TODO: lisaa oikea video tahan kun se on saatavilla:
                    <video ... poster="/referenssit/ref-N.jpg">
                      <source src="/referenssit/ref-N.mp4" type="video/mp4" />
                    </video>
                    Pakkaa samalla menetelmalla kuin sivuston muut videot
                    (lyhyt luuppi, h264, ei aanta). Poista samalla
                    .refcard-mark -paikkamerkki talta kortilta. */}
                <video className="refcard-vid" muted loop playsInline preload="none" />
                <span className="refcard-mark">Video tulossa</span>
                <div className="refcard-meta">
                  <b>{c.title}</b>
                  <span>{c.meta}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
