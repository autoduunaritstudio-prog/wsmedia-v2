"use client";

import { useEffect, useRef } from "react";

import { LogoMark } from "./Logo";

/**
 * Hero-scrub: valmis ruutusarja piirretaan koko heron tayttavalle
 * canvasille scrollin mukana.
 *
 * SARJAN PITUUS ON VAIN TASSA (SETS.d.n / SETS.m.n). Kaikki muu johtaa
 * sen set.n:sta, myos <picture>-fallback, joten lukua ei ole missaan
 * toisessa tiedostossa.
 *
 * ETENEMA TULEE SPACERISTA, ei heron korkeudesta:
 *     p = clamp(scrollY / spacer.offsetHeight, 0, 1)
 *     i = round(p * (N - 1))
 * Hero on pinnattuna (top 0) ja spacer sen alla tuottaa scrollimatkan;
 * kun spacer on kulutettu, .coverin ylareuna on tasan nakyman
 * alareunassa ja seuraava vaihe alkaa. Kaava on scrollY:sta eika
 * rectista, joten se ei voi olla eri vaiheessa kuin SiteEffectsin
 * mittaukset - scrollY on yksi globaali luku framea kohti.
 *
 * NOPEUS ON KAYTTAJAN. Scrubilla ei ole omaa ajastusta: aiempi
 * scroll-tween on poistettu kokonaan, samoin sen tukirakenteet
 * (wheel-kuuntelijat, preventDefault-kulutus, Lenis-synkronointi,
 * suunnan paattely, aikakatkaisut). Etenema on pelkka scrollY.
 *
 * COVER-RAJAUS LASKETAAN CANVASIN SISALLA, ei CSS:n object-fitilla:
 *     s = max(cw / iw, ch / ih)
 *     drawImage(img, (cw - iw*s)/2, (ch - ih*s)/2, iw*s, ih*s)
 * object-fit ei koske canvasin PIIRTOPINTAAN vaan vain elementin
 * bittikartan sovitukseen, joten se olisi venyttanyt jo piirretyn kuvan.
 *
 * MUISTI. 76 x 1280 x 720 x 4 tavua = 267 MiB purettuna. Liukuvaa
 * ikkunaa ei tarvita: sarja on lyhyt ja koko joukko mahtuu muistiin.
 *
 * LATAUSJARJESTYS. Ruutu 001 heti ja piirretaan; loput vasta
 * load-tapahtuman jalkeen, CONC kappaletta kerrallaan, pienin
 * lataamaton seuraavaksi.
 *
 * ALOITUS PYSYY load-TAPAHTUMASSA. Mountissa sarja kilpailisi <picture>-
 * elementin LCP-kuvan kanssa samasta kaistasta; load takaa etta LCP on
 * jo maalattu.
 *
 * INVARIANTTI. Piirrolle annetaan aina j = lahin residentti indeksi
 * i:sta, valittuna residenteista eika indeksiaritmetiikalla. Ruutu 0 on
 * ladattu ennen kaikkea muuta, joten joukko ei ole koskaan tyhja.
 * Tama on tarpeen viela ikkunan poistonkin jalkeen: kerros vapautuu
 * RELEASE_AT-etuliitteella tai LOAD_TIMEOUTilla, siis aina vajaalla
 * sarjalla, ja silloin se on ainoa mika estaa piirron puuttuvaan
 * ruutuun.
 */

const SETS = {
  d: { dir: "/hero/d/", n: 76 },
  m: { dir: "/hero/m/", n: 51 },
};
const WIDE = "(min-width: 980px)";
const DPR_MAX = 2;
/* Yhtaaikaisten ruutulatausten maara load-tapahtuman jalkeen. */
const CONC = 5;
/* LATAUSRUUDUN AIKAKATKAISU. 12 s laskettuna latauksen alusta. Se on
   varaventtiili, ei normaali reitti: RELEASE_AT tayttyy jokaisella
   mitatulla profiililla selvasti aiemmin. Katkaisun jalkeen scrubbaus
   toimii silla mita on ladattu (nearest-resident) ja loput tulevat
   taustalla. */
