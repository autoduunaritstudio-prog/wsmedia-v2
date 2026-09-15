import Image from "next/image";

import type { CSSProperties } from "react";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/* ---------- Tuttu tilanne ---------- */
/**
 * OSIO OLI TUMMA SAAREKE VAALEALLA SIVULLA.
 *
 * .band maalasi sen mustaksi, jolloin sivun toinen osio oli eri
 * varinen kuin kaikki muut. Tumma lohko lukee erillisena kappaleena,
 * ja koska sivun oma pohja on nyt etusivun metallikuvio, saareke
 * peitti juuri sen kuvion josta sivu tunnistaa etusivun sivuksi.
 *
 * NUMEROT 01-04 POIS. Nelja ongelmaa ei ole jarjestys eika prosessi:
 * ne tapahtuvat yhtaikaa ja mika tahansa niista yksin riittaa syyksi.
 * Numerointi lupasi etenemista jota ei ole, ja vei samalla
 * vasemmanpuoleisen sarakkeen jokaiselta riviltä.
 *
 * KORTIT JA IKONIT NUMEROIDEN TILALLE. Kortti antaa jokaiselle
 * ongelmalle oman rajansa, jolloin nelja kohtaa luetaan nelja
 * vaihtoehtoa eika yksi pitka lista. Ikoni tekee saman minka numero
 * teki huonosti: antaa silmalle kiinnekohdan rivin alkuun, mutta
 * kertoo samalla mista on kyse.
 *
 * VALOKUVA JA LUVUT SAMASSA. Luvut olivat ennen paljas hiusviivarivi
 * osion pohjalla. Toteutetun sivuston kuvan paalla ne lukevat
 * mittaustuloksina jostain oikeasta, ja osio saa samalla sen
 * lepopisteen jota koko sivulta puuttui.
 */

/* Viivapiirrosikonit samalla kielella kuin navipalkin kantajat: 1,6px
   viiva, pyoristetyt paat, ei tayttoa, vari peritaan currentColorista.
   Ei ikonikirjastoa: nelja ikonia on nelja polkua, ja kirjasto olisi
   tuonut mukanaan oman viivapaksuutensa ja ruudukkonsa. */
const ICONS: Record<string, React.ReactNode> = {
  haku: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.4 15.4 21 21" />
    </>
  ),
  lomake: (
    <>
      <path d="M4 5.5h16v10.5H10.5L6.5 19v-3H4z" />
      <path d="M8 9.5h8M8 12.5h4.5" />
    </>
  ),
  nopeus: (
    <>
      <rect x="7" y="2.8" width="10" height="18.4" rx="2.4" />
      <path d="M12 7.4v3.6l2.3 1.6" />
    </>
  ),
  ilme: (
    <>
      <rect x="3.2" y="4.6" width="17.6" height="14.8" rx="2.2" />
      <path d="M3.2 9.2h17.6M6.6 6.9h.01M9.2 6.9h.01" />
    </>
  ),
};

const PROBLEMS = [
  {
    ic: "haku",
    h: "Sivusto ei löydy Googlesta",
    p: "Ilman selkeää sivurakennetta, hakusanoja ja teknistä hakukoneoptimointia sivusto jää hakutulosten toiselle sivulle. Asiakas ei etsi sinua nimellä, hän etsii palvelua, ja päätyy kilpailijan sivuille.",
  },
  {
    ic: "lomake",
    h: "Kävijät tulevat, mutta eivät ota yhteyttä",
    p: "Sivuilla käydään, mutta lomakkeita ei täytetä. Syy on lähes aina sama: kävijä ei löydä nopeasti vastausta siihen, mitä palvelu maksaa, kenelle se on ja miten edetään.",
  },
  {
    ic: "nopeus",
    h: "Sivut latautuvat hitaasti mobiilissa",
    p: "Raskaat valmispohjat ja kymmenet lisäosat lataavat omat tiedostonsa jokaisella sivunlatauksella. Hidas mobiilisivu menettää kävijän ennen kuin sisältö ehtii näkyä ruudulla.",
  },
  {
    ic: "ilme",
    h: "Ilme ei vastaa sitä, mitä yritys oikeasti on",
    p: "Moni yritys on selvästi parempi kuin miltä se verkossa näyttää. Vanhentunut ulkoasu on asiakkaalle vihje siitä, miten muutkin asiat mahdollisesti hoidetaan.",
  },
];

