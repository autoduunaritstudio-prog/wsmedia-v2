import type { ReactNode } from "react";

/* TIETOSUOJASELOSTEEN SISALTO (5.10.2026).

   Rakenne: GDPR 13 ja 14 artiklan vaatimat tiedot ja
   tietoyhteiskuntakaaren 205 pykalan evastetiedot tavallisessa
   jarjestyksessa. Kun sivustolle lisataan palvelu, joka kasittelee
   henkilotietoja tai asettaa evasteita, lisaa se taalle (KASITTELIJAT ja
   EVASTEET) ja paivita PAIVITETTY. */

export const PAIVITETTY = "5.10.2026";

export type Section = { n: number; id: string; title: string; lyhyt: string; body: ReactNode };

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="ts-list">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  );
}

const Ulkoinen = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

/** Evasteet ja selaimen tallenteet. Kesto = kauanko tallenne sailyy selaimessa. */
export const EVASTEET: { nimi: string; palvelu: string; tyyppi: string; tarkoitus: string; kesto: string }[] = [
  {
    nimi: "wsmedia.consent",
    palvelu: "WS Media",
    tyyppi: "Välttämätön",
    tarkoitus: "Muistaa evästevalintasi, jotta kysymystä ei näytetä joka käynnillä.",
    kesto: "180 päivää",
  },
  {
    nimi: "_ga",
    palvelu: "Google Analytics 4",
    tyyppi: "Analytiikka",
    tarkoitus: "Erottaa kävijät toisistaan kävijätilastoissa.",
    kesto: "2 vuotta",
  },
  {
    nimi: "_ga_<tunnus>",
    palvelu: "Google Analytics 4",
    tyyppi: "Analytiikka",
    tarkoitus: "Pitää kirjaa käyntikerrasta.",
    kesto: "2 vuotta",
  },
  {
    nimi: "_fbp",
    palvelu: "Meta Pixel",
    tyyppi: "Markkinointi",
    tarkoitus: "Tunnistaa selaimen, jotta Facebook- ja Instagram-mainosten tuloksia voidaan mitata ja mainoksia kohdentaa.",
    kesto: "90 päivää",
  },
];

/** Palveluntarjoajat, jotka kasittelevat tietoja WS Median lukuun. */
const KASITTELIJAT: { nimi: string; mita: string }[] = [
  {
    nimi: "Google Ireland Limited",
    mita: "Sähköposti ja kalenteri (Google Workspace), kartoitusten ajanvaraus, Google Analytics 4 ja Google Search Console.",
  },
  {
    nimi: "Resend, Inc. (Yhdysvallat)",
    mita: "Sivuston lomakkeilta lähetettyjen viestien ja vahvistusviestien sähköpostitoimitus.",
  },
  {
    nimi: "Vercel Inc. (Yhdysvallat)",
    mita: "Sivuston palvelin ja sen tekniset lokitiedot.",
  },
  {
    nimi: "Meta Platforms Ireland Limited",
    mita: "Meta Pixel: Facebook- ja Instagram-mainonnan mittaaminen ja kohdentaminen.",
  },
  {
    nimi: "Microsoft Ireland Operations Limited",
    mita: "Teams-etätapaamiset.",
  },
  {
    nimi: "Kirjanpidon ja laskutuksen palveluntarjoajat",
    mita: "Laskutus, verkkolaskujen välitys (Apix Messaging Oy) ja lakisääteinen kirjanpito.",
  },
];

