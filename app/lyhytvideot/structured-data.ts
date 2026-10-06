import { ORGANISAATIO } from "../components/organisaatio";
import { FAQ_GROUPS } from "./faq-data";

const ORG_ID = "https://wsmedia.fi/#organisaatio";
const OG_IMAGE = "https://wsmedia.fi/lyhytvideot/opengraph-image";

/**
 * Mockupin JSON-LD-graafi. FAQPage-osa kootaan samasta FAQ_GROUPS-datasta
 * kuin nakyva UKK-osio, joten kysymykset eivat paase eriytymaan.
 */
export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      ...ORGANISAATIO,
      description:
        "WS Media on espoolainen lyhytvideotuotantoon, verkkosivuihin ja graafiseen suunnitteluun erikoistunut toimisto.",
      areaServed: [
        { "@type": "Country", name: "Suomi" },
        { "@type": "City", name: "Espoo" },
        { "@type": "City", name: "Helsinki" },
        { "@type": "City", name: "Vantaa" },
      ],
      knowsAbout: [
        "lyhytvideotuotanto",
        "TikTok-markkinointi",
        "Instagram Reels",
        "YouTube Shorts",
        "somevideot",
        "sisällöntuotanto",
        "videotuotanto yrityksille",
        "Meta-mainonta",
        "Facebook-mainonta",
        "Instagram-mainonta",
        "hakukoneoptimointi",
        "verkkosivujen suunnittelu",
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://wsmedia.fi/lyhytvideot#sivu",
      url: "https://wsmedia.fi/lyhytvideot",
      name: "Lyhytvideot ja somevideot yrityksille | Espoo | WS Media",
      description:
        "Somevideot ja lyhytvideot yrityksille: suunnittelu, kuvaus ja editointi TikTokiin, Instagram Reelsiin ja YouTube Shortsiin kiinteään kuukausihintaan.",
      inLanguage: "fi-FI",
      isPartOf: { "@id": ORG_ID },
      primaryImageOfPage: OG_IMAGE,
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://wsmedia.fi/lyhytvideot#murupolku",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Etusivu", item: "https://wsmedia.fi/" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Lyhytvideotuotanto",
          item: "https://wsmedia.fi/lyhytvideot",
        },
      ],
    },
    {
      "@type": "Service",
      "@id": "https://wsmedia.fi/lyhytvideot#palvelu",
      name: "Lyhytvideotuotanto yrityksille",
      serviceType: "Lyhytvideotuotanto",
      url: "https://wsmedia.fi/lyhytvideot",
      description:
        "Lyhytvideot ja somevideot yrityksille: suunnittelu, ideointi, käsikirjoitus, kuvaus, editointi, tekstitys ja julkaisu TikTokiin, Instagram Reelsiin, YouTube Shortsiin ja LinkedIniin.",
      provider: { "@id": ORG_ID },
      areaServed: { "@type": "Country", name: "Suomi" },
      audience: { "@type": "BusinessAudience", name: "Pk-yritykset" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Lyhytvideopaketit",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Aloitus",
            description:
              "4 lyhytvideota kuukaudessa, esiintyjä, 1 kuvauspäivä, käsikirjoitus, editointi ja tekstitys.",
            priceCurrency: "EUR",
            price: "1500",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              priceCurrency: "EUR",
              price: "1500",
              valueAddedTaxIncluded: false,
              unitCode: "MON",
            },
          },
          {
            "@type": "Offer",
            name: "Ylläpito",
            description:
              "Aloitus-paketin sisältö sekä Instagram-tarinat, karusellit, kuvajulkaisut ja tilin ylläpito.",
            priceCurrency: "EUR",
            price: "2200",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              priceCurrency: "EUR",
              price: "2200",
              valueAddedTaxIncluded: false,
              unitCode: "MON",
            },
          },
          {
            "@type": "Offer",
            name: "Räätälöity",
            description:
              "Ylläpito-paketin sisältö sekä yhteisjulkaisukumppanien etsiminen, koukkujen testaus, Meta-mainonnan hallinnointi ja videomäärä tarpeen mukaan. Hinta tarjouksen mukaan.",
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://wsmedia.fi/lyhytvideot#ukk",
      mainEntity: FAQ_GROUPS.flatMap((g) =>
        g.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.schema },
        })),
      ),
    },
  ],
};
