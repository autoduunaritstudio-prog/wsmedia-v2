import type { MetadataRoute } from "next";

import { SIVUSTO } from "./sivusto";

/**
 * SIVUSTOKARTTA PUUTTUI: /sitemap.xml palautti 404.
 *
 * Lista on kasin kirjoitettu eika tiedostojarjestelmasta johdettu, ja
 * se on tarkoitus. Kartta on lupaus siita mita sivustolla on, ja
 * automaattinen luku lupaisi myos sen mika on kesken. Uusi sivu
 * lisataan tahan samalla kun se julkaistaan.
 *
 * priority ja changeFrequency ovat vihjeita joita Google sanoo
 * jattavansa huomiotta, mutta muut hakukoneet lukevat niita, eivatka
 * ne maksa mitaan. Painotus kertoo saman kuin navigaatio: palvelusivut
 * ovat se mita sivustolla myydaan.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const nyt = new Date();
  const sivut: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1, "weekly"],
    ["/lyhytvideot", 0.9, "weekly"],
    ["/verkkosivut", 0.9, "weekly"],
    ["/hakukoneoptimointi", 0.8, "monthly"],
    ["/graafinen-suunnittelu", 0.8, "monthly"],
    ["/toihin-meille", 0.5, "monthly"],
    ["/tietosuoja", 0.3, "yearly"],
  ];
  return sivut.map(([polku, priority, changeFrequency]) => ({
    url: `${SIVUSTO}${polku}`,
    lastModified: nyt,
    changeFrequency,
    priority,
  }));
}
