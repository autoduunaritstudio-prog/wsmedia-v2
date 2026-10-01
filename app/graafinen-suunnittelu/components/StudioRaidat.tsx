"use client";

import { useEffect } from "react";

/**
 * HERON VINORAIDAT JATKUVAT KOKO SIVUN LAPI.
 *
 * Jokaisella pinnalla (cover ja kaaret) on oma raitakerros
 * (::after, globals.css). Ilman tata kerros vierisi pinnan mukana:
 * yksi raitaryhma pinnan ylareunassa, sitten pitka tyhja matka, ja
 * kun seuraava pinta nousi paalle, sen raidat osuivat edellisten
 * paalle eri kohtaan.
 *
 * Tama pitaa jokaisen pinnan kerroksen nakyman kohdalla (--ry) ja
 * siirtaa kuvion niin, etta se on kaikilla pinnoilla samassa kohdassa
 * (--ro). Raidat liikkuvat vierityksen mukana hitaammin kuin sisalto
 * (--gs-y), kaksi kerrosta eri nopeudella, kuten herossa. Kirjoitetaan
 * vain transformiin ja taustan sijaintiin, ei asetteluun.
 */
export default function StudioRaidat() {
  useEffect(() => {
    const juuri = document.querySelector<HTMLElement>(".page-graafinen-suunnittelu");
    if (!juuri) return;
    const pinnat = Array.from(
      juuri.querySelectorAll<HTMLElement>(".stickysub > .cover, .jakso-pari:not(.jakso-avoin)"),
    );
    let raf = 0;
    const paivita = () => {
      raf = 0;
      const vh = window.innerHeight;
      juuri.style.setProperty("--gs-y", String(Math.round(window.scrollY)));
      for (const p of pinnat) {
        const r = p.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) continue;
        const ry = Math.min(Math.max(0, -r.top), Math.max(0, r.height - vh));
        p.style.setProperty("--ry", `${Math.round(ry)}px`);
        p.style.setProperty("--ro", `${Math.round(r.top + ry)}px`);
      }
    };
    const pyyda = () => {
      if (!raf) raf = requestAnimationFrame(paivita);
    };
    paivita();
    window.addEventListener("scroll", pyyda, { passive: true });
    window.addEventListener("resize", pyyda);
    return () => {
      window.removeEventListener("scroll", pyyda);
      window.removeEventListener("resize", pyyda);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
