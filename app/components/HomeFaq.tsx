import { HOME_FAQ } from "../faq-data";
import { Kaiku } from "./Maasto";

/**
 * Etusivun UKK samalla rakenteella kuin palvelusivujen .qa2 (5.10.2026):
 * ylarivi (otsikko + kysymysten maara), vasemmalla pinnattu otsikko,
 * johdanto ja "Kysy suoraan", oikealla haitarilista jossa yksi kerrallaan
 * auki. Palvelusivujen .wsx-saannot eivat lataudu etusivulle (perus.css-
 * budjetti), joten tyylit ovat omat .etu-ukk-saannot globals.css:ssa.
 */
export default function HomeFaq() {
  return (
    <section id="ukk" className="etu-ukk">
      <Kaiku sana="UKK" puoli="vas" luokka="etu" />
      <div className="wrap">
        <div className="etu-ukk-ord rv">
          <span>Usein kysyttyä</span>
          <i>{HOME_FAQ.length} kysymystä</i>
        </div>
        <div className="etu-ukk-grid">
          <div className="etu-ukk-side">
            <h2 className="rv">Usein kysytyt kysymykset</h2>
            <p className="rv">
              Hinnat, tulosten aikataulu, aineistojen omistus ja sitoutuminen. Nämä kysytään
              useimmin ensimmäisessä puhelussa.
            </p>
            <div className="etu-ukk-ask">
              <span>Etkö löytänyt vastausta?</span>
              <button type="button" data-yhteys="">
                Kysy suoraan, vastaamme 24 tunnissa
              </button>
            </div>
          </div>
          <div className="etu-ukk-list rv">
            {HOME_FAQ.map((it, n) => (
              <details key={it.q} name="ukk-etusivu" open={n === 0}>
                <summary>{it.q}</summary>
                <div className="a">{it.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
