"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { lahetaLomake } from "./lomake";

const DEFAULT_MIN = 500;
const DEFAULT_MAX = 15000;
const DEFAULT_INITIAL = 2000;
const DEFAULT_STEP = 250;

/**
 * Tuhaterotin kiinteänä sitomattomana välilyöntinä. Intl.NumberFormat antaisi
 * fi-FI:lle eri välilyöntimerkin ICU-versiosta riippuen, mikä rikkoisi
 * palvelin- ja selainrenderin vastaavuuden.
 */
const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

type Props = {
  budgetLabel?: string;
  messageLabel?: string;
  /** Liukurin ala- ja ylaraja seka aloitusarvo. Oletukset sailyttavat
   *  aiempien sivujen kayttaytymisen muuttumattomana. */
  min?: number;
  max?: number;
  initial?: number;
  step?: number;
  /** Yksikko liukurin arvon perassa, esim. "€" tai "€/kk". */
  unit?: string;
  submitLabel?: string;
  note?: string;
  /**
   * Budjettiliukuri. Etusivulla POIS: siella lomake on ensikosketus, ja
   * budjetin kysyminen ennen kuin kavija tietaa mita han on ostamassa
   * karsii yhteydenottoja. Palvelusivuilla se on paikallaan, koska sinne
   * tullaan jo tietyn palvelun perassa ja hinnat on juuri luettu.
   */
  showBudget?: boolean;
  /**
   * Scroll-kaanto. Arvo menee sellaisenaan data-tiltiin: "y" tuo VASEMMAN
   * reunan katsojaa kohti, "-y" oikean. Kaksipalstaisessa asettelussa
   * oikeanpuoleinen lohko saa "-y", jolloin se kaantyy kohti vasenta
   * palstaa - sama konventio kuin case-korteilla.
   *
   * Profiili on "card" (9 astetta, ei taaksepain-kallistusta) eika
   * "mockup" (13 + 5): lomake on luettava ja tayttyva pinta, ei
   * esiteltava mockup, joten kulman pitaa jaada niin pieneksi ettei
   * teksti ala vaantya. Mockup-profiilia ei saa pienentaa taman takia:
   * se on yhteinen .browserin ja .eventin kanssa.
   */
  tilt?: "y" | "-y" | "x" | "-x";
  /**
   * Valinnainen lisakentta ennen viestikenttaa. Palvelusivut kysyvat tassa
   * eri asiaa: verkkosivut nykyista osoitetta, hakukoneoptimointi omaa
   * sivustoa.
   */
  extraField?: { id: string; label: string; placeholder?: string };
  /** Kortin otsikko ja vaihtoehtoiset yhteystavat (kartoitusvaraus ja
   *  puhelin) lomakkeen alla. Palvelusivujen CTA-osio kayttaa naita. */
  otsikko?: string;
  vaihtoehdot?: boolean;
};

