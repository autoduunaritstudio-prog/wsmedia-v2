import NetBackdrop from "../../components/NetBackdrop";
import { Hakutulos, Koodi, Linkkiprofiili } from "./Artefaktit";
import { Maininnat } from "./Grafiikat";
import Ikoni from "./Ikoni";
import Kehotus from "./Kehotus";
import type { IkoniNimi } from "./Ikoni";

/**
 * NELJA OSA-ALUETTA ALLEKKAIN.
 *
 * Tassa oli vaakavieritys: pystyvieritys liikutti neljaa paneelia
 * sivusuunnassa pinnatussa osiossa. Mekaniikka toimi, mutta se oli
 * sivun raskain osa kolmella tavalla. Se kaappasi vierityksen 300
 * nakyman matkalta, se vaati oman kuuntelijansa ja rAF-silmukkansa, ja
 * se pakotti jokaisen paneelin mahtumaan yhteen nakymaan - mika taas
 * pakotti kuvan pieneksi ja tekstin tiiviiksi.
 *
 * Pystyasettelu tekee saman tyon ilman yhtaan noista. Lukija paattaa
 * itse tahdin, paneeli saa olla niin korkea kuin sen sisalto vaatii,
 * ja koodista poistui noin sata riviä tilanhallintaa. Nelja
 * rinnakkaista tyota lukee rinnakkaisina siita etta ne ovat
 * samannakoisia ja perakkain, ei siita etta ne liikkuvat sivusuunnassa.
 *
 * Ei "use client": komponentissa ei ole enaa yhtaan tilaa eika
 * efektia, joten se renderoityy palvelimella.
 */
type Rivi = [string, string];

/* Jokaisella paneelilla oma valokuva ja oma ikoni. Kuvat ovat
   tritonissa (musta - sininen - syaani), jolloin ne ovat sivun
   varimaailmassa mutta tuovat silti pinnan ja materiaalin jota
   hiusviiva ei voi tuoda. Aiheet on valittu niin, etta ne kertovat
   osa-alueesta suoraan: ristikytkentapaneeli teknisesta kunnosta,
   kortisto avainsanoista, arkistokansiot linkkiprofiilista ja
   varilliset kuidut koneluettavasta rakenteesta. */
