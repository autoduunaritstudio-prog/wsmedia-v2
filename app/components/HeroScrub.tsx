"use client";

import { useEffect, useRef } from "react";

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
 * COVER-RAJAUS LASKETAAN CANVASIN SISALLA, ei CSS:n object-fitilla:
 *     s = max(cw / iw, ch / ih)
 *     drawImage(img, (cw - iw*s)/2, (ch - ih*s)/2, iw*s, ih*s)
 * object-fit ei koske canvasin PIIRTOPINTAAN vaan vain elementin
 * bittikartan sovitukseen, joten se olisi venyttanyt jo piirretyn kuvan.
 *
 * MUISTI. drawImage HTMLImageElementeista, ei createImageBitmapista:
 * 38 x 1280 x 720 x 4 tavua olisi 140 Mt purettuna ja pysyisi muistissa
 * kunnes bitmapit vapautetaan kasin.
 *
 * LATAUSJARJESTYS. Ruutu 001 heti (20,9 kt) ja piirretaan; loput vasta
 * load-tapahtuman jalkeen, CONC kappaletta kerrallaan ja aina pienin
 * lataamaton seuraavaksi.
 *
 * ALOITUS PYSYY load-TAPAHTUMASSA. Mountissa sarja kilpailisi <picture>-
 * elementin LCP-kuvan kanssa samasta kaistasta; load takaa etta LCP on
 * jo maalattu.
 *
 * YHTENAINEN ETULIITE. Rinnakkaisuudessa ruudut valmistuvat epa-
 * jarjestyksessa, joten ready EI ole ladattujen lukumaara vaan pisin
 * yhtenainen etuliite: while (ready < n && imgs[ready]) ready++. Vain
 * silloin piirron leikkaus min(i, ready-1) osuu varmasti ladattuun -
 * lukumaaralla se osoittaisi aukkoon heti kun ruutu 5 saapuu ennen
 * ruutua 4.
 */

const SETS = {
  d: { dir: "/hero/d/", n: 38 },
  m: { dir: "/hero/m/", n: 51 },
};
const WIDE = "(min-width: 980px)";
const DPR_MAX = 2;
/* Yhtaaikaisten ruutulatausten maara load-tapahtuman jalkeen. */
const CONC = 5;
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
    let ready = 0;
    let shown = -1;
    let raf = 0;
    let stopped = false;

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

    const paint = (i: number) => {
      const img = imgs[i];
      if (!img || i === shown) return;
      shown = i;
      const s = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (cv.width - dw) / 2, (cv.height - dh) / 2, dw, dh);
    };

    const load = (i: number) =>
      new Promise<void>((done) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          imgs[i] = img;
          done();
        };
        img.onerror = () => done();
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
    };
    const progress = () => {
      const span = spacer?.offsetHeight ?? 0;
      return span > 0 ? Math.min(Math.max(window.scrollY / span, 0), 1) : 0;
    };

    const onResize = () => {
      size();
      paint(Math.min(Math.max(shown, 0), Math.max(ready - 1, 0)));
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Reduced motion: ei scrubia eika sarjan latausta, vain viimeinen
    // ruutu paikallaan.
    if (reduce) {
      // Ei scrubia eika sarjan latausta, vain viimeinen ruutu. Tummennus
      // saa silti seurata scrollia: se ei ole liiketta. Tekstien
      // lopputila tulee CSS:n reduced-motion-saannosta, joten --st-arvoja
      // ei tarvitse kirjoittaa.
      const last = set.n - 1;
      load(last).then(() => {
        ready = set.n;
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
      };
      raf = requestAnimationFrame(still);
      return () => {
        stopped = true;
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", onResize);
      };
    }

    size();
    load(0).then(() => {
      if (stopped) return;
      ready = Math.max(ready, 1);
      size();
      paint(0);
    });

    const idle = (cb: () => void) =>
      typeof requestIdleCallback === "function"
        ? requestIdleCallback(() => cb())
        : window.setTimeout(cb, 1);

    // Perakkainen ketju maksoi yhden RTT:n JOKA ruudusta, koska seuraavaa
    // ei pyydetty ennen kuin edellinen oli valmis. Viidella yhtaaikaisella
    // pyynnolla RTT jakautuu viidelle ja tehollinen aika ruutua kohti on
    // RTT/5 + koko/kaista, eli kaistan asettama lattia on saavutettavissa.
    // Viisi eika enempaa: HTTP/2:n ikkuna ja selaimen prioriteetit
    // riittavat tahan, ja isompi maara vain pilkkoisi kaistan pienempiin
    // osiin ilman etta yhtenainen etuliite kasvaisi nopeammin.
    const rest = () => {
      let next = 1;
      let active = 0;
      const pump = () => {
        if (stopped) return;
        // Aina pienin lataamaton seuraavaksi, joten etuliite kasvaa
        // mahdollisimman nopeasti eika hyppely jata aukkoja alkuun.
        while (active < CONC && next < set.n) {
          const i = next++;
          active++;
          load(i).then(() => {
            active--;
            // PISIN YHTENAINEN ETULIITE, ei ladattujen lukumaara. Ks.
            // tiedoston ylakommentti: piirron leikkaus nojaa tahan.
            while (ready < set.n && imgs[ready]) ready++;
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
      paint(Math.min(Math.round(p * (set.n - 1)), Math.max(ready - 1, 0)));
      schedule(p);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      stopped = true;
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
    </div>
  );
}