export const SECTIONS: Section[] = [
  {
    n: 1,
    id: "rekisterinpitaja",
    title: "Rekisterinpitäjä ja yhteystiedot",
    lyhyt: "Rekisterinpitäjä",
    body: (
      <>
        <address className="ts-address">
          <b>WS Media Oy</b>
          <br />
          Y-tunnus 3615084-4
          <br />
          Kuusiniementie 8 F, 02710 Espoo
          <br />
          <a href="mailto:info@wsmedia.fi">info@wsmedia.fi</a>, <a href="tel:+358405648770">040 564 8770</a>
        </address>
        <p>
          Tietosuojaa koskevissa asioissa yhteyshenkilö on Tuomas Ivanov. Tavoitat hänet osoitteesta{" "}
          <a href="mailto:info@wsmedia.fi">info@wsmedia.fi</a>.
        </p>
      </>
    ),
  },
  {
    n: 2,
    id: "tiedot",
    title: "Mitä tietoja käsittelemme",
    lyhyt: "Käsiteltävät tiedot",
    body: (
      <>
        <p className="ts-sub">Yhteydenotto ja tarjouspyyntö</p>
        <p>
          Kun lähetät viestin tai tarjouspyynnön sivuston lomakkeella, saamme antamasi tiedot: nimen,
          sähköpostiosoitteen, puhelinnumeron, yrityksen nimen ja paikkakunnan, valitsemasi palvelut
          ja budjetin sekä viestisi sisällön.
        </p>
        <p className="ts-sub">Kartoituksen ajanvaraus</p>
        <p>
          Ajanvarauksessa saamme yrityksen nimen, yhteyshenkilön nimen, puhelinnumeron ja
          sähköpostiosoitteen, valitun ajan ja tapaamistavan sekä mahdolliset lisätiedot. Jos
          kartoitus tehdään paikan päällä, saamme myös käyntiosoitteen.
        </p>
        <p className="ts-sub">Työhakemus</p>
        <p>
          Hakemuksesta saamme nimen, yhteystiedot, paikkakunnan, osaamisalueet, linkit työnäytteisiin,
          palkka- tai hintatoiveen sekä viestin ja liitteet, jotka lähetät meille.
        </p>
        <p className="ts-sub">Asiakkuus</p>
        <p>
          Asiakassuhteen aikana käsittelemme yhteyshenkilöiden tietoja, sopimus- ja laskutustietoja
          sekä yhteydenpitoa.
        </p>
        <p className="ts-sub">Sivuston käyttö</p>
        <p>
          Palvelin kirjaa teknisiä lokitietoja, kuten IP-osoitteen, käynnin ajankohdan ja selaimen
          tiedot. Jos hyväksyt analytiikka- ja markkinointievästeet, saamme lisäksi tietoja siitä,
          miten sivustoa käytetään (kohta 4).
        </p>
        <p>
          Tiedot saadaan pääosin sinulta itseltäsi tai sivuston käytöstä. Yritysten yhteyshenkilöiden
          tietoja voimme saada myös julkisista lähteistä, kuten yrityksen verkkosivuilta ja
          kaupparekisteristä.
        </p>
      </>
    ),
  },
  {
    n: 3,
    id: "tarkoitus",
    title: "Käsittelyn tarkoitukset ja oikeusperusteet",
    lyhyt: "Tarkoitukset",
    body: (
      <List
        items={[
          <>
            <b>Yhteydenottoihin ja tarjouspyyntöihin vastaaminen sekä kartoitusten järjestäminen.</b>{" "}
            Peruste: sopimuksen valmistelu (tietosuoja-asetuksen 6 artiklan 1 kohdan b alakohta).
          </>,
          <>
            <b>Palvelujen toimittaminen ja asiakassuhteen hoitaminen.</b> Peruste: sopimus (b
            alakohta).
          </>,
          <>
            <b>Rekrytointi.</b> Peruste: toimet hakijan pyynnöstä ennen sopimuksen tekemistä (b
            alakohta).
          </>,
          <>
            <b>Sivuston toiminta ja tietoturva.</b> Peruste: oikeutettu etu (f alakohta).
          </>,
          <>
            <b>Kävijäanalytiikka sekä mainonnan mittaaminen ja kohdentaminen.</b> Peruste: suostumus (a
            alakohta), jonka voit perua milloin tahansa.
          </>,
          <>
            <b>Markkinointi asiakkaille ja yhteistyökumppaneille.</b> Peruste: oikeutettu etu (f
            alakohta). Voit kieltää suoramarkkinoinnin milloin tahansa.
          </>,
          <>
            <b>Kirjanpito ja muut lakisääteiset velvoitteet.</b> Peruste: lakisääteinen velvoite (c
            alakohta).
          </>,
        ]}
      />
    ),
  },
  {
    n: 4,
    id: "evasteet",
    title: "Evästeet",
    lyhyt: "Evästeet",
    body: null /* renderoidaan page.tsx:ssa, koska siina on taulukko ja asetusnappi */,
  },
  {
    n: 5,
    id: "vastaanottajat",
    title: "Palveluntarjoajat ja tietojen luovutus",
    lyhyt: "Palveluntarjoajat",
    body: (
      <>
        <p>
          Seuraavat palveluntarjoajat käsittelevät tietoja meidän lukuumme ja sopimustemme mukaisesti:
        </p>
        <dl className="ts-kasittelijat">
          {KASITTELIJAT.map((k) => (
            <div key={k.nimi}>
              <dt>{k.nimi}</dt>
              <dd>{k.mita}</dd>
            </div>
          ))}
        </dl>
        <p>
          Meta Pixelin tietojen keräämisessä WS Media ja Meta ovat yhteisrekisterinpitäjiä. Meta käyttää
          tietoja myös omiin tarkoituksiinsa{" "}
          <Ulkoinen href="https://www.facebook.com/privacy/policy/">Metan tietosuojakäytännön</Ulkoinen>{" "}
          mukaisesti. Googlen käsittelystä kerrotaan{" "}
          <Ulkoinen href="https://policies.google.com/privacy?hl=fi">Googlen tietosuojakäytännössä</Ulkoinen>.
        </p>
        <p>
          Emme myy henkilötietoja. Viranomaisille luovutamme tietoja vain silloin, kun laki sitä
          edellyttää.
        </p>
      </>
    ),
  },
  {
    n: 6,
    id: "siirrot",
    title: "Siirrot EU:n ja ETA:n ulkopuolelle",
    lyhyt: "Siirrot EU:n ulkopuolelle",
    body: (
      <p>
        Google, Meta, Microsoft, Vercel ja Resend voivat käsitellä tietoja myös Yhdysvalloissa.
        Siirrot perustuvat EU:n ja Yhdysvaltojen väliseen tietosuojakehykseen (Data Privacy Framework),
        jos palveluntarjoaja on sitoutunut siihen. Muissa tapauksissa siirrot perustuvat Euroopan
        komission hyväksymiin vakiosopimuslausekkeisiin.
      </p>
    ),
  },
  {
    n: 7,
    id: "sailytys",
    title: "Kuinka kauan tietoja säilytetään",
    lyhyt: "Säilytysajat",
    body: (
      <>
        <List
          items={[
            "Yhteydenotot ja tarjouspyynnöt, jotka eivät johda asiakkuuteen: 12 kuukautta viimeisestä yhteydenpidosta.",
            "Kartoitusten kalenterimerkinnät: 12 kuukautta kartoituksen jälkeen.",
            "Työhakemukset: enintään kaksi vuotta haun päättymisestä, ellei hakijan kanssa sovita muuta.",
            "Asiakkuuden tiedot: asiakassuhteen ajan.",
            "Kirjanpitoaineisto: kirjanpitolain mukaan, eli kirjanpito ja tilinpäätös kymmenen vuotta tilikauden päättymisestä ja tositteet kuusi vuotta sen vuoden lopusta, jonka aikana tilikausi päättyi.",
            "Google Analyticsin kävijätiedot: enintään 14 kuukautta.",
            "Evästeet: kohdan 4 taulukon mukaisesti.",
          ]}
        />
        <p>Kun säilytysaika päättyy, tiedot poistetaan tai muutetaan sellaisiksi, ettei niistä voi tunnistaa henkilöä.</p>
      </>
    ),
  },
  {
    n: 8,
    id: "tietoturva",
    title: "Tietoturva",
    lyhyt: "Tietoturva",
    body: (
      <p>
        Sivusto ja sen lomakkeet käyttävät salattua HTTPS-yhteyttä. Tiedot säilytetään palveluissa,
        joihin pääsee vain henkilökohtaisilla tunnuksilla, ja pääsy on rajattu niille, jotka
        tarvitsevat tietoja työssään.
      </p>
    ),
  },
  {
    n: 9,
    id: "oikeudet",
    title: "Sinun oikeutesi",
    lyhyt: "Oikeutesi",
    body: (
      <>
        <p>Sinulla on oikeus:</p>
        <List
          items={[
            "saada tietää, mitä tietoja sinusta käsitellään, ja saada niistä kopio",
            "vaatia virheellisten tietojen korjaamista",
            "vaatia tietojesi poistamista",
            "vaatia käsittelyn rajoittamista",
            "vastustaa käsittelyä, joka perustuu oikeutettuun etuun, ja kieltää suoramarkkinointi",
            "siirtää antamasi tiedot toiseen järjestelmään",
            "perua suostumuksesi milloin tahansa, mikä ei vaikuta ennen perumista tehdyn käsittelyn lainmukaisuuteen",
          ]}
        />
        <p>
          Lähetä pyyntö osoitteeseen <a href="mailto:info@wsmedia.fi">info@wsmedia.fi</a>. Vastaamme
          viimeistään kuukauden kuluessa. Emme tee automaattisia päätöksiä, joilla olisi sinuun oikeudellisia tai
          niihin verrattavia vaikutuksia.
        </p>
        <p>
          Jos katsot, että tietojasi käsitellään lainvastaisesti, voit tehdä valituksen
          tietosuojavaltuutetun toimistolle (<Ulkoinen href="https://tietosuoja.fi">tietosuoja.fi</Ulkoinen>).
        </p>
      </>
    ),
  },
  {
    n: 10,
    id: "muutokset",
    title: "Muutokset",
    lyhyt: "Muutokset",
    body: (
      <p>
        Päivitämme selostetta, kun palvelumme tai lainsäädäntö muuttuvat. Seloste on päivitetty
        viimeksi {PAIVITETTY}.
      </p>
    ),
  },
];