const PANEELIT: {
  id: string;
  label: string;
  h: string;
  p: string;
  rows: Rivi[];
  ikoni: IkoniNimi;
}[] = [
  {
    id: "tekninen",
    ikoni: "rakenne",
    label: "Tekninen SEO",
    h: "Tekninen hakukoneoptimointi",
    p: "Tekninen SEO ratkaisee, pääseekö sisältösi ylipäätään hakukoneen indeksiin ja kuinka nopeasti sivu latautuu käyttäjälle. Tämä laitetaan kerran kuntoon ja pidetään kunnossa.",
    rows: [
      ["Indeksointi ja sivustokartta", "Robots.txt, XML-sivustokartta ja Search Consolen virheiden korjaus"],
      ["Sivuston nopeus ja Core Web Vitals", "Latausajat, kuvien optimointi ja renderöintiä estävät resurssit"],
      ["Otsikkorakenne ja metatiedot", "H1–H3-hierarkia, title-tagit ja kuvaukset sivu kerrallaan"],
      ["Strukturoitu data", "Schema.org-merkinnät: LocalBusiness, Service, FAQ ja artikkelit"],
      ["Sisäinen linkitys", "Sivut linkitetään niin, että tärkeimmät saavat eniten painoarvoa"],
      ["Uudelleenohjaukset ja rikkinäiset linkit", "404-virheiden monitorointi ja vanhojen osoitteiden ohjaus"],
    ],
  },
  {
    id: "sisalto",
    ikoni: "haku",
    label: "Sisältö ja avainsanat",
    h: "Sisältö ja avainsanat",
    p: "Avainsanatutkimus on koko työn kivijalka: se kertoo mitä asiakkaasi oikeasti kirjoittavat hakukenttään ja millä hauilla on ostoaikomus. Sisältö rakennetaan niiden ympärille, ei toisin päin.",
    rows: [
      ["Avainsanatutkimus", "Hakuvolyymit, kilpailutaso ja ostoaikomus jokaiselle hakusanalle"],
      ["Kilpailija-analyysi", "Mitkä sivut rankkaavat nyt, millä sisällöllä ja mitä niistä puuttuu"],
      ["Sivukohtainen kohdistus", "Yksi sivu, yksi pääavainsana, omat sivut eivät kilpaile keskenään"],
      ["Sisällön optimointi", "Otsikot, väliotsikot, leipätekstit ja kuvien alt-tekstit"],
      ["Uusi sisältö", "Palvelusivut, kaupunkisivut ja blogiartikkelit julkaisuvalmiina"],
      ["Vastausmuotoinen sisältö", "Kysymys ja suora vastaus, sama muoto toimii FAQ-tuloksissa ja tekoälyvastauksissa"],
    ],
  },
  {
    id: "auktoriteetti",
    ikoni: "linkki",
    label: "Auktoriteetti ja linkit",
    h: "Auktoriteetti ja linkit",
    p: "Ulkoiset linkit ovat hakukoneoptimoinnin työläin ja hitain osa-alue, ja juuri siksi ne erottavat kilpaillut hakusanat helpoista. Teemme sen ansaitsemalla, emme ostamalla.",
    rows: [
      ["Linkkiprofiilin analyysi", "Nykyiset linkit, niiden laatu ja mahdolliset haitalliset linkit"],
      ["Ansaitut maininnat", "Toimialamediat, yhteistyökumppanit, hakemistot ja paikalliset lähteet"],
      ["Sisältö, joka kerää linkkejä", "Oppaat ja vertailut, joihin muut viittaavat omasta aloitteestaan"],
      /* NAP-rivi poistettiin: 80 % sanatarkka paallekkaisyys Paikallinen-
         osion listan kanssa, ja yhteystietojen yhdenmukaisuus on
         paikallisen nakyvyyden asia eika linkkiprofiilin. */
      ["Ei ostettuja linkkejä", "Epäilyttävistä lähteistä ostetut linkit voivat johtaa Googlen rangaistustoimiin"],
    ],
  },
  {
    id: "tekoaly",
    ikoni: "kone",
    label: "Tekoälyhakunäkyvyys",
    h: "Näkyvyys tekoälyhauissa",
    p: "Yhä useampi haku päättyy tekoälyn koostamaan vastaukseen. Sama tekninen ja sisällöllinen pohja ratkaisee sielläkin, mutta painotukset ovat hieman eri.",
    rows: [
      /* "Strukturoitu data: kone lukee merkinnoista mita palvelua tarjoat,
         missa ja milla hinnalla" poistettiin: sama lause on sanatarkasti
         taman saman osion koodiartefaktin selitteessa (mitattu 57 %
         sanatarkkaa paallekkaisyytta), ja se rivi on jo Teknisen SEO:n
         paneelissa Schema.org-merkintoina. */
      ["Selkeä, lainattava rakenne", "Kysymys, suora vastaus ja perustelu, ei markkinointipuhetta vastauksen ympärillä"],
      ["Tarkistettavat faktat", "Hinnat, aikataulut ja toimitusehdot sivulla, ei pelkästään puhelimessa"],
      ["Auktoriteetti ja maininnat", "Mitä useammin sivustosi mainitaan luotettavissa lähteissä, sitä todennäköisemmin se päätyy vastaukseen"],
      ["Seuranta", "Seuraamme, mainitaanko yrityksesi vastauksissa toimialasi tärkeimmillä kysymyksillä"],
    ],
  },
];

/* Jokaiselle osa-alueelle sen OMA datagrafiikka, ei yhta toistuvaa
   kuvamuotoa. Tekninen SEO nayttaa auditointilistan, sisaltotyo
   avainsanataulukon, auktoriteetti nakyvyysmittarin ja tekoalynakyvyys
   mainintojen kehityksen. Nelja eri muotoa kertoo etta nama ovat nelja
   eri tyota, mika on osion koko vaite. */
