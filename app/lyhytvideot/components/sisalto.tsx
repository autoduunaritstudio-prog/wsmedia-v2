/* LYHYTVIDEOT-ALASIVUN TEKSTIT.
   Poimittu koneellisesti vanhoista osiotiedostoista merkki merkilta:
   sivun ilme vaihtuu, tekstit eivat. Paikanpitajat [HINTA] ja [X]
   sailyvat sellaisinaan, Tuomas tayttaa ne myohemmin. */

export const REASONS = [
  {
    art: "hook",
    h: "Ensimmäiset kolme sekuntia ratkaisevat",
    p: "Koukku, rytmi ja leikkauspisteet määrittävät katseluajan. Rakennamme jokaisen videon aloituksen niin, että skrollaus pysähtyy.",
  },
  {
    art: "channels",
    h: "Yksi kuvauspäivä, useita kanavia",
    p: "Samasta kuvauspäivästä syntyy sisältö TikTokiin, Reelsiin, Shortsiin ja LinkedIniin. Tuotantokustannus jakautuu monelle kanavalle.",
  },
  {
    art: "funnel",
    h: "Sisältö, joka tekee myös kauppaa",
    p: "Näyttökerrat ovat välitavoite. Ohjaamme katsojan verkkosivuille, yhteydenottolomakkeelle tai myymälään ja mittaamme, mitä siitä seuraa.",
  },
  {
    art: "reach",
    h: "Orgaaninen näkyvyys ilman mainosbudjettia",
    p: "Lyhytvideoiden algoritmi jakaa sisältöä kiinnostuksen, ei seuraajamäärän mukaan. Uusi tili voi tavoittaa saman yleisön kuin vakiintunut brändi.",
  },
];

export const PLATFORMS = [
  {
    href: "/lyhytvideot/tiktok",
    mark: "tiktok" as const,
    h: "TikTok-videot yritykselle",
    p: "Nopein kanava uuden yleisön tavoittamiseen nollasta. Toimii, kun sisältö on aitoa ja rytmikästä ja puhuu katsojan kielellä, ei mainospuhetta.",
    link: "TikTok-videotuotanto",
  },
  {
    href: "/lyhytvideot/instagram-reels",
    mark: "instagram" as const,
    h: "Instagram Reels yritykselle",
    p: "Laajin ikäjakauma ja vahvin ostopolku Suomessa. Reels tuo uudet katsojat, feed ja tarinat hoitavat luottamuksen rakentamisen.",
    link: "Reels-tuotanto",
  },
  {
    href: "/lyhytvideot/youtube-shorts",
    mark: "youtube" as const,
    h: "YouTube Shorts yritykselle",
    p: "Shorts tuo uudet katsojat kanavalle, ja pidemmät videot syventävät asiantuntijuutta. Sisältö löytyy myös haulla vielä kuukausien päästä.",
    link: "Shorts-tuotanto",
  },
];

export const KETJU = [
  {
    over: "Brändiarvo",
    h: "Lyhytvideot",
    p: "Orgaaninen näkyvyys TikTokissa, Reelsissä ja Shortsissa. Ihmiset oppivat, kuka olet ja mitä teet, jo ennen kuin heillä on tarve.",
  },
  {
    over: "Kysyntä",
    h: "Meta-mainonta",
    p: "Parhaiten orgaanisesti toimineet videot viedään Facebook- ja Instagram-mainonnaksi. Sisältö on jo todistettu yleisöllä, joten mainoseuro menee toistoihin ja kohdennukseen.",
  },
  {
    over: "Liidit",
    h: "Hakukoneoptimointi",
    p: "Video luo kysynnän, hakukone korjaa sadon. Kun ostaja googlaa palveluasi, hakukoneoptimoitu sivusto vie hänet yhteydenottolomakkeelle. Tuottaa liikennettä myös silloin, kun videot eivät pyöri.",
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
    p: "Kuvaamme sinun tiloissasi tai sovitussa paikassa. Yhdestä päivästä syntyy tyypillisesti [X] lyhytvideota.",
  },
  {
    h: "Editointi ja julkaisu",
    p: "Leikkaus, tekstitykset ja alustakohtainen optimointi. Julkaisemme sovitusti tai toimitamme videot julkaisuvalmiina.",
  },
];

export const PLANS = [
  {
    tag: "",
    name: "Aloitus",
    lv: 1,
    /** Montako alustatunnusta korostetaan. */
    kanavia: 1,
    kanavaTeksti: "Yksi kanava valintasi mukaan",
    forWhom: "Yrityksille, jotka aloittavat lyhytvideotuotannon.",
    features: [
      "[X] lyhytvideota kuukaudessa",
      "1 kuvauspäivä",
      "Käsikirjoitus, editointi ja tekstitys",
      "Optimointi 1 kanavalle",
      "Toimitus [X] arkipäivässä",
    ],
  },
  {
    tag: "Suosituin",
    name: "Jatkuva",
    lv: 2,
    kanavia: 3,
    kanavaTeksti: "TikTok, Reels ja Shorts",
    forWhom: "Yrityksille, jotka haluavat jatkuvaa näkyvyyttä.",
    peruste: "Yleisin valinta, kun tavoitteena on säännöllinen julkaisutahti.",
    lisaa: "Kaikki Aloitus-paketin sisältö, ja lisäksi:",
    features: [
      "[X] lyhytvideota kuukaudessa",
      "Monikanavainen optimointi",
      "Esiintyjä sovittaessa",
      "Julkaisu ja kuukausiraportti",
    ],
    pop: true,
  },
  {
    tag: "",
    name: "Täysi näkyvyys",
    lv: 3,
    kanavia: 3,
    linkedin: true,
    kanavaTeksti: "TikTok, Reels, Shorts ja LinkedIn",
    forWhom: "Yrityksille, jotka haluavat koko näkyvyyden kerralla.",
    lisaa: "Kaikki Jatkuva-paketin sisältö, ja lisäksi:",
    features: [
      "[X] lyhytvideota kuukaudessa",
      "[X] kuvauspäivää",
      "Meta-mainonnan hallinnointi",
      "Kuukausittainen strategiapalaveri",
    ],
  },
];

export const SOPII = [
  "Yrityksesi ei näy siellä missä asiakkaat viettävät aikansa",
  "Somekanavat ovat olemassa, mutta sisältöä ei ehdi tehdä",
  "Meta-mainonta on käynyt kalliiksi ja haluat orgaanista näkyvyyttä rinnalle",
  "Videoita on tehty itse, mutta katseluajat jäävät lyhyiksi",
];

export const EI_SOVI = [
  {
    tilanne: "Etsit yhtä yksittäistä videota etkä jatkuvaa tuotantoa",
    suositus: "Kysy projektihinta, se on tähän järkevämpi",
  },
  {
    tilanne: "Odotat tuloksia jo ensimmäisestä kuukaudesta",
    suositus: "Käänne tulee tyypillisesti [X] kuukauden kohdalla",
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

