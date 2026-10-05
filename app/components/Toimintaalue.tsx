/**
 * TOIMINTA-ALUE (3.10.2026). Sama osio kaikilla palvelusivuilla: otsikko
 * vasemmalla, oikealla rivit, joissa iso paikka ja mita siella tapahtuu.
 * Tyylit globals.css:ssa (.wsx .alue-*).
 */
export default function Toimintaalue({
  otsikko,
  rivit,
}: {
  otsikko: string;
  rivit: [string, string][];
}) {
  return (
    <section className="seo-sec alue-sec" id="alueet">
      <div className="swrap">
        <div className="alue-pohja">
          <h2 className="seo-h2 rv">{otsikko}</h2>
          <ul className="alue-rivit">
            {rivit.map(([paikka, teksti]) => (
              <li key={paikka} className="rv">
                <span className="alue-paikka">{paikka}</span>
                <p>{teksti}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
