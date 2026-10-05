import type { CSSProperties } from "react";

import CallButton from "./CallButton";
import { Kaiku } from "./Maasto";

const STEPS = [
  {
    kk: "Vastaus 24 tunnissa",
    title: "Täytä lomake tai soita",
    text: "Kerromme mikä kokonaisuus sopii yrityksesi tavoitteisiin.",
    par: "0.015",
  },
  {
    kk: "Palaveri ja aikataulu",
    title: "Sovitaan toteutus",
    text: "Strategiapalaveri ja aikataulu. Kuvaukset sinun tiloissasi, sivustot ja ilmetyöt sovitusti.",
    par: "0.035",
  },
  {
    kk: "Toimitus",
    title: "Valmis kokonaisuus",
    text: "Julkaisuvalmiit videot, käyttövalmis sivusto tai valmis yritysilme. Sinä hyväksyt jokaisen vaiheen.",
    par: "0.015",
  },
];

export default function Process() {
  return (
    <section id="prosessi">
      <Kaiku sana="PROSESSI" puoli="oik" luokka="etu" />
      <div className="wrap">
        {/* Sama rakenne kuin palvelusivujen prosessissa (5.10.2026):
            ylarivi, iso otsikko vasemmalla ja aikajana solmuineen. */}
        <div className="etu-ord rv">
          <span>Prosessi</span>
          <i>Yhteydenotosta valmiiseen</i>
        </div>
        <h2 className="etu-h2 rv">Näin helppoa se on.</h2>
        <div className="etu-jana" data-rvs="">
          <div className="etu-jana-akseli" aria-hidden="true" />
          <ol className="etu-jaksot">
            {STEPS.map((s, i) => (
              <li className="etu-jakso" style={{ "--i": i } as CSSProperties} key={s.title}>
                <p className="etu-jakso-kk">{s.kk}</p>
                <h3>{s.title}</h3>
                <p className="etu-jakso-p">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Ensimmainen askel on "Tayta lomake tai soita", joten molemmat
            polut kuuluvat myos napeiksi. Soita-nappi paljastaa numeron
            ensimmaisella painalluksella ja soittaa vasta toisella;
            perustelu on CallButtonissa. */}
        <div className="proc-cta" data-rvs="">
          <button type="button" className="btn mag" data-yhteys="">
            Lähetä viesti
          </button>
          <CallButton />
        </div>
      </div>
    </section>
  );
}
