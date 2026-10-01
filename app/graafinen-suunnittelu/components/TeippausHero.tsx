"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Inter_Tight, Jost } from "next/font/google";

import s from "./TeippausHero.module.css";

/**
 * TEIPPAUS-HERO, porttaus prototyypista wsmedia-teippaus-hero/hero.html.
 * Asettelu, grafiikka, varit, ajoitukset ja tekstit ovat samat kuin
 * prototyypissa (ks. SPEC.md). Prototyypin taustaverkko on jatetty pois,
 * sivun oma NetBackdrop riittaa.
 *
 * Ainoa rakenteellinen lisays: desktopilla vierityskaaren peraan tulee
 * 100svh hantaa, jonka paalle sivun cover nousee kuten muillakin
 * palvelusivuilla. Animaation edistyma lasketaan edelleen 420vh:n
 * .scrub-mittarista, joten ajoitukset eivat muutu.
 */

const interTight = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });
const jost = Jost({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

const SWATCHES = [
  { w: "#10172a", a: "#7fe3f7", l: "#ece3d6", label: "Yönsininen ja syaani" },
  { w: "#e9dfd0", a: "#1c2742", l: "#182034", label: "Hiekka ja tummansininen", sa: "#182034" },
  { w: "#0a0a0c", a: "#ece3d6", l: "#ffffff", label: "Musta ja hiekka" },
  { w: "#58cfe6", a: "#10172a", l: "#10172a", label: "Syaani ja tummansininen" },
  { w: "#5b3df5", a: "#ffffff", l: "#ffffff", label: "Violetti ja valkoinen" },
];

const MARK: number[][] = [
  [0, 0, 196, 339, 235, 265, 82, 0],
  [158, 0, 355, 339, 394, 266, 240, 0],
  [320, 0, 414, 163, 537, 164, 517, 199, 435, 199, 516, 341, 652, 107, 464, 107, 437, 61, 679, 60, 714, 1],
];

export default function TeippausHero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = <T extends Element>(sel: string) => el.querySelector(sel) as T;
    const FONT = interTight.style.fontFamily;
    const WORD = jost.style.fontFamily;

    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mob = matchMedia("(max-width:900px)");
    const track = q<HTMLElement>("[data-th=track]");
    const scrub = q<HTMLElement>("[data-th=scrub]");
    const cv = q<HTMLCanvasElement>("[data-th=van]");
    const cx = cv.getContext("2d")!;
    const W = cv.width;
    const H = cv.height;
    const vanbox = q<HTMLElement>("[data-th=vanbox]");
    const pSign = q<HTMLElement>("[data-th=sign]");
    const pRoll = q<HTMLElement>("[data-th=roll]");
    const pCards = q<HTMLElement>("[data-th=cards]");
    const gloss = q<HTMLElement>("[data-th=gloss]");
    const cap = q<HTMLElement>("[data-th=cap]");
    const fill = q<HTMLElement>("[data-th=fill]");
    const trk = q<HTMLElement>("[data-th=trk]");
    const lbl = q<HTMLElement>("[data-th=lbl]");
    const mouse = q<HTMLElement>("[data-th=mouse]");
    const pct = q<HTMLElement>("[data-th=pct]");
    const sl1 = q<SVGElement>("[data-th=sl1]");
    const sl2 = q<SVGElement>("[data-th=sl2]");
    const mk = (w: number, h: number) => {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      return c;
    };

    /* Repeytynyt reuna on siirretty heron alareunasta coverin
       ylareunaan, ks. RepeytyvaReuna.tsx. */

    // palette
    let pal = { w: "#10172a", a: "#7fe3f7", l: "#ece3d6" };
    const sws = Array.from(el.querySelectorAll<HTMLButtonElement>("[data-th=sw]"));
    const onSw = (b: HTMLButtonElement) => () => {
      pal = { w: b.dataset.w!, a: b.dataset.a!, l: b.dataset.l! };
      el.style.setProperty("--wrap", pal.w);
      el.style.setProperty("--acc", pal.a);
      el.style.setProperty("--logo", pal.l);
      sws.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      if (ready) buildWrap();
    };
    const swHandlers = sws.map((b) => {
      const h = onSw(b);
      b.addEventListener("click", h);
      return h;
    });

    // van wrap
    const photo = new Image();
    const maskImg = new Image();
    let P: Uint8ClampedArray;
    let M: Uint8ClampedArray;
    let maskC: HTMLCanvasElement;
    const wrapC = mk(W, H);
    const albC = mk(W, H);
    const tmp = mk(W, H);
    let ready = false;
    let alive = true;
    const drawMark = (a: CanvasRenderingContext2D, x: number, y: number, h: number, col: string) => {
      const sc = h / 341;
      a.fillStyle = col;
      a.beginPath();
      MARK.forEach((p) => {
        a.moveTo(x + p[0] * sc, y + p[1] * sc);
        for (let i = 2; i < p.length; i += 2) a.lineTo(x + p[i] * sc, y + p[i + 1] * sc);
        a.closePath();
      });
      a.fill();
    };
    const drawMedia = (a: CanvasRenderingContext2D, x: number, y: number, w: number, size: number, col: string) => {
      a.fillStyle = col;
      a.font = `400 ${size}px ${WORD},Jost,Futura,sans-serif`;
      a.textBaseline = "alphabetic";
      const L = "MEDIA";
      const ws = [...L].map((c) => a.measureText(c).width);
      const gap = (w - ws.reduce((t, v) => t + v, 0)) / 4;
      let cx0 = x;
      [...L].forEach((c, i) => {
        a.fillText(c, cx0, y);
        cx0 += ws[i] + gap;
      });
    };
    const bar = (a: CanvasRenderingContext2D, x: number, top: number, bot: number, w: number, col: string) => {
      const k = 196 / 339;
      a.fillStyle = col;
      a.beginPath();
      a.moveTo(x, top);
      a.lineTo(x + w, top);
      a.lineTo(x + w + (bot - top) * k, bot);
      a.lineTo(x + (bot - top) * k, bot);
      a.closePath();
      a.fill();
    };
    const drawAlbedo = () => {
      const a = albC.getContext("2d")! as CanvasRenderingContext2D & { letterSpacing: string };
      a.clearRect(0, 0, W, H);
      a.fillStyle = pal.w;
      a.fillRect(0, 0, W, H);
      // rear speed bars, echoing the W strokes
      bar(a, 930, 120, 560, 92, pal.a);
      bar(a, 1052, 120, 560, 58, pal.a);
      bar(a, 1140, 120, 560, 30, pal.l);
      // front fender sliver
      bar(a, 40, 120, 560, 34, pal.a);
      // sill band
      a.fillStyle = pal.a;
      a.fillRect(0, 476, W, 60);
      // main logo
      drawMark(a, 548, 168, 150, pal.l);
      drawMedia(a, 550, 370, 310, 44, pal.l);
      a.fillStyle = pal.a;
      a.font = `800 23px ${FONT},system-ui,sans-serif`;
      a.letterSpacing = "2px";
      a.fillText("TEHDÄÄN YRITYKSESTÄSI NÄKYVÄ.", 550, 420);
      a.letterSpacing = "0px";
      // cab door
      drawMark(a, 306, 376, 34, pal.l);
      a.fillStyle = pal.l;
      a.font = `700 23px ${FONT},system-ui,sans-serif`;
      a.fillText("wsmedia.fi", 380, 405);
    };
    const buildWrap = () => {
      drawAlbedo();
      const A = albC.getContext("2d")!.getImageData(0, 0, W, H).data;
      const out = wrapC.getContext("2d")!.createImageData(W, H);
      const o = out.data;
      for (let i = 0; i < o.length; i += 4) {
        const m = M[i];
        if (!m) {
          o[i + 3] = 0;
          continue;
        }
        const L = (0.299 * P[i] + 0.587 * P[i + 1] + 0.114 * P[i + 2]) / 255;
        const sh = Math.min(1.12, L / 0.8);
        const sp = Math.max(0, (L - 0.86) / 0.14);
        const spk = sp * sp * 0.5;
        for (let c = 0; c < 3; c++) {
          const v = A[i + c] * sh;
          o[i + c] = v + (255 - v) * spk;
        }
        o[i + 3] = m;
      }
      wrapC.getContext("2d")!.putImageData(out, 0, 0);
    };
    const init = () => {
      if (!alive) return;
      const t = tmp.getContext("2d", { willReadFrequently: true })!;
      t.drawImage(photo, 0, 0, W, H);
      P = t.getImageData(0, 0, W, H).data;
      maskC = mk(W, H);
      const m = maskC.getContext("2d")!;
      m.drawImage(maskImg, 0, 0, W, H);
      const md = m.getImageData(0, 0, W, H);
      M = new Uint8ClampedArray(md.data.length);
      for (let i = 0; i < M.length; i += 4) {
        M[i] = md.data[i];
        md.data[i + 3] = md.data[i];
      }
      m.putImageData(md, 0, 0);
      buildWrap();
      ready = true;
    };
    let loaded = 0;
    const onLoad = () => {
      if (++loaded === 2) (document.fonts ? document.fonts.ready : Promise.resolve()).then(init);
    };
    photo.onload = onLoad;
    maskImg.onload = onLoad;
    photo.src = "/graafinen-suunnittelu/van-blank.jpg";
    maskImg.src = "/graafinen-suunnittelu/van-mask.png";

    const X0 = 90;
    const X1 = 1255;
    const maskedBand = (fn: (t: CanvasRenderingContext2D) => void, op: GlobalCompositeOperation, alpha: number) => {
      const t = tmp.getContext("2d")!;
      t.globalCompositeOperation = "source-over";
      t.clearRect(0, 0, W, H);
      fn(t);
      t.globalCompositeOperation = "destination-in";
      t.drawImage(maskC, 0, 0);
      t.globalCompositeOperation = "source-over";
      cx.globalCompositeOperation = op;
      cx.globalAlpha = alpha;
      cx.drawImage(tmp, 0, 0);
      cx.globalCompositeOperation = "source-over";
      cx.globalAlpha = 1;
    };

    /* AIKAJANA ILMAN TYHJAA ALKUA JA LOPPUA.
       Prototyypin aikajanalla p 0..0,08 ei tapahdu mitaan ja 0,98..1
       vain odotetaan, mitattuna 13 % ja 10 % tyhjaa vieritysta.
       Vieritys pr 0..1 kuvataan nyt suoraan valille 0,08..0,98, joten
       teippaus alkaa ensimmaisesta rullan askeleesta ja kuvateksti on
       valmis kun vieritys loppuu. Tapahtumien keskinaiset ajoitukset
       eivat muutu, ja .meterin korkeus lyheni samassa suhteessa
       (320vh -> 288vh vierityskaarta), joten tahti on sama. */
    const P0 = 0.08;
    const P1 = 0.98;
    let pr = reduce ? 1 : 0;
    let p = reduce ? 1 : P0;
    let mx = 0.5;
    let smx = 0.5;
    let hover = 0;
    let shov = 0;
    const progress = () => {
      const e = mob.matches ? track : scrub;
      const r = e.getBoundingClientRect();
      return clamp(-r.top / (r.height - innerHeight));
    };
    const prop = (e: HTMLElement, t: number, from: [number, number, number]) => {
      const k = ease(clamp(t));
      e.style.opacity = String(k);
      e.style.transform = `translate(${(1 - k) * from[0]}%,${(1 - k) * from[1]}%) scale(${lerp(from[2], 1, k)})`;
    };
    let raf = 0;
    const frame = () => {
      if (!reduce) {
        pr = progress();
        p = P0 + (P1 - P0) * pr;
      }
      smx += (mx - smx) * 0.08;
      shov += (hover - shov) * 0.06;
      const pw = ease(clamp((p - 0.08) / 0.42));
      const sh = clamp((p - 0.5) / 0.12);
      const gather = ease(clamp((p - 0.62) / 0.14));
      // torn panel
      sl1.style.transform = `translateY(${-p * 6}%)`;
      sl2.style.transform = `translateY(${p * 4}%)`;
      if (ready) {
        cx.clearRect(0, 0, W, H);
        cx.drawImage(photo, 0, 0, W, H);
        const edge = X0 + (X1 - X0) * pw;
        if (pw > 0) {
          cx.save();
          cx.beginPath();
          cx.rect(0, 0, edge, H);
          cx.clip();
          cx.drawImage(wrapC, 0, 0);
          cx.restore();
          cx.save();
          cx.beginPath();
          cx.rect(0, 548, edge, H);
          cx.clip();
          cx.translate(0, 1096);
          cx.scale(1, -1);
          cx.globalCompositeOperation = "color";
          cx.globalAlpha = 0.45;
          cx.drawImage(wrapC, 0, 0);
          cx.restore();
        }
        if (pw > 0.002 && pw < 0.998)
          maskedBand(
            (t) => {
              const g = t.createLinearGradient(edge - 26, 0, edge + 46, 0);
              g.addColorStop(0, "rgba(0,0,0,0)");
              g.addColorStop(0.33, "rgba(0,0,0,.5)");
              g.addColorStop(0.38, "rgba(250,251,255,1)");
              g.addColorStop(0.7, "rgba(214,220,232,1)");
              g.addColorStop(1, "rgba(214,220,232,0)");
              t.fillStyle = g;
              t.fillRect(edge - 26, 0, 72, H);
            },
            "source-over",
            1,
          );
        if (sh > 0 && sh < 1) {
          const x = X0 - 200 + (X1 - X0 + 400) * ease(sh);
          maskedBand(
            (t) => {
              const g = t.createLinearGradient(x - 120, 0, x + 120, 0);
              g.addColorStop(0, "rgba(255,255,255,0)");
              g.addColorStop(0.5, "rgba(255,255,255,.75)");
              g.addColorStop(1, "rgba(255,255,255,0)");
              t.fillStyle = g;
              t.setTransform(1, 0, -0.35, 1, 0, 0);
              t.fillRect(x - 120, 0, 240 + H, H);
              t.setTransform(1, 0, 0, 1, 0, 0);
            },
            "screen",
            Math.sin(sh * Math.PI),
          );
        }
        if (shov > 0.01 && pw > 0.05) {
          const x = Math.min(edge, X0 + (X1 - X0) * smx);
          maskedBand(
            (t) => {
              const g = t.createRadialGradient(x, H * 0.36, 0, x, H * 0.36, 260);
              g.addColorStop(0, "rgba(255,255,255,.55)");
              g.addColorStop(1, "rgba(255,255,255,0)");
              t.fillStyle = g;
              t.fillRect(0, 0, edge, H);
            },
            "screen",
            shov * 0.8,
          );
        }
      }
      // van steps back to make room
      vanbox.style.transform = `translate(${lerp(0, -9, gather) + (smx - 0.5) * -1.5}%,${lerp(0, 14, gather)}%) scale(${lerp(1, 0.72, gather)})`;
      prop(pSign, (p - 0.68) / 0.08, [0, -12, 0.94]);
      {
        const t = clamp((p - 0.74) / 0.07);
        const seq = [0, 1, 0, 0, 0.7, 0, 1, 1];
        const k = Math.min(seq.length - 1, Math.floor(t * seq.length));
        const lit = t >= 1 ? 1 : seq[k];
        pSign.style.setProperty("--lit", String(reduce ? 1 : lit));
      }
      prop(pRoll, (p - 0.72) / 0.12, [40, 0, 0.92]);
      prop(pCards, (p - 0.78) / 0.12, [-10, 40, 0.9]);
      gloss.style.backgroundPosition = `${lerp(100, -50, clamp((p - 0.88) / 0.1))}% 0`;
      cap.style.opacity = String(ease(clamp((p - 0.92) / 0.06)));
      fill.style.width = (pr * 100).toFixed(2) + "%";
      pct.textContent = Math.round(pr * 100) + " %";
      trk.style.setProperty("--idle", pr > 0.03 ? "0" : "1");
      const done = pr > 0.99;
      lbl.textContent = done ? "Valmis" : "Vieritä";
      mouse.style.opacity = done ? "0" : "1";
      raf = requestAnimationFrame(frame);
    };
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mx = clamp((((e.clientX - r.left) / r.width) * W - X0) / (X1 - X0));
      hover = 1;
    };
    const onLeave = () => {
      hover = 0;
    };
    if (!reduce) {
      cv.addEventListener("pointermove", onMove);
      cv.addEventListener("pointerleave", onLeave);
    }
    frame();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      cv.removeEventListener("pointermove", onMove);
      cv.removeEventListener("pointerleave", onLeave);
      sws.forEach((b, i) => b.removeEventListener("click", swHandlers[i]));
      photo.onload = null;
      maskImg.onload = null;
    };
  }, []);

  const rootStyle = {
    "--font": `${interTight.style.fontFamily},ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif`,
    "--wordmark": `${jost.style.fontFamily},"Futura","Avenir Next",ui-sans-serif,sans-serif`,
  } as CSSProperties;
  const word = `${jost.style.fontFamily},Jost,Futura,'Avenir Next',sans-serif`;
  const font = `${interTight.style.fontFamily},system-ui,sans-serif`;

  return (
    <div className={s.root} ref={root} style={rootStyle}>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="th-mark" viewBox="0 0 714 341">
          <g fill="currentColor">
            <polygon points="0,0 196,339 235,265 82,0" />
            <polygon points="158,0 355,339 394,266 240,0" />
            <polygon points="320,0 414,163 537,164 517,199 435,199 516,341 652,107 464,107 437,61 679,60 714,1" />
          </g>
        </symbol>
        {/* overflow visible: raitojen polygonit jatkuvat viewBoxin yli
            (x 433). Symboli rajaa oletuksena omaan ruutuunsa, ja taustan
            vasen raitakerros katkesi siksi pystysuoraan auton vasemmalla
            puolella. Kortit ja roll-up rajaavat raidat omilla reunoillaan. */}
        <symbol id="th-bars" viewBox="0 0 300 400" overflow="visible">
          <g fill="currentColor">
            <polygon points="0,0 70,0 301,400 231,400" />
            <polygon points="100,0 146,0 377,400 331,400" />
            <polygon points="176,0 202,0 433,400 407,400" />
          </g>
        </symbol>
        <defs>
          <linearGradient id="th-foil" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fffaf0" />
            <stop offset=".35" style={{ stopColor: "var(--logo)" }} />
            <stop offset=".55" stopColor="#9c907c" />
            <stop offset=".7" style={{ stopColor: "var(--logo)" }} />
            <stop offset="1" stopColor="#fffaf0" />
          </linearGradient>
        </defs>
        <symbol id="th-logo" viewBox="0 0 714 470">
          <use href="#th-mark" width="714" height="341" />
          <text
            x="357"
            y="466"
            textAnchor="middle"
            fontFamily={word}
            fontSize="128"
            fontWeight="400"
            letterSpacing="74"
            fill="currentColor"
            textLength="700"
            lengthAdjust="spacing"
          >
            MEDIA
          </text>
        </symbol>
      </svg>

      <section className={s.scrub}>
        <div className={s.meter} data-th="scrub" aria-hidden="true" />
        <div className={s.pin}>
          <div className={s.tear} aria-hidden="true">
            <div className={s.studio} data-th="studio">
              <svg className={`${s.slashes} ${s.s2}`} data-th="sl2" viewBox="0 0 300 400">
                <use href="#th-bars" />
              </svg>
              <svg className={s.slashes} data-th="sl1" viewBox="0 0 300 400">
                <use href="#th-bars" />
              </svg>
            </div>
          </div>
          <div className={s.copy}>
            <div className={s.eyebrow}>Graafinen suunnittelu · Espoo</div>
            <h1 id="paasisalto" tabIndex={-1}>
              Graafinen suunnittelu yritykselle, <em>logosta auton kylkeen.</em>
            </h1>
            <p className={s.lead}>
              Suunnittelemme logon, värit ja graafisen ohjeiston ja viemme ilmeen käyntikortteihin,
              roll-upeihin, ikkunoihin ja pakettiauton kylkeen. Painotaloa tai teippaajaa ei tarvitse
              etsiä itse: saat yhden tarjouksen, yhden yhteyshenkilön ja yhden laskun.
            </p>
            <div className={s.ctas}>
              <a className={s.btn} href="#tarjous">
                Pyydä tarjous
              </a>
              <a className={s.link} href="#hinta">
                Laske arvio hinnasta ›
              </a>
            </div>
          </div>

          <div className={s.stagewrap} data-th="track">
            <div className={s.stage}>
              <div className={s.ilme} role="group" aria-label="Valitse ilmeen värit" style={{ position: "relative" }}>
                ILME
                {SWATCHES.map((w, i) => (
                  <button
                    key={w.w}
                    type="button"
                    className={s.sw}
                    data-th="sw"
                    style={{ background: w.w, "--a": w.sa ?? w.a } as CSSProperties}
                    data-w={w.w}
                    data-a={w.a}
                    data-l={w.l}
                    aria-pressed={i === 0}
                    aria-label={w.label}
                  />
                ))}
                <small>kokeile</small>
              </div>

              <div className={s.scene}>
                <div className={`${s.prop} ${s.sign}`} data-th="sign">
                  <div className={s.spill} />
                  <svg viewBox="-40 -40 794 560" aria-hidden="true">
                    <defs>
                      <filter id="th-halo" x="-40%" y="-60%" width="180%" height="220%">
                        <feGaussianBlur stdDeviation="30" />
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="2.2" />
                        </feComponentTransfer>
                      </filter>
                      <filter id="th-halo2" x="-20%" y="-30%" width="140%" height="160%">
                        <feGaussianBlur stdDeviation="9" />
                        <feComponentTransfer>
                          <feFuncA type="linear" slope="1.8" />
                        </feComponentTransfer>
                      </filter>
                      <filter id="th-bloom" x="-10%" y="-10%" width="120%" height="120%">
                        <feGaussianBlur stdDeviation="4" result="b" />
                        <feMerge>
                          <feMergeNode in="b" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <g className={s.lit}>
                      <use href="#th-logo" width="714" height="470" style={{ color: "var(--acc)" }} opacity=".95" filter="url(#th-halo)" />
                      <use href="#th-logo" width="714" height="470" style={{ color: "var(--acc)" }} opacity=".8" filter="url(#th-halo2)" />
                    </g>
                    <g>
                      {Array.from({ length: 12 }, (_, j) => 12 - j).map((i) => (
                        <use
                          key={i}
                          href="#th-logo"
                          width="714"
                          height="470"
                          transform={`translate(${i * 1.4},${i * 1.6})`}
                          style={{ color: i > 1 ? "#05080f" : "#000" }}
                          opacity={i === 12 ? 0.6 : 0.9}
                        />
                      ))}
                    </g>
                    <use href="#th-logo" width="714" height="470" style={{ color: "#2a2f3a" }} />
                    <g className={s.lit}>
                      <use href="#th-logo" width="714" height="470" style={{ color: "var(--logo)" }} filter="url(#th-bloom)" />
                      <use href="#th-logo" width="714" height="470" style={{ color: "#fff" }} opacity=".55" filter="url(#th-bloom)" />
                    </g>
                  </svg>
                  <div className={s.tag}>
                    <i />
                    <b>Valomainos</b>
                  </div>
                </div>

                <div className={s.vanbox} data-th="vanbox">
                  <canvas
                    className={s.van}
                    data-th="van"
                    width={1344}
                    height={752}
                    aria-label="Pakettiauto, joka teipataan WS Median ilmeeseen vierittäessä"
                  />
                </div>

                <div className={`${s.prop} ${s.rollup}`} data-th="roll">
                  <svg viewBox="0 0 200 480" aria-hidden="true">
                    <defs>
                      <linearGradient id="th-alu" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#f4f6f9" />
                        <stop offset=".35" stopColor="#c3cad4" />
                        <stop offset=".7" stopColor="#7d8694" />
                        <stop offset="1" stopColor="#4a515d" />
                      </linearGradient>
                      <linearGradient id="th-bshade" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="#fff" stopOpacity=".16" />
                        <stop offset=".25" stopColor="#fff" stopOpacity="0" />
                        <stop offset=".8" stopColor="#000" stopOpacity=".1" />
                        <stop offset="1" stopColor="#000" stopOpacity=".3" />
                      </linearGradient>
                      <linearGradient id="th-bsheen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#000" stopOpacity=".25" />
                        <stop offset=".06" stopColor="#000" stopOpacity="0" />
                        <stop offset=".94" stopColor="#000" stopOpacity="0" />
                        <stop offset="1" stopColor="#000" stopOpacity=".3" />
                      </linearGradient>
                      {/* Aidompi runko: kasetin pyorea etuprofiili, tummat
                          paatykappaleet, kasettirako, kaantyvat jalat ja
                          ylalistan kiinnike. */}
                      <linearGradient id="th-kasetti" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#eef1f5" />
                        <stop offset=".16" stopColor="#c4cbd4" />
                        <stop offset=".46" stopColor="#959daa" />
                        <stop offset=".78" stopColor="#5d6470" />
                        <stop offset="1" stopColor="#353a42" />
                      </linearGradient>
                      <linearGradient id="th-paaty" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="#1c2026" />
                        <stop offset=".45" stopColor="#4a515c" />
                        <stop offset="1" stopColor="#23272e" />
                      </linearGradient>
                      <linearGradient id="th-lista" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#fbfcfd" />
                        <stop offset=".42" stopColor="#cdd3db" />
                        <stop offset=".58" stopColor="#8d95a1" />
                        <stop offset="1" stopColor="#636b78" />
                      </linearGradient>
                      <linearGradient id="th-varjo-ylos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#000" stopOpacity=".38" />
                        <stop offset="1" stopColor="#000" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="th-varjo-alas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#000" stopOpacity="0" />
                        <stop offset="1" stopColor="#000" stopOpacity=".5" />
                      </linearGradient>
                      <radialGradient id="th-flo">
                        <stop offset="0" stopColor="#000" stopOpacity=".7" />
                        <stop offset="1" stopColor="#000" stopOpacity="0" />
                      </radialGradient>
                      <clipPath id="th-bclip">
                        <rect x="14" y="14" width="172" height="410" />
                      </clipPath>
                    </defs>
                    <ellipse cx="102" cy="468" rx="112" ry="10" fill="url(#th-flo)" />
                    {/* kaantyvat jalat kasetin alla */}
                    <path d="M18 452h30l-3 12a3 3 0 0 1-3 2.4H16.5a2.5 2.5 0 0 1-2.4-3.1z" fill="#24282f" />
                    <path d="M182 452h-30l3 12a3 3 0 0 0 3 2.4h15.5a2.5 2.5 0 0 0 2.4-3.1z" fill="#24282f" />
                    <rect x="17" y="463.5" width="25" height="2" rx="1" fill="#0d0f12" />
                    <rect x="158" y="463.5" width="25" height="2" rx="1" fill="#0d0f12" />
                    <g clipPath="url(#th-bclip)">
                      <rect x="14" y="14" width="172" height="410" style={{ fill: "var(--wrap)", transition: "fill .5s" }} />
                      <use href="#th-bars" x="64" y="300" width="170" height="226" style={{ color: "var(--acc)", transition: "color .5s" }} />
                      <use href="#th-logo" x="30" y="44" width="140" height="92" style={{ color: "var(--logo)", transition: "color .5s" }} />
                      <rect x="30" y="160" width="26" height="3" style={{ fill: "var(--acc)", transition: "fill .5s" }} />
                      <g fontFamily={font} fontWeight="800">
                        <text x="30" y="192" fontSize="17.5" style={{ fill: "var(--logo)", transition: "fill .5s" }}>
                          TEHDÄÄN
                        </text>
                        <text x="30" y="213" fontSize="17.5" style={{ fill: "var(--logo)", transition: "fill .5s" }}>
                          YRITYKSESTÄSI
                        </text>
                        <text x="30" y="234" fontSize="17.5" style={{ fill: "var(--acc)", transition: "fill .5s" }}>
                          NÄKYVÄ.
                        </text>
                        <text x="30" y="262" fontSize="7.4" fontWeight="600" letterSpacing=".6" style={{ fill: "var(--logo)", transition: "fill .5s" }} opacity=".8">
                          VIDEOT · VERKKOSIVUT · GRAAFINEN
                        </text>
                        <text x="30" y="273" fontSize="7.4" fontWeight="600" letterSpacing=".6" style={{ fill: "var(--logo)", transition: "fill .5s" }} opacity=".8">
                          SUUNNITTELU · ESPOO
                        </text>
                        <rect x="30" y="384" width="74" height="22" rx="11" style={{ fill: "var(--logo)", transition: "fill .5s" }} />
                        <text x="67" y="399" fontSize="10" textAnchor="middle" style={{ fill: "var(--wrap)", transition: "fill .5s" }}>
                          wsmedia.fi
                        </text>
                      </g>
                      <rect x="14" y="14" width="172" height="410" fill="url(#th-bshade)" />
                      <rect x="14" y="14" width="172" height="410" fill="url(#th-bsheen)" />
                      {/* ylalistan varjo ja kasettiin painuva alareuna */}
                      <rect x="14" y="17" width="172" height="9" fill="url(#th-varjo-ylos)" />
                      <rect x="14" y="398" width="172" height="26" fill="url(#th-varjo-alas)" />
                    </g>
                    {/* ylalista: alumiiniprofiili, paatytulpat ja keskella
                        tangon kiinnike */}
                    <rect x="11" y="8" width="178" height="10" rx="2.5" fill="url(#th-lista)" />
                    <rect x="11" y="16.6" width="178" height="1.4" fill="#000" opacity=".25" />
                    <rect x="8" y="7" width="7" height="12" rx="2.2" fill="url(#th-paaty)" />
                    <rect x="185" y="7" width="7" height="12" rx="2.2" fill="url(#th-paaty)" />
                    <rect x="94" y="4.5" width="12" height="5" rx="1.5" fill="#3a4048" />
                    {/* kasettirako, josta banneri nousee */}
                    <rect x="15" y="416.5" width="170" height="4.5" rx="2.2" fill="#121418" />
                    {/* kasetti: pyorea etuprofiili, valoviiva, sauma ja
                        tummat paatykappaleet */}
                    <path d="M6 428a8 8 0 0 1 8-8h172a8 8 0 0 1 8 8v16a10 10 0 0 1-10 10H16a10 10 0 0 1-10-10z" fill="url(#th-kasetti)" />
                    <rect x="16" y="423" width="168" height="2" rx="1" fill="#fff" opacity=".8" />
                    <rect x="16" y="441.5" width="168" height="1" fill="#000" opacity=".22" />
                    <rect x="16" y="447" width="168" height="1.2" rx=".6" fill="#fff" opacity=".18" />
                    <path d="M6 428a8 8 0 0 1 8-8h6v34h-4a10 10 0 0 1-10-10z" fill="url(#th-paaty)" />
                    <path d="M194 428a8 8 0 0 0-8-8h-6v34h4a10 10 0 0 0 10-10z" fill="url(#th-paaty)" />
                    <rect x="9" y="424" width="1.2" height="24" rx=".6" fill="#fff" opacity=".22" />
                    <rect x="189.8" y="424" width="1.2" height="24" rx=".6" fill="#fff" opacity=".12" />
                  </svg>
                  <div className={s.tag}>
                    <i />
                    <b>Roll-up</b>
                  </div>
                </div>

                <div className={`${s.prop} ${s.cards}`} data-th="cards">
                  <div className={s.plane}>
                    <div className={`${s.bcard} ${s.back}`}>
                      <div className={s.face}>
                        <div className={s.bcBack}>
                          <b>WS MEDIA</b>
                          <span>
                            <strong>Videot · Verkkosivut · Graafinen suunnittelu</strong>
                            <br />
                            Espoo
                            <br />
                            wsmedia.fi
                          </span>
                        </div>
                        <svg className={s.bcBm} viewBox="0 0 714 341">
                          <use href="#th-mark" />
                        </svg>
                        <div className={s.grain} />
                      </div>
                    </div>
                    <div className={`${s.bcard} ${s.mid}`}>
                      <div className={s.face}>
                        <svg className={s.bcBig} viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">
                          <use href="#th-bars" />
                        </svg>
                        <svg className={s.bcSmall} viewBox="0 0 714 341">
                          <use href="#th-mark" />
                        </svg>
                        <div className={s.grain} />
                      </div>
                    </div>
                    <div className={`${s.bcard} ${s.front}`}>
                      <div className={s.face}>
                        <svg className={s.bcBars} viewBox="0 0 300 400" preserveAspectRatio="none">
                          <use href="#th-bars" />
                        </svg>
                        <svg className={s.bcMark} viewBox="0 0 714 470">
                          <use href="#th-logo" width="714" height="470" fill="url(#th-foil)" style={{ color: "url(#th-foil)" }} />
                        </svg>
                        <span className={s.bcSlog}>Tehdään yrityksestäsi näkyvä.</span>
                        <div className={s.grain} />
                        <div className={s.bcGloss} data-th="gloss" />
                      </div>
                    </div>
                  </div>
                  <div className={s.tag}>
                    <i />
                    <b>Käyntikortit</b>
                  </div>
                </div>
              </div>

              <div className={s.scrollbar} aria-hidden="true" style={{ position: "relative" }}>
                <span className={s.mouse} data-th="mouse">
                  <i />
                </span>
                <span className={s.lbl} data-th="lbl">
                  Vieritä
                </span>
                <div className={s.track} data-th="trk">
                  <div className={s.fill} data-th="fill" />
                </div>
                <span className={s.pct} data-th="pct">
                  0 %
                </span>
              </div>
              <p className={s.cap} data-th="cap" style={{ position: "relative" }}>
                Sama logo, samat värit ja sama fontti, oli pinta mikä tahansa.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
