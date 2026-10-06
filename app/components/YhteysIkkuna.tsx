"use client";

import { useEffect, useRef, useState } from "react";
import { AUKIOLO } from "./organisaatio";
import type { YhteysTieto } from "./Kehotukset";
import { lahetaLomake } from "./lomake";

/**
 * OTA YHTEYTTA -IKKUNA (4.10.2026).
 *
 * Kevyt yhteydenotto kesken sivun, ilman etta lukija vieritetaan
 * sivun loppuun tarjouslomakkeelle. Ikkuna avautuu ws:yhteys-
 * tapahtumasta, jonka Kehotukset.tsx lahettaa (data-yhteys,
 * hinnoittelukorttien napit, "Kysy suoraan" -linkit). Ikkunassa on perustiedot (nimi, puhelin,
 * sahkoposti), valittava palvelu ja vapaa viesti, seka suorat
 * yhteystiedot niille jotka haluavat soittaa.
 *
 * Lahetys menee /api/lomake-reitille, joka lahettaa viestin
 * Resendilla osoitteeseen info@wsmedia.fi ja vahvistuksen lahettajalle
 * (6.10.2026, ks. lomake.ts). Jos lahetys ei onnistu, ikkuna neuvoo
 * soittamaan tai kirjoittamaan suoraan.
 *
 * Natiivi <dialog>: fokus pysyy ikkunassa, Esc sulkee, taustan
 * vieritys lukitaan .lukossa-luokalla (ks. Pehmeavieritys).
 */
const PALVELUT = ["Lyhytvideot", "Verkkosivut", "Hakukoneoptimointi", "Graafinen suunnittelu"];

export default function YhteysIkkuna() {
  const ref = useRef<HTMLDialogElement>(null);
  const [valitut, setValitut] = useState<string[]>([]);
  const [paketti, setPaketti] = useState<string | undefined>();
  const [otsikko, setOtsikko] = useState("Paketti");
  const [lahetetty, setLahetetty] = useState(false);
  const [lahettaa, setLahettaa] = useState(false);
  const [virhe, setVirhe] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const avaa = (e: Event) => {
      const t = (e as CustomEvent<YhteysTieto>).detail ?? {};
      setValitut(t.palvelu ? [t.palvelu] : []);
      setPaketti(t.paketti);
      setOtsikko(t.otsikko ?? "Paketti");
      setLahetetty(false);
      setVirhe(false);
      if (!d.open) d.showModal();
      document.documentElement.classList.add("lukossa");
    };
    const kiinni = () => document.documentElement.classList.remove("lukossa");
    const taustaklikki = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    window.addEventListener("ws:yhteys", avaa);
    d.addEventListener("close", kiinni);
    d.addEventListener("click", taustaklikki);
    return () => {
      window.removeEventListener("ws:yhteys", avaa);
      d.removeEventListener("close", kiinni);
      d.removeEventListener("click", taustaklikki);
    };
  }, []);

  const vaihda = (p: string) => setValitut((v) => (v.includes(p) ? v.filter((x) => x !== p) : [...v, p]));

  const laheta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lahettaa) return;
    const f = new FormData(e.currentTarget);
    const g = (k: string) => String(f.get(k) ?? "");
    setLahettaa(true);
    setVirhe(false);
    const ok = await lahetaLomake("yhteys", {
      nimi: g("nimi"),
      yritys: g("yritys"),
      puhelin: g("puhelin"),
      sahkoposti: g("sahkoposti"),
      palvelu: valitut.join(", "),
      paketti,
      paketti_otsikko: paketti ? otsikko : undefined,
      viesti: g("viesti"),
      verkkosivu: g("verkkosivu"),
    });
    setLahettaa(false);
    if (ok) setLahetetty(true);
    else setVirhe(true);
  };

  return (
    <dialog className="yi" ref={ref} aria-labelledby="yi-otsikko">
      <div className="yi-sisus">
        <button type="button" className="yi-sulje" aria-label="Sulje" onClick={() => ref.current?.close()}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="yi-vasen">
          <p className="yi-kick">Ota yhteyttä</p>
          <h2 id="yi-otsikko">Kerro lyhyesti, mitä tarvitset.</h2>
          <p className="yi-lead">Vastaamme arkisin 24 tunnin sisällä. Kiireessä soita suoraan.</p>
          <ul className="yi-suorat">
            <li>
              <span>Puhelin</span>
              <a href="tel:+358405648770">040 564 8770</a>
            </li>
            <li>
              <span>Sähköposti</span>
              <a href="mailto:info@wsmedia.fi">info@wsmedia.fi</a>
            </li>
            <li>
              <span>Toimisto</span>
              <b>Kuusiniementie 8 F 3, Espoo</b>
            </li>
            <li>
              <span>Aukioloajat</span>
              <b>{AUKIOLO.map((a) => `${a.paivat} ${a.ajat}`).join(", ")}</b>
            </li>
          </ul>
        </div>

        {lahetetty ? (
          <div className="yi-kiitos" role="status">
            <h3>Kiitos, viesti on perillä.</h3>
            <p>Vastaamme arkisin 24 tunnin sisällä. Lähetimme vahvistuksen sähköpostiisi.</p>
            <button type="button" className="btn" onClick={() => ref.current?.close()}>
              Sulje
            </button>
          </div>
        ) : (
          <form className="yi-lomake" onSubmit={laheta}>
            {paketti ? (
              <p className="yi-paketti">
                {otsikko}: <b>{paketti}</b>
              </p>
            ) : null}
            <fieldset className="yi-palvelut">
              <legend>Mistä palvelusta on kyse?</legend>
              {PALVELUT.map((p) => (
                <label key={p} className={valitut.includes(p) ? "on" : undefined}>
                  <input type="checkbox" checked={valitut.includes(p)} onChange={() => vaihda(p)} />
                  {p}
                </label>
              ))}
            </fieldset>
            <div className="yi-rivi">
              <label>
                Nimi
                <input name="nimi" autoComplete="name" required />
              </label>
              <label>
                Yritys
                <input name="yritys" autoComplete="organization" />
              </label>
            </div>
            <div className="yi-rivi">
              <label>
                Puhelin
                <input name="puhelin" type="tel" autoComplete="tel" />
              </label>
              <label>
                Sähköposti
                <input name="sahkoposti" type="email" autoComplete="email" required />
              </label>
            </div>
            <label>
              Viesti
              <textarea name="viesti" rows={3} placeholder="Esim. tarvitsemme 4 videota kuukaudessa Instagramiin." />
            </label>
            {/* Roskapostiansa: ihminen ei nae eika tayta tata. */}
            <label className="vi-ansa" aria-hidden="true">
              Verkkosivu
              <input name="verkkosivu" tabIndex={-1} autoComplete="off" />
            </label>
            {virhe ? (
              <p className="vi-ilmoitus" role="alert">
                Viesti ei lähtenyt. Yritä uudelleen, soita 040 564 8770 tai kirjoita osoitteeseen info@wsmedia.fi.
              </p>
            ) : null}
            <button className="btn" type="submit" disabled={lahettaa}>
              {lahettaa ? "Lähetetään…" : "Lähetä viesti"}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
