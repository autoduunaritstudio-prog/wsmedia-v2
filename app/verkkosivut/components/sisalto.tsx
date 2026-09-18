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

export const BSTATS = [
  { n: "2–4", p: "viikkoa suunnittelusta julkaisuun" },
  { n: "90+/100", p: "PageSpeed-tavoite mobiilissa" },
  { n: "24 h", p: "vastaus tarjouspyyntöön" },
  { n: "63 %", p: "kävijöistä saapuu mobiililaitteella" },
];

/* ---------- Palvelun sisältö ---------- */
export const INCLUDES = [
  ["Sivurakenne ja hakusanat", "Selvitämme mitä asiakkaasi oikeasti hakevat Googlesta ja rakennamme sivuston niin, että jokaiselle palvelulle on oma alasivunsa. Tämä on yksittäisistä ratkaisuista se, joka vaikuttaa näkyvyyteen eniten."],
  ["Ulkoasu yrityksesi näköisenä", "Yksilöllinen ulkoasu yrityksesi väreillä ja materiaaleilla. Ei tunnistettavaa valmisteemaa, jonka näkee joka toisella sivustolla."],
  ["Tekstit ja sisällöntuotanto", "Kirjoitamme palvelukuvaukset, otsikot ja yhteydenottoon ohjaavat tekstit valmiiksi. Sinä hyväksyt ennen julkaisua."],
  ["Tekninen hakukoneoptimointi", "Otsikkorakenne, metatiedot, sivustokartta, indeksoitavuus, sisäinen linkitys ja strukturoitu data kuntoon jo ennen julkaisua, ei jälkikäteen korjauksena."],
  ["Responsiivinen ja mobiilioptimoitu toteutus", "Sivusto suunnitellaan mobiili edellä ja testataan puhelimella, tabletilla ja työpöydällä ennen kuin se menee live-tilaan."],
  ["Lomakkeet ja yhteydenottopolut", "Yhteydenotto- ja tarjouspyyntölomakkeet, soittopainikkeet ja selkeät CTA-napit siellä, missä kävijä on valmis toimimaan."],
  ["Analytiikka ja mittaus", "Google Analytics ja Search Console asennettuna, jotta näet mistä kävijät tulevat ja mikä sivu tuottaa yhteydenottoja."],
  ["Verkkotunnus, palvelintila ja SSL-suojaus", "Hoidamme verkkotunnuksen, palvelintilan ja SSL-suojauksen puolestasi. Verkkotunnus rekisteröidään sinun yrityksesi nimiin."],
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
