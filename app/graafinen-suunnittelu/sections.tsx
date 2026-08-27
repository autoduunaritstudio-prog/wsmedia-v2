import type { CSSProperties } from "react";

import PriceConfig from "./PriceConfig";

export function Miksi() {
  return (
      <section id="miksi" style={{ paddingTop: 96 }}>
        <div className="wrap">
          <div className="hsplit rv">
            <div>
              <span className="kick">Miksi meiltä</span>
              <h2>Teippaamo osaa asentaa. Mainostoimisto osaa suunnitella.</h2>
            </div>
            <p className="sub">Kumpikin tekee oman osuutensa hyvin. Ongelma on se väli, johon asiakas jää: kuka piirtää, kuka tulostaa, kuka asentaa — ja kuka vastaa siitä että lopputulos vastaa suunnitelmaa.</p>
          </div>

          <div className="bridge stagger">
            <div className="bcard side rv" style={{ "--i": 0 } as CSSProperties}>
              <p className="bt">Teippaamo tai painotalo</p>
              <h3>Tuottaa ja asentaa</h3>
              <p>Osaa materiaalit, kalvot ja asennuksen. Suunnittelu on sivutuote.</p>
              <ul>
                <li>Suunnittelu usein vain yksinkertaisiin töihin</li>
                <li>Valmiit vektoroidut tiedostot oletetaan olevan olemassa</li>
                <li>Ilme ei jatku verkkoon eikä somekanaviin</li>
              </ul>
            </div>

            <div className="bcard mid rv" style={{ "--i": 1 } as CSSProperties}>
              <p className="bt">WS Media</p>
              <h3>Suunnittelemme ilmeen ja hoidamme tuotannon</h3>
              <p>Teemme graafisen suunnittelun ja viemme sen tuotantoon: kilpailutamme materiaalitoimittajan ja asentajan, aikataulutamme työn ja tarkistamme jäljen.</p>
              <ul>
                <li>Yksi tarjous, yksi yhteyshenkilö, yksi lasku</li>
                <li>Sama ilme verkossa, somessa ja auton kyljessä</li>
                <li>Saat alkuperäistiedostot ja täydet käyttöoikeudet</li>
                <li>Vastaamme kokonaisuudesta, myös alihankkijan työstä</li>
              </ul>
            </div>

            <div className="bcard side rv" style={{ "--i": 2 } as CSSProperties}>
              <p className="bt">Mainostoimisto</p>
              <h3>Suunnittelee</h3>
              <p>Osaa ilmeen ja ohjeiston. Tuotanto ja asennus jäävät sinun järjestettäväksesi.</p>
              <ul>
                <li>Painovalmis tiedosto on lopputuote</li>
                <li>Toimittajien kilpailutus jää asiakkaalle</li>
                <li>Aikataulujen sovittelu jää asiakkaalle</li>
              </ul>
            </div>
          </div>

          <p className="bridgenote rv">Emme teippaa emmekä paina itse — siihen käytämme alan tekijöitä, jotka tekevät sitä työkseen joka päivä. <strong>Me valitsemme heidät, annamme heille oikeat tiedostot ja vastaamme siitä että lopputulos vastaa suunnitelmaa.</strong> Käytännössä se tarkoittaa yhtä asiaa: sinun ei tarvitse toimia projektipäällikkönä omassa markkinoinnissasi.</p>
        </div>
      </section>
  );
}

