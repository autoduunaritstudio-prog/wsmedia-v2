import SmartLink from "../components/SmartLink";

import type { ReactNode } from "react";

/**
 * UKK yhdessa paikassa. `answer` on nakyva vastaus (voi sisaltaa linkkeja),
 * `schema` on FAQPage-rakenteisen datan tekstiversio. Mockupin JSON-LD:n
 * sanamuodot poikkeavat paikoin nakyvasta vastauksesta (esim. "Sinä." ->
 * "Asiakas."), joten molemmat on tallennettu erikseen.
 */
export type FaqItem = {
  q: string;
  answer: ReactNode;
  schema: string;
  /** Auki heti. Vain kolmelle yleisimmalle kysymykselle: accordionin
      haitta on etta piilotettu sisalto jaa huomaamatta, ja juuri nama
      kolme ovat ne joita jokainen kysyy. Loput saavat accordionin
      tilansaaston. */
  open?: boolean;
};

export type FaqGroup = {
  label: string;
  items: FaqItem[];
};

export const FAQ_GROUPS: FaqGroup[] = [
  {
    label: "Hinta, määrä ja aikataulu",
    items: [
      {
        q: "Paljonko lyhytvideotuotanto maksaa?",
        open: true,
        answer: (
          <>
            Jatkuva lyhytvideotuotanto alkaa 1 500 eurosta kuukaudessa + alv. Siihen sisältyy
            neljä valmista videota esiintyjineen. Kun hoidamme myös Instagram-tilin tarinat,
            karusellit ja kuvajulkaisut, hinta on 2 200 € kuukaudessa + alv. Yksittäiset videot ja
            kampanjatuotannot hinnoitellaan projekteina. Kerro tavoitteesi{" "}
            <a href="#tarjous">tarjouslomakkeella</a>, niin rakennamme sen sisään mahtuvan
            suunnitelman.
          </>
        ),
        schema:
          "Jatkuva lyhytvideotuotanto alkaa 1 500 eurosta kuukaudessa + alv, ja siihen sisältyy neljä valmista videota esiintyjineen. Kun myös Instagram-tilin tarinat, karusellit ja kuvajulkaisut hoidetaan, hinta on 2 200 € kuukaudessa + alv. Yksittäiset videot ja kampanjatuotannot hinnoitellaan projekteina.",
      },
      {
        q: "Kuinka monta lyhytvideota kannattaa julkaista kuukaudessa?",
        answer: (
          <>
            Säännöllisyys ratkaisee enemmän kuin määrä. Neljä videota kuukaudessa eli noin yksi
            viikossa on hyvä alku, ja sillä tahdilla tulokset alkavat kertyä. Harvempi julkaisutahti toimii, jos
            sisällöt ovat poikkeuksellisen vahvoja, mutta silloin kehitys on hitaampaa.
          </>
        ),
        schema:
          "Säännöllisyys ratkaisee enemmän kuin määrä. Neljä videota kuukaudessa eli noin yksi viikossa on hyvä alku, ja sillä tahdilla tulokset alkavat kertyä.",
      },
      {
        q: "Kuinka nopeasti saan valmiit videot?",
        open: true,
        answer: (
          <>
            Valmiit videot tulevat keskimäärin noin 7 päivässä kuvauspäivästä. Sisältösuunnitelman
            ja käsikirjoitukset saat nähtäväksi jo ennen kuvauksia.
          </>
        ),
        schema:
          "Valmiit videot tulevat keskimäärin noin 7 päivässä kuvauspäivästä. Sisältösuunnitelman ja käsikirjoitukset saa nähtäväksi jo ennen kuvauksia.",
      },
      {
        q: "Kuinka nopeasti lyhytvideot tuottavat tulosta?",
        answer: (
          <>
            Ensimmäiset näyttökerrat tulevat heti, mutta luotettava kuva syntyy vasta useamman
            kuukauden datasta. Esimerkiksi yhden asiakkaamme videot keräsivät miljoona
            katselukertaa kolmessa kuukaudessa. Tyypillisesti selvä muutos näkyy toisen kuukauden aikana, kun
            kanavalle on kertynyt riittävästi julkaisuja ja tiedämme datan perusteella mitkä teemat
            toimivat.
          </>
        ),
        schema:
          "Ensimmäiset näyttökerrat tulevat heti, mutta luotettava kuva syntyy vasta useamman kuukauden datasta. Tyypillisesti selvä muutos näkyy toisen kuukauden aikana.",
      },
    ],
  },
  {
    label: "Kuvaus ja tuotanto",
    items: [
      {
        q: "Kuinka pitkä somevideon pitää olla?",
        answer: (
          <>
            Tekemämme videot ovat yleensä 15–60 sekuntia. Lyhyt video katsotaan todennäköisemmin loppuun, ja se
            ratkaisee, kuinka monelle video näytetään. Pidempikin video toimii, kun aihe pitää
            katsojan mukana, esimerkiksi ohje tai ennen ja jälkeen -video. Pituus päätetään
            käsikirjoituksessa aiheen mukaan.
          </>
        ),
        schema:
          "Tekemämme videot ovat yleensä 15–60 sekuntia. Lyhyt video katsotaan todennäköisemmin loppuun, ja se ratkaisee, kuinka monelle video näytetään. Pidempikin video toimii, kun aihe pitää katsojan mukana, esimerkiksi ohje tai ennen ja jälkeen -video.",
      },
      {
        q: "Meillä ei ole ketään kameran eteen. Mitä teemme?",
        answer: (
          <>
            Tämä on yleisin huoli, eikä se ole este. Pakettiin sisältyy esiintyjä, ja voimme myös
            rakentaa sisällöt ilman puhuvaa päätä: tuote-, prosessi- ja kulissien takaa -sisällöt,
            tekstivetoiset videot ja asiakastarinat toimivat monella toimialalla jopa paremmin.
          </>
        ),
        schema:
          "Pakettiin sisältyy esiintyjä, ja voimme myös rakentaa sisällöt ilman puhuvaa päätä: tuote-, prosessi- ja kulissien takaa -sisällöt, tekstivetoiset videot ja asiakastarinat toimivat monella toimialalla jopa paremmin.",
      },
      {
        q: "Missä kuvaukset tehdään?",
        answer: (
          <>
            Lähtökohtaisesti sinun omissa tiloissasi, se on nopeinta ja näyttää aidoimmalta.
            Kuvaamme viikoittain Espoossa, Helsingissä ja Vantaalla, ja kuvauspäivät onnistuvat
            sovitusti myös muualla Suomessa. Tarvittaessa käytämme erillistä kuvauspaikkaa tai studiota.
          </>
        ),
        schema:
          "Lähtökohtaisesti asiakkaan omissa tiloissa. Kuvaamme viikoittain Espoossa, Helsingissä ja Vantaalla, ja kuvauspäivät onnistuvat sovitusti myös muualla Suomessa.",
      },
      {
        q: "Sisältyvätkö tekstitykset, musiikki ja grafiikat hintaan?",
        answer: (
          <>
            Kyllä. Tekstitykset, käyttöoikeudellinen taustamusiikki, äänisuunnittelu ja brändin
            mukaiset grafiikat sisältyvät jokaiseen videoon. Esiintyjä kuuluu pakettiin. Erikseen
            hinnoitellaan vain maksetun mainonnan hallinnointi ja mahdolliset erikoistuotannot.
          </>
        ),
        schema:
          "Kyllä. Tekstitykset, käyttöoikeudellinen taustamusiikki, äänisuunnittelu ja brändin mukaiset grafiikat sisältyvät jokaiseen videoon.",
      },
      {
        q: "Saanko samasta videosta versiot eri kanaviin?",
        answer: (
          <>
            Saat. Sama video toimii TikTokissa, Instagram Reelsissä ja YouTube Shortsissa, koska
            kaikki kolme käyttävät samaa pystykuvaa. Tarkistamme silti, ettei tekstitys jää minkään
            sovelluksen painikkeiden alle, ja kirjoitamme jokaiseen kanavaan oman saatetekstin.
          </>
        ),
        schema:
          "Saat. Sama video toimii TikTokissa, Instagram Reelsissä ja YouTube Shortsissa, koska kaikki kolme käyttävät samaa pystykuvaa. Tarkistamme silti, ettei tekstitys jää sovelluksen painikkeiden alle, ja kirjoitamme jokaiseen kanavaan oman saatetekstin.",
      },
    ],
  },
  {
    label: "Sopimus ja omistajuus",
    items: [
      {
        q: "Kuka omistaa valmiit videot?",
        open: true,
        answer: (
          <>
            Sinä. Saat täydet käyttöoikeudet sekä valmiisiin videoihin että raakamateriaaliin, ja
            voit käyttää niitä myös maksetussa mainonnassa, verkkosivuilla ja messuilla ilman
            lisäkorvausta.
          </>
        ),
        schema:
          "Asiakas. Saat täydet käyttöoikeudet sekä valmiisiin videoihin että raakamateriaaliin, ja voit käyttää niitä myös maksetussa mainonnassa, verkkosivuilla ja messuilla.",
      },
      {
        q: "Kuinka paljon aikaani menee yhteistyöhön?",
        answer: (
          <>
            Korkeintaan 1–2 tuntia kuukaudessa: kuvauspäivä ja lyhyt hyväksyntäkierros käsikirjoituksiin.
            Ideointi, käsikirjoitus, editointi, tekstitys ja julkaisu hoituvat meiltä.
          </>
        ),
        schema:
          "Korkeintaan 1–2 tuntia kuukaudessa: kuvauspäivä ja lyhyt hyväksyntäkierros käsikirjoituksiin. Ideointi, käsikirjoitus, editointi, tekstitys ja julkaisu hoituvat meiltä.",
      },
      {
        q: "Sopivatko lyhytvideot B2B-yritykselle?",
        answer: (
          <>
            Sopivat. B2B-ostajat käyttävät samoja sovelluksia kuin kaikki muutkin.
            Asiantuntijasisällöt, usein kysyttyihin kysymyksiin vastaaminen ja asiakastarinat
            toimivat erityisen hyvin, ja LinkedInissä kilpailu videosisällöistä on yhä selvästi
            vähäisempää kuin TikTokissa.
          </>
        ),
        schema:
          "Sopivat. Asiantuntijasisällöt, usein kysyttyihin kysymyksiin vastaaminen ja asiakastarinat toimivat erityisen hyvin, ja LinkedInissä kilpailu videosisällöistä on yhä vähäisempää kuin TikTokissa.",
      },
      {
        q: "Takaatteko katselukerrat?",
        answer: (
          <>
            Emme. Kukaan ei voi rehellisesti luvata katselukertoja, koska somepalvelu päättää,
            kenelle video näytetään. Lupaamme sen, mihin voimme vaikuttaa: sovitun julkaisutahdin,
            huolella tehdyt käsikirjoitukset ja kuukausittaisen katsauksen siitä, mitkä videot
            toimivat. Seuraavat videot tehdään niiden pohjalta.
          </>
        ),
        schema:
          "Emme. Kukaan ei voi rehellisesti luvata katselukertoja, koska somepalvelu päättää, kenelle video näytetään. Lupaamme sovitun julkaisutahdin, huolella tehdyt käsikirjoitukset ja kuukausittaisen katsauksen siitä, mitkä videot toimivat.",
      },
      {
        q: "Onko pakko sitoutua pitkäksi aikaa?",
        answer: (
          <>
            Ei. Sopimus jatkuu kuukausi kerrallaan ja irtisanomisaika on yksi kuukausi.
            Suosittelemme kuitenkin varaamaan vähintään 3 kuukautta, koska lyhytvideoiden
            tulokset kertyvät kumulatiivisesti.
          </>
        ),
        schema:
          "Ei. Sopimus jatkuu kuukausi kerrallaan ja irtisanomisaika on yksi kuukausi. Suosittelemme kuitenkin varaamaan vähintään 3 kuukautta, koska lyhytvideoiden tulokset kertyvät kumulatiivisesti.",
      },
    ],
  },
  {
    label: "Yhteistyö käytännössä",
    items: [
      {
        q: "Mitä jos emme ole tyytyväisiä ensimmäiseen versioon?",
        answer: (
          <>
            Jokaiseen videoon sisältyy palautekierros. Käymme muutokset läpi ja toimitamme korjatun
            version yleensä saman tai seuraavan arkipäivän aikana. Isommat linjamuutokset
            ratkaistaan käsikirjoitusvaiheessa, ennen kuin kamera käy.
          </>
        ),
        schema:
          "Jokaiseen videoon sisältyy palautekierros. Käymme muutokset läpi ja toimitamme korjatun version yleensä saman tai seuraavan arkipäivän aikana.",
      },
      {
        q: "Voitteko hoitaa myös julkaisun ja Meta-mainonnan?",
        answer: (
          <>
            Voimme. Julkaisu kuuluu Ylläpito-pakettiin tarinoiden, karusellien ja kuvajulkaisujen
            kanssa. Mainonnan
            hallinnointi hinnoitellaan erikseen kanavakohtaisesti, mainosbudjetin päälle, ja
            mainosbudjetin määrää aina asiakas itse.
          </>
        ),
        schema:
          "Voimme. Julkaisu kuuluu Ylläpito-pakettiin tarinoiden, karusellien ja kuvajulkaisujen kanssa. Mainonnan hallinnointi hinnoitellaan erikseen kanavakohtaisesti, mainosbudjetin päälle, ja mainosbudjetin määrää aina asiakas itse.",
      },
      {
        q: "Teettekö myös hakukoneoptimointia?",
        answer: (
          <>
            Teemme. Lyhytvideot rakentavat tunnettuutta ja brändiarvoa, mutta mitattavat liidit
            syntyvät useimmiten silloin, kun ostaja hakee palvelua Googlesta. Siksi
            hakukoneoptimointi kuuluu samaan kokonaisuuteen: optimoimme{" "}
            <SmartLink href="/verkkosivut">verkkosivut</SmartLink> niille hauille, joita asiakkaasi oikeasti
            tekevät. Lue lisää{" "}
            <SmartLink href="/hakukoneoptimointi">hakukoneoptimoinnista</SmartLink> tai kysy siitä{" "}
            <a href="#tarjous">tarjouspyynnön</a> yhteydessä.
          </>
        ),
        schema:
          "Teemme. Lyhytvideot rakentavat tunnettuutta ja brändiarvoa, mutta mitattavat liidit syntyvät useimmiten silloin, kun ostaja hakee palvelua Googlesta. Siksi hakukoneoptimointi kuuluu samaan kokonaisuuteen: optimoimme verkkosivut niille hauille, joita asiakkaasi oikeasti tekevät.",
      },
      {
        q: "Kannattaako lyhytvideotuotanto ulkoistaa vai tehdä itse?",
        answer: (
          <>
            Itse tekeminen on halvinta silloin, kun yrityksestä löytyy henkilö, jolla on aikaa
            opetella kuvaus, editointi ja alustakohtainen optimointi sekä pitää julkaisutahtia yllä
            kuukaudesta toiseen. Useimmiten tuo aika on pois myynnistä. Ulkoistamisen etu ei ole
            pelkkä laatu vaan se, että tahti ei katkea kiireisenä kuukautena.
          </>
        ),
        schema:
          "Itse tekeminen on halvinta silloin, kun yrityksestä löytyy henkilö, jolla on aikaa opetella kuvaus, editointi ja alustakohtainen optimointi sekä pitää julkaisutahtia yllä kuukaudesta toiseen. Ulkoistamisen etu ei ole pelkkä laatu vaan se, että tahti ei katkea kiireisenä kuukautena.",
      },
      {
        q: "Teettekö myös verkkosivut ja yritysilmeen?",
        answer: (
          <>
            Kyllä. WS Media tekee lyhytvideoiden lisäksi{" "}
            <SmartLink href="/verkkosivut">hakukoneoptimoidut verkkosivut</SmartLink>,{" "}
            Meta-mainonnan ja{" "}
            <SmartLink href="/graafinen-suunnittelu">graafisen suunnittelun</SmartLink>. Kun sisältö, sivusto ja mainonta tulevat
            samalta tiimiltä, viesti pysyy yhtenäisenä ja sama kuvausmateriaali palvelee kaikkia
            kolmea.
          </>
        ),
        schema:
          "Kyllä. WS Media tekee lyhytvideoiden lisäksi hakukoneoptimoidut verkkosivut, Meta-mainonnan ja graafisen suunnittelun. Kun sisältö, sivusto ja mainonta tulevat samalta tiimiltä, viesti pysyy yhtenäisenä ja sama kuvausmateriaali palvelee kaikkia kolmea.",
      },
    ],
  },
];
