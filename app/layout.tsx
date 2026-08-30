import type { CSSProperties } from "react";
import { ViewTransition } from "react";
import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

import Analytics from "./components/consent/Analytics";
import SmoothScroll from "./components/SmoothScroll";
import CookieBanner from "./components/consent/CookieBanner";

/* Ruudukon mitat. Suurin porrastus on (COLS - 1 + ROWS - 1) askelta, mika
   yhdessa globals.css:n --vt-stepin kanssa maaraa siirtyman kokonaiskeston. */
const PAGEGRID_COLS = 6;
const PAGEGRID_ROWS = 4;

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Ikonit ja manifesti on maaritelty tassa juuren metadatassa, jolloin ne
 * periytyvat kaikille viidelle sivulle. Yksikaan alasivu ei maarita omaa
 * icons- tai manifest-kenttaa, joten kilpailevaa maaritysta ei synny.
 *
 * Tiedostot ovat public/-kansiossa ja viittaukset kirjoitetaan tassa
 * eksplisiittisesti. Vaihtoehto olisi Nextin app/-tiedostokonventio
 * (app/icon.png, app/apple-icon.png, app/manifest.webmanifest), mutta se
 * vaatisi tiedostojen uudelleennimeamisen. Aiempi app/favicon.ico on
 * poistettu: se olisi tuottanut oman <link rel="icon"> -rivinsa taman
 * rinnalle.
 */
export const metadata: Metadata = {
  title: "WS Media, etusivu",
  description:
    "Lyhytvideot, verkkosivut ja tapahtumat samalta tiimiltä. Kiinteä hinta, ei pitkiä sopimuksia.",
  icons: {
    // .ico ilman sizes-arvoa on yleinen varasija; selain valitsee
    // PNG-versioista sopivimman ilmoitettujen kokojen perusteella.
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /**
     * Fonttimuuttuja html-elementille, ei bodylle. globals.css:n @theme
     * määrittelee --font-sans:in :root-tasolla ja viittaa siinä
     * var(--font-instrument):iin, joten muuttujan on oltava jo :root-tasolla.
     * Bodylla se jäisi näkymättömäksi, koko font-family mitätöityisi ja sivu
     * perisi Tailwindin oletusfonttipinon.
     */
    <html lang="fi" className={instrument.variable}>
      <body>
        <SmoothScroll />
        {/* Sivunvaihtosiirtyma. default="page" antaa siirtymalle
            view-transition-class:in "page", jota globals.css kohdistaa
            ::view-transition-old(.page):lla - sama konventio kuin Nextin
            oppaan .morph ja .nav-forward. Komponentti tulee Reactista,
            ei uusia riippuvuuksia. Siirtyma laukeaa vain
            client-navigoinnissa, joten ensilataus ei animoidu. */}
        <ViewTransition default="page">{children}</ViewTransition>
        {/* Ruudukko-overlay. Pelkkaa merkkausta: animaatio ajetaan
            CSS:sta valitsimella :root:active-view-transition, jonka selain
            asettaa siirtyman ajaksi. 6 x 4 = 24 ruutua, joista jokainen
            tuntee sarakkeensa (--i) ja rivinsa (--j) porrastusta varten. */}
        <div className="pagegrid" aria-hidden="true">
          {Array.from({ length: PAGEGRID_COLS * PAGEGRID_ROWS }, (_, n) => (
            <i
              key={n}
              style={
                {
                  "--i": n % PAGEGRID_COLS,
                  "--j": Math.floor(n / PAGEGRID_COLS),
                } as CSSProperties
              }
            />
          ))}
        </div>
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
