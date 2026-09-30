import BudgetForm from "../components/BudgetForm";
import SmartLink from "../components/SmartLink";
import { Kaiku } from "../components/Maasto";

import PriceConfig from "./PriceConfig";

/* ==================================================================
   HINTA  ·  sivun hinnasto, ei omaa pohjaa
   ==================================================================
   Osio oli aiemmin sivun ainoa vaalea lohko. Kolmella muulla
   palvelusivulla hinnasto on osa samaa pintaa kuin sita ymparoivat
   osiot, ja se erottuu silla mika sen kuuluukin erottaa: laskurilla.
   Kaikua ei ole, sama saanto kuin muilla. */
export function Hinta() {
  return (
    <section className="seo-sec" id="hinta">
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Hinta</span>
          <i>Avaimet käteen · ei aloitusmaksua</i>
        </div>
        <h2 className="seo-h2 rv">Paljonko graafinen suunnittelu maksaa?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Hinta riippuu siitä, montako pintaa ilmeen pitää kattaa. Valitse mitä tarvitset, niin
          näet suuruusluokan heti.
        </p>

        <PriceConfig />

        <p className="seo-body" style={{ marginTop: "32px", maxWidth: "78ch" }}>
          Arvio perustuu tyypillisiin toteutuksiin, ja lopullinen hinta tarkentuu kartoituksessa.
          Suurin yksittäinen hintaan vaikuttava tekijä on ajoneuvojen ja pintojen määrä: usean auton
          kalustossa yksikköhinta laskee selvästi, koska suunnittelu tehdään kerran ja monistetaan.
          Kaikki hinnat + alv 25,5 %.
        </p>
      </div>
    </section>
  );
}

/* ==================================================================
   KENELLE  ·  kaksi palstaa, yksi jaettu raja
   ================================================================== */
const SOPII = [
  "Ilmettä tarvitaan useaan paikkaan: autoon, toimitilaan ja painotuotteisiin",
  "Yrityksellä on kalustoa, jonka pitäisi näyttää samalta ensimmäisestä autosta viimeiseen",
  "Nykyinen logo on epäselvä, vanhentunut tai olemassa vain kuvatiedostona",
  "Et halua kilpailuttaa kolmea toimittajaa ja sovitella niiden aikatauluja",
  "Haluat että verkkosivut, some ja fyysiset pinnat näyttävät samalta yritykseltä",
];

const EI_SOVI = [
  "Tarvitset vain yhden auton logoteippauksen ja sinulla on jo vektoroitu logo. Silloin teippaamo on nopeampi ja edullisempi.",
  "Etsit halvinta mahdollista hintaa etkä välitä kestoiästä.",
  "Yrityksen nimi tai toimiala on vielä auki.",
  "Haluat vain painovalmiin tiedoston ja hoidat tuotannon itse. Teemme sitäkin, mutta silloin et hyödy kokonaisuudesta.",
];

