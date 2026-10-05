import SopiiKenelle from "../../components/SopiiKenelle";
import BudgetForm from "../../components/BudgetForm";
import SmartLink from "../../components/SmartLink";
import { FAQ_GROUPS } from "../faq";

import Ikoni from "./Ikoni";
import { Kaiku } from "../../components/Maasto";
import { KarttaPaketti } from "./Realismi";

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
    <section className="seo-sec" id="aikataulu">
      <Kaiku sana="12 KK" puoli="vas" />
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Aikajänne</span>
          <i>12 kuukautta</i>
        </div>
        <h2 className="seo-h2 rv">Milloin hakukoneoptimointi alkaa näkyä?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Tämä on se järjestys, jossa asiat käytännössä tapahtuvat. Kesto vaihtelee toimialan
          mukaan, järjestys ei.
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

        {/* Kappaleen toinen puolisko ("Emme lupaa sijaa yksi ... raportoimme
            kuukausittain") poistettiin: Mittarit-osio on kokonaisuudessaan
            juuri se lupaus ja se alkaa kahden osion paasta. Sama vaite oli
            sivulla viidesti, ja tama oli niista se jolla ei ole omaa
            hakusanapintaa. Jaljelle jaa se mita vain tama kappale sanoo,
            eli mista aikataulu riippuu. */}
        <p className="seo-body jana-note">
          Kaksi asiaa ratkaisee keston: toimialan kilpailutilanne ja se, kuinka paljon teknistä
          korjaamista sivusto vaatii ennen kuin sisältötyö pääsee alkuun. Vähemmän kilpailluilla
          hakusanoilla tuloksia tulee nopeammin, kovimmilla nousu vie enemmän aikaa.
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