export function Palvelut() {
  return (
      <section id="palvelut" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="shead rv" data-par="0.03">
            <span className="kick">Palvelut</span>
            <h2>Mitä graafinen suunnittelu meillä sisältää?</h2>
            <p className="sub">Ilme rakennetaan kerran ja käytetään joka pinnalla. Voit ostaa koko kokonaisuuden tai yksittäisen palan siitä.</p>
          </div>

          <div className="bento stagger">
            <div className="bt-item wide rv" style={{ "--i": 0 } as CSSProperties}>
              <span className="ic">◆</span>
              <h3>Yritysilme ja logo</h3>
              <p>Se pohja, jonka päälle kaikki muu rakennetaan: tunnus, väripaletti ja typografia sekä graafinen ohjeisto, joka pitää ilmeen samana riippumatta siitä kuka materiaalia tekee.</p>
              <ul>
                <li>Logosuunnittelu ja logopaketti eri tiedostomuodoissa</li>
                <li>Väripaletti CMYK-, RGB- ja HEX-arvoineen</li>
                <li>Typografia otsikoille ja leipätekstille</li>
                <li>Graafinen ohjeisto PDF-muodossa</li>
              </ul>
              <p className="px">Logo alk. 690 € · ilme ohjeistoineen alk. 1 490 €</p>
            </div>

            <div className="bt-item rv" style={{ "--i": 1 } as CSSProperties}>
              <span className="ic">▬</span>
              <h3>Ajoneuvoteippaukset</h3>
              <p>Logoteippauksesta koko kaluston brändäykseen — suunnittelu, materiaalit ja asennus samassa paketissa.</p>
              <ul>
                <li>Logoteippaus, osateippaus ja yliteippaus</li>
                <li>Pakettiautot, henkilöautot ja raskas kalusto</li>
                <li>Koko kaluston yhtenäinen ilme</li>
                <li>Asennus lämpimissä sisätiloissa</li>
              </ul>
              <p className="px">Avaimet käteen alk. 590 €</p>
            </div>

            <div className="bt-item rv" style={{ "--i": 2 } as CSSProperties}>
              <span className="ic">◧</span>
              <h3>Julkisivu, kyltit ja ikkunat</h3>
              <p>Toimitilan pinnat viestinviejiksi. Ensivaikutelma syntyy ennen kuin asiakas astuu ovesta sisään.</p>
              <ul>
                <li>Julkisivu- ja ikkunateippaukset</li>
                <li>Valomainokset ja valokyltit</li>
                <li>Opasteet ja lattiateippaukset</li>
                <li>Lupa-asiat selvitettynä</li>
              </ul>
              <p className="px">Avaimet käteen alk. 890 €</p>
            </div>

            <div className="bt-item wide rv" style={{ "--i": 3 } as CSSProperties}>
              <span className="ic">▤</span>
              <h3>Painotuotteet</h3>
              <p>Käyntikortit, flyerit, esitteet ja roll-upit suunnittelusta painoon. Saat painovalmiit aineistot myös itsellesi, jos haluat teettää lisäpainoksen myöhemmin muualla.</p>
              <ul>
                <li>Käyntikortit ja kirjelomakkeet</li>
                <li>Flyerit, esitteet ja oppaat</li>
                <li>Roll-upit ja messumateriaalit</li>
                <li>Painovalmiit aineistot oikeilla väriarvoilla</li>
              </ul>
              <p className="px">Suunnittelu alk. 190 € · painatus sisällytettynä</p>
            </div>
          </div>
        </div>
      </section>
  );
}

