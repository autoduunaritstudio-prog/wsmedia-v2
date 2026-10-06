/* GRAAFISEN SUUNNITTELUN PUHELINVERSIO: suunnitelman renderVals()-tiedot
   sellaisenaan (_mobiili-design/sivut/Graafinen.dc.html). Yhteinen
   Mobiili.tsx:lle (alkutila merkintaan) ja Efektit.tsx:lle (tilan
   vaihdot: vertailu, karuselli, hintalaskuri, kenelle). */

/* Heron kaari: auto teipataan 0..SC, kansi nousee KA..KA+HV. */
export const SC = 340;
export const KA = 330;
/** Spriten ruutuja (0..33), 8 saraketta x 5 rivia. */
export const RUUDUT = 33;

/* Logonauha. Suunnitelman /logos/*.png korvattu kevyilla
   /mobiili/logot/*.webp-versioilla (tyoohje), korkeudet ja suodin
   suunnitelmasta. */
const logot = [
  { src: "/mobiili/logot/porsche-club-finland.webp", alt: "Porsche Club Finland", h: 34, f: "brightness(0) invert(1)" },
  { src: "/mobiili/logot/tesla-owners-finland-color.webp", alt: "Tesla Owners Finland", h: 34, f: "none" },
  { src: "/mobiili/logot/colormaster.webp", alt: "Colormaster", h: 28, f: "brightness(0) invert(1)" },
  { src: "/mobiili/logot/ydr-autohuolto.webp", alt: "YDR Autohuolto", h: 30, f: "brightness(0) invert(1)" },
  { src: "/mobiili/logot/ls-monogram-color.webp", alt: "Laaksolahden Sähkö", h: 32, f: "none" },
];
export const LOGOT = logot.concat(logot, logot, logot);

/* ---------------- VERTAILU ---------------- */
const OK = "M5 12.5l4.2 4L19 7";
const EI = "M7 7l10 10M17 7 7 17";
const VAIHEET = ["Suunnittelu", "Tiedostot", "Tuotanto", "Asennus"];
const VERT = [
  { lyhyt: "Teippaamo", otsikko: "Teippaamo tai painotalo", tiivis: "Tuottaa ja asentaa. Suunnittelu on sivutuote.", rivit: ["Suunnittelu usein vain yksinkertaisiin töihin", "Olettaa, että sinulla on valmis vektorilogo", "Ilme ei jatku nettisivuille eikä someen"], tila: [0.5, 1, 1, 1], vari: "#8fa3b5", me: false },
  { lyhyt: "WS Media", otsikko: "Suunnittelemme ilmeen ja hoidamme tuotannon", tiivis: "Suunnittelu, tuotanto ja asennus samassa tarjouksessa.", rivit: ["Sama ilme nettisivuilla, somessa ja auton kyljessä", "Saat alkuperäistiedostot ja täydet käyttöoikeudet", "Vastaamme lopputuloksesta, myös alihankkijan työstä"], tila: [1, 1, 1, 1], vari: "#ff9a4d", me: true },
  { lyhyt: "Mainostoimisto", otsikko: "Mainostoimisto", tiivis: "Suunnittelee. Tuotanto ja asennus jäävät sinulle.", rivit: ["Painovalmis tiedosto on lopputulos", "Kilpailutat painon ja teippaamon itse", "Sovittelet aikataulut itse"], tila: [1, 1, 0, 0], vari: "#8fa3b5", me: false },
];
export const VERT_ALKU = 1;
/** Valitsimen napin taustat ja tekstivarit (suunnitelman vertailu-map). */
export const vertTab = (i: number, valittu: number) => {
  const on = valittu === i;
  const me = VERT[i].me;
  return {
    on,
    bg: on ? (me ? "#ff9a4d" : "#c9d6e2") : me ? "rgba(255,154,77,.14)" : "transparent",
    fg: on ? "#0b0f14" : me ? "#ffc79c" : "#c9d6e2",
  };
};
export const VERTAILU = VERT.map((v, i) => {
  const t = vertTab(i, VERT_ALKU);
  return { lyhyt: v.me ? "★ " + v.lyhyt : v.lyhyt, on: t.on, tabBg: t.bg, tabFg: t.fg };
});
/* Kaikki kolme korttia valmiiksi (suunnitelmassa vain valittu); Efektit
   vaihtaa nakyvan. */
