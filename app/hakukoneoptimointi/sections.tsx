import type { CSSProperties } from "react";

import SmartLink from "../components/SmartLink";
import Tabs from "../components/Tabs";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/* ---------- Näkyvyys 2026 ---------- */
export function Nakyvyys() {
  return (
    <section id="nakyvyys" style={{ paddingTop: "96px" }}>
      <div className="wrap">
        <div className="hsplit rv">
          <div>
            <span className="kick">Näkyvyys 2026</span>
            <h2>Asiakas ei enää kysy pelkältä Googlelta.</h2>
          </div>
          <p className="sub">
            Osa hauista päättyy yhä hakutuloslistaan, osa tekoälyn koostamaan valmiiseen vastaukseen.
            Sama työ ratkaisee molemmissa — mutta vain jos sisältö on rakennettu niin, että kone
            löytää siitä vastauksen.
          </p>
        </div>

        <div className="duel stagger">
          <div className="dcard rv" style={i(0)}>
            <p className="dk">Hakutulokset</p>
            <h3>Orgaaninen näkyvyys Googlessa</h3>
            <p>
              Klassinen hakukoneoptimointi: sijoitus hakutuloksissa ratkaisee, kenen sivulle asiakas
              klikkaa.
            </p>
            <ul>
              {[
                "Sijoitus ratkaisee klikkauksen — ensimmäisen sivun ulkopuolelle ei juuri eksytä",
                "Näkyvyys ei lopu siihen päivään, kun mainosbudjetti loppuu",
                "Yksi hyvin tehty sivu voi sijoittua kymmenillä hakusanoilla",
                "Tulos kertyy kumulatiivisesti kuukausi kuukaudelta",
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>

          <div className="dcard ai rv" style={i(1)}>
            <p className="dk">Tekoälyhaku</p>
            <h3>Näkyvyys vastauksissa, ei vain listassa</h3>
            <p>
              Tekoäly kokoaa vastauksen useasta lähteestä ja mainitsee ne. Kilpailu käydään siitä,
              kuka pääsee lähteeksi.
            </p>
            <ul>
              {[
                "Jos sivustoasi ei mainita, yritystäsi ei ole siinä keskustelussa",
                "Sijoituksen sijaan ratkaisee, onko sisältösi riittävän selkeä lainattavaksi",
                "Strukturoitu data kertoo koneelle mitä palvelua tarjoat, missä ja millä hinnalla",
                "Auktoriteetti siirtyy: sama sisältö joka rankkaa, myös siteerataan",
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="duelnote rv">
          Käytännössä nämä eivät ole kaksi eri projektia.{" "}
          <strong>
            Selkeä sivurakenne, tekninen kunto, strukturoitu data ja sisältö joka vastaa kysymykseen
            suoraan
          </strong>{" "}
          parantavat molempia yhtä aikaa. Suurin ero on painotuksessa: hakutuloksissa tavoitellaan
          sijoitusta, tekoälyvastauksissa sitä, että sisältösi on niin selkeää ja tarkistettavaa,
          että kone uskaltaa nojata siihen.
        </p>
      </div>
    </section>
  );
}

/* ---------- Palvelun sisältö: välilehdet ---------- */
type Row = [string, string];

const PANELS: { id: string; label: string; h: string; p: string; rows: Row[] }[] = [
  {
    id: "tekninen",
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
    label: "Sisältö ja avainsanat",
    h: "Sisältö ja avainsanat",
    p: "Avainsanatutkimus on koko työn kivijalka: se kertoo mitä asiakkaasi oikeasti kirjoittavat hakukenttään ja millä hauilla on ostoaikomus. Sisältö rakennetaan niiden ympärille, ei toisin päin.",
    rows: [
      ["Avainsanatutkimus", "Hakuvolyymit, kilpailutaso ja ostoaikomus jokaiselle hakusanalle"],
      ["Kilpailija-analyysi", "Mitkä sivut rankkaavat nyt, millä sisällöllä ja mitä niistä puuttuu"],
      ["Sivukohtainen kohdistus", "Yksi sivu, yksi pääavainsana — omat sivut eivät kilpaile keskenään"],
      ["Sisällön optimointi", "Otsikot, väliotsikot, leipätekstit ja kuvien alt-tekstit"],
      ["Uusi sisältö", "Palvelusivut, kaupunkisivut ja blogiartikkelit julkaisuvalmiina"],
      ["Vastausmuotoinen sisältö", "Kysymys ja suora vastaus — sama muoto toimii FAQ-tuloksissa ja tekoälyvastauksissa"],
    ],
  },
  {
    id: "auktoriteetti",
    label: "Auktoriteetti ja linkit",
    h: "Auktoriteetti ja linkit",
    p: "Ulkoiset linkit ovat hakukoneoptimoinnin työläin ja hitain osa-alue, ja juuri siksi ne erottavat kilpaillut hakusanat helpoista. Teemme sen ansaitsemalla, emme ostamalla.",
    rows: [
      ["Linkkiprofiilin analyysi", "Nykyiset linkit, niiden laatu ja mahdolliset haitalliset linkit"],
      ["Ansaitut maininnat", "Toimialamediat, yhteistyökumppanit, hakemistot ja paikalliset lähteet"],
      ["Sisältö, joka kerää linkkejä", "Oppaat ja vertailut, joihin muut viittaavat omasta aloitteestaan"],
      ["Yritystiedot ja NAP-tiedot", "Nimi, osoite ja puhelinnumero täsmälleen samoina kaikkialla verkossa"],
      ["Ei ostettuja linkkejä", "Epäilyttävistä lähteistä ostetut linkit voivat johtaa Googlen rangaistustoimiin"],
    ],
  },
  {
    id: "tekoaly",
    label: "Tekoälyhakunäkyvyys",
    h: "Näkyvyys tekoälyhauissa",
    p: "Yhä useampi haku päättyy tekoälyn koostamaan vastaukseen. Sama tekninen ja sisällöllinen pohja ratkaisee sielläkin, mutta painotukset ovat hieman eri.",
    rows: [
      ["Selkeä, lainattava rakenne", "Kysymys, suora vastaus ja perustelu — ei markkinointipuhetta vastauksen ympärillä"],
      ["Strukturoitu data", "Kone lukee merkinnöistä mitä palvelua tarjoat, missä ja millä hinnalla"],
      ["Tarkistettavat faktat", "Hinnat, aikataulut ja toimitusehdot sivulla, ei pelkästään puhelimessa"],
      ["Auktoriteetti ja maininnat", "Mitä useammin sivustosi mainitaan luotettavissa lähteissä, sitä todennäköisemmin se päätyy vastaukseen"],
      ["Seuranta", "Seuraamme, mainitaanko yrityksesi vastauksissa toimialasi tärkeimmillä kysymyksillä"],
    ],
  },
];

export function Sisalto() {
  return (
    <section id="sisalto" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead rv" data-par="0.03">
          <span className="kick">Palvelun sisältö</span>
          <h2>Mitä hakukoneoptimointi sisältää?</h2>
          <p className="sub">
            Hakukoneoptimointi yritykselle ei ole yksi toimenpide vaan neljä rinnakkaista työtä.
            Painotus vaihtelee sen mukaan, missä kunnossa sivusto on lähtiessä.
          </p>
        </div>

        <Tabs
          label="Hakukoneoptimoinnin osa-alueet"
          tabs={PANELS.map((p) => ({
            id: p.id,
            label: p.label,
            content: (
              <div className="tabgrid">
                <div>
                  <h3>{p.h}</h3>
                  <p>{p.p}</p>
                </div>
                <ul>
                  {p.rows.map(([b, s]) => (
                    <li key={b}>
                      {b}
                      <s>{s}</s>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          }))}
        />
      </div>
    </section>
  );
}

/* ---------- Aikajänne ---------- */
const ROAD = [
  ["Kuukausi 1", "Kartoitus ja perusta", "Auditointi, avainsanatutkimus ja kilpailija-analyysi. Tekniset virheet korjataan ja mittaus laitetaan kuntoon. Näkyvyydessä ei vielä tapahdu mitään."],
  ["Kuukaudet 2–3", "Ensimmäiset liikahdukset", "Optimoidut sivut alkavat nousta pitkän hännän hauilla. Search Consolessa näyttökerrat kasvavat ennen klikkauksia — suunta näkyy ennen tuloksia."],
  ["Kuukaudet 4–6", "Liikenne kääntyy", "Sijoitukset tärkeimmillä hakusanoilla paranevat ja orgaaninen liikenne kasvaa. Ensimmäiset hakukoneen kautta tulleet yhteydenotot ovat tässä vaiheessa tyypillisiä."],
  ["Kuukaudet 6–12", "Vaikutus liiketoiminnassa", "Kilpaillummat hakusanat nousevat ja kertynyt sisältö alkaa tuottaa itsestään. Tässä vaiheessa työn tuotto on mitattavissa euroina, ei kävijöinä."],
];

export function Aikataulu() {
  return (
    <section id="aikataulu" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="hsplit rv">
          <div>
            <span className="kick">Aikajänne</span>
            <h2>Milloin hakukoneoptimointi alkaa näkyä?</h2>
          </div>
          <p className="sub">
            Rehellinen vastaus on, ettei kukaan voi luvata päivämäärää. Tämä on kuitenkin se
            järjestys, jossa asiat käytännössä tapahtuvat.
          </p>
        </div>

        <div className="road stagger rv">
          {ROAD.map(([t, h, p], idx) => (
            <div className="rstep" style={i(idx)} key={h}>
              <p className="rt">{t}</p>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>

        <p className="roadnote rv">
          Aikataulu riippuu kahdesta asiasta: kuinka kilpailtu toimialasi on ja missä kunnossa
          sivusto on lähtiessä. Vähemmän kilpailluilla hakusanoilla tuloksia tulee nopeammin,
          kovimmilla nousu vie enemmän aikaa.{" "}
          <strong>Emme lupaa sijaa yksi emmekä tiettyä prosenttia.</strong> Sovimme mittarit
          etukäteen ja raportoimme ne kuukausittain — myös silloin kun luvut eivät miellytä.
        </p>
      </div>
    </section>
  );
}

/* ---------- Paikallinen SEO ---------- */
const LOC_CITIES: [string, string][] = [
  ["/hakukoneoptimointi/espoo", "Hakukoneoptimointi Espoo"],
  ["/hakukoneoptimointi/helsinki", "Helsinki"],
  ["/hakukoneoptimointi/vantaa", "Vantaa"],
  ["/hakukoneoptimointi/tampere", "Tampere"],
  ["/hakukoneoptimointi/turku", "Turku"],
  ["/hakukoneoptimointi/oulu", "Oulu"],
  ["/hakukoneoptimointi/lahti", "Lahti"],
  ["/hakukoneoptimointi/kuopio", "Kuopio"],
  ["/hakukoneoptimointi/pori", "Pori"],
  ["/hakukoneoptimointi/joensuu", "Joensuu"],
];

export function Paikallinen() {
  return (
    <section id="paikallinen" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="locwrap">
          <div className="rv" data-par="0.02">
            <span className="kick">Paikallinen hakukoneoptimointi</span>
            <h2 style={{ marginTop: "12px" }}>
              ”Palvelu + paikkakunta” on se haku, jolla ostetaan
            </h2>
            <p className="lead">
              Kun asiakas kirjoittaa hakukenttään palvelun ja paikkakunnan, hän on jo päättänyt
              ostaa. Paikallinen hakukoneoptimointi ratkaisee, näytkö siinä hetkessä karttatuloksissa
              ja hakutuloslistalla.
            </p>
            <ul className="locl">
              {[
                "Google-yritysprofiili kuntoon: kategoriat, palvelut, aukioloajat ja kuvat",
                "Karttatulokset eli Local Pack — kolme ensimmäistä saa valtaosan klikkauksista",
                "NAP-tiedot: nimi, osoite ja puhelinnumero täsmälleen samoina kaikkialla",
                "Arvostelut ja systemaattinen tapa pyytää niitä tyytyväisiltä asiakkailta",
                "Oma sivu jokaiselle paikkakunnalle, jossa palvelette",
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>

          <div className="rv" data-par="-0.02">
            <div className="lpack">
              <div className="lmap" aria-hidden="true">
                <svg viewBox="0 0 400 170" preserveAspectRatio="xMidYMid slice" fill="none">
                  <rect width="400" height="170" fill="#eef1f5" />
                  <path d="M0 40 H400 M0 96 H400 M0 140 H400" stroke="#dfe4ea" strokeWidth="8" />
                  <path d="M70 0 V170 M190 0 V170 M300 0 V170" stroke="#dfe4ea" strokeWidth="8" />
                  <rect x="14" y="8" width="42" height="24" rx="3" fill="#e4e9ef" />
                  <rect x="86" y="50" width="88" height="34" rx="3" fill="#e4e9ef" />
                  <rect x="208" y="8" width="76" height="24" rx="3" fill="#e4e9ef" />
                  <rect x="316" y="106" width="70" height="28" rx="3" fill="#e4e9ef" />
                  <rect x="14" y="106" width="42" height="28" rx="3" fill="#e4e9ef" />
                  <path
                    d="M0 118 C90 100, 150 132, 240 112 S 360 90, 400 104"
                    stroke="#d3dce6"
                    strokeWidth="7"
                    fill="none"
                  />
                </svg>
                <span className="lpulse" />
                <span className="lpin" />
              </div>
              <div className="lrow us">
                <span className="lb">1</span>
                <span>
                  <b>Yrityksesi Oy</b>
                  <s>4,9 ★ · Avoinna · 1,2 km</s>
                </span>
                <span className="st">Sinä</span>
              </div>
              <div className="lrow">
                <span className="lb">2</span>
                <span>
                  <b>Kilpailija Oy</b>
                  <s>4,5 ★ · Avoinna · 2,8 km</s>
                </span>
              </div>
              <div className="lrow">
                <span className="lb">3</span>
                <span>
                  <b>Toinen kilpailija</b>
                  <s>4,2 ★ · Suljettu · 4,1 km</s>
                </span>
              </div>
            </div>

            <p className="lead" style={{ marginTop: "24px", fontSize: "var(--text-body)" }}>
              <strong>Kaupunkisivut eivät maksa kappaleittain.</strong> Rakennamme ne yhdestä
              pohjasta, joten viisi tai viisikymmentä paikkakuntaa maksaa saman verran — ja jokainen
              niistä on oma rankattava sivunsa omalla hakusanallaan.
            </p>

            <div className="cities">
              {LOC_CITIES.map(([href, label]) => (
                <SmartLink href={href} key={href}>
                  {label}
                </SmartLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Mittarit ---------- */
const METRICS = [
  ["Sijoitukset seuratuilla hakusanoilla", "Missä olet nyt ja mihin suuntaan liikutaan. Seurattavat hakusanat sovitaan yhdessä.", "Sijoitusseuranta"],
  ["Näyttökerrat ja klikkiprosentti", "Näkyykö sivusto hauissa ja klikataanko sitä. Näyttökerrat kasvavat aina ennen klikkauksia.", "Search Console"],
  ["Orgaaninen liikenne", "Kuinka moni saapuu sivustolle hakukoneen kautta, ja mille sivuille.", "Google Analytics"],
  ["Yhteydenotot ja konversiot", "Mitä liikenteestä seuraa. Tämä on lopulta ainoa luku, joka ratkaisee kannattiko työ.", "Google Analytics"],
  ["Indeksoidut sivut ja tekniset virheet", "Pääseekö sisältö hakukoneeseen ollenkaan. Yksi väärä asetus voi piilottaa koko sivuston.", "Search Console"],
  ["Maininnat tekoälyvastauksissa", "Siteerataanko sivustoasi, kun toimialasi tärkeimmät kysymykset esitetään tekoälylle.", "Manuaalinen seuranta"],
];

export function Mittarit() {
  return (
    <section id="mittarit" style={{ paddingTop: "20px", paddingBottom: 0 }}>
      <div className="report">
        <div className="wrap">
          <div className="hsplit rv">
            <div>
              <span className="kick">Mittarit</span>
              <h2>Kun emme lupaa tuloksia, näytämme luvut.</h2>
            </div>
            <p className="sub">
              Nämä kuusi mittaria sovitaan ennen aloitusta ja raportoidaan sovitussa syklissä. Saat
              pääsyn samoihin työkaluihin, joista luvut tulevat.
            </p>
          </div>

          <div className="mrows rv">
            {METRICS.map(([b, p, tool]) => (
              <div className="mrow" key={b}>
                <b>{b}</b>
                <p>{p}</p>
                <span className="tool">{tool}</span>
              </div>
            ))}
          </div>

          <div className="rcad rv">
            {["Raportti kuukausittain", "Strategiapuhelu sovitusti", "Pääsy kaikkiin työkaluihin", "Ei mystisiä laskuja ilman raporttia"].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
