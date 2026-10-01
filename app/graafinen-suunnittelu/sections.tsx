import type { CSSProperties } from "react";

import type { ReactNode } from "react";

import { Kaiku } from "../components/Maasto";

/* ==================================================================
   MERKIT JA KUVIOT
   ==================================================================
   Sama periaate kuin verkkosivuilla: merkki kertoo mista kohta puhuu,
   kuvio nayttaa mekaniikan. Kuviot ovat taman sivun omia: logo ja
   varit, teippi auton kyljessa, tarra ikkunassa ja kortit viuhkana.
   Lampoinen (--lampo) on taman sivun palveluiden vari, syaani
   WS Median oma. Kuviot piirtyvat --rvp:sta, eli vierityksen
   mukana eika ajastimella. */
const IK: Record<string, ReactNode> = {
  kyna: (
    <>
      <path d="M12 3.5l6 6.5-6 10.5-6-10.5z" />
      <circle cx="12" cy="11.2" r="1.7" />
      <path d="M12 3.5v6" />
    </>
  ),
  auto: (
    <>
      <path d="M2.5 16.5v-9h11v9M13.5 10.5h3.8l3.2 3.2v2.8h-7" />
      <circle cx="6.5" cy="17.5" r="2" />
      <circle cx="16.5" cy="17.5" r="2" />
    </>
  ),
  liike: (
    <>
      <path d="M3.5 9.5l1.6-5h13.8l1.6 5M4.5 9.5v10h15v-10M3.5 9.5h17" />
      <path d="M9.5 19.5v-5.5h5v5.5" />
    </>
  ),
  kortit: (
    <>
      <rect x="3" y="8" width="13" height="9" rx="1.6" />
      <path d="M7.5 5h11.9A1.6 1.6 0 0 1 21 6.6V14" />
      <path d="M6 12.5h5" />
    </>
  ),
  rulla: (
    <>
      <circle cx="8" cy="11" r="5" />
      <circle cx="8" cy="11" r="1.6" />
      <path d="M8 16h13" />
    </>
  ),
  ok: <path d="M4.5 12.5l4.5 4.5L19.5 6.5" />,
  kyna2: (
    <>
      <path d="M4.5 19.5l4-1 11-11-3-3-11 11z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
};

function Merkki({ nimi, className = "gs-ik" }: { nimi: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {IK[nimi]}
    </svg>
  );
}

/* Kuviot: viewBox 160 x 48, kiintea kuvasuhde, joten pathLength=1 ja
   stroke-dasharray toimivat oikeassa mittakaavassa. */
const KUVIOT: ReactNode[] = [
  /* LOGO JA VARIT: kehys ja tunnus piirtyvat, sitten nelja varia
     syttyvat vuorotellen. */
  <>
    <rect className="gk-viiva" x="4" y="6" width="36" height="36" rx="9" pathLength={1} />
    <path className="gk-viiva gk-lampo" d="M14 31c2-10 14-4 16-14" pathLength={1} />
    <circle className="gk-pala gk-p1" cx="62" cy="24" r="8" />
    <circle className="gk-pala gk-p2" cx="84" cy="24" r="8" />
    <circle className="gk-pala gk-p3" cx="106" cy="24" r="8" />
    <circle className="gk-pala gk-p4" cx="128" cy="24" r="8" />
  </>,
  /* AUTO: kylki piirtyy, sitten teippi vedetaan sen paalle
     vasemmalta oikealle. */
  <>
    <path className="gk-viiva" d="M8 38V12h76v26M84 20h20l14 12v6H84" pathLength={1} />
    <circle className="gk-viiva" cx="28" cy="39" r="5" pathLength={1} />
    <circle className="gk-viiva" cx="100" cy="39" r="5" pathLength={1} />
    <path className="gk-teippi" d="M14 32L44 18h34" />
    <path className="gk-teippi gk-ohut" d="M20 36h56" />
  </>,
  /* IKKUNA: tarra painetaan lasiin, lasta kulkee sen yli. */
  <>
    <rect className="gk-rata" x="4" y="4" width="152" height="40" rx="3" />
    <rect className="gk-viiva" x="14" y="10" width="96" height="30" rx="2" pathLength={1} />
    <g className="gk-tarra">
      <circle cx="36" cy="25" r="8" />
      <path d="M52 21h42M52 29h28" />
    </g>
    <path className="gk-lasta" d="M18 8v34" />
    <path className="gk-rata" d="M122 10h22v30h-22z" />
  </>,
  /* KORTIT: pino levittyy viuhkaksi. */
  <>
    <rect className="gk-kortti gk-k1" x="63" y="12" width="34" height="24" rx="3" />
    <rect className="gk-kortti gk-k2" x="63" y="12" width="34" height="24" rx="3" />
    <rect className="gk-kortti gk-k3" x="63" y="12" width="34" height="24" rx="3" />
    <path className="gk-kortti-viiva" d="M69 19h12M69 24h18" />
  </>,
];

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
  ik: string;
  merkki?: string;
  h: string;
  kuvaus: string;
  li: string[];
  hl?: boolean;
}[] = [
  {
    ik: "rulla",
    h: "Teippaamo tai painotalo",
    kuvaus: "Tuottaa ja asentaa. Suunnittelu on sivutuote.",
    li: [
      "Suunnittelu usein vain yksinkertaisiin töihin",
      "Olettaa, että sinulla on valmis vektorilogo",
      "Ilme ei jatku nettisivuille eikä someen",
    ],
  },
  {
    ik: "ok",
    merkki: "WS Media",
    h: "Suunnittelemme ilmeen ja hoidamme tuotannon",
    kuvaus: "Suunnittelu, tuotanto ja asennus samassa tarjouksessa.",
    hl: true,
    li: [
      "Sama ilme nettisivuilla, somessa ja auton kyljessä",
      "Saat alkuperäistiedostot ja täydet käyttöoikeudet",
      "Vastaamme lopputuloksesta, myös alihankkijan työstä",
    ],
  },
  {
    ik: "kyna2",
    h: "Mainostoimisto",
    kuvaus: "Suunnittelee. Tuotanto ja asennus jäävät sinulle.",
    li: [
      "Painovalmis tiedosto on lopputulos",
      "Kilpailutat painon ja teippaamon itse",
      "Sovittelet aikataulut itse",
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
          Mainostoimisto vai teippaamo? Meiltä saat <span className="mark">molemmat.</span>
        </h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Mainostoimisto suunnittelee ja teippaamo asentaa. Väliin jää kysymyksiä, joihin kukaan ei
          vastaa: kuka tekee painovalmiit tiedostot, kuka sopii asennusajan ja kuka korjaa, jos auton
          kylki ei näytä luonnokselta. Yleensä ne jäävät yrittäjälle.
        </p>

        <div className="paketit porras rv">
          {SILTA.map((s) => (
            <div className={s.hl ? "paketti hl" : "paketti"} key={s.h}>
              {s.merkki ? <em className="paketti-merkki">{s.merkki}</em> : null}
              <div className="gs-otsikko">
                <Merkki nimi={s.ik} className={s.hl ? "gs-ik gs-ik-ws" : "gs-ik"} />
                <h3>{s.h}</h3>
              </div>
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
          Emme teippaa emmekä paina itse. Valitsemme tekijät, annamme heille oikeat tiedostot ja
          vastaamme siitä, että lopputulos vastaa hyväksymääsi luonnosta. Sinun ei tarvitse toimia
          projektipäällikkönä oman yrityksesi markkinoinnissa.
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
const PALVELUT: { ik: string; kick: string; h: string; p: string; li: string[]; px: string }[] = [
  {
    ik: "kyna",
    kick: "Perusta",
    h: "Logo ja yritysilme",
    p: "Logon suunnittelu on koko ilmeen pohja. Logon ympärille tehdään väripaletti, fontit ja graafinen ohjeisto, joiden ansiosta ilme pysyy samana, vaikka materiaalia tekisi joku muu.",
    li: [
      "Logopaketti kaikissa tarvittavissa tiedostomuodoissa",
      "Väriarvot painoon, näytölle ja teippiin",
      "Fontit otsikoille ja leipätekstille",
      "Graafinen ohjeisto PDF-tiedostona",
    ],
    px: "Logo alk. 490 € · ilme ohjeistoineen alk. 1 490 €",
  },
  {
    ik: "auto",
    kick: "Liikkuva pinta",
    h: "Auton mainosteippaus",
    p: "Pakettiauton logoteippauksesta koko kaluston ilmeeseen. Suunnittelu tehdään kerran, joten seuraavista autoista maksat vain tulostuksen ja asennuksen.",
    li: [
      "Logoteippaus, osateippaus ja yliteippaus",
      "Pakettiautot, henkilöautot ja kuorma-autot",
      "Koko kalusto samalla ilmeellä",
      "Asennus lämpimässä sisätilassa",
    ],
    px: "Avaimet käteen alk. 490 €",
  },
  {
    ik: "liike",
    kick: "Toimitila",
    h: "Ikkunateippaukset, kyltit ja valomainokset",
    p: "Liikkeen ikkuna ja julkisivu näkyvät ohikulkijoille joka päivä. Teemme ne samalla ilmeellä kuin muutkin materiaalisi.",
    li: [
      "Ikkuna- ja julkisivuteippaukset",
      "Valomainokset ja kyltit",
      "Opasteet ja lattiateippaukset",
      "Mainosluvan selvitys kunnalta",
    ],
    px: "Ikkunateippaus alk. 290 € · valomainos tarjouksen mukaan",
  },
  {
    ik: "kortit",
    kick: "Käteen jäävä",
    h: "Käyntikortit, esitteet ja roll-upit",
    p: "Suunnittelemme painotuotteet ja teetämme ne valmiiksi. Saat painovalmiit tiedostot myös itsellesi, jos haluat tilata lisäpainoksen myöhemmin muualta.",
    li: [
      "Käyntikortit ja kirjelomakkeet",
      "Flyerit, esitteet ja oppaat",
      "Roll-upit ja messumateriaalit",
      "Oikeat väriarvot painoa varten",
    ],
    px: "Suunnittelu alk. 190 € · painatus tarjouksen mukaan",
  },
];

function Pari({ osa, alku }: { osa: typeof PALVELUT; alku: number }) {
  return (
    <div className="duo2 gs-pari" style={{ marginTop: "48px" }} data-rvs="">
      {osa.map((o, j) => (
        <div className="duo2-col" key={o.h} style={{ "--i": j } as CSSProperties}>
          <div className="gs-yla">
            <Merkki nimi={o.ik} className="gs-ik gs-ik-kehys" />
            <p className="duo2-kick">{o.kick}</p>
          </div>
          <h3>{o.h}</h3>
          <p className="seo-body">{o.p}</p>
          <ul className="seo-spec porras rv">
            {o.li.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <svg className="gs-kuvio" viewBox="0 0 160 48" aria-hidden="true">
            {KUVIOT[alku + j]}
          </svg>
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
          Ilme suunnitellaan kerran ja sitä käytetään kaikkialla. Voit tilata koko kokonaisuuden tai
          vain sen osan, jonka tarvitset nyt.
        </p>

        <Pari osa={PALVELUT.slice(0, 2)} alku={0} />
        <Pari osa={PALVELUT.slice(2, 4)} alku={2} />
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
    "Käydään läpi, mihin ilmettä tarvitaan: montako autoa, mitkä toimitilat ja mitä painotuotteita.",
  ],
  [
    "WS Media",
    "Suunnittelu",
    "Teemme kaksi tai kolme ehdotusta, joista valitset suunnan. Valittua hiotaan yhdestä kahteen muutoskierrosta.",
  ],
  [
    "WS Media",
    "Painovalmiit tiedostot",
    "Vektorimuotoiset tiedostot, oikeat väriarvot ja mitat jokaiselle pinnalle erikseen.",
  ],
  [
    "Alihankinta · meidän vastuullamme",
    "Tuotanto ja asennus",
    "Valitsemme painon ja asentajan, sovimme aikataulun ja tarkistamme jäljen.",
  ],
  [
    "WS Media",
    "Luovutus",
    "Saat alkuperäistiedostot ja graafisen ohjeiston. Ilmettä saa käyttää ilman rajoituksia.",
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
        <h2 className="seo-h2 rv">Näin graafisen suunnittelun projekti etenee</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Sinulta tarvitaan kaksi hyväksyntää: suunnan valinta ja lopullinen luonnos. Kaiken muun
          hoidamme me, myös asioinnin painon ja asentajan kanssa.
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
  ["AI · EPS", "Muokattavat alkuperäistiedostot", "Muokattavat Illustratorissa, käytetään painossa ja teippauksessa"],
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
          <i>{TIEDOSTOT.length} tiedostoa sinulle</i>
        </div>
        <h2 className="seo-h2 rv">Mitä tiedostoja saat valmiista logosta ja ilmeestä?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Tämä jää alalla usein sopimatta. Meillä kaikki aineistot ja täydet käyttöoikeudet
          siirtyvät sinulle.
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
          Käyttöoikeuksista sovitaan kirjallisesti ennen työn alkua. Jos teetät myöhemmin
          lisäpainoksen tai teippaat seuraavan auton muualla, tiedostot toimivat sellaisenaan. Emme
          pidä aineistoja panttina.
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
/* Kestoikapalkki: vuodet asteikolla 0..7. Valomainoksen kesto on
   tunteja ja painotuotteilla kestoa ei ole, joten niilla palkkia ei
   piirreta. */
const IKA: ([number, number] | null)[] = [[3, 7], [5, 7], [3, 5], null, null];

const MATERIAALIT: [string, string, string, string][] = [
  [
    "Ajoneuvoteippaus",
    "Ammattitason tarrakalvo",
    "3–7 vuotta",
    "Asennus lämpimässä sisätilassa, pinta esikäsitellään",
  ],
  [
    "Yliteippaus",
    "Valettu värinvaihtokalvo",
    "5–7 vuotta",
    "Alkuperäinen maalipinta säilyy kalvon alla",
  ],
  [
    "Ikkuna- ja julkisivuteippaus",
    "Ikkunakalvo tai tarrateippi",
    "3–5 vuotta",
    "Erikoiskalvoilla myös häikäisy- ja UV-suoja",
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
        <h2 className="seo-h2 rv">Kuinka kauan teippaus kestää?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Halpa ja kallis tarjous eroavat yleensä materiaalissa. Kerromme tarjouksessa aina, mitä
          materiaalia käytetään ja kuinka kauan sen pitäisi kestää.
        </p>

        <table className="spec porras rv gs-ikataulu" style={{ marginTop: "48px" }} data-rvs="">
          <thead>
            <tr>
              <th scope="col">Kohde</th>
              <th scope="col">Materiaali</th>
              <th scope="col">Odotettu kestoikä</th>
              <th scope="col">Huomioitavaa</th>
            </tr>
          </thead>
          <tbody>
            {MATERIAALIT.map(([kohde, mat, ika, huom], r) => (
              <tr key={kohde}>
                <th scope="row">{kohde}</th>
                <td>{mat}</td>
                <td>
                  {ika}
                  {IKA[r] ? (
                    <span
                      className="gs-ika"
                      aria-hidden="true"
                      style={{ "--a": IKA[r]![0] / 7, "--b": IKA[r]![1] / 7, "--i": r } as CSSProperties}
                    >
                      <i />
                    </span>
                  ) : null}
                </td>
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
