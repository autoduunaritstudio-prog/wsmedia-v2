import { FAQ_GROUPS } from "./faq";

/**
 * Rakenteellinen data. FAQPage rakennetaan samasta FAQ_GROUPS-datasta kuin
 * nakyva UKK-osio, joten kysymykset eivat paase erkanemaan toisistaan.
 */
const BASE_GRAPH = [
    {
      "@type": "ProfessionalService",
      "@id": "https://wsmedia.fi/#organisaatio",
      "name": "WS Media Oy",
      "alternateName": "WS Media",
      "url": "https://wsmedia.fi/",
      "description": "WS Media on espoolainen hakukoneoptimointiin, verkkosivuihin ja lyhytvideotuotantoon erikoistunut toimisto.",
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
        "hakukoneoptimointi",
        "tekninen hakukoneoptimointi",
        "avainsanatutkimus",
        "paikallinen hakukoneoptimointi",
        "Google-yritysprofiili",
        "SEO-auditointi",
        "sisällöntuotanto",
        "linkkiprofiili",
        "tekoälyhakunäkyvyys",
        "verkkosivujen suunnittelu",
        "lyhytvideotuotanto"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://wsmedia.fi/hakukoneoptimointi#sivu",
      "url": "https://wsmedia.fi/hakukoneoptimointi",
      "name": "Hakukoneoptimointi yritykselle | SEO-palvelut ja hinta | WS Media",
      "description": "Hakukoneoptimointi yritykselle: tekninen SEO, sisältö, auktoriteetti ja paikallinen näkyvyys — ja näkyvyys myös tekoälyhauissa. Kuukausipaketit alkaen 390 €/kk.",
      "inLanguage": "fi-FI",
      "isPartOf": {
        "@id": "https://wsmedia.fi/#organisaatio"
      },
      "primaryImageOfPage": "https://wsmedia.fi/og/hakukoneoptimointi-yritykselle.jpg"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://wsmedia.fi/hakukoneoptimointi#murupolku",
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
          "name": "Hakukoneoptimointi",
          "item": "https://wsmedia.fi/hakukoneoptimointi"
        }
      ]
    },
    {
      "@type": "Service",
      "@id": "https://wsmedia.fi/hakukoneoptimointi#palvelu",
      "name": "Hakukoneoptimointi yritykselle",
      "serviceType": "Hakukoneoptimointi",
      "url": "https://wsmedia.fi/hakukoneoptimointi",
      "description": "Jatkuva hakukoneoptimointi yrityksille: tekninen SEO, avainsanatutkimus, sisällöntuotanto, auktoriteetin rakentaminen, paikallinen hakukoneoptimointi ja Google-yritysprofiili sekä optimointi tekoälyhakujen vastauksiin. Sovitut mittarit ja kuukausiraportointi.",
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
        "name": "Hakukoneoptimoinnin kuukausipaketit",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Perusta",
            "description": "Sivuston tekninen kunnossapito ja perusnäkyvyys: 10 seurattavaa hakusanaa, yhden sivun optimointi kuukaudessa, Google-yritysprofiilin käyttöönotto ja raportti kolmen kuukauden välein. Kuukausi kerrallaan.",
            "priceCurrency": "EUR",
            "price": "390",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "EUR",
              "price": "390",
              "unitCode": "MON",
              "valueAddedTaxIncluded": false
            }
          },
          {
            "@type": "Offer",
            "name": "Kasvu",
            "description": "Jatkuva sisältötyö ja paikallinen näkyvyys: 40 seurattavaa hakusanaa, kolmen sivun optimointi ja kaksi artikkelia kuukaudessa, viisi kaupunkisivua, tekoälyhakunäkyvyyden optimointi sekä kuukausiraportti. Vähimmäiskesto 6 kk.",
            "priceCurrency": "EUR",
            "price": "890",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "EUR",
              "price": "890",
              "unitCode": "MON",
              "valueAddedTaxIncluded": false
            }
          },
          {
            "@type": "Offer",
            "name": "Täysi",
            "description": "Kilpailluille toimialoille: 100 seurattavaa hakusanaa, kuuden sivun optimointi ja neljä artikkelia kuukaudessa, rajattomasti kaupunkisivuja, auktoriteetin ja linkkien rakentaminen sekä tekoälyhakunäkyvyyden seuranta. Vähimmäiskesto 6 kk.",
            "priceCurrency": "EUR",
            "price": "1690",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "EUR",
              "price": "1690",
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
        "@id": "https://wsmedia.fi/hakukoneoptimointi#ukk",
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
