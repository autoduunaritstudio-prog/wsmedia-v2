import type { ReactNode } from "react";
import { Kaiku } from "./Maasto";

/**
 * KENELLE-OSIO, SAMA KAIKILLA PALVELUSIVUILLA (4.10.2026).
 *
 * Neljalla palvelusivulla oli sama osio nelja eri tavalla: kaksi
 * avointa listaa, viivoitettu taulukko, ruksi- ja rastikortit seka
 * erilaiset tai puuttuvat kehotukset. Nyt yksi komponentti: kaksi
 * korttia (sopii / ei kannata), jokaisessa kohdassa merkki ja tarvittaessa
 * lyhyt perustelu, ja osion lopussa sama kehotusrivi. Vain otsikko ja
 * kohdat vaihtuvat sivun aiheen mukaan.
 */
export type KenelleRivi = { t: string; s?: string };

export default function SopiiKenelle({
  otsikko,
  sopii,
  ei,
  epavarma,
}: {
  otsikko: ReactNode;
  sopii: KenelleRivi[];
  ei: KenelleRivi[];
  /** Kehotusrivin loppu: "jos lyhytvideot eivat ole sinulle oikea ratkaisu". */
  epavarma: string;
}) {
  return (
    <section className="seo-sec kenelle-osio" id="kenelle">
      <Kaiku sana="KENELLE" puoli="vas" />
      <div className="swrap">
        <h2 className="seo-h2 rv">{otsikko}</h2>
        <p className="seo-lead rv">
          Jos tilanteesi kuuluu oikeanpuoleiseen ryhmään, sanomme sen suoraan jo kartoituksessa. Se
          säästää molempien aikaa ja rahaa.
        </p>

        <div className="kk">
          <div className="kk-kortti kk-sopii rv">
            <h3>Sopii sinulle, jos</h3>
            <ul>
              {sopii.map((r) => (
                <li key={r.t}>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                  </svg>
                  <span>
                    {r.t}
                    {r.s ? <small>{r.s}</small> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="kk-kortti kk-ei rv">
            <h3>Ei kannata, jos</h3>
            <ul>
              {ei.map((r) => (
                <li key={r.t}>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6 6l8 8M14 6l-8 8" />
                  </svg>
                  <span>
                    {r.t}
                    {r.s ? <small>{r.s}</small> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="kk-cta rv">
          <p>
            <b>Etkö ole varma, kumpaan ryhmään kuulut?</b>
            <span>Kysy meiltä. Vastaamme suoraan myös silloin, {epavarma}.</span>
          </p>
          <div className="kk-napit">
            <button type="button" className="btn" data-varaus="">
              Varaa maksuton kartoitus
            </button>
            <button type="button" className="kk-viesti" data-yhteys="">
              Kysy viestillä
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
