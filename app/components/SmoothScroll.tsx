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
      // Suurempi lerp = tiiviimpi seuraaminen = VAHEMMAN pehmennysta.
      // Asettumisaika (5% jaljella, 60fps): t = ln(0.05)/ln(1-lerp) / 60.
      //   0.09 -> 529ms  alkuperainen, jatti sisallon liikaa jalkeen
      //   0.16 -> 286ms  yha selvasti havaittava viive
      //   0.38 -> 104ms  nykyinen: n. 6 framea, juuri ja juuri aistittava
      // Tata pienempi arvo alkaisi tuntua taas viiveelta, suurempi
      // (0.5 -> 72ms) katoaa kaytannossa natiiviin.
      //
      // HUOM: anchors: true kayttaa Lenisin sisaista scrollTo:ta, joka
      // ilman omaa duration/easing-arvoa noudattaa TATA SAMAA lerpia.
      // Ankkurihypyt siis nopeutuivat samassa suhteessa. Jos ne halutaan
      // pitaa loivempina, ne on irrotettava omalla durationilla - sita
      // ei ole nyt asetettu missaan.
      lerp: 0.38,
    });

    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
