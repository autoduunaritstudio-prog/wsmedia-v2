import BudgetForm from "../components/BudgetForm";
import SmartLink from "../components/SmartLink";
import { Kaiku } from "../components/Maasto";

import PriceConfig from "./PriceConfig";
import g from "./gs.module.css";

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
          Hinta riippuu siitä, mitä kaikkea tarvitset. Valitse kohteet, niin näet suuruusluokan
          heti.
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
        <h2 className="seo-h2 rv">Kenelle graafinen suunnittelu meiltä sopii?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Jos tilanteesi kuuluu jälkimmäiseen ryhmään, sanomme sen kartoituksessa suoraan. Se säästää
          molempien aikaa.
        </p>

        {/* KAKSI ERI PINTAA, EI KAKSI SAMANLAISTA PALSTAA.
            Vasen on kenelle palvelu on tehty: avoin lista, syaani merkki.
            Oikea on rajaus: oma vaimea pinta, lampoinen merkki, ja kohdan
            jalkeen sanotaan mika on parempi vaihtoehto silloin. */}
        <div className={g.kenelle}>
          <div className={g.sopii}>
            <h3>Sopii sinulle, jos</h3>
            <ul>
              {SOPII.map((x) => (
                <li key={x}>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                  </svg>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={g.eiSovi}>
            <h3>Ei kannata, jos</h3>
            <ul>
              {EI_SOVI.map((x) => {
                const k = x.indexOf(". ");
                const ehto = k > 0 ? x.slice(0, k + 1) : x;
                const vaihto = k > 0 ? x.slice(k + 2) : null;
                return (
                  <li key={x}>
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M6 6l8 8M14 6l-8 8" />
                    </svg>
                    <span>
                      {ehto}
                      {vaihto ? <small>{vaihto}</small> : null}
                    </span>
                  </li>
                );
              })}
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

export function Alueet() {
  return (
    <section className="seo-sec" id="alueet">
      <Kaiku sana="ALUEET" puoli="vas" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Toiminta-alue</span>
          <i>Espoo ja koko Suomi</i>
        </div>
        <h2 className="seo-h2 rv">Graafinen suunnittelu Espoossa ja koko Suomessa</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Toimistomme on Espoossa, ja pääkaupunkiseudun yrityksiä tapaamme mielellämme myös paikan
          päällä. Suunnittelu ja hyväksynnät hoituvat verkossa mistä päin Suomea tahansa, ja asennus
          tehdään siellä, missä autosi ja toimitilasi ovat.
        </p>
        <p className="seo-body" style={{ marginTop: "22px", maxWidth: "72ch" }}>
          Painotuotteet toimitetaan suoraan osoitteeseesi.
        </p>
        {/* Kaupunkilista poistettiin 1.10.2026. Se oli tarkoitettu linkeiksi
            kaupunkisivuille, joita ei viela ole. Lisataan kun sivut tehdaan. */}
      </div>
    </section>
  );
}

/* ==================================================================
   TAUSTAA  ·  pitka teksti hakukonetta ja lukijaa varten
   ================================================================== */
export function Kaytannossa() {
  /* Sama rakenne kuin lyhytvideosivulla: pieni otsikko, kaksi
     ensimmaista lohkoa auki ja loput "Lue koko teksti" -napin takana.
     Suljettu sisalto on DOM:ssa, joten hakukone lukee sen. */
  return (
    <section id="kaytannossa" className="seosec">
      <div className="wrap-n">
        <div className="shead rv" data-par="0.03" style={{ marginBottom: "30px" }}>
          <h2>Graafinen suunnittelu käytännössä</h2>
        </div>
        <div className="prose seoprose rv">
          <h3>Miksi yhtenäinen yritysilme kannattaa?</h3>
          <p>
            Yrityksen ilme ei ole logo vaan se kokonaisuus, jonka asiakas kohtaa: verkkosivu,
            käyntikortti, pakettiauton kylki, toimitilan ikkuna ja somekanavan profiilikuva. Kun ne
            näyttävät samalta, jokainen kohtaaminen vahvistaa edellistä. Kun ne näyttävät eriltä,
            jokainen kohtaaminen alkaa alusta.
          </p>

          <h3>Mistä graafisen suunnittelun hinta muodostuu?</h3>
          <p>
            Hinta muodostuu työtunneista, joten se kertoo suoraan, kuinka paljon työtä kohteeseen
            käytetään. Suurimmat tekijät ovat laajuus eli montako pintaa ja versiota tarvitaan,
            muutoskierrosten määrä ja käyttöoikeuksien laajuus.
          </p>

          <details className="seomore">
            <summary>
              <span>Lue koko teksti</span>
            </summary>

            <p>
              Teippausten ja painotuotteiden kohdalla mukaan tulee vielä materiaali ja työ. Siksi
              kahden tarjouksen vertailu pelkän loppusumman perusteella on harhaanjohtavaa: halvempi
              tarjous voi sisältää lyhytikäisen kalvon, ulkoasennuksen ja oletuksen siitä, että
              toimitat itse painovalmiin tiedoston.
            </p>

            <h3>Kannattaako pakettiauton mainosteippaus?</h3>
            <p>
              Mainos netissä tai lehdessä näkyy niin kauan kuin siitä maksetaan. Teipattu auto näkyy
              joka ajokilometrillä, eikä sitä voi kytkeä pois päältä. Kustannus jakautuu koko kalvon
              käyttöiälle, joten pidempään kestävä kalvo tulee vuotta kohden usein edullisemmaksi,
              vaikka se maksaa enemmän. Siksi materiaalista kannattaa kysyä jo tarjousvaiheessa.
            </p>

            <h3>Mikä on suunnittelun ja tuotannon ero?</h3>
            <p>
              Suunnittelu ratkaisee, miltä lopputulos näyttää. Tuotanto ratkaisee, kuinka kauan se
              kestää. Ne ovat eri ammatteja, mutta niiden yhteensovittaminen ei kuulu asiakkaalle.
              Sinä hyväksyt luonnoksen ja saat valmiin lopputuloksen, ja kaikki siltä väliltä on
              meidän työtämme.
            </p>

            <h3>Mitä muuta WS Media tekee?</h3>
            <p>
              WS Media tekee graafisen suunnittelun Espoosta käsin koko Suomeen. Koska teemme myös{" "}
              <SmartLink href="/verkkosivut">verkkosivut</SmartLink>,{" "}
              <SmartLink href="/hakukoneoptimointi">hakukoneoptimoinnin</SmartLink> ja{" "}
              <SmartLink href="/lyhytvideot">lyhytvideot</SmartLink>, sama ilme siirtyy suoraan
              sivustolle, someen ja mainontaan, eikä samaa työtä tehdä kahteen kertaan.
            </p>
          </details>
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
        </div>
        <div className="loc">
          <div>
            <h2 className="seo-h2 rv">
              Pyydä tarjous logosta, ilmeestä tai <span className="mark">teippauksesta.</span>
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
              note="Kartoitus ei sido mihinkään."
              tilt="y"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
