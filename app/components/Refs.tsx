"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import GraphicsSurfaces from "./GraphicsSurfaces";
import SearchDemo from "./SearchDemo";
import MetalBackdrop from "./MetalBackdrop";
import SmartLink from "./SmartLink";
import StatBand, { type Stat } from "./StatBand";

/**
 * REFERENSSIT: toinen sticky+cover-pari samalla sivulla.
 *
 * PINNATTAVANA ON YKSI PANEELI: Graafinen suunnittelu. Tapahtumat-paneeli
 * poistettiin kun tapahtumapalvelu jai pois tarjonnasta.
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

/**
 * Poster palaa CSS-siirtymalla (.18s), joten kelaus alkuun EI SAA tapahtua
 * heti pausen jalkeen: video ehtii nayttaa nollaruudun - Chromella
 * hetkellisesti tyhjan - viela puolilapinakyvan posterin lapi. Kelaus jaa
 * siksi odottamaan etta poster on jo peittava.
 *
 * Ajastin on elementtikohtainen WeakMapissa eika refissa, koska
 * yhden-kerrallaan-vartija pysayttaa TOISEN kortin elementin eika paase
 * sen hookin refeihin. Nain kaikki kolme pysayttajaa - vartija,
 * nakyvyystarkkailija ja kosketuksen stop() - kayttavat samaa mekanismia.
 */
const POSTER_FADE_MS = 220;
const rewindTimers = new WeakMap<HTMLVideoElement, number>();

function pauseAndRewind(v: HTMLVideoElement) {
  v.pause();
  const pending = rewindTimers.get(v);
  if (pending !== undefined) clearTimeout(pending);
  rewindTimers.set(
    v,
    window.setTimeout(() => {
      rewindTimers.delete(v);
      // Toisto on voinut alkaa uudelleen odotuksen aikana; silloin kelaus
      // olisi hyppy keskella toistoa.
      if (v.paused) v.currentTime = 0;
    }, POSTER_FADE_MS),
  );
}

/**
 * Suorittaa odottavan kelauksen ETUAJASSA play():n alla. Peruminen olisi
 * vaarin: stop() lupaa kortin alkavan alusta, ja jos kayttaja napauttaa
 * uudelleen ennen kuin ajastin ehti laueta, video jatkaisi keskelta.
 * Nakyviin tama ei tule, koska poster piilotetaan vasta ensimmaisesta
 * esitetysta ruudusta.
 */
function flushRewind(v: HTMLVideoElement) {
  const pending = rewindTimers.get(v);
  if (pending === undefined) return;
  clearTimeout(pending);
  rewindTimers.delete(v);
  if (v.paused) v.currentTime = 0;
}

function stopOthers(el: HTMLVideoElement) {
  if (playingEl && playingEl !== el) pauseAndRewind(playingEl);
  playingEl = el;
}

/**
 * Videon toistologiikka jaettuna referenssikorttien ja Tapahtumat-
 * mockupin kesken. Yksi mekanismi, yksi playingEl-vartija: rinnakkainen
 * toteutus olisi tarkoittanut kahta yhden-kerrallaan-saantoa, jotka eivat
 * tieda toisistaan. Ainoa ero kutsujien valilla on merkinta.
 */
