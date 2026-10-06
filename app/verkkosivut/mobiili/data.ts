/* VERKKOSIVUJEN PUHELINVERSION DATA: suunnitelman Verkkosivut.dc.html
   renderVals() sanasta sanaan. Valitut tilat (kohta 0, tapa 0, kenelle 0,
   paketti 1, UKK 0 auki, askel 0, paneeli 0) ovat suunnitelman
   alkutilat; Efektit.tsx vaihtaa ne klikeillä ja pyyhkäisyillä. */

/* Logonauha: suunnitelman /logos/*.png -> kevyet /mobiili/logot/*.webp,
   koot ja suodin suunnitelman. */
const logot = [
  { src: "/mobiili/logot/porsche-club-finland.webp", alt: "Porsche Club Finland", h: 34, f: "brightness(0) invert(1)" },
  { src: "/mobiili/logot/tesla-owners-finland-color.webp", alt: "Tesla Owners Finland", h: 34, f: "none" },
  { src: "/mobiili/logot/colormaster.webp", alt: "Colormaster", h: 28, f: "brightness(0) invert(1)" },
  { src: "/mobiili/logot/ydr-autohuolto.webp", alt: "YDR Autohuolto", h: 30, f: "brightness(0) invert(1)" },
  { src: "/mobiili/logot/ls-monogram-color.webp", alt: "Laaksolahden Sähkö", h: 32, f: "none" },
];
export const LOGOT = logot.concat(logot, logot, logot);