export function Kenelle() {
  return (
    <section className="seo-sec" id="kenelle">
      <Kaiku sana="KENELLE" puoli="vas" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Kenelle</span>
          <i>Kaksi palstaa, suora vastaus</i>
        </div>
        <h2 className="seo-h2 rv">Kenelle tämä sopii ja kenelle ei</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Jos tilanteesi on oikean palstan kaltainen, sanomme sen kartoituksessa ja ohjaamme sinut
          muualle. Se on halvempaa meille molemmille.
        </p>

        <div className="kaksi porras rv" style={{ marginTop: "48px" }}>
          <div>
            <p className="kaksi-k on">Sopii sinulle, jos</p>
            <ul>
              {SOPII.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kaksi-k ei">Ei kannata, jos</p>
            <ul>
              {EI_SOVI.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   TOIMINTA-ALUE
   ==================================================================
   Kaupungit olivat linkkeja osoitteisiin joita ei ole olemassa
   (/graafinen-suunnittelu/espoo ja yhdeksan muuta). Linkki 404:aan on
   hakukoneelle huonompi kuin ei linkkia lainkaan, joten paikkakunnat
   ovat toistaiseksi tekstia. Kun kaupunkisivut tehdaan, nama
   muuttuvat takaisin linkeiksi. */
const KAUPUNGIT = [
  "Espoo",
  "Helsinki",
  "Vantaa",
  "Tampere",
  "Turku",
  "Oulu",
  "Lahti",
  "Kuopio",
  "Pori",
  "Joensuu",
];

export function Alueet() {
  return (
    <section className="seo-sec" id="alueet">
      <Kaiku sana="ALUEET" puoli="vas" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Toiminta-alue</span>
          <i>Espoo ja koko Suomi</i>
        </div>
        <h2 className="seo-h2 rv">Suunnittelu etänä, asennus lähellä sinua</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Suunnittelu ja hyväksynnät hoituvat verkossa mistä päin Suomea tahansa. Asennus tehdään
          sinun paikkakunnallasi: valitsemme asentajan sieltä, missä ajoneuvot ja toimitilat ovat.
        </p>
        <p className="seo-body" style={{ marginTop: "22px", maxWidth: "72ch" }}>
          Kotipaikkamme on Espoo, mutta teippaus ja asennus eivät edellytä sitä että olisimme
          samassa kaupungissa. Painotuotteet toimitetaan suoraan osoitteeseesi.
        </p>
        <p className="seo-tags" style={{ marginTop: "28px" }}>
          {KAUPUNGIT.map((k) => (
            <span key={k}>{k}</span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* ==================================================================
   TAUSTAA  ·  pitka teksti hakukonetta ja lukijaa varten
   ================================================================== */
export function Kaytannossa() {
  return (
    <section className="seo-sec" id="kaytannossa">
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Taustaa</span>
          <i>Neljä kysymystä ennen tarjouspyyntöä</i>
        </div>
        <h2 className="seo-h2 rv">Graafinen suunnittelu käytännössä</h2>

        <div className="seo-teksti rv" style={{ marginTop: "40px" }}>
          <h3>Miksi yhtenäinen ilme kannattaa</h3>
          <p>
            Yrityksen ilme ei ole logo vaan se kokonaisuus, jonka asiakas kohtaa: verkkosivu,
            käyntikortti, pakettiauton kylki, toimitilan ikkuna ja somekanavan profiilikuva. Kun ne
            näyttävät samalta, jokainen kohtaaminen vahvistaa edellistä. Kun ne näyttävät eriltä,
            jokainen kohtaaminen alkaa alusta.
          </p>

          <h3>Mistä graafisen suunnittelun hinta muodostuu</h3>
          <p>
            Hinta on työtunteja. Suomessa kokeneen suunnittelijan tuntihinta asettuu tyypillisesti
            70–120 euroon, joten hinta kertoo suoraan sen, kuinka paljon työtä kohteeseen käytetään.
            Suurimmat yksittäiset tekijät ovat laajuus eli montako pintaa ja versiota tarvitaan,
            muutoskierrosten määrä ja käyttöoikeuksien laajuus.
          </p>
          <p>
            Teippausten ja painotuotteiden kohdalla mukaan tulee vielä materiaali ja työ. Siksi
            kahden tarjouksen vertailu pelkän loppusumman perusteella on harhaanjohtavaa: halvempi
            tarjous voi sisältää lyhytikäisen kalvon, ulkoasennuksen ja oletuksen siitä että
            toimitat itse painovalmiin tiedoston.
          </p>

          <h3>Ajoneuvo on mediatila, joka on jo maksettu</h3>
          <p>
            Mediabudjetti maksaa näkyvyydestä niin kauan kuin sitä maksetaan. Teipattu auto näkyy
            joka ajokilometrillä eikä sitä voi kytkeä pois päältä, ja kustannus jakautuu koko kalvon
            elinkaarelle. Kolme vuotta kestävä ja seitsemän vuotta kestävä teippaus maksavat
            asennettuna lähes saman verran, mutta jälkimmäinen jakaa kustannuksen kaksinkertaiselle
            ajalle. Siksi materiaalivalinnasta kannattaa kysyä jo tarjousvaiheessa.
          </p>

          <h3>Suunnittelun ja tuotannon ero</h3>
          <p>
            Suunnittelu ratkaisee miltä lopputulos näyttää. Tuotanto ratkaisee kuinka kauan se
            kestää. Nämä ovat eri ammatteja, ja siksi ne kannattaa ostaa eri tekijöiltä, mutta
            niiden yhteensovittaminen ei kuulu asiakkaalle. Sinä hyväksyt luonnoksen ja saat
            valmiin lopputuloksen. Kaikki siltä väliltä on meidän työtämme. Sama logiikka toimii
            myös <SmartLink href="/verkkosivut">verkkosivuissa</SmartLink> ja{" "}
            <SmartLink href="/lyhytvideot">lyhytvideoissa</SmartLink>.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   TARJOUS
   ==================================================================
   Sivulla oli lomakeosio ja heti sen perassa .closer-lohko, jonka
   ainoa nappi osoitti takaisin samaan lomakkeeseen muutaman sadan
   pikselin paahan. Sama poisto kuin kolmella muulla palvelusivulla.
   Kasin kirjoitettu lomake vaihtui sivuston omaan: se on sama
   komponentti, sama validointi ja sama ulkoasu kaikkialla. */
const ASKELEET: [string, string][] = [
  ["24 h", "Luemme viestin ja vastaamme sähköpostilla."],
  ["30 min", "Kartoitus: mitä pintoja ilmeen pitää kattaa ja missä järjestyksessä."],
  ["Tarjous", "Kiinteä hinta, joka sisältää suunnittelun, materiaalit ja asennuksen."],
];

export function Tarjous() {
  return (
    <section className="seo-sec" id="tarjous">
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Maksuton kartoitus</span>
          <i>Vastaus 24 tunnissa</i>
        </div>
        <div className="loc">
          <div>
            <h2 className="seo-h2 rv">
              Pyydä tarjous <span className="mark">yritysilmeestä.</span>
            </h2>
            <p className="seo-lead rv" style={{ marginTop: "26px" }}>
              Kerro lyhyesti mitä pintoja ilmeen pitäisi kattaa: montako ajoneuvoa, onko logo
              olemassa ja mihin mennessä työn pitäisi olla valmis.
            </p>
            <ol className="askel porras rv">
              {ASKELEET.map(([h, s]) => (
                <li key={h}>
                  <b>{h}</b>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <BudgetForm
              showBudget={false}
              messageLabel="Mitä tarvitset? Kerro esimerkiksi ajoneuvojen määrä ja aikataulu."
              extraField={{
                id: "pk",
                label: "Paikkakunta, jossa asennus tehdään",
                placeholder: "Espoo",
              }}
              submitLabel="Pyydä tarjous"
              note="Vastaamme 24 tunnin sisällä. Kartoitus ei sido mihinkään."
              tilt="y"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