function useCardVideo(media: boolean, label: string) {
  const vid = useRef<HTMLVideoElement>(null);
  const art = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  // Alkuarvo false, jotta palvelimen ja ensimmaisen asiakasrenderin
  // merkinta tasmaa; efekti nostaa kosketuspolun vasta kiinnityksen
  // jalkeen.
  const [touch, setTouch] = useState(false);

  /**
   * KATTELY ENSIMMAISESTA RUUDUSTA. 'playing' kertoo etta toisto on
   * alkanut, EI etta selain olisi jo esittanyt ruudun. Chromella nama ovat
   * eri hetkia: posterin piilottaminen 'playing'-tapahtumassa paljasti
   * videoelementin ennen kuin sen ensimmaista ruutua oli kompositoitu, ja
   * Referenssit-coverin tummalla pohjalla se nakyi valahduksena.
   *
   * requestVideoFrameCallback laukeaa vasta kun ruutu on lahetetty
   * kompositorille, joten poster haipyy tasan silloin kun sen alla on
   * varmasti kuvaa.
   *
   * gen mitatoi vanhentuneet kuittaukset: pause, nakymasta poistuminen ja
   * efektin purku kasvattavat numeroa, ja kuittaus vertaa omaansa siihen
   * ennen kuin koskee tilaan. Ilman tata 'playing' -> pause -jarjestyksessa
   * jonossa ollut kuittaus piilottaisi posterin pysaytetyn videon paalta.
   */
  const gen = useRef(0);
  const frameCb = useRef(0);
  const rafId = useRef(0);

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

    /** Mitatoi odottavat kuittaukset ja vapauttaa kahvat. */
    const disarm = () => {
      gen.current += 1;
      if (frameCb.current) {
        v.cancelVideoFrameCallback?.(frameCb.current);
        frameCb.current = 0;
      }
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = 0;
      }
    };

    const arm = () => {
      disarm(); // yksi kattely kerrallaan
      const mine = gen.current;
      const reveal = () => {
        if (gen.current !== mine || v.paused) return;
        setPlaying(true);
      };

      if (typeof v.requestVideoFrameCallback === "function") {
        frameCb.current = v.requestVideoFrameCallback(() => {
          frameCb.current = 0;
          reveal();
        });
        return;
      }

      // VARAPOLKU (Firefox, vanhat WebKitit): odotetaan rAF-silmukassa
      // etta dekooderilla on ruutu (readyState) JA etta mediakello etenee.
      //
      // KELLON ON EDETTAVA KAHDEN MAALATUN KEHYKSEN YLI, ei vain kertaa.
      // Mitattu: yksi rAF 'playingin' jalkeen tayttyi jo 3-7 ms kohdalla,
      // kun rVFC:lla mitattu todellinen ensimmainen esitetty ruutu tuli
      // vasta 17-50 ms kohdalla. Yhden rasti olisi siis piilottanut
      // posterin lahes yhta aikaisin kuin korjattu vika. Kahden kehyksen
      // yli edennyt kello sen sijaan todistaa etta putki tuottaa ruutuja
      // eika vain aikoo.
      //
      // Takaraja pitaa huolen ettei poster jaa jumiin jos jokin ehto ei
      // toteudu: pahin tapaus on silloin vanha kaytos, ei rikkinainen.
      const from = v.currentTime;
      const deadline = performance.now() + 500;
      let mark = -1;
      const tick = () => {
        rafId.current = 0;
        if (gen.current !== mine || v.paused) return;
        if (v.readyState >= v.HAVE_CURRENT_DATA && v.currentTime > from) {
          if (mark < 0) mark = v.currentTime;
          else if (v.currentTime > mark) {
            reveal();
            return;
          }
        }
        if (performance.now() >= deadline) {
          reveal();
          return;
        }
        rafId.current = requestAnimationFrame(tick);
      };
      rafId.current = requestAnimationFrame(tick);
    };

    const onPlaying = () => {
      arm();
      // Yhden-kerrallaan-vartija kuuluu vain kosketuspolulle.
      if (!auto) stopOthers(v);
    };
    const onPause = () => {
      disarm();
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
          if (auto) {
            flushRewind(v);
            v.play().catch(() => {});
          }
        } else {
          // Kattely puretaan myos silloin kun elementti ei ollut soimassa:
          // play() on voitu kutsua ilman etta 'playing' ehti laueta, ja
          // sen kuittaus tulisi ruudun ulkopuolelta.
          disarm();
          if (!v.paused) pauseAndRewind(v);
        }
      },
      auto ? { threshold: 0.25, rootMargin: "200px 0px" } : { threshold: 0 },
    );
    io.observe(a);

    return () => {
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("pause", onPause);
      disarm();
      io.disconnect();
      if (playingEl === v) playingEl = null;
    };
  }, [media]);

  const play = () => {
    const v = vid.current;
    if (!v) return;
    stopOthers(v);
    flushRewind(v);
    v.play().catch(() => {});
  };
  const stop = () => {
    const v = vid.current;
    if (!v) return;
    pauseAndRewind(v);
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
    bind["aria-label"] = `Toista video: ${label}`;
    bind.onKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    };
    if (touch) bind.onClick = toggle;
  }

  return { vid, art, playing, bind };
}

