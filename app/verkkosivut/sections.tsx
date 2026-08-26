import type { CSSProperties } from "react";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/* ---------- Tuttu tilanne ---------- */
const PROBLEMS = [
  {
    h: "Sivusto ei löydy Googlesta",
    p: "Ilman selkeää sivurakennetta, hakusanoja ja teknistä hakukoneoptimointia sivusto jää hakutulosten toiselle sivulle. Asiakas ei etsi sinua nimellä — hän etsii palvelua, ja päätyy kilpailijan sivuille.",
  },
  {
    h: "Kävijät tulevat, mutta eivät ota yhteyttä",
    p: "Sivuilla käydään, mutta lomakkeita ei täytetä. Syy on lähes aina sama: kävijä ei löydä nopeasti vastausta siihen, mitä palvelu maksaa, kenelle se on ja miten edetään.",
  },
  {
    h: "Sivut latautuvat hitaasti mobiilissa",
    p: "Raskaat valmispohjat ja kymmenet lisäosat lataavat omat tiedostonsa jokaisella sivunlatauksella. Hidas mobiilisivu menettää kävijän ennen kuin sisältö ehtii näkyä ruudulla.",
  },
  {
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
    <section className="band" id="miksi">
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

        <div className="probs stagger">
          {PROBLEMS.map((it, idx) => (
            <div className="prob rv" style={i(idx)} key={it.h}>
              <em>{String(idx + 1).padStart(2, "0")}</em>
              <div>
                <h3>{it.h}</h3>
                <p>{it.p}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bstats rv">
          {BSTATS.map((s) => (
            <div className="bstat" key={s.p}>
              <div className="n">{s.n}</div>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Palvelun sisältö ---------- */
const INCLUDES = [
  ["Sivurakenne ja hakusanat", "Selvitämme mitä asiakkaasi oikeasti hakevat Googlesta ja rakennamme sivuston niin, että jokaiselle palvelulle on oma alasivunsa. Tämä on yksittäisistä ratkaisuista se, joka vaikuttaa näkyvyyteen eniten."],
  ["Ulkoasu yrityksesi näköisenä", "Yksilöllinen ulkoasu yrityksesi väreillä ja materiaaleilla. Ei tunnistettavaa valmisteemaa, jonka näkee joka toisella sivustolla."],
  ["Tekstit ja sisällöntuotanto", "Kirjoitamme palvelukuvaukset, otsikot ja yhteydenottoon ohjaavat tekstit valmiiksi. Sinä hyväksyt ennen julkaisua."],
  ["Tekninen hakukoneoptimointi", "Otsikkorakenne, metatiedot, sivustokartta, indeksoitavuus, sisäinen linkitys ja strukturoitu data kuntoon jo ennen julkaisua — ei jälkikäteen korjauksena."],
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

const VS_ROWS: [string, string, string][] = [
  ["Nopeus", "Työn tulos — vaatii jatkuvaa optimointia", "Lähtökohta — mukana on vain tarvittava koodi"],
  ["Ulkoasu", "Teeman rajoissa, muistuttaa muita sivustoja", "Täysin vapaa, yrityksesi näköinen"],
  ["Toiminnallisuudet", "Lisäosien varassa", "Rakennetaan juuri tarpeeseen"],
  ["Ylläpito", "Ydin, teema ja lisäosat päivittyvät jatkuvasti", "Ei riipu alustapäivityksistä"],
  ["Tietoturva", "Laaja hyökkäyspinta, tunnetut haavoittuvuudet", "Pieni hyökkäyspinta, vähemmän liikkuvia osia"],
  ["Alkuinvestointi", "Matalampi", "Korkeampi, mutta pienemmät jatkuvat kulut"],
  ["Sopii kun", "Tarpeet ovat tavanomaisia ja sivusto halutaan nopeasti", "Ala on kilpailtu ja nopeus tai erottuvuus ratkaisee"],
];

const CMP_ROWS: { label: string; heavy: [string, string]; light: [string, string] }[] = [
  { label: "Sivun koko", heavy: ["92%", "2 800 kt"], light: ["14%", "420 kt"] },
  { label: "Latausaika mobiilissa", heavy: ["90%", "4,8 s"], light: ["21%", "1,1 s"] },
  { label: "Päivitettäviä lisäosia", heavy: ["86%", "24 kpl"], light: ["0%", "0 kpl"] },
];

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
            Teemme molemmat. Ero ei ole laadussa vaan siinä, kuinka paljon sivustolta vaaditaan — ja
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
          {VS_ROWS.map(([label, a, b]) => (
            <div className="vsr" key={label}>
              <div>{label}</div>
              <div data-l="Valmis pohja">{a}</div>
              <div className="hl" data-l="Käsin koodattu">
                {b}
              </div>
            </div>
          ))}
        </div>

        <div className="cmp rv">
          <p className="ct">Sama sivu, kaksi toteutustapaa</p>
          {CMP_ROWS.map((r) => (
            <div key={r.label}>
              <div className="cmprow">
                <div className="lb">
                  {r.label}
                  <s>Raskas valmispohja</s>
                </div>
                <div className="cmpbar" style={{ "--w": r.heavy[0] } as CSSProperties}>
                  <i />
                </div>
                <div className="vv">{r.heavy[1]}</div>
              </div>
              <div className="cmprow good">
                <div className="lb">
                  {r.label}
                  <s>Käsin koodattu</s>
                </div>
                <div className="cmpbar good" style={{ "--w": r.light[0] } as CSSProperties}>
                  <i />
                </div>
                <div className="vv">{r.light[1]}</div>
              </div>
            </div>
          ))}
          <p className="cmpnote">
            Luvut ovat tyypillisiä mittausarvoja: raskas valmispohja tarkoittaa sivupohjaa ja
            parikymmentä lisäosaa, käsin koodattu samaa sisältöä ilman ylimääräistä. Latausaika on
            mitattu mobiiliyhteydellä. Toteutuneet arvot vaihtelevat sisällön ja kuvien määrän
            mukaan, mutta suuruusluokka pysyy: valmispohjassa nopeus on työn tulos, käsin koodatussa
            se on lähtökohta.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Näkyvyys Googlessa ---------- */
const SEO_POINTS = [
  ["Nopeat latausajat", "Google mittaa sivuston nopeutta oikeilta käyttäjiltä. Hidas sivu ei ainoastaan menetä kävijää, se menettää myös sijoituksia — ja mobiilissa ero on suurin."],
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
            <ul className="numlist">
              {SEO_POINTS.map(([h, p]) => (
                <li key={h}>
                  <h3>{h}</h3>
                  <p>{p}</p>
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
              kilpailisivat keskenään — ja Google ei tietäisi, mikä sivu vastaa mihinkin hakuun.
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
  ["Suunnittelu", "Rakennamme ulkoasun ja näytämme sen sinulle. Kommentoit, me viilaamme — vasta sitten siirrytään toteutukseen.", "3–5 päivää"],
  ["Toteutus ja sisältö", "Koodaus, tekstit, kuvat, lomakkeet ja tekninen hakukoneoptimointi. Seuraat etenemistä demo-osoitteesta.", "1–2 viikkoa"],
  ["Julkaisu ja ylläpito", "Testaamme lomakkeet, mobiilinäkymän, metatiedot ja mittauksen, siirrämme verkkotunnuksen ja julkaisemme.", "1–2 päivää"],
];

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
        <div className="tl">
          {STEPS.map(([h, p, sw], idx) => {
            const box = (
              <div className="tlbox">
                <h3>{h}</h3>
                <p>{p}</p>
                <span className="sw">{sw}</span>
              </div>
            );
            const dot = <div className="dot">{idx + 1}</div>;
            return (
              <div className="tlrow rv" key={h}>
                {idx % 2 === 0 ? (
                  <>
                    {box}
                    {dot}
                  </>
                ) : (
                  <>
                    {dot}
                    {box}
                  </>
                )}
              </div>
            );
          })}
        </div>
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
