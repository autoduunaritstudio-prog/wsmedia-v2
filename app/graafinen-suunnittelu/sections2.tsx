import SopiiKenelle from "../components/SopiiKenelle";
import BudgetForm from "../components/BudgetForm";
import Toimintaalue from "../components/Toimintaalue";
import SmartLink from "../components/SmartLink";

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
  const jaa = (x: string) => {
    const k = x.indexOf(". ");
    return k > 0 ? { t: x.slice(0, k + 1), s: x.slice(k + 2) } : { t: x };
  };
  return (
    <SopiiKenelle
      otsikko="Kenelle graafinen suunnittelu meiltä sopii?"
      sopii={SOPII.map((t) => ({ t }))}
      ei={EI_SOVI.map(jaa)}
      epavarma="jos graafinen suunnittelu ei ole sinulle oikea ratkaisu"
    />
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
    <Toimintaalue
      otsikko="Graafinen suunnittelu Espoossa ja koko Suomessa"
      rivit={[
        ["Espoo", "Toimistomme on Espoossa. Pääkaupunkiseudun yrityksiä tapaamme mielellämme myös paikan päällä."],
        ["Koko Suomi", "Suunnittelu ja hyväksynnät hoituvat verkossa. Asennus tehdään siellä, missä autosi ja toimitilasi ovat."],
        ["Ovellesi", "Painotuotteet toimitetaan suoraan osoitteeseesi."],
      ]}
    />
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
export function Tarjous() {
  /* SAMA KOKONAISUUS KUIN LYHYTVIDEOILLA JA VERKKOSIVUILLA: sama
     rakenne, samat luokat ja sama lomakekortti. Vain sisalto puhuu
     ilmeesta ja teippauksesta. */
  return (
    <section className="seo-sec kuvapohja" id="tarjous">
      <img
        className="pohjakuva"
        src="/kuvat/tarjous-kortit-k.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        data-par="0.028"
      />
      <div className="swrap">
        <p className="seo-selite" data-rvs="">Vastaus 24 tunnissa</p>
        <div className="loc">
          <div>
            <h2 className="seo-h2 rv">
              Valmis uudistamaan <span className="korosta">yrityksen ilmeen?</span>
            </h2>
            <p className="seo-lead rv" style={{ marginTop: "26px" }}>
              Vastaamme 24 tunnin sisällä ja kerromme suoraan, mitä ehdotamme ja mitä se maksaa. Puhelinnumeron ja aukioloajat löydät{" "}
              <a href="/yhteystiedot">yhteystiedoista</a>, ja tekijät esittelemme{" "}
              <a href="/meista">Meistä-sivulla</a>.
            </p>
            <ol className="askel porras rv">
              <li>
                <b>24 h</b>
                <span>Luemme viestin ja vastaamme sähköpostilla.</span>
              </li>
              <li>
                <b>30 min</b>
                <span>Kartoitus: mitä pintoja ilmeen pitää kattaa ja missä järjestyksessä.</span>
              </li>
              <li>
                <b>Tarjous</b>
                <span>Kiinteä hinta, joka sisältää suunnittelun, materiaalit ja asennuksen.</span>
              </li>
            </ol>
          </div>

          <BudgetForm
            otsikko="Tarjouspyyntö"
            vaihtoehdot
            showBudget={false}
            messageLabel="Mitä tarvitset? Kerro esimerkiksi ajoneuvojen määrä ja paikkakunta."
            note="Ei sitoumuksia."
            tilt="y"
          />
        </div>
      </div>
    </section>
  );
}
