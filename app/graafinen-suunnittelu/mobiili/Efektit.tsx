"use client";

/* GRAAFISEN SUUNNITTELUN PUHELINVERSION OMAT TEHOSTEET (suunnitelman
   renderVals: h, vertailu, palvelut, hintalaskuri, kenelle, ukk, seo,
   laheta). Kirjoittaa suoraan DOMiin, ei renderoi mitaan. Yhteiset asiat
   (palkki, valikko, ikkunat, paljastukset, parallaksi, verkko, laiskat
   kuvat) ovat Moottori.tsx:ssa. */

import { kytkeTarjous } from "@/app/components/mobiili/tarjous";
import { useEffect } from "react";
import { kuuntele, onMobiili, rajaa, type Tila } from "@/app/components/mobiili/vieritys";
import { asetteleHero } from "@/app/components/mobiili/heroAsettelu";
import {
  AUTO_ALKU,
  KA,
  RUUDUT,
  SC,
  VALITUT_ALKU,
  autoTila,
  keTila,
  kohdeTila,
  laskeArvio,
  palTila,
  pisteTila,
  vertTab,
} from "./data";

const SARJA = "/mobiili/graafinen-teippaus-alfa.webp";

export default function GraafinenEfektit() {
  useEffect(() => {
    if (!onMobiili()) return;
    const juuri = document.querySelector<HTMLElement>(".mo-s-graafinen");
    if (!juuri) return;
    const q = <T extends Element = HTMLElement>(s: string) => juuri.querySelector<T>(s);
    const qa = <T extends Element = HTMLElement>(s: string) => [...juuri.querySelectorAll<T>(s)];
    const siivous: Array<() => void> = [];
    const mitat = () => juuri.dispatchEvent(new Event("mo:mitat"));
    const myohemmin = () => window.setTimeout(mitat, 60);

    /* ---------- HERO: auto teipataan 0..SC, kansi nousee KA..KA+HV ---------- */
    const lava = q("[data-g=lava]");
    const ruutu = q("[data-g=ruutu]");
    const vihje = q("[data-g=vihje]");
    const rengas = q<SVGCircleElement>("[data-g=rengas]");
    const lopuksi = q("[data-g=lopuksi]");
    const teksti = q("[data-g=teksti]");
    const peitto = q("[data-g=peitto]");
    let viime = "";
    /* Kuvitus alkaa ylapalkin alta ja pienenee tekstin ylapuolelle
       mahtuvaksi (heroAsettelu.ts). */
    siivous.push(asetteleHero({ hero: q("[data-g=hero]"), kuva: lava, kuvaY: 68, teksti }));
    siivous.push(
      kuuntele({
        kirjoita: (t: Tila) => {
          const { yp: y, HV } = t;
          if (y > KA + 2 * HV + 200 && viime) return; // hero on jo kokonaan peitossa
          const pf = rajaa(y / SC);
          const f = Math.round(pf * RUUDUT);
          const kansi = rajaa((y - KA) / HV);
          const avain = `${f}|${kansi.toFixed(4)}|${y < SC + 40 ? y : SC + 40}`;
          if (avain === viime) return;
          viime = avain;
          const e = pf * pf * (3 - 2 * pf);
          const lop = rajaa((pf - 0.86) / 0.12);
          if (ruutu) ruutu.style.backgroundPosition = `${((f % 8) / 7) * 100}% ${(Math.floor(f / 8) / 4) * 100}%`;
          if (lava) lava.style.transform = `translateY(${(-50 * kansi).toFixed(1)}px) scale(${(1 + 0.04 * e).toFixed(4)})`;
          if (vihje) {
            vihje.style.opacity = (1 - rajaa((pf - 0.7) / 0.16)).toFixed(3);
            vihje.style.transform = `translateX(-50%) translateY(${(6 * (1 - rajaa(y / 80))).toFixed(1)}px)`;
          }
          rengas?.setAttribute("stroke-dashoffset", (81.7 * (1 - pf)).toFixed(1));
          if (lopuksi) {
            lopuksi.style.opacity = lop.toFixed(3);
            lopuksi.style.transform = `translateY(${(8 * (1 - lop)).toFixed(1)}px)`;
          }
          if (teksti) teksti.style.transform = `translateY(${(-50 * kansi).toFixed(1)}px)`;
          if (peitto) peitto.style.opacity = (0.6 * (1 - Math.pow(1 - kansi, 2))).toFixed(3);
        },
      }),
    );

    /* Teippaussarja (680 kt) haetaan vasta sivun latauduttua. Siihen asti
       ruudussa on ensimmainen kuva (graafinen-teippaus-alfa-0.webp). */
    let peruttu = false;
    const lataaSarja = () => {
      const img = new Image();
      img.decoding = "async";
      img.src = SARJA;
      const valmis = () => !peruttu && ruutu?.classList.add("mo-film-valmis");
      (img.decode ? img.decode() : Promise.resolve()).then(valmis, valmis);
    };
    if (document.readyState === "complete") lataaSarja();
    else window.addEventListener("load", lataaSarja, { once: true });
    siivous.push(() => {
      peruttu = true;
      window.removeEventListener("load", lataaSarja);
    });

    /* ---------- PALVELUKARUSELLI ---------- */
    const pal = q("[data-g=pal]");
    const palKortit = qa("[data-g-pal]");
    const palPisteet = [...(q("[data-g=palpisteet]")?.children ?? [])] as HTMLElement[];
    let palI = 0;
    const onPal = () => {
      if (!pal) return;
      const m = Math.max(1, pal.scrollWidth - pal.clientWidth);
      const i = pal.scrollLeft >= m - 4 ? 3 : rajaa(Math.round(pal.scrollLeft / 312), 0, 3);
      if (i === palI) return;
      palI = i;
      palKortit.forEach((a, k) => {
        const s = palTila(k === i);
        a.style.transform = `scale(${s.sk})`;
        a.style.opacity = String(s.op);
        a.style.boxShadow = `inset 0 0 0 1px ${s.reuna}`;
        const img = a.querySelector<HTMLElement>("img");
        if (img) img.style.transform = `scale(${s.zoom})`;
      });
      palPisteet.forEach((p, k) => {
        const s = pisteTila(k === i);
        p.style.width = `${s.w}px`;
        p.style.background = s.c;
      });
    };
    pal?.addEventListener("scroll", onPal, { passive: true });
    siivous.push(() => pal?.removeEventListener("scroll", onPal));

    /* ---------- HINTALASKURI ---------- */
    const valitut: Record<string, boolean> = { ...VALITUT_ALKU };
    let auto = AUTO_ALKU;
    let autoja = 1;
    const summa = q("[data-g=summa]");
    const rivit = q("[data-g=rivit]");
    const maara = q("[data-g=maara]");
    const autojaEl = q("[data-g=autoja]");
    const rivinMalli = rivit?.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
    const paivitaArvio = () => {
      const a = laskeArvio(valitut, auto, autoja);
      if (summa) summa.textContent = a.teksti;
      if (rivit) {
        /* Rivi kopioidaan palvelimen merkinnasta, jotta tyylit ovat samat. */
        const uudet = a.rivit.map((r) => {
          const d = (rivinMalli?.cloneNode(true) as HTMLElement) ?? document.createElement("div");
          const s = d.querySelectorAll("span");
          if (s[0]) s[0].textContent = r.n;
          if (s[1]) s[1].textContent = r.v;
          return d;
        });
        rivit.replaceChildren(...uudet);
      }
      if (maara) maara.style.opacity = auto === "ei" ? "0.35" : "1";
      if (autojaEl) autojaEl.textContent = String(autoja);
      myohemmin();
    };
    const paivitaKohde = (b: HTMLElement) => {
      const on = !!valitut[b.dataset.gKohde || ""];
      const s = kohdeTila(on);
      b.setAttribute("aria-pressed", String(on));
      b.style.background = s.bg;
      b.style.boxShadow = s.reuna;
      const r = b.querySelector<HTMLElement>("[data-g=ruutu-k]");
      if (r) {
        r.style.background = s.ruutu;
        r.style.boxShadow = s.ruutuReuna;
      }
      const x = b.querySelector<SVGElement>("[data-g=ruksi]");
      if (x) x.style.opacity = String(s.ruksi);
    };
    const paivitaAutot = () =>
      qa("[data-g-auto]").forEach((b) => {
        const on = b.dataset.gAuto === auto;
        const s = autoTila(on);
        b.setAttribute("aria-checked", String(on));
        b.style.background = s.bg;
        b.style.boxShadow = s.reuna;
        b.style.color = s.fg;
      });

    /* ---------- KLIKIT ---------- */
    let ukkAuki = 0;
    const klikki = (e: MouseEvent) => {
      const t = e.target as Element;
      const vert = t.closest<HTMLElement>("[data-g-vert]");
      if (vert) {
        const i = Number(vert.dataset.gVert);
        qa("[data-g-vert]").forEach((b, k) => {
          const s = vertTab(k, i);
          b.setAttribute("aria-selected", String(s.on));
          b.style.background = s.bg;
          b.style.color = s.fg;
        });
        qa("[data-g-vertkortti]").forEach((a, k) => (a.hidden = k !== i));
        myohemmin();
        return;
      }
      const kohde = t.closest<HTMLElement>("[data-g-kohde]");
      if (kohde) {
        const id = kohde.dataset.gKohde || "";
        valitut[id] = !valitut[id];
        paivitaKohde(kohde);
        paivitaArvio();
        return;
      }
      const ab = t.closest<HTMLElement>("[data-g-auto]");
      if (ab) {
        auto = ab.dataset.gAuto || "ei";
        paivitaAutot();
        paivitaArvio();
        return;
      }
      const mb = t.closest<HTMLElement>("[data-g-maara]");
      if (mb) {
        if (auto === "ei") return;
        autoja = rajaa(autoja + Number(mb.dataset.gMaara), 1, 20);
        paivitaArvio();
        return;
      }
      const ke = t.closest<HTMLElement>("[data-g-ke]");
      if (ke) {
        const i = Number(ke.dataset.gKe);
        qa("[data-g-ke]").forEach((b, k) => {
          const s = keTila(k, i);
          b.setAttribute("aria-selected", String(s.on));
          b.style.background = s.bg;
          b.style.color = s.fg;
        });
        qa("[data-g-kelista]").forEach((l, k) => (l.hidden = k !== i));
        myohemmin();
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
          const v = juuri.querySelector<HTMLElement>(`[data-ukk-vast="${b.dataset.ukk}"]`);
          if (v) v.hidden = !on;
        });
        myohemmin();
        return;
      }
      const kaikki = t.closest<HTMLElement>("[data-ukk-kaikki]");
      if (kaikki) {
        qa("[data-ukk-rivi]").forEach((r) => (r.hidden = false));
        kaikki.remove();
        myohemmin();
        return;
      }
      const seo = t.closest<HTMLElement>("[data-g=seonappi]");
      if (seo) {
        const s = q("[data-g=seo]");
        if (!s) return;
        s.hidden = !s.hidden;
        seo.textContent = s.hidden ? "Lue koko teksti" : "Näytä vähemmän";
        seo.setAttribute("aria-expanded", String(!s.hidden));
        myohemmin();
      }
    };
    juuri.addEventListener("click", klikki);
    siivous.push(() => juuri.removeEventListener("click", klikki));

    /* ---------- TARJOUSPYYNTO (osion oma lomake) ---------- */
    const lomake = q<HTMLFormElement>("[data-g=lomake]");
    /* /api/lomake kuten tyopoydan BudgetForm (tarjous.ts). */
    siivous.push(kytkeTarjous(lomake, q("[data-g=kiitos]"), myohemmin));

    return () => siivous.forEach((f) => f());
  }, []);
  return null;
}
