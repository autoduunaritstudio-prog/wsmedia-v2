import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WS Media, etusivu",
  description:
    "Lyhytvideot, verkkosivut ja tapahtumat samalta tiimiltä. Kiinteä hinta, ei pitkiä sopimuksia.",
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
      <body>{children}</body>
    </html>
  );
}
