import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

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
     osoitteeseen, ei ketjuja.

     KAUTTAVIIVA. Nextin oma loppukauttaviivan poisto ajetaan ENNEN
     omia ohjauksia, joten /rekry/ teki kaksi hyppya: /rekry/ -> /rekry
     -> /toihin-meille. Siksi oma poisto on kytketty pois
     (skipTrailingSlashRedirect) ja korvattu omalla saannolla listan
     lopussa. Omien ohjausten lahde hyvaksyy loppukauttaviivan (Next
     lisaa regexiin (?:/)?), joten /rekry/ osuu suoraan kohteeseen.

     MIKSI 301 EIKA permanent (308). Vercelin Next-rakentaja
     (@vercel/next, tarkistettu CLI 59.11.2) tunnistaa saannon, jonka
     status on 308 ja Location "/$1", Nextin kauttaviivaohjaukseksi ja
     siirtaa sen reititystaulun ensimmaiseksi (continue: true). Silloin
     tuotannossa olisi taas kaksi hyppya. 301 ei tayta ehtoa, joten saanto
     pysyy paikallaan vanhojen osoitteiden jalkeen (todettu vercel
     buildin .vercel/output/config.json -tiedostosta). Google kasittelee
     301:n ja 308:n samoin. Hinta: muut kauttaviivalliset osoitteet
     saavat 301:n eivatka 308:aa.

     MUUT EROT ENTISEEN:
     - /_next/-polut eivat ohjaudu (omat saannot ohittavat ne aina):
       esim. /_next/static/, /_next/image/ ja /_next/data/.../ eivat saa
       kauttaviivaohjausta vaan menevat suoraan Nextille.
     - Vercelin erikoisreitti /404/ antaa 404:n eika ohjaudu.
     - skipTrailingSlashRedirect tekee asiakaspuolen
       normalizePathTrailingSlashista no-opin: Link-komponentti ei enaa
       poista loppukauttaviivaa hrefista. Sivuston sisaiset linkit on
       kirjoitettu ilman sita, ja niin pitaa jatkossakin.

     Uudet vanhat osoitteet lisataan AINA ennen viimeista saantoa. */
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      { source: "/rekry", destination: "/toihin-meille", permanent: true },
      { source: "/lyhytvideot-yritykselle", destination: "/lyhytvideot", permanent: true },
      /* Nextin oman kauttaviivasaannon korvaaja, pidettava viimeisena.
         statusCode 301 tarkoituksella, ks. yla. */
      { source: "/:path+/", destination: "/:path+", statusCode: 301 },
    ];
  },
};

/* Bottisuoja (Vercel BotID): lisaa haasteskriptin ja sen valityspalvelimen
   uudelleenohjaukset. Ks. app/components/botid.ts ja app/api/bottisuoja.ts. */
export default withBotId(nextConfig);
