import type { CSSProperties, ReactNode } from "react";

import { Kaiku, Vaite } from "../components/Maasto";
import ApplicationForm from "./ApplicationForm";

/* ==================================================================
   TOIHIN MEILLE -SIVUN OSIOT (5.10.2026)
   Sama tumma .wsx-kuvakieli kuin palvelusivuilla ja Meista-sivulla:
   seo-sec, swrap, kaiku, kuvakaista, Kenelle-kortit ja sama
   lomakeosio. Sivun omat osat ovat .tm-*-luokkia, tyylit
   app/globals.css:ssa (TOIHIN MEILLE, TUMMA).
   ================================================================== */

const i = (n: number) => ({ "--i": n }) as CSSProperties;

function Ikoni({ d }: { d: string }) {
  return (
    <svg className="tm-ik" viewBox="0 0 32 32" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* ---------- Hero ---------- */
export function Hero() {
  return (
    <header className="seo-hero tm-hero">
      <div className="hero-tausta" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/kuvat/halli.webp" alt="" data-par="0.075" data-parx="0.018" />
      </div>
      <div className="swrap hero-sisalto tm-hero-in">
        <p className="tm-avoin">
          <i aria-hidden="true" />
          Avoin haku, jatkuvasti
        </p>
        {/* Otsikossa ja ingressissa ei sisaantuloanimaatiota (LCP). */}
        <h1 className="seo-h1">
          Töihin <span className="accent">WS Medialle</span>
        </h1>
        <div className="tm-hero-ala">
          <p className="hero-lead">
            Teemme lyhytvideoita, verkkosivuja, hakukoneoptimointia ja yritysilmeitä, usein samalle
            asiakkaalle samaan aikaan. Siksi etsimme jatkuvasti tekijöitä, jotka osaavat oman alansa
            erittäin hyvin. Töitä voi tehdä freelancerina laskutuksella tai työsuhteessa.
          </p>
          <div className="heroctas">
            <button type="button" className="btn mag" data-hakemus="">
              Jätä avoin hakemus
            </button>
            <a className="tlink" href="#roolit">
              Katso keitä etsimme
            </a>
          </div>
          <ul className="tm-luotto" aria-label="Lyhyesti">
            <li>Toimeksianto tai työsuhde</li>
            <li>Etätyö, koko Suomi</li>
            <li>Vastaamme viikon sisällä</li>
          </ul>
        </div>
      </div>
    </header>
  );
}

/* ---------- Kehotus sisallon keskella ----------
   Sama kehotusrivi kuin palvelusivujen Kenelle-osiossa (.kk-cta).
   Paanappi avaa hakemusikkunan (HakemusIkkuna), toinen yleisen
   yhteysikkunan kysymyksille. */
export function HakuKehotus({ otsikko, teksti }: { otsikko: string; teksti: string }) {
  return (
    <div className="kk-cta tm-kehotus rv">
      <p>
        <b>{otsikko}</b>
        <span>{teksti}</span>
      </p>
      <div className="kk-napit">
        <button type="button" className="btn" data-hakemus="">
          Jätä avoin hakemus
        </button>
        <button type="button" className="kk-viesti" data-yhteys="">
          Kysy ensin viestillä
        </button>
      </div>
    </div>
  );
}

/* ---------- Miksi meille ---------- */
const SYYT: [string, string, string][] = [
  [
    "M6 16a10 10 0 0 1 17-7l3 3M26 6v6h-6M26 16a10 10 0 0 1-17 7l-3-3M6 26v-6h6",
    "Työ ei lopu yhteen kanavaan",
    "Sama asiakas tarvitsee usein videot, verkkosivuston, hakukoneoptimoinnin ja teippaukset. Kun yksi projekti päättyy, seuraava alkaa yleensä samasta talosta, joten uutta toimeksiantoa ei tarvitse etsiä joka kuukausi.",
  ],
  [
    "M16 28a12 12 0 1 0 0-24 12 12 0 0 0 0 24zM16 22a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM16 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
    "Teet sitä, mitä osaat parhaiten",
    "Emme odota, että sama ihminen kuvaa, koodaa ja piirtää. Kokoamme tiimin projektin mukaan. Jos olet erinomainen editoija, sinun ei tarvitse opetella hakukoneoptimointia.",
  ],
  [
    "M9 4h10l6 6v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM19 4v6h6M11 16h10M11 21h7",
    "Briefit ovat valmiiksi mietittyjä",
    "Saat tavoitteen, aikataulun, tekniset vaatimukset ja tarvittavan aineiston. Emme lähetä toimeksiantoa, jonka sisältö selviää vasta kolmannessa puhelussa.",
  ],
  [
    "M16 28a12 12 0 1 0 0-24 12 12 0 0 0 0 24zM16 9v7l5 3",
    "Maksamme ajallaan",
    "Laskun maksuaika on 14 päivää, eikä sitä venytetä. Sovittu hinta on se hinta, joka maksetaan, myös silloin kun projekti venyy asiakkaan takia.",
  ],
];

export function Miksi() {
  return (
    <section className="seo-sec" id="miksi">
      <Kaiku sana="MIKSI" puoli="vas" />
      <div className="swrap">
        <h2 className="seo-h2 rv">Miksi tekijät jäävät meille pidemmäksi aikaa</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Emme ole suurin emmekä tunnetuin. Nämä neljä asiaa saamme kuitenkin kuntoon, ja juuri niitä
          freelancerit alalta kaipaavat.
        </p>
        <div className="tm-syyt porras rv">
          {SYYT.map(([d, h, p], n) => (
            <div className="tm-kortti" key={h} style={i(n)}>
              <Ikoni d={d} />
              <div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Roolit ---------- */
const ROOLIT: { ala: string; h: string; p: string; tyot: string[]; tagit: string[]; d: string }[] = [
  {
    ala: "Video",
    h: "Kuvaajat, editoijat ja motion designerit",
    p: "Lyhytvideotuotanto on suurin yksittäinen palvelumme. Kuvaamme asiakkaiden tiloissa ja tuotamme jatkuvia videosarjoja kuukaudesta toiseen.",
    tyot: [
      "Lyhytvideoiden kuvaus asiakkaan tiloissa",
      "Editointi, tekstitys ja alustakohtaiset versiot",
      "Motion graphics ja animoidut grafiikat",
      "Yritysvideokuvaus ja haastattelut",
    ],
    tagit: ["Premiere Pro", "After Effects", "DaVinci Resolve", "9:16", "Värimäärittely"],
    d: "M11 4h10a3 3 0 0 1 3 3v18a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM14 12l6 4-6 4z",
  },
  {
    ala: "Verkko ja näkyvyys",
    h: "Kehittäjät, hakukoneoptimoijat ja sisällöntuottajat",
    p: "Rakennamme verkkosivustoja käsin koodattuna ja WordPressillä, ja teemme niille jatkuvaa hakukoneoptimointia ja sisältöä.",
    tyot: [
      "Next.js- ja React-toteutukset",
      "WordPress-teemat, lisäosat ja ylläpito",
      "Tekninen hakukoneoptimointi ja auditoinnit",
      "Hakukoneoptimoitu sisällöntuotanto suomeksi",
    ],
    tagit: ["Next.js", "React", "WordPress", "Search Console", "Schema.org"],
    d: "M6 6h20a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM4 11h24M13 16l-3 3 3 3M19 16l3 3-3 3",
  },
  {
    ala: "Graafinen suunnittelu",
    h: "Graafiset suunnittelijat",
    p: "Suunnittelemme yritysilmeitä ja viemme ne kaikille pinnoille: painotuotteisiin, ajoneuvoteippauksiin ja julkisivuihin.",
    tyot: [
      "Logot, yritysilmeet ja graafiset ohjeistot",
      "Painovalmiit aineistot ja taitto",
      "Ajoneuvo- ja julkisivuteippausten suunnittelu",
      "Some- ja mainosmateriaalien pohjat",
    ],
    tagit: ["Illustrator", "InDesign", "Figma", "CMYK", "Vektorointi"],
    d: "M5 25C9 7 23 25 27 7M5 25l5-15M27 7l-5 15M3 23h4v4H3zM25 5h4v4h-4z",
  },
  {
    ala: "Tuotanto ja kumppanit",
    h: "Asentajat, painotalot ja materiaalitoimittajat",
    p: "Emme teippaa emmekä paina itse, vaan käytämme alihankintaverkostoa. Etsimme luotettavia kumppaneita eri paikkakunnilta.",
    tyot: [
      "Ajoneuvo- ja julkisivuteippausten asennus",
      "Digipainot ja suurkuvatulostus",
      "Valomainosten valmistus ja asennus",
    ],
    tagit: ["Koko Suomi", "Tarrakalvot", "Suurkuva", "Valomainokset", "Asennus"],
    d: "M4 22l14-14 6 6-14 14H4zM16 10l6 6M20 6l2-2 6 6-2 2",
  },
];

export function Roolit() {
  return (
    <section className="seo-sec" id="roolit">
      <Kaiku sana="ROOLIT" puoli="oik" />
      <div className="swrap">
        <h2 className="seo-h2 rv">Keitä etsimme</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Haemme näille neljälle alueelle jatkuvasti. Jos oma osaamisesi osuu johonkin niistä edes
          osittain, kannattaa jättää hakemus.
        </p>
        <div className="tm-roolit porras rv">
          {ROOLIT.map((r, n) => (
            <article className="tm-rooli" key={r.ala} style={i(n)}>
              <div className="tm-rooli-paa">
                <Ikoni d={r.d} />
                <span>{r.ala}</span>
              </div>
              <h3>{r.h}</h3>
              <p>{r.p}</p>
              <ul>
                {r.tyot.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="tm-tagit" aria-label="Työkalut ja aiheet">
                {r.tagit.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </p>
            </article>
          ))}
        </div>
        <HakuKehotus
          otsikko="Tunnistitko oman osaamisesi?"
          teksti="Jätä avoin hakemus. Se vie viisi minuuttia, ja ansioluetteloa ei tarvita."
        />
      </div>
    </section>
  );
}

/* ---------- Tyomalli ---------- */
function Malli({
  nimi,
  merkki,
  sina,
  me,
  korostus,
}: {
  nimi: string;
  merkki: string;
  sina: ReactNode[];
  me: ReactNode[];
  korostus?: boolean;
}) {
  return (
    <article className={`tm-malli${korostus ? " tm-malli-hl" : ""}`}>
      <div className="tm-malli-paa">
        <h3>{nimi}</h3>
        <span>{merkki}</span>
      </div>
      <div className="tm-malli-sarakkeet">
        <div>
          <h4>Sinä</h4>
          <ul>
            {sina.map((x, n) => (
              <li key={n}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Me</h4>
          <ul>
            {me.map((x, n) => (
              <li key={n}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function Tyomalli() {
  return (
    <section className="seo-sec" id="tyomalli">
      <Kaiku sana="MALLI" puoli="vas" />
      <div className="swrap">
        <h2 className="seo-h2 rv">Freelancerina vai työsuhteessa?</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Molemmat käyvät. Suurin osa tekijöistämme laskuttaa toimeksiannoista, mutta hyvälle tekijälle
          voi järjestyä myös vakituinen paikka.
        </p>
        <div className="tm-mallit porras rv">
          <Malli
            korostus
            nimi="Freelancerina"
            merkki="Yleisin aloitus"
            sina={[
              <>
                Laskutat tehdystä työstä. <strong>Kevytyrittäjyys käy</strong>, y-tunnusta ei tarvita.
              </>,
              "Sovimme hinnan aina ennen toimeksiannon aloittamista",
              "Valitset itse, mitkä keikat otat vastaan",
              "Työskentelet omilla välineilläsi ja omassa aikataulussasi",
              "Laskun maksuaika on 14 päivää",
            ]}
            me={[
              "Toimitamme valmiiksi mietityn briefin ja tarvittavan aineiston",
              "Annamme suoran yhteyshenkilön, ei ketjutettua viestintää",
              "Tarjoamme jatkuvia toimeksiantoja, emme yksittäisiä keikkoja",
              "Kerromme, miten työ meni asiakkaalla",
              "Emme kilpailuta samaa työtä viidellä tekijällä",
            ]}
          />
          <Malli
            nimi="Työsuhteessa"
            merkki="Muutaman projektin jälkeen"
            sina={[
              "Kuukausipalkka ja työterveyshuolto",
              "Työvälineet ja ohjelmistolisenssit talon puolesta",
              "Etätyö tai toimisto Espoossa, sinä valitset",
              "Selkeä rooli, ei kaikkea kaikille",
            ]}
            me={[
              "Vakituinen paikka kasvavassa yrityksessä",
              "Mahdollisuus vaikuttaa siihen, mitä ja miten tehdään",
              "Koulutus ja aika oman osaamisen kehittämiseen",
              "Ei mikromanagerointia, vastaat omasta työstäsi",
            ]}
          />
        </div>
        <p className="tm-huom rv">
          Aloitamme lähes aina toimeksiannoilla, koska se on molemmille pienin riski. Työsuhteesta
          keskustellaan siinä vaiheessa, kun yhteistyötä on takana muutama projekti.
        </p>
        <HakuKehotus
          otsikko="Kumpi tahansa käy."
          teksti="Kerro hakemuksessa, kumpi kiinnostaa, niin sovitaan loput puhelimessa."
        />
      </div>
    </section>
  );
}

/* ---------- Prosessi: todellinen jarjestys, siksi numeroitu ---------- */
const VAIHEET: [string, string, string][] = [
  [
    "Lähetä hakemus",
    "Täytä lomake ja liitä linkki työnäytteisiin. Ansioluetteloa ei tarvita: portfolio, showreel tai GitHub riittää.",
    "5 minuuttia",
  ],
  [
    "Lyhyt puhelu",
    "Käymme läpi, mitä osaat, mitä haluat tehdä ja millä hinnalla. Kerromme rehellisesti, onko meillä sinulle töitä juuri nyt.",
    "Noin 30 minuuttia",
  ],
  [
    "Ensimmäinen toimeksianto",
    "Aloitamme pienellä ja selkeärajaisella työllä. Jos se sujuu molemmin puolin, jatkoa tulee ilman erillistä hakuprosessia.",
    "Sovitusti",
  ],
];

export function Prosessi() {
  return (
    <section className="seo-sec" id="prosessi">
      <div className="swrap">
        <h2 className="seo-h2 rv">Kolme vaihetta, ei kahdeksan</h2>
        <p className="seo-lead rv" style={{ marginTop: "26px" }}>
          Emme järjestä persoonallisuustestejä emmekä neljää haastattelukierrosta. Työnäyte kertoo
          enemmän.
        </p>
        <ol className="tm-vaiheet porras rv">
          {VAIHEET.map(([h, p, t], n) => (
            <li key={h} style={i(n)}>
              <span className="tm-nro" aria-hidden="true">
                {n + 1}
              </span>
              <h3>{h}</h3>
              <p>{p}</p>
              <span className="tm-aika">{t}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Odotukset: samat kortit kuin palvelusivujen Kenelle-osiossa ---------- */
const ODOTAMME = [
  "Että osaat oman alasi hyvin. Yksi asia erittäin hyvin on parempi kuin viisi keskinkertaisesti.",
  "Että vastaat viesteihin arkipäivän sisällä",
  "Että kerrot ajoissa, jos aikataulu ei pidä",
  "Että työnäytteet ovat omaa työtäsi",
  "Suomen kielen taitoa, koska asiakastyö tehdään suomeksi",
];
const EMME_VAADI = [
  "Tutkintoa. Portfolio ratkaisee, ei paperi.",
  "Kokopäiväistä sitoutumista. Yksikin keikka kuukaudessa käy.",
  "Että asut pääkaupunkiseudulla. Työ tehdään etänä, kuvaukset ja asennukset paikan päällä.",
  "Että osaat kaikkea. Emme etsi yleismiehiä.",
  "Valmista y-tunnusta. Kevytyrittäjyys riittää.",
];

export function Odotukset() {
  return (
    <section className="seo-sec kenelle-osio" id="odotukset">
      <Kaiku sana="SUORAAN" puoli="oik" />
      <div className="swrap">
        <h2 className="seo-h2 rv">Mitä odotamme ja mitä emme vaadi</h2>
        <p className="seo-lead rv">
          Nämä kannattaa lukea ennen hakemista. Ne säästävät molempien aikaa.
        </p>
        <div className="kk">
          <div className="kk-kortti kk-sopii rv">
            <h3>Odotamme</h3>
            <ul>
              {ODOTAMME.map((t) => (
                <li key={t}>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                  </svg>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="kk-kortti kk-ei rv">
            <h3>Emme vaadi</h3>
            <ul>
              {EMME_VAADI.map((t) => (
                <li key={t}>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6 6l8 8M14 6l-8 8" />
                  </svg>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <HakuKehotus
          otsikko="Kuulostaako sopivalta?"
          teksti="Yksi linkki työnäytteisiin riittää. Vastaamme viikon sisällä myös silloin, kun vastaus on ei."
        />
      </div>
    </section>
  );
}

/* ---------- Tyonkuva: juokseva teksti ja tietopaneeli ---------- */
const FAKTAT: [string, string][] = [
  ["Asiakkaat", "Pienet ja keskisuuret yritykset"],
  ["Sopimukset", "Pääosin jatkuvia kuukausisopimuksia"],
  ["Työ", "Etänä, kuvaukset ja asennukset paikan päällä"],
  ["Kuvaukset", "Painottuvat pääkaupunkiseudulle"],
  ["Laskutus", "Kevytyrittäjyys käy, maksuaika 14 pv"],
  ["Haku", "Jatkuva, vastaus viikon sisällä"],
];

export function Tyonkuva() {
  return (
    <section className="seo-sec" id="tyonkuva">
      <div className="swrap">
        <h2 className="seo-h2 rv">Mitä työ käytännössä on</h2>
        <div className="tm-ly">
          <div className="seoprose tm-proosa rv">
            <p>
              WS Media on espoolainen mainostoimisto, jonka asiakkaat ovat pääosin pieniä ja
              keskisuuria yrityksiä: rakennus- ja LVI-alan yrityksiä, terveys- ja hyvinvointipalveluita,
              erikoisliikkeitä ja ammattipalveluita. Suurin osa asiakkuuksista on jatkuvia
              kuukausisopimuksia, joten toimeksiantoja tulee samalta asiakkaalta kuukaudesta toiseen.
            </p>
            <h3>Videotuotanto</h3>
            <p>
              Suurin osa toimeksiannoista liittyy <a href="/lyhytvideot">lyhytvideoihin</a>:
              kuvauspäivä asiakkaan tiloissa, ja siitä editoidaan useita pystymuotoisia videoita eri
              kanaviin. Haemme sekä kuvaajia että editoijia, eikä samaa ihmistä tarvita molempiin.
              Motion designerille on työtä animoiduissa grafiikoissa ja tekstityksissä.
            </p>
            <h3>Verkkosivut ja hakukoneoptimointi</h3>
            <p>
              Rakennamme <a href="/verkkosivut">verkkosivuja yrityksille</a> sekä käsin koodattuna
              että WordPressillä, ja teemme niille jatkuvaa{" "}
              <a href="/hakukoneoptimointi">hakukoneoptimointia</a>. Kehittäjälle työ on
              selkeärajaista: valmis suunnitelma, tekninen määrittely ja tavoitteet sivun
              latausnopeudelle. Hakukoneoptimoijalle työ on avainsanatutkimusta, teknisiä
              auditointeja ja sisällön suunnittelua suomenkielisille hakusanoille.
            </p>
            <h3>Graafinen suunnittelu ja tuotanto</h3>
            <p>
              Suunnittelemme asiakkaille koko <a href="/graafinen-suunnittelu">yritysilmeen</a> ja
              viemme sen kaikille pinnoille käyntikorteista ja flyereista ajoneuvoteippauksiin ja
              julkisivuihin. Emme teippaa emmekä paina itse, joten tarvitsemme rinnallemme
              asentajia, digipainoja ja materiaalitoimittajia eri paikkakunnilta.
            </p>
            <h3>Mistä päin Suomea</h3>
            <p>
              Suunnittelu, editointi, koodaus ja sisällöntuotanto tehdään etänä, joten
              asuinpaikkakunta ei ratkaise. Kuvaukset painottuvat pääkaupunkiseudulle, Espooseen,
              Helsinkiin ja Vantaalle, mutta teemme työtä koko Suomessa.
            </p>
          </div>
          <dl className="tm-faktat rv">
            {FAKTAT.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ---------- Kuvakaista ---------- */
export function Nayta() {
  return (
    <Vaite
      kuva="/kuvat/autossa.webp"
      alla="Yksi linkki työnäytteisiin riittää. Luemme jokaisen hakemuksen ja vastaamme viikon sisällä."
    >
      Näytä, mitä olet <b><i>tehnyt.</i></b>
    </Vaite>
  );
}

/* ---------- Hakemus ----------
   Sama lomakeosio kuin palvelusivujen tarjousosio: id="tarjous" tuo
   saman ilmeen (taustakuva, aikajana, tumma lomakepaneeli, kiertava
   reunavalo). Sivun linkit osoittavat #hakemus-ankkuriin, koska
   Kehotukset avaa #tarjous-linkeista varauskalenterin, joka ei kuulu
   tyonhakijalle. */
export function Hakemus() {
  return (
    <section className="seo-sec kuvapohja" id="tarjous">
      <span id="hakemus" className="tm-ankkuri" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="pohjakuva"
        src="/kuvat/tarjous-kortit.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        data-par="0.028"
      />
      <div className="swrap">
        <p className="seo-selite" data-rvs="">
          Vastaus viikon sisällä
        </p>
        <div className="loc">
          <div>
            <h2 className="seo-h2 rv">
              Kerro, mitä <span className="korosta">osaat.</span>
            </h2>
            <p className="seo-lead rv" style={{ marginTop: "26px" }}>
              Hakemus vie viisi minuuttia. Luemme jokaisen ja vastaamme myös silloin, kun vastaus on
              ei. Voit myös kirjoittaa osoitteeseen{" "}
              <a href="mailto:info@wsmedia.fi">info@wsmedia.fi</a>.
            </p>
            <ol className="askel porras rv">
              <li>
                <b>5 min</b>
                <span>Hakemus ja linkki työnäytteisiin.</span>
              </li>
              <li>
                <b>30 min</b>
                <span>Puhelu: mitä osaat, mitä haluat tehdä ja millä hinnalla.</span>
              </li>
              <li>
                <b>Toimeksianto</b>
                <span>Pieni ja selkeärajainen työ, jonka jälkeen jatko sovitaan.</span>
              </li>
            </ol>
          </div>
          <ApplicationForm />
        </div>
      </div>
    </section>
  );
}
