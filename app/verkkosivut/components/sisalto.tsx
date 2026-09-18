/**
 * VERKKOSIVUT-SIVUN SISALTO.
 *
 * Tekstit on siirretty tanne SELLAISENAAN vanhoista sections-
 * tiedostoista, merkki merkilta, eika niihin ole koskettu. Syy
 * erottelulle on se, etta sivun ULKOASU kirjoitetaan uusiksi mutta
 * sen SISALTO ei: kun teksti ja markkinointi ovat samassa
 * tiedostossa, jokainen visuaalinen muutos on tilaisuus muuttaa
 * tekstia vahingossa.
 */
import type { ReactNode } from "react";
import type { CSSProperties } from "react";

export const i = (n: number) => ({ "--i": n }) as CSSProperties;

type VsRow = {
  label: string;
  /** Mitattu rivi: [osuus palkista, nayttoarvo]. Arviorivilla pelkka teksti. */
  pohja: [string, string] | string;
  koodattu: [string, string] | string;
};

export const ICONS: Record<string, ReactNode> = {
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

export const PROBLEMS = [
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
    p: "Vanhentunut ulkoasu on asiakkaalle vihje siitä, miten muutkin asiat mahdollisesti hoidetaan. Päätelmä on epäreilu, mutta se syntyy muutamassa sekunnissa.",
  },
];

/* KOLME LUKUA, EI NELJAA.
   Nelja oli "63 % kavijoista saapuu mobiililaitteella". Se on
   markkinatieto eika WS Median mittari, mutta se seisoi rivissa jossa
   muut kolme ovat lupauksia, joten lukija luki senkin lupauksena.
   Luku poistui, ja rivin sarakemaara tulee nyt lasten maarasta
   (grid-auto-flow: column) eika kiinteasta neljasta. */
export const BSTATS = [
  { n: "2–4", p: "viikkoa suunnittelusta julkaisuun" },
  { n: "90+/100", p: "PageSpeed-tavoite mobiilissa" },
  { n: "24 h", p: "vastaus tarjouspyyntöön" },
];

/* ---------- Palvelun sisältö ---------- */
export const INCLUDES = [
  ["Sivurakenne ja hakusanat", "Selvitämme mitä asiakkaasi hakevat Googlesta ja rakennamme sivuston niin, että jokaiselle palvelulle on oma alasivunsa."],
  ["Ulkoasu yrityksesi näköisenä", "Yksilöllinen ulkoasu yrityksesi väreillä ja materiaaleilla. Ei tunnistettavaa valmisteemaa, jonka näkee joka toisella sivustolla."],
  ["Tekstit ja sisällöntuotanto", "Kirjoitamme palvelukuvaukset, otsikot ja yhteydenottoon ohjaavat tekstit valmiiksi. Sinä hyväksyt ennen julkaisua."],
  ["Tekninen hakukoneoptimointi", "Otsikkorakenne, metatiedot, sivustokartta, indeksoitavuus, sisäinen linkitys ja strukturoitu data kuntoon jo ennen julkaisua."],
  ["Responsiivinen ja mobiilioptimoitu toteutus", "Sivusto suunnitellaan mobiili edellä ja testataan puhelimella, tabletilla ja työpöydällä ennen kuin se menee live-tilaan."],
  ["Lomakkeet ja yhteydenottopolut", "Yhteydenotto- ja tarjouspyyntölomakkeet, soittopainikkeet ja selkeät CTA-napit siellä, missä kävijä on valmis toimimaan."],
  ["Analytiikka ja mittaus", "Google Analytics ja Search Console asennettuna, jotta näet mistä kävijät tulevat ja mikä sivu tuottaa yhteydenottoja."],
  ["Verkkotunnus, palvelintila ja SSL-suojaus", "Hoidamme verkkotunnuksen, palvelintilan ja SSL-suojauksen. Ensimmäinen vuosi sisältyy hintaan, tunnus on yrityksesi nimissä."],
];

