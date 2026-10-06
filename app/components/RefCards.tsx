"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { seuraaPeittoa } from "./peitto";
import { peilaaKankaalle } from "./videokangas";

/**
 * REFERENSSIVIDEOKORTIT OMANA MODUULINAAN.
 *
 * MIKSI IRROTETTU Refs.tsx:sta. Kortteja tarvitaan nyt kahdella
 * sivulla: etusivun Referenssit-osiossa ja lyhytvideosivun Tulokset-
 * osiossa. Refs.tsx vetaa mukanaan MetalBackdropin, SearchDemon ja
 * GraphicsSurfacesin, joita lyhytvideosivu ei kayta lainkaan - suora
 * import sielta olisi tuonut ne kaikki sen nippuun. Nyt molemmat
 * sivut tuovat vain sen mita kayttavat.
 *
 * Yksi-kerrallaan-vartija (playingEl) on modulitasolla, joten se on
 * yhteinen molemmille sivuille. Sivuja ei ole koskaan auki kahta yhta
 * aikaa, joten se on oikea taso: kaksi erillista vartijaa olisi
 * tarkoittanut kahta saantoa jotka eivat tieda toisistaan.
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

/**
 * TAUKO VIERITYKSEN AJAKSI - VAIN WEBKIT (Safari). 7.10.2026.
 *
 * MITATTU (Playwright WebKit, 1440x900 @2, scripts/safari-piste.mjs):
 * kun kaikki viisi korttivideota toistavat, Referenssit-kohdassa 15-34 %
 * vierityksen kehyksista ylitti 20 ms; videot pysaytettyina 1-2 %.
 * Kuorma on viiden videon rinnakkainen purku: ilman kangaspeilausta
 * (natiivi <video>) tulos oli viela huonompi. Chromessa samaa ongelmaa
 * ei ole, joten se jaa ennalleen.
 *
 * Siksi WebKitissa videot pysahtyvat vierityksen ajaksi ja jatkavat
 * VIERITYS_LEPO_MS:n kuluttua viimeisesta vieritystapahtumasta.
 * Kangas pitaa viimeisen ruudun ja poster pysyy piilossa, joten
 * paikallaan ollessa ulkoasu on sama kuin ennen.
 *
 * Tunnistus navigator.vendorista: se kertoo moottorin (Apple = WebKit),
 * ei selaimen versiota. Ominaisuustunnistusta purkukuormalle ei ole.
 */
