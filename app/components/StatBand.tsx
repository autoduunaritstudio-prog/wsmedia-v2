import type { CSSProperties } from "react";

const STATS = [
  { value: "00", label: "toteutettua projektia" },
  { value: "0 000 000+", label: "katselukertaa yhteensä" },
  { value: "00", label: "arkipäivää keskim. toimitusaika" },
  { value: "4,9/5", label: "keskiarvosana asiakkailta" },
];

export default function StatBand() {
  return (
    <section style={{ padding: "70px 0 20px" }}>
      <div className="wrap">
        <div className="statband stagger">
          {STATS.map((s, i) => (
            <div className="stat rv" style={{ "--i": i } as CSSProperties} key={s.label}>
              <div className="num" data-count={s.value}>
                {s.value}
              </div>
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
