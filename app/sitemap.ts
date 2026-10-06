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
 *
 * lastModified POISTETTU (6.10.2026). Se oli kaannoshetki, sama kaikilla
 * sivuilla, eli jokainen julkaisu vaitti kaikkien sivujen muuttuneen.
 * Google lakkaa luottamasta lastmodiin, joka ei vastaa todellisia
 * muutoksia. Kiinteita paivia ei viela kirjoitettu, koska kaikkien
 * sivujen sisalto muuttui samana paivana (puhelinversio ja SEO-korjaukset
 * 6.10.2026), joten ne olisivat kaikki samat. Kun sivujen sisalto alkaa
 * muuttua eri tahtiin, lisaa sivukohtainen kiintea paiva ja paivita se
 * samassa commitissa kuin sisallon muutos.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const sivut: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1, "weekly"],
    ["/lyhytvideot", 0.9, "weekly"],
    ["/verkkosivut", 0.9, "weekly"],
    ["/hakukoneoptimointi", 0.8, "monthly"],
    ["/graafinen-suunnittelu", 0.8, "monthly"],
    ["/meista", 0.6, "monthly"],
    ["/toihin-meille", 0.5, "monthly"],
    ["/yhteystiedot", 0.6, "yearly"],
  ];
  return sivut.map(([polku, priority, changeFrequency]) => ({
    url: `${SIVUSTO}${polku}`,
    changeFrequency,
    priority,
  }));
}