const LOAD_TIMEOUT = 12000;
/* VAPAUTUSKYNNYS. Kerros ei odota koko sarjaa vaan yhtenaista etuliitetta
   RELEASE_AT asti; loput ladataan taustalla samalla lataajalla.

   ARVO ON JOHDETTU KULUTUKSEN JA TUOTON EROSTA. Rauhallinen ensikatselu
   on n. 400 px/s, mika on vh 700:lla 19,1 ruutua/s (lyhyt nakyma =
   lyhyt spacer = tihein kulutus). Hitaan 4G:n tuotto CONC 5:lla on
   8,8 ruutua/s, joten vajetta kertyy 10,3 ruutua sekunnissa sen 3,92 s
   ajan jonka koko matka kestaa - yhteensa 40,5 ruutua. 41 on siis pienin
   arvo jolla rauhallinen selaus ei jaa odottamaan yhdellakaan mitatulla
   nakymalla eika profiililla.

   Kuidulla ja tyypillisella 4G:lla tuotto (99,5 ja 25,5 ruutua/s)
   ylittaa rauhallisen kulutuksen jo ilman etuliitetta, joten kynnys
   maksaa niilla vain 0,41 s ja 1,61 s. Trackpadin heilautus (187,5
   ruutua/s) ylittaa jokaisen profiilin eika mikaan kynnys korjaa sita;
   se on sama hyvaksytty heikennys kuin ennenkin, ja nearest-resident
   piirtaa silloin lahimman residentin. */
const RELEASE_AT = 41;
/* Scroll-vihje piiloon heti kun liike alkaa. Sama kynnys molempiin
   suuntiin, joten vihje palaa kun kayttaja palaa alkuun. */
const HINT_P = 0.02;
/* Vaiheistuksen ikkunat --hero-p:n yli. Smoothstep, ei lineaarinen.
   Tekstit alkavat kolmen sekunnin kohdalta lahdevideota. Lahde on
   151 freimia 25 fps:lla (6,040 s, varmistettu ffprobella); desktop-sarja
   on joka neljas lahdefreimi (38 kpl, indeksit 0..148) ja mobiili joka
   kolmas (51 kpl). t = 3,000 s on lahdefreimi 75, mika on desktopilla
   sarjaindeksi 18,75 / 37 ja mobiilissa 25 / 50 - molemmissa p = 0,5000
   tasan.
   h1 saa nyt saman kohtelun kuin muut, joten LCP-ehdokkaana on
   .hero-median <img> eika h1. */
const WIN: [number, number][] = [
  [0.56, 0.68],  // h1
  [0.72, 0.82],  // .sub
  [0.86, 0.96],  // .heroctas
];
/* Ylagradientti tekstiryhman taakse. Ryhma (h1 + .sub + .heroctas) on
   yhtena lohkona ylhaalla, joten gradientteja tarvitaan vain yksi.

   IKKUNA [0,56, 0,62] on h1:n ikkunan alkupuolisko: taysi arvo on
   saavutettava siina p:ssa jossa h1 saavuttaa opacity 0,5, ja smoothstep
   on symmetrinen, joten se on h1:n ikkunan keskikohta 0,62. Ennen 0,56
   arvo on TASAN 0 - kuva on siis koskematon koko alkuosan ajan, mika oli
   koko muutoksen syy.

   VOIMAKKUUS 0,36 ON MITATTU, ei peritty vanhasta 0,62:sta. Pienin arvo
   joka vie kaikki nelja elementtia yli 4,5:1:n on 0,3411 (sitova h1
   freimilla 048, 1440x900, kirkkain pikseli puhdas valkoinen, scrim
   siina 0,376). 0,36 on pienin sadasosan askel sen yli. */
