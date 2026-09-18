"use client";

import { useEffect, useRef } from "react";

import { Film } from "../../components/film-codec";
import { FILM } from "../../components/film-tiedot-verkkosivut";

/**
 * VERKKOSIVUT-HERON VIERITYSELOKUVA.
 *
 * Sama moottori kuin etusivulla (components/film-codec.ts): yksi mp4,
 * WebCodecs-purku, kehystarkka piirto canvasille. Tama tiedosto on
 * vain se osa joka sitoo moottorin TAMAN sivun geometriaan. Moottoriin,
 * film-mp4.ts:aan eika components/HeroScrub.tsx:aan ei kosketa.
 *
 * ETENEMA MITATAAN COVERISTA, EI HERON KORKEUDESTA.
 * Etusivulla on .hero-spacer ja p = scrollY / spacer.offsetHeight.
 * Tulla sivulla spaceria ei ole eika sellaista pida lisata: hero on
 * jo 310svh korkea ja cover nousee sen paalle -100svh:n marginaalilla,
 * joten vierityspituus on olemassa. Spacerin kaavan TARKOITUS on etta
 * skrubbaus paattyy tasan silla hetkella kun coverin ylareuna koskettaa
 * nakyman alareunaa, ja se mitataan tassa suoraan:
 *
 *     S = coverin dokumenttisijainti - nakyman korkeus
 *     p = clamp(scrollY / S, 0, 1)
 *
 * Mittaus on offsetTop-ketjusta eika getBoundingClientRectista, koska
 * hero ja sen sisalto ovat pinnattuja: pinnatun elementin rect jaatyy
 * pinnin ajaksi, offsetTop ei.
 *
 * COVER-RAJAUS LASKETAAN CANVASIN SISALLA, ei CSS:n object-fitilla:
 *     s = max(cw / iw, ch / ih)
 *     drawImage(img, (cw - iw*s)/2, (ch - ih*s)/2, iw*s, ih*s)
 * object-fit ei koske canvasin PIIRTOPINTAAN vaan vain elementin
 * bittikartan sovitukseen, joten se venyttaisi jo piirretyn kuvan.
 *
 * INVARIANTTI. Piirrolle annetaan aina lahin RESIDENTTI indeksi,
 * valittuna residenteista eika indeksiaritmetiikalla. Purkaja vapauttaa
 * ikkunan ulkopuoliset ruudut, joten joukko on aina vajaa, ja tama on
 * ainoa mika estaa piirron puuttuvaan ruutuun.
 *
 * SARJAN PITUUS TULEE VAIN FILM.framesista. Ruutumaaraa ei kirjoiteta
 * tahan eika CSS:aan; film-tiedot-verkkosivut.ts on generoitu samasta
 * ajosta joka pakkasi elokuvan.
 *
 * KAPEALLA NAYTOLLA EI SKRUBATA. Elokuva olisi siella pelkka kustannus:
 * 2,2 MB mobiiliyhteydella animaatiosta joka on ohi yhdella peukalon
 * vedolla. Nakyviin jaa poster, joka on <picture>-elementin LCP-kuva ja
 * ladataan joka tapauksessa.
 *
 * EI LATAUSLUKKOA. Etusivulla hero on koko sivun avaus ja se lukitsee
 * vierityksen kunnes elokuva on ladattu. Alasivulle tullaan hausta tai
 * linkista tiettya asiaa varten, joten lukko olisi este eika avaus:
 * poster nakyy heti ja elokuva korvaa sen kun se on purettu.
 */

const WIDE = "(min-width: 980px)";
const DPR_MAX = 2;
const POSTER = "/hero/verkkosivut-001.webp";

