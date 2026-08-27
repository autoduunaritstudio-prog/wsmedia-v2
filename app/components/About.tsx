/**
 * Lyhyt "Meistä" etusivulla, logonauhan ja Palvelut-avauksen valissa.
 *
 * Jakaa .shead:n visuaalisen kielen (kicker + h2 + lead-kappale, vasemmalle
 * tasattuna, ei korttia) mutta on oma .ablock-elementtinsa: .shead on
 * OSION otsikko ja sita seuraa aina osion sisalto, kun taas tama on
 * itsenainen sisaltolohko. Yhteiskaytto olisi sitonut kaksi eri
 * tarkoitusta samaan saantoon.
 *
 * Otsikko on tavallinen h2 eika h2.big: Palvelut-avaus heti alapuolella
 * kayttaa .big-kokoa, ja jos molemmat olisivat samankokoisia hierarkia
 * katoaisi ja kaksi isoa otsikkoa kilpailisi perakkain.
 */
export default function About() {
  return (
    <section className="about">
      <div className="wrap">
        <div className="ablock rv" data-par="0.03">
          <span className="kick">Meistä</span>
          <h2>Yksi tiimi, joka tekee kaiken.</h2>
          <p className="sub">
            WS Media on espoolainen kolmen hengen tiimi. Kuvaamme, suunnittelemme ja rakennamme —
            sinä et joudu sovittelemaan useamman toimijan aikatauluja tai selittämään samaa asiaa
            kahdesti.
          </p>
        </div>
      </div>
    </section>
  );
}
