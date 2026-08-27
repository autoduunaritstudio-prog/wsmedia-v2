import type { CSSProperties } from "react";

export function Kenelle() {
  return (
      <section id="kenelle" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="hsplit rv">
            <div>
              <span className="kick">Kenelle</span>
              <h2>Kenelle tämä sopii — ja kenelle ei</h2>
            </div>
            <p className="sub">Sanomme sen kartoituksessa suoraan, jos tilanteesi on oikean palstan kaltainen.</p>
          </div>
          <div className="twopanel stagger">
            <div className="pan yes rv" style={{ "--i": 0 } as CSSProperties}>
              <h3>Sopii sinulle, jos</h3>
              <ul>
                <li>Ilmettä tarvitaan useaan paikkaan: autoon, toimitilaan ja painotuotteisiin</li>
                <li>Yrityksellä on kalustoa, jonka pitäisi näyttää samalta ensimmäisestä autosta viimeiseen</li>
                <li>Nykyinen logo on epäselvä, vanhentunut tai olemassa vain kuvatiedostona</li>
                <li>Et halua kilpailuttaa kolmea toimittajaa ja sovitella niiden aikatauluja</li>
                <li>Haluat että verkkosivut, some ja fyysiset pinnat näyttävät samalta yritykseltä</li>
              </ul>
            </div>
            <div className="pan dark rv" style={{ "--i": 1 } as CSSProperties}>
              <h3>Ei kannata, jos</h3>
              <ul>
                <li>Tarvitset vain yhden auton logoteippauksen ja sinulla on jo vektoroitu logo — silloin teippaamo on nopeampi ja edullisempi</li>
                <li>Etsit halvinta mahdollista hintaa etkä välitä kestoiästä</li>
                <li>Yrityksen nimi tai toimiala on vielä auki</li>
                <li>Haluat vain painovalmiin tiedoston ja hoidat tuotannon itse — teemme sitäkin, mutta silloin et hyödy kokonaisuudesta</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
  );
}

export function Alueet() {
  return (
      <section id="alueet" style={{ paddingTop: 20 }}>
        <div className="wrap-n">
          <div className="shead center rv" data-par="0.03">
            <span className="kick">Toiminta-alue</span>
            <h2>Suunnittelu etänä, asennus lähellä sinua</h2>
            <p className="sub">Suunnittelu ja hyväksynnät hoituvat verkossa mistä päin Suomea tahansa. Asennus tehdään sinun paikkakunnallasi: valitsemme asentajan sieltä, missä ajoneuvot ja toimitilat ovat.</p>
          </div>
          <p className="lead rv" style={{ textAlign: "center", margin: "0 auto" }}>Kotipaikkamme on <strong>Espoo</strong>, mutta teippaus ja asennus eivät edellytä sitä että olisimme samassa kaupungissa. Painotuotteet toimitetaan suoraan osoitteeseesi.</p>
          <div className="cities rv" style={{ justifyContent: "center" }}>
            <a href="/graafinen-suunnittelu/espoo">Graafinen suunnittelu Espoo</a>
            <a href="/graafinen-suunnittelu/helsinki">Helsinki</a>
            <a href="/graafinen-suunnittelu/vantaa">Vantaa</a>
            <a href="/graafinen-suunnittelu/tampere">Tampere</a>
            <a href="/graafinen-suunnittelu/turku">Turku</a>
            <a href="/graafinen-suunnittelu/oulu">Oulu</a>
            <a href="/graafinen-suunnittelu/lahti">Lahti</a>
            <a href="/graafinen-suunnittelu/kuopio">Kuopio</a>
            <a href="/graafinen-suunnittelu/pori">Pori</a>
            <a href="/graafinen-suunnittelu/joensuu">Joensuu</a>
          </div>
        </div>
      </section>
  );
}

