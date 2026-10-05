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
export default function Palkki({
  otsikko = "Maksuton kartoitus",
  selite = "Nykytila, hakuvolyymit ja kilpailutilanne. Ei sido mihinkään.",
  nappi = "Varaa kartoitus",
  yhteys = true,
}: {
  otsikko?: string;
  selite?: string;
  nappi?: string;
  yhteys?: boolean;
} = {}) {
  const [nayta, setNayta] = useState(false);
  const ohi = useRef(false);
  const lomake = useRef(false);

  useEffect(() => {
    const paivita = () => setNayta(ohi.current && !lomake.current);

    /* HETI HERON JALKEEN (4.10.2026). Aiemmin ehto luettiin coverista
       tai [data-palkki-alku]-osiosta, ja palkki tuli vasta 2000-4600 px
       kohdalla. Nyt raja on heron oma loppu dokumentissa: kun hero on
       vieritetty ohi niin, etta siita on jaljella alle 40 % nakymasta,
       heron omat napit ovat poissa ja palkki tulee.

       Heron korkeus mitataan ilman pinnausta: sticky-esivanhemmat
       hetkeksi staticiksi, koska pinnatun elementin offsetTop sisaltaa
       pinnauksen siirtyman (ks. SiteEffects asetteluY). */
    const hero =
      document.querySelector<HTMLElement>("[data-hero]") ??
      document.querySelector<HTMLElement>(".hk-pin") ??
      document.querySelector<HTMLElement>(".page-palvelu header") ??
      document.querySelector<HTMLElement>("header");
    /* Etusivulla lomake on #lomake. */
    const tarjous = document.querySelector("#tarjous") ?? document.querySelector("#lomake");
    if (!hero || !tarjous) return;

    let raja = 0;
    const mittaa = () => {
      const tarttuvat: HTMLElement[] = [];
      for (let a: HTMLElement | null = hero; a && a !== document.body; a = a.parentElement)
        if (getComputedStyle(a).position === "sticky") tarttuvat.push(a);
      const ennen = tarttuvat.map((a) => a.style.getPropertyValue("position"));
      tarttuvat.forEach((a) => a.style.setProperty("position", "static", "important"));
      let y = 0;
      for (let n: HTMLElement | null = hero; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
      const loppu = y + hero.offsetHeight;
      tarttuvat.forEach((a, i) => (ennen[i] ? a.style.setProperty("position", ennen[i]) : a.style.removeProperty("position")));
      raja = loppu - window.innerHeight * 0.4;
    };

    /* Tarkempi ehto: heron oma paanappi. Palkki tulee sina hetkena kun
       nappi poistuu nakyvista tai cover peittaa sen, jolloin konversio-
       painike on ruudulla koko ajan. Osumatesti tehdaan vain heron
       alueella ja kerran kehyksessa. */
    const heronNappi = hero.querySelector<HTMLElement>("a.btn, button.btn, a[href=\"#tarjous\"]");
    const nappiNakyy = () => {
      if (!heronNappi) return window.scrollY <= raja;
      const r = heronNappi.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight || r.width === 0) return false;
      const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !!e && (e === heronNappi || heronNappi.contains(e));
    };
    let viimeksi: boolean | null = null;
    /* Tarkistus suoraan vieritystapahtumassa, ei kehyskutsussa (5.10.2026).
       Kehyskutsussa getBoundingClientRect ja elementFromPoint pakottivat
       tyylilaskennan aina kun toinen kehyskutsu oli jo kirjoittanut
       tyyleja (etusivulla 0,3 s 4x-hidastuksella 7 s:n vierityksessa).
       Vieritystapahtuma ajetaan kehyksen alussa, kerran kehyksessa, ennen
       kehyskutsuja, jolloin asettelu on valmiina ja luku halpa. */
    const tarkista = () => laske();
    /* ETUSIVU (5.10.2026): palkki tulee vasta heron jalkeen, eli kun
       nouseva cover on peittanyt puolet nakymasta. Heron napit haipyvat
       sisaan vierityksen mukana, joten napin osumatesti paastaisi palkin
       esiin jo heron aikana. */
    const etuCover = document.querySelector<HTMLElement>(".stickyzone > .cover");
    const laske = () => {
      const uusi = etuCover
        ? etuCover.getBoundingClientRect().top <= window.innerHeight * 0.5
        : window.scrollY > raja || (window.scrollY > 0 && !nappiNakyy());
      if (uusi === viimeksi) return;
      viimeksi = uusi;
      ohi.current = uusi;
      paivita();
    };
    const koko = () => {
      mittaa();
      laske();
    };
    mittaa();
    const ro = new ResizeObserver(koko);
    ro.observe(hero);
    window.addEventListener("scroll", tarkista, { passive: true });
    window.addEventListener("resize", koko, { passive: true });
    tarkista();
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
      window.removeEventListener("resize", koko);
      ro.disconnect();
      b.disconnect();
    };
  }, []);

  return (
    <div className={nayta ? "cta-palkki nayta" : "cta-palkki"} aria-hidden={!nayta}>
      <p>
        <b>{otsikko}</b>
        <span>{selite}</span>
      </p>
      <span className="cta-palkki-napit">
        {/* Toissijainen: avaa Ota yhteytta -ikkunan (YhteysIkkuna), jos
            sivulla on sellainen. */}
        {yhteys ? (
          <button
            type="button"
            className="cta-palkki-viesti"
            data-yhteys=""
            aria-label="Ota yhteyttä"
            title="Ota yhteyttä"
            tabIndex={nayta ? 0 : -1}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="M4 7l8 6 8-6" />
            </svg>
          </button>
        ) : null}
        <a className="btn" href="#tarjous" tabIndex={nayta ? 0 : -1}>
          {nappi}
        </a>
      </span>
    </div>
  );
}
