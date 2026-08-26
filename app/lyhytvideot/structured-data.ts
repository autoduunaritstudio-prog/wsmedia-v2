import { FAQ_GROUPS } from "./faq-data";

const ORG_ID = "https://wsmedia.fi/#organisaatio";
const OG_IMAGE = "https://wsmedia.fi/og/lyhytvideotuotanto-yrityksille.jpg";

/**
 * Mockupin JSON-LD-graafi. FAQPage-osa kootaan samasta FAQ_GROUPS-datasta
 * kuin nakyva UKK-osio, joten kysymykset eivat paase eriytymaan.
 */
export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": ORG_ID,
      name: "WS Media Oy",
      alternateName: "WS Media",
      url: "https://wsmedia.fi/",
      description:
        "WS Media on espoolainen lyhytvideotuotantoon, verkkosivuihin ja tapahtumiin erikoistunut toimisto.",
      vatID: "FI36150844",
      taxID: "3615084-4",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Espoo",
        addressRegion: "Uusimaa",
        addressCountry: "FI",
      },
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
      name: "Lyhytvideotuotanto yrityksille | TikTok, Reels & Shorts | WS Media",
      description:
        "Lyhytvideotuotanto yrityksille avaimet käteen: strategia, käsikirjoitus, kuvaus ja editointi TikTokiin, Instagram Reelsiin ja YouTube Shortsiin.",
      inLanguage: "fi-FI",
      isPartOf: { "@id": ORG_ID },
      primaryImageOfPage: OG_IMAGE,
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://wsmedia.fi/lyhytvideot#murupolku",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Etusivu", item: "https://wsmedia.fi/" },
        { "@type": "ListItem", position: 2, name: "Palvelut", item: "https://wsmedia.fi/palvelut" },
        {
          "@type": "ListItem",
          position: 3,
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
        "Avaimet käteen -lyhytvideotuotanto yrityksille: lyhytvideostrategia, ideointi, käsikirjoitus, kuvaus, editointi, tekstitys ja alustakohtainen optimointi TikTokiin, Instagram Reelsiin, YouTube Shortsiin ja LinkedIniin.",
      provider: { "@id": ORG_ID },
      areaServed: { "@type": "Country", name: "Suomi" },
      audience: { "@type": "BusinessAudience", name: "Pk-yritykset" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Lyhytvideopaketit",
        itemListElement: [
          {
            "@type": "Offer",
            name: "[Paketti 1]",
            description:
              "[X] lyhytvideota kuukaudessa, 1 kuvauspäivä, optimointi yhdelle kanavalle.",
            priceCurrency: "EUR",
            price: "[HINTA]",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              priceCurrency: "EUR",
              price: "[HINTA]",
              unitCode: "MON",
            },
          },
          {
            "@type": "Offer",
            name: "[Paketti 2]",
            description:
              "[X] lyhytvideota kuukaudessa, monikanavainen optimointi, julkaisu ja kuukausiraportti.",
            priceCurrency: "EUR",
            price: "[HINTA]",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              priceCurrency: "EUR",
              price: "[HINTA]",
              unitCode: "MON",
            },
          },
          {
            "@type": "Offer",
            name: "[Paketti 3]",
            description:
              "[X] lyhytvideota kuukaudessa, useita kuvauspäiviä, TikTok, Reels, Shorts ja LinkedIn sekä maksetun mainonnan hallinnointi.",
            priceCurrency: "EUR",
            price: "[HINTA]",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              priceCurrency: "EUR",
              price: "[HINTA]",
              unitCode: "MON",
            },
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