export function Kaytannossa() {
  return (
      <section id="kaytannossa" style={{ paddingTop: 20 }}>
        <div className="wrap-n">
          <div className="shead center rv" data-par="0.03">
            <span className="kick">Taustaa</span>
            <h2>Graafinen suunnittelu käytännössä</h2>
          </div>
          <div className="prose rv">
            <h3>Miksi yhtenäinen ilme kannattaa</h3>
            <p>Yrityksen ilme ei ole logo vaan se kokonaisuus, jonka asiakas kohtaa: verkkosivu, käyntikortti, pakettiauton kylki, toimitilan ikkuna ja somekanavan profiilikuva. Kun ne näyttävät samalta, jokainen kohtaaminen vahvistaa edellistä. Kun ne näyttävät eriltä, jokainen kohtaaminen alkaa alusta.</p>
            <p>Käytännön ero on tunnistettavuudessa. Sama auto ohittaa saman ihmisen samalla työmatkalla kymmeniä kertoja kuukaudessa, mutta vain jos hän tunnistaa sen samaksi yritykseksi joka näkyi hakutuloksissa. <strong>Yhtenäisyys on halvin tapa moninkertaistaa jo tehdyn markkinoinnin vaikutus.</strong></p>

            <h3>Mistä graafisen suunnittelun hinta muodostuu</h3>
            <p>Hinta on työtunteja. Suomessa kokeneen suunnittelijan tuntihinta asettuu tyypillisesti 70–120 euroon, joten hinta kertoo suoraan sen, kuinka paljon työtä kohteeseen käytetään. Suurimmat yksittäiset tekijät ovat <strong>laajuus</strong> eli montako pintaa ja versiota tarvitaan, <strong>muutoskierrosten määrä</strong> ja <strong>käyttöoikeuksien laajuus</strong>.</p>
            <p>Teippausten ja painotuotteiden kohdalla mukaan tulee vielä materiaali ja työ. Siksi kahden tarjouksen vertailu pelkän loppusumman perusteella on harhaanjohtavaa: halvempi tarjous voi sisältää lyhytikäisen kalvon, ulkoasennuksen ja oletuksen siitä että toimitat itse painovalmiin tiedoston.</p>

            <h3>Ajoneuvo on mediatila, joka on jo maksettu</h3>
            <p>Pakettiauto ajaa joka tapauksessa. Teippaus muuttaa sen mainospinnaksi, joka näkyy joka ajokilometrillä ilman erillistä mediabudjettia — eikä sitä voi kytkeä pois päältä. Kustannus jakautuu koko kalvon elinkaarelle, joka on ammattitason materiaalilla kolmesta seitsemään vuotta.</p>
            <p>Tämä on myös syy siihen, miksi materiaalivalinnasta kannattaa kysyä. Kolme vuotta kestävä ja seitsemän vuotta kestävä teippaus maksavat asennettuna lähes saman verran, mutta jälkimmäinen jakaa kustannuksen kaksinkertaiselle ajalle.</p>

            <h3>Suunnittelun ja tuotannon ero</h3>
            <p>Suunnittelu ratkaisee miltä lopputulos näyttää. Tuotanto ratkaisee kuinka kauan se kestää. Nämä ovat eri ammatteja, ja siksi ne kannattaa ostaa eri tekijöiltä — mutta niiden yhteensovittaminen ei kuulu asiakkaalle.</p>
            <p>Me suunnittelemme ja hoidamme tuotannon alihankintana. Käytännössä se tarkoittaa, että sinä hyväksyt luonnoksen ja saat valmiin lopputuloksen. Kaikki siltä väliltä — tiedostomuodot, mitat, materiaalivalinta, aikataulut ja laadun tarkistus — on meidän työtämme. Sama logiikka toimii myös <a href="/verkkosivut">verkkosivuissa</a> ja <a href="/lyhytvideot">lyhytvideoissa</a>.</p>
          </div>
        </div>
      </section>
  );
}

export function Blogi() {
  return (
      <section id="blogi" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="hsplit rv">
            <div>
              <span className="kick">Blogi</span>
              <h2>Lue lisää ilmeestä ja teippauksista</h2>
            </div>
            <p className="sub">Ne kysymykset, jotka tulevat vastaan ennen tarjouspyyntöä.</p>
          </div>
          <div className="postrows rv">
            <a href="/blogi/autoteippauksen-hinta"><span>Hintaopas</span><b>Autoteippauksen hinta 2026 — mitä ajoneuvoteippaus oikeasti maksaa</b><i>→</i></a>
            <a href="/blogi/graafinen-ohjeisto"><span>Yritysilme</span><b>Mitä graafinen ohjeisto sisältää ja miksi sitä tarvitaan</b><i>→</i></a>
            <a href="/blogi/logon-vektorointi"><span>Aineistot</span><b>Logo vektoriksi: miksi kuvatiedosto ei riitä painoon eikä teippiin</b><i>→</i></a>
            <a href="/blogi/yritysilmeen-uudistus"><span>Opas</span><b>Yritysilmeen uudistus — mistä aloittaa ja mitä se maksaa</b><i>→</i></a>
          </div>
        </div>
      </section>
  );
}

export function Tarjous() {
  return (
      <section id="tarjous" style={{ paddingTop: 20 }}>
        <div className="wrap-n">
          <div className="shead center rv" data-par="0.03">
            <span className="kick">Tarjous</span>
            <h2>Kerro mitä pintoja ilmeen pitää kattaa</h2>
            <p className="sub">Saat kiinteähintaisen tarjouksen, joka sisältää suunnittelun, materiaalit ja asennuksen. Kartoitus on maksuton eikä sido mihinkään.</p>
          </div>
          <div className="card fcard rv" data-par="0.02">
            <div className="row2">
              <div>
                <label htmlFor="nimi">Nimi</label>
                <input type="text" id="nimi" autoComplete="name" />
              </div>
              <div>
                <label htmlFor="yritys">Yritys</label>
                <input type="text" id="yritys" autoComplete="organization" />
              </div>
              <div>
                <label htmlFor="mail">Sähköposti</label>
                <input type="email" id="mail" autoComplete="email" />
              </div>
              <div>
                <label htmlFor="puh">Puhelinnumero</label>
                <input type="text" id="puh" autoComplete="tel" />
              </div>
            </div>
            <label htmlFor="pk">Paikkakunta, jossa asennus tehdään</label>
            <input type="text" id="pk" />
            <label htmlFor="lisa">Mitä tarvitset? Kerro esimerkiksi montako ajoneuvoa, onko logo olemassa ja mihin mennessä työn pitäisi olla valmis.</label>
            <textarea id="lisa" rows={4}></textarea>
            <button className="btn" type="button">Lähetä tarjouspyyntö</button>
            <p className="fnote">Vastaamme 24 tunnin sisällä. Ei sitoumuksia.</p>
          </div>
        </div>
      </section>
  );
}

export function Loppu() {
  return (
      <section style={{ paddingTop: 20 }}>
        <div className="closer rv">
          <div>
            <h2>Sama yritys <span style={{ color: "#6fb1ff" }}>joka pinnalla.</span></h2>
            <p>Varaa maksuton kartoitus. Käymme läpi mitä pintoja ilmeen pitäisi kattaa ja missä järjestyksessä ne kannattaa tehdä.</p>
          </div>
          <div>
            <a className="btn mag" href="#tarjous">Varaa maksuton kartoitus</a>
            <p className="cnote">Ei sitoumuksia</p>
          </div>
        </div>
      </section>
  );
}
