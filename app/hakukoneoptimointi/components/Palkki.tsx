"use client";

import { useEffect, useRef, useState } from "react";

/**
 * PYSYVA KEHOTUSPALKKI.
 *
 * Navin omaan palkkiin ei kosketa: logo ja valikkopainike pysyvat
 * sellaisina kuin ovat. Pysyva konversiopolku tehdaan siksi omana
 * kerroksenaan sivun alareunaan.
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

    const hero = document.querySelector(".seo-hero");
    const tarjous = document.querySelector("#tarjous");
    if (!hero || !tarjous) return;

    const a = new IntersectionObserver(
      ([e]) => {
        ohi.current = !e.isIntersecting;
        paivita();
      },
      { threshold: 0 },
    );
    const b = new IntersectionObserver(
      ([e]) => {
        lomake.current = e.isIntersecting;
        paivita();
      },
      { threshold: 0 },
    );
    a.observe(hero);
    b.observe(tarjous);
    return () => {
      a.disconnect();
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