export function Prosessi() {
  return (
      <section id="prosessi" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="shead center rv" data-par="0.03">
            <span className="kick">Prosessi</span>
            <h2>Näin projekti etenee</h2>
            <p className="sub">Sinun osuutesi on kaksi hyväksyntää. Kaikki muu kulkee meidän kauttamme, myös alihankkijoiden kanssa asiointi.</p>
          </div>

          <div className="hline rv">
            <div className="hsteps">
              <div className="hstep">
                <span className="dot">1</span>
                <div className="hbox">
                  <h3>Kartoitus</h3>
                  <p>Käymme läpi mitä pintoja ilmeen pitää kattaa: montako ajoneuvoa, mitkä toimipisteet ja mitä painotuotteita tarvitaan.</p>
                  <span className="who">WS Media</span>
                </div>
              </div>
              <div className="hstep">
                <span className="dot">2</span>
                <div className="hbox">
                  <h3>Suunnittelu</h3>
                  <p>Kaksi tai kolme ehdotusta, joista valitset suunnan. Valittuun tehdään yhdestä kahteen muutoskierrosta.</p>
                  <span className="who">WS Media</span>
                </div>
              </div>
              <div className="hstep">
                <span className="dot">3</span>
                <div className="hbox">
                  <h3>Tuotantovalmius</h3>
                  <p>Teemme paino- ja asennusvalmiit tiedostot: vektorimuodot, oikeat väriarvot ja mitat jokaiselle pinnalle erikseen.</p>
                  <span className="who">WS Media</span>
                </div>
              </div>
              <div className="hstep">
                <span className="dot">4</span>
                <div className="hbox">
                  <h3>Tuotanto ja asennus</h3>
                  <p>Kilpailutamme materiaalitoimittajan ja asentajan, sovimme aikataulun ja valvomme laadun paikan päällä.</p>
                  <span className="who sub">Alihankinta · meidän vastuullamme</span>
                </div>
              </div>
              <div className="hstep">
                <span className="dot">5</span>
                <div className="hbox">
                  <h3>Luovutus</h3>
                  <p>Tarkistamme jäljen, luovutamme alkuperäistiedostot ja graafisen ohjeiston. Ilme on käytettävissäsi ilman rajoituksia.</p>
                  <span className="who">WS Media</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}

export function Hinta() {
  return (
      <section id="hinta" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="shead center rv" data-par="0.03">
            <span className="kick">Hinta</span>
            <h2>Paljonko graafinen suunnittelu maksaa?</h2>
            <p className="sub">Hinta riippuu siitä, montako pintaa ilmeen pitää kattaa. Valitse mitä tarvitset, niin näet suuruusluokan heti. Lopullinen hinta tarkentuu maksuttomassa kartoituksessa.</p>
          </div>

          <PriceConfig />

          <p className="pricenote rv">Arvio perustuu tyypillisiin toteutuksiin. Suurin yksittäinen hintaan vaikuttava tekijä on ajoneuvojen ja pintojen määrä: usean auton kalustossa yksikköhinta laskee selvästi, koska suunnittelu tehdään kerran ja monistetaan. Kartoitus ja tarjous ovat maksuttomia eivätkä sido mihinkään.</p>
        </div>
      </section>
  );
}

export function Tiedostot() {
  return (
      <section id="tiedostot" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="hsplit rv">
            <div>
              <span className="kick">Aineistot</span>
              <h2>Ilme on sinun — myös tiedostoina</h2>
            </div>
            <p className="sub">Tämä on se kohta, joka jää alalla useimmiten sopimatta. Meillä se sanotaan ääneen: kaikki aineistot ja täydet käyttöoikeudet siirtyvät sinulle.</p>
          </div>

          <div className="files rv">
            <div className="frow"><em>AI · EPS</em><div><b>Muokattavat alkuperäistiedostot</b><s>Avautuvat suunnitteluohjelmissa, käytetään painossa ja teippauksessa</s></div></div>
            <div className="frow"><em>SVG</em><div><b>Vektorilogo verkkoon</b><s>Skaalautuu terävänä jokaiseen kokoon</s></div></div>
            <div className="frow"><em>PDF</em><div><b>Painovalmis aineisto</b><s>Leikkuuvarat ja oikeat väriprofiilit valmiina</s></div></div>
            <div className="frow"><em>PNG</em><div><b>Läpinäkyvä tunnus</b><s>Somekäyttöön, esityksiin ja verkkosivuille</s></div></div>
            <div className="frow"><em>CMYK<br />RGB · HEX</em><div><b>Väriarvot kirjattuna</b><s>Sama väri painossa, näytöllä ja teippikalvossa</s></div></div>
            <div className="frow"><em>OTF · TTF</em><div><b>Fontit ja lisenssitiedot</b><s>Tieto siitä mitä saa käyttää ja missä</s></div></div>
            <div className="frow"><em>PDF</em><div><b>Graafinen ohjeisto</b><s>Logon käyttö, suojaetäisyydet ja väärinkäyttöesimerkit</s></div></div>
            <div className="frow"><em>Mitat</em><div><b>Asennusvalmiit mitoitukset</b><s>Jokaiselle ajoneuvolle ja pinnalle erikseen</s></div></div>
          </div>

          <p className="lead rv" style={{ marginTop: 26 }}><strong>Käyttöoikeuksista sovitaan kirjallisesti ennen työn aloittamista.</strong> Jos teetät myöhemmin lisäpainoksen tai toisen auton teippauksen jossain muualla, tiedostot toimivat sellaisenaan — et ole sidottu meihin. Emme pidä aineistoja panttina, koska se ei ole yhteistyön arvoinen tapa pitää asiakas.</p>
        </div>
      </section>
  );
}

export function Materiaalit() {
  return (
      <section id="materiaalit" style={{ paddingTop: 20 }}>
        <div className="wrap">
          <div className="shead rv" data-par="0.03">
            <span className="kick">Materiaalit</span>
            <h2>Mitä pintaan oikeasti tulee</h2>
            <p className="sub">Halpa ja kallis tarjous eroavat yleensä juuri tässä. Kerromme aina tarjouksessa mitä materiaalia käytetään ja mikä sen odotettu kestoikä on.</p>
          </div>

          <div className="tblwrap rv">
            <table>
              <thead><tr><th>Kohde</th><th>Materiaali</th><th>Odotettu kestoikä</th><th>Huomioitavaa</th></tr></thead>
              <tbody>
                <tr><td>Ajoneuvoteippaus</td><td>Ammattitason tarrakalvo</td><td>3–7 vuotta</td><td>Asennus lämpimässä sisätilassa, pinta esikäsitellään</td></tr>
                <tr><td>Yliteippaus</td><td>Värinvaihtokalvo laminoituna</td><td>5–7 vuotta</td><td>Alkuperäinen maalipinta säilyy kalvon alla</td></tr>
                <tr><td>Ikkuna- ja julkisivuteippaus</td><td>Ikkunakalvo tai tarrateippi</td><td>3–5 vuotta</td><td>Suojaa myös UV-säteilyltä ja vähentää häikäisyä</td></tr>
                <tr><td>Valomainos</td><td>LED-tekniikka, alumiini ja akryyli</td><td>LED 50 000–100 000 h</td><td>Toimitusaika tyypillisesti 3–5 viikkoa, lupa-asiat selvitetään</td></tr>
                <tr><td>Painotuotteet</td><td>Paperilaatu käyttökohteen mukaan</td><td>—</td><td>Painovalmis aineisto oikeilla väriprofiileilla</td></tr>
              </tbody>
            </table>
          </div>

          <p className="lead rv">Lyhytikäinen kampanjateippi on halvempi mutta kestää kuukausia, ei vuosia. Kun kalusto on tarkoitus pitää samannäköisenä viisi vuotta, materiaalin valinta ratkaisee enemmän kuin muutaman satasen ero tarjouksessa.</p>
        </div>
      </section>
  );
}
