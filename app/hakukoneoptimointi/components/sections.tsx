import BudgetForm from "../../components/BudgetForm";
import SmartLink from "../../components/SmartLink";
import { FAQ_GROUPS } from "../faq";

import Ikoni from "./Ikoni";
import { Kaiku } from "./Maasto";

import type { ReactNode } from "react";

/* ==================================================================
   AIKAJANNE  ·  mittari, ei laatikkorivi
   ==================================================================
   Osio oli nelja laatikkoa rinnakkain, joissa jokaisessa luki
   kuukausivali otsikkona. Neljasta laatikosta ei nay se mika osion
   koko pointti on: etta nama ovat saman janan peraikkaisia jaksoja ja
   etta jaksot ovat ERI PITUISIA. "Kuukausi 1" ja "kuukaudet 6-12" ovat
   yhtä leveita laatikoita mutta 1 ja 6 kuukautta pitkia jaksoja.

   Nyt jaksot ovat yhdella janalla ja niiden LEVEYS on niiden kesto.
   Jana on samalla mittari: sen taytto kasvaa vierityksen mukana, mika
   on tasan se mita osio kuvaa - aika kuluu ja tulos kertyy.

   Jana oli aiemmin sidottu vieritykseen (data-rvs), jolloin sen taytto
   kasvoi sita mukaa kun osio nousi nakymaan. Vierityksen ohjaamat
   mekaniikat karsittiin sivulta, joten jana on nyt taysi heti. Sen
   tehtava oli aina nayttaa jaksojen SUHTEELLISET PITUUDET, ja se
   tehtava ei vaatinut liikettä. */
const JANA: { kk: string; leveys: number; h: string; p: string }[] = [
  {
    kk: "Kuukausi 1",
    leveys: 1,
    h: "Kartoitus ja perusta",
    p: "Auditointi, avainsanatutkimus ja kilpailija-analyysi. Tekniset virheet korjataan ja mittaus laitetaan kuntoon. Näkyvyydessä ei vielä tapahdu mitään.",
  },
  {
    kk: "Kuukaudet 2–3",
    leveys: 2,
    h: "Ensimmäiset liikahdukset",
    p: "Optimoidut sivut alkavat nousta pitkän hännän hauilla. Search Consolessa näyttökerrat kasvavat ennen klikkauksia, suunta näkyy ennen tuloksia.",
  },
  {
    kk: "Kuukaudet 4–6",
    leveys: 3,
    h: "Liikenne kääntyy",
    p: "Sijoitukset tärkeimmillä hakusanoilla paranevat ja orgaaninen liikenne kasvaa. Ensimmäiset hakukoneen kautta tulleet yhteydenotot ovat tässä vaiheessa tyypillisiä.",
  },
  {
    kk: "Kuukaudet 6–12",
    leveys: 6,
    h: "Vaikutus liiketoiminnassa",
    p: "Kilpaillummat hakusanat nousevat ja kertynyt sisältö alkaa tuottaa itsestään. Tässä vaiheessa työn tuotto on mitattavissa euroina, ei kävijöinä.",
  },
];

/* KAANNETTY OSIO ON VALIMERKKI. Sivu on siihen asti ollut vaalea
   neljan osion ajan, ja aikajanne on sen luonteva katkokohta: se on
   ainoa osio joka ei kuvaa tyota vaan sen kulkua. Musta pohja pysayttaa
   vierityksen ilman etta mitaan tarvitsee lisata, ja syaani saa siina
   vihdoin olla otsikkovari (13,19:1) eika pelkka taustapala. */
