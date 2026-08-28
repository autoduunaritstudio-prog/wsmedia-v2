"use client";

import { useEffect, useRef } from "react";

/**
 * KOKEILU: kaksi tikku-ukkoa jotka kantavat logon ja valikkopainikkeen pois
 * kun nav piiloutuu logonauhan kohdalla, ja tuovat ne takaisin.
 *
 * POISTO YHDELLA RIVILLA: poista <NavCarriers /> FullscreenNav.tsx:sta.
 *
 * ---------------------------------------------------------------------
 * MIKSI EI FYSIIKKAMOOTTORIA (Matter.js + PD-saadetyt nivelet)
 *
 * Kahden jalan kavelyn ohjaaminen pelkilla nivelmomenteilla on avoin
 * saatoteoreettinen ongelma - se on syy siihen etta pelit eivat tee
 * kavelya niin. Unreal ja Unity ajavat lokomotion animaatiosta tai
 * proseduraalisesti ja kayttavat fysiikkaa vasta toissijaisena kerroksena
 * (ragdoll, secondary motion). Ragdoll + PD-saadin kaatuisi tassa kahteen
 * asiaan: se romahtaa herkasti, ja saapuminen TASAN logon kohdalle olisi
 * epadeterministista - juuri se mita tassa eniten tarvitaan.
 *
 * Tama kayttaa siksi samaa tekniikkaa kuin pelit oikeasti kayttavat:
 *   - lantio liikkuu vakionopeudella ja pomppii askelrytmissa
 *   - jalkaterien kohteet KIINNITTYVAT maahan tukivaiheen ajaksi
 *     (foot planting) ja kaartavat eteen heilahdusvaiheessa
 *   - polvet ja kyynarpaat ratkaistaan KAANTEISKINEMATIIKALLA
 *   - kadet heiluvat vastavaiheessa jalkoihin
 *
 * Askelpituus johdetaan nopeudesta: stepLen = v * cycle / 2. Silloin
 * tukijalan maailmanopeus on tasan nolla eli jalka ei luista - se on se
 * yksityiskohta josta "painovoiman alainen" vaikutelma syntyy. Ja koska
 * lantion x on suoraan ohjattu, hahmo saapuu aina tasan kohteeseen.
 * ---------------------------------------------------------------------
 *
 * KYTKENTA: MutationObserver seuraa #navin .nav-away-luokkaa eli tasan sita
 * tilaa jonka nav-hide jo johtaa .logostripin rectista. Ei omaa
 * scroll-laskentaa. Sekvenssi on keskeytettava: jos tila vaihtuu kesken
 * kaiken, liike kaantyy nykyisesta asennosta eika hyppaa.
 */

type Vec = { x: number; y: number };

/** Kaksiluinen kaanteiskinematiikka: juuresta kohteeseen, palauttaa nivelen. */
function ik(root: Vec, target: Vec, a: number, b: number, flip: number): Vec {
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(a - b) + 0.01), a + b - 0.01);
  const base = Math.atan2(dy, dx);
  const cos = Math.min(Math.max((a * a + d * d - b * b) / (2 * a * d), -1), 1);
  const ang = base + flip * Math.acos(cos);
  return { x: root.x + Math.cos(ang) * a, y: root.y + Math.sin(ang) * a };
}

/** Mitat pikseleina. Kokonaiskorkeus n. 74px. */
const L = { thigh: 18, shin: 18, torso: 22, neck: 6, head: 5.5, upperArm: 15, foreArm: 15 };
const SPEED = 260;        // px/s
const CYCLE = 0.62;       // s, yksi kokonainen askelpari
const STEP = (SPEED * CYCLE) / 2;
const LIFT = 9;           // heilahdusvaiheen nostokorkeus
const BOB = 3.5;          // lantion pystypomppu

