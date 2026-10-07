"use client";

import { useEffect, useRef, useState } from "react";

import { CONTACT } from "../components/site-data";
import { SKILLS, lahetaHakemus } from "./hakemus";
import Liite from "./Liite";

/**
 * AVOIN HAKEMUS -IKKUNA (5.10.2026), vain Toihin meille -sivulla.
 *
 * Sisallon keskella olevat [data-hakemus]-painikkeet avaavat taman, jotta
 * hakijan ei tarvitse vierittaa sivun loppuun. Rakenne ja tyylit samat
 * kuin yleisessa yhteysikkunassa (.yi-*), sisalto tyonhakijalle.
 * Kehotukset.tsx ei kasittele [data-hakemus]-nappeja, joten ne eivat
 * avaa varauskalenteria eivatka yhteyslomaketta.
 *
 * Lahetys menee /api/lomake-reitille liitteineen (sama kuin sivun
 * lomakkeessa, ks. hakemus.ts).
 */
export default function HakemusIkkuna() {
  const ref = useRef<HTMLDialogElement>(null);
  const [valitut, setValitut] = useState<string[]>([]);
  const [lahetetty, setLahetetty] = useState(false);
  const [liitteet, setLiitteet] = useState<File[]>([]);
  const [lahettaa, setLahettaa] = useState(false);
  const [virhe, setVirhe] = useState<string | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const avaa = () => {
      setLahetetty(false);
      if (!d.open) d.showModal();
      document.documentElement.classList.add("lukossa");
    };
    const klikki = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      const el = (e.target as Element | null)?.closest?.("[data-hakemus]");
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      avaa();
    };
    const kiinni = () => document.documentElement.classList.remove("lukossa");
    const taustaklikki = (e: MouseEvent) => {
      if (e.target === d) d.close();
    };
    document.addEventListener("click", klikki);
    d.addEventListener("close", kiinni);
    d.addEventListener("click", taustaklikki);
    return () => {
      document.removeEventListener("click", klikki);
      d.removeEventListener("close", kiinni);
      d.removeEventListener("click", taustaklikki);
      // Sivulta poistuttaessa (esim. takaisin-nappi ikkunan ollessa auki)
      // close ei laukea; lukko ei saa jaada seuraavalle sivulle.
      kiinni();
    };
  }, []);

  const vaihda = (s: string) => setValitut((v) => (v.includes(s) ? v.filter((x) => x !== s) : [...v, s]));

  const laheta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lahettaa) return;
    setLahettaa(true);
    setVirhe(null);
    const v = await lahetaHakemus(new FormData(e.currentTarget), valitut, liitteet);
    setLahettaa(false);
    if (v) setVirhe(v);
    else setLahetetty(true);
  };

  return (
    <dialog className="yi hi" ref={ref} aria-labelledby="hi-otsikko">
      <div className="yi-sisus">
        <button type="button" className="yi-sulje" aria-label="Sulje" onClick={() => ref.current?.close()}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="yi-vasen">
          <p className="yi-kick">Avoin hakemus</p>
          <h2 id="hi-otsikko">Kerro, mitä osaat.</h2>
          <p className="yi-lead">Hakemus vie viisi minuuttia. Luemme jokaisen ja vastaamme viikon sisällä.</p>
          <ul className="yi-suorat">
            <li>
              <span>Ansioluettelo</span>
              <b>Ei tarvita, linkki työnäytteisiin riittää</b>
            </li>
            <li>
              <span>Työmalli</span>
              <b>Toimeksianto tai työsuhde</b>
            </li>
            <li>
              <span>Laskutus</span>
              <b>Kevytyrittäjyys käy</b>
            </li>
            <li>
              <span>Sähköposti</span>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
          </ul>
        </div>

        {lahetetty ? (
          <div className="yi-kiitos" role="status">
            <h3>Kiitos, hakemus on perillä.</h3>
            <p>Luemme sen ja vastaamme viikon sisällä. Lähetimme vahvistuksen sähköpostiisi.</p>
            <button type="button" className="btn" onClick={() => ref.current?.close()}>
              Sulje
            </button>
          </div>
        ) : (
          <form className="yi-lomake" onSubmit={laheta}>
            <fieldset className="yi-palvelut">
              <legend>Mitä osaat? Valitse yksi tai useampi</legend>
              {SKILLS.map((s) => (
                <label key={s} className={valitut.includes(s) ? "on" : undefined}>
                  <input type="checkbox" checked={valitut.includes(s)} onChange={() => vaihda(s)} />
                  {s}
                </label>
              ))}
            </fieldset>
            <div className="yi-rivi">
              <label>
                Nimi
                <input name="nimi" autoComplete="name" required />
              </label>
              <label>
                Sähköposti
                <input name="sahkoposti" type="email" autoComplete="email" required />
              </label>
            </div>
            <div className="yi-rivi">
              <label>
                Puhelin
                <input name="puhelin" type="tel" autoComplete="tel" />
              </label>
              <label>
                Paikkakunta
                <input name="paikkakunta" autoComplete="address-level2" />
              </label>
            </div>
            <label>
              Linkki työnäytteisiin
              <input name="nayte" placeholder="Portfolio, showreel, GitHub tai Instagram" />
            </label>
            <label>
              Kerro lyhyesti, mitä olet tehnyt ja mitä haluaisit tehdä
              <textarea name="viesti" rows={3} />
            </label>
            <Liite tiedostot={liitteet} muuta={setLiitteet} />
            {/* Roskapostiansa: ihminen ei nae eika tayta tata. */}
            <label className="vi-ansa" aria-hidden="true">
              Verkkosivu
              <input name="verkkosivu" tabIndex={-1} autoComplete="off" />
            </label>
            {virhe ? (
              <p className="vi-ilmoitus" role="alert">
                {virhe}
              </p>
            ) : null}
            <button className="btn" type="submit" disabled={lahettaa}>
              {lahettaa ? "Lähetetään…" : "Lähetä hakemus"}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
