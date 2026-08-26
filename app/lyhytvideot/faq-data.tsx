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
        answer: (
          <>
            Jatkuva lyhytvideotuotanto alkaa meillä [HINTA] eurosta kuukaudessa, ja hinta määräytyy
            videoiden määrän, kuvauspäivien ja kanavien mukaan. Yksittäiset videot ja
            kampanjatuotannot hinnoitellaan projekteina alkaen [HINTA] euroa. Kerro budjettisi{" "}
            <a href="#tarjous">tarjouslomakkeella</a>, niin rakennamme sen sisään mahtuvan
            suunnitelman.
          </>
        ),
        schema:
          "Jatkuva lyhytvideotuotanto alkaa [HINTA] eurosta kuukaudessa, ja hinta määräytyy videoiden määrän, kuvauspäivien ja kanavien mukaan. Yksittäiset videot ja kampanjatuotannot hinnoitellaan projekteina alkaen [HINTA] euroa.",
      },
      {
        q: "Kuinka monta lyhytvideota kannattaa julkaista kuukaudessa?",
        answer: (
          <>
            Algoritmit palkitsevat säännöllisyyttä. Käytännössä [X]–[X] videota kuukaudessa per
            kanava on se taso, jolla tulokset alkavat kertyä. Harvempi julkaisutahti toimii, jos
            sisällöt ovat poikkeuksellisen vahvoja, mutta silloin kehitys on hitaampaa.
          </>
        ),
        schema:
          "Algoritmit palkitsevat säännöllisyyttä. Käytännössä [X]–[X] videota kuukaudessa per kanava on se taso, jolla tulokset alkavat kertyä.",
      },
      {
        q: "Kuinka nopeasti saan valmiit videot?",
        answer: (
          <>
            Toimitamme videot tyypillisesti [X] arkipäivän kuluessa kuvauspäivästä. Kiireellisessä
            tapauksessa nopein toimitus on [X] tuntia. Sisältösuunnitelman ja käsikirjoitukset saat
            nähtäväksi jo ennen kuvauksia.
          </>
        ),
        schema:
          "Toimitamme videot tyypillisesti [X] arkipäivän kuluessa kuvauspäivästä. Kiireellisessä tapauksessa nopein toimitus on [X] tuntia.",
      },
      {
        q: "Kuinka nopeasti lyhytvideot tuottavat tulosta?",
        answer: (
          <>
            Ensimmäiset näyttökerrat tulevat heti, mutta luotettava kuva syntyy vasta useamman
            kuukauden datasta. Tyypillisesti selvä käänne näkyy [X] kuukauden kohdalla, kun
            kanavalle on kertynyt riittävästi julkaisuja ja tiedämme datan perusteella mitkä teemat
            toimivat.
          </>
        ),
        schema:
          "Ensimmäiset näyttökerrat tulevat heti, mutta luotettava kuva syntyy vasta useamman kuukauden datasta. Tyypillisesti selvä käänne näkyy [X] kuukauden kohdalla.",
      },
    ],
  },
  {
    label: "Kuvaus ja tuotanto",
    items: [
      {
        q: "Meillä ei ole ketään kameran eteen. Mitä teemme?",
        answer: (
          <>
            Tämä on yleisin huoli, eikä se ole este. Voimme hankkia esiintyjän puolestasi, tai
            rakentaa sisällöt ilman puhuvaa päätä: tuote-, prosessi- ja kulissien takaa -sisällöt,
            tekstivetoiset videot ja asiakastarinat toimivat monella toimialalla jopa paremmin.
          </>
        ),
        schema:
          "Voimme hankkia esiintyjän puolestasi, tai rakentaa sisällöt ilman puhuvaa päätä: tuote-, prosessi- ja kulissien takaa -sisällöt, tekstivetoiset videot ja asiakastarinat toimivat monella toimialalla jopa paremmin.",
      },
      {
        q: "Missä kuvaukset tehdään?",
        answer: (
          <>
            Lähtökohtaisesti sinun omissa tiloissasi — se on nopeinta ja näyttää aidoimmalta.
            Kuvaamme päivittäin Espoossa ja Helsingissä, ja kuvauspäivät onnistuvat sovitusti myös
            muualla Suomessa. Tarvittaessa käytämme erillistä kuvauspaikkaa tai studiota.
          </>
        ),
        schema:
          "Lähtökohtaisesti asiakkaan omissa tiloissa. Kuvaamme päivittäin Espoossa ja Helsingissä, ja kuvauspäivät onnistuvat sovitusti myös muualla Suomessa.",
      },
      {
        q: "Sisältyvätkö tekstitykset, musiikki ja grafiikat hintaan?",
        answer: (
          <>
            Kyllä. Tekstitykset, käyttöoikeudellinen taustamusiikki, äänisuunnittelu ja brändin
            mukaiset grafiikat sisältyvät jokaiseen videoon. Erikseen hinnoitellaan vain esiintyjä,
            maksetun mainonnan hallinnointi ja mahdolliset erikoistuotannot.
          </>
        ),
        schema:
          "Kyllä. Tekstitykset, käyttöoikeudellinen taustamusiikki, äänisuunnittelu ja brändin mukaiset grafiikat sisältyvät jokaiseen videoon.",
      },
      {
        q: "Saanko samasta videosta versiot eri kanaviin?",
        answer: (
          <>
            Saat. Leikkaamme jokaisesta sisällöstä alustakohtaiset versiot: kesto, kuvasuhde,
            tekstityksen sijainti ja kansikuva optimoidaan erikseen TikTokille, Instagram Reelsille
            ja YouTube Shortsille. Sama tiedosto kaikkiin kanaviin on yleisin syy siihen, miksi
            näyttökerrat jäävät vajaiksi.
          </>
        ),
        schema:
          "Saat. Leikkaamme jokaisesta sisällöstä alustakohtaiset versiot: kesto, kuvasuhde, tekstityksen sijainti ja kansikuva optimoidaan erikseen TikTokille, Instagram Reelsille ja YouTube Shortsille.",
      },
    ],
  },
  {
    label: "Sopimus ja omistajuus",
    items: [
      {
        q: "Kuka omistaa valmiit videot?",
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
            Noin [X] tuntia kuukaudessa: kuvauspäivä ja lyhyt hyväksyntäkierros käsikirjoituksiin.
            Ideointi, käsikirjoitus, editointi, tekstitys ja julkaisu hoituvat meiltä.
          </>
        ),
        schema:
          "Noin [X] tuntia kuukaudessa: kuvauspäivä ja lyhyt hyväksyntäkierros käsikirjoituksiin. Ideointi, käsikirjoitus, editointi, tekstitys ja julkaisu hoituvat meiltä.",
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
        q: "Onko pakko sitoutua pitkäksi aikaa?",
        answer: (
          <>
            Ei. Sopimus jatkuu kuukausi kerrallaan ja irtisanomisaika on yksi kuukausi.
            Suosittelemme kuitenkin varaamaan vähintään [X] kuukautta, koska lyhytvideoiden
            tulokset kertyvät kumulatiivisesti.
          </>
        ),
        schema:
          "Ei. Sopimus jatkuu kuukausi kerrallaan ja irtisanomisaika on yksi kuukausi. Suosittelemme kuitenkin varaamaan vähintään [X] kuukautta, koska lyhytvideoiden tulokset kertyvät kumulatiivisesti.",
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
            Voimme. Julkaisu ja aikataulutus sisältyvät sovittuihin paketteihin, ja parhaiten
            orgaanisesti toimineet videot viedään Facebook- ja Instagram-mainonnaksi. Tämä on
            mainoseuron kannalta tehokkain järjestys: sisältö on jo todistettu yleisöllä ennen kuin
            siihen laitetaan budjettia. Mainonnan hallinnointi hinnoitellaan erikseen
            kanavakohtaisesti, mainosbudjetin päälle.
          </>
        ),
        schema:
          "Voimme. Julkaisu ja aikataulutus sisältyvät sovittuihin paketteihin, ja parhaiten orgaanisesti toimineet videot viedään Facebook- ja Instagram-mainonnaksi. Tämä on mainoseuron kannalta tehokkain järjestys: sisältö on jo todistettu yleisöllä ennen kuin siihen laitetaan budjettia. Mainonnan hallinnointi hinnoitellaan erikseen kanavakohtaisesti, mainosbudjetin päälle.",
      },
      {
        q: "Teettekö myös hakukoneoptimointia?",
        answer: (
          <>
            Teemme. Lyhytvideot rakentavat tunnettuutta ja brändiarvoa, mutta mitattavat liidit
            syntyvät useimmiten silloin, kun ostaja hakee palvelua Googlesta. Siksi
            hakukoneoptimointi kuuluu samaan kokonaisuuteen: optimoimme{" "}
            <SmartLink href="/verkkosivut">verkkosivut</SmartLink> niille hauille, joita asiakkaasi oikeasti
            tekevät. Hakukoneoptimoinnille tulee oma sivunsa lähiaikoina — sillä välin kysy siitä{" "}
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
        q: "Teettekö myös verkkosivut ja tapahtumavideot?",
        answer: (
          <>
            Kyllä. WS Media tekee lyhytvideoiden lisäksi{" "}
            <SmartLink href="/verkkosivut">hakukoneoptimoidut verkkosivut</SmartLink>,{" "}
            <SmartLink href="/meta-mainonta">Meta-mainonnan</SmartLink> ja{" "}
            <SmartLink href="/tapahtumat">tapahtumatuotannot</SmartLink>. Kun sisältö, sivusto ja mainonta tulevat
            samalta tiimiltä, viesti pysyy yhtenäisenä ja sama kuvausmateriaali palvelee kaikkia
            kolmea.
          </>
        ),
        schema:
          "Kyllä. WS Media tekee lyhytvideoiden lisäksi hakukoneoptimoidut verkkosivut, Meta-mainonnan ja tapahtumatuotannot. Kun sisältö, sivusto ja mainonta tulevat samalta tiimiltä, viesti pysyy yhtenäisenä ja sama kuvausmateriaali palvelee kaikkia kolmea.",
      },
    ],
  },
];
