import { ORGANISAATIO } from "../components/organisaatio";
import { FAQ } from "./faq-data";

/**
 * Rakenteellinen data. FAQPage rakennetaan samasta FAQ-taulukosta kuin
 * nakyva UKK-osio. Muut solmut ovat mockupin omaa dataa sellaisenaan.
 */
const BASE_GRAPH = [
    {
      ...ORGANISAATIO,
      "description": "WS Media Oy tuottaa lyhytvideoita, verkkosivuja, hakukoneoptimointia ja graafista suunnittelua suomalaisille yrityksille.",
      "areaServed": {
        "@type": "Country",
        "name": "Suomi"
      },
      "knowsLanguage": [
        "fi",
        "en"
      ],},
    {
      "@type": "WebSite",
      "@id": "https://wsmedia.fi/#sivusto",
      "url": "https://wsmedia.fi/",
      "name": "WS Media",
      "inLanguage": "fi-FI",
      "publisher": {
        "@id": "https://wsmedia.fi/#organisaatio"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://wsmedia.fi/toihin-meille#sivu",
      "url": "https://wsmedia.fi/toihin-meille",
      "name": "Töihin WS Medialle | Freelancerit ja tekijät",
      "description": "Jatkuva avoin haku: videokuvaajat, editoijat, kehittäjät, hakukoneoptimoijat, graafiset suunnittelijat sekä asentajat ja painotalot. Toimeksianto tai työsuhde.",
      "inLanguage": "fi-FI",
      "isPartOf": {
        "@id": "https://wsmedia.fi/#sivusto"
      },
      "about": {
        "@id": "https://wsmedia.fi/#organisaatio"
      },
      "breadcrumb": {
        "@id": "https://wsmedia.fi/toihin-meille#murupolku"
      },
      "significantLink": [
        "https://wsmedia.fi/lyhytvideot",
        "https://wsmedia.fi/verkkosivut",
        "https://wsmedia.fi/hakukoneoptimointi",
        "https://wsmedia.fi/graafinen-suunnittelu"
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://wsmedia.fi/toihin-meille#murupolku",
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
          "name": "Töihin meille",
          "item": "https://wsmedia.fi/toihin-meille"
        }
      ]
    },
    {
      "@type": "ItemList",
      "@id": "https://wsmedia.fi/toihin-meille#osaamisalueet",
      "name": "Osaamisalueet, joihin WS Media hakee tekijöitä",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Kuvaajat, editoijat ja motion designerit"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kehittäjät, hakukoneoptimoijat ja sisällöntuottajat"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Graafiset suunnittelijat"
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Asentajat, painotalot ja materiaalitoimittajat"
        }
      ]
    }
  ];

export function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...BASE_GRAPH,
      {
        "@type": "FAQPage",
        "@id": "https://wsmedia.fi/toihin-meille#ukk",
        mainEntity: FAQ.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        })),
      },
    ],
  };
}