export const VERT_KORTIT = VERT.map((va) =>
  Object.assign({}, va, {
    bg: va.me ? "radial-gradient(120% 80% at 0% 0%, rgba(255,154,77,.3) 0%, rgba(255,154,77,.09) 45%, rgba(12,20,30,.92) 100%)" : "rgba(255,255,255,.025)",
    reuna: va.me ? "inset 0 0 0 1.5px #ff9a4d, 0 0 0 5px rgba(255,154,77,.14), 0 34px 70px -30px rgba(255,154,77,.55)" : "inset 0 0 0 1px rgba(255,255,255,.08)",
    luokka: va.me ? "l-kortti-in g-me" : "l-kortti-in g-muu",
    muu: !va.me,
    koko: va.me ? 20 : 17,
    ikVari: va.me ? "#ff9a4d" : "#6f8191",
    ikoni: va.me ? OK : "M5 12h14",
    vaiheet: VAIHEET.map((n, k) => {
      const t = va.tila[k];
      return {
        n: t === 0.5 ? n + ", osittain" : n,
        c: t === 0 ? "rgba(255,255,255,.08)" : t === 0.5 ? "repeating-linear-gradient(-45deg, " + va.vari + " 0 4px, transparent 4px 7px)" : va.vari,
        sx: 1,
        d: (k * 0.1).toFixed(2),
        tc: t === 0 ? "#5d6b78" : "#c3d0dc",
        td: t === 0 ? "line-through" : "none",
      };
    }),
  }),
);

/* ---------------- PALVELUT (karuselli) ---------------- */
const PAL = [
  { kick: "PERUSTA", nimi: "Logo ja yritysilme", hinta: "Logo alk. 490 €", kuva: "/graafinen-suunnittelu/palvelu-logo.webp", alt: "Logoluonnoksia paperilla ja värimallit", teksti: "Logon suunnittelu on koko ilmeen pohja. Logon ympärille tehdään väripaletti, fontit ja graafinen ohjeisto, joiden ansiosta ilme pysyy samana, vaikka materiaalia tekisi joku muu.", rivit: ["Logopaketti kaikissa tiedostomuodoissa", "Väriarvot painoon, näytölle ja teippiin", "Fontit otsikoille ja leipätekstille", "Graafinen ohjeisto PDF-tiedostona"] },
  { kick: "LIIKKUVA PINTA", nimi: "Auton mainosteippaus", hinta: "Avaimet käteen alk. 490 €", kuva: "/graafinen-suunnittelu/palvelu-auto.webp", alt: "Teipattu pakettiauto kadulla illalla", teksti: "Pakettiauton logoteippauksesta koko kaluston ilmeeseen. Suunnittelu tehdään kerran, joten seuraavista autoista maksat vain tulostuksen ja asennuksen.", rivit: ["Logoteippaus, osateippaus ja yliteippaus", "Pakettiautot, henkilöautot ja kuorma-autot", "Koko kalusto samalla ilmeellä", "Asennus lämpimässä sisätilassa"] },
  { kick: "TOIMITILA", nimi: "Ikkunateippaukset, kyltit ja valomainokset", hinta: "Ikkunateippaus alk. 290 €", kuva: "/graafinen-suunnittelu/palvelu-ikkuna.webp", alt: "Ikkunateippausta asennetaan liikkeen ikkunaan", teksti: "Liikkeen ikkuna ja julkisivu näkyvät ohikulkijoille joka päivä. Teemme ne samalla ilmeellä kuin muutkin materiaalisi.", rivit: ["Ikkuna- ja julkisivuteippaukset", "Valomainokset ja kyltit", "Opasteet ja lattiateippaukset", "Mainosluvan selvitys kunnalta"] },
  { kick: "KÄTEEN JÄÄVÄ", nimi: "Käyntikortit, esitteet ja roll-upit", hinta: "Suunnittelu alk. 190 €", kuva: "/graafinen-suunnittelu/palvelu-kayntikortit.webp", alt: "WS Median käyntikortit", teksti: "Suunnittelemme painotuotteet ja teetämme ne valmiiksi. Saat painovalmiit tiedostot myös itsellesi, jos haluat tilata lisäpainoksen myöhemmin muualta.", rivit: ["Käyntikortit ja kirjelomakkeet", "Flyerit, esitteet ja oppaat", "Roll-upit ja messumateriaalit", "Oikeat väriarvot painoa varten"] },
];
export const palTila = (on: boolean) => ({ sk: on ? 1 : 0.94, op: on ? 1 : 0.6, zoom: on ? 1 : 1.12, reuna: on ? "rgba(111,236,255,.35)" : "rgba(255,255,255,.08)" });
export const pisteTila = (on: boolean) => ({ w: on ? 22 : 6, c: on ? "#6fecff" : "rgba(255,255,255,.25)" });
export const PALVELUT = PAL.map((p, i) => Object.assign({}, p, { nro: i + 1 }, palTila(i === 0)));
export const PAL_PISTEET = PAL.map((_, i) => pisteTila(i === 0));

