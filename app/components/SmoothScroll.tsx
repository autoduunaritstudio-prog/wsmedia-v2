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
      // Suurempi lerp = VAHEMMAN pehmennysta. 1 on kaytannossa minimi:
      // Lenis ei kayta lerpia suoraan sekoituskertoimena vaan syottaa sen
      // dampiin (lenis.mjs:86):
      //     value = damp(value, to, lerp * 60, dt)
      //     damp(x, y, lambda, dt) = lerp(x, y, 1 - exp(-lambda * dt))
      // Kehyskohtainen kerroin on siis 1 - exp(-lerp) eika lerp, ja
      // jaljella oleva matka ajan funktiona on exp(-lerp * 60 * t).
      // Asettumisaika 5 %:iin on siten kehysnopeudesta riippumaton:
      //     t = ln(20) / (lerp * 60) = 49,93 / lerp millisekuntia
      // Tama KORJAA aiemman tassa olleen mallin, joka oletti kertoimeksi
      // suoraan lerpin ja antoi siksi n. 24 % liian lyhyita aikoja.
      //   0.09 -> 555 ms   0.16 -> 312 ms   0.38 -> 131 ms
      //   0.95 ->  53 ms   1.00 ->  50 ms  (n. 3 kehysta 60 Hz:lla)
      // 50 ms on Lenisin pohja rullapehmennykselle: alle sen paastaisiin
      // vain lerpilla > 1, mika on dokumentoidun 0..1-alueen ulkopuolella.
      //
      // 1 on turvallinen: advance() testaa lerpin vain totuusarvona
      // (else if (this.lerp)), eika Lenis kayta sita jakajana. Kirjasto
      // asettaa itse lerp = 1 immediate-scrollToon ja inertiattomaan
      // syncTouchiin, joten arvo on kirjaston omassa kaytossa.
      //
      // Instanssi jaa aktiiviseksi, joten anchors: true ja
      // FullscreenNavin stop()/start() toimivat muuttumattomina.
      lerp: 1,
    });

    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
