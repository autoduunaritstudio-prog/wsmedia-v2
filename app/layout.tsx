import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
/* TYYLIT EIVAT TULE TASTA vaan jokainen sivu tuo oman tiedostonsa
   app/_tyylit/-kansiosta, ks. scripts/tyylit.cjs. Lahde on edelleen
   app/globals.css. */

import { SIVUSTO } from "./sivusto";

import Analytics from "./components/consent/Analytics";
import Pehmeavieritys from "./components/Pehmeavieritys";
import Kehotukset from "./components/Kehotukset";
import CookieBanner from "./components/consent/CookieBanner";
import { SUOSTUMUS_ENNEN_PIIRTOA } from "./components/consent/consent";

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
  /* metadataBase puuttui. Ilman sita Next ei muuta generoidun
     jakokuvan suhteellista polkua absoluuttiseksi, ja og:image on
     oltava absoluuttinen jotta jakopalvelut lukevat sen. */
  metadataBase: new URL(SIVUSTO),
  title: "WS Media, etusivu",
  description:
    "Lyhytvideot, verkkosivut ja graafinen ilme samalta tiimiltä. Kiinteä hinta, ei pitkiä sopimuksia.",
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
  /* Perustiedot jakotiedoille (5.10.2026). Sivut, joilla on oma openGraph,
     korvaavat taman kokonaan; tama nakyy vain sivuilla ilman omaa
     (laskutustiedot, tietosuoja), joilta og:type ja og:locale puuttuivat.
     Jakokuva tulee edelleen app/opengraph-image.tsx:sta. */
  openGraph: { type: "website", locale: "fi_FI", siteName: "WS Media" },
  /* iOS Safari muuttaa muuten puhelinnumerot, paivamaarat ja osoitteet
     linkeiksi ennen hydraatiota, mika voi aiheuttaa hydraatioeron
     (ks. consent/CookieBanner.tsx). Linkit tehdaan sivulla itse (tel:). */
  formatDetection: { telephone: false, date: false, address: false, email: false },
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
    /* suppressHydrationWarning: alla oleva skripti lisaa <html>:lle
       data-suostumus-attribuutin ennen Reactin hydraatiota. */
    <html lang="fi" className={instrument.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* EVASTEBANNERI ILMAN VALAHDYSTA (2.10.2026). Banneri on
            palvelimen HTML:ssa, jotta ensikavija nakee sen heti eika vasta
            sivun skriptin kaynnistyttya. Mitattuna se oli etusivun suurin
            elementti (LCP) ja ilmestyi mobiilissa vasta 5 s:n kohdalla.
            Tama skripti ajetaan ennen ensimmaista piirtoa ja piilottaa
            bannerin, jos voimassa oleva suostumus on jo annettu. Ehdot
            samat kuin consent.ts:n readConsent(). */}
        <script dangerouslySetInnerHTML={{ __html: SUOSTUMUS_ENNEN_PIIRTOA }} />
      </head>
      <body>
        {children}
        <Pehmeavieritys />
        <Kehotukset />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
