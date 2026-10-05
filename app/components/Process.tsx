import type { CSSProperties } from "react";

import type { ReactNode } from "react";

import CallButton from "./CallButton";
import { Kaiku } from "./Maasto";

/* Vaiheiden viivamerkit, sama viivakieli kuin palvelumerkeissa. */
const IKONIT: ReactNode[] = [
  <path key="v" d="M4 5.5h16v10.5H10l-5 4v-4H4z M8 9.5h8 M8 12.5h5" />,
  <path key="k" d="M4 6h16v14H4z M4 10.5h16 M8.5 3.5v5 M15.5 3.5v5 M8 14h3 M13 14h3 M8 17h3" />,
  <path key="o" d="M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17z M8 12.2l2.8 2.8 5.2-6" />,
];

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
        <h2 className="etu-h2 rv">Näin helppoa se on.</h2>
        {/* VAIHEKORTIT (5.10.2026): iso aariviivanumero kuten
            pystykaiuissa, viivamerkki ja vaiheiden valilla nuoli.
            Numero on tietoa, koska vaiheet ovat jarjestys. */}
        <ol className="etu-vaiheet">
          {STEPS.map((s, i) => (
            <li className="etu-vaihe rv" style={{ "--i": i } as CSSProperties} key={s.title}>
              <span className="etu-vaihe-nro" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <svg className="etu-vaihe-ikoni" viewBox="0 0 24 24" aria-hidden="true">
                {IKONIT[i]}
              </svg>
              <p className="etu-jakso-kk">{s.kk}</p>
              <h3>{s.title}</h3>
              <p className="etu-jakso-p">{s.text}</p>
            </li>
          ))}
        </ol>

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