type Phase = "off" | "in" | "grab" | "out";

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
    if (!logo || !toggle) return;

    // Ottaa opacity-piilotuksen pois kaytosta: talta osin elementit pysyvat
    // taydessa opasiteetissa ja vain niiden SIJAINTI muuttuu.
    nav.classList.add("carriers-on");

    const parts = Array.from(svg.querySelectorAll<SVGElement>("[data-p]"));
    const get = (n: string) => parts.filter((p) => p.dataset.p === n);

    type Actor = {
      el: HTMLElement;
      home: Vec;      // elementin keskipiste levossa
      from: number;   // reunan x josta kavellaan sisaan
      dir: number;    // 1 = kavelee oikealle
      x: number;      // lantion x
      phase: Phase;
      t: number;      // vaiheen sisainen aika
      gait: number;   // askelkellon vaihe 0..1
      plant: [number, number];
    };

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
      conf.forEach(([el, r, side], i) => {
        const home = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        const from = side < 0 ? -80 : window.innerWidth + 80;
        if (actors[i]) {
          actors[i].home = home;
          actors[i].from = from;
        } else {
          actors.push({
            el, home, from,
            dir: -side, x: from, phase: "off", t: 0, gait: 0,
            plant: [from, from],
          });
        }
      });
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });

    // Kohde johon lantio pysahtyy: hieman elementin sivulla, jotta kadet
    // yltavat sen keskelle.
    const stopX = (a: Actor) => a.home.x - a.dir * 26;

    let running = false;
    let raf = 0;
    let last = 0;
    let away = nav.classList.contains("nav-away");

    const draw = () => {
      for (let i = 0; i < actors.length; i++) {
        const a = actors[i];
        const hidden = a.phase === "off";
        const grp = get(`c${i}`)[0];
        if (grp) grp.style.opacity = hidden ? "0" : "1";
        if (hidden) {
          a.el.style.transform = "";
          continue;
        }

        // --- lantio ---
        const bob = -BOB * (0.5 - 0.5 * Math.cos(4 * Math.PI * a.gait));
        const hip: Vec = { x: a.x, y: ground - L.thigh - L.shin + bob };
        const shoulder: Vec = { x: a.x + a.dir * 1.5, y: hip.y - L.torso };
        const head: Vec = { x: shoulder.x + a.dir * 2, y: shoulder.y - L.neck - L.head };

        // --- jalat: tukivaiheessa jalka pysyy maassa, heilahduksessa kaartaa ---
        const feet: Vec[] = [];
        for (let f = 0; f < 2; f++) {
          const p = (a.gait + f * 0.5) % 1;
          const moving = a.phase === "in" || a.phase === "out";
          if (!moving) {
            feet.push({ x: a.x + (f === 0 ? -6 : 7) * a.dir, y: ground });
          } else if (p < 0.5) {
            // tukivaihe: kohde liikkuu taaksepain lantioon nahden tasan
            // nopeudella v, joten maailmassa jalka seisoo paikallaan
            const u = p / 0.5;
            feet.push({ x: a.x + a.dir * STEP * (0.5 - u), y: ground });
          } else {
            const u = (p - 0.5) / 0.5;
            feet.push({
              x: a.x + a.dir * STEP * (-0.5 + u),
              y: ground - Math.sin(u * Math.PI) * LIFT,
            });
          }
        }

        // --- kadet: kavellessa vastavaiheessa, kantaessa eteen ---
        const hands: Vec[] = [];
        const carrying = a.phase === "out" || (a.phase === "grab" && a.t > 0.25);
        for (let h = 0; h < 2; h++) {
          if (carrying) {
            hands.push({ x: shoulder.x + a.dir * 20, y: shoulder.y + 6 });
          } else if (a.phase === "grab") {
            const u = Math.min(a.t / 0.25, 1);
            hands.push({
              x: shoulder.x + a.dir * (10 + 12 * u),
              y: shoulder.y + 14 - 8 * u,
            });
          } else {
            const p = (a.gait + h * 0.5) % 1;
            hands.push({
              x: shoulder.x - a.dir * Math.cos(p * 2 * Math.PI) * 9,
              y: shoulder.y + L.upperArm + L.foreArm - 6,
            });
          }
        }

        // --- ratkaise nivelet ja kirjoita geometria ---
        const [hd] = get(`c${i}h`);
        if (hd) {
          hd.setAttribute("cx", head.x.toFixed(1));
          hd.setAttribute("cy", head.y.toFixed(1));
        }
        const [sp] = get(`c${i}s`);
        if (sp) sp.setAttribute("d", `M${hip.x} ${hip.y} L${shoulder.x} ${shoulder.y}`);
        for (let f = 0; f < 2; f++) {
          const knee = ik(hip, feet[f], L.thigh, L.shin, a.dir > 0 ? 1 : -1);
          const [seg] = get(`c${i}l${f}`);
          if (seg) {
            seg.setAttribute(
              "d",
              `M${hip.x.toFixed(1)} ${hip.y.toFixed(1)} L${knee.x.toFixed(1)} ${knee.y.toFixed(1)} L${feet[f].x.toFixed(1)} ${feet[f].y.toFixed(1)}`,
            );
          }
        }
        for (let h = 0; h < 2; h++) {
          const elbow = ik(shoulder, hands[h], L.upperArm, L.foreArm, a.dir > 0 ? -1 : 1);
          const [seg] = get(`c${i}a${h}`);
          if (seg) {
            seg.setAttribute(
              "d",
              `M${shoulder.x.toFixed(1)} ${shoulder.y.toFixed(1)} L${elbow.x.toFixed(1)} ${elbow.y.toFixed(1)} L${hands[h].x.toFixed(1)} ${hands[h].y.toFixed(1)}`,
            );
          }
        }

        // --- kannettava elementti seuraa kasia ---
        if (carrying) {
          const hx = (hands[0].x + hands[1].x) / 2;
          const hy = (hands[0].y + hands[1].y) / 2;
          a.el.style.transform = `translate(${(hx - a.home.x).toFixed(1)}px, ${(hy - a.home.y).toFixed(1)}px)`;
        } else if (a.phase === "grab") {
          a.el.style.transform = "";
        }
      }
    };

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      let active = false;

      for (const a of actors) {
        const target = away ? stopX(a) : stopX(a);
        if (a.phase === "in") {
          active = true;
          a.gait = (a.gait + dt / CYCLE) % 1;
          const rem = (target - a.x) * a.dir;
          if (rem <= SPEED * dt) {
            a.x = target;
            a.phase = "grab";
            a.t = 0;
          } else {
            a.x += a.dir * SPEED * dt;
          }
        } else if (a.phase === "grab") {
          active = true;
          a.t += dt;
          if (a.t > 0.45) {
            a.phase = "out";
            a.t = 0;
            a.dir = -a.dir;
          }
        } else if (a.phase === "out") {
          active = true;
          a.gait = (a.gait + dt / CYCLE) % 1;
          a.x += a.dir * SPEED * dt;
          if (a.x < -110 || a.x > window.innerWidth + 110) {
            a.phase = "off";
            // Vietaessa elementti jaa piiloon, tuotaessa se palaa kotiin.
            a.el.style.transform = away ? "translate(0, -220px)" : "";
          }
        }
      }

      draw();
      if (active) {
        raf = requestAnimationFrame(step);
      } else {
        running = false;
      }
    };

    const start = () => {
      for (const a of actors) {
        a.x = a.from;
        a.dir = a.from < 0 ? 1 : -1;
        a.phase = "in";
        a.t = 0;
        a.el.style.transform = away ? "" : "translate(0, -220px)";
      }
      if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };

    const obs = new MutationObserver(() => {
      const next = nav.classList.contains("nav-away");
      if (next === away) return;
      away = next;
      start();
    });
    obs.observe(nav, { attributes: true, attributeFilter: ["class"] });

    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      nav.classList.remove("carriers-on");
      logo.style.transform = "";
      toggle.style.transform = "";
    };
  }, []);

  return (
    <svg className="carriers" ref={svgRef} aria-hidden="true">
      {[0, 1].map((i) => (
        <g data-p={`c${i}`} key={i} opacity="0">
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
