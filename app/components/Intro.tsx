/**
 * Lyhyt esittely etusivulla, logonauhan ja Palvelut-avauksen valissa.
 * Teksti ja tayslevea tiimikuvan paikkamerkki ovat samassa osiossa ja
 * tiiviimmalla valilla (56px) kuin osiovali (100px), jotta ne lukeutuvat
 * yhdeksi kokonaisuudeksi eivatka kahdeksi erilliseksi osioksi.
 *
 * Otsikko on tavallinen h2 eika h2.big: Palvelut-avaus alempana kayttaa
 * .big-kokoa, ja kaksi samankokoista otsikkoa hukuttaisi hierarkian.
 */
export default function Intro() {
  return (
    <section className="intro">
      <div className="wrap">
        <div className="introtxt rv" data-par="0.03">
          <h2>Kolme tekijää. Ei välikäsiä.</h2>
          <p className="sub">
            WS Media on espoolainen tiimi, joka hoitaa videot, verkkosivut ja tapahtumat saman
            katon alta. Kuvaamme, koodaamme ja tuotamme itse — sinä saat yhden yhteyshenkilön ja
            yhden laskun.
          </p>
        </div>
        {/* TODO: korvaa oikealla tiimikuvalla kun saatavilla.
            Vaihda tama lohko <Image />:ksi ja poista .teamphoto-wide /
            .teamphoto-mark globals.css:sta. */}
        <div className="teamphoto-wide rv" aria-hidden="true">
          <span className="teamphoto-mark">Tiimikuva tulossa</span>
        </div>
      </div>
    </section>
  );
}
