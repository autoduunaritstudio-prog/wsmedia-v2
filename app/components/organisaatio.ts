import { SIVUSTO } from "../sivusto";

/**
 * YRITYKSEN PERUSTIEDOT RAKENTEISEEN DATAAN, YHDESSA PAIKASSA.
 *
 * Jokaisella sivulla oli oma kopionsa organisaatiosta: osoite oli vain
 * Meista-sivulla, muilla pelkka "Espoo", ja Yhteystiedot viittasi
 * tietoon jota sivulla ei ollut. Paikallisessa haussa nimi, osoite ja
 * puhelin (NAP) pitaa olla kaikkialla samat kuin Google-profiilissa.
 *
 * Aukioloajat ja sijainti: Google-yritysprofiili, tarkistettu 3.10.2026.
 * Sivukohtaiset kentat (description, knowsAbout, areaServed) lisataan
 * sivun omassa tiedostossa tasman paalle.
 */
export const ORG_ID = `${SIVUSTO}/#organisaatio`;
export const GOOGLE_PROFIILI = "https://www.google.com/maps?cid=17434529617661064987";

export const AUKIOLO = [
  { paivat: "ma–pe", ajat: "9–18" },
  { paivat: "la", ajat: "11–16" },
  { paivat: "su", ajat: "suljettu" },
];

export const ORGANISAATIO = {
  "@type": "ProfessionalService",
  "@id": ORG_ID,
  name: "WS Media Oy",
  alternateName: "WS Media",
  url: SIVUSTO,
  logo: `${SIVUSTO}/apple-touch-icon.png`,
  image: `${SIVUSTO}/kuvat/fx9.webp`,
  telephone: "+358405648770",
  email: "info@wsmedia.fi",
  vatID: "FI36150844",
  taxID: "3615084-4",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kuusiniementie 8 F 3",
    postalCode: "02710",
    addressLocality: "Espoo",
    addressRegion: "Uusimaa",
    addressCountry: "FI",
  },
  geo: { "@type": "GeoCoordinates", latitude: 60.2258403, longitude: 24.7390331 },
  hasMap: GOOGLE_PROFIILI,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "11:00", closes: "16:00" },
  ],
  sameAs: [
    GOOGLE_PROFIILI,
    "https://www.instagram.com/wsmedia.fi/",
    "https://www.tiktok.com/@wsmedia.fi",
    "https://fi.linkedin.com/company/ws-media-oy",
  ],
} as const;
