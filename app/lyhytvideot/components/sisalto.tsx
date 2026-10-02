/* LYHYTVIDEOT-ALASIVUN TEKSTIT.
   Poimittu koneellisesti vanhoista osiotiedostoista merkki merkilta:
   sivun ilme vaihtuu, tekstit eivat. Paikanpitajat [HINTA] ja [X]
   sailyvat sellaisinaan, Tuomas tayttaa ne myohemmin. */

/* KORTIT, UUSI ULKOASU (2.10.2026, Tuomaksen hyvaksyma luonnos):
   jokaisella kortilla on iso luku tai sana (luku), sen ylapuolella pieni
   otsikkorivi (kick) ja lyhyempi teksti. Kaaviot ovat ennallaan. */
export const REASONS = [
  {
    art: "hook",
    kick: "Pysyvyys",
    luku: "3 s",
    h: "Alku ratkaisee",
    p: "Katsoja päättää muutamassa sekunnissa, jatkaako hän.",
  },
  {
    art: "channels",
    kick: "Samasta kuvauksesta",
    luku: "4 kanavaa",
    h: "Yksi kuvauspäivä, useita kanavia",
    p: "Sama päivä riittää TikTokiin, Reelsiin, Shortsiin ja LinkedIniin.",
  },
  {
    art: "funnel",
    kick: "Yhteydenotot",
    luku: "Mitattu",
    h: "Tavoite on yhteydenotto",
    p: "Seuraamme katselujen lisäksi kävijöitä ja yhteydenottoja.",
  },
  {
    art: "reach",
    kick: "Katselukertaa yhdelle asiakkaalle",
    luku: "1\u00A0000\u00A0000+",
    h: "Näkyvyyttä ilman mainosbudjettia",
    p: "Uuden tilin video voi levitä yhtä laajalle kuin tunnetun yrityksen.",
  },
];

/* LINKIT POISTETTIIN: /lyhytvideot/tiktok, /instagram-reels ja
   /youtube-shorts palauttivat kaikki 404:n. Alasivuja ei ole tehty,
   joten sivun kolme "lue lisaa" -linkkia veivat virhesivulle. Teksti
   jaa paikalleen; href palaa kun sivut on kirjoitettu. */
export const PLATFORMS = [
  {
    mark: "tiktok" as const,
    h: "TikTok-videot yritykselle",
    p: "Uusikin tili voi tavoittaa paljon katsojia. Sopii, kun näkyvyyttä vasta rakennetaan.",
    tag: "Rento ja suora",
  },
  {
    mark: "instagram" as const,
    h: "Instagram Reels yritykselle",
    p: "Moni katsoo yrityksen tilin ennen kuin ottaa yhteyttä. Reels tuo uusia katsojia.",
    tag: "Yrityksen käyntikortti",
  },
  {
    mark: "youtube" as const,
    h: "YouTube Shorts yritykselle",
    p: "Löytyvät YouTuben ja Googlen hauista vielä kuukausien päästä.",
    tag: "Pitkä elinikä",
  },
];

export const KETJU = [
  {
    over: "Tunnettuus",
    h: "Lyhytvideot",
    p: "Näkyvyys TikTokissa, Reelsissä ja Shortsissa ilman mainoksia. Ihmiset oppivat, kuka olet ja mitä teet, jo ennen kuin he tarvitsevat palveluasi.",
  },
  {
    over: "Kysyntä",
    h: "Meta-mainonta",
    p: "Parhaiten toimineista videoista tehdään Facebook- ja Instagram-mainoksia. Mainosrahaa ei kulu kokeiluun, koska tiedät jo, mikä video kiinnostaa katsojia.",
  },
  {
    over: "Yhteydenotot",
    h: "Hakukoneoptimointi",
    p: "Kun videon nähnyt ihminen myöhemmin hakee palvelua Googlesta, hänen pitää löytää sinun sivusi eikä kilpailijan. Hakukoneoptimoitu sivusto tuo kävijöitä myös kuukausina, jolloin videoita ei julkaista.",
  },
];

