"use client";

import { useEffect, useRef } from "react";

/**
 * Hero-scrub: valmis ruutusarja piirretaan koko heron tayttavalle
 * canvasille scrollin mukana.
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
 * 76 x 1280 x 720 x 4 tavua olisi 280 Mt purettuna ja pysyisi muistissa
 * kunnes bitmapit vapautetaan kasin.
 *
 * LATAUSJARJESTYS. Ruutu 001 heti (21,0 kt) ja piirretaan; loput vasta
 * load-tapahtuman jalkeen yksi kerrallaan requestIdleCallbackissa.
 * Scrub ei odota: lataus etenee jarjestyksessa, joten ladatut ovat aina
 * yhtenainen etuliite 0..ready-1 ja lahin ladattu on min(i, ready-1).
 */

const SETS = {
  d: { dir: "/hero/d/", n: 76 },
  m: { dir: "/hero/m/", n: 51 },
};
const WIDE = "(min-width: 980px)";
const DPR_MAX = 2;
/* Vaiheistuksen ikkunat --hero-p:n yli. Smoothstep, ei lineaarinen.
   h1 EI ole listalla: se on nakyvissa heti p = 0:sta, koska opacity 0
   poistaisi sen LCP-ehdokkaista latushetkella. Indeksit alkavat
   kakkosesta, jotta CSS:n --st2 ja --st3 vastaavat elementteja. */
const WIN: [number, number][] = [
  [0.3, 0.55],   // .sub
  [0.62, 0.88],  // .heroctas
];
/* Alanurkan gradientti. Taysi arvo on saavutettava siina p:ssa jossa
   .sub saavuttaa opacity 0,5 - smoothstep on symmetrinen, joten se on
   ikkunan keskikohta 0,425. Nousuikkuna [0,30, 0,425] on siis .subin oman
   ikkunan alkupuolisko. .heroctas saavuttaa 0,5:n vasta 0,75:ssa, jolloin
   gradientti on jo taysi. 0,62 kattaa mitatut vaatimukset (.sub 0,634 ja
   .heroctas 0,667) yhdessa globaalin scrimin kanssa. */
const GLOW_MAX = 0.62;
const GLOW_WIN: [number, number] = [0.3, 0.425];
/* Globaali scrim: tunnelmaa, ei luettavuutta. 0,30 on maltillinen -
   kuvasta jaa 70 % kirkkaudesta, ja luettavuus tulee gradientista.
   p = 1:sta eteenpain jatketaan coverin omalla etenemalla q kohti
   taytta peittoa; siirtyma on jatkuva, koska q = 0 kun p = 1. */
const SCRIM_MID = 0.3;
const SCRIM_WIN: [number, number] = [0, 0.88];

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
    // istunnon heittaisi jo ladatut ruudut pois ja hakisi 76 uutta.
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
      for (let k = 0; k < WIN.length; k++) put(`--st${k + 2}`, smoothstep(WIN[k][0], WIN[k][1], p));
      put("--hero-glow", GLOW_MAX * smoothstep(GLOW_WIN[0], GLOW_WIN[1], p));
      const raw = hero ? parseFloat(hero.style.getPropertyValue("--hero-q")) : 0;
      const q = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 1) : 0;
      put("--hero-scrim", SCRIM_MID * smoothstep(SCRIM_WIN[0], SCRIM_WIN[1], p) + (1 - SCRIM_MID) * q);
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
        put("--hero-scrim", SCRIM_MID * smoothstep(SCRIM_WIN[0], SCRIM_WIN[1], p) + (1 - SCRIM_MID) * q);
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

    const rest = () => {
      let next = 1;
      const step = () => {
        if (stopped || next >= set.n) return;
        const i = next++;
        load(i).then(() => {
          while (ready < set.n && imgs[ready]) ready++;
          idle(step);
        });
      };
      idle(step);
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
      <canvas ref={ref} />
    </div>
  );
}
