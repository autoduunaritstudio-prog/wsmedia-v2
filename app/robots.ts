import type { MetadataRoute } from "next";

import { SIVUSTO } from "./sivusto";

/**
 * ROBOTS.TXT PUUTTUI KOKONAAN: /robots.txt palautti 404.
 *
 * Puuttuva robots.txt ei estä indeksointia, mutta se jattaa kaksi asiaa
 * tekematta. Se ei kerro sivustokartan osoitetta, jolloin kartta loytyy
 * vain jos se erikseen ilmoitetaan hakukonsoliin, eika se rajaa mitaan
 * pois. Tama tiedosto hoitaa molemmat.
 *
 * Nextin tiedostokonventio: app/robots.ts palvellaan osoitteessa
 * /robots.txt ilman erillista reititysta.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /* Nextin omat sisaiset polut eivat kuulu hakutuloksiin. Ne
           eivat sinne paatyisi muutenkaan, mutta ilmoitus saastaa
           indeksointibudjettia isolla sivustolla. */
        disallow: ["/_next/", "/api/"],
      },
    ],
    sitemap: `${SIVUSTO}/sitemap.xml`,
    host: SIVUSTO,
  };
}
