import type { ReactNode } from "react";

export type Section = {
  n: number;
  title: string;
  body: ReactNode;
};

/** Luettelo, jota kaytetaan osioiden sisalla. */
function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="ts-list">
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  );
}

export const SECTIONS: Section[] = [
  {
    n: 1,
    title: "Rekisterinpitäjä",
    body: (
      <address className="ts-address">
        WS Media Oy
        <br />
        Y-tunnus: 3615084-4
        <br />
        Kuusiniementie 8 A 3, 02710 Espoo
        <br />
        <a href="mailto:info@wsmedia.fi">info@wsmedia.fi</a>
        <br />
        <a href="tel:+358405648770">040 564 8770</a>
      </address>
    ),
  },
  {
    n: 2,
    title: "Yhteyshenkilö tietosuoja-asioissa",
    body: (
      <p>
        Tuomas Ivanov, <a href="mailto:info@wsmedia.fi">info@wsmedia.fi</a>
      </p>
    ),
  },
  {
    n: 3,
    title: "Rekisterin nimi",
    body: (
      <p>
        WS Media Oy:n asiakas- ja markkinointirekisteri sekä verkkosivuston kävijätietojen
        käsittely.
      </p>
    ),
  },
  {
    n: 4,
    title: "Henkilötietojen käsittelyn tarkoitus ja oikeusperuste",
    body: (
      <>
        <p>Käsittelemme henkilötietoja seuraaviin tarkoituksiin:</p>
        <List
          items={[
            "Tarjouspyyntöjen ja yhteydenottojen käsittely (oikeusperuste: sopimuksen valmistelu, GDPR 6 art. 1 b)",
            "Asiakassuhteen hoitaminen ja palveluiden toimittaminen (oikeusperuste: sopimus, GDPR 6 art. 1 b)",
            "Markkinointi ja sivuston kehittäminen (oikeusperuste: oikeutettu etu, GDPR 6 art. 1 f, tai suostumus evästeiden osalta, GDPR 6 art. 1 a)",
            "Verkkosivuston kävijäanalytiikka ja mainonnan kohdentaminen (oikeusperuste: suostumus, kerätään evästesuostumusbannerin kautta)",
            "Lakisääteisten velvoitteiden täyttäminen, kuten kirjanpitolaki (oikeusperuste: lakisääteinen velvoite, GDPR 6 art. 1 c)",
          ]}
        />
      </>
    ),
  },
  {
    n: 5,
    title: "Käsiteltävät henkilötietoryhmät",
    body: (
      <>
        <p className="ts-sub">Yhteydenottolomakkeen ja tarjouspyyntöjen kautta:</p>
        <List
          items={[
            "Nimi",
            "Sähköpostiosoite",
            "Puhelinnumero",
            "Yrityksen nimi (jos annettu)",
            "Paikkakunta",
            "Viestin tai tarjouspyynnön sisältö",
          ]}
        />
        <p className="ts-sub">
          Verkkosivuston kävijätiedot (evästeiden ja seurantatyökalujen kautta, kävijän
          suostumuksella):
        </p>
        <List
          items={[
            "IP-osoite (osittain anonymisoituna, jos käytössä Google Analytics 4:n oletusasetukset)",
            "Selain- ja laitetiedot",
            "Sivustokäyttäytyminen (vieraillut sivut, viipymäaika, klikkaukset)",
            "Liikenteen lähde (esim. mistä kävijä saapui sivustolle)",
          ]}
        />
        <p className="ts-sub">Asiakassuhteen aikana:</p>
        <List items={["Laskutus- ja sopimustiedot", "Viestintähistoria"]} />
      </>
    ),
  },
  {
    n: 6,
    title: "Säännönmukaiset tietolähteet",
    body: (
      <>
        <p>
          Tiedot saadaan pääosin rekisteröidyltä itseltään: yhteydenottolomakkeet, sähköposti,
          puhelinkeskustelut ja sopimuksen solmimisen yhteydessä.
        </p>
        <p>
          Verkkosivuston kävijätietoja kerätään evästeiden ja vastaavien seurantateknologioiden
          avulla kävijän suostumuksella.
        </p>
      </>
    ),
  },
  {
    n: 8,
    title: "Tietojen luovutus ja siirto EU:n/ETA:n ulkopuolelle",
    body: (
      <>
        <p>
          Emme myy tai luovuta henkilötietoja kolmansille osapuolille markkinointitarkoituksiin
          ilman suostumusta. Käytämme seuraavia palveluntarjoajia, jotka voivat käsitellä tietoja
          osana palveluaan:
        </p>
        <List
          items={[
            "Google Ireland Limited (Google Analytics) — tiedot voivat siirtyä EU:n/ETA:n ulkopuolelle Googlen EU:n komission hyväksymien vakiosopimuslausekkeiden (SCC) nojalla",
            "Meta Platforms Ireland Limited (Meta Pixel) — vastaavasti SCC-lausekkeiden nojalla",
            "[Muut käytössä olevat kolmannen osapuolen palvelut, esim. sähköpostimarkkinointi, laskutusjärjestelmä]",
          ]}
        />
      </>
    ),
  },
  {
    n: 9,
    title: "Henkilötietojen säilytysaika",
    body: (
      <List
        items={[
          "Tarjouspyynnöt ja yhteydenotot: [esim. 12 kuukautta, ellei johda asiakassuhteeseen]",
          "Asiakassuhteen tiedot: asiakassuhteen keston ajan sekä kirjanpitolain edellyttämät 6 vuotta tilikauden päättymisestä",
          "Verkkosivuston analytiikkatiedot: [Google Analyticsin oletusasetus tai erikseen määritelty, esim. 14 kuukautta]",
        ]}
      />
    ),
  },
  {
    n: 10,
    title: "Rekisterin suojauksen periaatteet",
    body: (
      <p>
        Henkilötietoja säilytetään sähköisesti pääsynhallinnalla suojatuissa järjestelmissä. Pääsy
        tietoihin on rajattu vain niille henkilöille, joiden työtehtävät sitä edellyttävät.
        [Tarkenna käytössä olevat järjestelmät ja suojaustoimet, esim. palveluntarjoajien
        tietoturvasertifioinnit.]
      </p>
    ),
  },
  {
    n: 11,
    title: "Rekisteröidyn oikeudet",
    body: (
      <>
        <p>Sinulla on GDPR:n mukaisesti oikeus:</p>
        <List
          items={[
            "saada tietoa henkilötietojesi käsittelystä",
            "tarkastaa itseäsi koskevat tiedot",
            "vaatia virheellisen tiedon oikaisua",
            "vaatia tietojen poistamista (”oikeus tulla unohdetuksi”)",
            "rajoittaa tietojesi käsittelyä",
            "siirtää tiedot järjestelmästä toiseen (tietojen siirrettävyys)",
            "vastustaa tietojesi käsittelyä, mukaan lukien suoramarkkinointi",
            "peruuttaa antamasi suostumus milloin tahansa vaikuttamatta ennen peruutusta tapahtuneen käsittelyn lainmukaisuuteen",
          ]}
        />
        <p>Näiden oikeuksien käyttämiseksi ota yhteyttä: [sähköposti]</p>
        <p>
          Sinulla on myös oikeus tehdä valitus valvontaviranomaiselle, jos katsot että
          henkilötietojesi käsittelyssä on rikottu voimassa olevaa tietosuojalainsäädäntöä. Suomessa
          valvontaviranomainen on tietosuojavaltuutetun toimisto (
          <a href="https://tietosuoja.fi" target="_blank" rel="noopener noreferrer">
            tietosuoja.fi
          </a>
          ).
        </p>
      </>
    ),
  },
  {
    n: 12,
    title: "Muutokset tietosuojaselosteeseen",
    body: (
      <>
        <p>
          Pidätämme oikeuden päivittää tätä tietosuojaselostetta esimerkiksi lainsäädännön
          muuttuessa tai palveluidemme kehittyessä. Suosittelemme tarkistamaan tämän sivun
          ajoittain.
        </p>
        <p>Tämä seloste on päivitetty viimeksi: [pvm]</p>
      </>
    ),
  },
];

/** Osio 7 renderoidaan erikseen, koska siina on taulukko. */
export const COOKIE_ROWS = [
  {
    service: "Google Analytics 4",
    purpose: "Kävijäanalytiikka, sivuston kehittäminen",
    processor: "Google Ireland Limited",
  },
  {
    service: "Meta Pixel",
    purpose: "Mainonnan kohdentaminen ja mittaaminen (Facebook/Instagram)",
    processor: "Meta Platforms Ireland Limited",
  },
  {
    service: "[Muut, esim. Formspree lomakkeille]",
    purpose: "[Tarkoitus]",
    processor: "[Käsittelijä]",
  },
];
