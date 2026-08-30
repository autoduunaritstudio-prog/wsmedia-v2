"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import GraphicsSurfaces from "./GraphicsSurfaces";
import MetalBackdrop from "./MetalBackdrop";
import SmartLink from "./SmartLink";

/**
 * REFERENSSIT: toinen sticky+cover-pari samalla sivulla.
 *
 * PINNATTAVANA ON KAKSI PANEELIA: Graafinen suunnittelu ja Tapahtumat.
 * Molemmat on irrotettu Services.tsx:sta, jolloin #palvelut jaa kolmen
 * paneelin osioksi (Lyhytvideot, Verkkosivut, Graafinen -> ei, kolmas on
 * nyt taalla; #palvelutissa on Lyhytvideot ja Verkkosivut).
 *
 * MIKSI EI KOKO PALVELUT-RUUDUKKO:
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

/**
 * Kortin media on VALINNAINEN. Kun src ja poster puuttuvat, kortti
 * renderoi paikkamerkin muuttumattomana eika ole interaktiivinen -
 * ei ole mitaan toistettavaa, joten role="button" olisi valhe. Tama
 * haara jaa koodiin, vaikka kaikilla nykyisilla korteilla on media.
 *
 * Mediat public/referenssit/-kansiossa:
 *   videot   540 x 960, natiivi fps (25 tai 30), 10,000 s, h264 crf 34,
 *            ei aaniraitaa, +faststart
 *   posterit WebP 608 x 1080, laatutavoite SSIM >= 0,975
 */
type RefItem = { title: string; meta: string; src?: string; poster?: string };

const CARDS: RefItem[] = [
  {
    title: "ColorMaster",
    meta: "Lyhytvideot · autojen maalaus",
    src: "/referenssit/colormaster.mp4",
    poster: "/referenssit/colormaster.webp",
  },
  {
    title: "YDR Autohuolto",
    meta: "Lyhytvideot · autohuolto",
    src: "/referenssit/ydr-autohuolto.mp4",
    poster: "/referenssit/ydr-autohuolto.webp",
  },
  {
    title: "White Star",
    meta: "Lyhytvideot · auton muodonmuutos",
    src: "/referenssit/white-star.mp4",
    poster: "/referenssit/white-star.webp",
  },
  {
    title: "VauhtiVeikot",
    meta: "Lyhytvideot · autotarvikkeet",
    src: "/referenssit/vauhtiveikot.mp4",
    poster: "/referenssit/vauhtiveikot.webp",
  },
  {
    title: "Laaksolahden Sähkö",
    meta: "Lyhytvideot · ilmalämpöpumput",
    src: "/referenssit/ilmalampopumput.mp4",
    poster: "/referenssit/ilmalampopumput.webp",
  },
];

/** Korttien luontaiset mitat, 9:16. */
const VW = 503;
const VH = 894;

/**
 * Vain yksi video kerrallaan - VAIN KOSKETUSPOLULLA. Tyopoydalla kaikki
 * viisi soivat rinnakkain nakyvyyden mukaan, joten tama vartija ei saa
 * pysayttaa niita.
 */
let playingEl: HTMLVideoElement | null = null;

function stopOthers(el: HTMLVideoElement) {
  if (playingEl && playingEl !== el) {
    playingEl.pause();
    playingEl.currentTime = 0;
  }
  playingEl = el;
}

