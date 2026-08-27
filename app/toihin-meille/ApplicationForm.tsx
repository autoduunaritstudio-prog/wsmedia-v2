"use client";

import { useState } from "react";

/**
 * Avoin hakemus. Oma komponenttinsa eika BudgetForm, koska kenttajoukko on
 * kokonaan eri: ei budjettiliukusaadinta vaan osaamisalueiden monivalinta.
 *
 * Valinnat ovat Reactin tilassa, jolloin DOMia ei lueta erikseen kun lomake
 * joskus kytketaan lahetykseen. Painike on toistaiseksi type="button" ilman
 * lahetystoiminnallisuutta, kuten sivuston muissakin lomakkeissa.
 */

const SKILLS = [
  "Videokuvaus",
  "Editointi",
  "Motion graphics",
  "Verkkokehitys",
  "Hakukoneoptimointi",
  "Sisällöntuotanto",
  "Graafinen suunnittelu",
  "Teippaus tai asennus",
];

export default function ApplicationForm() {
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (s: string) =>
    setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  return (
    <section id="hakemus" style={{ paddingTop: 20 }}>
      <div className="wrap-n">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Avoin hakemus</span>
          <h2>Kerro mitä osaat</h2>
          <p className="sub">Hakemus vie viisi minuuttia. Luemme jokaisen ja vastaamme viikon sisällä myös silloin, kun vastaus on ei.</p>
        </div>
        <div className="card fcard rv" data-par="0.02">
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
          <input type="text" id="port" placeholder="Portfolio, showreel, GitHub tai Instagram" />
          <p className="hint">Ansioluetteloa ei tarvita. Yksi linkki riittää.</p>

          <div className="row2">
            <div>
              <label htmlFor="malli">Toimeksianto vai työsuhde?</label>
              <input type="text" id="malli" placeholder="Kumpi kiinnostaa" />
            </div>
            <div>
              <label htmlFor="hinta">Tuntihinta tai palkkatoive</label>
              <input type="text" id="hinta" placeholder="€/h tai €/kk" />
            </div>
          </div>

          <label htmlFor="lisa">Kerro lyhyesti mitä olet tehnyt ja mitä haluaisit tehdä</label>
          <textarea id="lisa" rows={4}></textarea>

          <button className="btn" type="button">Lähetä hakemus</button>
          <p className="fnote">Vastaamme viikon sisällä. Käsittelemme hakemukset luottamuksellisesti.</p>
        </div>
      </div>
    </section>
  );
}
