"use client";

import { useEffect, useRef } from "react";

/**
 * KOKEILU v2: kaksi tikku-ukkoa kantavat logon ja valikkopainikkeen pois ja
 * takaisin. POISTO YHDELLA RIVILLA: <NavCarriers /> pois FullscreenNavista.
 *
 * ---------------------------------------------------------------------
 * KOKO SEKVENSSI ON PUHDAS FUNKTIO SCROLL-POSITIOSTA. Ei tilakonetta, ei
 * setTimeoutia, ei "kesken olevaa" sekvenssia jota pitaisi perua. Sama
 * periaate kuin sivuston muilla scroll-efekteilla (hero-scrim,
 * --mb-gy, coverien scrim): arvo johdetaan joka framessa geometriasta.
 *
 *   ph = clamp((navH + 120 + RUN - strip.top)    / RUN, 0, 1)   piilotus
 *   ps = clamp((24 - strip.bottom)               / RUN, 0, 1)   paluu
 *   u  = clamp(ph - ps, 0, 1)      0 = kotona, 1 = kannettu pois
 *
 * Bufferit 120 / 24 ovat TASAN samat kuin nav-hide-logiikalla, ja mitta
 * tulee samasta .logostrip-rectista - vain jatkuvana arvona pisteen sijaan.
 *
 * Kolme seurausta:
 *  - Nopea scroll = nopea liike automaattisesti. Askelvaihe johdetaan
 *    KULJETUSTA MATKASTA (gait = matka / 2*STEP), ei kellosta, joten
 *    jalkojen kiinnitys maahan patee millä tahansa nopeudella.
 *  - Suunnanvaihto ei voi sekoittaa mitaan: kaikki on funktio u:sta, ja
 *    u vain kulkee takaisin samaa rataa.
 *  - Elementit eivat tarvitse opacity-piilotusta lainkaan. Ne ovat
 *    kasien mukana; kun hahmo on poissa ruudulta, elementti on myos.
 *    Siksi "ilmestyy takaisin ja jaa jumiin" -tila ei ole enaa olemassa.
 *
 * Paluumatka on lahdon tarkka peilikuva: hahmo palaa samalta reunalta
 * jolta se lahti, kantaen, asettaa elementin ja poistuu samaa reittia.
 * Se on suora seuraus siita etta liike on yksi funktio - ja lukeutuu
 * luontevasti, kuten samasta ovesta palaava ihminen.
 * ---------------------------------------------------------------------
 */

type Vec = { x: number; y: number };

/** Kaksiluinen kaanteiskinematiikka: palauttaa nivelen sijainnin. */
function ik(root: Vec, target: Vec, a: number, b: number, flip: number): Vec {
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(a - b) + 0.01), a + b - 0.01);
  const base = Math.atan2(dy, dx);
  const cos = Math.min(Math.max((a * a + d * d - b * b) / (2 * a * d), -1), 1);
  const ang = base + flip * Math.acos(cos);
  return { x: root.x + Math.cos(ang) * a, y: root.y + Math.sin(ang) * a };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const rot = (p: Vec, o: Vec, a: number): Vec => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const dx = p.x - o.x;
  const dy = p.y - o.y;
  return { x: o.x + dx * c - dy * s, y: o.y + dx * s + dy * c };
};

const L = { thigh: 18, shin: 18, torso: 22, neck: 6, head: 5.5, upperArm: 15, foreArm: 15 };
const STEP = 42;      // askelpituus px; gait johdetaan matkasta, ei ajasta
const LIFT = 9;
const BOB = 3.5;
const RUN = 380;      // scroll-matka jolla koko sekvenssi tapahtuu
const HIDE_BUF = 120; // sama kuin NAV_HIDE_BUFFER_IN
const SHOW_BUF = 24;  // sama kuin NAV_SHOW_BUFFER_OUT
const A = 0.4;        // u: kavely sisaan paattyy
const B = 0.55;       // u: tartunta paattyy, kanto alkaa
const LEAN_MAX = 0.28; // rad, n. 16 astetta
/* Liikehaivytys. Nopeus tulee samasta rAF-silmukasta ja samasta
   .logostrip-rectista kuin hahmojen sijainti - ei erillista mekanismia.
   K on mitoitettu niin etta reipas veto (n. 2000 px/s) osuu kattoon ja
   tavallinen selailu (n. 400 px/s) jaa 0,6px:aan eli tuskin nakyvaksi. */
const BLUR_K = 0.0015;
const BLUR_MAX = 3;
const BLUR_DECAY = 0.75; // per frame; palautuu teravaksi n. 8 framessa

