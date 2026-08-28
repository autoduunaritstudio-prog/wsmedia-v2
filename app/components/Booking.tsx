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
 * Kalenteri on puhdasta CSS-ruudukkoa kuten selainmockup ja
 * hintakonfiguraattori - ei kuvatiedostoa. Paivat ja kellonajat ovat
 * havainnollistavia: kuukautta tai paivamaaraa ei nimeta, jottei mockup
 * nayta tarjoavan oikeaa varattavaa aikaa.
 */
const DAYS = Array.from({ length: 28 }, (_, i) => i + 1);
/** Vapaat paivat mockupissa. */
const FREE = new Set([4, 5, 11, 12, 18, 19, 25, 26]);
const SELECTED = 12;

export default function Booking() {
  return (
    <section className="kart" id="kartoitus">
      <div className="wrap">
        <div className="svc rev rv">
          <div className="svc-visual" data-par="0.02">
            <div className="cal" data-tilt="y" data-tilt-profile="mockup">
              <div className="cal-head">
                <b>Valitse sopiva aika</b>
                <span className="cal-len">30 min</span>
              </div>
              <div className="cal-grid" aria-hidden="true">
                {["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"].map((d) => (
                  <span className="cal-wd" key={d}>
                    {d}
                  </span>
                ))}
                {DAYS.map((d) => (
                  <span
                    className={`cal-day${FREE.has(d) ? " free" : ""}${d === SELECTED ? " sel" : ""}`}
                    key={d}
                  >
                    {d}
                  </span>
                ))}
              </div>
              <div className="cal-slots" aria-hidden="true">
                <span className="cal-slot">9.00</span>
                <span className="cal-slot on">10.30</span>
                <span className="cal-slot">13.00</span>
              </div>
            </div>
          </div>
          <div className="svc-txt" data-par="0.035">
            <span className="kick">Ilmainen kartoitus</span>
            <h3>30 minuuttia. Ei sitoumuksia.</h3>
            <p>
              Varaa aika suoraan kalenteristamme. Käymme läpi yrityksesi tarpeet ja kerromme
              rehellisesti voimmeko auttaa — ilman myyntipuhetta.
            </p>
            {/* TODO: kytke kalenteripalveluun kun se on valittu.
                Vaihtoehdot: Cal.com (avoin lahdekoodi, itse isannoitava) tai
                Calendly. Kun paatos on tehty, tasta tulee joko
                <a className="btn" href="https://cal.com/wsmedia/30min"> tai
                upotettu widget; jalkimmaisessa tapauksessa lisaa skripti
                vasta klikkauksesta, jottei se lataudu jokaisella
                sivulatauksella. Nyt tama on tarkoituksella toimimaton
                type="button" ilman kasittelijaa. */}
            <button type="button" className="btn">
              Varaa aika
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