const GLOW_MAX = 0.36;
const GLOW_WIN: [number, number] = [0.56, 0.62];
/* Globaali scrim, kaksi jaksoa. Gradienttikerrokset ovat pois paalta
   (--hero-glow-on), joten tama on ainoa tummennus.

     p = 0      : 0, ei tummennusta lainkaan
     p = 0 -> 1 : LINEAARISESTI 0 -> SCRIM_P
     q = 0 -> 1 : EASE OUT SCRIM_P -> SCRIM_Q, kayralla 1 - (1-q)^2

   Kayra on nopea alussa ja hidastuu loppua kohti: tummennus ehtii tehda
   tyonsa heti kun cover alkaa nousta eika jaa kiihtymaan siina vaiheessa
   kun hero on jo lahes peitossa.

   JATKUVUUS. Arvo on SCRIM_P molemmin puolin liitosta, koska q = 0 kun
   p = 1. Muutosnopeus scroll-pikselia kohti:
     scrubin puoli : SCRIM_P / S,  missa S = 2,24 * vh
     coverin puoli : (SCRIM_Q - SCRIM_P) * f'(0) / vh,  f'(0) = 2
   Suhde = (0,20 * 2 / vh) / (0,60 / (2,24 * vh)) = 0,4 * 2,24 / 0,6
         = 1,493. Riippumaton nakyman korkeudesta ja alle kahden, joten
   liitoksessa ei tunnu nykaysta. */
const SCRIM_P = 0.6;
const SCRIM_Q = 0.8;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

