import type { CSSProperties } from "react";

import { Kaiku } from "../components/Maasto";

/**
 * GRAAFINEN SUUNNITTELU -SIVUN OSIOT, SIVUSTON JAETULLA KUVAKIELELLA.
 *
 * Sivu oli ainoa palvelusivu joka oli yha vanhassa vaaleassa
 * ilmeessa: omat kortit (.bcard, .bt-item, .hbox, .pan), oma
 * valkoinen pohja ja oma typografia. Kolme muuta palvelusivua
 * puhuvat .wsx-nimiavaruutta, ja neljas joka ei puhu sita lukee eri
 * sivustona vaikka sisalto olisi kunnossa.
 *
 * Nyt kaikki osiot kayttavat samoja rakennuspalikoita kuin
 * Verkkosivut, Lyhytvideot ja Hakukoneoptimointi: .seo-sec, .swrap,
 * .seo-ord, .seo-h2, .seo-lead, .paketit, .duo2, .jana, .spec,
 * .kaksi ja .qa2. Yhtaan uutta luokkaa ei luoda, koska kopio eroaa
 * alkuperaisesta ensimmaisen korjauksen jalkeen.
 */

/* ==================================================================
   MIKSI MEILTA  ·  kolme saraketta, keskimmainen korostettu
   ==================================================================
   Kolme korttia oli aiemmin oma .bridge-ruudukkonsa. .paketit tekee
   saman tyon sivuston omalla kielella: kolme saraketta, keskimmainen
   .hl ja sen ylla merkki. Hintakentat jaavat pois, .hinta-f kantaa
   yhden rivin luonnehdinnan. */
const SILTA: {
  merkki?: string;
  h: string;
  kuvaus: string;
  li: string[];
  hl?: boolean;
}[] = [
  {
    h: "Teippaamo tai painotalo",
    kuvaus: "Tuottaa ja asentaa. Suunnittelu on sivutuote.",
    li: [
      "Suunnittelu usein vain yksinkertaisiin töihin",
      "Valmiit vektoroidut tiedostot oletetaan olemassa oleviksi",
      "Ilme ei jatku verkkoon eikä somekanaviin",
    ],
  },
  {
    merkki: "WS Media",
    h: "Suunnittelemme ilmeen ja hoidamme tuotannon",
    kuvaus: "Suunnittelu, tuotanto ja asennus samasta sopimuksesta.",
    hl: true,
    li: [
      "Yksi sopimus kattaa suunnittelun, tuotannon ja asennuksen",
      "Sama ilme verkossa, somessa ja auton kyljessä",
      "Saat alkuperäistiedostot ja täydet käyttöoikeudet",
      "Vastaamme kokonaisuudesta, myös alihankkijan työstä",
    ],
  },
  {
    h: "Mainostoimisto",
    kuvaus: "Suunnittelee. Tuotanto ja asennus jäävät sinulle.",
    li: [
      "Painovalmis tiedosto on lopputuote",
      "Toimittajien kilpailutus jää asiakkaalle",
      "Aikataulujen sovittelu jää asiakkaalle",
    ],
  },
];

