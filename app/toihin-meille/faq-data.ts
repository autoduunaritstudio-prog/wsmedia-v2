/**
 * Rekrytointisivun UKK. Yksi lahde syottaa seka nakyvan osion etta
 * FAQPage-rakenteisen datan.
 */

export type FaqItem = { group: string; q: string; a: string };

export const FAQ: FaqItem[] = [
  {
    group: "",
    q: "Onko teillä juuri nyt avoimia työpaikkoja?",
    a: "Meillä on jatkuva avoin haku. Emme ilmoita erikseen määräaikaisia hakuja, vaan otamme yhteyttä silloin kun sopiva toimeksianto tulee vastaan. Siksi hakemus kannattaa jättää, vaikka juuri nyt ei olisi mitään auki.",
  },
  {
    group: "",
    q: "Voinko hakea, vaikka olen vasta aloittelija?",
    a: "Voit. Emme katso työvuosia vaan työnäytteitä. Jos portfoliosta näkee, että osaat asian, kokemuksen pituudella ei ole väliä. Aloitamme silloin pienemmällä toimeksiannolla.",
  },
  {
    group: "",
    q: "Tarvitseeko minulla olla y-tunnus?",
    a: "Ei tarvitse. Kevytyrittäjyyspalvelun kautta laskuttaminen käy täysin. Jos et ole vielä laskuttanut kenellekään, neuvomme miten se hoituu.",
  },
  {
    group: "",
    q: "Missä työ tehdään?",
    a: "Suunnittelu, editointi, koodaus ja sisällöntuotanto tehdään etänä, joten paikkakunnalla ei ole väliä. Kuvaukset tehdään asiakkaan tiloissa ja teippausten asennukset siellä missä ajoneuvot ja toimitilat ovat.",
  },
  {
    group: "",
    q: "Kuinka paljon töitä voin odottaa?",
    a: "Se riippuu osaamisalueesta ja siitä, kuinka paljon otat vastaan. Emme lupaa tiettyä määrää etukäteen. Videopuolella toimeksiantoja on eniten, koska useimmat asiakkuudet ovat jatkuvia kuukausisopimuksia.",
  },
  {
    group: "",
    q: "Miten hinnoittelu toimii freelancerina?",
    a: "Kerrot oman tuntihintasi tai projektihintasi, ja sovimme hinnan ennen jokaisen toimeksiannon aloittamista. Emme tingi jälkikäteen emmekä pyydä tekemään lisätyötä samalla hinnalla.",
  },
  {
    group: "",
    q: "Milloin lasku maksetaan?",
    a: "Maksuaika on 14 päivää laskun päiväyksestä. Jos toimeksianto on pitkä, sovimme osalaskutuksesta etukäteen.",
  },
  {
    group: "",
    q: "Millaisia työnäytteitä odotatte?",
    a: "Sellaisia, jotka olet itse tehnyt. Yksi hyvin tehty työ kertoo enemmän kuin kymmenen keskinkertaista. Kerro myös lyhyesti, mikä osuus työstä oli sinun, jos se on tehty tiimissä.",
  },
  {
    group: "",
    q: "Voinko tehdä töitä oman päivätyöni ohella?",
    a: "Voit, ja moni tekeekin. Toimeksiannot sovitaan aina erikseen, joten voit ottaa vastaan sen verran kuin kalenteriisi mahtuu.",
  },
  {
    group: "",
    q: "Milloin kuulen hakemuksestani?",
    a: "Vastaamme viikon sisällä — myös silloin kun vastaus on ei. Jos sopivaa toimeksiantoa ei ole heti, säilytämme hakemuksen ja otamme yhteyttä myöhemmin.",
  },
];

export const FAQ_GROUPS: string[] = [...new Set(FAQ.map((f) => f.group))].filter(Boolean);
