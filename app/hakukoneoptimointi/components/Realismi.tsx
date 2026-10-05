"use client";

import { useEffect, useRef, type ReactNode } from "react";
import r from "./Realismi.module.css";

/**
 * REALISTISET NAKYMAT (3.10.2026). Heron hakutulossivun kieli koko
 * sivulle: valkoiset kayttoliittymat sellaisina kuin asiakas ne nakee,
 * sivuston ikonit, siniset otsikot, tahdet ja kartta. Jokainen nakyma
 * herää kun se tulee nakyviin (data-on), kerran, ja rivit, nastat ja
 * teksti tulevat portaittain. Reduced-motion: valmis tila heti.
 *
 * Yritysten nimet ovat keksittyja esimerkkeja.
 */
function useHeraa<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.on = "1";
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.on = "1";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

const st = (i: number) => ({ "--i": i }) as React.CSSProperties;

type Tulos = { nimi: string; polku: string; otsikko: string; ikoni: string; vari: string; oma?: boolean; tahdet?: string };
const TULOKSET: Tulos[] = [
  {
    nimi: "Yrityksesi Oy",
    polku: "yrityksesi.fi › palvelut › ilmalampopumput",
    otsikko: "Ilmalämpöpumpun asennus Espoossa | Yrityksesi Oy",
    ikoni: "Y",
    vari: "#0b8aa3",
    oma: true,
    tahdet: "4,9 ★★★★★ (127)",
  },
  { nimi: "Kilpailija Oy", polku: "kilpailija.fi › ilmalampopumput", otsikko: "Ilmalämpöpumput ja asennus | Kilpailija Oy", ikoni: "K", vari: "#e8710a" },
  { nimi: "Verkkokauppa", polku: "verkkokauppa.example › lampopumput", otsikko: "Lämpöpumput edullisesti verkosta", ikoni: "V", vari: "#1e8e3e" },
  { nimi: "Yrityshakemisto", polku: "hakemisto.example › espoo › lvi", otsikko: "LVI-yritykset Espoo – vertaa tarjouksia", ikoni: "H", vari: "#7b61ff" },
];

/** Hakutulossivu: nelja tulosta, oma ensimmaisena. */
export function SerpMini() {
  const ref = useHeraa<HTMLDivElement>();
  return (
    <div className={r.ikkuna} ref={ref} data-on="0" aria-hidden="true">
      <div className={r.haku}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        ilmalämpöpumppu asennus espoo
      </div>
      <ol className={r.tulokset}>
        {TULOKSET.map((t, i) => (
          <li key={t.polku} className={t.oma ? `${r.tulos} ${r.oma}` : r.tulos} style={st(i)}>
            <div className={r.lahde}>
              <i className={r.ikoni} style={{ background: t.vari }}>
                {t.ikoni}
              </i>
              <span>
                <b>{t.nimi}</b>
                <small>{t.polku}</small>
              </span>
              {t.oma ? <em className={r.sina}>Sinä</em> : null}
            </div>
            <p className={r.otsikko}>{t.otsikko}</p>
            {t.tahdet ? <p className={r.tahdet}>{t.tahdet}</p> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Tekoalyn yhteenveto: teksti piirtyy esiin, lahteet tulevat perassa. */
export function AiVastaus() {
  const ref = useHeraa<HTMLDivElement>();
  return (
    <div className={`${r.ikkuna} ${r.ai}`} ref={ref} data-on="0" aria-hidden="true">
      <p className={r.aiOts}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M12 2l2.2 6.3L20 10l-5.8 1.7L12 18l-2.2-6.3L4 10l5.8-1.7z" fill="#1a73e8" />
          <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9z" fill="#6fecff" />
        </svg>
        Tekoälyn yhteenveto
      </p>
      <p className={r.aiTeksti}>
        Espoossa ilmalämpöpumpun asennus maksaa tyypillisesti <mark>1 200–2 400 €</mark> laitteineen.
        Asennus vie yleensä yhden työpäivän, ja moni paikallinen yritys antaa kiinteän hinnan.
      </p>
      <p className={r.aiLk}>Lähteet</p>
      <div className={r.aiLahteet}>
        {[
          ["Y", "#0b8aa3", "yrityksesi.fi", "Asennus ja hinnat", true],
          ["E", "#5f6368", "energiavirasto.example", "Lämpöpumppuopas", false],
          ["K", "#e8710a", "kilpailija.fi", "Ilmalämpöpumput", false],
        ].map(([ik, v, nimi, ots, oma], i) => (
          <span key={nimi as string} className={oma ? `${r.lahdekortti} ${r.omaLahde}` : r.lahdekortti} style={st(i)}>
            <i className={r.ikoni} style={{ background: v as string }}>
              {ik as string}
            </i>
            <span>
              <b>{ots as string}</b>
              <small>{nimi as string}</small>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Karttatulokset: kartta, nastat putoavat, kolme yritysta tahtineen. */
export function KarttaPaketti() {
  const ref = useHeraa<HTMLDivElement>();
  const YRITYKSET: [string, string, string, string, boolean][] = [
    ["Yrityksesi Oy", "4,9", "(127)", "Avoinna · 1,2 km · Ilmalämpöpumput", true],
    ["Kilpailija Oy", "4,5", "(58)", "Avoinna · 2,8 km · LVI-palvelut", false],
    ["Toinen yritys", "4,2", "(23)", "Suljettu · 4,1 km · Asennuspalvelut", false],
  ];
  return (
    <div className={`${r.ikkuna} ${r.kartta}`} ref={ref} data-on="0" aria-hidden="true">
      <div className={r.karttaKuva}>
        <svg viewBox="0 0 420 170" preserveAspectRatio="xMidYMid slice">
          <rect width="420" height="170" fill="#e8eef3" />
          <path d="M0 120 C80 100,160 140,240 112 S380 86,420 96 L420 170 L0 170 Z" fill="#cfe6f5" />
          <g stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round">
            <path d="M0 44 H420 M0 88 H300 M70 0 V170 M196 0 V120 M312 0 V170" />
          </g>
          <g stroke="#fde293" strokeWidth="6" fill="none">
            <path d="M0 64 C120 60,220 76,420 58" />
          </g>
          <g fill="#d7e4cf">
            <rect x="92" y="8" width="84" height="26" rx="4" />
            <rect x="214" y="56" width="80" height="24" rx="4" />
          </g>
        </svg>
        {[
          ["1", 34, 46, true],
          ["2", 66, 30, false],
          ["3", 52, 64, false],
        ].map(([n, x, y, oma], i) => (
          <span
            key={n as string}
            className={oma ? `${r.nasta} ${r.omaNasta}` : r.nasta}
            style={{ left: `${x}%`, top: `${y}%`, ...st(i) }}
          >
            <b>{n as string}</b>
          </span>
        ))}
      </div>
      <ol className={r.yritykset}>
        {YRITYKSET.map(([nimi, arvo, maara, rivi, oma], i) => (
          <li key={nimi} className={oma ? `${r.yritys} ${r.omaYritys}` : r.yritys} style={st(i)}>
            <span className={r.nro}>{i + 1}</span>
            <span className={r.ytiedot}>
              <b>{nimi}</b>
              <span className={r.ytahdet}>
                {arvo} <i>★★★★★</i> {maara}
              </span>
              <small>{rivi}</small>
            </span>
            {oma ? <em className={r.sina}>Sinä</em> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Heraa({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useHeraa<HTMLDivElement>();
  return (
    <div className={className} ref={ref} data-on="0">
      {children}
    </div>
  );
}
