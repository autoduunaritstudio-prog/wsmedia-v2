"use client";

/* LASKUTUSTIETOJEN PUHELINVERSION TEHOSTEET (suunnitelman renderVals:
   heroScale/Radius/Dim/TextY/TextOp, arkkiY/arkkiR, kop). Kirjoittaa suoraan
   DOMiin, ei renderoi mitaan. Yhteiset asiat (palkki, valikko,
   paljastukset) ovat Moottorissa.

   Poikkeama: suunnitelma kasvatti heron border-radiusta 0 -> 28 px.
   Sama nakyma tehdaan kahdella kulmapalalla, joita skaalataan
   transformilla (ei maalausta joka kehys). */

import { useEffect } from "react";
import { kuuntele, onMobiili, rajaa, type Tila } from "@/app/components/mobiili/vieritys";

const PIN = 1480 - 844;

export default function Efektit() {
  useEffect(() => {
    if (!onMobiili()) return;
    const juuri = document.querySelector<HTMLElement>(".mo-s-laskutus");
    if (!juuri) return;
    const q = (s: string) => juuri.querySelector<HTMLElement>(s);
    const siivous: Array<() => void> = [];

    /* ---------- HERO: pinnattu, cover nousee 0..PIN ---------- */
    const hero = q("[data-hero]");
    const teksti = q("[data-hero-teksti]");
    const himmea = q("[data-hero-himmea]");
    const kulmat = [...juuri.querySelectorAll<HTMLElement>("[data-hero-kulma]")];
    let viimeHero = "";
    /* ---------- LASKUARKKI: nousee ja oikenee coverin mukana ---------- */
    const arkki = q("[data-arkki]");
    siivous.push(
      kuuntele({
        kirjoita: (t: Tila) => {
          const k = rajaa(t.y / PIN);
          const avain = k.toFixed(4);
          if (avain !== viimeHero) {
            viimeHero = avain;
            if (hero) {
              hero.style.transform = `scale(${(1 - 0.07 * k).toFixed(4)})`;
              hero.toggleAttribute("data-hero-pois", k >= 1);
            }
            const r = (Math.round(28 * k) / 28).toFixed(4);
            kulmat.forEach((n) => (n.style.transform = `scale(${r})`));
            if (teksti) {
              teksti.style.transform = `translateY(${Math.round(-70 * k)}px)`;
              teksti.style.opacity = (1 - 0.5 * k).toFixed(3);
            }
            if (himmea) himmea.style.opacity = (0.6 * k).toFixed(3);
            if (arkki) arkki.style.transform = `translateY(${Math.round(40 * (1 - k))}px) rotate(${(-2.5 * (1 - k)).toFixed(2)}deg)`;
          }
        },
      }),
    );

    siivous.push(kopioinnit(juuri));
    return () => siivous.forEach((f) => f());
  }, []);
  return null;
}

/* Suunnitelman kopioi(): leikepoydalle, "Kopioitu" 1,8 s, yksi kerrallaan. */
function kopioinnit(juuri: HTMLElement) {
  let kt = 0;
  let nyt: HTMLElement | null = null;
  const palauta = () => {
    if (!nyt) return;
    nyt.classList.remove("mo-ok");
    const s = nyt.querySelector("[data-kop-teksti]");
    if (s) s.textContent = "Kopioi";
    nyt = null;
  };
  const klikki = (e: Event) => {
    const b = (e.target as Element | null)?.closest?.<HTMLElement>("[data-kopioi]");
    if (!b || !juuri.contains(b)) return;
    try {
      navigator.clipboard?.writeText(b.dataset.kopioi || "").catch(() => {});
    } catch {}
    palauta();
    nyt = b;
    b.classList.add("mo-ok");
    const s = b.querySelector("[data-kop-teksti]");
    if (s) s.textContent = "Kopioitu";
    window.clearTimeout(kt);
    kt = window.setTimeout(palauta, 1800);
  };
  juuri.addEventListener("click", klikki);
  return () => {
    juuri.removeEventListener("click", klikki);
    window.clearTimeout(kt);
  };
}