export function Paikallinen() {
  /* PAIKALLINEN B-ROLLINA (3.10.2026). Ennen tama oli pitka tekstiosio
     ilmakuvan paalla: otsikko, kappale, nelja kohtaa, karttakortti ja
     viela toinen kappale. Nyt se on hengahdys kuten muiden sivujen
     kuvaosiot: yksi lause, yksi virke, kolme lyhytta tosiasiaa ja
     karttatulokset sellaisina kuin asiakas ne nakee. */
  return (
    <section className="seo-sec hk-paikallinen" id="paikallinen">
      <Kaiku sana="PAIKALLINEN" puoli="oik" kohta="ylos" />
      <div className="swrap hk-pk">
        <div>
          <h2 className="seo-h2 rv">
            <span className="korosta">”Palvelu + paikkakunta”</span> on se haku, jolla ostetaan.
          </h2>
          <p className="seo-lead rv" style={{ marginTop: "22px" }}>
            Kun asiakas kirjoittaa hakuun palvelun ja paikkakunnan, hän on jo päättänyt ostaa. Kolme
            ensimmäistä karttatulosta saa valtaosan klikkauksista.
          </p>
          <ul className="hk-broll-faktat rv">
            <li>
              <i className="hk-pk-ikoni"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.6"/></svg></i>
              <b>Yritysprofiili</b>
              <span>Kategoriat, palvelut, aukioloajat ja kuvat kuntoon</span>
            </li>
            <li>
              <i className="hk-pk-ikoni"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h11M4 12h16M4 17h9"/><path d="M17 15l2 2 3-4"/></svg></i>
              <b>Samat tiedot kaikkialla</b>
              <span>Nimi, osoite ja puhelinnumero täsmälleen samoina</span>
            </li>
            <li>
              <i className="hk-pk-ikoni"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg></i>
              <b>Arvostelut</b>
              <span>Tapa pyytää niitä tyytyväisiltä asiakkailta</span>
            </li>
          </ul>
        </div>
        <KarttaPaketti />
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
    <section className="seo-sec" id="mittarit">
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

        {/* Nelja tunnistetta poistettiin. "Raportti kuukausittain" ja
            "Strategiapuhelu sovitusti" ovat hinnastotaulukon omia riveja
            tasokohtaisesti tarkempina, "Paasy kaikkiin tyokaluihin" on
            sanatarkasti taman osion ingressissa ja "Ei mystisia laskuja
            ilman raporttia" sanoo saman kuin osion otsikko. Nelja rivia
            joista yksikaan ei kertonut mitaan uutta. */}
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
    <section className="seo-sec" id="hinnoittelu">
      <div className="swrap">
        <div className="seo-ord" data-rvs="">
          <span>Hinnoittelu</span>
          <i>Kiinteä kuukausihinta · ei aloitusmaksua</i>
        </div>
        <h2 className="seo-h2 rv">Paljonko hakukoneoptimointi maksaa?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Kolme tasoa ja kiinteä kuukausihinta. Tasot eroavat siinä, kuinka paljon uutta sisältöä
          kuukaudessa syntyy ja rakennetaanko myös auktoriteettia.
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
                  <a className={t.hl ? "btn" : "btn alt"} href="#tarjous" data-paketti={t.name}>
                    Pyydä tarjous
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <p className="seo-body" style={{ marginTop: "28px", maxWidth: "80ch" }}>
          Kaikki hinnat + alv 25,5 %. Ei aloitusmaksua eikä piilokuluja. Kuuden kuukauden
          vähimmäiskesto Kasvu- ja Täysi-tasoilla ei ole myyntikikka: hakukoneoptimointi ei ehdi tuottaa mitään
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
    <SopiiKenelle
      otsikko="Hakukoneoptimointi ei kannata kaikille."
      sopii={[
        "Asiakkaasi etsivät palveluasi Googlesta, toimialallasi on hakuvolyymia",
        "Yhden asiakkaan arvo on satoja tai tuhansia euroja, ei muutamaa kymppiä",
        "Kestät kolmesta kuuteen kuukautta ilman näkyviä tuloksia",
        "Sivustosi on teknisesti kunnossa tai olet valmis laittamaan sen kuntoon",
        "Haluat kanavan, joka ei sammu kun mainosbudjetti loppuu",
      ].map((t) => ({ t }))}
      ei={[
        { t: "Tarvitset asiakkaita ensi viikolla", s: "Silloin oikea kanava on maksettu mainonta." },
        { t: "Toimialaasi ei haeta", s: "Hakumäärät ovat lähellä nollaa alueellasi." },
        { t: "Sivustolla on konversio-ongelma", s: "Lisää liikennettä ei korjaa sitä." },
        { t: "Liiketoimintamalli tai kohderyhmä on vielä auki" },
        { t: "Odotat takuuta ykkössijasta", s: "Sellaista ei voi antaa kukaan." },
      ]}
      epavarma="jos hakukoneoptimointi ei ole sinulle oikea ratkaisu"
    />
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
      <Kaiku sana="FAQ" puoli="oik" />
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
      {/* Kaikkien sivujen tarjousosiossa sama kuva (3.10.2026): WS Median
          kayntikortit tyopoydalla. */}
      <img
        className="pohjakuva"
        src="/kuvat/tarjous-kortit.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        data-par="0.028"
      />
      <div className="swrap">
        {/* SAMA KOKONAISUUS KUIN MUILLA PALVELUSIVUILLA (4.10.2026): sama
            rakenne, samat luokat ja sama lomakekortti. Vain aihe vaihtuu. */}
        <p className="seo-selite" data-rvs="">Vastaus 24 tunnissa</p>
        <div className="loc">
          <div>
            <h2 className="seo-h2 rv">
              Valmis näkymään <span className="korosta">Googlessa?</span>
            </h2>
            <p className="seo-lead rv" style={{ marginTop: "26px" }}>
              Käymme läpi sivustosi nykytilan, toimialasi hakuvolyymit ja kilpailutilanteen. Saat
              suoran näkemyksen siitä, kannattaako hakukoneoptimointi juuri sinun tapauksessasi,
              myös silloin kun vastaus on ei. Puhelinnumeron ja aukioloajat löydät{" "}
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
                <span>Kartoitus: nykytila, hakuvolyymit ja kilpailijoiden näkyvyys.</span>
              </li>
              <li>
                <b>Tarjous</b>
                <span>Kirjallinen ehdotus hintoineen. Ei sitoumuksia ennen hyväksyntää.</span>
              </li>
            </ol>
          </div>
          <BudgetForm
            otsikko="Tarjouspyyntö"
            vaihtoehdot
            showBudget={false}
            messageLabel="Millä hauilla haluaisit näkyä? Kerro myös toimialasi."
            note="Ei sitoumuksia."
            tilt="y"
          />
        </div>
      </div>
    </section>
  );
}
