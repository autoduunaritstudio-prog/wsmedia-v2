import type { CSSProperties } from "react";

const CASES = [
  {
    count: "000 000",
    title: "Asiakas ja toimiala",
    text: "katselukertaa orgaanisesti, ilman maksettua mainontaa",
    points:
      "0,52 22,46 44,49 66,34 88,38 110,24 132,29 154,16 176,20 198,9 220,12",
    par: "0.015",
    fill: "Täytetään · Case 1",
  },
  {
    count: "00 000",
    title: "Asiakas ja toimiala",
    text: "tulos numeroina ja asiakkaan sitaatti",
    points:
      "0,50 22,51 44,44 66,45 88,32 110,36 132,22 154,26 176,14 198,17 220,6",
    par: "0.035",
    fill: "Täytetään · Case 2",
  },
  {
    count: "+00 %",
    title: "Asiakas ja toimiala",
    text: "seuraajakasvu tai liidit ensimmäisen kuukauden jälkeen",
    points:
      "0,54 22,50 44,52 66,42 88,44 110,30 132,33 154,18 176,22 198,10 220,8",
    par: "0.015",
    fill: "Täytetään · Case 3",
  },
];

/** Sparkline-täytön alue: viivan pisteet plus sulkeva pohja. */
const areaPoints = (points: string) => `${points} 220,60 0,60`;

export default function Results() {
  return (
    <section id="tulokset" style={{ paddingTop: "110px" }}>
      <div className="wrap">
        <div className="shead right rv" data-par="0.03">
          <span className="kick">Referenssit</span>
          <h2>Tulokset, joilla on väliä.</h2>
          <p className="sub">Kolme casea täytetään oikeilla luvuilla ennen julkaisua.</p>
        </div>

        {/* Gradientti määritellään kerran, kaikki sparklinet viittaavat siihen. */}
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0064cc" stopOpacity=".18" />
              <stop offset="100%" stopColor="#0064cc" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="cases stagger">
          {CASES.map((c, i) => (
            <div
              className="card case rv tilt"
              style={{ "--i": i } as CSSProperties}
              data-par={c.par}
              key={c.fill}
            >
              <div className="num" data-count={c.count}>
                {c.count}
              </div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <svg className="spark" viewBox="0 0 220 60" preserveAspectRatio="none">
                <polygon className="fillp" points={areaPoints(c.points)} />
                <polyline points={c.points} />
              </svg>
              <span className="fill">{c.fill}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
