"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import t from "./SisaltoTabit.module.css";

/**
 * NELJA OSA-ALUETTA VALILEHTINA (3.10.2026).
 *
 * Osio oli nelja perakkaista paneelia, jokaisessa kuva, kappale ja
 * kuusi rivia: yli 4000 pikselia luettavaa. Nyt osio on yhden nakyman
 * korkuinen: vasemmalla nelja valilehteä, oikealla valitun osa-alueen
 * nakyma, kappale ja tehtavat. Valilehti vaihtuu itsestaan muutaman
 * sekunnin valein kun osio on nakyvissa ja lukija ei ole koskenut
 * siihen, ja oranssi palkki valilehden alla nayttaa milloin. Kaikki
 * nelja paneelia ovat HTML:ssa hakukonetta varten.
 *
 * Reduced-motion: ei automaattista vaihtoa, ei palkkia.
 */
export type Paneeli = {
  id: string;
  label: string;
  h: string;
  p: string;
  rows: [string, string][];
  kuva: ReactNode;
  ikoni: ReactNode;
};

const KESTO = 7000;

export default function SisaltoTabit({ paneelit }: { paneelit: Paneeli[] }) {
  const [aktiivinen, setAktiivinen] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const [nakyy, setNakyy] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(false);
    const io = new IntersectionObserver(([e]) => setNakyy(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !nakyy) return;
    const id = window.setTimeout(() => setAktiivinen((a) => (a + 1) % paneelit.length), KESTO);
    return () => window.clearTimeout(id);
  }, [auto, nakyy, aktiivinen, paneelit.length]);

  /* Valitun paneelin nakyma heraa uudelleen: .rv.on pois ja takaisin. */
  useEffect(() => {
    const el = ref.current?.querySelector(`[data-paneeli="${aktiivinen}"]`);
    if (!el) return;
    const rv = Array.from(el.querySelectorAll(".rv"));
    rv.forEach((x) => x.classList.remove("on"));
    const r = requestAnimationFrame(() => requestAnimationFrame(() => rv.forEach((x) => x.classList.add("on"))));
    return () => cancelAnimationFrame(r);
  }, [aktiivinen]);

  const valitse = (i: number) => {
    setAuto(false);
    setAktiivinen(i);
  };

  return (
    <div className={t.tabit} ref={ref} data-auto={auto && nakyy ? "1" : "0"}>
      <div className={t.lista} role="tablist" aria-label="Hakukoneoptimoinnin osa-alueet">
        {paneelit.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            id={`tab-${p.id}`}
            aria-selected={i === aktiivinen}
            aria-controls={`paneeli-${p.id}`}
            className={`${t.tab} on`}
            onClick={() => valitse(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                e.preventDefault();
                valitse((i + 1) % paneelit.length);
                (e.currentTarget.parentElement?.children[(i + 1) % paneelit.length] as HTMLElement)?.focus();
              }
              if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                e.preventDefault();
                const j = (i - 1 + paneelit.length) % paneelit.length;
                valitse(j);
                (e.currentTarget.parentElement?.children[j] as HTMLElement)?.focus();
              }
            }}
            tabIndex={i === aktiivinen ? 0 : -1}
          >
            <span className={t.tabIkoni}>{p.ikoni}</span>
            <span className={t.tabTeksti}>
              <b>{p.label}</b>
              <small>{p.rows.length} tehtävää</small>
            </span>
            <i className={t.palkki} key={i === aktiivinen ? `on-${aktiivinen}` : "off"} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className={t.paneelit}>
        {paneelit.map((p, i) => (
          <section
            key={p.id}
            id={`paneeli-${p.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${p.id}`}
            className={t.paneeli}
            data-paneeli={i}
            data-on={i === aktiivinen ? "1" : "0"}
          >
            <div className={t.ylä}>
              <div>
                <h3 className={t.otsikko}>{p.h}</h3>
                <p className={t.kuvaus}>{p.p}</p>
              </div>
              <div className={t.kuva}>{p.kuva}</div>
            </div>
            <dl className={t.rivit}>
              {p.rows.map(([b, s], j) => (
                <div key={b} style={{ "--j": j } as CSSProperties}>
                  <dt>{b}</dt>
                  <dd>{s}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
