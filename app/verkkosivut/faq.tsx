import type { ReactNode } from "react";

import SmartLink from "../components/SmartLink";

/**
 * UKK-data yhdessa paikassa: sama lahde syottaa seka nakyvan osion etta
 * FAQPage-rakenteellisen datan. Vastaus on ReactNode, jotta linkit voidaan
 * renderoida SmartLinkilla; JSON-LD:hen menee erikseen pidetty puhdas teksti.
 */
export type FaqItem = { q: string; a: ReactNode; plain: string };
export type FaqGroup = { title: string; items: FaqItem[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    title: "Hinta ja aikataulu",
    items: [
      {
        q: "Paljonko verkkosivut maksavat yritykselle?",
        a: "Kiinteä projektihinta alkaa 1 490 eurosta + alv 25,5 %. Suppea kokonaisuus on edullisin, useamman sivun yrityssivusto asettuu 2 990–4 900 euroon ja täysin räätälöity toteutus alkaa 5 900 eurosta. Lopullinen hinta riippuu sivuston laajuudesta, sisällön määrästä ja tarvittavista toiminnallisuuksista.",
        plain: "Kiinteä projektihinta alkaa 1 490 eurosta + alv 25,5 %. Suppea kokonaisuus on edullisin, useamman sivun yrityssivusto asettuu 2 990–4 900 euroon ja täysin räätälöity toteutus alkaa 5 900 eurosta. Lopullinen hinta riippuu sivuston laajuudesta, sisällön määrästä ja tarvittavista toiminnallisuuksista.",
      },
      {
        q: "Mitä verkkosivujen hinta sisältää?",
        a: "Suunnittelun, toteutuksen, tekstit, kuvien viimeistelyn, teknisen hakukoneoptimoinnin, lomakkeet, analytiikan ja julkaisun. Verkkotunnus, palvelintila ja SSL-suojaus sisältyvät ensimmäiseen vuoteen. Ei aloitusmaksuja eikä piilokuluja.",
        plain: "Suunnittelun, toteutuksen, tekstit, kuvien viimeistelyn, teknisen hakukoneoptimoinnin, lomakkeet, analytiikan ja julkaisun. Verkkotunnus, palvelintila ja SSL-suojaus sisältyvät ensimmäiseen vuoteen. Ei aloitusmaksuja eikä piilokuluja.",
      },
      {
        q: "Kuinka nopeasti verkkosivut valmistuvat?",
        a: "Suppea kokonaisuus on julkaisukunnossa tyypillisesti 2 viikossa, laajempi yrityssivusto vie 3–5 viikkoa ja räätälöity toteutus 6–10 viikkoa. Suurin yksittäinen aikatauluun vaikuttava tekijä on se, kuinka nopeasti saamme sinulta kuvat ja hyväksynnät.",
        plain: "Suppea kokonaisuus on julkaisukunnossa tyypillisesti 2 viikossa, laajempi yrityssivusto vie 3–5 viikkoa ja räätälöity toteutus 6–10 viikkoa. Suurin yksittäinen aikatauluun vaikuttava tekijä on se, kuinka nopeasti saamme sinulta kuvat ja hyväksynnät.",
      },
      {
        q: "Onko pakko sitoutua kuukausimaksuun?",
        a: "Ei. Projektihinta on kertaluonteinen ja sivusto on sen jälkeen sinun. Ylläpito ja hakukoneoptimointi ovat erillinen kuukausipalvelu, jonka voi lopettaa kuukauden irtisanomisajalla.",
        plain: "Ei. Projektihinta on kertaluonteinen ja sivusto on sen jälkeen sinun. Ylläpito ja hakukoneoptimointi ovat erillinen kuukausipalvelu, jonka voi lopettaa kuukauden irtisanomisajalla.",
      },
      {
        q: "Miten hakukoneoptimointi vaikuttaa hintaan?",
        a: "Tekninen hakukoneoptimointi sisältyy jokaiseen toteutukseen. Hintaa nostaa sisältötyö: mitä useammalle palvelulle tehdään oma alasivunsa ja mitä laajempi hakusanatyö tehdään, sitä enemmän sivuja kirjoitetaan — ja sitä useammalla haulla sivusto voi näkyä.",
        plain: "Tekninen hakukoneoptimointi sisältyy jokaiseen toteutukseen. Hintaa nostaa sisältötyö: mitä useammalle palvelulle tehdään oma alasivunsa ja mitä laajempi hakusanatyö tehdään, sitä enemmän sivuja kirjoitetaan — ja sitä useammalla haulla sivusto voi näkyä.",
      },
    ],
  },
  {
    title: "Toteutus ja tekniikka",
    items: [
      {
        q: "Perussivusto vai räätälöidyt verkkosivut — kumpi kannattaa valita?",
        a: "Perussivusto riittää, kun palveluita on muutama, tarpeet ovat tavanomaisia ja sivusto halutaan nopeasti verkkoon. Räätälöity kannattaa, kun nopeus ja erottuvuus ovat tärkeitä kilpaillulla alalla, tarvitset toiminnallisuuksia joita valmiit ratkaisut eivät kata, tai haluat minimoida jatkuvan ylläpidon ja tietoturvahuolet.",
        plain: "Perussivusto riittää, kun palveluita on muutama, tarpeet ovat tavanomaisia ja sivusto halutaan nopeasti verkkoon. Räätälöity kannattaa, kun nopeus ja erottuvuus ovat tärkeitä kilpaillulla alalla, tarvitset toiminnallisuuksia joita valmiit ratkaisut eivät kata, tai haluat minimoida jatkuvan ylläpidon ja tietoturvahuolet.",
      },
      {
        q: "Käytättekö WordPressiä?",
        a: "Käytämme silloin, kun asiakas haluaa päivittää sisältöä paljon itse ja valmis hallintanäkymä on siihen luontevin työkalu. Muuten koodaamme sivuston itse, koska kevyempi toteutus latautuu nopeammin, siinä on vähemmän päivitettävää ja pienempi hyökkäyspinta.",
        plain: "Käytämme silloin, kun asiakas haluaa päivittää sisältöä paljon itse ja valmis hallintanäkymä on siihen luontevin työkalu. Muuten koodaamme sivuston itse, koska kevyempi toteutus latautuu nopeammin, siinä on vähemmän päivitettävää ja pienempi hyökkäyspinta.",
      },
      {
        q: "Voinko päivittää sisältöä itse?",
        a: "Voit. Räätälöity toteutus ei tarkoita, etteikö tekstejä ja kuvia voisi vaihtaa itse: teemme muokattavat osat hallintanäkymään ja opastamme käytön. Halutessasi hoidamme päivitykset puolestasi ylläpitopaketissa.",
        plain: "Voit. Räätälöity toteutus ei tarkoita, etteikö tekstejä ja kuvia voisi vaihtaa itse: teemme muokattavat osat hallintanäkymään ja opastamme käytön. Halutessasi hoidamme päivitykset puolestasi ylläpitopaketissa.",
      },
      {
        q: "Toimiiko sivusto varmasti mobiilissa?",
        a: "Sivusto suunnitellaan mobiili edellä, koska valtaosa kävijöistä saapuu puhelimella. Testaamme jokaisen sivun puhelimella, tabletilla ja työpöydällä ennen julkaisua.",
        plain: "Sivusto suunnitellaan mobiili edellä, koska valtaosa kävijöistä saapuu puhelimella. Testaamme jokaisen sivun puhelimella, tabletilla ja työpöydällä ennen julkaisua.",
      },
    ],
  },
  {
    title: "Omistus ja sisältö",
    items: [
      {
        q: "Kuka omistaa sivuston ja verkkotunnuksen?",
        a: "Sinä. Verkkotunnus rekisteröidään yrityksesi nimiin ja saat sivustoon täydet oikeudet. Emme lukitse sivustoa omalle alustallemme.",
        plain: "Sinä. Verkkotunnus rekisteröidään yrityksesi nimiin ja saat sivustoon täydet oikeudet. Emme lukitse sivustoa omalle alustallemme.",
      },
      {
        q: "Tarvitseeko minulla olla valmiit tekstit ja kuvat?",
        a: "Ei tarvitse. Kirjoitamme tekstit puolestasi ja käsittelemme olemassa olevan kuvamateriaalin. Jos kuvia ei ole, voimme kuvata ne tai käyttää kuvapankkia — kuvaus hinnoitellaan erikseen.",
        plain: "Ei tarvitse. Kirjoitamme tekstit puolestasi ja käsittelemme olemassa olevan kuvamateriaalin. Jos kuvia ei ole, voimme kuvata ne tai käyttää kuvapankkia — kuvaus hinnoitellaan erikseen.",
      },
    ],
  },
  {
    title: "Näkyvyys ja jatko",
    items: [
      {
        q: "Näkyykö sivusto Googlessa heti julkaisun jälkeen?",
        a: "Sivusto indeksoituu yleensä muutamassa päivässä, mutta sijoitukset kilpailluilla hauilla kertyvät kuukausien kuluessa. Realistinen aikajänne on 3–6 kuukautta, ja lopputulos riippuu siitä, tehdäänkö sisältötyötä myös julkaisun jälkeen.",
        plain: "Sivusto indeksoituu yleensä muutamassa päivässä, mutta sijoitukset kilpailluilla hauilla kertyvät kuukausien kuluessa. Realistinen aikajänne on 3–6 kuukautta, ja lopputulos riippuu siitä, tehdäänkö sisältötyötä myös julkaisun jälkeen.",
      },
      {
        q: "Voiko vanhat sivut uudistaa ilman että Google-näkyvyys katoaa?",
        a: "Voi. Vanha verkkotunnus säilyy ja teemme vanhoista osoitteista uudelleenohjaukset uusiin, jolloin kertynyt näkyvyys siirtyy uudelle sivustolle. Tämä on se kohta, jossa sivustouudistus useimmiten epäonnistuu, joten se suunnitellaan ennen julkaisua eikä sen jälkeen.",
        plain: "Voi. Vanha verkkotunnus säilyy ja teemme vanhoista osoitteista uudelleenohjaukset uusiin, jolloin kertynyt näkyvyys siirtyy uudelle sivustolle. Tämä on se kohta, jossa sivustouudistus useimmiten epäonnistuu, joten se suunnitellaan ennen julkaisua eikä sen jälkeen.",
      },
      {
        q: "Voiko sivustoa laajentaa myöhemmin?",
        a: "Voi. Rakenne tehdään alusta asti niin, että uusia palvelu- tai sisältösivuja voi lisätä ilman että koko sivustoa tarvitsee rakentaa uudelleen.",
        plain: "Voi. Rakenne tehdään alusta asti niin, että uusia palvelu- tai sisältösivuja voi lisätä ilman että koko sivustoa tarvitsee rakentaa uudelleen.",
      },
      {
        q: "Teettekö myös verkkokaupan?",
        a: "Teemme. Verkkokauppa rakennetaan saman sivuston osaksi, jolloin tuotesivut hyötyvät samasta rakenteesta ja hakukoneoptimoinnista kuin muukin sisältö.",
        plain: "Teemme. Verkkokauppa rakennetaan saman sivuston osaksi, jolloin tuotesivut hyötyvät samasta rakenteesta ja hakukoneoptimoinnista kuin muukin sisältö.",
      },
      {
        q: "Teettekö myös lyhytvideot ja mainonnan?",
        a: (
      <>
        {"Kyllä. WS Media tekee verkkosivujen lisäksi "}
        <SmartLink href="/lyhytvideot">lyhytvideot</SmartLink>
        {" TikTokiin, Instagram Reelsiin ja YouTube Shortsiin sekä Meta-mainonnan ja tapahtumatuotannot. Kun sivusto ja sisältö tulevat samalta tiimiltä, viesti pysyy yhtenäisenä ja sama kuvausmateriaali palvelee sekä sivustoa että somekanavia."}
      </>
    ),
        plain: "Kyllä. WS Media tekee verkkosivujen lisäksi lyhytvideot TikTokiin, Instagram Reelsiin ja YouTube Shortsiin sekä Meta-mainonnan ja tapahtumatuotannot. Kun sivusto ja sisältö tulevat samalta tiimiltä, viesti pysyy yhtenäisenä ja sama kuvausmateriaali palvelee sekä sivustoa että somekanavia.",
      },
    ],
  },
];