/* ---------- Toteutustapa ---------- */
export const OPTIONS = [
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

export const VS_ROWS: VsRow[] = [
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

export const SEO_ICONS: ReactNode[] = [
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

/* ---------- PALVELUN SISALLON MERKIT ----------
   Kahdeksan riviä oli kahdeksan samanlaista tekstipakettia: lihava
   rivi ja sen alla kaksi riviä leipaa, kahdeksan kertaa perakkain.
   Lista oli luettava mutta yksitoikkoinen, eika mikaan auttanut
   silmaa loytamaan etsimaansa riviä.

   Merkki on hakuapu, ei koriste. Se antaa jokaiselle riville oman
   siluettinsa, jolloin listaa voi silmailla ilman etta jokainen
   otsikko on luettava. Sama piirtotapa kuin muualla sivulla: 24:n
   ruudukko, 1,6px viiva, ei tayttoa.

   Jarjestys on sama kuin INCLUDESin, ja se on ehto: erillinen taulu
   ajautuisi erilleen ensimmaisessa muutoksessa. */
export const INCLUDE_ICONS: ReactNode[] = [
  /* sivurakenne: juuri ja kolme alasivua */
  <>
    <rect x="9.5" y="2.6" width="5" height="4" rx="1.2" key="a" />
    <rect x="2.6" y="17.4" width="5" height="4" rx="1.2" key="b" />
    <rect x="9.5" y="17.4" width="5" height="4" rx="1.2" key="c" />
    <rect x="16.4" y="17.4" width="5" height="4" rx="1.2" key="d" />
    <path d="M12 6.6v5.4M5.1 17.4V12h13.8v5.4M12 12v5.4" key="e" />
  </>,
  /* ulkoasu: varilaikku ja sivellin */
  <>
    <path d="M3.4 13.6a8.6 8.6 0 1 1 8.6 8.6c-1.4 0-1.9-1-1.2-1.8.8-.9.3-2-.9-2H7.4a4 4 0 0 1-4-4.8z" key="a" />
    <circle cx="8" cy="8.6" r="1.1" key="b" />
    <circle cx="13" cy="6.4" r="1.1" key="c" />
    <circle cx="17.2" cy="10.4" r="1.1" key="d" />
  </>,
  /* tekstit: kyna ja rivit */
  <>
    <path d="M4 5.4h9M4 9.4h7M4 13.4h5" key="a" />
    <path d="M19.8 9.2 13 16v3h3l6.8-6.8z" key="b" />
    <path d="M17.6 11.4l2.4 2.4" key="c" />
  </>,
  /* tekninen SEO: suurennuslasi ja rattaan hammas */
  <>
    <circle cx="10.6" cy="10.6" r="6.2" key="a" />
    <path d="M15 15l5.4 5.4" key="b" />
    <path d="M10.6 7.8v5.6M7.8 10.6h5.6" key="c" />
  </>,
  /* responsiivisuus: puhelin ja tyopoyta */
  <>
    <rect x="2.6" y="4.4" width="12" height="10" rx="1.6" key="a" />
    <path d="M6.2 18.2h5" key="b" />
    <path d="M8.6 14.4v3.8" key="c" />
    <rect x="16.4" y="9.4" width="5" height="11.2" rx="1.4" key="d" />
  </>,
  /* lomake: kentta ja osoitin */
  <>
    <rect x="3" y="5" width="18" height="11" rx="2" key="a" />
    <path d="M6.6 9h7M6.6 12.2h4" key="b" />
    <path d="M14.8 13.6l5.6 3.2-2.6.9-1 2.6z" key="c" />
  </>,
  /* analytiikka: pylvaat ja kayra */
  <>
    <path d="M3.4 20.4h17.2" key="a" />
    <path d="M6.6 20.4v-4.6M11 20.4V11M15.4 20.4v-6.8M19.8 20.4V6.4" key="b" />
  </>,
  /* verkkotunnus ja SSL: pallo ja lukko */
  <>
    <circle cx="10.4" cy="10.4" r="7" key="a" />
    <path d="M3.4 10.4h14M10.4 3.4c3.4 3.6 3.4 10.4 0 14-3.4-3.6-3.4-10.4 0-14z" key="b" />
    <rect x="14.6" y="15.2" width="7" height="5.6" rx="1.4" key="c" />
    <path d="M16.4 15.2v-1.6a1.7 1.7 0 0 1 3.4 0v1.6" key="d" />
  </>,
];

/* ---------- NAKYVYYDEN KORTTIEN KUVIOT ----------
   Merkki kertoo mista kohta puhuu, mutta se ei nayta mitaan. Kortin
   pohjalle tulee pieni kuvio joka piirtaa sen mekaniikan josta rivi
   puhuu: latausjono, sivupuu, hakutuloslista, palaava kayra.

   Kuvio piirtyy --rvp:n mukaan samoin kuin kortin ylaviiva, ja se on
   selvasti tekstia vaimeampi: sen tehtava on antaa kortille pohja ja
   syvyys, ei kilpailla otsikon kanssa. clip-path eika stroke-dash,
   koska dash-laskenta menee vaarin kun viiva on non-scaling ja
   viewBox venytetaan. */
export const SEO_KUVIOT: ReactNode[] = [
  /* latausjono: nelja pyyntoa, ylin pisin */
  <>
    <path className="kv-rata" d="M2 6h96M2 14h96M2 22h96M2 30h96" key="a" />
    <path className="kv-palkki kv-kirkas" d="M2 6h74" key="b" />
    <path className="kv-palkki" d="M2 14h46" key="c" />
    <path className="kv-palkki" d="M2 22h27" key="d" />
    <path className="kv-palkki" d="M2 30h13" key="e" />
  </>,
  /* sivupuu: juuri ja kolme alasivua.
     pathLength=1 tekee viivan piirtymisesta mitan riippumattoman:
     stroke-dasharray voidaan kirjoittaa nollan ja ykkosen valilla
     eika viivan todellisina pituuksina. */
  <>
    <path className="kv-rata" d="M50 8v9H14v6M50 17v6M50 17h36v6" pathLength={1} key="a" />
    <rect className="kv-laatikko kv-kirkas" x="38" y="2" width="24" height="7" rx="2" key="b" />
    <rect className="kv-laatikko" x="4" y="23" width="20" height="7" rx="2" key="c" />
    <rect className="kv-laatikko" x="40" y="23" width="20" height="7" rx="2" key="d" />
    <rect className="kv-laatikko" x="76" y="23" width="20" height="7" rx="2" key="e" />
  </>,
  /* HAKUKENTTA JA SANAT. Hakutuloslista oli liian lahella samaa
     kuvaa kuin sivupuu sen vieressa: kolme laatikkoa allekkain
     molemmissa. Tama kohta ei muutenkaan puhu tuloslistasta vaan
     siita mita kayttaja KIRJOITTAA, joten kuviossa on hakukentta ja
     sen alla kolme ehdotusta, keskimmainen valittuna. */
  <>
    <rect className="kv-laatikko kv-kirkas" x="2" y="2" width="96" height="11" rx="5.5" key="a" />
    <circle className="kv-laatikko kv-kirkas" cx="11" cy="7.5" r="3.4" key="b" />
    <path className="kv-palkki kv-kirkas" d="M13.6 10.1l2.4 2.4" key="c" />
    <path className="kv-palkki kv-kirkas" d="M21 7.5h29" key="d" />
    <path className="kv-rata" d="M8 20h46M8 27h36M8 34h52" pathLength={1} key="e" />
    <path className="kv-palkki" d="M8 27h36" key="f" />
    <path className="kv-osoitin" d="M2 27h2.4" key="g" />
  </>,
  /* kayttajakokemus: kavija jaa sivulle eika palaa */
  <>
    <path className="kv-rata" d="M2 30h96" key="a" />
    <path
      className="kv-kayra kv-kirkas"
      d="M2 30C16 30 22 22 34 19s18 2 30-4 22-9 32-11"
      pathLength={1}
      key="b"
    />
    <circle className="kv-piste" cx="98" cy="4" r="3" key="c" />
  </>,
];

export const SEO_POINTS = [
  ["Nopeat latausajat", "Google mittaa sivuston nopeutta oikeilta käyttäjiltä. Hidas sivu ei ainoastaan menetä kävijää, se menettää myös sijoituksia, ja mobiilissa ero on suurin."],
  ["Selkeä sivurakenne ja sisäinen linkitys", "Sivut linkittyvät toisiinsa niin, että Google löytää ne kaikki ja ymmärtää minkä palvelun alle mikin kuuluu. Ilman linkitystä yksittäinen sivu jää irralleen, vaikka se olisi kirjoitettu hyvin."],
  ["Optimoitu sisältö ja oikeat hakusanat", "Tekstit kirjoitetaan niillä sanoilla, joilla asiakkaat oikeasti hakevat. Otsikot, metatiedot ja sisältö vastaavat siihen kysymykseen, joka hakuun johti."],
  ["Hyvä käyttäjäkokemus", "Google seuraa, jääkö kävijä sivulle vai palaako hän hakutuloksiin. Selkeä rakenne, luettava teksti ja toimiva mobiilinäkymä pitävät kävijän sivulla."],
];

/* SIVUSTOKARTTA OLI LUETTAVISSA VAIN SEN KIRJOITTAJALLE.
   Osoitteet olivat WS Median omia (/verkkosivut, /blogi/...), joten
   artefakti nayttiy talta sivulta otetulta ruutukaappaukselta eika
   siita mita se esittaa. Lukijan on tarkoitus nahda OMAN yrityksensa
   rakenne, joten esimerkki on nyt yhden kuvitteellisen yrityksen
   kartta ja se sanotaan ääneen artefaktin otsikkorivilla. */
export const TREE = [
  ["/putkiremontit", "putkiremontti espoo"],
  ["/lvi-huolto", "lvi-huolto espoo"],
  ["/viemarin-avaus", "viemärin avaus hinta"],
  ["/yhteystiedot", "putkimies lähellä"],
];

/* ---------- Prosessi ---------- */
export const STEPS = [
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

/* ---------- Asiakkaat ---------- */
export const REFCHIPS = [
  ["Rakennus ja LVI", "Verkkosivut ja palvelusivut"],
  ["Terveys ja hyvinvointi", "Sivustouudistus"],
  ["Erikoisliikkeet", "Verkkokauppa"],
  ["Ammattipalvelut", "Verkkosivut ja hakukoneoptimointi"],
];

/* ---------- Tulokset ---------- */
export const FIGS = [
  ["90+/100", "PageSpeed-pisteet mobiilissa", "Mitataan Googlen työkalulla ennen julkaisua"],
  ["alle 1,5 s", "Sisällön latautuminen mobiilissa", "Testataan mobiiliyhteydellä, ei vain toimiston verkossa"],
  ["100 %", "Sivuista indeksoitavissa julkaisupäivänä", "Sivustokartta ja metatiedot tarkistetaan sivu kerrallaan"],
];

/* ---------- Hinnoittelu ---------- */
export const PLANS = [
  {
    h: "Startti",
    for: "Yritykselle, joka tarvitsee uskottavat kotisivut nopeasti.",
    li: ["Etusivu ja 3 alasivua", "Ulkoasu ja tekstit valmiina", "Tekninen hakukoneoptimointi", "Yhteydenottolomake ja analytiikka", "Julkaisu 2 viikossa"],
    price: "1 490",
    unit: "€ + alv",
    alt: true,
  },
  {
    h: "Yrityssivusto",
    badge: "Suosituin",
    for: "Yritykselle, jolla on useita palveluita ja jonka pitää näkyä hauissa.",
    li: ["6–12 sisältösivua", "Oma alasivu jokaiselle palvelulle", "Laajempi sisältö- ja hakusanatyö", "Referenssit ja työnäytteet", "Lomakkeet ja analytiikka", "Laajennettava rakenne"],
    price: "2 990",
    unit: "€ + alv",
    hl: true,
  },
  {
    h: "Räätälöity",
    for: "Kun tarpeet menevät pakettien yli.",
    li: ["Käsin koodattu toteutus", "Omat toiminnallisuudet ja integraatiot", "Verkkokauppa tai varausjärjestelmä", "Monikieliset sivut", "Ei ylärajaa sivumäärässä"],
    price: "alk. 5 900",
    unit: "€ + alv",
    alt: true,
  },
];

/* ---------- Kenelle ---------- */
/**
 * TILIKIRJA, EI KAHTA KORTTIA.
 *
 * Osio oli kaksi saman levyista paneelia rinnakkain, molemmilla oma
 * tausta ja oma reuna. Se on sama muoto jota sivun jokainen muukin
 * osio kaytti, jolloin lukija ei tiedä kumpi puoli on kumpi ennen kuin
 * lukee otsikot - vaikka juuri vastakkainasettelu on koko osion asia.
 *
 * Jaettu pystyviiva tekee sen minka kaksi reunaa hukkasivat: yksi raja
 * kahden asian valissa lukee vertailuna, kaksi reunaa lukee kahtena
 * laatikkona. Sama rakenne on lyhytvideosivulla, ja se on nyt
 * teemaneutraali (ks. ALAOSAN KALUSTON TEEMATOKENIT globals.css:ssa),
 * joten vaalea ja tumma sivu jakavat saman kaluston eivatka kahta
 * toisintoa.
 *
 * EI-PUOLI HIMMENNETAAN OPASITEETILLA eika harmaammalla varilla: sama
 * tekstiperhe pienemmalla painolla. Harmaampi vari olisi tehnyt siita
 * toisen luokan tekstia, vaikka se on yhta rehellista sisaltoa.
 */
export const SOPII = [
  "Yritykselläsi on useampi palvelu, joilla jokaisella on oma asiakaskuntansa",
  "Haluat näkyä Googlessa palveluhauilla, et vain yrityksen nimellä",
  "Nykyinen sivusto on hidas, vanhentunut tai sitä ei voi päivittää itse",
  "Haluat kiinteän hinnan ja tiedon siitä, mitä siihen sisältyy",
  "Toivot, että tekstit, kuvat ja tekniikka hoituvat samalta tiimiltä",
];

export const EI_SOVI: [string, string][] = [
  ["Etsit halvinta mahdollista sivustoa", "Halvin vaihtoehto on aina valmispohja, ja siitä maksetaan myöhemmin näkyvyydessä"],
  ["Haluat rakentaa sivut itse", "Tarvitset silloin alustan ja mallipohjan, et toteuttajaa"],
  ["Palvelusi tai kohderyhmäsi on vielä auki", "Kannattaa ensin päättää mitä myyt ja kenelle"],
  ["Odotat Google-sijoituksia muutamassa viikossa", "Tekninen pohja on valmis heti, sijoitukset kertyvät kuukausissa"],
];

/* ---------- UKK ---------- */
/**
 * STICKY-PALSTA JA NATIIVI EKSKLUSIIVINEN HAITARI.
 *
 * Osio oli kaksi rinnakkaista saraketta ryhmaotsikoineen, eli 17
 * kysymysta kahdessa pinossa. Kaksi saraketta pakottaa silman
 * hyppimaan puolelta toiselle, ja ryhmaotsikot kertoivat vain sen mika
 * kysymyksista jo nakyy.
 *
 * Yksi palsta ja sticky-otsikko sen vieressa. name-attribuutti tekee
 * haitarista eksklusiivisen ilman JS:aa: kun kaikilla details-
 * elementeilla on sama name, selain sulkee edellisen kun seuraava
 * avataan. Lista pysyy hallitun mittaisena, nappaimisto ja ruudunlukija
 * toimivat itsestaan, ja suljettu sisalto loytyy yha selaimen omalla
 * haulla.
 *
 * KYSYMYKSIA KARSITTIIN 17 -> 10. Seitseman vastasi asiaan joka on jo
 * sanottu muualla sivulla, ja pitka lista lukee itsessaan
 * epavarmuutena: mita enemman kysymyksia, sita enemman selittelya.
 * Karsitut sailyvat faq.tsx:ssa, joten FAQPage-merkinta ei koydy.
 */
export const UKK_KYSYMYKSET = [
  "Paljonko verkkosivut maksavat yritykselle?",
  "Mitä verkkosivujen hinta sisältää?",
  "Kuinka nopeasti verkkosivut valmistuvat?",
  "Onko pakko sitoutua kuukausimaksuun?",
  "Käytättekö WordPressiä?",
  "Voinko päivittää sisältöä itse?",
  "Kuka omistaa sivuston ja verkkotunnuksen?",
  "Tarvitseeko minulla olla valmiit tekstit ja kuvat?",
  "Voiko vanhat sivut uudistaa ilman että Google-näkyvyys katoaa?",
  "Teettekö myös verkkokaupan?",
];

/* ---------- Tarjous ---------- */
export const FLIST = [
  ["Vastaus 24 tunnin sisällä", "Arkipäivisin useimmiten samana päivänä."],
  ["Kiinteä hinta ennen aloitusta", "Näet mitä hintaan sisältyy, ei piilokuluja eikä aloitusmaksuja."],
  ["Et tarvitse mitään valmiiksi", "Sisältö, tekstit ja rakenne suunnitellaan yhdessä kartoituksessa."],
  ["Ei sitoutumista", "Tarjouspyyntö ei velvoita mihinkään."],
];