/* ARTEFAKTI JOKAISELLE OSA-ALUEELLE.
   Ei kuvaa asiasta vaan se asia: tekninen SEO nayttaa sivuston oman
   strukturoidun datan, sisaltotyo hakutuloksen jollainen siita tulee,
   auktoriteettityo listan sivustoista jotka viittaavat, ja
   tekoalynakyvyys mainintojen kertymisen.

   Jokainen liittyy suoraan sen osion otsikkoon eika toimisi toisen
   alla. Se on ehto: siirrettava kuva on koriste. */
const ARTEFAKTIT = [
  <Koodi
    key="a"
    tiedosto="yrityksesi.fi/schema.jsonld"
    selite="Strukturoitu data kertoo koneelle mitä palvelua tarjoat, missä ja millä hinnalla. Ilman sitä hakukone arvaa."
    rivit={[
      { t: "{" , v: "merkki" },
      { t: '  "@type": ', v: "avain" },
      { t: '  "LocalBusiness",', v: "arvo" },
      { t: '  "name": "Yrityksesi Oy",', v: "arvo" },
      { t: '  "areaServed": "Espoo",', v: "arvo" },
      { t: '  "priceRange": "€€",', v: "arvo" },
      { t: '  "aggregateRating": {', v: "avain" },
      { t: '    "ratingValue": "4.9"', v: "arvo" },
      { t: "  }", v: "merkki" },
      { t: "}", v: "merkki" },
    ]}
  />,
  <Hakutulos
    key="b"
    polku="yrityksesi.fi › palvelut › ilmalämpöpumput"
    otsikko="Ilmalämpöpumpun asennus Espoossa | Yrityksesi Oy"
    kuvaus="Ilmalämpöpumpun asennus avaimet käteen Espoossa ja pääkaupunkiseudulla. Kiinteä hinta, asennus yhdessä päivässä, 5 vuoden takuu."
  />,
  <Linkkiprofiili key="c" />,
  <Maininnat key="d" />,
];

export default function Sisalto() {
  return (
    <section className="seo-sec" id="sisalto">
      {/* ELAVA TAUSTA. Osio on sivun pisin, ja pisin osio tasaisella
          pohjalla lukee tympeana riippumatta siita mita sen paalla on:
          mikaan ei kerro etta sivu etenee. Sama verkosto kuin
          Lyhytvideot-alasivulla, mount="cover" eli pinnattu kerros
          joka rajautuu TAHAN osioon eika seuraa koko sivua.
          Ruudukko on otettu siita pois: suoraa viivageometriaa oli jo
          liikaa, ja verkosto elaa ilman sitakin. */}
      <NetBackdrop mount="cover" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Palvelun sisältö</span>
          <i>Neljä rinnakkaista työtä</i>
        </div>
        <h2 className="seo-h2 rv">Mitä hakukoneoptimointi sisältää?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Hakukoneoptimointi yritykselle ei ole yksi toimenpide vaan neljä rinnakkaista työtä.
          Painotus vaihtelee sen mukaan, missä kunnossa sivusto on lähtiessä.
        </p>

        <div className="osat" data-rvs="">
          {PANEELIT.map((pa, idx) => (
            <article className="osa rv" id={pa.id} key={pa.id}>
              <div className="osa-yla">
                <div className="osa-gfx kohoa rv">{ARTEFAKTIT[idx]}</div>
                <div>
                  <div className="hs-otsikko">
                    <Ikoni nimi={pa.ikoni} i={idx} />
                    <h3>{pa.h}</h3>
                  </div>
                  <p className="hs-p">{pa.p}</p>
                </div>
              </div>
              <dl className="hs-rows porras rv">
                {pa.rows.map(([b, s]) => (
                  <div key={b}>
                    <dt>{b}</dt>
                    <dd>{s}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>

        <Kehotus kick="Neljä työtä, yksi tiimi">
          Kartoituksessa käymme läpi, mikä näistä neljästä on sinun sivustollasi
          pahiten kesken ja mistä kannattaa aloittaa.
        </Kehotus>
      </div>
    </section>
  );
}
