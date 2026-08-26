import SmartLink from "../components/SmartLink";

import type { Metadata } from "next";

import Backdrop from "../components/Backdrop";
import BudgetForm from "../components/BudgetForm";
import Footer from "../components/Footer";
import Marquee from "../components/Marquee";
import Nav from "../components/Nav";
import SiteEffects from "../components/SiteEffects";
import StatBand from "../components/StatBand";
import { SUBPAGE_FOOTER, SUBPAGE_NAV } from "../components/site-data";

import Hero from "./components/Hero";
import { Alustat, Kokonaisuus, Miksi, Prosessi, Sisalto, Tulokset } from "./components/sections";
import {
  Alueet,
  Blogi,
  Hinnoittelu,
  Kaytannossa,
  Kenelle,
  Ukk,
} from "./components/sections2";
import { structuredData } from "./structured-data";

const TITLE = "Lyhytvideotuotanto yrityksille | TikTok, Reels & Shorts | WS Media";
const DESCRIPTION =
  "Lyhytvideotuotanto yrityksille avaimet käteen: strategia, käsikirjoitus, kuvaus ja editointi TikTokiin, Instagram Reelsiin ja YouTube Shortsiin. Kiinteä kuukausihinta, ei pitkiä sopimuksia. Espoo, Helsinki ja koko Suomi.";
const OG_IMAGE = "https://wsmedia.fi/og/lyhytvideotuotanto-yrityksille.jpg";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "WS Media Oy" }],
  alternates: { canonical: "https://wsmedia.fi/lyhytvideot" },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: "WS Media",
    url: "https://wsmedia.fi/lyhytvideot",
    title: TITLE,
    description:
      "Lyhytvideot yrityksille avaimet käteen: strategia, käsikirjoitus, kuvaus ja editointi. Kiinteä kuukausihinta, ei pitkiä sopimuksia.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "WS Media – lyhytvideotuotanto yrityksille TikTokiin, Instagram Reelsiin ja YouTube Shortsiin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyhytvideotuotanto yrityksille | WS Media",
    description:
      "TikTok, Instagram Reels ja YouTube Shorts avaimet käteen. Kiinteä kuukausihinta, ei pitkiä sopimuksia.",
    images: [OG_IMAGE],
  },
  other: {
    "geo.region": "FI-18",
    "geo.placename": "Espoo",
  },
};

export const viewport = { themeColor: "#0071e3" };

const MARQUEE = [
  "Lyhytvideotuotanto",
  "TikTok-videot",
  "Instagram Reels",
  "YouTube Shorts",
  "Somevideot",
  "Meta-mainonta",
  "Hakukoneoptimointi",
  "Editointi",
  "Tekstitys",
];

const STATS = [
  { value: "[LUKU]", label: "tuotettua lyhytvideota" },
  { value: "[LUKU]", label: "näyttökertaa yhteensä" },
  { value: "[X]", label: "arkipäivää toimitusaika" },
  { value: "[X] h", label: "asiakkaan aikaa kuukaudessa" },
];

export default function Lyhytvideot() {
  return (
    <div className="page-lyhytvideot">
      {/* Alasivun mockupissa taustassa ei ole piirtyvia bdP-polkuja. */}
      <Backdrop variant="simple" />
      <div id="prog" />

      <Nav
        links={SUBPAGE_NAV.map((l) => ({ ...l, current: l.href === "/lyhytvideot" }))}
        ctaHref="#tarjous"
        ctaLabel="Pyydä tarjous"
        logoHref="/"
      />

      <div className="wrap crumbs">
        <nav aria-label="Murupolku">
          <ol>
            <li>
              <SmartLink href="/">Etusivu</SmartLink>
            </li>
            <li>
              <SmartLink href="/palvelut">Palvelut</SmartLink>
            </li>
            <li aria-current="page">Lyhytvideotuotanto</li>
          </ol>
        </nav>
      </div>

      <Hero />
      <Marquee items={MARQUEE} />

      <section style={{ padding: "64px 0 20px" }}>
        <div className="wrap">
          {/* Mockupissa luvut ovat placeholdereita, joten numerorullaus on pois. */}
          <StatBand stats={STATS} animate={false} />
        </div>
      </section>

      <Miksi />
      <Sisalto />
      <Alustat />
      <Kokonaisuus />
      <Prosessi />
      <Tulokset />
      <Hinnoittelu />
      <Kenelle />
      <Alueet />
      <Ukk />
      <Kaytannossa />
      <Blogi />

      <section id="tarjous" style={{ paddingTop: "20px" }}>
        <div className="wrap-n">
          <div className="shead center rv" data-par="0.03">
            <span className="kick">Tarjous</span>
            <h2>Kerro budjettisi.</h2>
            <p className="sub">
              Saat räätälöidyn lyhytvideosuunnitelman juuri sinun yrityksellesi, 24 tunnin sisällä ja
              ilmaiseksi.
            </p>
          </div>
          <BudgetForm
            budgetLabel="Budjetti kuukaudessa"
            messageLabel="Mitä tavoittelet lyhytvideoilla?"
          />
        </div>
      </section>

      <section className="final">
        <div className="wrap">
          <h2 className="rv" data-par="0.04">
            Valmis aloittamaan <span className="accent">lyhytvideotuotannon?</span>
          </h2>
          <p className="sub rv">
            Varaa ilmainen 30 minuutin strategiapuhelu. Käymme läpi toimialasi mahdollisuudet
            lyhytvideoissa, ilman sitoumuksia.
          </p>
          <a className="btn rv mag" href="#tarjous">
            Varaa strategiapuhelu
          </a>
        </div>
      </section>

      <Footer
        intro="Lyhytvideotuotanto, verkkosivut ja tapahtumat yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy · Y-tunnus 3615084-4 · Espoo"
        brandHeading="h2"
      />

      <SiteEffects />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
