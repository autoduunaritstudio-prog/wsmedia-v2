import { Kaiku } from "../components/Maasto";
import { FAQ } from "./faq-data";

/* UKK samassa muodossa kuin palvelusivuilla (.qa2). */
export function Ukk() {
  return (
    <section className="seo-sec" id="ukk">
      <Kaiku sana="FAQ" puoli="oik" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Usein kysyttyä</span>
          <i>{FAQ.length} kysymystä</i>
        </div>
        <div className="qa2">
          <div className="qa2-side">
            <h2 className="seo-h2 rv">Usein kysytyt kysymykset työstä WS Medialla</h2>
            <p className="seo-body" style={{ marginTop: "22px" }}>
              Haku, laskutus, työnteon paikka ja se, mitä meiltä voi odottaa.
            </p>
            <p className="qa2-ask">
              <span>Etkö löytänyt vastausta?</span>
              <a href="#hakemus">Kysy suoraan, vastaamme viikon sisällä</a>
            </p>
          </div>
          <div className="qa2-list porras rv">
            {FAQ.map((f, n) => (
              <details key={f.q} name="ukk-toihin" open={n === 0}>
                <summary>{f.q}</summary>
                <div className="a">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