export function Aikataulu() {
  return (
    <section className="seo-sec" id="aikataulu" data-tone="ink">
      <Kaiku sana="12 KK" puoli="oik" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Aikajänne</span>
          <i>12 kuukautta</i>
        </div>
        <h2 className="seo-h2 rv">Milloin hakukoneoptimointi alkaa näkyä?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Rehellinen vastaus on, ettei kukaan voi luvata päivämäärää. Tämä on kuitenkin se
          järjestys, jossa asiat käytännössä tapahtuvat.
        </p>

        <div className="jana">
          <div className="jana-akseli" aria-hidden="true">
            <i />
          </div>
          <div className="jana-jaksot porras rv">
            {JANA.map((j) => (
              <div className="jakso" style={{ "--kk": j.leveys } as React.CSSProperties} key={j.h}>
                <p className="jakso-kk">{j.kk}</p>
                <h3>{j.h}</h3>
                <p className="jakso-p">{j.p}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="seo-body jana-note">
          Aikataulu riippuu kahdesta asiasta: kuinka kilpailtu toimialasi on ja missä kunnossa
          sivusto on lähtiessä. Vähemmän kilpailluilla hakusanoilla tuloksia tulee nopeammin,
          kovimmilla nousu vie enemmän aikaa.{" "}
          <strong>Emme lupaa sijaa yksi emmekä tiettyä prosenttia.</strong> Sovimme mittarit
          etukäteen ja raportoimme ne kuukausittain, myös silloin kun luvut eivät miellytä.
        </p>
      </div>
    </section>
  );
}

/* ==================================================================
   PAIKALLINEN  ·  karttatulosmalli sailyy, kehys vaihtuu
   ==================================================================
   Karttatulosmalli on sivun toinen oikea demo SearchDemon rinnalla, ja
   se nayttaa tasan sen mita osio myy: kolme ensimmaista karttatulosta.
   Se sailyy sellaisenaan. Vain kehys vaihtuu taman sivun omaksi:
   hiusviivat, mono-mikrolabelit, ei pyoristyksia. */
const KAUPUNGIT: [string, string][] = [
  ["/hakukoneoptimointi/espoo", "Espoo"],
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
    <section className="seo-sec kuvapohja" id="paikallinen">
      {/* KATUKUVA POIS. Se oli taysleveä kuva heti osion alussa, ja
          sen ylapuolella oli viela toinen kuva: lukijalle se nayttti
          silta etta sama tausta toistuu kahdesti. Yksi kuva riittaa,
          ja se kuuluu osion POHJAKSI eika sen ylapuolelle.

          Ilmakuva yosta: kadut piirtyvat valoina tummien korttelien
          lapi ja kuvio lukee melkein karttana. Se on tasan se mita
          paikallinen hakukoneoptimointi on, eli nakyminen kartalla
          siina kaupungissa jossa asiakas on. */}
      <img
        className="pohjakuva"
        src="/hakukoneoptimointi/kaupunki.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        data-par="0.028"
      />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Paikallinen hakukoneoptimointi</span>
          <i>Karttatulokset · Local Pack</i>
        </div>

        {/* Topografinen kartta ja kompassi: hakutulos on maasto, ja
            paikallinen naky­vyys on sijainti siina. Kuva ankkuroituu
            vasempaan reunaan tekstipalstan viereen eika istu kortissa,
            mika on koko ero kuvituskuvan ja suunnitellun sivun valilla. */}
        <div className="loc">
          <div>
            <div className="loc-ikoni">
              <Ikoni nimi="kartta" />
            </div>
            <h2 className="seo-h2 rv">
              <span className="mark">”Palvelu + paikkakunta”</span> on se haku, jolla ostetaan
            </h2>
            <p className="seo-lead rv" style={{ marginTop: "24px" }}>
              Kun asiakas kirjoittaa hakukenttään palvelun ja paikkakunnan, hän on jo päättänyt
              ostaa. Paikallinen hakukoneoptimointi ratkaisee, näytkö siinä hetkessä
              karttatuloksissa ja hakutuloslistalla.
            </p>
            <ul className="seo-spec porras rv" style={{ marginTop: "32px" }}>
              {[
                "Google-yritysprofiili kuntoon: kategoriat, palvelut, aukioloajat ja kuvat",
                "Karttatulokset eli Local Pack, kolme ensimmäistä saa valtaosan klikkauksista",
                "NAP-tiedot: nimi, osoite ja puhelinnumero täsmälleen samoina kaikkialla",
                "Arvostelut ja systemaattinen tapa pyytää niitä tyytyväisiltä asiakkailta",
                "Oma sivu jokaiselle paikkakunnalle, jossa palvelette",
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="lpack kohoa rv">
              <p className="lpack-k">Karttatulokset</p>
              <div className="lmap" aria-hidden="true">
                <svg viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" fill="none">
                  <rect width="400" height="150" fill="#eef1f5" />
                  <path d="M0 36 H400 M0 86 H400 M0 126 H400" stroke="#dfe4ea" strokeWidth="8" />
                  <path d="M70 0 V150 M190 0 V150 M300 0 V150" stroke="#dfe4ea" strokeWidth="8" />
                  <rect x="14" y="8" width="42" height="22" rx="2" fill="#e4e9ef" />
                  <rect x="86" y="46" width="88" height="30" rx="2" fill="#e4e9ef" />
                  <rect x="208" y="8" width="76" height="22" rx="2" fill="#e4e9ef" />
                  <rect x="316" y="96" width="70" height="26" rx="2" fill="#e4e9ef" />
                  <path
                    d="M0 104 C90 88, 150 116, 240 98 S 360 78, 400 90"
                    stroke="#d3dce6"
                    strokeWidth="7"
                    fill="none"
                  />
                </svg>
                <span className="lpulse" />
                <span className="lpin" />
              </div>
              {(
                [
                  ["1", "Yrityksesi Oy", "4,9 ★ · Avoinna · 1,2 km", true],
                  ["2", "Kilpailija Oy", "4,5 ★ · Avoinna · 2,8 km", false],
                  ["3", "Toinen kilpailija", "4,2 ★ · Suljettu · 4,1 km", false],
                ] as [string, string, string, boolean][]
              ).map(([n, nimi, meta, oma]) => (
                <div className={"lrow" + (oma ? " oma" : "")} key={n}>
                  <em>{n}</em>
                  <span>
                    <b>{nimi}</b>
                    <s>{meta}</s>
                  </span>
                  {oma ? <i>Sinä</i> : null}
                </div>
              ))}
            </div>

            <p className="seo-body" style={{ marginTop: "28px" }}>
              <strong>Kaupunkisivut eivät maksa kappaleittain.</strong> Rakennamme ne yhdestä
              pohjasta, joten viisi tai viisikymmentä paikkakuntaa maksaa saman verran, ja jokainen
              niistä on oma rankattava sivunsa omalla hakusanallaan.
            </p>

            <div className="loc-kaupungit porras rv">
              {KAUPUNGIT.map(([href, label]) => (
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

/* ==================================================================
   MITTARIT  ·  oikea taulukko
   ==================================================================
   Osio oli kuusi laatikkoriviä, joissa mittarin nimi, selitys ja
   tyokalu olivat kolme eri kokoista tekstipalaa allekkain. Se on
   taulukko joka ei tunnusta olevansa taulukko: kolme saraketta jotka
   eivat ole linjassa.

   Oikea <table> tekee kaksi asiaa joita laatikkorivi ei tee. Tyokalu-
   sarake asettuu samaan x-koordinaattiin joka rivilla, jolloin sen voi
   silmailla ilman lukemista. Ja ruudunlukija saa rakenteen valmiina:
   se lukee sarakeotsikon jokaisen solun yhteydessa ilman etta sita
   pitaa selittaa aria-attribuuteilla. */
const MITTARIT: [string, string, string][] = [
  ["Sijoitukset seuratuilla hakusanoilla", "Missä olet nyt ja mihin suuntaan liikutaan. Seurattavat hakusanat sovitaan yhdessä.", "Sijoitusseuranta"],
  ["Näyttökerrat ja klikkiprosentti", "Näkyykö sivusto hauissa ja klikataanko sitä. Näyttökerrat kasvavat aina ennen klikkauksia.", "Search Console"],
  ["Orgaaninen liikenne", "Kuinka moni saapuu sivustolle hakukoneen kautta, ja mille sivuille.", "Google Analytics"],
  ["Yhteydenotot ja konversiot", "Mitä liikenteestä seuraa. Tämä on lopulta ainoa luku, joka ratkaisee kannattiko työ.", "Google Analytics"],
  ["Indeksoidut sivut ja tekniset virheet", "Pääseekö sisältö hakukoneeseen ollenkaan. Yksi väärä asetus voi piilottaa koko sivuston.", "Search Console"],
  ["Maininnat tekoälyvastauksissa", "Siteerataanko sivustoasi, kun toimialasi tärkeimmät kysymykset esitetään tekoälylle.", "Manuaalinen seuranta"],
];

export function Mittarit() {
  return (
    <section className="seo-sec ruudukko" id="mittarit">
      <Kaiku sana="LUVUT" puoli="oik" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Mittarit</span>
          <i>6 lukua · raportoidaan sovitusti</i>
        </div>
        <div className="loc-ikoni">
          <Ikoni nimi="mittari" />
        </div>
        <h2 className="seo-h2 rv">Kun emme lupaa tuloksia, näytämme luvut.</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Nämä kuusi mittaria sovitaan ennen aloitusta ja raportoidaan sovitussa syklissä. Saat
          pääsyn samoihin työkaluihin, joista luvut tulevat.
        </p>

        {/* Taulukko oli paljas taulukko keskella sivua, ja se luki
            laskentataulukkona. Sama sisalto ikkunan sisalla lukee
            tyokalunakymana, eli tasan sina mita se on: nama luvut
            tulevat Search Consolesta ja Analyticsista, ja asiakas saa
            niihin saman paasyn. Kehys ei ole koriste vaan se kertoo
            mista luvut ovat kotoisin. Sama ikkunakieli kuin
            koodiartefaktissa, jolloin sivulla on yksi esine eika
            kaksi eri esinetta. */}
        <div className="paneeli kohoa rv">
          <div className="art-palkki">
            <span className="art-pisteet" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <code>raportti · kuukausinäkymä</code>
            <b>Search Console · Analytics</b>
          </div>
          <table className="spec porras rv">
          <thead>
            <tr>
              <th scope="col">Mittari</th>
              <th scope="col">Mitä se kertoo</th>
              <th scope="col">Lähde</th>
            </tr>
          </thead>
          <tbody>
            {MITTARIT.map(([nimi, mita, lahde]) => (
              <tr key={nimi}>
                <th scope="row">{nimi}</th>
                <td>{mita}</td>
                <td className="num">{lahde}</td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>

        <div className="seo-tags porras rv">
          {[
            "Raportti kuukausittain",
            "Strategiapuhelu sovitusti",
            "Pääsy kaikkiin työkaluihin",
            "Ei mystisiä laskuja ilman raporttia",
          ].map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   HINNOITTELU  ·  sama taulukko, taman sivun kieli
   ==================================================================
   Taulukko oli jo oikea muoto, joten sisalto ja rivit sailyvat
   sellaisenaan. Vaihtuu vain kehys: hinnat mono-numeroin, 1px viivat,
   ei kortteja eika varjoja, ja suositeltu taso merkitaan syaanilla
   ylapalkilla eika kohotetulla laatikolla. */
const TASOT = [
  { name: "Perusta", price: "390", tag: "", for: "Sivuston kunnossapito ja perusnäkyvyys. Sama kokonaisuus kuin verkkosivujen ylläpitopaketissa." },
  { name: "Kasvu", price: "890", tag: "Suosituin", for: "Jatkuva sisältötyö ja paikallinen näkyvyys. Taso, jolla tulokset alkavat kertyä.", hl: true },
  { name: "Täysi", price: "1 690", tag: "", for: "Kilpailluille toimialoille, joissa myös auktoriteetti pitää rakentaa." },
];

const ON = <span className="on">✓</span>;
const EI = <span className="ei">–</span>;

const RIVIT: { label: string; cells: [ReactNode, ReactNode, ReactNode] }[] = [
  { label: "Seurattavat hakusanat", cells: ["10 hakusanaa", "40 hakusanaa", "100 hakusanaa"] },
  { label: "Tekninen ylläpito ja korjaukset", cells: [ON, ON, ON] },
  { label: "Sivujen optimointi kuukaudessa", cells: ["1 sivu", "3 sivua", "6 sivua"] },
  { label: "Uutta sisältöä kuukaudessa", cells: [EI, "2 artikkelia", "4 artikkelia"] },
  { label: "Google-yritysprofiili ja karttatulokset", cells: ["Käyttöönotto", "Jatkuva optimointi", "Optimointi ja arvosteluprosessi"] },
  { label: "Kaupunkisivut", cells: [EI, "5 paikkakuntaa", "Rajattomasti"] },
  { label: "Auktoriteetti ja linkkien hankinta", cells: [EI, EI, ON] },
  { label: "Tekoälyhakunäkyvyys", cells: [EI, "Optimointi", "Optimointi ja seuranta"] },
  { label: "Raportointi", cells: ["3 kk välein", "Kuukausittain", "Kuukausittain"] },
  { label: "Strategiapuhelu", cells: [EI, "Joka toinen kuukausi", "Kuukausittain"] },
  { label: "Sitoutuminen", cells: ["Kuukausi kerrallaan", "Vähintään 6 kk", "Vähintään 6 kk"] },
];

export function Hinnoittelu() {
  return (
    <section className="seo-sec valo" id="hinnoittelu">
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Hinnoittelu</span>
          <i>Kiinteä kuukausihinta · ei aloitusmaksua</i>
        </div>
        <h2 className="seo-h2 rv">Paljonko hakukoneoptimointi maksaa?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Kolme tasoa, kiinteä kuukausihinta ja maksuton kartoitus ennen aloitusta. Suomessa
          tuloksiin tähtäävä hakukoneoptimointi asettuu tyypillisesti 400–2 000 euroon kuukaudessa,
          tässä on meidän tasomme siitä haarukasta.
        </p>

        <table className="spec hinta porras rv">
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Sisältö</span>
              </th>
              {TASOT.map((t) => (
                <th scope="col" className={t.hl ? "hl" : undefined} key={t.name}>
                  {t.tag ? <em>{t.tag}</em> : null}
                  <b>{t.name}</b>
                  <span className="hinta-n">
                    {t.price} <small>€/kk</small>
                  </span>
                  <span className="hinta-f">{t.for}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RIVIT.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                {r.cells.map((c, idx) => (
                  <td className={TASOT[idx].hl ? "hl num" : "num"} data-l={TASOT[idx].name} key={idx}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="foot">
              <th scope="row">
                <span className="sr-only">Tarjouspyyntö</span>
              </th>
              {TASOT.map((t) => (
                <td className={t.hl ? "hl" : undefined} key={t.name}>
                  <a className={t.hl ? "btn" : "btn alt"} href="#tarjous">
                    Pyydä tarjous
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <p className="seo-body" style={{ marginTop: "28px", maxWidth: "80ch" }}>
          Kaikki hinnat + alv 25,5 %. Ei aloitusmaksua eikä piilokuluja. Kartoitus ja alustava
          auditointi ovat maksuttomia eivätkä sido mihinkään. Kuuden kuukauden vähimmäiskesto Kasvu-
          ja Täysi-tasoilla ei ole myyntikikka: hakukoneoptimointi ei ehdi tuottaa mitään
          lyhyemmässä ajassa, emmekä halua laskuttaa työstä jota ei ehditä viedä maaliin.
        </p>
      </div>
    </section>
  );
}

/* ==================================================================
   KENELLE  ·  kaksi palstaa, yksi jaettu raja
   ================================================================== */
/* Sivun toinen kaannetty lohko. Osion sisalto on rehellinen
   kieltaytyminen, ja musta pohja antaa sille sen painon jota vaalea
   hiusviivataulukko ei anna. */
export function Kenelle() {
  return (
    <section className="seo-sec" id="kenelle" data-tone="ink">
      <Kaiku sana="KENELLE" puoli="vas" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Rehellisesti</span>
          <i>Sanomme sen kartoituksessa</i>
        </div>
        <h2 className="seo-h2 rv">Hakukoneoptimointi ei kannata kaikille.</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Jos tilanteesi on oikean palstan kaltainen, sanomme sen kartoituksessa ja ohjaamme sinut
          muualle. Se on halvempaa meille molemmille.
        </p>

        <div className="kaksi porras rv">
          <div>
            <p className="kaksi-k on">Kannattaa, jos</p>
            <ul>
              {[
                "Asiakkaasi etsivät palveluasi Googlesta, toimialallasi on hakuvolyymia",
                "Yhden asiakkaan arvo on satoja tai tuhansia euroja, ei muutamaa kymppiä",
                "Kestät kolmesta kuuteen kuukautta ilman näkyviä tuloksia",
                "Sivustosi on teknisesti kunnossa tai olet valmis laittamaan sen kuntoon",
                "Haluat kanavan, joka ei sammu kun mainosbudjetti loppuu",
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="kaksi-k ei">Ei kannata, jos</p>
            <ul>
              {[
                "Tarvitset asiakkaita ensi viikolla, silloin oikea kanava on maksettu mainonta",
                "Toimialaasi ei haeta: hakumäärät ovat lähellä nollaa alueellasi",
                "Sivustolla on konversio-ongelma, lisää liikennettä ei korjaa sitä",
                "Liiketoimintamalli tai kohderyhmä on vielä auki",
                "Odotat takuuta sijasta yksi. Sellaista ei voi antaa kukaan.",
              ].map((x) => (
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
   UKK  ·  natiivi eksklusiivinen haitari
   ==================================================================
   name-attribuutti tekee haitarista eksklusiivisen ilman JS:aa: kun
   kaikilla details-elementeilla on sama name, selain sulkee edellisen
   kun seuraava avataan. Nappaimisto ja ruudunlukija toimivat
   itsestaan, ja suljettu sisalto loytyy yha selaimen omalla haulla. */
export function Ukk() {
  const kaikki = FAQ_GROUPS.flatMap((g) => g.items);
  return (
    <section className="seo-sec" id="ukk">
      <Kaiku sana="KYSY" puoli="oik" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Usein kysyttyä</span>
          <i>{kaikki.length} kysymystä</i>
        </div>
        <div className="qa2">
          <div className="qa2-side">
            <h2 className="seo-h2 rv">Usein kysytyt kysymykset hakukoneoptimoinnista</h2>
            <p className="seo-body" style={{ marginTop: "22px" }}>
              Hinta, aikataulu, takuut ja se mitä työhön oikeasti sisältyy.
            </p>
            <p className="qa2-ask">
              <span>Etkö löytänyt vastausta?</span>
              <a href="#tarjous">Kysy suoraan, vastaamme 24 tunnissa</a>
            </p>
          </div>
          <div className="qa2-list porras rv">
            {kaikki.map((it, n) => (
              <details key={it.q} name="ukk-seo" open={n === 0}>
                <summary>{it.q}</summary>
                <div className="a">{it.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ==================================================================
   TARJOUS
   ==================================================================
   Sivulla oli lomakeosio ja heti sen perassa .final-lohko, jonka ainoa
   nappi osoitti takaisin samaan lomakkeeseen muutaman sadan pikselin
   paahan. Kaksi pyyntoa samaan kohteeseen on pelkkaa valinnan vaivaa,
   joten paatosotsikko ja lomake ovat nyt samassa osiossa. */
export function Tarjous() {
  return (
    <section className="seo-sec kuvapohja" id="tarjous">
      {/* Lomake ei kellu tyhjalla vaan tilassa: kaksi ihmista poydan
          aaressa naytön valossa. Sama hetki johon lomake johtaa. */}
      <img
        className="pohjakuva"
        src="/hakukoneoptimointi/poyta.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        data-par="0.028"
      />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Maksuton kartoitus</span>
          <i>Vastaus 24 tunnissa</i>
        </div>
        <div className="loc">
          <div>
            <h2 className="seo-h2 rv">
              Näy siellä, missä <span className="mark">ostopäätös syntyy.</span>
            </h2>
            <p className="seo-lead rv" style={{ marginTop: "26px" }}>
              Käymme läpi sivustosi nykytilan, toimialasi hakuvolyymit ja kilpailutilanteen. Saat
              suoran näkemyksen siitä, kannattaako hakukoneoptimointi juuri sinun tapauksessasi,
              myös silloin kun vastaus on ei.
            </p>
            <ol className="askel porras rv">
              <li>
                <b>24 h</b>
                <span>Luemme viestin ja vastaamme sähköpostilla arkipäivän sisällä.</span>
              </li>
              <li>
                <b>30 min</b>
                <span>Kartoitus: nykytila, hakuvolyymit ja kilpailijoiden näkyvyys.</span>
              </li>
              <li>
                <b>Suunnitelma</b>
                <span>Mitä kannattaa tehdä ensin ja mitä se maksaa. Ei sitoumuksia.</span>
              </li>
            </ol>
          </div>
          <div>
            <BudgetForm
              budgetLabel="Kuukausibudjetti"
              messageLabel="Millä hauilla haluaisit näkyä? Kerro myös toimialasi."
              submitLabel="Pyydä maksuton kartoitus"
              extraField={{ id: "sivu", label: "Verkkosivusi osoite", placeholder: "yrityksesi.fi" }}
              note="Vastaamme 24 tunnin sisällä. Kartoitus ei sido mihinkään."
              min={200}
              max={5000}
              step={50}
              initial={890}
              unit="€/kk"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