const ongelmat = [
  { t: "Sivusto ei löydy Googlesta", v: "Ilman selkeää sivurakennetta, hakusanoja ja teknistä hakukoneoptimointia sivusto jää hakutulosten toiselle sivulle. Asiakas ei etsi sinua nimellä, hän etsii palvelua, ja päätyy kilpailijan sivuille.", ikoni: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20" },
  { t: "Kävijät tulevat, mutta eivät ota yhteyttä", v: "Sivuilla käydään, mutta lomakkeita ei täytetä. Syy on lähes aina sama: kävijä ei löydä nopeasti vastausta siihen, mitä palvelu maksaa, kenelle se on ja miten edetään.", ikoni: "M20 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4A8 8 0 1 1 20 12zM8.5 11h7M8.5 14h4" },
  { t: "Sivut latautuvat hitaasti mobiilissa", v: "Raskaat valmispohjat ja kymmenet lisäosat lataavat omat tiedostonsa jokaisella sivunlatauksella. Hidas mobiilisivu menettää kävijän ennen kuin sisältö ehtii näkyä ruudulla.", ikoni: "M8 3.5h8a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 19V5A1.5 1.5 0 0 1 8 3.5zM11 17.5h2" },
  { t: "Ilme ei vastaa sitä, mitä yritys oikeasti on", v: "Vanhentunut ulkoasu on asiakkaalle vihje siitä, miten muutkin asiat mahdollisesti hoidetaan. Päätelmä on epäreilu, mutta se syntyy muutamassa sekunnissa.", ikoni: "M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.6-1-2.7 0-1 .8-1.6 1.8-1.6h2.1c2 0 3.8-1.6 3.8-3.8C20.5 6.5 16.7 3.5 12 3.5zM7.5 11.5h.01M9.5 7.5h.01M14 7h.01" },
];
export const ONGELMAT = ongelmat.map((o, i) => ({ ...o, nro: "0" + (i + 1), top: 84 + i * 12, sk: "1.0000", himmea: "0.000" }));

export const KARTTA = [
  { p: "/putkiremontit", h: "putkiremontti espoo" },
  { p: "/lvi-huolto", h: "lvi-huolto espoo" },
  { p: "/viemarin-avaus", h: "viemärin avaus hinta" },
  { p: "/yhteystiedot", h: "putkimies lähellä" },
];

export const SIS = [
  { t: "Sivurakenne ja hakusanat", v: "Selvitämme mitä asiakkaasi hakevat Googlesta ja rakennamme sivuston niin, että jokaiselle palvelulle on oma alasivunsa.", ikoni: "M4 5h6v5H4zM14 14h6v5h-6zM14 5h6v5h-6zM7 10v6.5h7" },
  { t: "Ulkoasu yrityksesi näköisenä", v: "Yksilöllinen ulkoasu yrityksesi väreillä ja materiaaleilla. Ei tunnistettavaa valmisteemaa, jonka näkee joka toisella sivustolla.", ikoni: "M12 3.5a8.5 8.5 0 1 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.6-1-2.7 0-1 .8-1.6 1.8-1.6h2.1c2 0 3.8-1.6 3.8-3.8C20.5 6.5 16.7 3.5 12 3.5z" },
  { t: "Tekstit ja sisällöntuotanto", v: "Kirjoitamme palvelukuvaukset, otsikot ja yhteydenottoon ohjaavat tekstit valmiiksi. Sinä hyväksyt ennen julkaisua.", ikoni: "M5 6h14M5 10h14M5 14h9M5 18h6" },
  { t: "Tekninen hakukoneoptimointi", v: "Otsikkorakenne, metatiedot, sivustokartta, indeksoitavuus, sisäinen linkitys ja strukturoitu data kuntoon jo ennen julkaisua.", ikoni: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20M8 10.5l2 2 3.5-3.5" },
  { t: "Mobiilioptimoitu toteutus", v: "Sivusto suunnitellaan mobiili edellä ja testataan puhelimella, tabletilla ja työpöydällä ennen kuin se menee live-tilaan.", ikoni: "M8 3.5h8a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 19V5A1.5 1.5 0 0 1 8 3.5zM11 17.5h2" },
  { t: "Lomakkeet ja yhteydenottopolut", v: "Yhteydenotto- ja tarjouspyyntölomakkeet, soittopainikkeet ja selkeät napit siellä, missä kävijä on valmis toimimaan.", ikoni: "M4 6h16v12H4zM4.5 6.5l7.5 6 7.5-6" },
  { t: "Analytiikka ja mittaus", v: "Google Analytics ja Search Console asennettuna, jotta näet mistä kävijät tulevat ja mikä sivu tuottaa yhteydenottoja.", ikoni: "M4 20V10M10 20V4M16 20v-7M21 20H3" },
  { t: "Verkkotunnus, palvelintila ja SSL", v: "Hoidamme verkkotunnuksen, palvelintilan ja SSL-suojauksen ylläpitomaksulla 59 €/kk + alv. Verkkotunnus on yrityksesi nimissä.", ikoni: "M7 11V8a5 5 0 0 1 10 0v3M5.5 11h13v9h-13zM12 14.5v2" },
];
/* Laattojen tilat (suunnitelman sisalto: on / ei) */
export const LAATTA = {
  on: { bg: "rgba(111,236,255,.12)", reuna: "inset 0 0 0 1.5px rgba(111,236,255,.6)", fg: "#eafcff", ik: "#6fecff" },
  ei: { bg: "rgba(255,255,255,.035)", reuna: "inset 0 0 0 1px rgba(255,255,255,.08)", fg: "#dbe5ee", ik: "#8fa3b5" },
};
export const SISALTO = SIS.map((x, i) => {
  const on = i === 0;
  const t = on ? LAATTA.on : LAATTA.ei;
  return { t: x.t, ikoni: x.ikoni, on, bg: t.bg, reuna: t.reuna, fg: t.fg, ikVari: t.ik };
});

/* Valilehdet (suunnitelman tabBg / tabFg) */
export const TAB = { on: { bg: "#6fecff", fg: "#0b0f14" }, ei: { bg: "transparent", fg: "#c9d6e2" } };

const TAVAT_ = [
  { nimi: "Perussivusto", vari: "#ff9a4d", otsikko: "Nopein tapa saada uskottava sivusto verkkoon", kuvaus: "Selkeä kokonaisuus yritykselle, joka tarvitsee toimivat kotisivut nyt eikä kolmen kuukauden päästä.", rivit: ["Yhdestä viiteen sisältösivua", "Testattu rakenne, oma ulkoasu", "Tekninen hakukoneoptimointi mukana", "Julkaisu 2 viikossa"] },
  { nimi: "Räätälöity", vari: "#6fecff", otsikko: "Käsin koodattu sivusto, joka tehdään tyhjästä", kuvaus: "Kun sivuston pitää olla nopeampi, uniikimpi tai monipuolisempi kuin valmis pohja sallii.", rivit: ["Ei valmisteemoja eikä turhia lisäosia", "Kevyt koodi ja nopeat latausajat", "Omat toiminnallisuudet ja integraatiot", "Skaalautuu, kun yritys kasvaa"] },
  { nimi: "Verkkokauppa", vari: "#c9d6e2", otsikko: "Kun tuotteet myydään suoraan verkossa", kuvaus: "Verkkokauppa rakennetaan saman sivuston osaksi, ei erilliseksi saarekkeeksi.", rivit: ["Tuotehallinta ja maksutavat", "Toimitustavat ja tilausten seuranta", "Tuotesivujen hakukoneoptimointi", "Myynnin raportointi"] },
];
export const TAVAT = TAVAT_.map((t, i) => {
  const on = i === 0;
  return { nimi: t.nimi, on, tabBg: on ? TAB.on.bg : TAB.ei.bg, tabFg: on ? TAB.on.fg : TAB.ei.fg };
});
/* Kaikki kolme korttia HTML:ssa, vain valittu nakyvissa. */
export const TAPA_AUKI = TAVAT_.map((t, i) => ({ ...t, avain: i, malli0: i === 0, malli1: i === 1, malli2: i === 2 }));

export const MITAT = [
  { l: "Ensimmäinen näkymä", v: "0,8 s", w: 82 },
  { l: "Suurin elementti", v: "1,4 s", w: 70 },
  { l: "Asettelun siirtymä", v: "0", w: 100 },
];
export const PISTE = { on: { w: 22, c: "#6fecff" }, ei: { w: 6, c: "rgba(255,255,255,.25)" } };
export const PAN_PISTEET = [0, 1, 2, 3].map((i) => (i === 0 ? PISTE.on : PISTE.ei));

const ASK = [
  { aika: "NOIN 30 MIN", t: "Kartoitus", v: "Käymme läpi mitä yritys tekee, kenelle ja millä hauilla asiakkaat etsivät palvelua." },
  { aika: "2–3 PÄIVÄÄ", t: "Rakenne ja hakusanat", v: "Päätämme mitkä sivut tehdään ja millä hakusanoilla kukin sivu pyrkii näkymään. Hyväksyt sivustokartan." },
  { aika: "3–5 PÄIVÄÄ", t: "Suunnittelu", v: "Rakennamme ulkoasun ja näytämme sen sinulle. Kommentoit, me viilaamme, vasta sitten siirrytään toteutukseen." },
  { aika: "1–2 VIIKKOA", t: "Toteutus ja sisältö", v: "Koodaus, tekstit, kuvat, lomakkeet ja tekninen hakukoneoptimointi. Seuraat etenemistä demo-osoitteesta." },
  { aika: "1–2 PÄIVÄÄ", t: "Julkaisu ja ylläpito", v: "Testaamme lomakkeet, mobiilinäkymän, metatiedot ja mittauksen, siirrämme verkkotunnuksen ja julkaisemme." },
];
/* Askeleen tila suhteessa valittuun A (suunnitelman askeleet: on = i <= A, nyt = i === A). */
export function askelTila(i: number, A: number) {
  const on = i <= A;
  const nyt = i === A;
  return {
    bg: on ? "#6fecff" : "#0b131d",
    fg: on ? "#0b0f14" : "#8fa3b5",
    reuna: nyt ? "0 0 0 5px rgba(111,236,255,.2)" : on ? "none" : "inset 0 0 0 1.5px rgba(255,255,255,.22)",
    kbg: nyt ? "linear-gradient(180deg, rgba(111,236,255,.1), rgba(14,22,31,1))" : "#0e161f",
    kreuna: nyt ? "inset 0 0 0 1px rgba(111,236,255,.4)" : "inset 0 0 0 1px rgba(255,255,255,.08)",
  };
}
export const ASKELEET = ASK.map((a, i) => ({ ...a, n: i + 1, x: i * 25, ...askelTila(i, 0) }));

/* Kenelle (suunnitelman ke ja keLista) */
const SOP = [{ t: "Yritykselläsi on useampi palvelu, joilla jokaisella on oma asiakaskuntansa" }, { t: "Haluat näkyä Googlessa palveluhauilla, et vain yrityksen nimellä" }, { t: "Nykyinen sivusto on hidas, vanhentunut tai sitä ei voi päivittää itse" }, { t: "Haluat kiinteän hinnan ja tiedon siitä, mitä siihen sisältyy" }, { t: "Toivot, että tekstit, kuvat ja tekniikka hoituvat samalta tiimiltä" }];
const EI = [{ t: "Etsit halvinta mahdollista sivustoa", v: "Halvin vaihtoehto on aina valmispohja, ja siitä maksetaan myöhemmin näkyvyydessä" }, { t: "Haluat rakentaa sivut itse", v: "Tarvitset silloin alustan ja mallipohjan, et toteuttajaa" }, { t: "Palvelusi tai kohderyhmäsi on vielä auki", v: "Kannattaa ensin päättää mitä myyt ja kenelle" }, { t: "Odotat Google-sijoituksia muutamassa viikossa", v: "Tekninen pohja on valmis heti, sijoitukset kertyvät kuukausissa" }];
export const KE_TAB = [
  { bg: "#6fecff", fg: "#0b0f14" },
  { bg: "#ff9a4d", fg: "#0b0f14" },
];
export const KE_LISTA = [SOP, EI].map((lista: { t: string; v?: string }[], k) => ({
  avain: k,
  reuna: k === 0 ? "rgba(111,236,255,.22)" : "rgba(255,154,77,.28)",
  ikBg: k === 0 ? "rgba(111,236,255,.16)" : "rgba(255,154,77,.16)",
  ikVari: k === 0 ? "#6fecff" : "#ff9a4d",
  ikoni: k === 0 ? "M5 12.5l4.2 4L19 7" : "M7 7l10 10M17 7 7 17",
  rivit: lista.map((r, i) => ({ t: r.t, v: r.v || "", raja: i ? "1px solid rgba(255,255,255,.07)" : "0" })),
}));

const PAK = [
  { nimi: "Startti", alk: "", hinta: "1 490", suosittu: false, kuvaus: "Pienyrittäjälle, joka tarvitsee uskottavat kotisivut nopeasti.", rivit: ["Etusivu ja 3 alasivua", "Ulkoasu ja tekstit valmiina", "Tekninen hakukoneoptimointi", "Yhteydenottolomake ja analytiikka", "Julkaisu 2 viikossa"] },
  { nimi: "Yrityssivusto", alk: "", hinta: "2 990", suosittu: true, kuvaus: "Yritykselle, jolla on useita palveluita ja jonka pitää näkyä hauissa.", rivit: ["6–12 sisältösivua", "Oma alasivu jokaiselle palvelulle", "Laajempi sisältö- ja hakusanatyö", "Referenssit ja työnäytteet", "Lomakkeet ja analytiikka", "Laajennettava rakenne"] },
  { nimi: "Räätälöity", alk: "alk.", hinta: "5 900", suosittu: false, kuvaus: "Kun tarpeet menevät pakettien yli.", rivit: ["Käsin koodattu toteutus", "Omat toiminnallisuudet ja integraatiot", "Verkkokauppa tai varausjärjestelmä", "Monikieliset sivut", "Ei ylärajaa sivumäärässä"] },
];
export const PAKETTI_ALKU = 1;
export const PAKETIT = PAK.map((p, i) => {
  const on = i === PAKETTI_ALKU;
  return { nimi: p.nimi, on, tabBg: on ? TAB.on.bg : TAB.ei.bg, tabFg: on ? TAB.on.fg : TAB.ei.fg };
});
export const PAKETIT_AUKI = PAK.map((p, i) => ({
  ...p,
  avain: i,
  hintaN: p.hinta,
  hintaLuku: parseInt(p.hinta.replace(/\s/g, ""), 10),
  bg: p.suosittu ? "linear-gradient(180deg, rgba(111,236,255,.1), rgba(255,255,255,.03))" : "rgba(255,255,255,.04)",
  reuna: p.suosittu ? "inset 0 0 0 1px rgba(111,236,255,.4), 0 30px 60px -36px rgba(111,236,255,.35)" : "inset 0 0 0 1px rgba(255,255,255,.1)",
  kickVari: p.suosittu ? "#b4f5ff" : "#8fa3b5",
}));

const UKK_ = [
  { k: "Paljonko kotisivut maksavat yritykselle?", v: "Kiinteä projektihinta alkaa 1 490 eurosta + alv 25,5 %. Suppea kokonaisuus on edullisin, useamman sivun yrityssivusto asettuu 2 990–4 900 euroon ja täysin räätälöity toteutus alkaa 5 900 eurosta. Lopullinen hinta riippuu sivuston laajuudesta, sisällön määrästä ja tarvittavista toiminnallisuuksista. Ylläpito maksaa 59 €/kk + alv, ja siihen kuuluvat palvelintila, verkkotunnus ja SSL-suojaus." },
  { k: "Mitä verkkosivujen hinta sisältää?", v: "Suunnittelun, toteutuksen, tekstit, kuvien viimeistelyn, teknisen hakukoneoptimoinnin, lomakkeet, analytiikan ja julkaisun. Ei aloitusmaksuja eikä piilokuluja. Palvelintila, verkkotunnus ja SSL-suojaus kuuluvat ylläpitoon, joka maksaa 59 €/kk + alv." },
  { k: "Kuinka nopeasti verkkosivut valmistuvat?", v: "Suppea kokonaisuus on julkaisukunnossa tyypillisesti 2 viikossa, laajempi yrityssivusto vie 3–5 viikkoa ja räätälöity toteutus 6–10 viikkoa. Suurin yksittäinen aikatauluun vaikuttava tekijä on se, kuinka nopeasti saamme sinulta kuvat ja hyväksynnät." },
  { k: "Onko pakko sitoutua kuukausimaksuun?", v: "Projektihinta on kertaluonteinen, ja sivusto on sen jälkeen sinun. Palvelintila, verkkotunnus ja SSL-suojaus kuuluvat ylläpitoon, joka maksaa 59 €/kk + alv ja jonka voi irtisanoa kuukauden irtisanomisajalla. Sivuston voi myös siirtää omalle palvelimellesi." },
  { k: "Paljonko verkkosivujen ylläpito maksaa?", v: "Perusylläpito maksaa 59 €/kk + alv, ja siihen kuuluvat palvelintila, verkkotunnus ja SSL-suojaus. Hakukoneoptimoinnin jatkuva seuranta ja parantaminen on erillinen palvelu, alk. 190 €/kk + alv." },
  { k: "Teettekö WordPress-kotisivut yritykselle?", v: "Tarvittaessa. Ylläpidämme myös olemassa olevia WordPress-sivustoja, ja teemme uuden sivuston WordPress-pohjalle, jos haluat päivittää sisältöä paljon itse. Muuten koodaamme sivuston itse, koska kevyempi toteutus latautuu nopeammin ja siinä on vähemmän päivitettävää." },
  { k: "Mikä ero on kotisivuilla, nettisivuilla ja verkkosivuilla?", v: "Ei mitään. Kaikki kolme tarkoittavat yrityksen omaa sivustoa. Kotisivut on sanoista vanhin, verkkosivut virallisin ja nettisivut arkisin. Hinnassa ja toteutuksessa ei ole eroa." },
  { k: "Voinko päivittää sisältöä itse?", v: "Voit. Räätälöity toteutus ei tarkoita, etteikö tekstejä ja kuvia voisi vaihtaa itse: teemme muokattavat osat hallintanäkymään ja opastamme käytön. Halutessasi hoidamme päivitykset puolestasi ylläpitopaketissa." },
  { k: "Kuka omistaa sivuston ja verkkotunnuksen?", v: "Sinä. Verkkotunnus rekisteröidään yrityksesi nimiin ja saat sivustoon täydet oikeudet. Emme lukitse sivustoa omalle alustallemme." },
  { k: "Pitääkö minulla olla valmiit tekstit ja kuvat?", v: "Ei tarvitse. Kirjoitamme tekstit puolestasi ja käsittelemme olemassa olevan kuvamateriaalin. Jos kuvia ei ole, voimme kuvata ne tai käyttää kuvapankkia, kuvaus hinnoitellaan erikseen." },
  { k: "Voiko vanhat sivut uudistaa ilman että Google-näkyvyys katoaa?", v: "Voi. Vanha verkkotunnus säilyy ja teemme vanhoista osoitteista uudelleenohjaukset uusiin, jolloin kertynyt näkyvyys siirtyy uudelle sivustolle. Tämä on se kohta, jossa sivustouudistus useimmiten epäonnistuu, joten se suunnitellaan ennen julkaisua eikä sen jälkeen." },
  { k: "Teettekö myös verkkokaupan?", v: "Teemme. Verkkokauppa rakennetaan saman sivuston osaksi, jolloin tuotesivut hyötyvät samasta rakenteesta ja hakukoneoptimoinnista kuin muukin sisältö." },
];
/* Suunnitelma: 6 ensimmaista nakyvissa, ensimmainen auki. */
export const UKK_NAKYVIA = 6;
export const UKK = UKK_.map((q, i) => {
  const auki = i === 0;
  return { ...q, auki, luokka: auki ? "l-faq auki" : "l-faq" };
});
export const UKK_KAIKKI_TEKSTI = "Näytä kaikki " + UKK_.length + " kysymystä";

export const ALUEET = [
  { t: "Espoo", v: "Toimipisteemme on Espoossa, ja pääkaupunkiseudulla tapaamme asiakkaita viikoittain." },
  { t: "Koko Suomi", v: "Kartoitus hoituu puhelimessa, suunnittelua seurataan demo-osoitteesta ja julkaisu tapahtuu verkossa. Sijainti ei vaikuta hintaan eikä aikatauluun." },
  { t: "Haussa", v: "Jos yrityksesi palvelee tiettyä aluetta, sivusto rakennetaan näkymään niillä hauilla, joissa paikkakunta on mukana." },
].map((a, i) => ({ ...a, raja: i ? "1px solid rgba(255,255,255,.07)" : "0" }));

export const SANAT = ["löytyvät Googlesta.", "latautuvat sekunnissa.", "tuovat yhteydenottoja.", "kestävät vuosia."];
