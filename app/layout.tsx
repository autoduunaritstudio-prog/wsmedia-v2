import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

import Analytics from "./components/consent/Analytics";
import CookieBanner from "./components/consent/CookieBanner";

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
        {children}
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
