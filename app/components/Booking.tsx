/**
 * Ilmainen kartoitus + kalenterivarauksen mockup.
 *
 * TAVALLINEN SISALTOOSIO, EI STICKY EIKA COVER. Sijaitsee Palvelut-osion
 * ja .refzone-parin valissa .coverin sisalla, jolloin se kayttaytyy tasan
 * kuten Palvelut-paneelit: normaali dokumenttivirtaus, ei omaa
 * pinoamiskontekstia, ei sijoittelua joka voisi koskea neljaan
 * sticky-tasoon. Ainoa vaikutus on etta .cover kasvaa - ja se on
 * turvallinen suunta, koska ehto on "cover >= heron korkuinen".
 *
 * Rakenne on .svc rev eli sama ruudukko kuin palvelupaneeleilla: teksti
 * vasemmalla, mockup oikealla. Palvelut paattyy paneeliin jonka visuaali
 * on vasemmalla (normal/rev/normal), joten rev jatkaa vuorottelua.
 *
 * Kalenteri (BookingCal) on toimiva: paivan ja ajan valinta avaa
 * varausikkunan valmiiksi taytettyna (5.10.2026).
 */
import BookingCal from "./BookingCal";
import { Kaiku } from "./Maasto";


export default function Booking() {
  /* UUSI ILME 5.10.2026: koko kartoitus on yksi tumma paneeli kuten
     Referenssit ja tarjouslomake. Otsikko (ennen oma .kartlead-osionsa)
     on paneelin sisalla, kalenteri on tummaa lasia sen oikealla puolella. */
  return (
    <section className="kart" id="kartoitus">
      <Kaiku sana="KARTOITUS" puoli="oik" luokka="etu" />
      <div className="wrap">
        <div className="kart-paneeli rv">
          <div className="kart-teksti">
            <p className="kart-kick">Ilmainen kartoitus</p>
            <h2>
              Katsotaan mitä sinun yrityksellesi <span>kannattaa tehdä.</span>
            </h2>
            <p className="kart-p">
              Varaa aika suoraan kalenterista. Käymme läpi yrityksesi tarpeet ja kerromme
              rehellisesti, voimmeko auttaa. Ilman myyntipuhetta.
            </p>
            <ul className="kart-faktat">
              <li>30 minuuttia</li>
              <li>Maksuton</li>
              <li>Ei sitoumuksia</li>
            </ul>
            <button type="button" className="btn" data-varaus="">
              Varaa aika
            </button>
          </div>
          <div className="kart-kalenteri">
            <BookingCal />
          </div>
        </div>
      </div>
    </section>
  );
}