/* ---------------- HINTALASKURI ---------------- */
export const fi = (n: number) => String(Math.round(n / 10) * 10).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
export type Kohde = { id: string; nimi: string; min: number; max: number };
export const RYH: { otsikko: string; kohteet: Kohde[] }[] = [
  { otsikko: "Ilme", kohteet: [{ id: "logo", nimi: "Logo ja tunnus", min: 490, max: 1200 }, { id: "ohje", nimi: "Värit, fontit ja ohjeisto", min: 1000, max: 2000 }] },
  { otsikko: "Painotuotteet", kohteet: [{ id: "kortit", nimi: "Käyntikortit", min: 190, max: 490 }, { id: "esite", nimi: "Flyer tai esite", min: 280, max: 1200 }, { id: "rollup", nimi: "Roll-up", min: 290, max: 690 }] },
  { otsikko: "Toimitila", kohteet: [{ id: "ikkuna", nimi: "Ikkuna- tai julkisivuteippaus", min: 290, max: 2500 }, { id: "valo", nimi: "Valomainos tai kyltti", min: 800, max: 5000 }] },
];
export const AUTO: Kohde[] = [
  { id: "ei", nimi: "Ei autoa", min: 0, max: 0 },
  { id: "logo", nimi: "Logot ja yhteystiedot", min: 490, max: 900 },
  { id: "osa", nimi: "Kyljet ja takaosa", min: 990, max: 2200 },
  { id: "koko", nimi: "Koko auto", min: 2400, max: 4500 },
];
export const VALITUT_ALKU: Record<string, boolean> = { logo: true, ohje: true };
export const AUTO_ALKU = "ei";

export const kohdeTila = (on: boolean) => ({
  bg: on ? "rgba(111,236,255,.1)" : "rgba(255,255,255,.03)",
  reuna: on ? "inset 0 0 0 1.5px rgba(111,236,255,.55)" : "inset 0 0 0 1px rgba(255,255,255,.09)",
  ruutu: on ? "#6fecff" : "transparent",
  ruutuReuna: on ? "none" : "inset 0 0 0 1.5px rgba(255,255,255,.3)",
  ruksi: on ? 1 : 0,
});
export const autoTila = (on: boolean) => ({
  bg: on ? "#6fecff" : "rgba(255,255,255,.04)",
  fg: on ? "#0b0f14" : "#eef3f7",
  reuna: on ? "none" : "inset 0 0 0 1px rgba(255,255,255,.1)",
});
export const RYHMAT = RYH.map((r) => ({
  otsikko: r.otsikko,
  kohteet: r.kohteet.map((k) => {
    const on = !!VALITUT_ALKU[k.id];
    return Object.assign({ id: k.id, nimi: k.nimi, alk: fi(k.min), on }, kohdeTila(on));
  }),
}));
export const AUTOT = AUTO.map((a) => {
  const on = AUTO_ALKU === a.id;
  return Object.assign({ id: a.id, nimi: a.nimi, alk: a.min ? "alk. " + fi(a.min) + " €" : "ei teippausta", on }, autoTila(on));
});
/** Suunnitelman arvio-laskenta sellaisenaan. */
export function laskeArvio(valitut: Record<string, boolean>, auto: string, autoja: number) {
  const rivit: { n: string; min: number; max: number }[] = [];
  RYH.forEach((r) => r.kohteet.forEach((k) => {
    if (valitut[k.id]) rivit.push({ n: k.nimi, min: k.min, max: k.max });
  }));
  const aa = AUTO.find((x) => x.id === auto)!;
  if (aa.id !== "ei") {
    const kk = 1 + 0.75 * (autoja - 1);
    rivit.push({ n: autoja > 1 ? "Auton teippaus, " + autoja + " autoa" : "Auton teippaus", min: aa.min * kk, max: aa.max * kk });
  }
  const lo = rivit.reduce((t, r) => t + r.min, 0);
  const hi = rivit.reduce((t, r) => t + r.max, 0);
  return { teksti: rivit.length ? fi(lo) + "–" + fi(hi) + " €" : "Valitse kohteet", rivit: rivit.map((r) => ({ n: r.n, v: fi(r.min) + "–" + fi(r.max) + " €" })) };
}
export const ARVIO = laskeArvio(VALITUT_ALKU, AUTO_ALKU, 1);