function RefCard({ c, i }: { c: RefItem; i: number }) {
  const vid = useRef<HTMLVideoElement>(null);
  const art = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  // Alkuarvo false, jotta palvelimen ja ensimmaisen asiakasrenderin
  // merkinta tasmaa; efekti nostaa kosketuspolun vasta kiinnityksen
  // jalkeen.
  const [touch, setTouch] = useState(false);
  const media = Boolean(c.src);

  useEffect(() => {
    if (!media) return;
    setTouch(!window.matchMedia("(hover: hover)").matches);
  }, [media]);

  useEffect(() => {
    const v = vid.current;
    const a = art.current;
    if (!media || !v || !a) return;

    const hover = window.matchMedia("(hover: hover)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Automaattitoisto vain osoitinlaitteella JA vain jos kayttaja ei ole
    // pyytanyt vahemman liiketta. Reduced motion -tilassa poster jaa
    // nakyviin eika mitaan kaynnisteta.
    const auto = hover && !reduce;

    const onPlaying = () => {
      setPlaying(true);
      // Yhden-kerrallaan-vartija kuuluu vain kosketuspolulle.
      if (!auto) stopOthers(v);
    };
    const onPause = () => {
      setPlaying(false);
      if (playingEl === v) playingEl = null;
    };
    v.addEventListener("playing", onPlaying);
    v.addEventListener("pause", onPause);

    // Tyopoydalla nakyvyys ohjaa toiston molempiin suuntiin. rootMargin
    // aloittaa haun 200px ennen kuin kortti on nakyvissa, joten
    // preload="none" ei nay viiveena - haku alkaa vasta play():sta.
    //
    // Kosketuspolulla sama tarkkailija vain PYSAYTTAA: ilman sita
    // napautettu video jaisi soimaan taustalle kun kortti vieritetaan
    // pois nakyvista.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (auto) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
          v.currentTime = 0;
        }
      },
      auto ? { threshold: 0.25, rootMargin: "200px 0px" } : { threshold: 0 },
    );
    io.observe(a);

    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
      io.disconnect();
      if (playingEl === v) playingEl = null;
    };
  }, [media]);

  const play = () => {
    const v = vid.current;
    if (!v) return;
    stopOthers(v);
    v.play().catch(() => {});
  };
  const stop = () => {
    const v = vid.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };
  const toggle = () => {
    const v = vid.current;
    if (!v) return;
    if (v.paused) play();
    else stop();
  };

  // Tyopoydalla EI OLE osoitinkasittelijoita lainkaan: toisto seuraa
  // nakyvyytta, joten hoveroinnilla ei ole roolia. Kosketuspolku sen sijaan
  // kayttaa CLICKIA eika pointerdownia: click ei laukea jos sormi liikkui
  // vierityksen verran, pointerdown laukeaa - ruudukossa selailu
  // kaynnistaisi videoita vahingossa.
  //
  // Nappaimistotuki koskee MOLEMPIA polkuja: (hover: hover) on tosi myos
  // poydalla jota kaytetaan nappaimistolla, ja siella kortin on oltava
  // kaynnistettavissa myos kasin - automaattitoisto ei korvaa sita.
  //
  // Tyyppi on HTMLAttributes eika Record<string, unknown>: jalkimmainen
  // ohittaisi JSX:n prop-tarkistuksen, jolloin kirjoitusvirhe attribuutin
  // nimessa menisi lapi hiljaa.
  const bind: React.HTMLAttributes<HTMLElement> = {};
  if (media) {
    bind.role = "button";
    bind.tabIndex = 0;
    bind["aria-label"] = `Toista video: ${c.title}`;
    bind.onKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    };
    if (touch) bind.onClick = toggle;
  }

  return (
    <article
      ref={art as React.RefObject<HTMLElement>}
      className="refcard rv"
      style={{ "--i": i } as CSSProperties}
      {...bind}
    >
      {/* Lahde on <source>-lapsena eika src-attribuuttina: src-attribuutin
          kanssa selain ohittaa source-lapset kokonaan. */}
      <video
        ref={vid}
        className="refcard-vid"
        width={VW}
        height={VH}
        muted
        loop
        playsInline
        preload="none"
      >
        {c.src ? <source src={c.src} type="video/mp4" /> : null}
      </video>
      {c.poster ? (
        /* POSTER OMANA KERROKSENAAN, ei poster-attribuuttina: attribuutti
           ladataan aina myos preload="none":n kanssa eika ole laiska, joten
           viisi posteria tulisi ensimmaiseen latausaaltoon. Sama kuvio kuin
           .demo-posterilla. width/height ovat pakolliset: korvattu elementti
           ei peri kokoa inset-arvoista, ja Tailwindin preflight height:auto
           ohjaisi muuten - tama ansa on osunut talla sivustolla kahdesti.
           eslint-disable-next-line @next/next/no-img-element */
        <img
          className={`refcard-poster${playing ? " is-hidden" : ""}`}
          src={c.poster}
          width={VW}
          height={VH}
          loading="lazy"
          decoding="async"
          alt=""
          aria-hidden="true"
        />
      ) : (
        <span className="refcard-mark">Video tulossa</span>
      )}
      <div className="refcard-meta">
        <b>{c.title}</b>
        <span>{c.meta}</span>
      </div>
    </article>
  );
}

