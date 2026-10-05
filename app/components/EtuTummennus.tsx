"use client";

import { useEffect } from "react";

/**
 * ETUSIVUN TAUSTA TUMMUU REFERENSSEJA KOHTI (5.10.2026).
 *
 * Vaalea verkkotausta tummuu Referenssien tummaan (#0b131d) ennen kuin
 * Referenssit nousee nakyviin. Referenssien paalle nouseva .aftercover
 * pysyy vaaleana.
 *
 * KEVYT MYOS HEIKOLLA PROSESSORILLA: kirjoitetaan vain yhden
 * tasavarisen kerroksen (.metalbd-yo) opacity, joka on komposiittiominaisuus
 * eika maalaa mitaan uudelleen. Ei CSS-muuttujia (ne laskisivat tyylit
 * koko alipuulle), ei transformia isolle kerrokselle (CLAUDE.md, Chromen
 * renderointi 3). Arvo pyoristetaan 0,02:n portaisiin ja kirjoitetaan vain
 * kun se muuttuu, ja laskenta tehdaan korkeintaan kerran kehyksessa.
 *
 * Vierityksen ohjaama, ei itsestaan liikkuva, joten reduced motion ei
 * koske tata (ks. CLAUDE.md, prefers-reduced-motion).
 */
const ASKEL = 50;

export default function EtuTummennus() {
  useEffect(() => {
    const refs = document.querySelector<HTMLElement>(".refs");
    const after = document.querySelector<HTMLElement>(".aftercover");
    const yo1 = document.querySelector<HTMLElement>(".stickyzone > .cover .metalbd-yo");
    if (!refs || !after || !yo1) return;
    const kangas = yo1.parentElement?.querySelector<HTMLCanvasElement>("canvas") ?? null;
    const ukk = document.querySelector<HTMLElement>("#ukk");
    let h1 = -1;

    let raf = 0;
    let v1 = -1;
    const kirjoita = (el: HTMLElement, v: number, ed: number) => {
      if (v !== ed) el.style.opacity = String(v / ASKEL);
      return v;
    };
    const paivita = () => {
      raf = 0;
      const vh = window.innerHeight;
      // 1) Tummuminen: alkaa kun Referenssien ylareuna on 45 % nakymasta
      //    alareunan alapuolella ja on valmis kun se koskettaa alareunaa.
      //    (Ensin koko nakyman matka, se alkoi liian aikaisin.)
      const rt = refs.getBoundingClientRect().top;
      const p1 = Math.min(1, Math.max(0, (1.45 * vh - rt) / (0.45 * vh)));
      // 2) .aftercover itse pysyy vaaleana (sen tummennus poistettu
      //    5.10.2026). Sen etenemalla vaalennetaan vain coverin kerros,
      //    joka tulee taas nakyviin .aftercoverin jalkeen.
      const at = after.getBoundingClientRect().top;
      const p2 = Math.min(1, Math.max(0, (at - 0.15 * vh) / (0.7 * vh)));
      // Coverin kuviokerros nakyy uudelleen .aftercoverin jalkeen
      // (.belowcover: Prosessi, UKK, yhteydenotto). Se vaalenee siksi
      // samassa tahdissa kuin .aftercover, muuten Prosessi jaisi tummaksi.
      v1 = kirjoita(yo1, Math.round(Math.min(p1, p2) * ASKEL), v1);
      // 3) UKK: kuvio himmenee kun osio nousee nakyviin (ylareuna
      //    nakyman alareunasta 40 %:iin) ja katoaa lopussa kokonaan.
      //    Pelkka data-attribuutti, jonka VerkkoKangas lukee piirtaessaan.
      if (kangas && ukk) {
        const ut = ukk.getBoundingClientRect().top;
        const h = Math.round(Math.min(1, Math.max(0, (vh - ut) / (0.6 * vh))) * ASKEL);
        if (h !== h1) {
          h1 = h;
          kangas.dataset.himmea = String(h / ASKEL);
        }
      }
    };
    const ajasta = () => {
      if (!raf) raf = requestAnimationFrame(paivita);
    };
    paivita();
    window.addEventListener("scroll", ajasta, { passive: true });
    window.addEventListener("resize", ajasta, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", ajasta);
      window.removeEventListener("resize", ajasta);
    };
  }, []);

  return null;
}
