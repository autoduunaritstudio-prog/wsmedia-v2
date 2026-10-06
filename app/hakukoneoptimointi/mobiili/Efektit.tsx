"use client";

/* HAKUKONEOPTIMOINNIN PUHELINVERSION OMAT TEHOSTEET (suunnitelman
   renderVals: h, tulokset, kipinat, tyot, nk, tyoTabit, tasot, ke, ukk,
   laheta). Kirjoittaa suoraan DOMiin, ei renderoi mitaan eika kayta
   Reactin tilaa vierityksen aikana. Yhteiset asiat (palkki, valikko,
   ikkunat, paljastukset, parallaksi, verkko, kuvat) ovat Moottori.tsx:ssa. */

import { kytkeTarjous } from "@/app/components/mobiili/tarjous";
import { useEffect } from "react";
import { kuuntele, onMobiili, pyyda, rajaa, reduce, type Tila } from "@/app/components/mobiili/vieritys";
import { asetteleHero } from "@/app/components/mobiili/heroAsettelu";

const SC = 360;
const KA = 340;
/* Hakutulosrivin korkeus: 38 px, tiiviissa versiossa (svh < 730) 34 px. */
let RIVI = 38;
const OSUUS = [27, 15, 11, 8, 6];
const HAKU = "ilmalämpöpumppu asennus espoo";
const fi = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export default function Efektit() {
  useEffect(() => {
    if (!onMobiili()) return;
    const juuri = document.querySelector<HTMLElement>(".mo-s-seo");
    if (!juuri) return;
    const q = <T extends Element = HTMLElement>(s: string) => juuri.querySelector<T>(s);
    const qa = <T extends Element = HTMLElement>(s: string) => [...juuri.querySelectorAll<T>(s)];
    const siivous: Array<() => void> = [];
    const R = reduce();

    /* Kirjoitus vain kun arvo muuttuu (ei turhia tyylin uudelleenlaskuja). */
    const muisti = new WeakMap<Element, Record<string, string>>();
    const aseta = (el: Element | null, avain: string, arvo: string) => {
      if (!el) return;
      let m = muisti.get(el);
      if (!m) muisti.set(el, (m = {}));
      if (m[avain] === arvo) return;
      m[avain] = arvo;
      if (avain === "text") el.textContent = arvo;
      else if (avain.startsWith("@")) el.setAttribute(avain.slice(1), arvo);
      else if (avain.startsWith(".")) el.classList.toggle(avain.slice(1), arvo === "1");
      else (el as HTMLElement).style.setProperty(avain, arvo);
    };

    /* ---------- HERO: oma tulos nousee sijalta 5 ykköseksi (0..360),
       kansi nousee 340..340+HV ---------- */
    const hero = q("[data-seo=hero]");
    const maasto = q("[data-seo=maasto]");
    const hehku = q("[data-seo=hehku]");
    const kayraAla = q("[data-seo=kayraala]");
    const kayra = q("[data-seo=kayra]");
    const kortti = q("[data-seo=kortti]");
    const kallistus = q("[data-seo=kallistus]");
    const serpHehku = q("[data-seo=serphehku]");
    const sijaEl = q("[data-seo=sija]");
    const nousu = q("[data-seo=nousu]");
    const klikit = q("[data-seo=klikit]");
    const kk = q("[data-seo=kk]");
    const rivit = qa("[data-seo-rivi]");
    const oma = rivit[4] ?? null;
    const merkki = q("[data-seo=merkki]");
    const kipinat = qa("[data-seo-kipina]");
    const tyop = q("[data-seo=tyop]");
    const pillit = qa("[data-seo-pilli]");
    const vihje = q("[data-seo=vihje]");
    const rengas = q("[data-seo=rengas]");
    const lopuksi = q("[data-seo=lopuksi]");
    const teksti = q("[data-seo=teksti]");
    const peitto = q("[data-seo=peitto]");
    let alussa = true;
    /* Asettelu matalille naytoille (malli: seo-hero-malli.html). */
    const stickyHero = hero?.firstElementChild instanceof HTMLElement ? (hero.querySelector<HTMLElement>("[data-teema]") ?? null) : null;
    siivous.push(
      asetteleHero({
        hero: stickyHero,
        kuva: kortti,
        kuvaY: 72,
        teksti,
        muuttui: () => {
          RIVI = stickyHero?.classList.contains("mo-hero-tiivis") ? 34 : 38;
          alussa = true;
          pyyda();
        },
      }),
    );
    siivous.push(
      kuuntele({
        kirjoita: (t: Tila) => {
          const { y, HV } = t;
          const ohi = y > KA + 2 * HV + 200;
          /* will-change vain heron liikkeen ajaksi. */
          aseta(hero, ".mo-seo-liike", ohi ? "0" : "1");
          if (ohi && !alussa) return; // hero on jo kokonaan peitossa
          alussa = false;
          const pf = rajaa(y / SC);
          const e = pf < 0.5 ? 2 * pf * pf : 1 - Math.pow(-2 * pf + 2, 2) / 2;
          const kansi = rajaa((y - KA) / HV);
          const sijaF = 5 - 4 * e;
          const sija = Math.max(1, Math.round(sijaF));
          aseta(maasto, "transform", `translateY(${(-40 * pf - 30 * kansi).toFixed(1)}px) scale(${(1 + 0.08 * pf).toFixed(3)})`);
          aseta(hehku, "transform", `translateY(${(200 * (1 - e)).toFixed(1)}px)`);
          aseta(hehku, "opacity", ((0.08 + 0.18 * e) / 0.26).toFixed(3));
          aseta(kayraAla, "@opacity", (0.25 + 0.75 * e).toFixed(3));
          aseta(kayra, "@stroke-dashoffset", (520 * (1 - e)).toFixed(1));
          aseta(kortti, "transform", `translateY(${(-60 * kansi).toFixed(1)}px)`);
          aseta(kallistus, "transform", `rotateX(${(10 * (1 - e)).toFixed(2)}deg)`);
          aseta(serpHehku, "opacity", rajaa((pf - 0.8) / 0.2).toFixed(3));
          aseta(sijaEl, "text", `#${sija}`);
          aseta(sijaEl, "color", sija === 1 ? "#3ddc84" : "#f5f5f7");
          aseta(nousu, "text", `↑ ${5 - sija}`);
          aseta(nousu, "opacity", e > 0.12 ? "1" : "0");
          aseta(klikit, "text", `~${OSUUS[sija - 1]} %`);
          aseta(kk, "text", String(Math.max(1, Math.round(1 + 11 * e))));
          // SERP-rivit
          const pp = sijaF - 1;
          const op = (1 - 0.25 * e).toFixed(3);
          for (let i = 0; i < 4; i++) {
            const r = rivit[i];
            aseta(r, "transform", `translateY(${Math.round((i + rajaa(i + 1 - pp)) * RIVI)}px) scale(1)`);
            aseta(r, "opacity", op);
          }
          if (oma) {
            const liike = pf > 0.02 && pf < 0.98;
            const yksi = sija === 1;
            aseta(oma, "transform", `translateY(${Math.round((sijaF - 1) * RIVI)}px) scale(${liike ? 1.035 : 1})`);
            aseta(oma, "background", yksi ? "#e6fbf0" : "#e8f9fc");
            aseta(oma, "box-shadow", `${yksi ? "inset 0 0 0 1.5px #1e8e3e" : "inset 0 0 0 1.5px #0b8aa3"}, 0 ${liike ? 16 : 8}px 26px -10px rgba(11,138,163,.65)`);
            aseta(oma, ".mo-s-odota", pf < 0.01 ? "1" : "0");
            aseta(merkki, "background", yksi ? "#1e8e3e" : "#0b8aa3");
            aseta(merkki, "text", yksi ? "★ SIJA 1" : "SINÄ");
            kipinat.forEach((k) => aseta(k, ".mo-on", yksi ? "1" : "0"));
          }
          aseta(tyop, "transform", `scaleX(${(Math.round(100 * rajaa(pf / 0.87)) / 100).toFixed(2)})`);
          pillit.forEach((p, i) => {
            const on = pf >= (i + 1) / 4.6;
            aseta(p, "background", on ? "#123a2c" : "#101a28");
            aseta(p, "color", on ? "#7ff0b0" : "#8fa3b5");
            aseta(p, "box-shadow", on ? "inset 0 0 0 1px rgba(61,220,132,.45)" : "inset 0 0 0 1px rgba(255,255,255,.1)");
            aseta(p.querySelector("svg"), "opacity", on ? "1" : "0");
          });
          aseta(vihje, "opacity", (1 - rajaa((pf - 0.72) / 0.16)).toFixed(3));
          aseta(vihje, "transform", `translateX(-50%) translateY(${(6 * (1 - rajaa(y / 80))).toFixed(1)}px)`);
          aseta(rengas, "@stroke-dashoffset", (81.7 * (1 - pf)).toFixed(1));
          const lop = rajaa((pf - 0.9) / 0.1);
          aseta(lopuksi, "opacity", lop.toFixed(3));
          aseta(lopuksi, "transform", `translateY(${(8 * (1 - lop)).toFixed(1)}px)`);
          aseta(teksti, "transform", `translateY(${(-50 * kansi).toFixed(1)}px)`);
          aseta(peitto, "opacity", (0.6 * (1 - Math.pow(1 - kansi, 2))).toFixed(3));
        },
      }),
    );

    /* ---------- HAKUKENTAN KIRJOITUS (componentDidMount) ---------- */
    const haku = q("[data-seo=haku]");
    if (haku) {
      if (R) haku.textContent = HAKU;
      else {
        let kirj = 0;
        let ajastin = 0;
        const askel = () => {
          if (kirj >= HAKU.length) return;
          kirj += 1;
          haku.textContent = HAKU.slice(0, kirj);
          ajastin = window.setTimeout(askel, 40 + Math.random() * 40);
        };
        ajastin = window.setTimeout(askel, 600);
        siivous.push(() => window.clearTimeout(ajastin));
      }
    }

    /* ---------- VALILEHDET (nk, tyo, taso, ke) ---------- */
    const mitat = () => juuri.dispatchEvent(new Event("mo:mitat"));
    type Tyyli = (on: boolean, i: number) => Record<string, string>;
    const seg: Tyyli = (on) => ({ background: on ? "#6fecff" : "transparent", color: on ? "#0b0f14" : "#c9d6e2" });
    const ryhmat: Record<string, { paneeli: string; tyyli: Tyyli; nyt: number; vaihto?: (i: number) => void }> = {
      seoNk: { paneeli: "data-seo-nkp", tyyli: seg, nyt: 0 },
      seoTyo: {
        paneeli: "data-seo-tyop",
        nyt: 0,
        tyyli: (on) => ({
          background: on ? "rgba(111,236,255,.14)" : "rgba(255,255,255,.035)",
          color: on ? "#eafcff" : "#9fb0bf",
          "box-shadow": on ? "inset 0 0 0 1.5px #6fecff" : "inset 0 0 0 1px rgba(255,255,255,.08)",
        }),
      },
      seoTaso: { paneeli: "data-seo-tasop", tyyli: seg, nyt: 1, vaihto: (i) => animoiHinta(i) },
      seoKe: {
        paneeli: "data-seo-kep",
        nyt: 0,
        tyyli: (on, i) => ({ background: on ? (i === 0 ? "#6fecff" : "#ff9a4d") : "transparent", color: on ? "#0b0f14" : "#c9d6e2" }),
      },
    };
    const attr = (k: string) => "data-" + k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());

    /* Hinnan laskuri tasoa vaihdettaessa (animoiHinta, 700 ms). */
    let hintaRaf = 0;
    const animoiHinta = (i: number) => {
      const b = q(`[data-seo-tasop="${i}"] [data-seo-hinta]`);
      if (!b) return;
      const hinta = Number(b.dataset.seoHinta);
      cancelAnimationFrame(hintaRaf);
      if (R) {
        b.textContent = fi(hinta);
        return;
      }
      const alku = performance.now();
      const askel = (nyt: number) => {
        const p = Math.min(1, (nyt - alku) / 700);
        b.textContent = fi(Math.round((hinta * (1 - Math.pow(1 - p, 3))) / 10) * 10);
        if (p < 1) hintaRaf = requestAnimationFrame(askel);
      };
      b.textContent = "0";
      hintaRaf = requestAnimationFrame(askel);
    };
    siivous.push(() => cancelAnimationFrame(hintaRaf));

    let ukkAuki = 0;
    const klikki = (e: MouseEvent) => {
      const t = e.target as Element;
      for (const [k, g] of Object.entries(ryhmat)) {
        const n = t.closest<HTMLElement>(`[${attr(k)}]`);
        if (!n) continue;
        const i = Number(n.dataset[k]);
        if (i !== g.nyt) {
          g.nyt = i;
          qa(`[${attr(k)}]`).forEach((b) => {
            const j = Number(b.dataset[k]);
            const on = j === i;
            b.setAttribute("aria-selected", String(on));
            Object.entries(g.tyyli(on, j)).forEach(([p, v]) => b.style.setProperty(p, v));
          });
          qa(`[${g.paneeli}]`).forEach((p) => (p.hidden = Number(p.getAttribute(g.paneeli)) !== i));
          g.vaihto?.(i);
        }
        window.setTimeout(mitat, 60);
        return;
      }
      const u = t.closest<HTMLElement>("[data-ukk]");
      if (u) {
        const i = Number(u.dataset.ukk);
        ukkAuki = ukkAuki === i ? -1 : i;
        qa("[data-ukk]").forEach((b) => {
          const on = Number(b.dataset.ukk) === ukkAuki;
          b.classList.toggle("mo-auki", on);
          b.setAttribute("aria-expanded", String(on));
          const v = q(`[data-ukk-vast="${b.dataset.ukk}"]`);
          if (v) v.hidden = !on;
        });
        window.setTimeout(mitat, 60);
        return;
      }
      const kaikki = t.closest<HTMLElement>("[data-ukk-kaikki]");
      if (kaikki) {
        qa("[data-ukk-rivi]").forEach((r) => (r.hidden = false));
        kaikki.remove();
        window.setTimeout(mitat, 60);
      }
    };
    juuri.addEventListener("click", klikki);
    siivous.push(() => juuri.removeEventListener("click", klikki));

    /* ---------- TARJOUSPYYNTO (osion oma lomake) ---------- */
    const lomake = q<HTMLFormElement>("[data-seo=lomake]");
    /* /api/lomake kuten tyopoydan BudgetForm (tarjous.ts). */
    siivous.push(kytkeTarjous(lomake, q("[data-seo=kiitos]"), () => window.setTimeout(mitat, 60)));

    return () => siivous.forEach((f) => f());
  }, []);
  return null;
}
