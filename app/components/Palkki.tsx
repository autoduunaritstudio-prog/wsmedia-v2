"use client";

import { useEffect, useRef, useState } from "react";

/**
 * PYSYVA KEHOTUSPALKKI.
 *
 * Navin omaan palkkiin ei kosketa: logo ja valikkopainike pysyvat
 * sellaisina kuin ovat. Pysyva konversiopolku tehdaan siksi omana
 * kerroksenaan sivun alareunaan.
 *
 * Jaettu kaikille palvelusivuille. Tehtiin ensin SEO-sivulle, jossa
 * mitattiin 17,4 nakymaa ilman yhtaan nappia.
 *
 * Palkki ei ole nakyvissa koko ajan. Se tulee esiin vasta kun hero on
 * vieritetty ohi (heron omat napit ovat silloin jo poissa) ja katoaa
 * kun Tarjous-osio tulee nakymaan (silloin lomake on jo ruudulla eika
 * nappi jonka kohde on nakyvissa ole nappi vaan este).
 *
 * Kaksi IntersectionObserveria, ei yhtaan vierityskuuntelijaa: tila
 * muuttuu kahdesti koko sivun matkalla, joten kehyskohtainen laskenta
 * olisi tuhansia turhia kutsuja.
 */
export default function Palkki() {
  const [nayta, setNayta] = useState(false);
  const ohi = useRef(false);
  const lomake = useRef(false);

  useEffect(() => {
    const paivita = () => setNayta(ohi.current && !lomake.current);

    /* MITATTU VIKA: alasivuilla hero on position: sticky, joten se ei
       poistu nakymasta koskaan. "Hero on ohi" -ehto ei siis voinut
       tayttya ja palkki jai nakymattomiin koko sivun ajaksi.

       Ehto luetaan nyt COVERISTA: kun peittava kerros on noussut
       nakyman puolivaliin, hero on katsottu ja sen omat napit ovat
       poissa. Sivulla jolla coveria ei ole (SEO-sivu) kaytetaan
       heroa kuten ennenkin, ja silloin se ei ole pinnattu. */
    /* ALKUKOHTA VOIDAAN MERKITA SIVULLA. Coverista luettu ehto tuo
       palkin heti kun peittava kerros on noussut nakyman puolivaliin,
       eli kaytannossa heti heron jalkeen. Lyhytvideot-sivulla se on
       liian aikaisin: kavija on silloin vasta ensimmaisessa osiossa
       eika ole nahnyt viela yhtaan perustetta.

       Jos sivulla on [data-palkki-alku], palkki tulee vasta kun se osio
       on noussut nakyman puolivaliin. Ehto on sama molemmissa
       tapauksissa (elementti on nakymassa), joten haaroja ei tule
       kahta. */
    const merkitty = document.querySelector("[data-palkki-alku]");
    const hero =
      merkitty ??
      document.querySelector(".stickysub > .cover") ??
      document.querySelector(".seo-hero") ??
      document.querySelector("header");
    const tarjous = document.querySelector("#tarjous");
    if (!hero || !tarjous) return;

    /* Coverilla ehto on kaanteinen: se ON nakymassa kun hero on ohi.
       rootMargin -50% siirtaa rajan nakyman puolivaliin, jolloin
       palkki tulee vasta kun cover on todella peittanyt heron. */
    const coverina = !!merkitty || hero.classList.contains("cover");
    /* SIJAINTI LUETAAN VIERITYKSESTA, EI IntersectionObserverilla.
       Merkitty osio on pinon vaihe, joka saa peitossa ollessaan
       visibility: hidden (SiteEffects). Safari lakkasi silloin
       raportoimasta sita nakyvaksi, ja palkki katosi valilla kesken
       sivun. Ehto on sama kuin ennen: rootMargin -50 % ylhaalta eli
       elementti leikkaa nakyman alempaa puoliskoa. */
    let viimeksi: boolean | null = null;
    const tarkista = () => {
      const r = hero.getBoundingClientRect();
      const vh = window.innerHeight;
      const leikkaa = coverina ? r.top < vh && r.bottom > vh * 0.5 : r.top < vh && r.bottom > 0;
      const uusi = coverina ? leikkaa : !leikkaa;
      if (uusi === viimeksi) return;
      viimeksi = uusi;
      ohi.current = uusi;
      paivita();
    };
    tarkista();
    window.addEventListener("scroll", tarkista, { passive: true });
    window.addEventListener("resize", tarkista, { passive: true });
    const b = new IntersectionObserver(
      ([e]) => {
        lomake.current = e.isIntersecting;
        paivita();
      },
      { threshold: 0 },
    );
    b.observe(tarjous);
    return () => {
      window.removeEventListener("scroll", tarkista);
      window.removeEventListener("resize", tarkista);
      b.disconnect();
    };
  }, []);

  return (
    <div className={nayta ? "cta-palkki nayta" : "cta-palkki"} aria-hidden={!nayta}>
      <p>
        <b>Maksuton kartoitus</b>
        <span>Nykytila, hakuvolyymit ja kilpailutilanne. Ei sido mihinkään.</span>
      </p>
      <a className="btn" href="#tarjous" tabIndex={nayta ? 0 : -1}>
        Pyydä kartoitus
      </a>
    </div>
  );
}
