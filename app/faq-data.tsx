import type { ReactNode } from "react";

import SmartLink from "./components/SmartLink";

/**
 * Etusivun UKK. Sama muoto kuin alasivuilla (q / a / plain), jolloin yksi
 * lahde syottaa seka nakyvan osion etta FAQPage-rakenteellisen datan eivatka
 * ne paase erkanemaan.
 *
 * SISALTO ON TIIVISTETTY ALASIVUJEN OMISTA UKK:ISTA, ei kirjoitettu uusiksi:
 * jokainen vastaus kayttaa samoja termeja ja lukuja kuin lahde, jotta etusivu
 * vahvistaa niita hakusanoja joilla alasivut jo kilpailevat sen sijaan etta
 * kilpailisi niiden kanssa uusilla muotoiluilla. Lahteet:
 *   lyhytvideot/faq-data.tsx, verkkosivut/faq.tsx,
 *   hakukoneoptimointi/faq.tsx, graafinen-suunnittelu/faq-data.ts.
 * Tapahtumat on ainoa jolla ei viela ole omaa UKK:ta; sen vastaus on
 * tiivistetty Palvelut-osion tapahtumapaneelin omasta tekstista.
 *
 * [HINTA]-paikkamerkit ovat lahteessa sellaisenaan eika niita tayteta tassa.
 */
export type HomeFaqItem = { q: string; a: ReactNode; plain: string };

