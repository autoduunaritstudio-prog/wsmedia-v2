/**
 * Graafinen suunnittelu -sivun UKK. Yksi lahde sylottaa seka nakyvan
 * osion etta FAQPage-rakenteisen datan, jolloin ne eivat voi eriytya.
 */

export type FaqItem = {
  group: string;
  q: string;
  a: string;
  /** Sisaiset linkit vastauksen alle. Ei JSON-LD:hen, koska teksti on merkkijono. */
  linkit?: { href: string; label: string }[];
};

export const FAQ: FaqItem[] = [
  {
    group: "Hinta ja laajuus",
    q: "Paljonko graafinen suunnittelu maksaa yritykselle?",
    a: "Hinta riippuu siitä, mitä kaikkea tarvitset. Meillä logo alkaa 490 eurosta ja yritysilme graafisine ohjeistoineen 1 490 eurosta. Painotuotteen suunnittelu alkaa 190 eurosta, auton mainosteippaus avaimet käteen 490 eurosta ja ikkunateippaus 290 eurosta. Hintoihin lisätään arvonlisävero 25,5 %.",
  },
  {
    group: "Hinta ja laajuus",
    q: "Mikä on graafisen suunnittelijan tuntihinta Suomessa?",
    a: "Graafisen suunnittelijan tuntihinta on tyypillisesti 45–100 euroa kokemuksesta riippuen, ja mainostoimistoissa hinnat ovat usein tätä korkeammat. Me emme laskuta tunneista vaan annamme kiinteän hinnan, joten tiedät kustannuksen etukäteen.",
  },
  {
    group: "Hinta ja laajuus",
    q: "Paljonko logosuunnittelu maksaa?",
    a: "Suomessa logon suunnittelu maksaa tyypillisesti muutamasta sadasta noin 1 500 euroon, ja koko yritysilme ohjeistoineen nousee usein useaan tuhanteen. Meillä logo alkaa 490 eurosta. Hintaan sisältyy kaksi tai kolme ehdotusta, muutoskierrokset ja logopaketti kaikkiin käyttötarkoituksiin, myös teippaukseen ja painoon, joissa pelkkä kuvatiedosto ei kelpaa.",
  },
  {
    group: "Hinta ja laajuus",
    q: "Mitä auton mainosteippaus maksaa?",
    a: "Hinta riippuu laajuudesta. Pelkkä logoteippaus maksaa tyypillisesti 200–400 euroa, osateippaus 400–1 200 euroa ja koko pakettiauton teippaus 1 500–4 000 euroa. Meillä auton mainosteippaus alkaa 490 eurosta ja sisältää suunnittelun, materiaalit ja asennuksen. Moni teippaamo laskuttaa suunnittelun erikseen tai olettaa, että sinulla on valmis tiedosto.",
  },
  {
    group: "Hinta ja laajuus",
    q: "Sisältyykö teippauksen hintaan suunnittelu?",
    a: "Meillä sisältyy aina. Alalla on tavallista, että teippaamo tekee yksinkertaisen sommittelun veloituksetta mutta laskuttaa erikseen näyttävämmästä suunnittelusta ja olettaa saavansa asiakkaalta valmiin vektoroidun logon. Me lähdemme siitä, että suunnittelu on työn ydin eikä lisäpalvelu.",
  },
  {
    group: "Toteutus",
    q: "Teettekö teippaukset ja painotuotteet itse?",
    a: "Emme. Teippaus, painatus ja asennus tehdään alihankintana alan ammattilaisilla. Me suunnittelemme, valitsemme toimittajat, toimitamme heille oikeat tiedostot ja vastaamme lopputuloksesta sinulle. Saat yhden tarjouksen ja yhden laskun, emmekä siirrä vastuuta eteenpäin, jos jokin menee pieleen.",
  },
  {
    group: "Toteutus",
    q: "Kuinka monta muutoskierrosta hintaan sisältyy?",
    a: "Yhdestä kahteen kierrosta sisältyy jokaiseen suunnittelutyöhön. Useampaa tarvitaan käytännössä harvoin, koska esitämme ensin kaksi tai kolme selvästi erilaista suuntaa sen sijaan että viilaisimme yhtä ehdotusta eteenpäin.",
  },
  {
    group: "Toteutus",
    q: "Mitä graafinen ohjeisto sisältää ja paljonko se maksaa?",
    a: "Graafinen ohjeisto kokoaa ilmeen pelisäännöt yhteen PDF-tiedostoon: logon eri versiot ja suojaetäisyydet, minimikoot, väriarvot CMYK-, RGB- ja HEX-muodossa, typografian otsikoille ja leipätekstille sekä esimerkit siitä miten logoa ei saa käyttää. Sen ansiosta ilme pysyy samana, vaikka materiaalia tekisi joku muu. Ohjeisto sisältyy yritysilmeeseen, jonka hinta alkaa 1 490 eurosta.",
  },
  {
    group: "Toteutus",
    q: "Kuka omistaa valmiit aineistot?",
    a: "Sinä. Saat muokattavat alkuperäistiedostot ja täydet käyttöoikeudet, ja niistä sovitaan kirjallisesti ennen työn aloittamista. Emme pidä aineistoja itsellämme emmekä sido sinua meihin sillä perusteella, että tiedostot ovat vain meidän koneellamme.",
  },
  {
    group: "Toteutus",
    q: "Pitääkö minulla olla valmis logo?",
    a: "Ei tarvitse. Suunnittelemme logon tarvittaessa alusta. Jos logo on olemassa vain kuvatiedostona, vektoroimme sen ensin, sillä ilman vektorimuotoa logoa ei saa tulostettua teippikalvolle tai suurikokoiseen kylttiin terävänä.",
  },
  {
    group: "Toteutus",
    q: "Kuinka kauan projekti kestää?",
    a: "Yritysilme valmistuu tyypillisesti kolmesta neljään viikkoon hyväksyntöjen nopeudesta riippuen. Ajoneuvoteippauksen asennus vie yhdestä kolmeen päivää. Valomainoksissa toimitusaika on pidempi, tyypillisesti kolmesta viiteen viikkoa, koska tuote valmistetaan mittatilaustyönä.",
  },
  {
    group: "Kesto ja jatko",
    q: "Kuinka kauan auton teipit kestävät?",
    a: "Ammattitason kalvolla teipattu auto pysyy siistinä tyypillisesti kolmesta seitsemään vuotta. Lyhytikäinen kampanjateippi kestää kuukausia. Kestoikään vaikuttavat materiaalin laatu, asennusolosuhteet ja se, säilytetäänkö auto ulkona vai hallissa.",
  },
  {
    group: "Kesto ja jatko",
    q: "Voiko yhden auton teipata nyt ja loput myöhemmin?",
    a: "Voi, ja se on yleisin tapa edetä. Suunnittelu tehdään kerran, ja samat tiedostot toimivat myöhemmin lisättäville ajoneuvoille. Silloin maksat seuraavista autoista vain tuotannon ja asennuksen, et suunnittelua uudestaan.",
  },
  {
    group: "Kesto ja jatko",
    q: "Tarvitseeko valomainos luvan?",
    a: "Usein tarvitsee. Kiinteään rakenteeseen asennettava valomainos vaatii tyypillisesti toimenpideluvan kunnalta, ja käytännöt vaihtelevat kunnittain sekä sen mukaan onko rakennus suojeltu. Selvitämme lupa-asiat osana projektia ennen kuin mitään tilataan.",
  },
  {
    group: "Kesto ja jatko",
    q: "Teettekö myös verkkosivut ja videot?",
    a: "Kyllä. WS Media tekee graafisen suunnittelun lisäksi verkkosivut, hakukoneoptimoinnin ja lyhytvideot. Kun sama tiimi tekee sekä digitaalisen että fyysisen ilmeen, yritys näyttää samalta verkossa, somessa ja kadulla, eikä samaa työtä tehdä kahteen kertaan.",
    linkit: [
      { href: "/verkkosivut", label: "Verkkosivut" },
      { href: "/hakukoneoptimointi", label: "Hakukoneoptimointi" },
      { href: "/lyhytvideot", label: "Lyhytvideot" },
    ],
  },
];

/** Ryhmat esiintymisjarjestyksessa. */
export const FAQ_GROUPS: string[] = [...new Set(FAQ.map((f) => f.group))];
