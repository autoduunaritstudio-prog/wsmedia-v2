import type { ReactNode } from "react";

import SmartLink from "../components/SmartLink";

/**
 * UKK-data yhdessa paikassa: sama lahde syottaa seka nakyvan osion etta
 * FAQPage-rakenteellisen datan.
 */
export type FaqItem = { q: string; a: ReactNode; plain: string };
export type FaqGroup = { title: string; items: FaqItem[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Hinta ja sitoutuminen",
    items: [
      {
        q: "Paljonko hakukoneoptimointi maksaa?",
        a: "Meillä jatkuva hakukoneoptimointi maksaa 390–1 690 euroa kuukaudessa + alv 25,5 %. Suomessa tuloksiin tähtäävä työ asettuu tyypillisesti 400–2 000 euroon kuukaudessa, ja tätä selvästi halvemmilla paketeilla ostetaan käytännössä vain raportointia. Hintaan vaikuttavat eniten toimialan kilpailutilanne, sivuston lähtökunto ja tarvittavan uuden sisällön määrä.",
        plain: "Meillä jatkuva hakukoneoptimointi maksaa 390–1 690 euroa kuukaudessa + alv 25,5 %. Suomessa tuloksiin tähtäävä työ asettuu tyypillisesti 400–2 000 euroon kuukaudessa, ja tätä selvästi halvemmilla paketeilla ostetaan käytännössä vain raportointia. Hintaan vaikuttavat eniten toimialan kilpailutilanne, sivuston lähtökunto ja tarvittavan uuden sisällön määrä.",
      },
      {
        q: "Miksi hakukoneoptimointi maksaa niin paljon?",
        a: "Suurin osa hinnasta on ihmisen aikaa: avainsanatutkimusta, sisällön kirjoittamista, teknistä korjaamista ja seurantaa. Kuukausihinta vastaa käytännössä tiettyä tuntimäärää asiantuntijatyötä. Käyttämiemme työkalujen lisenssimaksut sisältyvät hintaan.",
        plain: "Suurin osa hinnasta on ihmisen aikaa: avainsanatutkimusta, sisällön kirjoittamista, teknistä korjaamista ja seurantaa. Kuukausihinta vastaa käytännössä tiettyä tuntimäärää asiantuntijatyötä. Käyttämiemme työkalujen lisenssimaksut sisältyvät hintaan.",
      },
      {
        q: "Onko pakko sitoutua pitkäksi aikaa?",
        a: "Perusta-taso jatkuu kuukausi kerrallaan yhden kuukauden irtisanomisajalla. Kasvu- ja Täysi-tasoilla vähimmäiskesto on kuusi kuukautta, koska lyhyemmässä ajassa työ ei ehdi tuottaa mitään mitattavaa. Kuuden kuukauden jälkeen yhteistyö jatkuu niin kauan kuin se tuottaa.",
        plain: "Perusta-taso jatkuu kuukausi kerrallaan yhden kuukauden irtisanomisajalla. Kasvu- ja Täysi-tasoilla vähimmäiskesto on kuusi kuukautta, koska lyhyemmässä ajassa työ ei ehdi tuottaa mitään mitattavaa. Kuuden kuukauden jälkeen yhteistyö jatkuu niin kauan kuin se tuottaa.",
      },
      /* "Onko aloitusmaksua?" poistettiin. Vastaus oli sanatarkasti
         hinnaston loppukappaleessa ("Ei aloitusmaksua eika piilokuluja.
         Kartoitus ja alustava auditointi ovat maksuttomia"), eika
         kysymyksella ole omaa hakusanapintaa: kukaan ei hae sanalla
         "onko aloitusmaksua". Aloitusmaksuttomuus sanotaan sivulla yha
         kolmesti, hinnaston kickissa, sen ingressissa ja sen
         loppukappaleessa. */
      {
        q: "Kannattaako valita halvin SEO-tarjous?",
        a: "Halvin ja kannattavin ovat harvoin sama asia. Hyvin matalalla kuukausihinnalla ei ehdi tehdä juuri muuta kuin seurata sijoituksia ja lähettää raportti. Pahimmillaan edullinen työ tulee kalliiksi kahdesti: ensin maksat työstä joka ei tuota, sitten työstä jolla se korjataan.",
        plain: "Halvin ja kannattavin ovat harvoin sama asia. Hyvin matalalla kuukausihinnalla ei ehdi tehdä juuri muuta kuin seurata sijoituksia ja lähettää raportti. Pahimmillaan edullinen työ tulee kalliiksi kahdesti: ensin maksat työstä joka ei tuota, sitten työstä jolla se korjataan.",
      },
    ],
  },
  {
    title: "Toteutus",
    items: [
      {
        q: "Mitä hakukoneoptimointi käytännössä sisältää?",
        a: "Teknistä hakukoneoptimointia, sisältöä ja avainsanoja, auktoriteetin rakentamista sekä paikallista näkyvyyttä, ja nämä neljä tehdään rinnakkain eikä peräkkäin. Painotus riippuu siitä, missä kunnossa sivusto on lähtiessä: teknisesti rikkinäisellä sivustolla ensimmäiset kuukaudet ovat korjaamista, kunnossa olevalla päästään heti sisältöön.",
        plain: "Teknistä hakukoneoptimointia, sisältöä ja avainsanoja, auktoriteetin rakentamista sekä paikallista näkyvyyttä, ja nämä neljä tehdään rinnakkain eikä peräkkäin. Painotus riippuu siitä, missä kunnossa sivusto on lähtiessä: teknisesti rikkinäisellä sivustolla ensimmäiset kuukaudet ovat korjaamista, kunnossa olevalla päästään heti sisältöön.",
      },
      {
        q: "Mikä on avainsanatutkimus?",
        a: "Selvitys siitä, mitä asiakkaasi oikeasti kirjoittavat hakukenttään, kuinka paljon niitä hakuja tehdään ja kuinka kilpailtuja ne ovat. Se on koko työn kivijalka: ilman sitä optimoidaan sanoja joita kukaan ei hae, tai sanoja joilla ei ole ostoaikomusta.",
        plain: "Selvitys siitä, mitä asiakkaasi oikeasti kirjoittavat hakukenttään, kuinka paljon niitä hakuja tehdään ja kuinka kilpailtuja ne ovat. Se on koko työn kivijalka: ilman sitä optimoidaan sanoja joita kukaan ei hae, tai sanoja joilla ei ole ostoaikomusta.",
      },
      {
        q: "Mikä on SEO-auditointi?",
        a: "Sivuston nykytilan läpikäynti: indeksointi, sivurakenne, nopeus, metatiedot, sisäinen linkitys, sisältö ja linkkiprofiili. Auditoinnista syntyy priorisoitu korjauslista. Alustavan auditoinnin teemme maksutta ennen tarjousta.",
        plain: "Sivuston nykytilan läpikäynti: indeksointi, sivurakenne, nopeus, metatiedot, sisäinen linkitys, sisältö ja linkkiprofiili. Auditoinnista syntyy priorisoitu korjauslista. Alustavan auditoinnin teemme maksutta ennen tarjousta.",
      },
      {
        q: "Pitääkö minun itse tehdä jotain?",
        a: "Hyvin vähän. Tarvitsemme pääsyn sivustolle ja analytiikkaan sekä noin tunnin kuukaudessa aikaasi: sisältöjen hyväksynnän ja vastaukset toimialaa koskeviin kysymyksiin. Kirjoittaminen, tekniikka ja julkaisu hoituvat meiltä.",
        plain: "Hyvin vähän. Tarvitsemme pääsyn sivustolle ja analytiikkaan sekä noin tunnin kuukaudessa aikaasi: sisältöjen hyväksynnän ja vastaukset toimialaa koskeviin kysymyksiin. Kirjoittaminen, tekniikka ja julkaisu hoituvat meiltä.",
      },
      {
        q: "Voinko tehdä hakukoneoptimoinnin itse?",
        a: "Voit, ja pienellä sivustolla se on täysin realistista. Perusasiat, otsikot, metatiedot, sivurakenne ja Google-yritysprofiili, oppii viikossa. Ulkoistamisen etu ei ole salatieto vaan se, että työ jatkuu myös kiireisenä kuukautena, jolloin oma tekeminen tyypillisesti katkeaa.",
        plain: "Voit, ja pienellä sivustolla se on täysin realistista. Perusasiat, otsikot, metatiedot, sivurakenne ja Google-yritysprofiili, oppii viikossa. Ulkoistamisen etu ei ole salatieto vaan se, että työ jatkuu myös kiireisenä kuukautena, jolloin oma tekeminen tyypillisesti katkeaa.",
      },
      {
        q: "Teettekö myös verkkokaupan hakukoneoptimointia?",
        a: "Teemme. Verkkokaupassa painottuvat tuote- ja kategoriasivujen rakenne, sisäinen linkitys, tuotetietojen strukturoitu data ja se, ettei sama sisältö toistu kymmenillä sivuilla. Työmäärä on tyypillisesti suurempi kuin palvelusivustolla, mikä näkyy hinnassa.",
        plain: "Teemme. Verkkokaupassa painottuvat tuote- ja kategoriasivujen rakenne, sisäinen linkitys, tuotetietojen strukturoitu data ja se, ettei sama sisältö toistu kymmenillä sivuilla. Työmäärä on tyypillisesti suurempi kuin palvelusivustolla, mikä näkyy hinnassa.",
      },
    ],
  },
  {
    title: "Tulokset ja näkyvyys",
    items: [
      {
        q: "Kuinka nopeasti hakukoneoptimointi tuo tuloksia?",
        a: "Ensimmäiset merkit näkyvät tyypillisesti 3–6 kuukauden kuluttua ja selvä vaikutus liiketoiminnassa 6–12 kuukauden kohdalla. Nopeuteen vaikuttavat eniten toimialan kilpailutilanne ja sivuston lähtökunto.",
        plain: "Ensimmäiset merkit näkyvät tyypillisesti 3–6 kuukauden kuluttua ja selvä vaikutus liiketoiminnassa 6–12 kuukauden kohdalla. Nopeuteen vaikuttavat eniten toimialan kilpailutilanne ja sivuston lähtökunto.",
      },
      {
        q: "Voitteko luvata Googlen ykkössijan?",
        a: "Emme. Kukaan vastuullisesti hakukoneoptimointia tekevä ei voi luvata tiettyä sijoitusta, koska tuloksiin vaikuttavat myös kilpailijoiden tekemiset ja algoritmipäivitykset. Sen sijaan sovimme etukäteen mittarit ja raportoimme ne rehellisesti myös silloin, kun kehitys on toivottua hitaampaa. Kannattaa olla varovainen toimijan kanssa, joka lupaa tietyn sijoituksen tai täyden tulostakuun.",
        plain: "Emme. Kukaan vastuullisesti hakukoneoptimointia tekevä ei voi luvata tiettyä sijoitusta, koska tuloksiin vaikuttavat myös kilpailijoiden tekemiset ja algoritmipäivitykset. Sen sijaan sovimme etukäteen mittarit ja raportoimme ne rehellisesti myös silloin, kun kehitys on toivottua hitaampaa. Kannattaa olla varovainen toimijan kanssa, joka lupaa tietyn sijoituksen tai täyden tulostakuun.",
      },
      {
        q: "Miten hakukoneoptimointia mitataan ja raportoidaan?",
        a: "Mittarit sovitaan ennen aloitusta ja raportti tulee sähköpostiin sovitussa syklissä. Saat myös pääsyn samoihin työkaluihin, Search Consoleen ja Analyticsiin, joista luvut tulevat, joten voit tarkistaa jokaisen luvun itse. Seurattavat hakusanat sovitaan yhdessä etukäteen, joten raportti mittaa niitä hakuja joilla yrityksesi haluaa näkyä.",
        plain: "Mittarit sovitaan ennen aloitusta ja raportti tulee sähköpostiin sovitussa syklissä. Saat myös pääsyn samoihin työkaluihin, Search Consoleen ja Analyticsiin, joista luvut tulevat, joten voit tarkistaa jokaisen luvun itse. Seurattavat hakusanat sovitaan yhdessä etukäteen, joten raportti mittaa niitä hakuja joilla yrityksesi haluaa näkyä.",
      },
      {
        q: "Mitä tekoälyhakunäkyvyys tarkoittaa käytännössä?",
        a: "Tavoite on eri kuin hakutuloksissa: ei sijoitus vaan se, että sisältösi on riittävän täsmällistä ja tarkistettavaa lainattavaksi. Käytännössä se tarkoittaa hintojen, aikataulujen ja toimitusehtojen kirjoittamista sivulle eikä vain kertomista puhelimessa. Emme voi luvata mainintoja, mutta seuraamme niitä toimialasi tärkeimmillä kysymyksillä.",
        plain: "Tavoite on eri kuin hakutuloksissa: ei sijoitus vaan se, että sisältösi on riittävän täsmällistä ja tarkistettavaa lainattavaksi. Käytännössä se tarkoittaa hintojen, aikataulujen ja toimitusehtojen kirjoittamista sivulle eikä vain kertomista puhelimessa. Emme voi luvata mainintoja, mutta seuraamme niitä toimialasi tärkeimmillä kysymyksillä.",
      },
      {
        q: "Miten hakukoneoptimointi huomioidaan verkkosivu-uudistuksessa?",
        a: (
      <>
        {"Uudistus on se hetki, jossa kertynyt näkyvyys joko säilyy tai katoaa. Vanhat osoitteet ohjataan uusiin, sivurakenne suunnitellaan hakusanojen pohjalta ja metatiedot siirretään hallitusti. Tämä tehdään ennen julkaisua eikä sen jälkeen, jälkikäteen korjaaminen maksaa moninkertaisesti. Lue lisää "}
        <SmartLink href="/verkkosivut">verkkosivujen toteutuksesta</SmartLink>
        {"."}
      </>
    ),
        plain: "Uudistus on se hetki, jossa kertynyt näkyvyys joko säilyy tai katoaa. Vanhat osoitteet ohjataan uusiin, sivurakenne suunnitellaan hakusanojen pohjalta ja metatiedot siirretään hallitusti. Tämä tehdään ennen julkaisua eikä sen jälkeen, jälkikäteen korjaaminen maksaa moninkertaisesti. Lue lisää verkkosivujen toteutuksesta.",
      },
      {
        q: "Teettekö myös verkkosivut ja lyhytvideot?",
        a: (
      <>
        {"Kyllä. WS Media tekee hakukoneoptimoinnin lisäksi "}
        <SmartLink href="/verkkosivut">verkkosivut</SmartLink>
        {", "}
        <SmartLink href="/lyhytvideot">lyhytvideot</SmartLink>
        {" TikTokiin, Instagram Reelsiin ja YouTube Shortsiin sekä Meta-mainonnan. Kun sivusto, sisältö ja mainonta tulevat samalta tiimiltä, hakukoneoptimointi rakennetaan sisään jo sivuston rakenteeseen sen sijaan että se korjattaisiin jälkikäteen."}
      </>
    ),
        plain: "Kyllä. WS Media tekee hakukoneoptimoinnin lisäksi verkkosivut, lyhytvideot TikTokiin, Instagram Reelsiin ja YouTube Shortsiin sekä Meta-mainonnan. Kun sivusto, sisältö ja mainonta tulevat samalta tiimiltä, hakukoneoptimointi rakennetaan sisään jo sivuston rakenteeseen sen sijaan että se korjattaisiin jälkikäteen.",
      },
    ],
  },
];