export const HOME_FAQ: HomeFaqItem[] = [
  {
    q: "Paljonko lyhytvideotuotanto maksaa?",
    a: (
      <>
        Jatkuva lyhytvideotuotanto alkaa [HINTA] eurosta kuukaudessa, ja hinta määräytyy videoiden
        määrän, kuvauspäivien ja kanavien mukaan. Yksittäiset videot ja kampanjatuotannot
        hinnoitellaan projekteina alkaen [HINTA] euroa.{" "}
        <SmartLink href="/lyhytvideot#hinnoittelu">Lue lisää lyhytvideoista →</SmartLink>
      </>
    ),
    plain:
      "Jatkuva lyhytvideotuotanto alkaa [HINTA] eurosta kuukaudessa, ja hinta määräytyy videoiden määrän, kuvauspäivien ja kanavien mukaan. Yksittäiset videot ja kampanjatuotannot hinnoitellaan projekteina alkaen [HINTA] euroa.",
  },
  {
    q: "Saanko samasta videosta versiot TikTokiin ja Instagram Reelsiin?",
    a: (
      <>
        Saat. Sama kuvausmateriaali leikataan alustakohtaisiksi versioiksi TikTokiin, Instagram
        Reelsiin ja YouTube Shortsiin — tekstitykset, grafiikat ja alustakohtainen optimointi
        sisältyvät hintaan.{" "}
        <SmartLink href="/lyhytvideot">Lue lisää lyhytvideoista →</SmartLink>
      </>
    ),
    plain:
      "Saat. Sama kuvausmateriaali leikataan alustakohtaisiksi versioiksi TikTokiin, Instagram Reelsiin ja YouTube Shortsiin — tekstitykset, grafiikat ja alustakohtainen optimointi sisältyvät hintaan.",
  },
  {
    q: "Paljonko verkkosivut maksavat yritykselle?",
    a: (
      <>
        Kiinteä projektihinta alkaa 1 490 eurosta + alv 25,5 %. Useamman sivun yrityssivusto
        asettuu 2 990–4 900 euroon ja täysin räätälöity toteutus alkaa 5 900 eurosta. Hinta
        sisältää suunnittelun, tekstit, teknisen hakukoneoptimoinnin ja julkaisun.{" "}
        <SmartLink href="/verkkosivut#hinnoittelu">Lue lisää verkkosivuista →</SmartLink>
      </>
    ),
    plain:
      "Kiinteä projektihinta alkaa 1 490 eurosta + alv 25,5 %. Useamman sivun yrityssivusto asettuu 2 990–4 900 euroon ja täysin räätälöity toteutus alkaa 5 900 eurosta. Hinta sisältää suunnittelun, tekstit, teknisen hakukoneoptimoinnin ja julkaisun.",
  },
  {
    q: "Näkyykö hakukoneoptimoitu verkkosivu Googlessa heti julkaisun jälkeen?",
    a: (
      <>
        Sivusto indeksoituu yleensä muutamassa päivässä, mutta sijoitukset kilpailluilla hauilla
        kertyvät kuukausien kuluessa. Realistinen aikajänne on 3–6 kuukautta, ja lopputulos riippuu
        siitä, tehdäänkö sisältötyötä myös julkaisun jälkeen.{" "}
        <SmartLink href="/verkkosivut">Lue lisää verkkosivuista →</SmartLink>
      </>
    ),
    plain:
      "Sivusto indeksoituu yleensä muutamassa päivässä, mutta sijoitukset kilpailluilla hauilla kertyvät kuukausien kuluessa. Realistinen aikajänne on 3–6 kuukautta, ja lopputulos riippuu siitä, tehdäänkö sisältötyötä myös julkaisun jälkeen.",
  },
  {
    q: "Kuinka nopeasti hakukoneoptimointi tuo tuloksia?",
    a: (
      <>
        Ensimmäiset merkit näkyvät tyypillisesti 3–6 kuukauden kuluttua ja selvä vaikutus
        liiketoiminnassa 6–12 kuukauden kohdalla. Suunta näkyy kuitenkin ennen tuloksia:
        näyttökerrat hakutuloksissa kasvavat ennen kuin klikkaukset ja yhteydenotot kasvavat.{" "}
        <SmartLink href="/hakukoneoptimointi">Lue lisää hakukoneoptimoinnista →</SmartLink>
      </>
    ),
    plain:
      "Ensimmäiset merkit näkyvät tyypillisesti 3–6 kuukauden kuluttua ja selvä vaikutus liiketoiminnassa 6–12 kuukauden kohdalla. Suunta näkyy kuitenkin ennen tuloksia: näyttökerrat hakutuloksissa kasvavat ennen kuin klikkaukset ja yhteydenotot kasvavat.",
  },
  {
    q: "Paljonko graafinen suunnittelu maksaa?",
    a: (
      <>
        Logo alkaa 690 eurosta ja yritysilme graafisine ohjeistoineen 1 490 eurosta. Painotuotteen
        suunnittelu alkaa 190 eurosta. Suomessa kokeneen graafisen suunnittelijan tuntihinta on
        tyypillisesti 70–120 euroa. Hintoihin lisätään alv 25,5 %.{" "}
        <SmartLink href="/graafinen-suunnittelu">Lue lisää graafisesta suunnittelusta →</SmartLink>
      </>
    ),
    plain:
      "Logo alkaa 690 eurosta ja yritysilme graafisine ohjeistoineen 1 490 eurosta. Painotuotteen suunnittelu alkaa 190 eurosta. Suomessa kokeneen graafisen suunnittelijan tuntihinta on tyypillisesti 70–120 euroa. Hintoihin lisätään alv 25,5 %.",
  },
  {
    q: "Mitä auton mainosteippaus maksaa?",
    a: (
      <>
        Hinta riippuu laajuudesta: markkinoilla logoteippaus asettuu 200–500 euroon, osateippaus
        400–1 500 euroon ja koko auton yliteippaus 1 500–4 000 euroon. Meidän hintamme alkaa 590
        eurosta ja sisältää suunnittelun, materiaalit ja asennuksen.{" "}
        <SmartLink href="/graafinen-suunnittelu">Lue lisää graafisesta suunnittelusta →</SmartLink>
      </>
    ),
    plain:
      "Hinta riippuu laajuudesta: markkinoilla logoteippaus asettuu 200–500 euroon, osateippaus 400–1 500 euroon ja koko auton yliteippaus 1 500–4 000 euroon. Meidän hintamme alkaa 590 eurosta ja sisältää suunnittelun, materiaalit ja asennuksen.",
  },
  {
    q: "Mitä yritystapahtuman tuotanto sisältää?",
    a: (
      <>
        Suunnittelusta toteutukseen ja taltiointiin. Tapahtuma tuottaa samalla sisältöä someen ja
        sivuillesi: aftermovie ja some-nostot syntyvät samasta tuotannosta, joten yksi ilta ruokkii
        koko vuoden markkinointia.{" "}
        <SmartLink href="/#palvelut">Lue lisää tapahtumista →</SmartLink>
      </>
    ),
    plain:
      "Suunnittelusta toteutukseen ja taltiointiin. Tapahtuma tuottaa samalla sisältöä someen ja sivuillesi: aftermovie ja some-nostot syntyvät samasta tuotannosta, joten yksi ilta ruokkii koko vuoden markkinointia.",
  },
];

/** FAQPage samasta lahteesta kuin nakyva osio. */
export function buildHomeFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://wsmedia.fi/#ukk",
    mainEntity: HOME_FAQ.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.plain },
    })),
  };
}
