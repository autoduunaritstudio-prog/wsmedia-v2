"use client";

import { useEffect, useRef } from "react";

/**
 * Hero-scrub: valmis ruutusarja piirretaan canvasille scrollin mukana.
 *
 * ETENEMA EI OLE UUSI MITTARI. SiteEffects laskee jo heron pin-vaiheen
 * etenemaa scrimia varten:
 *     p = clamp(1 - cover.top / vh, 0, 1)
 * eli 0 kun coverin ylareuna on nakyman alareunassa ja 1 kun cover
 * peittaa heron kokonaan. Koska .stickyzone > .hero on tasan 100vh, sen
 * sticky-top on 0 ja cover.top = heroH - scrollY = vh - scrollY, joten
 * p = scrollY / vh. SiteEffects julkaisee saman p:n muuttujassa
 * --hero-p, ja ruudun indeksi on
 *     i = round(p * (N - 1)).
 * Kaksi rAF-silmukkaa ei siis lue samaa rectia eri vaiheessa framea.
 *
 * MUISTI. drawImage HTMLImageElementeista, ei createImageBitmapista:
 * 76 x 1280 x 720 x 4 tavua olisi 280 Mt purettuna ja pysyisi muistissa
 * kunnes bitmapit vapautetaan kasin. Selain hallitsee HTMLImageElementin
 * purkumuistin itse ja voi vapauttaa sen tarvittaessa.
 *
 * LATAUSJARJESTYS. Ruutu 001 haetaan heti (21,5 kt) ja piirretaan; loput
 * vasta load-tapahtuman jalkeen, yksi kerrallaan requestIdleCallbackissa.
 * Scrub ei odota: jos pyydettya ruutua ei ole viela ladattu, piirretaan
 * lahin ladattu. Koska lataus etenee jarjestyksessa, ladatut ovat aina
 * yhtenainen etuliite 0..ready-1, joten lahin on min(i, ready-1).
 */

const SETS = {
  d: { dir: "/hero/d/", n: 76 },
  m: { dir: "/hero/m/", n: 51 },
};
const WIDE = "(min-width: 980px)";
const DPR_MAX = 2;

const frameSrc = (dir: string, i: number) => `${dir}${String(i + 1).padStart(3, "0")}.webp`;

export default function HeroScrub() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const hero = cv.closest<HTMLElement>(".hero");
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
    // kaistan ilman etta 1280px levea lahde tarjoaa yhtaan lisadetaljia.
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
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
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

    const onResize = () => {
      size();
      paint(Math.min(Math.max(shown, 0), Math.max(ready - 1, 0)));
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Reduced motion: ei scrubia eika sarjan latausta, vain viimeinen
    // ruutu eli valmis poytanakyma.
    if (reduce) {
      const last = set.n - 1;
      load(last).then(() => {
        ready = set.n;
        size();
        paint(last);
      });
      return () => {
        stopped = true;
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
      const raw = hero ? parseFloat(hero.style.getPropertyValue("--hero-p")) : 0;
      const p = Number.isFinite(raw) ? Math.min(Math.max(raw, 0), 1) : 0;
      const want = Math.round(p * (set.n - 1));
      paint(Math.min(want, Math.max(ready - 1, 0)));
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
    <div className="heroscrub li d5" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
