import type { CSSProperties } from "react";

export type Stat = { value: string; label: string };

type Props = {
  stats: Stat[];
  /** data-count kaynnistaa SiteEffectsin numerorullauksen. */
  animate?: boolean;
};

export default function StatBand({ stats, animate = true }: Props) {
  return (
    <div className="statband stagger">
      {stats.map((s, i) => (
        <div className="stat rv" style={{ "--i": i } as CSSProperties} key={s.label}>
          <div className="num" data-count={animate ? s.value : undefined}>
            {s.value}
          </div>
          <p>{s.label}</p>
        </div>
      ))}
    </div>
  );
}