function RefCard({ c, i }: { c: RefItem; i: number }) {
  const { vid, art, playing, bind } = useCardVideo(Boolean(c.src), c.title);

  return (
    <article
      ref={art as React.RefObject<HTMLElement>}
      className={`refcard${c.poster ? "" : " is-empty"}`}
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

export default function Refs({ children, stats }: { children: ReactNode; stats?: Stat[] }) {
  return (
    <div className="refzone">
      {/* Pinnautuva osa. Scrim on paneelin sisalla ja sen paalla
          (z-index 5), kuten #hero-scrim heron sisalla. */}
      <section className="refsticky" aria-label="Graafinen suunnittelu ja hakukoneoptimointi">
        <div className="wrap">
            {/* 3. Hakukoneoptimointi. Visuaalina SEO-sivun oma hakunayttamo:
                sama tyo nakyy seka hakutuloslistassa etta tekoalyn
                vastauksessa, ja se on koko palvelun ydinviesti. */}
            <div className="svc rv">
              <div className="svc-visual" data-par="0.02">
                <div className="sdemo">
                  <SearchDemo variant="simple" />
                </div>
                <div className="float-tag ft-d">
                  <i />
                  Orgaaninen näkyvyys
                  <br />
                  ei lopu kun budjetti loppuu
                </div>
              </div>
              <div className="svc-txt" data-par="0.035">
                <span className="kick">Hakukoneoptimointi</span>
                <h3>Löydy silloin, kun asiakas etsii palvelua.</h3>
                <p>
                  Tekninen optimointi, sisältö ja paikallinen näkyvyys yhdeltä tiimiltä — ja sama
                  työ nostaa sinut myös tekoälyhakujen vastauksiin.
                </p>
                <ul>
                  <li>Näkyvyys Googlessa ja tekoälyhauissa samalla työllä</li>
                  <li>Sovitut mittarit ja raportointi, ei sijoituslupauksia</li>
                  <li>Kuukausipaketit alkaen 390 €/kk</li>
                </ul>
                <div className="svc-cta">
                  <a className="btn mag" href="#lomake">
                    Pyydä tarjous
                  </a>
                  <SmartLink className="btn alt" href="/hakukoneoptimointi">
                    Lue lisää hakukoneoptimoinnista
                  </SmartLink>
                </div>
              </div>
            </div>

            {/* 4. Graafinen suunnittelu */}
            <div className="svc rev rv svc-graafinen">
            <div className="svc-visual" data-par="0.02">
              <GraphicsSurfaces />
              <div className="float-tag ft-c">
                <i />
                Avaimet käteen
                <br />
                suunnittelu, materiaalit, asennus
              </div>
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
              <div className="svc-cta">
                <a className="btn mag" href="#lomake">
                  Pyydä tarjous
                </a>
                <SmartLink className="btn alt" href="/graafinen-suunnittelu">
                  Lue lisää graafisesta suunnittelusta
                </SmartLink>
              </div>
            </div>
          </div>

        </div>
        <div className="refscrim" aria-hidden="true" />
      </section>

      {/* Lukuaika: tyhjaa scrollimatkaa ennen kuin Referenssit alkaa
          nousta paneelin paalle. Ilman tata cover lahtee nousemaan tasan
          samalla hetkella kun paneeli pinnautuu. Kaava ja mitatut luvut
          globals.cssn .refhold-saannossa. */}
      <div className="refhold" aria-hidden="true" />

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
          {/* Luvut kuuluvat todisteiden viereen, ei erilliseen lohkoon
              coverin alle: sama osio kertoo mita on tehty ja kuinka
              paljon. */}
          {stats && <StatBand stats={stats} />}
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
      {/* VAALEA KUVIOKERROS .aftercoverin SISAAN. Osion oma valkoinen
          tausta jaa koskemattomana sen ALLE, joten videoseinan peitto ei
          muutu lainkaan - kuvio vain maalataan peittavan pinnan paalle.

          Kerroksen korkeus on --metalbd-tail (tasta footeriin) eika osion
          korkeus: sticky-panen liikevaran on jatkuttava sauman yli, muuten
          pane pinnautuisi osion alareunaan ja kuvio irtoaisi nakymasta
          juuri siina kohdassa jonka pitaa olla saumaton. Maalaus rajataan
          takaisin osion mittaan mask-imagella, ks. globals.css. */}
      <div className="aftercover">
        <MetalBackdrop inSection />
        {children}
      </div>
    </div>
  );
}