const VIERITYS_LEPO_MS = 200;
const vierityskuuntelijat = new Set<(vierii: boolean) => void>();
let vierii = false;
let lepoAjastin = 0;
let edellinenY = 0;
const onVieritys = () => {
  // Lenisin pehmennys hiipuu 1 px:n askelin (WebKit pyoristaa scrollY:n
  // kokonaisluvuksi) viela ~0,6 s sen jalkeen kun liike on silmalle
  // loppunut. Mitattu: ilman tata rajaa videot jatkoivat vasta ~1 s
  // rullauksen jalkeen. Yhden pikselin askel ei kuormita, joten se ei
  // pida taukoa ylla.
  const y = window.scrollY;
  const dy = Math.abs(y - edellinenY);
  edellinenY = y;
  if (dy < 2) return;
  if (!vierii) {
    vierii = true;
    for (const f of vierityskuuntelijat) f(true);
  }
  clearTimeout(lepoAjastin);
  lepoAjastin = window.setTimeout(() => {
    vierii = false;
    for (const f of vierityskuuntelijat) f(false);
  }, VIERITYS_LEPO_MS);
};
function seuraaVieritysta(f: (vierii: boolean) => void): () => void {
  if (vierityskuuntelijat.size === 0) {
    edellinenY = window.scrollY;
    window.addEventListener("scroll", onVieritys, { passive: true });
  }
  vierityskuuntelijat.add(f);
  return () => {
    vierityskuuntelijat.delete(f);
    if (vierityskuuntelijat.size === 0) {
      window.removeEventListener("scroll", onVieritys);
      clearTimeout(lepoAjastin);
      vierii = false;
    }
  };
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
    // Ks. VIERITYS_LEPO_MS. Vain automaattitoistossa: kosketuspolulla
    // kayttaja kaynnistaa videon itse, eika sita pysayteta hanelta.
    const taukoVierittaessa = auto && /^Apple/.test(navigator.vendor);
    /** Video on pysaytetty vain vierityksen ajaksi: poster pysyy piilossa. */
    let vieritystauko = false;
    /** Video olisi kaynnistetty vierityksen aikana; kaynnistetaan levossa. */
    let odottaa = false;

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
      // Kaynnistys (myos nappaimistolla kesken vierityksen) purkaa tauon.
      vieritystauko = false;
      odottaa = false;
      arm();
      // Yhden-kerrallaan-vartija kuuluu vain kosketuspolulle.
      if (!auto) stopOthers(v);
    };
    const onPause = () => {
      disarm();
      if (vieritystauko) return;
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
    // PEITTO: pinnattu kortti on "nakyvissa" myos silloin kun seuraava
    // osio on noussut sen paalle, ks. peitto.ts.
    let nakyy = false;
    let peitossa = false;
    let vieriiNyt = taukoVierittaessa && vierii;
    const ohjaa = () => {
      if (nakyy && !peitossa) {
        if (!auto) return;
        if (vieriiNyt) {
          // Pysaytetaan vain jos video jo soi; muuten se kaynnistyy
          // vasta kun vieritys lepaa.
          if (!v.paused) {
            vieritystauko = true;
            v.pause();
          } else if (!vieritystauko) odottaa = true;
          return;
        }
        vieritystauko = false;
        odottaa = false;
        flushRewind(v);
        v.play().catch(() => {});
      } else {
        // Kattely puretaan myos silloin kun elementti ei ollut soimassa:
        // play() on voitu kutsua ilman etta 'playing' ehti laueta, ja
        // sen kuittaus tulisi ruudun ulkopuolelta.
        disarm();
        odottaa = false;
        if (vieritystauko) {
          // Jo pysaytetty vierityksen ajaksi, joten 'pause' ei laukea
          // uudelleen: palautetaan poster ja kelaus tassa.
          vieritystauko = false;
          pauseAndRewind(v);
          setPlaying(false);
        } else if (!v.paused) pauseAndRewind(v);
      }
    };
    const io = new IntersectionObserver(
      ([e]) => {
        nakyy = e.isIntersecting;
        ohjaa();
      },
      auto ? { threshold: 0.25, rootMargin: "200px 0px" } : { threshold: 0 },
    );
    io.observe(a);
    const irrotaPeitto = seuraaPeittoa(a, (x) => {
      peitossa = x;
      ohjaa();
    });
    const irrotaVieritys = taukoVierittaessa
      ? seuraaVieritysta((x) => {
          vieriiNyt = x;
          // Vierityksen alku vain pysayttaa soivan videon. Levossa
          // jatketaan VAIN sen minka vieritys pysaytti tai esti
          // kaynnistymasta (odottaa asetetaan vain nakyvyys- tai
          // peittomuutoksesta). Muuten nappaimistolla pysaytetty video
          // (Enter, WCAG 2.2.2) kaynnistyisi seuraavasta vierityksesta.
          if (x) {
            if (!v.paused && nakyy && !peitossa) {
              vieritystauko = true;
              v.pause();
            }
          } else if (vieritystauko || odottaa) ohjaa();
        })
      : () => {};

    return () => {
      irrotaVieritys();
      irrotaPeitto();
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
  const kangas = useRef<HTMLCanvasElement>(null);
  /* Viisi rinnakkain soivaa videota lukitsi sivun 30 fps:iin, ks.
     videokangas.ts. Video toistuu lapinakyvana ja kuva piirretaan
     kankaalle. */
  useEffect(() => {
    const v = vid.current;
    const k = kangas.current;
    if (!v || !k || !c.src) return;
    return peilaaKankaalle(v, k);
  }, [vid, c.src]);

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
      {c.src ? (
        <canvas
          ref={kangas}
          className="refcard-vid refcard-kangas"
          width={VW}
          height={VH}
          aria-hidden="true"
        />
      ) : null}
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


/**
 * Valmis ruudukko. Palvelinkomponentti EI voi kayttaa CARDS-taulukkoa
 * suoraan: "use client" -modulin kaikki exportit muuttuvat
 * asiakasviitteiksi kun ne tuodaan palvelinkomponenttiin, jolloin
 * taulukko ei ole taulukko vaan proxy ja .map kaatuu ajossa. Siksi
 * kartoitus tehdaan taalla, asiakaspuolella, ja ulos annetaan valmis
 * elementti.
 */
export function RefGrid({ className = "refgrid" }: { className?: string }) {
  return (
    <div className={className}>
      {CARDS.map((c, i) => (
        <RefCard key={c.title} c={c} i={i} />
      ))}
    </div>
  );
}

export { RefCard, CARDS };
export type { RefItem };
