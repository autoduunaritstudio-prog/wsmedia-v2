import SmartLink from "./SmartLink";

export type FooterColumn = {
  title: string;
  links: { href: string; label: string }[];
};

type Props = {
  intro: string;
  columns: FooterColumn[];
  base: string;
  /** Mockupit eroavat: etusivulla brandiotsikko on h4, alasivulla h2. */
  brandHeading?: "h2" | "h4";
};

export default function Footer({ intro, columns, base, brandHeading = "h4" }: Props) {
  const Brand = brandHeading;
  return (
    <footer>
      <div className="wrap">
        <div className="cols">
          <div style={{ maxWidth: "280px" }}>
            <Brand>WS Media</Brand>
            <p>{intro}</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              {col.links.map((l) => (
                <SmartLink href={l.href} key={l.label}>
                  {l.label}
                </SmartLink>
              ))}
            </div>
          ))}
        </div>
        <div className="base">{base}</div>
      </div>
    </footer>
  );
}
