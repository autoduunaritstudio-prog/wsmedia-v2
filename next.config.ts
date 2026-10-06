import type { NextConfig } from "next";

/* Sivukohtaiset tyylitiedostot tuotetaan app/globals.css:sta ennen
   kaannosta ja kehityspalvelimen alussa; kehityspalvelimen aikana
   globals.css:n muutos tuottaa ne uudelleen. Ks. scripts/tyylit.cjs. */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tyylit = require("./scripts/tyylit.cjs");
tyylit.generoi();
if (process.env.NODE_ENV !== "production") tyylit.seuraa();

const nextConfig: NextConfig = {
  /* 404 ohittaa layoutin, ks. app/global-not-found.tsx. */
  experimental: { globalNotFound: true },
  images: {
    /* Next 16 muutti oletuksen: images.qualities on nyt [75], ja
       quality-proppi joka ei ole listalla PAKOTETAAN lahimpaan
       sallittuun - hiljaa, ilman buildvirhetta.

       Case-korttien kuvat on viety q88:lla ja niiden SSIM lahteeseen on
       0,9838. Optimoijan oletus q75 pudottaisi sen 0,9585:een eli alle
       projektin rajan 0,975 (mitattu: sharp, sama kutsu kuin
       image-optimizer.js).

       Tama on pelkka SALLITTUJEN arvojen lista, ei laadunkorotus: yksikaan
       muu <Image> ei aseta quality-proppia, joten ne kayttavat edelleen
       oletusta 75 eika yhdenkaan muun kuvan paino muutu. */
    qualities: [75, 88],
  },
  /* Vanhan sivuston osoitteet, jotka ovat yha Googlen indeksissa
     (site:wsmedia.fi 6.10.2026). permanent: true antaa 308:n, jonka
     Google kasittelee kuten 301:n. Yksi hyppy suoraan lopulliseen
     osoitteeseen, ei ketjuja. */
  async redirects() {
    return [
      { source: "/rekry", destination: "/toihin-meille", permanent: true },
      { source: "/lyhytvideot-yritykselle", destination: "/lyhytvideot", permanent: true },
    ];
  },
};

export default nextConfig;