export default function HeroFilm() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const cover = document.querySelector<HTMLElement>(".stickysub > .cover");
    const hero = cv.closest<HTMLElement>(".hero");

    // Sarja valitaan kerran mountissa eika resizessa: vaihto kesken
    // istunnon heittaisi jo puretun ikkunan hukkaan.
    const wide = window.matchMedia(WIDE).matches;

    let film: Film | null = null;
    let poster: HTMLImageElement | null = null;
    let shownKey = "";
    let raf = 0;
    let stopped = false;

    /* C >= H ON PAKOTETTAVA. Cover peittaa heron, ja jos se on heroa
       matalampi, hero ei ehdi peittya ennen kuin coverin oma vyohyke
       loppuu: pinnaus purkautuu keskella liiketta. Ehto ei ole
       kirjoitettavissa CSS:aan, koska molemmat korkeudet syntyvat
       sisallosta, joten se mitataan ja pakotetaan tassa. */
    const pakotaCover = () => {
      if (!cover || !hero) return;
      const h = hero.offsetHeight;
      cover.style.setProperty("--vs-cover-min", `${Math.ceil(h)}px`);
    };

    /* Vierityspituus: scrollY jolla coverin ylareuna koskettaa nakyman
       alareunaa. offsetTop-ketju, koska pinnattujen elementtien rect
       jaatyy pinnin ajaksi. */
    let span = 0;
    const mittaa = () => {
      pakotaCover();
      if (!cover) {
        span = 0;
        return;
      }
      let y = 0;
      let n: HTMLElement | null = cover;
      while (n) {
        y += n.offsetTop;
        n = n.offsetParent as HTMLElement | null;
      }
      span = Math.max(y - window.innerHeight, 1);
    };

    // Canvas mitoitetaan NAKYVAAN kokoon, dpr-katto 2. Kolmen dpr:n
    // naytolla 3x-puskuri maksaisi yli kaksinkertaisen tayttokaistan
    // ilman etta 1920px levea lahde tarjoaa lisadetaljia.
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
      const w = Math.round(cv.clientWidth * dpr);
      const h = Math.round(cv.clientHeight * dpr);
      if (w > 0 && h > 0 && (cv.width !== w || cv.height !== h)) {
        cv.width = w;
        cv.height = h;
        // Canvas tyhjeni koon vaihdossa, joten piirtoavain on
        // mitatoitava: muuten paint ohittaisi piirron samalla arvolla.
        shownKey = "";
      }
    };

    /* VideoFrame ja HTMLImageElement ilmoittavat mittansa eri nimilla.
       Ilman tata sama rajauslasku olisi kahtena kappaleena, ja juuri
       sellainen pari ajautuu erilleen. */
    const mitat = (x: CanvasImageSource) =>
      x instanceof HTMLImageElement
        ? { w: x.naturalWidth, h: x.naturalHeight }
        : { w: (x as VideoFrame).displayWidth, h: (x as VideoFrame).displayHeight };
    const blit = (img: CanvasImageSource, alpha: number) => {
      const m = mitat(img);
      const s = Math.max(cv.width / m.w, cv.height / m.h);
      const dw = m.w * s;
      const dh = m.h * s;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cv.width - dw) / 2, (cv.height - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };

    // Lahin residentti indeksi. Ennen elokuvaa kaytossa on vain poster,
    // joka piirtyy ruutuna 0.
    const nearest = (i: number) => {
      if (film?.valmis) {
        const j = film.lahin(i);
        if (j >= 0) return j;
      }
      return 0;
    };
    const kuva = (i: number): CanvasImageSource | null =>
      (film?.valmis ? film.hae(i) : null) ?? (i === 0 ? poster : null);

    /**
     * RUUTUJEN VALISSA SEKOITETAAN, ei hypata. Vierityspituus jaettuna
     * ruutumaaralla on kymmenia pikseleita ruutua kohti, ja hitaassa
     * vierityksessa se nakyy portaana: kuva seisoo ja hyppaa. Indeksi
     * otetaan liukulukuna ja kaksi vierekkaista ruutua
     * ristihaivytetaan murto-osan mukaan.
     *
     * Sekoitus kvantisoidaan 1/24:aan, jotta piirto ohitetaan kokonaan
     * kun mikaan ei ole muuttunut: ilman sita jokainen frame piirtaisi
     * uudelleen myos paikallaan seistessa.
     */
    const BLEND_STEPS = 24;
    const paint = (fi: number) => {
      const i0 = Math.min(Math.floor(fi), FILM.frames - 1);
      const a = nearest(i0);
      const bi = i0 + 1;
      // Sekoitetaan VAIN jos seuraava ruutu on oikeasti purettuna ja
      // pohja osui haettuun indeksiin. Jos nearest jouduttiin hakemaan
      // kauempaa, valissa ei ole mitaan jarkevaa sekoitettavaa.
      const bKuva = bi < FILM.frames ? kuva(bi) : null;
      const canBlend = a === i0 && !!bKuva;
      const q = canBlend ? Math.round((fi - i0) * BLEND_STEPS) / BLEND_STEPS : 0;
      const aKuva = kuva(a);
      const key = `${a}|${q}`;
      if (!aKuva || key === shownKey) return;
      shownKey = key;
      blit(aKuva, 1);
      if (q > 0 && bKuva) blit(bKuva, q);
    };

    const progress = () => (span > 0 ? Math.min(Math.max(window.scrollY / span, 0), 1) : 0);

    const onResize = () => {
      mittaa();
      size();
      // Piirretaan sama kohta uuteen kokoon. Etenema luetaan
      // vierityksesta eika muistetusta indeksista: se on aina ajan
      // tasalla eika voi ajautua erilleen rAF-silmukan kanssa.
      paint(progress() * (FILM.frames - 1));
    };
    window.addEventListener("resize", onResize, { passive: true });
    /* Sisallon korkeus muuttuu fonttien ja kuvien latautuessa, eika
       window-resize kerro siita mitaan. Ilman tata span ja coverin
       vahimmaiskorkeus jaisivat mount-hetken mittoihin. */
    const ro = new ResizeObserver(() => {
      mittaa();
    });
    if (cover) ro.observe(cover);
    if (hero) ro.observe(hero);

    mittaa();
    size();

    /* POSTER. Sama tiedosto kuin <picture>-elementin LCP-kuva, joten
       tama on valimuistiosuma eika uusi lataus. Se piirtyy canvasille
       ruutuna 0 ja jaa nakyviin jos WebCodecsia ei ole. */
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (stopped) return;
      poster = img;
      size();
      paint(progress() * (FILM.frames - 1));
      void kaynnista();
    };
    // Epaonnistunutkin pyynto kaynnistaa elokuvan: muuten kapea
    // verkkovirhe jattaisi heron tyhjaksi kankaaksi.
    img.onerror = () => {
      if (!stopped) void kaynnista();
    };
    img.src = POSTER;

    let started = false;
    const kaynnista = async () => {
      if (started) return;
      started = true;
      /* KAPEALLA NAYTOLLA EI PURETA MITAAN, ja ilman WebCodecsia ei ole
         varasarjaa: nakyviin jaa poster. Chrome 94+, Safari 16.4+ ja
         Firefox 130+ tukevat, joten tama on kapea kaista. */
      if (!wide || !Film.tuettu()) return;
      const f = new Film();
      try {
        await f.lataa({
          src: FILM.src,
          frames: FILM.frames,
          width: FILM.width,
          height: FILM.height,
        });
        if (stopped) {
          f.vapauta();
          return;
        }
        film = f;
        shownKey = "";
        paint(progress() * (FILM.frames - 1));
      } catch {
        // Verkkovirhe tai odottamaton tiedostorakenne: poster jaa
        // nakyviin ja sivu toimii muuten normaalisti.
        f.vapauta();
      }
    };

    /* SYOTTEEN TASOITUS. macOS toimittaa hitaan vierityksen epatasaisina
       askelina, ja kun kuva seuraa vieritysta jatkuvasti, sama
       epatasaisuus nakyy sellaisenaan. Tasoitus on eksponentiaalinen ja
       AIKAPERUSTAINEN, ei kehysperustainen: sama vaimennus 60 ja 120
       Hz:lla. Kun ero kutistuu alle puolen ruudun, arvo napsautetaan
       kohdalleen, muuten silmukka jaisi kirjoittamaan ikuisesti
       haipyvia desimaaleja. */
    const SMOOTH_TAU = 0.06;
    let ps = -1;
    let prevT = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const target = progress();
      const dt = prevT ? Math.min((now - prevT) / 1000, 0.05) : 0;
      prevT = now;
      if (ps < 0 || dt === 0) ps = target;
      else {
        ps += (target - ps) * (1 - Math.exp(-dt / SMOOTH_TAU));
        if (Math.abs(target - ps) * (FILM.frames - 1) < 0.5) ps = target;
      }
      if (wide) {
        const fi = ps * (FILM.frames - 1);
        /* MOOTTORI LUKEE ASENNON TASSA RUUDUSSA, ei scroll-tapahtumasta.
           Tapahtumia ei tule tasan yhta ruutua kohti, joten tapahtumasta
           paivitetty kohde olisi osassa ruutuja vanha ja osassa kahdesti
           uusi. Jarjestys on kiintea: aseta kohde, syota purkajalle,
           piirra, vapauta ikkunan ulkopuoliset. */
        if (film?.valmis) {
          film.aseta(fi);
          film.tayta();
        }
        paint(fi);
        film?.siivoa();
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      /* VideoFrame on GPU-muistia eika roskienkeruu vapauta sita:
         ilman tata purettu ikkuna jaisi elamaan navigoinnin yli. */
      film?.vapauta();
    };
  }, []);

  return (
    <div className="hero-media vs-hero-media" aria-hidden="true">
      {/* LCP-ELEMENTTI. Canvas ei ole LCP-ehdokas, joten ilman tata
          alkunakymassa ei olisi yhtaan ehdokasta. Sama tiedosto jonka
          skrubi piirtaa ruutuna 0, joten toista latausta ei synny.
          Ei loading="lazy" eika decoding="async": molemmat siirtaisivat
          maalausta ja siten LCP:ta. object-fit: cover keskitettyna on
          sama rajaus kuin canvasin drawImage-laskenta. */}
      <img src={POSTER} alt="" width={1920} height={1080} fetchPriority="high" />
      <canvas ref={ref} />
      {/* LUETTAVUUSKERROS. Elokuvan viimeinen ruutu on laaja
          tyopoytakuva, jossa oikea naytto on kirkas. Otsikko on
          vasemmalla, joten tummennus on vasemmasta reunasta lahteva
          eika koko kuvan yli: keskiarvoinen tummennus veisi kuvalta
          juuri sen mita se on tanne tuomassa. Voimakkuus on mitattu
          tekstin todellisesta sijainnista, ks. globals.css. */}
      <i className="vs-hero-scrim" />
    </div>
  );
}