export default function Refs({ children }: { children: ReactNode }) {
  return (
    <div className="refzone">
      {/* Pinnautuva osa. Scrim on paneelin sisalla ja sen paalla
          (z-index 5), kuten #hero-scrim heron sisalla. */}
      <section className="refsticky" aria-label="Tapahtumat">
        <div className="wrap">
            {/* 3. Graafinen suunnittelu */}
            <div className="svc rv svc-graafinen">
            <div className="svc-visual" data-par="0.02">
              <span className="deco deco-ring deco-ring-sm" style={{ right: "-3%", top: "-10px" }} />
              <span className="deco deco-dot" style={{ left: "-2%", bottom: "18%" }} />
              <GraphicsSurfaces />
            </div>
            <div className="svc-txt" data-par="0.035">
              <span className="kick">Graafinen suunnittelu</span>
              <h3>Yksi ilme, joka toimii käyntikortista pakettiauton kylkeen.</h3>
              <p>
                Logo, värit ja graafinen ohjeisto — ja sama ilme viety painotuotteisiin,
                teippauksiin ja kyltteihin asennettuna. Yksi tarjous, yksi lasku.
              </p>
              <ul>
                <li>Saat alkuperäistiedostot ja täydet oikeudet</li>
                <li>Suunnittelu, materiaalit ja asennus samalta tiimiltä</li>
                <li>Hinta-arvion näet itse laskurilla ennen tarjousta</li>
              </ul>
              <SmartLink className="tlink" href="/graafinen-suunnittelu">
                Lue lisää graafisesta suunnittelusta
              </SmartLink>
            </div>
          </div>

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
        {/* Kiintea tumma kuviokerros osion taustaksi. Sama circle-geometria
            (mbc-1..5) kuin vaaleassa versiossa ja sama SiteEffectsin ajama
            liike, vain varit kaannettyina. Ylareunassa kevyt maskihaivytys,
            ks. .metalbd-dark globals.css:ssa. */}
        <MetalBackdrop tone="dark" inSection />
        <div className="refsscrim" aria-hidden="true" />
        <div className="wrap">
          <div className="shead center rv" data-par="0.03">
            <span className="kick">Referenssit</span>
            <h2>Katso miltä työmme näyttää.</h2>
          </div>
          <div className="refgrid stagger">
            {CARDS.map((c, i) => (
              <RefCard c={c} i={i} key={c.title} />
            ))}
          </div>
        </div>
      </section>

      {/* Kolmas pari: Referenssit on itse pinnattava ja tama on sen cover.
          Tausta on lapinakymaton (--bg), koska cover-mekanismi vaatii sen -
          metallikuvio jaa siis piiloon taman lohkon kohdalla ja palaa
          nakyviin heti sen jalkeen, kun sisalto muuttuu taas
          lapinakyvaksi. Korkeus pakotetaan JS:sta vahintaan Referenssit-
          osion korkuiseksi, jolloin ehto C >= H on rakenteellisesti
          taattu eika riipu sisallon maarasta tai ikkunan korkeudesta. */}
      {/* Tyhjaa scrollimatkaa ennen kuin .aftercover alkaa peittaa
          Referenssit. Pelkkaa dokumenttikorkeutta: .refs on pinnattuna
          nakyman korkuinen, joten vali jaa kokonaan sen taakse. */}
      <div className="refgap" aria-hidden="true" />
      <div className="aftercover">{children}</div>
    </div>
  );
}
