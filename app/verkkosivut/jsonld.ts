import { ORGANISAATIO } from "../components/organisaatio";
import { FAQ_GROUPS } from "./faq";
import { UKK_KYSYMYKSET } from "./components/sisalto";

/**
 * Rakenteellinen data. FAQPage rakennetaan samasta FAQ_GROUPS-datasta kuin
 * nakyva UKK-osio, joten kysymykset eivat paase erkanemaan toisistaan.
 * Muut solmut ovat sivukohtaista staattista dataa.
 */
const BASE_GRAPH = [
    {
      ...ORGANISAATIO,
      "description": "WS Media on espoolainen verkkosivuihin, lyhytvideotuotantoon ja graafiseen suunnitteluun erikoistunut toimisto.",
      "areaServed": [
        {
          "@type": "Country",
          "name": "Suomi"
        },
        {
          "@type": "City",
          "name": "Espoo"
        },
        {
          "@type": "City",
          "name": "Helsinki"
        },
        {
          "@type": "City",
          "name": "Vantaa"
        }
      ],
      "knowsAbout": [
        "verkkosivujen suunnittelu",
        "verkkosivujen toteutus",
        "kotisivut yritykselle",
        "nettisivut yritykselle",
        "räätälöidyt verkkosivut",
        "hakukoneoptimointi",
        "verkkokauppa",
        "verkkosivujen ylläpito",
        "sivustouudistus",
        "lyhytvideotuotanto",
        "Meta-mainonta"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://wsmedia.fi/verkkosivut#sivu",
      "url": "https://wsmedia.fi/verkkosivut",
      "name": "Kotisivut yritykselle alk. 1 490 € | Espoo | WS Media",
      "description": "Verkkosivut yritykselle avaimet käteen: suunnittelu, tekstit, tekninen hakukoneoptimointi ja julkaisu. Nopeat ja mobiilioptimoidut kotisivut kiinteällä projektihinnalla.",
      "inLanguage": "fi-FI",
      "isPartOf": {
        "@id": "https://wsmedia.fi/#organisaatio"
      },
      "primaryImageOfPage": "https://wsmedia.fi/og/verkkosivut-yritykselle.jpg"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://wsmedia.fi/verkkosivut#murupolku",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Etusivu",
          "item": "https://wsmedia.fi/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Palvelut",
          "item": "https://wsmedia.fi/#palvelut"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Verkkosivut",
          "item": "https://wsmedia.fi/verkkosivut"
        }
      ]
    },
    {
      "@type": "Service",
      "@id": "https://wsmedia.fi/verkkosivut#palvelu",
      "name": "Verkkosivut yritykselle",
      "serviceType": "Verkkosivujen suunnittelu ja toteutus",
      "url": "https://wsmedia.fi/verkkosivut",
      "description": "Avaimet käteen -verkkosivut yritykselle: sivurakenne ja hakusanat, ulkoasu, tekstit, tekninen hakukoneoptimointi, responsiivinen toteutus, lomakkeet, analytiikka sekä verkkotunnus, palvelintila ja SSL-suojaus. Perussivustosta räätälöityyn, käsin koodattuun toteutukseen ja verkkokauppaan.",
      "provider": {
        "@id": "https://wsmedia.fi/#organisaatio"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Suomi"
      },
      "audience": {
        "@type": "BusinessAudience",
        "name": "Pk-yritykset"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Verkkosivupaketit",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Startti",
            "description": "Etusivu ja 3 alasivua, ulkoasu ja tekstit valmiina, tekninen hakukoneoptimointi, yhteydenottolomake ja analytiikka.",
            "priceCurrency": "EUR",
            "price": "1490",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "EUR",
              "price": "1490",
              "valueAddedTaxIncluded": false
            }
          },
          {
            "@type": "Offer",
            "name": "Yrityssivusto",
            "description": "6–12 sisältösivua, oma alasivu jokaiselle palvelulle, laajempi sisältö- ja hakusanatyö, referenssit ja lomakkeet.",
            "priceCurrency": "EUR",
            "price": "2990",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "EUR",
              "price": "2990",
              "valueAddedTaxIncluded": false
            }
          },
          {
            "@type": "Offer",
            "name": "Räätälöity",
            "description": "Käsin koodattu toteutus, omat toiminnallisuudet ja integraatiot, verkkokauppa tai varausjärjestelmä, monikieliset sivut.",
            "priceCurrency": "EUR",
            "price": "5900",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "EUR",
              "price": "5900",
              "valueAddedTaxIncluded": false
            }
          },
          {
            "@type": "Offer",
            "name": "Ylläpito",
            "description": "Palvelintila, verkkotunnus ja SSL-suojaus kuukausimaksulla.",
            "priceCurrency": "EUR",
            "price": "49",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "EUR",
              "price": "49",
              "unitCode": "MON",
              "valueAddedTaxIncluded": false
            }
          },
          {
            "@type": "Offer",
            "name": "Hakukoneoptimoinnin seuranta ja parantaminen",
            "description": "Jatkuva kuukausipalvelu julkaisun jälkeen: hakusanojen seuranta ja sivuston parantaminen.",
            "priceCurrency": "EUR",
            "price": "290",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "EUR",
              "price": "290",
              "unitCode": "MON",
              "valueAddedTaxIncluded": false
            }
          }
        ]
      }
    }
  ];

export function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...BASE_GRAPH,
      {
        "@type": "FAQPage",
        "@id": "https://wsmedia.fi/verkkosivut#ukk",
        /* VAIN SIVULLA NAKYVAT KYSYMYKSET.
           faq.tsx:ssa on 16 kysymysta, sivulla nakyy 10. Merkinta
           rakennettiin kaikista, eli kuusi kysymysta luvattiin
           hakutulokseen ilman etta niiden vastausta on sivulla. Se on
           tasan se, minka Googlen ohje FAQPagesta kieltaa, ja
           seuraamus ei ole varoitus vaan merkinnan sivuuttaminen.
           Lahde on nyt sama lista joka ohjaa nakyvaa osiota. */
        mainEntity: UKK_KYSYMYKSET.map((q) =>
          FAQ_GROUPS.flatMap((g) => g.items).find((it) => it.q === q),
        )
          .filter((it): it is NonNullable<typeof it> => Boolean(it))
          .map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.plain },
          })),
      },
    ],
  };
}
