/**
 * Graafinen suunnittelu -sivun UKK. Yksi lahde sylottaa seka nakyvan
 * osion etta FAQPage-rakenteisen datan, jolloin ne eivat voi eriytya.
 */

export type FaqItem = { group: string; q: string; a: string };

export const FAQ: FaqItem[] = [
  {
    group: "Hinta ja laajuus",
    q: "Paljonko graafinen suunnittelu maksaa?",
    a: "Hinta muodostuu käytännössä työtunneista: Suomessa kokeneen graafisen suunnittelijan tuntihinta on tyypillisesti 70–120 euroa. Meillä logo alkaa 690 eurosta ja yritysilme graafisine ohjeistoineen 1 490 eurosta. Painotuotteen suunnittelu alkaa 190 eurosta ja teippaukset avaimet käteen 590 eurosta. Kaikkiin hintoihin lisätään arvonlisävero 25,5 %.",
  },
  {
    group: "Hinta ja laajuus",
    q: "Mikä on graafisen suunnittelijan tuntihinta Suomessa?",
    a: "Freelancerin tuntihinta asettuu tyypillisesti 50–90 euroon ja mainostoimiston 90–120 euroon. Me emme laskuta tuntityönä vaan annamme kiinteän hinnan, jotta tiedät kustannuksen etukäteen emmekä me hyödy siitä että työ venyy.",
  },
  {
    group: "Hinta ja laajuus",
    q: "Paljonko logosuunnittelu maksaa?",
    a: "Markkinoilla yksinkertainen tekstilogo on halvimmillaan alle kahdensadan euron ja kokonainen visuaalinen identiteetti nousee useaan tuhanteen. Meillä logo alkaa 690 eurosta. Ero halvimpaan syntyy siitä, että teemme useamman ehdotuksen, muutoskierrokset ja logopaketin kaikkiin käyttötarkoituksiin — myös teippaukseen ja painoon, joissa kuvatiedosto ei kelpaa.",
  },
  {
    group: "Hinta ja laajuus",
    q: "Mitä auton mainosteippaus maksaa?",
    a: "Hinta riippuu laajuudesta. Markkinoilla pelkkä logoteippaus asettuu 200–500 euroon, osateippaus 400–1 500 euroon ja koko auton yliteippaus 1 500–4 000 euroon. Meidän hintamme alkaa 590 eurosta ja sisältää suunnittelun, materiaalit ja asennuksen — ei pelkkää asennusta valmiilla tiedostolla.",
  },
  {
    group: "Hinta ja laajuus",
    q: "Sisältyykö teippauksen hintaan suunnittelu?",
    a: "Meillä sisältyy aina. Alalla on tavallista, että teippaamo tekee yksinkertaisen sommittelun veloituksetta mutta laskuttaa erikseen näyttävämmästä suunnittelusta ja olettaa saavansa asiakkaalta valmiin vektoroidun logon. Me lähdemme siitä, että suunnittelu on työn ydin eikä lisäpalvelu.",
  },
  {
    group: "Toteutus",
    q: "Teettekö teippaukset ja painotuotteet itse?",
    a: "Emme. Teippaus, painatus ja asennus tulevat alihankintana tekijöiltä, jotka tekevät sitä työkseen joka päivä. Me suunnittelemme, valitsemme toimittajat, toimitamme heille oikeat tiedostot ja vastaamme lopputuloksesta sinulle. Saat yhden tarjouksen ja yhden laskun, emmekä siirrä vastuuta eteenpäin jos jokin menee pieleen.",
  },
  {
    group: "Toteutus",
    q: "Kuinka monta muutoskierrosta hintaan sisältyy?",
    a: "Yhdestä kahteen kierrosta sisältyy jokaiseen suunnittelutyöhön. Useampaa tarvitaan käytännössä harvoin, koska esitämme ensin kaksi tai kolme selvästi erilaista suuntaa sen sijaan että viilaisimme yhtä ehdotusta eteenpäin.",
  },
  {
    group: "Toteutus",
    q: "Mitä graafinen ohjeisto sisältää?",
    a: "Graafinen ohjeisto kokoaa ilmeen pelisäännöt yhteen PDF-tiedostoon: logon eri versiot ja suojaetäisyydet, minimikoot, väriarvot CMYK-, RGB- ja HEX-muodossa, typografian otsikoille ja leipätekstille sekä esimerkit siitä miten logoa ei saa käyttää. Sen ansiosta ilme pysyy samana, vaikka materiaalia tekisi joku muu.",
  },
  {
    group: "Toteutus",
    q: "Kuka omistaa valmiit aineistot?",
    a: "Sinä. Saat muokattavat alkuperäistiedostot ja täydet käyttöoikeudet, ja niistä sovitaan kirjallisesti ennen työn aloittamista. Emme pidä aineistoja itsellämme emmekä sido sinua meihin sillä perusteella, että tiedostot ovat vain meidän koneellamme.",
  },
  {
    group: "Toteutus",
    q: "Tarvitseeko minulla olla valmis logo?",
    a: "Ei tarvitse. Suunnittelemme logon tarvittaessa alusta. Jos logo on olemassa vain kuvatiedostona, vektoroimme sen ensin — ilman vektorimuotoa logoa ei saa tulostettua teippikalvolle tai suurikokoiseen kylttiin terävänä.",
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
    a: "Kyllä. WS Media tekee graafisen suunnittelun lisäksi <a href=\"/verkkosivut\">verkkosivut</a>, <a href=\"/hakukoneoptimointi\">hakukoneoptimoinnin</a> ja <a href=\"/lyhytvideot\">lyhytvideot</a>. Kun sama tiimi tekee sekä digitaalisen että fyysisen ilmeen, yritys näyttää samalta verkossa, somessa ja kadulla — eikä samaa työtä tehdä kahteen kertaan.",
  },
];

/** Ryhmat esiintymisjarjestyksessa. */
export const FAQ_GROUPS: string[] = [...new Set(FAQ.map((f) => f.group))];