/* ---------------- KENELLE ---------------- */
const SOP = [{ t: "Ilmettä tarvitaan useaan paikkaan: autoon, toimitilaan ja painotuotteisiin" }, { t: "Yrityksellä on kalustoa, jonka pitäisi näyttää samalta ensimmäisestä autosta viimeiseen" }, { t: "Nykyinen logo on epäselvä, vanhentunut tai olemassa vain kuvatiedostona" }, { t: "Et halua kilpailuttaa kolmea toimittajaa ja sovitella niiden aikatauluja" }, { t: "Haluat että verkkosivut, some ja fyysiset pinnat näyttävät samalta yritykseltä" }];
const EIK: { t: string; v?: string }[] = [{ t: "Tarvitset vain yhden auton logoteippauksen ja sinulla on jo vektoroitu logo.", v: "Silloin teippaamo on nopeampi ja edullisempi." }, { t: "Etsit halvinta mahdollista hintaa etkä välitä kestoiästä." }, { t: "Yrityksen nimi tai toimiala on vielä auki." }, { t: "Haluat vain painovalmiin tiedoston ja hoidat tuotannon itse.", v: "Teemme sitäkin, mutta silloin et hyödy kokonaisuudesta." }];
export const keTila = (i: number, valittu: number) => {
  const on = i === valittu;
  return { on, bg: on ? (i === 0 ? "#6fecff" : "#ff9a4d") : "transparent", fg: on ? "#0b0f14" : "#c9d6e2" };
};
/* Molemmat listat valmiiksi (suunnitelmassa vain valittu). */
export const KE_LISTAT = [SOP as { t: string; v?: string }[], EIK].map((lista, k) => ({
  reuna: k === 0 ? "rgba(111,236,255,.22)" : "rgba(255,154,77,.28)",
  ikBg: k === 0 ? "rgba(111,236,255,.16)" : "rgba(255,154,77,.16)",
  ikVari: k === 0 ? "#6fecff" : "#ff9a4d",
  ikoni: k === 0 ? OK : EI,
  rivit: lista.map((r, i) => ({ t: r.t, v: r.v || "", raja: i ? "1px solid rgba(255,255,255,.07)" : "0" })),
}));

/* ---------------- KESTOT (asteikko 0-8 vuotta) ---------------- */
export const KESTOT = [
  { kohde: "Ajoneuvoteippaus", materiaali: "Ammattitason tarrakalvo", ika: "3–7 vuotta", huom: "asennus lämpimässä sisätilassa, pinta esikäsitellään", palkki: true, a: 37.5, b: 12.5 },
  { kohde: "Yliteippaus", materiaali: "Valettu värinvaihtokalvo", ika: "5–7 vuotta", huom: "alkuperäinen maalipinta säilyy kalvon alla", palkki: true, a: 62.5, b: 12.5 },
  { kohde: "Ikkuna- ja julkisivuteippaus", materiaali: "Ikkunakalvo tai tarrateippi", ika: "3–5 vuotta", huom: "erikoiskalvoilla myös häikäisy- ja UV-suoja", palkki: true, a: 37.5, b: 37.5 },
  { kohde: "Valomainos", materiaali: "LED-tekniikka, alumiini ja akryyli", ika: "LED 50 000–100 000 h", huom: "toimitusaika tyypillisesti 3–5 viikkoa, lupa-asiat selvitetään", palkki: false, a: 0, b: 0 },
  { kohde: "Painotuotteet", materiaali: "Paperilaatu käyttökohteen mukaan", ika: "Ei kulutuskestoa", huom: "painovalmis aineisto oikeilla väriprofiileilla", palkki: false, a: 0, b: 0 },
].map((k, i) => Object.assign({}, k, { raja: i ? "1px solid rgba(255,255,255,.07)" : "0" }));

