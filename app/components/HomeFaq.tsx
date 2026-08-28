import { HOME_FAQ } from "../faq-data";

/**
 * Etusivun UKK. Kayttaa samaa .faq-haitaritylia kuin alasivut (details/
 * summary + .a), ei omaa tyylia. Yksi sarake eika alasivujen .faq2-
 * kaksisaraketta: kysymyksia on vain kahdeksan, jolloin kaksi saraketta
 * jaisi vajaaksi.
 */
export default function HomeFaq() {
  return (
    <section id="ukk">
      <div className="wrap">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Usein kysyttyä</span>
          <h2>Usein kysytyt kysymykset</h2>
        </div>
        <div className="faq rv">
          {HOME_FAQ.map((it) => (
            <details key={it.q}>
              <summary>{it.q}</summary>
              <div className="a">{it.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
