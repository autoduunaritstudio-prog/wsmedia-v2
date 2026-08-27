"use client";

import { useEffect } from "react";
import Lenis from "lenis";
// Lenisin oma tyylitiedosto on pakollinen, ei koriste: se antaa
// [data-lenis-prevent] -elementeille overscroll-behavior: containin (jotta
// overlayn vieritys ei ketjuunnu sivulle) ja hoitaa pysaytetyn tilan
// lukituksen. Luokat lisataan vain kun Lenis on aktiivinen, joten
// reduced-motion-tilassa tiedosto on inertti.
import "lenis/dist/lenis.css";

/**
 * Pehmennetty skrollaus koko sivustolle.
 *
 * MIKSI JUURI TAMA TOTEUTUS: Lenis ei kaari sisaltoa transform-wrapperiin
 * vaan kaappaa wheel/touch-syotteen ja ajaa window.scrollTo:ta joka
 * framessa. Selaimen TODELLINEN vierityssijainti on siis se pehmennetty
 * arvo. Se on olennaista, koska sivuston kuusi scroll-sidottua efektia
 * lukevat kahdesta eri lahteesta: kolme window.scrollY:sta ja nelja
 * getBoundingClientRectista - ja natiivilla scrollilla molemmat heijastavat
 * pehmennettya arvoa ilman muutoksia. Transform-wrapper olisi rikkonut
 * seka sen etta molemmat position: sticky -elementit (#nav ja hero).
 *
 * Lenis-instanssi on moduulitasolla, jotta FullscreenNav voi pysayttaa sen
 * valikon ollessa auki. Null jos pehmennys ei ole kaytossa.
 */

let lenis: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenis;
}

export default function SmoothScroll() {
  useEffect(() => {
    // prefers-reduced-motion: ei pehmennysta lainkaan, selaimen oma
    // vieritys jaa voimaan sellaisenaan.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    lenis = new Lenis({
      // autoRaf hoitaa oman rAF-silmukkansa; SiteEffectsin silmukka pysyy
      // erillaan ja lukee scroll-tapahtumia kuten ennenkin.
      autoRaf: true,
      // Sisaanrakennettu ankkurikasittely: kaikki saman sivun #-linkit
      // (19-30 per sivu) vierittyvat pehmennetysti ilman omaa kasittelijaa.
      anchors: true,
      // Pienempi lerp = pidempi jalkiliuku. 0.09 on hitusen oletusta (0.1)
      // pehmeampi ilman etta sivu tuntuu irtoavan syotteesta.
      lerp: 0.09,
    });

    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