/* ---------------- UKK ---------------- */
const UKK = [
  { k: "Paljonko graafinen suunnittelu maksaa yritykselle?", v: "Hinta riippuu siitä, mitä kaikkea tarvitset. Meillä logo alkaa 490 eurosta ja yritysilme graafisine ohjeistoineen 1 490 eurosta. Painotuotteen suunnittelu alkaa 190 eurosta, auton mainosteippaus avaimet käteen 490 eurosta ja ikkunateippaus 290 eurosta. Hintoihin lisätään arvonlisävero 25,5 %." },
  { k: "Mikä on graafisen suunnittelijan tuntihinta Suomessa?", v: "Graafisen suunnittelijan tuntihinta on tyypillisesti 45–100 euroa kokemuksesta riippuen, ja mainostoimistoissa hinnat ovat usein tätä korkeammat. Me emme laskuta tunneista vaan annamme kiinteän hinnan, joten tiedät kustannuksen etukäteen." },
  { k: "Paljonko logosuunnittelu maksaa?", v: "Suomessa logon suunnittelu maksaa tyypillisesti muutamasta sadasta noin 1 500 euroon, ja koko yritysilme ohjeistoineen nousee usein useaan tuhanteen. Meillä logo alkaa 490 eurosta. Hintaan sisältyy kaksi tai kolme ehdotusta, muutoskierrokset ja logopaketti kaikkiin käyttötarkoituksiin, myös teippaukseen ja painoon, joissa pelkkä kuvatiedosto ei kelpaa." },
  { k: "Mitä auton mainosteippaus maksaa?", v: "Hinta riippuu laajuudesta. Pelkkä logoteippaus maksaa tyypillisesti 200–400 euroa, osateippaus 400–1 200 euroa ja koko pakettiauton teippaus 1 500–4 000 euroa. Meillä auton mainosteippaus alkaa 490 eurosta ja sisältää suunnittelun, materiaalit ja asennuksen. Moni teippaamo laskuttaa suunnittelun erikseen tai olettaa, että sinulla on valmis tiedosto." },
  { k: "Sisältyykö teippauksen hintaan suunnittelu?", v: "Meillä sisältyy aina. Alalla on tavallista, että teippaamo tekee yksinkertaisen sommittelun veloituksetta mutta laskuttaa erikseen näyttävämmästä suunnittelusta ja olettaa saavansa asiakkaalta valmiin vektoroidun logon. Me lähdemme siitä, että suunnittelu on työn ydin eikä lisäpalvelu." },
  { k: "Teettekö teippaukset ja painotuotteet itse?", v: "Emme. Teippaus, painatus ja asennus tehdään alihankintana alan ammattilaisilla. Me suunnittelemme, valitsemme toimittajat, toimitamme heille oikeat tiedostot ja vastaamme lopputuloksesta sinulle. Saat yhden tarjouksen ja yhden laskun, emmekä siirrä vastuuta eteenpäin, jos jokin menee pieleen." },
  { k: "Kuinka monta muutoskierrosta hintaan sisältyy?", v: "Yhdestä kahteen kierrosta sisältyy jokaiseen suunnittelutyöhön. Useampaa tarvitaan käytännössä harvoin, koska esitämme ensin kaksi tai kolme selvästi erilaista suuntaa sen sijaan että viilaisimme yhtä ehdotusta eteenpäin." },
  { k: "Mitä graafinen ohjeisto sisältää ja paljonko se maksaa?", v: "Graafinen ohjeisto kokoaa ilmeen pelisäännöt yhteen PDF-tiedostoon: logon eri versiot ja suojaetäisyydet, minimikoot, väriarvot CMYK-, RGB- ja HEX-muodossa, typografian otsikoille ja leipätekstille sekä esimerkit siitä miten logoa ei saa käyttää. Sen ansiosta ilme pysyy samana, vaikka materiaalia tekisi joku muu. Ohjeisto sisältyy yritysilmeeseen, jonka hinta alkaa 1 490 eurosta." },
  { k: "Kuka omistaa valmiit aineistot?", v: "Sinä. Saat muokattavat alkuperäistiedostot ja täydet käyttöoikeudet, ja niistä sovitaan kirjallisesti ennen työn aloittamista. Emme pidä aineistoja itsellämme emmekä sido sinua meihin sillä perusteella, että tiedostot ovat vain meidän koneellamme." },
  { k: "Pitääkö minulla olla valmis logo?", v: "Ei tarvitse. Suunnittelemme logon tarvittaessa alusta. Jos logo on olemassa vain kuvatiedostona, vektoroimme sen ensin, sillä ilman vektorimuotoa logoa ei saa tulostettua teippikalvolle tai suurikokoiseen kylttiin terävänä." },
  { k: "Kuinka kauan projekti kestää?", v: "Yritysilme valmistuu tyypillisesti kolmesta neljään viikkoon hyväksyntöjen nopeudesta riippuen. Ajoneuvoteippauksen asennus vie yhdestä kolmeen päivää. Valomainoksissa toimitusaika on pidempi, tyypillisesti kolmesta viiteen viikkoa, koska tuote valmistetaan mittatilaustyönä." },
  { k: "Kuinka kauan auton teipit kestävät?", v: "Ammattitason kalvolla teipattu auto pysyy siistinä tyypillisesti kolmesta seitsemään vuotta. Lyhytikäinen kampanjateippi kestää kuukausia. Kestoikään vaikuttavat materiaalin laatu, asennusolosuhteet ja se, säilytetäänkö auto ulkona vai hallissa." },
  { k: "Voiko yhden auton teipata nyt ja loput myöhemmin?", v: "Voi, ja se on yleisin tapa edetä. Suunnittelu tehdään kerran, ja samat tiedostot toimivat myöhemmin lisättäville ajoneuvoille. Silloin maksat seuraavista autoista vain tuotannon ja asennuksen, et suunnittelua uudestaan." },
  { k: "Tarvitseeko valomainos luvan?", v: "Usein tarvitsee. Kiinteään rakenteeseen asennettava valomainos vaatii tyypillisesti toimenpideluvan kunnalta, ja käytännöt vaihtelevat kunnittain sekä sen mukaan onko rakennus suojeltu. Selvitämme lupa-asiat osana projektia ennen kuin mitään tilataan." },
  { k: "Teettekö myös verkkosivut ja videot?", v: "Kyllä. WS Media tekee graafisen suunnittelun lisäksi verkkosivut, hakukoneoptimoinnin ja lyhytvideot. Kun sama tiimi tekee sekä digitaalisen että fyysisen ilmeen, yritys näyttää samalta verkossa, somessa ja kadulla, eikä samaa työtä tehdä kahteen kertaan." },
];
/* Kaikki 15 HTML:ssa (6 ensimmaista nakyvissa, ensimmainen auki). */
export const UKK_ = UKK.map((q, i) => {
  const auki = i === 0;
  return Object.assign({}, q, { auki, luokka: auki ? "l-faq auki" : "l-faq" });
});

export const ALUEET = [
  { t: "Espoo", v: "Toimistomme on Espoossa. Pääkaupunkiseudun yrityksiä tapaamme mielellämme myös paikan päällä." },
  { t: "Koko Suomi", v: "Suunnittelu ja hyväksynnät hoituvat verkossa. Asennus tehdään siellä, missä autosi ja toimitilasi ovat." },
  { t: "Ovellesi", v: "Painotuotteet toimitetaan suoraan osoitteeseesi." },
].map((a, i) => Object.assign({}, a, { raja: i ? "1px solid rgba(255,255,255,.07)" : "0" }));