const frameSrc = (dir: string, i: number) => `${dir}${String(i + 1).padStart(3, "0")}.webp`;
export default function HeroScrub() {
  const ref = useRef<HTMLCanvasElement>(null);
  const load = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const hero = cv.closest<HTMLElement>(".hero");
    const spacer = document.querySelector<HTMLElement>(".hero-spacer");
    // Sarja valitaan kerran mountissa eika resizessa: vaihto kesken
    // istunnon heittaisi jo ladatut ruudut pois ja hakisi koko uuden.
    const set = window.matchMedia(WIDE).matches ? SETS.d : SETS.m;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const imgs: (HTMLImageElement | null)[] = new Array(set.n).fill(null);
    // RATKENNEET, ei ladatut: epaonnistunut pyynto merkitaan myos, jotta
    // yksi 404 ei pysayta etuliitetta eika jata kerrosta odottamaan
    // aikakatkaisuun asti. imgs[i] jaa silloin nulliksi ja nearest()
    // ohittaa sen.
    const settled: boolean[] = new Array(set.n).fill(false);
    // Pisin yhtenainen etuliite ratkenneista. Vapautus nojaa juuri
    // etuliitteeseen eika lukumaaraan: scrubbaus kuluttaa ruudut
    // jarjestyksessa, joten aukkoinen joukko ei kata matkan alkua.
    let ready = 0;
    const K = Math.min(RELEASE_AT, set.n);
    let shown = -1;
    let raf = 0;
    let stopped = false;

    // AVAUS ALUSTA. Hero on intro-animaatio, joten sen keskelta
    // aloittaminen ei ole mielekasta: selaimen oma palautus otetaan pois
    // kaytosta ja sijainti nollataan ennen kuin kerros haipyy.
    const restore = history.scrollRestoration;
    history.scrollRestoration = "manual";

    // Canvas mitoitetaan NAKYVAAN kokoon, dpr-katto 2. Kolmen ja neljan
    // dpr:n naytoilla 3x-puskuri maksaisi yli kaksinkertaisen taytto-
    // kaistan ilman etta 1280px levea lahde tarjoaa lisadetaljia.
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
      const w = Math.round(cv.clientWidth * dpr);
      const h = Math.round(cv.clientHeight * dpr);
      if (w > 0 && h > 0 && (cv.width !== w || cv.height !== h)) {
        cv.width = w;
        cv.height = h;
        shown = -1;
      }
    };

    // Lahin residentti indeksi. Haku etenee ulospain i:sta, joten se
    // loytaa aina lahimman; tasatilanteessa pienempi indeksi voittaa.
    // Ruutu 0 ladataan ennen kaikkea muuta, joten palautus on residentti.
    const nearest = (i: number) => {
      if (imgs[i]) return i;
      for (let d = 1; d < set.n; d++) {
        if (i - d >= 0 && imgs[i - d]) return i - d;
        if (i + d < set.n && imgs[i + d]) return i + d;
      }
      return 0;
    };

    const paint = (i: number) => {
      const img = imgs[i];
      if (!img || i === shown) return;
      shown = i;
      const s = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (cv.width - dw) / 2, (cv.height - dh) / 2, dw, dh);
    };

    const fetchFrame = (i: number) =>
      new Promise<void>((done) => {
        const img = new Image();
        img.decoding = "async";
        const fin = () => {
          // Epaonnistunutkin pyynto kasvattaa laskuria: muuten palkki
          // jaisi jumiin ja kerros odottaisi aikakatkaisuun asti ruutua
          // joka ei koskaan tule.
          settled[i] = true;
          while (ready < set.n && settled[ready]) ready++;
          tick();
          done();
        };
        img.onload = () => {
          imgs[i] = img;
          fin();
        };
        img.onerror = fin;
        img.src = frameSrc(set.dir, i);
      });

    // Kaikki kerrokset ovat puhtaita funktioita p:sta ja q:sta. Kirjoitus
    // vain kun arvo oikeasti muuttuu, jottei joka frame likaa tyyleja.
    const prev: Record<string, string> = {};
    const put = (name: string, v: number) => {
      const t = v.toFixed(3);
      if (hero && prev[name] !== t) {
        prev[name] = t;
        hero.style.setProperty(name, t);
      }
    };
    const schedule = (p: number) => {
      for (let k = 0; k < WIN.length; k++) put(`--st${k + 1}`, smoothstep(WIN[k][0], WIN[k][1], p));
      put("--hero-glow", GLOW_MAX * smoothstep(GLOW_WIN[0], GLOW_WIN[1], p));
      const raw = hero ? parseFloat(hero.style.getPropertyValue("--hero-q")) : 0;
      const q = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 1) : 0;
      put("--hero-scrim", SCRIM_P * p + (SCRIM_Q - SCRIM_P) * (1 - (1 - q) * (1 - q)));
      put("--hero-hint", p > HINT_P ? 0 : 1);
    };
    const progress = () => {
      const span = spacer?.offsetHeight ?? 0;
      return span > 0 ? Math.min(Math.max(window.scrollY / span, 0), 1) : 0;
    };

    const onResize = () => {
      size();
      paint(nearest(Math.max(shown, 0)));
    };
    window.addEventListener("resize", onResize, { passive: true });

    // LATAUSRUUTU. Palkki seuraa TODELLISTA latausta: leveys on
    // count / set.n, ei ajastinta. Arvo kirjoitetaan suoraan DOMiin eika
    // Reactin tilaan, jottei 76 latausta tuota 76 uudelleenrenderointia.
    let timer = 0;
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      window.clearTimeout(timer);
      // Ankkurilinkki menee nollauksen edelle: kayttaja on pyytanyt
      // tiettya kohtaa sivulla, ei introa. Sama ehto kuin
      // SmoothScrollin sivunvaihtonollauksessa.
      if (!window.location.hash) window.scrollTo(0, 0);
      document.documentElement.classList.remove("hero-locked");
      load.current?.classList.add("is-gone");
    };
    // Palkki mittaa 0 -> K eika 0 -> set.n: kayttajalle ei nayteta
    // palkkia joka pysahtyy puoliveliin. Se on silti todellinen
    // edistyminen - sama etuliite jolla vapautus tehdaan - ja tayttyy
    // tasan silla hetkella kun kerros haipyy.
    const tick = () => {
      if (bar.current) bar.current.style.width = `${Math.min(ready / K, 1) * 100}%`;
      if (ready >= K) release();
    };

    // Reduced motion: ei scrubia eika sarjan latausta, vain viimeinen
    // ruutu paikallaan.
    if (reduce) {
      // Ei scrubia eika sarjan latausta, vain viimeinen ruutu. Tummennus
      // saa silti seurata scrollia: se ei ole liiketta. Tekstien
      // lopputila tulee CSS:n reduced-motion-saannosta, joten --st-arvoja
      // ei tarvitse kirjoittaa. Latausruutua ei nayteta lainkaan: yksi
      // ruutu ei ole lataus jota kannattaisi odottaa.
      release();
      const last = set.n - 1;
      fetchFrame(last).then(() => {
        size();
        paint(last);
      });
      const still = () => {
        raf = requestAnimationFrame(still);
        const p = progress();
        put("--hero-glow", GLOW_MAX * smoothstep(GLOW_WIN[0], GLOW_WIN[1], p));
        const raw = hero ? parseFloat(hero.style.getPropertyValue("--hero-q")) : 0;
        const q = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 1) : 0;
        put("--hero-scrim", SCRIM_P * p + (SCRIM_Q - SCRIM_P) * (1 - (1 - q) * (1 - q)));
        put("--hero-hint", p > HINT_P ? 0 : 1);
      };
      raf = requestAnimationFrame(still);
      return () => {
        stopped = true;
        history.scrollRestoration = restore;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
      };
    }

    document.documentElement.classList.add("hero-locked");
    if (!window.location.hash) window.scrollTo(0, 0);

    size();
    fetchFrame(0).then(() => {
      if (stopped) return;
      size();
      paint(0);
    });

    const idle = (cb: () => void) =>
      typeof requestIdleCallback === "function"
        ? requestIdleCallback(() => cb())
        : window.setTimeout(cb, 1);

    // CONC 5: tehollinen aika ruutua kohti on RTT/5 + koko/kaista, eli
    // kaistan asettama lattia on saavutettavissa. Isompi maara vain
    // pilkkoisi kaistan pienempiin osiin.
    let started = false;
    const rest = () => {
      if (started) return;
      started = true;
      // KAYTTAJAA EI JATETA JUMIIN. Kello kaynnistyy vasta kun lataus
      // oikeasti alkaa, jottei hidas load-tapahtuma syo varaa.
      timer = window.setTimeout(release, LOAD_TIMEOUT);
      let next = 1;
      let active = 0;
      const pump = () => {
        if (stopped) return;
        while (active < CONC && next < set.n) {
          const i = next++;
          active++;
          fetchFrame(i).then(() => {
            active--;
            idle(pump);
          });
        }
      };
      idle(pump);
    };
    if (document.readyState === "complete") rest();
    else window.addEventListener("load", rest, { once: true });

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const p = progress();
      paint(nearest(Math.round(p * (set.n - 1))));
      schedule(p);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      stopped = true;
      history.scrollRestoration = restore;
      window.clearTimeout(timer);
      document.documentElement.classList.remove("hero-locked");
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", rest);
    };
  }, []);

  return (
    <div className="hero-media" aria-hidden="true">
      {/* LCP-ELEMENTTI. Canvas ei ole LCP-ehdokas eika inline-SVG
          myoskaan, ja h1 alkaa nyt opacity 0:sta - ilman tata
          alkunakymassa ei olisi yhtaan ehdokasta.

          Sama tiedosto jonka scrub hakee ensimmaisena (load(0)), ja
          <source>-ehto on sama 980px:n raja jolla sarja valitaan, joten
          selain nakee saman URL:n eika toista latausta synny.

          Ei loading="lazy" eika decoding="async": molemmat siirtaisivat
          maalausta ja siten LCP:ta. object-fit: cover keskitettyna on
          sama rajaus kuin canvasin drawImage-laskenta. */}
      <picture>
        <source media="(max-width: 979px)" srcSet={frameSrc(SETS.m.dir, 0)} />
        <img
          src={frameSrc(SETS.d.dir, 0)}
          alt=""
          width={1280}
          height={720}
          fetchPriority="high"
        />
      </picture>
      <canvas ref={ref} />
      {/* SCROLL-VIHJE. Nakyvyys tulee --hero-hintista, jonka rAF-silmukka
          kirjoittaa heroon: p > 0,02 -> 0, muuten 1. Palaa siis itsestaan
          kun kayttaja palaa alkuun. */}
      <div className="hero-hint">
        <span>Vieritä</span>
        <i />
      </div>
      {/* LATAUSRUUTU. Peittaa nakyman kunnes sarja on ladattu tai
          LOAD_TIMEOUT laukeaa. Logo on navin oma LogoMark, ei uusi
          piirros. Palkin leveys tulee latauslaskurista suoraan DOMiin. */}
      <div className="hero-load" ref={load}>
        <LogoMark className="hero-load-logo" />
        <div className="hero-load-track">
          <div className="hero-load-bar" ref={bar} />
        </div>
      </div>
    </div>
  );
}
