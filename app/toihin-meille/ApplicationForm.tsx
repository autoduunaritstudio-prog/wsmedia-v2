"use client";

import { useState } from "react";

import { SKILLS, lahetaHakemus } from "./hakemus";
import Liite from "./Liite";

/**
 * Avoin hakemus (lomakekortti). Osio ympärillä on sections.tsx:n
 * Hakemus. Oma komponenttinsa eika BudgetForm, koska kenttajoukko on
 * kokonaan eri: ei budjettiliukusaadinta vaan osaamisalueiden monivalinta.
 *
 * Valinnat ovat Reactin tilassa. Lahetys menee /api/lomake-reitille
 * liitteineen (hakemus.ts).
 */


export default function ApplicationForm() {
  const [picked, setPicked] = useState<string[]>([]);

  const [lahetetty, setLahetetty] = useState(false);
  const [liitteet, setLiitteet] = useState<File[]>([]);
  const [lahettaa, setLahettaa] = useState(false);
  const [virhe, setVirhe] = useState<string | null>(null);

  const toggle = (s: string) =>
    setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const laheta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lahettaa) return;
    setLahettaa(true);
    setVirhe(null);
    const v = await lahetaHakemus(new FormData(e.currentTarget), picked, liitteet);
    setLahettaa(false);
    if (v) setVirhe(v);
    else setLahetetty(true);
  };

  return (
    <form className="card fcard rv" data-par="0.02" onSubmit={laheta}>
      <div className="fcard-paa">
        <b>Avoin hakemus</b>
        <span>
          <i aria-hidden="true" />
          Vastaamme viikon sisällä
        </span>
      </div>
      <div className="row2">
        <div>
          <label htmlFor="nimi">Nimi</label>
          <input type="text" id="nimi" name="nimi" autoComplete="name" required />
        </div>
        <div>
          <label htmlFor="mail">Sähköposti</label>
          <input type="email" id="mail" name="sahkoposti" autoComplete="email" required />
        </div>
        <div>
          <label htmlFor="puh">Puhelinnumero</label>
          <input type="tel" id="puh" name="puhelin" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="pk">Paikkakunta</label>
          <input type="text" id="pk" name="paikkakunta" autoComplete="address-level2" />
        </div>
      </div>

      <label id="roolilab">Mitä osaat? Valitse yksi tai useampi</label>
      <div className="rolepick" role="group" aria-labelledby="roolilab">
        {SKILLS.map((s) => (
          <label className="rp" key={s}>
            <input
              type="checkbox"
              value={s}
              checked={picked.includes(s)}
              onChange={() => toggle(s)}
            />
            {s}
          </label>
        ))}
      </div>

      <label htmlFor="port">Linkki työnäytteisiin</label>
      <input type="text" id="port" name="nayte" placeholder="Portfolio, showreel, GitHub tai Instagram" />
      <p className="hint">Ansioluetteloa ei tarvita. Yksi linkki riittää.</p>

      <div className="row2">
        <div>
          <label htmlFor="malli">Toimeksianto vai työsuhde?</label>
          <input type="text" id="malli" name="malli" placeholder="Kumpi kiinnostaa" />
        </div>
        <div>
          <label htmlFor="hinta">Tuntihinta tai palkkatoive</label>
          <input type="text" id="hinta" name="hinta" placeholder="€/h tai €/kk" />
        </div>
      </div>

      <label htmlFor="lisa">Kerro lyhyesti, mitä olet tehnyt ja mitä haluaisit tehdä</label>
      <textarea id="lisa" name="viesti" rows={4}></textarea>

      <Liite tiedostot={liitteet} muuta={setLiitteet} />

      {/* Roskapostiansa: ihminen ei nae eika tayta tata. */}
      <label className="vi-ansa" aria-hidden="true">
        Verkkosivu
        <input name="verkkosivu" tabIndex={-1} autoComplete="off" />
      </label>
      <button className="btn" type="submit" disabled={lahettaa || lahetetty}>
        {lahettaa ? "Lähetetään…" : "Lähetä hakemus"}
      </button>
      <p className="fnote" role={virhe ? "alert" : lahetetty ? "status" : undefined}>
        {virhe
          ? virhe
          : lahetetty
            ? "Kiitos, hakemus on perillä. Luemme sen ja vastaamme viikon sisällä."
            : "Käsittelemme hakemukset luottamuksellisesti."}
      </p>
    </form>
  );
}
