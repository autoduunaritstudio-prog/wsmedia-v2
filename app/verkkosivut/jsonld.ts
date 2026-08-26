import { FAQ_GROUPS } from "./faq";

/**
 * Rakenteellinen data. FAQPage rakennetaan samasta FAQ_GROUPS-datasta kuin
 * nakyva UKK-osio, joten kysymykset eivat paase erkanemaan toisistaan.
 * Muut solmut ovat sivukohtaista staattista dataa.
 */
const BASE_GRAPH = [
    {
      "@type": "ProfessionalService",
      "@id": "https://wsmedia.fi/#organisaatio",
      "name": "WS Media Oy",
      "alternateName": "WS Media",
      "url": "https://wsmedia.fi/",
      "description": "WS Media on espoolainen verkkosivuihin, lyhytvideotuotantoon ja tapahtumiin erikoistunut toimisto.",
      "vatID": "FI36150844",
      "taxID": "3615084-4",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Espoo",
        "addressRegion": "Uusimaa",
        "addressCountry": "FI"
      },
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
      "name": "Verkkosivut yritykselle | Kotisivujen suunnittelu ja toteutus | WS Media",
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
          "item": "https://wsmedia.fi/palvelut"
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
            "name": "Ylläpito ja hakukoneoptimointi",
            "description": "Jatkuva kuukausipalvelu: päivitykset ja tietoturva, palvelintila ja varmuuskopiot, sisältömuutokset, hakusanaseuranta ja kuukausiraportti sekä jatkuva sisällöntuotanto.",
            "priceCurrency": "EUR",
            "price": "390",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "EUR",
              "price": "390",
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
        mainEntity: FAQ_GROUPS.flatMap((g) =>
          g.items.map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.plain },
          })),
        ),
      },
    ],
  };
}
