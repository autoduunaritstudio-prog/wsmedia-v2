import SmartLink from "../components/SmartLink";
import { FAQ } from "./faq-data";
import { Kaiku } from "../components/Maasto";

/* ==================================================================
   UKK  ·  natiivi eksklusiivinen haitari
   ==================================================================
   Sama rakenne kuin kolmella muulla palvelusivulla: otsikko ja
   kysymysten maara vasemmalla pinnattuna, lista oikealla.
   Ryhmaotsikot jaivat pois, koska ne katkoivat listan kolmeen
   palaan ja haitari on jo itsessaan ryhmitelty: kysymykset ovat
   samassa jarjestyksessa kuin ryhmissa.

   name-attribuutti tekee haitarista eksklusiivisen ilman JS:aa: kun
   kaikilla details-elementeilla on sama name, selain sulkee
   edellisen kun seuraava avataan. */
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
            <h2 className="seo-h2 rv">Usein kysytyt kysymykset graafisesta suunnittelusta</h2>
            <p className="seo-body" style={{ marginTop: "22px" }}>
              Hinta, aikataulu, tiedostot ja se mitä työhön oikeasti sisältyy.
            </p>
            <p className="qa2-ask">
              <span>Etkö löytänyt vastausta?</span>
              <a href="#tarjous">Kysy suoraan, vastaamme 24 tunnissa</a>
            </p>
          </div>
          <div className="qa2-list porras rv">
            {FAQ.map((f, n) => (
              <details key={f.q} name="ukk-graafinen" open={n === 0}>
                <summary>{f.q}</summary>
                <div className="a">
                  {f.a}
                  {f.linkit ? (
                    <>
                      {" "}
                      {f.linkit.map((l, i) => (
                        <span key={l.href}>
                          {i > 0 ? " · " : null}
                          <SmartLink href={l.href}>{l.label}</SmartLink>
                        </span>
                      ))}
                    </>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