export function Miksi() {
  return (
    <section className="seo-sec" id="miksi">
      <Kaiku sana="MIKSI" puoli="oik" kohta="ylos" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Miksi meiltä</span>
          <i>Kaksi tekijää, yksi väli</i>
        </div>
        <h2 className="seo-h2 rv">
          Teippaamo osaa asentaa. Mainostoimisto osaa <span className="mark">suunnitella.</span>
        </h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Kumpikin tekee oman osuutensa hyvin. Ongelma on se väli, johon asiakas jää: kuka piirtää,
          kuka tulostaa, kuka asentaa ja kuka vastaa siitä, että lopputulos vastaa suunnitelmaa.
        </p>

        <div className="paketit porras rv">
          {SILTA.map((s) => (
            <div className={s.hl ? "paketti hl" : "paketti"} key={s.h}>
              {s.merkki ? <em className="paketti-merkki">{s.merkki}</em> : null}
              <h3>{s.h}</h3>
              <p className="hinta-f">{s.kuvaus}</p>
              <ul className="seo-spec">
                {s.li.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="seo-body" style={{ marginTop: "40px", maxWidth: "78ch" }}>
          Emme teippaa emmekä paina itse, vaan käytämme alan tekijöitä jotka tekevät sitä työkseen
          joka päivä. Me valitsemme heidät, annamme heille oikeat tiedostot ja vastaamme siitä että
          lopputulos vastaa suunnitelmaa. Käytännössä se tarkoittaa yhtä asiaa: sinun ei tarvitse
          toimia projektipäällikkönä omassa markkinoinnissasi.
        </p>
      </div>
    </section>
  );
}

/* ==================================================================
   PALVELUT  ·  nelja osa-aluetta kahtena parina
   ==================================================================
   Nelja palvelua yhdessa .duo2-ruudukossa olisi rikkonut sen
   palstarajan: saanto .duo2-col + .duo2-col piirtaa vasemman reunan
   jokaiselle ensimmaisen jalkeen, eli kolmas kortti olisi saanut
   viivan rivin alkuun. Kaksi erillista paria pitaa viivan siella
   minne se kuuluu. */
const PALVELUT: { kick: string; h: string; p: string; li: string[]; px: string }[] = [
  {
    kick: "Perusta",
    h: "Yritysilme ja logo",
    p: "Se pohja, jonka päälle kaikki muu rakennetaan: tunnus, väripaletti ja typografia sekä graafinen ohjeisto, joka pitää ilmeen samana riippumatta siitä kuka materiaalia tekee.",
    li: [
      "Logosuunnittelu ja logopaketti eri tiedostomuodoissa",
      "Väripaletti CMYK-, RGB- ja HEX-arvoineen",
      "Typografia otsikoille ja leipätekstille",
      "Graafinen ohjeisto PDF-muodossa",
    ],
    px: "Logo alk. 690 € · ilme ohjeistoineen alk. 1 490 €",
  },
  {
    kick: "Liikkuva pinta",
    h: "Ajoneuvoteippaukset",
    p: "Logoteippauksesta koko kaluston brändäykseen. Sama suunnittelu skaalautuu yhdestä autosta koko kalustoon, joten seuraavista ajoneuvoista maksat vain tuotannon ja asennuksen.",
    li: [
      "Logoteippaus, osateippaus ja yliteippaus",
      "Pakettiautot, henkilöautot ja raskas kalusto",
      "Koko kaluston yhtenäinen ilme",
      "Asennus lämpimissä sisätiloissa",
    ],
    px: "Avaimet käteen alk. 590 €",
  },
  {
    kick: "Toimitila",
    h: "Julkisivu, kyltit ja ikkunat",
    p: "Toimitilan pinnat viestinviejiksi. Ensivaikutelma syntyy ennen kuin asiakas astuu ovesta sisään.",
    li: [
      "Julkisivu- ja ikkunateippaukset",
      "Valomainokset ja valokyltit",
      "Opasteet ja lattiateippaukset",
      "Lupa-asiat selvitettynä",
    ],
    px: "Avaimet käteen alk. 890 €",
  },
  {
    kick: "Käteen jäävä",
    h: "Painotuotteet",
    p: "Käyntikortit, flyerit, esitteet ja roll-upit suunnittelusta painoon. Saat painovalmiit aineistot myös itsellesi, jos haluat teettää lisäpainoksen myöhemmin muualla.",
    li: [
      "Käyntikortit ja kirjelomakkeet",
      "Flyerit, esitteet ja oppaat",
      "Roll-upit ja messumateriaalit",
      "Painovalmiit aineistot oikeilla väriarvoilla",
    ],
    px: "Suunnittelu alk. 190 € · painatus sisällytettynä",
  },
];

function Pari({ osa }: { osa: typeof PALVELUT }) {
  return (
    <div className="duo2" style={{ marginTop: "48px" }}>
      {osa.map((o) => (
        <div className="duo2-col" key={o.h}>
          <p className="duo2-kick">{o.kick}</p>
          <h3>{o.h}</h3>
          <p className="seo-body">{o.p}</p>
          <ul className="seo-spec porras rv">
            {o.li.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <p className="hinta-f" style={{ marginTop: "18px" }}>
            {o.px}
          </p>
        </div>
      ))}
    </div>
  );
}

export function Palvelut() {
  return (
    <section className="seo-sec" id="palvelut">
      <Kaiku sana="PALVELUT" puoli="vas" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Palvelut</span>
          <i>Neljä osa-aluetta</i>
        </div>
        <h2 className="seo-h2 rv">Mitä graafinen suunnittelu meillä sisältää?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Ilme rakennetaan kerran ja käytetään joka pinnalla. Voit ostaa koko kokonaisuuden tai
          yksittäisen palan siitä.
        </p>

        <Pari osa={PALVELUT.slice(0, 2)} />
        <Pari osa={PALVELUT.slice(2, 4)} />
      </div>
    </section>
  );
}

/* ==================================================================
   PROSESSI  ·  sama jana kuin kahdella muulla palvelusivulla
   ==================================================================
   Pieni yliotsikko kertoo kuka vaiheen tekee. Tieto oli aiemmin
   erillisena lipukkeena kortin alalaidassa, ja se on tarkein yksi
   asia jonka lukija haluaa tietaa: mika osa on meidan vastuullamme.
   Janassa se on rivin ensimmainen asia. */
const VAIHEET: [string, string, string][] = [
  [
    "WS Media",
    "Kartoitus",
    "Käymme läpi mitä pintoja ilmeen pitää kattaa: montako ajoneuvoa, mitkä toimipisteet ja mitä painotuotteita tarvitaan.",
  ],
  [
    "WS Media",
    "Suunnittelu",
    "Kaksi tai kolme ehdotusta, joista valitset suunnan. Valittuun tehdään yhdestä kahteen muutoskierrosta.",
  ],
  [
    "WS Media",
    "Tuotantovalmius",
    "Teemme paino- ja asennusvalmiit tiedostot: vektorimuodot, oikeat väriarvot ja mitat jokaiselle pinnalle erikseen.",
  ],
  [
    "Alihankinta · meidän vastuullamme",
    "Tuotanto ja asennus",
    "Kilpailutamme materiaalitoimittajan ja asentajan, sovimme aikataulun ja valvomme laadun paikan päällä.",
  ],
  [
    "WS Media",
    "Luovutus",
    "Tarkistamme jäljen, luovutamme alkuperäistiedostot ja graafisen ohjeiston. Ilme on käytettävissäsi ilman rajoituksia.",
  ],
];

export function Prosessi() {
  return (
    <section className="seo-sec" id="prosessi">
      <Kaiku sana="PROSESSI" puoli="oik" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Prosessi</span>
          <i>Kaksi hyväksyntää sinulta</i>
        </div>
        <h2 className="seo-h2 rv">Näin projekti etenee</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Sinun osuutesi on kaksi hyväksyntää: suunnan valinta ja lopullinen luonnos. Kaikki muu
          kulkee meidän kauttamme, myös alihankkijoiden kanssa asiointi.
        </p>

        <div className="jana" data-rvs="">
          <div className="jana-akseli" aria-hidden="true">
            <i />
          </div>
          <div className="jana-jaksot porras rv">
            {VAIHEET.map(([kuka, h, p], i) => (
              <div className="jakso" key={h} style={{ "--i": i } as CSSProperties}>
                <p className="jakso-kk">{kuka}</p>
                <h3>{h}</h3>
                <p className="jakso-p">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   AINEISTOT  ·  mita luovutuksessa siirtyy
   ================================================================== */
const TIEDOSTOT: [string, string, string][] = [
  ["AI · EPS", "Muokattavat alkuperäistiedostot", "Avautuvat suunnitteluohjelmissa, käytetään painossa ja teippauksessa"],
  ["SVG", "Vektorilogo verkkoon", "Skaalautuu terävänä jokaiseen kokoon"],
  ["PDF", "Painovalmis aineisto", "Leikkuuvarat ja oikeat väriprofiilit valmiina"],
  ["PNG", "Läpinäkyvä tunnus", "Somekäyttöön, esityksiin ja verkkosivuille"],
  ["CMYK · RGB · HEX", "Väriarvot kirjattuna", "Sama väri painossa, näytöllä ja teippikalvossa"],
  ["OTF · TTF", "Fontit ja lisenssitiedot", "Tieto siitä mitä saa käyttää ja missä"],
  ["PDF", "Graafinen ohjeisto", "Logon käyttö, suojaetäisyydet ja väärinkäyttöesimerkit"],
  ["Mitat", "Asennusvalmiit mitoitukset", "Jokaiselle ajoneuvolle ja pinnalle erikseen"],
];

export function Tiedostot() {
  return (
    <section className="seo-sec" id="tiedostot">
      <Kaiku sana="AINEISTOT" puoli="vas" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Aineistot</span>
          <i>{TIEDOSTOT.length} toimitettavaa</i>
        </div>
        <h2 className="seo-h2 rv">Ilme on sinun, myös tiedostoina.</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Tämä on se kohta, joka jää alalla useimmiten sopimatta. Meillä se sanotaan ääneen: kaikki
          aineistot ja täydet käyttöoikeudet siirtyvät sinulle.
        </p>

        <table className="spec porras rv" style={{ marginTop: "48px" }}>
          <thead>
            <tr>
              <th scope="col">Muoto</th>
              <th scope="col">Mitä se on</th>
              <th scope="col">Mihin sitä käytetään</th>
            </tr>
          </thead>
          <tbody>
            {TIEDOSTOT.map(([muoto, mika, mihin]) => (
              <tr key={mika}>
                <th scope="row">{muoto}</th>
                <td>{mika}</td>
                <td>{mihin}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="seo-body" style={{ marginTop: "32px", maxWidth: "78ch" }}>
          Käyttöoikeuksista sovitaan kirjallisesti ennen työn aloittamista. Jos teetät myöhemmin
          lisäpainoksen tai toisen auton teippauksen jossain muualla, tiedostot toimivat
          sellaisenaan. Emme pidä aineistoja panttina, koska se ei ole yhteistyön arvoinen tapa
          pitää asiakas.
        </p>
      </div>
    </section>
  );
}

/* ==================================================================
   MATERIAALIT  ·  mita pintaan oikeasti tulee
   ==================================================================
   Kestoika-sarakkeessa oli painotuotteiden kohdalla ajatusviiva.
   Taulukossa tyhja solu on selkeampi kuin merkki jota pitaa tulkita,
   ja ruudunlukija lukee ajatusviivan aaneen. */
const MATERIAALIT: [string, string, string, string][] = [
  [
    "Ajoneuvoteippaus",
    "Ammattitason tarrakalvo",
    "3–7 vuotta",
    "Asennus lämpimässä sisätilassa, pinta esikäsitellään",
  ],
  [
    "Yliteippaus",
    "Värinvaihtokalvo laminoituna",
    "5–7 vuotta",
    "Alkuperäinen maalipinta säilyy kalvon alla",
  ],
  [
    "Ikkuna- ja julkisivuteippaus",
    "Ikkunakalvo tai tarrateippi",
    "3–5 vuotta",
    "Suojaa myös UV-säteilyltä ja vähentää häikäisyä",
  ],
  [
    "Valomainos",
    "LED-tekniikka, alumiini ja akryyli",
    "LED 50 000–100 000 h",
    "Toimitusaika tyypillisesti 3–5 viikkoa, lupa-asiat selvitetään",
  ],
  [
    "Painotuotteet",
    "Paperilaatu käyttökohteen mukaan",
    "Ei kulutuskestoa",
    "Painovalmis aineisto oikeilla väriprofiileilla",
  ],
];

export function Materiaalit() {
  return (
    <section className="seo-sec" id="materiaalit">
      <Kaiku sana="MATERIAALI" puoli="oik" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Materiaalit</span>
          <i>Kirjataan aina tarjoukseen</i>
        </div>
        <h2 className="seo-h2 rv">Mitä pintaan oikeasti tulee</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Halpa ja kallis tarjous eroavat yleensä juuri tässä. Kerromme aina tarjouksessa mitä
          materiaalia käytetään ja mikä sen odotettu kestoikä on.
        </p>

        <table className="spec porras rv" style={{ marginTop: "48px" }}>
          <thead>
            <tr>
              <th scope="col">Kohde</th>
              <th scope="col">Materiaali</th>
              <th scope="col">Odotettu kestoikä</th>
              <th scope="col">Huomioitavaa</th>
            </tr>
          </thead>
          <tbody>
            {MATERIAALIT.map(([kohde, mat, ika, huom]) => (
              <tr key={kohde}>
                <th scope="row">{kohde}</th>
                <td>{mat}</td>
                <td>{ika}</td>
                <td>{huom}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="seo-body" style={{ marginTop: "32px", maxWidth: "78ch" }}>
          Lyhytikäinen kampanjateippi on halvempi mutta kestää kuukausia, ei vuosia. Kun kalusto on
          tarkoitus pitää samannäköisenä viisi vuotta, materiaalin valinta ratkaisee enemmän kuin
          muutaman satasen ero tarjouksessa.
        </p>
      </div>
    </section>
  );
}