export default function BudgetForm({
  budgetLabel = "Budjetti",
  messageLabel = "Mitä tarvitset? Videot, sivusto, yritysilme vai kokonaisuus?",
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  initial = DEFAULT_INITIAL,
  step = DEFAULT_STEP,
  unit = "€",
  submitLabel = "Lähetä tarjouspyyntö",
  note = "Vastaamme 24 tunnin sisällä. Ei sitoumuksia.",
  showBudget = true,
  tilt,
  extraField,
  otsikko,
  vaihtoehdot,
}: Props) {
  const [budget, setBudget] = useState(initial);
  const [valmis, setValmis] = useState(false);
  const [puuttuu, setPuuttuu] = useState(false);
  const [lahettaa, setLahettaa] = useState(false);
  const [virhe, setVirhe] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  /* Seuraava vapaa kartoitusaika varauskalenterista. Haetaan vasta kun
     kortti tulee lahelle nakymaa, ja jos kalenteri ei vastaa, rivi
     jatetaan pois. */
  const [seuraava, setSeuraava] = useState<string | null>(null);
  useEffect(() => {
    if (!vaihtoehdot || !ref.current) return;
    let peruttu = false;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        try {
          const r = await fetch("/api/varaus?tapa=teams", { cache: "no-store" });
          if (!r.ok) return;
          const j = (await r.json()) as { paivat: { ajat: string[] }[] };
          const eka = j.paivat.flatMap((p) => p.ajat)[0];
          if (!eka || peruttu) return;
          const d = new Date(eka);
          const tz = "Europe/Helsinki";
          const pv = new Intl.DateTimeFormat("fi-FI", { weekday: "short", day: "numeric", month: "numeric", timeZone: tz }).format(d);
          const klo = new Intl.DateTimeFormat("fi-FI", { hour: "numeric", minute: "2-digit", timeZone: tz }).format(d);
          setSeuraava(`${pv} klo ${klo}`);
        } catch {
          /* ei aikaa, ei riviä */
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(ref.current);
    return () => {
      peruttu = true;
      io.disconnect();
    };
  }, [vaihtoehdot]);
  const pct = ((budget - min) / (max - min)) * 100;

  /* LAHETYS (6.10.2026): /api/lomake lahettaa tarjouspyynnon Resendilla
     osoitteeseen info@wsmedia.fi ja vahvistuksen lahettajalle, kuten
     Ota yhteytta -ikkuna (ks. lomake.ts). */
  const laheta = async () => {
    const el = ref.current;
    if (!el || lahettaa || valmis) return;
    const arvo = (id: string) => (el.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)?.value ?? "").trim();
    const nimi = arvo("nimi");
    const mail = arvo("mail");
    const puh = arvo("puh");
    if (!nimi || (!mail && !puh)) {
      setPuuttuu(true);
      return;
    }
    setPuuttuu(false);
    setLahettaa(true);
    setVirhe(false);
    const ok = await lahetaLomake("tarjous", {
      nimi,
      sahkoposti: mail,
      puhelin: puh,
      paikkakunta: arvo("pk"),
      lisa: extraField ? arvo(extraField.id) : undefined,
      lisa_otsikko: extraField?.label,
      budjetti: showBudget ? `${fmt(budget)} ${unit}` : undefined,
      sivuotsikko: document.title.split("|")[0].trim(),
      viesti: arvo("lisa"),
      verkkosivu: arvo("tp-verkkosivu"),
    });
    setLahettaa(false);
    if (ok) setValmis(true);
    else setVirhe(true);
  };

  return (
    <div ref={ref} className="card fcard rv" data-par="0.02" data-tilt={tilt} data-tilt-profile={tilt ? "card" : undefined}>
      {otsikko ? (
        <div className="fcard-paa">
          <b>{otsikko}</b>
          <span>
            <i aria-hidden="true" />
            Vastaamme 24 tunnin sisällä
          </span>
        </div>
      ) : null}
      {showBudget && (
        <>
          <label htmlFor="bud">{budgetLabel}</label>
          <div className="budget">
            <input
              type="range"
              id="bud"
              min={min}
              max={max}
              step={step}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              style={{ "--p": `${pct}%` } as CSSProperties}
            />
            <output id="budout" htmlFor="bud">
              {fmt(budget)} {unit}
            </output>
          </div>
        </>
      )}
      <div className="row2">
        <div>
          <label htmlFor="nimi">Nimi</label>
          <input type="text" id="nimi" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="mail">Sähköposti</label>
          <input type="email" id="mail" autoComplete="email" />
        </div>
        <div>
          <label htmlFor="puh">Puhelinnumero</label>
          <input type="text" id="puh" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="pk">Paikkakunta</label>
          <input type="text" id="pk" />
        </div>
      </div>
      {extraField && (
        <>
          <label htmlFor={extraField.id}>{extraField.label}</label>
          <input type="text" id={extraField.id} placeholder={extraField.placeholder} />
        </>
      )}
      <label htmlFor="lisa">{messageLabel}</label>
      <textarea id="lisa" rows={3} />
      {/* Roskapostiansa: ihminen ei nae eika tayta tata. */}
      <div className="vi-ansa" aria-hidden="true">
        <label htmlFor="tp-verkkosivu">Verkkosivu</label>
        <input type="text" id="tp-verkkosivu" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn" type="button" onClick={laheta} disabled={lahettaa || valmis}>
        {lahettaa ? "Lähetetään…" : submitLabel}
      </button>
      {virhe ? (
        <p className="fnote" role="alert">
          Tarjouspyyntö ei lähtenyt. Yritä uudelleen, soita 040 564 8770 tai kirjoita osoitteeseen info@wsmedia.fi.
        </p>
      ) : puuttuu ? (
        <p className="fnote" role="alert">
          Kirjoita nimi ja sähköposti tai puhelinnumero, niin voimme vastata.
        </p>
      ) : valmis ? (
        <p className="fnote" role="status">
          Kiitos, tarjouspyyntö on perillä. Vastaamme arkisin 24 tunnin sisällä.
        </p>
      ) : (
        <p className="fnote">{note}</p>
      )}
      {vaihtoehdot ? (
        <div className="fcard-muut">
          <span className="fcard-tai">tai</span>
          <button type="button" data-varaus="">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
              <path d="M3.5 10h17M8 3v4M16 3v4" />
            </svg>
            <span>
              Varaa 30 min kartoitus
              {seuraava ? <small>Seuraava vapaa {seuraava}</small> : null}
            </span>
          </button>
          <a href="tel:+358405648770">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6.6 3.5h2.6l1.6 4.2-2 1.4a12 12 0 0 0 6.1 6.1l1.4-2 4.2 1.6v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" />
            </svg>
            040 564 8770
          </a>
        </div>
      ) : null}
    </div>
  );
}
