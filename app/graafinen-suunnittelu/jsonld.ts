import { FAQ } from "./faq-data";

/**
 * Rakenteellinen data. FAQPage rakennetaan samasta FAQ-taulukosta kuin
 * nakyva UKK-osio, joten kysymykset eivat paase erkanemaan toisistaan.
 * Muut solmut ovat mockupin omaa sivukohtaista dataa sellaisenaan.
 */
const BASE_GRAPH = [
    {
      "@type": "ProfessionalService",
      "@id": "https://wsmedia.fi/#organisaatio",
      "name": "WS Media Oy",
      "alternateName": "WS Media",
      "url": "https://wsmedia.fi/",
      "description": "WS Media on espoolainen graafiseen suunnitteluun, verkkosivuihin, hakukoneoptimointiin ja lyhytvideotuotantoon erikoistunut toimisto.",
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
        "graafinen suunnittelu",
        "yritysilme",
        "logosuunnittelu",
        "graafinen ohjeisto",
        "mainosteippaus",
        "ajoneuvoteippaus",
        "julkisivuteippaus",
        "ikkunateippaus",
        "valomainokset",
        "painotuotteet",
        "käyntikortit",
        "roll-upit"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://wsmedia.fi/graafinen-suunnittelu#sivu",
      "url": "https://wsmedia.fi/graafinen-suunnittelu",
      "name": "Graafinen suunnittelu yritykselle | Yritysilme ja teippaukset | WS Media",
      "description": "Graafinen suunnittelu yritykselle avaimet käteen: logo, yritysilme ja graafinen ohjeisto sekä käyntikortit, teippaukset ja kyltit valmiiksi asennettuna.",
      "inLanguage": "fi-FI",
      "isPartOf": {
        "@id": "https://wsmedia.fi/#organisaatio"
      },
      "primaryImageOfPage": "https://wsmedia.fi/og/graafinen-suunnittelu-yritykselle.jpg"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://wsmedia.fi/graafinen-suunnittelu#murupolku",
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
          "name": "Graafinen suunnittelu",
          "item": "https://wsmedia.fi/graafinen-suunnittelu"
        }
      ]
    },
    {
      "@type": "Service",
      "@id": "https://wsmedia.fi/graafinen-suunnittelu#palvelu",
      "name": "Graafinen suunnittelu yritykselle",
      "serviceType": "Graafinen suunnittelu ja yritysilme",
      "url": "https://wsmedia.fi/graafinen-suunnittelu",
      "description": "Avaimet käteen -graafinen suunnittelu yrityksille: logosuunnittelu, yritysilme ja graafinen ohjeisto sekä ajoneuvoteippaukset, julkisivu- ja ikkunateippaukset, valomainokset ja painotuotteet. Suunnittelu tehdään talon sisällä, tuotanto ja asennus hankitaan alihankintana WS Median vastuulla — asiakas saa yhden tarjouksen ja yhden laskun.",
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
        "name": "Graafisen suunnittelun palvelut",
        "itemListElement": [
          {
            "@type": "Offer",
            "name": "Logo ja tunnus",
            "description": "Logosuunnittelu ja logopaketti eri tiedostomuodoissa, mukana muutoskierrokset.",
            "priceCurrency": "EUR",
            "price": "690",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "EUR",
              "price": "690",
              "valueAddedTaxIncluded": false
            }
          },
          {
            "@type": "Offer",
            "name": "Yritysilme ja graafinen ohjeisto",
            "description": "Logo, väripaletti CMYK-, RGB- ja HEX-arvoineen, typografia sekä graafinen ohjeisto PDF-muodossa.",
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
            "name": "Ajoneuvoteippaus avaimet käteen",
            "description": "Suunnittelu, materiaalit ja asennus. Logoteippaus, osateippaus tai yliteippaus henkilö- ja pakettiautoihin sekä raskaaseen kalustoon.",
            "priceCurrency": "EUR",
            "price": "590",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "EUR",
              "price": "590",
              "valueAddedTaxIncluded": false
            }
          },
          {
            "@type": "Offer",
            "name": "Julkisivu-, ikkuna- ja kylttiratkaisut",
            "description": "Julkisivu- ja ikkunateippaukset, valomainokset, opasteet ja lattiateippaukset asennettuna, lupa-asiat selvitettynä.",
            "priceCurrency": "EUR",
            "price": "890",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "EUR",
              "price": "890",
              "valueAddedTaxIncluded": false
            }
          },
          {
            "@type": "Offer",
            "name": "Painotuotteet",
            "description": "Käyntikortit, flyerit, esitteet ja roll-upit suunnittelusta painoon, painovalmiit aineistot mukaan.",
            "priceCurrency": "EUR",
            "price": "190",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "priceCurrency": "EUR",
              "price": "190",
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
        "@id": "https://wsmedia.fi/graafinen-suunnittelu#ukk",
        mainEntity: FAQ.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      },
    ],
  };
}
