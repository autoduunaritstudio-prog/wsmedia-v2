import type { CSSProperties } from "react";

type Plan = {
  tag: string;
  name: string;
  forWhom: string;
  features: string[];
  pop?: boolean;
  par: string;
};

const PLANS: Plan[] = [
  {
    tag: "",
    name: "[Paketti 1]",
    forWhom: "Yrityksille, jotka aloittavat some‑videotuotannon.",
    features: [
      "[X] editoitua videota kuukaudessa",
      "Editointi ja tekstitys",
      "Strategiapalaveri ennen aloitusta",
      "Toimitus [X] arkipäivässä",
    ],
    par: "0.015",
  },
  {
    tag: "Suosituin",
    name: "[Paketti 2]",
    forWhom: "Yrityksille, jotka haluavat nopeaa näkyvyyttä.",
    features: [
      "[X] editoitua videota kuukaudessa",
      "Editointi ja tekstitys",
      "Esiintyjä mukana",
      "Strategiapalaveri ja kuukausiraportti",
    ],
    pop: true,
    par: "0.035",
  },
  {
    tag: "",
    name: "[Paketti 3]",
    forWhom: "Yrityksille, jotka haluavat koko näkyvyyden kerralla.",
    features: [
      "[X] videota kuukaudessa",
      "TikTok, Reels ja Shorts",
      "Verkkosivut tai tapahtuma sovitusti",
      "Kuukausittainen strategiapalaveri",
    ],
    par: "0.015",
  },
];

export default function Pricing() {
  return (
    <section id="paketit">
      <div className="wrap">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Hinnoittelu</span>
          <h2>Valitse kokonaisuus.</h2>
        </div>
        <div className="plans stagger">
          {PLANS.map((p, i) => (
            <div
              className={`card plan${p.pop ? " pop" : ""} rv tilt`}
              style={{ "--i": i } as CSSProperties}
              data-par={p.par}
              key={p.name}
            >
              <span className="pt">{p.tag}</span>
              <h3>{p.name}</h3>
              <p className="for">{p.forWhom}</p>
              <div className="price">
                [Hinta] <small>€/kk</small>
              </div>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a className={p.pop ? "btn" : "btn alt"} href="#lomake">
                Pyydä suunnitelma
              </a>
            </div>
          ))}
        </div>
        <p className="pricenote rv">
          Kaikissa paketeissa: ei sitoutumispakkoa, irtisanominen kuukausi kerrallaan. Verkkosivut ja
          tapahtumat hinnoitellaan projekteina.
        </p>
      </div>
    </section>
  );
}