export const STEPS = [
  {
    h: "Aloituspalaveri",
    p: "Käydään läpi tavoitteet, kohderyhmä ja kanavat. Saat konkreettisen sisältösuunnitelman ja hinnan, ennen kuin mitään sovitaan.",
  },
  {
    h: "Ideointi ja käsikirjoitus",
    p: "Rakennamme kuukauden sisällöt teemoiksi ja kirjoitamme käsikirjoitukset. Hyväksyt ne ennen kuvauspäivää.",
  },
  {
    h: "Kuvauspäivä",
    p: "Kuvaamme sinun tiloissasi tai sovitussa paikassa. Yhdestä kuvauspäivästä syntyvät koko kuukauden videot.",
  },
  {
    h: "Editointi ja julkaisu",
    p: "Leikkaus, tekstitykset ja musiikki. Julkaisemme videot puolestasi tai toimitamme ne valmiina julkaistavaksi.",
  },
];

export const PLANS = [
  {
    tag: "",
    name: "Aloitus",
    price: "1 500",
    lv: 1,
    /** Montako alustatunnusta korostetaan. */
    kanavia: 1,
    kanavaTeksti: "Yksi kanava valintasi mukaan",
    forWhom: "Yrityksille, jotka aloittavat lyhytvideotuotannon.",
    features: [
      "4 lyhytvideota kuukaudessa",
      "Esiintyjä videoille",
      "1 kuvauspäivä",
      "Käsikirjoitus, editointi ja tekstitys",
      "Toimitus noin 7 päivässä kuvauksesta",
    ],
  },
  {
    /* "Suosituin" poistettiin: vaite ilman lahdetta. Korostus jaa. */
    tag: "",
    name: "Ylläpito",
    price: "2 200",
    lv: 2,
    kanavia: 3,
    kanavaTeksti: "TikTok, Reels ja Shorts",
    forWhom: "Yrityksille, jotka haluavat koko Instagram-tilin hoidettuna.",
    peruste: "Yleisin valinta, kun tavoitteena on säännöllinen julkaisutahti.",
    lisaa: "Kaikki Aloitus-paketin sisältö, ja lisäksi:",
    features: [
      "Kaikki Aloitus-paketin sisältö",
      "Tarinat eli stoorit",
      "Karusellit ja kuvajulkaisut",
      "Tilin ylläpito ja julkaisut puolestasi",
    ],
    pop: true,
  },
  {
    tag: "",
    name: "Räätälöity",
    price: "",
    lv: 3,
    kanavia: 3,
    linkedin: true,
    kanavaTeksti: "TikTok, Reels, Shorts ja LinkedIn",
    forWhom: "Yrityksille, jotka haluavat kasvattaa tiliä nopeammin.",
    lisaa: "Kaikki Jatkuva-paketin sisältö, ja lisäksi:",
    features: [
      "Kaikki Ylläpito-paketin sisältö",
      "Yhteisjulkaisukumppanien etsiminen",
      "Koukkujen testaus: sama video eri aloituksilla",
      "Videomäärä ja kuvauspäivät tarpeen mukaan",
      "Meta-mainonnan hallinnointi",
      "Kuukausittainen suunnittelupalaveri",
    ],
  },
];

export const SOPII = [
  "Yrityksesi ei näy siellä missä asiakkaat viettävät aikansa",
  "Somekanavat ovat olemassa, mutta sisältöä ei ehdi tehdä",
  "Somemainonta on käynyt kalliiksi ja haluat näkyvyyttä myös ilman mainoksia",
  "Videoita on tehty itse, mutta niitä katsotaan harvoin loppuun",
];

export const EI_SOVI = [
  {
    tilanne: "Etsit yhtä yksittäistä videota etkä jatkuvaa tuotantoa",
    suositus: "Kysy projektihinta, se on tähän järkevämpi",
  },
  {
    tilanne: "Odotat tuloksia jo ensimmäisestä kuukaudesta",
    suositus: "Selvä muutos näkyy tyypillisesti toisen kuukauden aikana",
  },
];

export const PAIKAT = [
  { c: "Espoo", meta: "Toimipiste" },
  { c: "Helsinki", meta: "Kuvauksia viikoittain" },
  { c: "Vantaa", meta: "Kuvauksia viikoittain" },
  { c: "Tampere", meta: "Päivän ajomatka" },
  { c: "Turku", meta: "Päivän ajomatka" },
  { c: "Lahti", meta: "Päivän ajomatka" },
  { c: "Pori", meta: "Päivän ajomatka" },
  { c: "Jyväskylä", meta: "Sovitusti" },
  { c: "Kuopio", meta: "Sovitusti" },
  { c: "Oulu", meta: "Sovitusti" },
  { c: "Joensuu", meta: "Sovitusti" },
  { c: "Vaasa", meta: "Sovitusti" },
];