export default function NavCarriers() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("#nav");
    const svg = svgRef.current;
    if (!nav || !svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 860px)").matches) return;

    const logo = nav.querySelector<HTMLElement>(".logo");
    const toggle = nav.querySelector<HTMLElement>(".navtoggle");
    const strip = document.querySelector<HTMLElement>(".logostrip");
    if (!logo || !toggle || !strip) return;

    nav.classList.add("carriers-on");

    const P = (n: string) => svg.querySelector<SVGElement>(`[data-p="${n}"]`);
    type Actor = { el: HTMLElement; home: Vec; edge: number; sign: number; face: number; prevX: number; prevDist: number | null; gaitAcc: number };
    const actors: Actor[] = [];
    let ground = 0;

    const measure = () => {
      const lr = logo.getBoundingClientRect();
      const tr = toggle.getBoundingClientRect();
      ground = Math.max(lr.bottom, tr.bottom);
      const conf: [HTMLElement, DOMRect, number][] = [
        [logo, lr, -1],
        [toggle, tr, 1],
      ];
      conf.forEach(([el, r, sign], i) => {
        // Elementin KOTI luetaan ilman voimassa olevaa transformia.
        const prev = el.style.transform;
        el.style.transform = "";
        const h = el.getBoundingClientRect();
        el.style.transform = prev;
        const home = { x: h.left + h.width / 2, y: h.top + h.height / 2 };
        const edge = sign < 0 ? -90 : window.innerWidth + 90;
        if (actors[i]) Object.assign(actors[i], { home, edge });
        else actors.push({ el, home, edge, sign, face: -sign, prevX: edge, prevDist: null, gaitAcc: 0 });
      });
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });

    let raf = 0;
    let prevTop: number | null = null;
    let prevT = 0;
    let blur = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const r = strip.getBoundingClientRect();

      // Scroll-nopeus rectin muutoksesta: nauha liikkuu sivun mukana, joten
      // |dTop|/dt ON scroll-nopeus. Ei omaa scroll-kuuntelijaa.
      const dt = prevT ? Math.min((now - prevT) / 1000, 0.05) : 0;
      const vScroll = prevTop !== null && dt > 0 ? Math.abs(r.top - prevTop) / dt : 0;
      prevTop = r.top;
      prevT = now;
      // Nousee heti, laskee vaimennetusti - blur ei jaa roikkumaan kun
      // scroll pysahtyy, mutta ei myoskaan valky yksittaisista frameista.
      blur = Math.max(Math.min(vScroll * BLUR_K, BLUR_MAX), blur * BLUR_DECAY);
      const blurPx = blur < 0.05 ? 0 : blur;
      const navH = nav.getBoundingClientRect().height;
      const ph = clamp((navH + HIDE_BUF + RUN - r.top) / RUN, 0, 1);
      const ps = clamp((SHOW_BUF - r.bottom) / RUN, 0, 1);
      const u = clamp(ph - ps, 0, 1);

      for (let i = 0; i < actors.length; i++) {
        const a = actors[i];
        const grp = P(`c${i}`);
        // Hahmo on nakyvissa vain kun jotain tapahtuu.
        const visible = u > 0.001 && u < 0.999;
        if (grp) {
          grp.style.opacity = visible ? "1" : "0";
          grp.style.filter = blurPx ? `blur(${blurPx.toFixed(2)}px)` : "";
        }

        // --- polku: reuna -> pysahdys -> reuna, x puhtaana funktiona u:sta.
        // Pysahdys on 26px elementista SILLE PUOLELLE josta hahmo tulee,
        // jolloin kadet yltavat sen keskelle ilman etta vartalo peittaa sita.
        const stopX = a.home.x + a.sign * 26;
        const D1 = Math.abs(stopX - a.edge);
        const D3 = D1;
        let x: number;
        let dist: number;
        if (u < A) {
          const t = u / A;
          x = a.edge + (stopX - a.edge) * t;
          dist = D1 * t;
        } else if (u < B) {
          x = stopX;
          dist = D1;
        } else {
          const t = (u - B) / (1 - B);
          x = stopX + (a.edge - stopX) * t;
          dist = D1 + D3 * t;
        }
        // Askelvaihe KULJETUSTA MATKASTA, ei ajasta - ja nimenomaan matkan
        // ITSEISARVOISESTA muutoksesta, ei dist-arvosta suoraan.
        //
        // Aiemmin tassa oli gait = dist / (2*STEP). dist on funktio u:sta,
        // joten kun u laskee (paluumatka), askelkello pyori TAAKSEPAIN ja
        // heilahtava jalka kaarsi edesta taakse - moonwalk. Tukijalka pysyi
        // silti maassa (lantio -face*STEP, jalka suht. +face*STEP, summa 0),
        // minka takia vika nakyi vain heilahdusjalassa eika koko hahmo
        // luistanut. Se selittaa myos miksi kuvio toistui identtisena
        // molempiin scrollisuuntiin: vaiheet 1-2 ovat aina u:n NOUSUA ja
        // vaiheet 3-4 aina u:n LASKUA, riippumatta siita kumpaan suuntaan
        // kayttaja skrollaa.
        //
        // Kertyma on pelkka esitystiedon apumuuttuja: sijainti ja kanto ovat
        // yha puhtaita funktioita u:sta, joten tama ei palauta sita
        // tilaluokkaa jonka v2 poisti.
        if (a.prevDist === null) a.prevDist = dist;
        a.gaitAcc += Math.abs(dist - a.prevDist);
        a.prevDist = dist;
        const gait = ((a.gaitAcc / (2 * STEP)) % 1 + 1) % 1;
        // Nopeus suoraan x:n muutoksesta - ei johdettuja etumerkkeja.
        const vx = x - a.prevX;
        a.prevX = x;
        if (Math.abs(vx) > 0.4) a.face = Math.sign(vx);
        // Kallistus on suoraan nopeuden funktio: ei tilaa, kaantyy itsestaan.
        const lean = clamp(vx * 0.09, -LEAN_MAX, LEAN_MAX);

        const bob = -BOB * (0.5 - 0.5 * Math.cos(4 * Math.PI * gait));
        const hip: Vec = { x, y: ground - L.thigh - L.shin + bob };
        const shoulder = rot({ x: hip.x, y: hip.y - L.torso }, hip, lean);
        const headP = rot({ x: hip.x, y: hip.y - L.torso - L.neck - L.head }, hip, lean);

        const walking = u < A || u > B;
        const feet: Vec[] = [];
        for (let f = 0; f < 2; f++) {
          const p = (gait + f * 0.5) % 1;
          if (!walking) {
            feet.push({ x: hip.x + (f === 0 ? -6 : 7) * a.face, y: ground });
          } else if (p < 0.5) {
            feet.push({ x: hip.x + a.face * STEP * (0.5 - p / 0.5), y: ground });
          } else {
            const t = (p - 0.5) / 0.5;
            feet.push({ x: hip.x + a.face * STEP * (t - 0.5), y: ground - Math.sin(t * Math.PI) * LIFT });
          }
        }

        // Kantoote: nousee tartunnan aikana, pysyy sen jalkeen.
        const hold = clamp((u - A) / (B - A), 0, 1);
        const hands: Vec[] = [];
        for (let h = 0; h < 2; h++) {
          const swing = (gait + h * 0.5) % 1;
          const rest: Vec = {
            x: shoulder.x - a.face * Math.cos(swing * 2 * Math.PI) * 9,
            y: shoulder.y + L.upperArm + L.foreArm - 6,
          };
          const carry: Vec = { x: shoulder.x + a.face * 20, y: shoulder.y + 6 };
          hands.push({
            x: rest.x + (carry.x - rest.x) * hold,
            y: rest.y + (carry.y - rest.y) * hold,
          });
        }

        // --- kontaktivarjot ---
        // Ei omaa laskentaa: molemmat lukevat saman x:n ja saman gaitin
        // kuin hahmo ja kannettu elementti.
        //
        // "Hengitys" askeleen mukana: bob on 0 kun lantio on alimmillaan
        // (jalka kantaa) ja -BOB kun se on ylimmillaan (askeleen keskella).
        // Varjo on siis tiivein ja tummin kosketuksessa ja levein ja
        // haalein ilmassa - sama fysikaalinen suhde kuin oikealla varjolla.
        const lift = -bob / BOB;
        const sh = P(`c${i}sh`);
        if (sh) {
          sh.setAttribute("cx", hip.x.toFixed(1));
          sh.setAttribute("cy", (ground + 1).toFixed(1));
          sh.setAttribute("rx", (15 + 4 * lift).toFixed(1));
          sh.setAttribute("ry", (3.6 - 0.5 * lift).toFixed(1));
          sh.style.opacity = (1 - 0.3 * lift).toFixed(2);
        }

        const hd = P(`c${i}h`);
        if (hd) {
          hd.setAttribute("cx", headP.x.toFixed(1));
          hd.setAttribute("cy", headP.y.toFixed(1));
        }
        const sp = P(`c${i}s`);
        if (sp) sp.setAttribute("d", `M${hip.x.toFixed(1)} ${hip.y.toFixed(1)} L${shoulder.x.toFixed(1)} ${shoulder.y.toFixed(1)}`);
        for (let f = 0; f < 2; f++) {
          // flip on KAANTEINEN face:iin nahden: ruutukoordinaateissa (y alas)
          // flip=-1 vie nivelen +x-suuntaan. Kavellessa oikealle (face=+1)
          // polven on taivuttava ETEEN eli +x, joten flip = -face.
          const k = ik(hip, feet[f], L.thigh, L.shin, a.face > 0 ? -1 : 1);
          const s = P(`c${i}l${f}`);
          if (s) s.setAttribute("d", `M${hip.x.toFixed(1)} ${hip.y.toFixed(1)} L${k.x.toFixed(1)} ${k.y.toFixed(1)} L${feet[f].x.toFixed(1)} ${feet[f].y.toFixed(1)}`);
        }
        for (let h = 0; h < 2; h++) {
          // Kyynarpaa taipuu TAAKSE eli face:n vastasuuntaan.
          const e = ik(shoulder, hands[h], L.upperArm, L.foreArm, a.face > 0 ? 1 : -1);
          const s = P(`c${i}a${h}`);
          if (s) s.setAttribute("d", `M${shoulder.x.toFixed(1)} ${shoulder.y.toFixed(1)} L${e.x.toFixed(1)} ${e.y.toFixed(1)} L${hands[h].x.toFixed(1)} ${hands[h].y.toFixed(1)}`);
        }

        // Elementti kulkee kasien mukana. Puhdas funktio u:sta, joten se ei
        // voi jaada valitilaan kun scroll kaantyy.
        const hx = (hands[0].x + hands[1].x) / 2;
        const hy = (hands[0].y + hands[1].y) / 2;
        const dx = (hx - a.home.x) * hold;
        const dy = (hy - a.home.y) * hold;
        a.el.style.transform = hold > 0.001 ? `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)` : "";

        // Kannetun elementin oma varjo: seuraa samaa siirtymaa, haipyy
        // holdin mukana eli katoaa kun elementti on asetettu takaisin.
        const esh = P(`c${i}esh`);
        if (esh) {
          esh.setAttribute("cx", (a.home.x + dx).toFixed(1));
          esh.setAttribute("cy", (ground + 1).toFixed(1));
          esh.setAttribute("rx", "11");
          esh.setAttribute("ry", "2.8");
          esh.style.opacity = (hold * 0.85).toFixed(2);
        }
        // Sama haivytys kannettavaan elementtiin, mutta VAIN kun se on
        // kasissa - muuten logo sumenisi jokaisella nopealla scrollilla.
        a.el.style.filter = hold > 0.001 && blurPx ? `blur(${blurPx.toFixed(2)}px)` : "";
        // Tab-jarjestys: piiloon vasta kun elementti on oikeasti pois ruudulta.
        a.el.style.visibility = u > 0.985 ? "hidden" : "";
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      nav.classList.remove("carriers-on");
      for (const a of actors) {
        a.el.style.transform = "";
        a.el.style.visibility = "";
        a.el.style.filter = "";
      }
    };
  }, []);

  return (
    <svg className="carriers" ref={svgRef} aria-hidden="true">
      <defs>
        {/* Pehmea reuna gradientilla eika blur-suodattimella: halvempi
            rasteroida ja pysyy terävänä millä tahansa zoomilla.

            VALKOINEN, ei musta. #nav on mix-blend-mode: difference, jossa
            tulos on |tausta - lahde|: musta antaisi valkoisella taustalla
            255 eli olisi taysin nakymaton. Valkoinen alfalla .14 antaa
            219 (hienovarainen tummennus) ja tummalla osiolla 45 (vaalea
            laikku) - tasan sama kaytos kuin logolla ja hahmon viivalla. */}
        <radialGradient id="carrierShadow">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[0, 1].map((i) => (
        <g data-p={`c${i}`} key={i} opacity="0">
          {/* Varjot ensin, jotta ne jaavat hahmon alle. */}
          <ellipse data-p={`c${i}sh`} fill="url(#carrierShadow)" stroke="none" />
          <ellipse data-p={`c${i}esh`} fill="url(#carrierShadow)" stroke="none" />
          <circle data-p={`c${i}h`} r={L.head} />
          <path data-p={`c${i}s`} />
          <path data-p={`c${i}l0`} />
          <path data-p={`c${i}l1`} />
          <path data-p={`c${i}a0`} />
          <path data-p={`c${i}a1`} />
        </g>
      ))}
    </svg>
  );
}
