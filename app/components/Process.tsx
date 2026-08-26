import type { CSSProperties } from "react";

const STEPS = [
  {
    title: "Täytä lomake tai soita",
    text: "Kerromme mikä kokonaisuus sopii yrityksesi tavoitteisiin.",
    par: "0.015",
  },
  {
    title: "Sovitaan toteutus",
    text: "Strategiapalaveri ja aikataulu. Kuvaukset sinun tiloissasi, sivustot ja tapahtumat sovitusti.",
    par: "0.035",
  },
  {
    title: "Valmis kokonaisuus",
    text: "Julkaisuvalmiit videot, käyttövalmis sivusto tai toteutettu tapahtuma. Sinä hyväksyt jokaisen vaiheen.",
    par: "0.015",
  },
];

export default function Process() {
  return (
    <section id="prosessi">
      <div className="wrap">
        <div className="shead rv" data-par="0.03">
          <span className="kick">Prosessi</span>
          <h2>Näin helppoa se on.</h2>
        </div>
        <div className="steps stagger">
          {STEPS.map((s, i) => (
            <div
              className="card step rv tilt"
              style={{ "--i": i } as CSSProperties}
              data-par={s.par}
              key={s.title}
            >
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