const BSTATS = [
  { n: "2–4", p: "viikkoa suunnittelusta julkaisuun" },
  { n: "90+/100", p: "PageSpeed-tavoite mobiilissa" },
  { n: "24 h", p: "vastaus tarjouspyyntöön" },
  { n: "63 %", p: "kävijöistä saapuu mobiililaitteella" },
];

export function Ongelma() {
  return (
    <section id="miksi">
      <div className="wrap">
        <div className="hsplit rv">
          <div>
            <span className="kick">Tuttu tilanne</span>
            <h2>
              Sivusto on olemassa.
              <br />
              Se ei vain tee mitään.
            </h2>
          </div>
          <p className="sub">
            Asiakas etsii palvelun Googlesta, avaa kaksi tai kolme sivustoa ja valitsee sen, joka
            latautuu nopeasti, vastaa hänen kysymykseensä ja tekee yhteydenotosta helppoa. Kaikki muu
            on toissijaista.
          </p>
        </div>

        <div className="probgrid stagger">
          {PROBLEMS.map((it, idx) => (
            <article className="probcard rv" style={i(idx)} key={it.h}>
              <svg
                className="probicon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {ICONS[it.ic]}
              </svg>
              <h3>{it.h}</h3>
              <p>{it.p}</p>
            </article>
          ))}
        </div>

        {/* Kuva ja luvut samassa lohkossa. Kuva on toteutettu asiakastyo,
            eli se on samalla vastaus siihen mita osio kuvaa: nain se
            nayttaa kun nama nelja asiaa on hoidettu. */}
        <figure className="proof rv" data-par="0.02">
          <Image
            src="/referenssit/laaksolahdensahko-case.webp"
            alt="Laaksolahden Sähkön verkkosivusto, WS Median toteuttama"
            width={1000}
            height={563}
            sizes="(max-width: 1080px) 100vw, 1032px"
          />
          <figcaption>
            <div className="proofstats">
              {BSTATS.map((s) => (
                <div key={s.p}>
                  <div className="n">{s.n}</div>
                  <p>{s.p}</p>
                </div>
              ))}
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------- Palvelun sisältö ---------- */
const INCLUDES = [
  ["Sivurakenne ja hakusanat", "Selvitämme mitä asiakkaasi oikeasti hakevat Googlesta ja rakennamme sivuston niin, että jokaiselle palvelulle on oma alasivunsa. Tämä on yksittäisistä ratkaisuista se, joka vaikuttaa näkyvyyteen eniten."],
  ["Ulkoasu yrityksesi näköisenä", "Yksilöllinen ulkoasu yrityksesi väreillä ja materiaaleilla. Ei tunnistettavaa valmisteemaa, jonka näkee joka toisella sivustolla."],
  ["Tekstit ja sisällöntuotanto", "Kirjoitamme palvelukuvaukset, otsikot ja yhteydenottoon ohjaavat tekstit valmiiksi. Sinä hyväksyt ennen julkaisua."],
  ["Tekninen hakukoneoptimointi", "Otsikkorakenne, metatiedot, sivustokartta, indeksoitavuus, sisäinen linkitys ja strukturoitu data kuntoon jo ennen julkaisua, ei jälkikäteen korjauksena."],
  ["Responsiivinen ja mobiilioptimoitu toteutus", "Sivusto suunnitellaan mobiili edellä ja testataan puhelimella, tabletilla ja työpöydällä ennen kuin se menee live-tilaan."],
  ["Lomakkeet ja yhteydenottopolut", "Yhteydenotto- ja tarjouspyyntölomakkeet, soittopainikkeet ja selkeät CTA-napit siellä, missä kävijä on valmis toimimaan."],
  ["Analytiikka ja mittaus", "Google Analytics ja Search Console asennettuna, jotta näet mistä kävijät tulevat ja mikä sivu tuottaa yhteydenottoja."],
  ["Verkkotunnus, palvelintila ja SSL-suojaus", "Hoidamme verkkotunnuksen, palvelintilan ja SSL-suojauksen puolestasi. Verkkotunnus rekisteröidään sinun yrityksesi nimiin."],
];

export function Sisalto() {
  return (
    <section id="sisalto">
      <div className="wrap">
        <div className="split">
          <div className="stick rv" data-par="0.02">
            <span className="kick">Palvelun sisältö</span>
            <h2>Mitä verkkosivujen suunnittelu ja toteutus sisältää?</h2>
            <p>
              Avaimet käteen tarkoittaa, ettei sinun tarvitse kirjoittaa tekstejä, valita fontteja
              tai opetella hakukoneoptimointia. Sinä kerrot yrityksestäsi ja palveluistasi, me
              hoidamme loput.
            </p>
            <a className="btn" href="#tarjous">
              Pyydä tarjous
            </a>
          </div>

          <div className="acc rv">
            {INCLUDES.map(([q, a], idx) => (
              <details key={q} open={idx === 0}>
                <summary>{q}</summary>
                <div className="ab">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Toteutustapa ---------- */
const OPTIONS = [
  {
    oc: "Perussivusto",
    h: "Nopein tapa saada uskottava sivusto verkkoon",
    p: "Selkeä kokonaisuus yritykselle, joka tarvitsee toimivat kotisivut nyt eikä kolmen kuukauden päästä.",
    li: ["Yhdestä viiteen sisältösivua", "Testattu rakenne, oma ulkoasu", "Tekninen hakukoneoptimointi mukana", "Julkaisu 2 viikossa"],
  },
  {
    oc: "Räätälöity",
    h: "Käsin koodattu sivusto, joka tehdään tyhjästä",
    p: "Kun sivuston pitää olla nopeampi, uniikimpi tai monipuolisempi kuin valmis pohja sallii.",
    li: ["Ei valmisteemoja eikä turhia lisäosia", "Kevyt koodi ja nopeat latausajat", "Omat toiminnallisuudet ja integraatiot", "Skaalautuu, kun yritys kasvaa"],
  },
  {
    oc: "Verkkokauppa",
    h: "Kun tuotteet myydään suoraan verkossa",
    p: "Verkkokauppa rakennetaan saman sivuston osaksi, ei erilliseksi saarekkeeksi.",
    li: ["Tuotehallinta ja maksutavat", "Toimitustavat ja tilausten seuranta", "Tuotesivujen hakukoneoptimointi", "Myynnin raportointi"],
  },
];

/**
 * YKSI VERTAILU KAHDEN SIJAAN.
 *
 * Osiossa oli kaksi erillista vertailua perakkain: seitseman rivin
 * taulukko ("Valmis pohja" vs. "Kasin koodattu") ja heti sen alla
 * palkkikaavio ("Sama sivu, kaksi toteutustapaa") joka vertasi tasan
 * samaa kahta asiaa kolmella mitatulla luvulla. Yhteensa 2365px, ja
 * kaksi riviä vastasi samaan kysymykseen kahdesti: taulukon "Nopeus"
 * ja palkkien "Latausaika", taulukon "Yllapito" ja palkkien
 * "Paivitettavia lisaosia".
 *
 * Nyt rivejä on kahdeksan ja ne ovat samassa taulukossa. Kolme
 * ensimmaista on MITATTUJA: niissa arvon rinnalla on palkki, joka
 * nayttaa suhteen yhdella silmayksella. Loput viisi ovat arvioita ja
 * ne kerrotaan sanoina, koska palkki lupaisi mittausta jota ei ole.
 *
 * Mitatut rivit ovat ensin: luku on vahvempi argumentti kuin
 * adjektiivi, ja jos lukija lopettaa kolmannen rivin jalkeen, han on jo
 * nahnyt sen mika tassa vertailussa on todistettavissa.
 */
type VsRow = {
  label: string;
  /** Mitattu rivi: [osuus palkista, nayttoarvo]. Arviorivilla pelkka teksti. */
  pohja: [string, string] | string;
  koodattu: [string, string] | string;
};

const VS_ROWS: VsRow[] = [
  { label: "Latausaika mobiilissa", pohja: ["90%", "4,8 s"], koodattu: ["21%", "1,1 s"] },
  { label: "Sivun koko", pohja: ["92%", "2 800 kt"], koodattu: ["14%", "420 kt"] },
  { label: "Päivitettäviä lisäosia", pohja: ["86%", "24 kpl"], koodattu: ["2%", "0 kpl"] },
  { label: "Ulkoasu", pohja: "Teeman rajoissa, muistuttaa muita sivustoja", koodattu: "Täysin vapaa, yrityksesi näköinen" },
  { label: "Toiminnallisuudet", pohja: "Lisäosien varassa", koodattu: "Rakennetaan juuri tarpeeseen" },
  { label: "Tietoturva", pohja: "Laaja hyökkäyspinta, tunnetut haavoittuvuudet", koodattu: "Pieni hyökkäyspinta, vähemmän liikkuvia osia" },
  { label: "Alkuinvestointi", pohja: "Matalampi", koodattu: "Korkeampi, mutta pienemmät jatkuvat kulut" },
  { label: "Sopii kun", pohja: "Tarpeet ovat tavanomaisia ja sivusto halutaan nopeasti", koodattu: "Ala on kilpailtu ja nopeus tai erottuvuus ratkaisee" },
];

/** Solun sisalto: mitattu arvo palkkeineen tai pelkka teksti. */
function VsCell({ v, good }: { v: [string, string] | string; good?: boolean }) {
  if (typeof v === "string") return <>{v}</>;
  return (
    <span className={"vsmeas" + (good ? " good" : "")}>
      <b>{v[1]}</b>
      <i style={{ "--w": v[0] } as CSSProperties} />
    </span>
  );
}

export function Toteutustapa() {
  return (
    <section id="toteutustapa" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="hsplit rv">
          <div>
            <span className="kick">Toteutustapa</span>
            <h2>Perussivusto vai räätälöidyt verkkosivut?</h2>
          </div>
          <p className="sub">
            Teemme molemmat. Ero ei ole laadussa vaan siinä, kuinka paljon sivustolta vaaditaan, ja
            kuinka pitkälle sen pitää skaalautua.
          </p>
        </div>

        <div className="opts">
          {OPTIONS.map((o, idx) => (
            <div className="opt rv" key={o.oc}>
              <div className="idx">{String(idx + 1).padStart(2, "0")}</div>
              <div>
                <span className="oc">{o.oc}</span>
                <h3>{o.h}</h3>
                <p>{o.p}</p>
              </div>
              <ul>
                {o.li.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="vs rv">
          <div className="vsr head">
            <div>Vertailu</div>
            <div>Valmis pohja</div>
            <div className="hl">Käsin koodattu</div>
          </div>
          {VS_ROWS.map((r) => (
            <div
              className={"vsr" + (typeof r.pohja === "string" ? "" : " meas")}
              key={r.label}
            >
              <div>{r.label}</div>
              <div data-l="Valmis pohja">
                <VsCell v={r.pohja} />
              </div>
              <div className="hl" data-l="Käsin koodattu">
                <VsCell v={r.koodattu} good />
              </div>
            </div>
          ))}
        </div>
        <p className="vsnote rv">
          Kolme ensimmäistä riviä on mitattu: raskas valmispohja tarkoittaa sivupohjaa ja
          parikymmentä lisäosaa, käsin koodattu samaa sisältöä ilman ylimääräistä. Latausaika on
          mitattu mobiiliyhteydellä. Toteutuneet arvot vaihtelevat sisällön ja kuvien määrän mukaan,
          mutta suuruusluokka pysyy: valmispohjassa nopeus on työn tulos, käsin koodatussa se on
          lähtökohta.
        </p>
      </div>
    </section>
  );
}

/* ---------- Näkyvyys Googlessa ---------- */
/* Ikonit samalla viivakielella kuin Tuttu tilanne -osiossa: 1,6px,
   pyoristetyt paat, ei tayttoa. Numerointi 01-04 jai pois samasta
   syysta kuin siellakin - nama nelja eivat ole jarjestys vaan nelja
   yhtaikaista tekijaa, ja numero lupasi etenemista jota ei ole. */
const SEO_ICONS: React.ReactNode[] = [
  <>
    <path d="M13.4 2.6 4.8 13.4h6.1l-.9 8 8.6-10.8h-6.1z" key="a" />
  </>,
  <>
    <rect x="9" y="2.8" width="6" height="4.6" rx="1.4" key="a" />
    <rect x="2.6" y="16.6" width="6" height="4.6" rx="1.4" key="b" />
    <rect x="15.4" y="16.6" width="6" height="4.6" rx="1.4" key="c" />
    <path d="M12 7.4v4.4M5.6 16.6v-2.4h12.8v2.4" key="d" />
  </>,
  <>
    <circle cx="10.5" cy="10.5" r="6.5" key="a" />
    <path d="M15.4 15.4 21 21M8 10.5h5M10.5 8v5" key="b" />
  </>,
  <>
    <rect x="3" y="4.2" width="18" height="13" rx="2.2" key="a" />
    <path d="M8.5 21h7M12 17.2V21" key="b" />
    <path d="M7.5 12.6l2.8-2.8 2.3 2.3 3.9-3.9" key="c" />
  </>,
];

const SEO_POINTS = [
  ["Nopeat latausajat", "Google mittaa sivuston nopeutta oikeilta käyttäjiltä. Hidas sivu ei ainoastaan menetä kävijää, se menettää myös sijoituksia, ja mobiilissa ero on suurin."],
  ["Selkeä sivurakenne ja sisäinen linkitys", "Jokaiselle palvelulle oma alasivunsa. Näin sivusto voi näkyä useilla eri hauilla sen sijaan, että kaikki puristetaan yhdelle etusivulle."],
  ["Optimoitu sisältö ja oikeat hakusanat", "Tekstit kirjoitetaan niillä sanoilla, joilla asiakkaat oikeasti hakevat. Otsikot, metatiedot ja sisältö vastaavat siihen kysymykseen, joka hakuun johti."],
  ["Hyvä käyttäjäkokemus", "Google seuraa, jääkö kävijä sivulle vai palaako hän hakutuloksiin. Selkeä rakenne, luettava teksti ja toimiva mobiilinäkymä pitävät kävijän sivulla."],
];

const TREE = [
  ["/verkkosivut", "”verkkosivut yritykselle”"],
  ["/verkkosivut/espoo", "”verkkosivut espoo”"],
  ["/verkkokauppa", "”verkkokaupan rakentaminen”"],
  ["/blogi/verkkosivujen-hinta", "”paljonko verkkosivut maksavat”"],
];

export function Nakyvyys() {
  return (
    <section id="hakukoneoptimointi" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="duo">
          <div className="rv" data-par="0.02">
            <span className="kick">Näkyvyys</span>
            <h2 style={{ marginTop: "12px" }}>Näin verkkosivut näkyvät Googlessa</h2>
            <p className="lead">
              Hakukoneoptimointi ei ole erillinen lisäpalvelu, joka ostetaan sivuston jälkeen. Se on
              tapa rakentaa sivusto: rakenne, sisältö ja tekniikka ratkaisevat sen, löytyykö sivusto
              ollenkaan.
            </p>
            <ul className="iconlist">
              {SEO_POINTS.map(([h, p], idx) => (
                <li key={h}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {SEO_ICONS[idx]}
                  </svg>
                  <div>
                    <h3>{h}</h3>
                    <p>{p}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="tree rv" data-par="-0.02">
            <p className="tt">Yksi sivu, yksi haku</p>
            <p className="td">
              Näin sivurakenne rakennetaan: jokainen palvelu ja paikkakunta saa oman osoitteensa,
              joka tähtää yhteen hakuun.
            </p>
            <div className="trow root">
              <span className="path">yrityksesi.fi</span>
              <span className="q">yrityksen nimi</span>
            </div>
            <div className="kids">
              {TREE.map(([path, q]) => (
                <div className="trow" key={path}>
                  <span className="path">{path}</span>
                  <span className="q">{q}</span>
                </div>
              ))}
            </div>
            <p className="tn">
              Jokainen sivu voi sijoittua omalla hakusanallaan. Yhdelle etusivulle puristettuna ne
              kilpailisivat keskenään, ja Google ei tietäisi, mikä sivu vastaa mihinkin hakuun.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Prosessi ---------- */
const STEPS = [
  ["Kartoitus", "Käymme läpi mitä yritys tekee, kenelle ja millä hauilla asiakkaat etsivät palvelua. Et tarvitse mitään valmiiksi.", "noin 30 min"],
  ["Rakenne ja hakusanat", "Päätämme mitkä sivut tehdään ja millä hakusanoilla kukin sivu pyrkii näkymään. Hyväksyt sivustokartan.", "2–3 päivää"],
  ["Suunnittelu", "Rakennamme ulkoasun ja näytämme sen sinulle. Kommentoit, me viilaamme, vasta sitten siirrytään toteutukseen.", "3–5 päivää"],
  ["Toteutus ja sisältö", "Koodaus, tekstit, kuvat, lomakkeet ja tekninen hakukoneoptimointi. Seuraat etenemistä demo-osoitteesta.", "1–2 viikkoa"],
  ["Julkaisu ja ylläpito", "Testaamme lomakkeet, mobiilinäkymän, metatiedot ja mittauksen, siirrämme verkkotunnuksen ja julkaisemme.", "1–2 päivää"],
];

/**
 * ZIGZAG-AIKAJANASTA VAAKARIVIIN.
 *
 * Pystyjana vei 1311px eli puolitoista nakymaa, ja sisaltoa siina oli
 * viisi otsikkoa ja viisi kahden rivin kuvausta. Suurin osa korkeudesta
 * oli janan omaa geometriaa: joka toinen laatikko vasemmalle, joka
 * toinen oikealle, ja niiden valissa tyhjaa jota kukin rivi tarvitsi
 * mahtuakseen omalle korkeudelleen.
 *
 * Vaakarivissa askelten JARJESTYS on suunta johon kieli jo lukee, joten
 * jana itse voi olla yksi ohut viiva pisteiden lapi eika rakenne joka
 * maaraa asettelun. Sama sisalto mahtuu yhteen nakymaan.
 *
 * Alle 900px:n leveydella rivi kaantyy pystyyn: viisi saraketta
 * tarkoittaisi puhelimessa noin 60px per sarake, eli otsikko taittuisi
 * kirjain kerrallaan. Pystyssa jana on vasemmassa reunassa, jolloin se
 * on yha jana eika lista.
 */
export function Prosessi() {
  return (
    <section id="prosessi" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <div className="shead center rv" data-par="0.03">
          <span className="kick">Prosessi</span>
          <h2>Näin verkkosivuprojekti etenee</h2>
          <p className="sub">
            Sinun ei tarvitse tietää etukäteen, mitä sivustolle tulee. Koko oma työmääräsi on
            käytännössä yksi puhelu ja kaksi hyväksyntäkierrosta.
          </p>
        </div>
        <ol className="hsteps stagger">
          {STEPS.map(([h, p, sw], idx) => (
            <li className="rv" style={i(idx)} key={h}>
              <span className="hstep-dot">{idx + 1}</span>
              <span className="hstep-sw">{sw}</span>
              <h3>{h}</h3>
              <p>{p}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Asiakkaat ---------- */
const REFCHIPS = [
  ["Rakennus ja LVI", "Verkkosivut ja palvelusivut"],
  ["Terveys ja hyvinvointi", "Sivustouudistus"],
  ["Erikoisliikkeet", "Verkkokauppa"],
  ["Ammattipalvelut", "Verkkosivut ja hakukoneoptimointi"],
];

export function Asiakkaat() {
  return (
    <section id="asiakkaat" style={{ paddingTop: "20px" }}>
      <div className="wrap">
        <figure className="pull rv">
          <span className="mark" aria-hidden="true">
            ”
          </span>
          <div>
            <blockquote>
              Sivusto ei ole valmis silloin kun se näyttää hyvältä. Se on valmis silloin kun se
              latautuu sekunnissa, löytyy Googlesta ja tuottaa yhteydenottoja.
            </blockquote>
            <figcaption>
              <b>WS Media</b> · Espoo
            </figcaption>
          </div>
        </figure>
        <div className="refchips rv">
          {REFCHIPS.map(([b, t]) => (
            <div className="refchip" key={b}>
              <b>{b}</b>
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
