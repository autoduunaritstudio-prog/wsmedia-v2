import type { Metadata } from "next";

import Backdrop from "../components/Backdrop";
import Footer from "../components/Footer";
import Marquee from "../components/Marquee";
import Nav from "../components/Nav";
import SearchDemo from "../components/SearchDemo";
import SiteEffects from "../components/SiteEffects";
import SmartLink from "../components/SmartLink";
import { SEO_FOOTER, OVERLAY_NAV } from "../components/site-data";

import { buildJsonLd } from "./jsonld";
import { Aikataulu, Mittarit, Nakyvyys, Paikallinen, Sisalto } from "./sections";
import { Blogi, Hinnoittelu, Kenelle, Loppu, Tarjous, Taustaa, Ukk } from "./sections2";

export const metadata: Metadata = {
  title: "Hakukoneoptimointi yritykselle | SEO-palvelut ja hinta | WS Media",
  description:
    "Hakukoneoptimointi yritykselle: tekninen SEO, sisältö ja paikallinen näkyvyys — sekä näkyvyys tekoälyhauissa. Kuukausipaketit alkaen 390 €/kk.",
  alternates: { canonical: "https://wsmedia.fi/hakukoneoptimointi" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: "WS Media",
    url: "https://wsmedia.fi/hakukoneoptimointi",
    title: "Hakukoneoptimointi yritykselle | SEO-palvelut ja hinta | WS Media",
    description:
      "Tekninen SEO, sisältö ja paikallinen näkyvyys — sekä näkyvyys tekoälyhauissa. Kuukausipaketit alkaen 390 €/kk.",
  },
};

const MARQUEE = [
  "Hakukoneoptimointi",
  "SEO-palvelut",
  "Tekninen SEO",
  "Avainsanatutkimus",
  "Paikallinen hakukoneoptimointi",
  "Google-yritysprofiili",
  "Tekoälyhakunäkyvyys",
  "Sisällöntuotanto",
  "Linkkiprofiili",
];

export default function Hakukoneoptimointi() {
  return (
    <div className="page-palvelu page-hakukoneoptimointi">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />

      <Backdrop variant="simple" />
      <div id="prog" />

      <Nav
        anchorBase="/"
        links={OVERLAY_NAV}
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
              <SmartLink href="/#palvelut">Palvelut</SmartLink>
            </li>
            <li aria-current="page">Hakukoneoptimointi</li>
          </ol>
        </nav>
      </div>

      <header className="hero">
        <div className="wrap">
          <p className="kick li d1">Hakukoneoptimointi yritykselle</p>
          <h1 className="li d2" data-par="0.05">
            Löydy silloin, kun asiakas <span className="accent">etsii palvelua.</span>
          </h1>
          <p className="sub li d3" data-par="0.035">
            Tekninen hakukoneoptimointi, sisältö, auktoriteetti ja paikallinen näkyvyys yhdeltä
            tiimiltä — ja sama työ nostaa sinut myös tekoälyhakujen vastauksiin. Kuukausipaketit
            alkaen 390 €/kk.
          </p>
          <div className="heroctas li d4" data-par="0.025">
            <a className="btn mag" href="#tarjous">
              Pyydä maksuton kartoitus
            </a>
            <a className="tlink" href="#hinnoittelu">
              Katso hakukoneoptimoinnin hinta
            </a>
          </div>
          <p className="herotrust li d4">
            <span>
              <i />
              Maksuton kartoitus, vastaus 24 h
            </span>
            <span>
              <i />
              Sovitut mittarit, ei lupauksia sijoituksista
            </span>
            <span>
              <i />
              Espoo · Helsinki · koko Suomi
            </span>
          </p>
        </div>

        <SearchDemo />
      </header>

      <Marquee items={MARQUEE} />

      <Nakyvyys />
      <Sisalto />
      <Aikataulu />
      <Paikallinen />
      <Mittarit />
      <Hinnoittelu />
      <Kenelle />
      <Ukk />
      <Taustaa />
      <Blogi />
      <Tarjous />
      <Loppu />

      <Footer
        intro="Lyhytvideot, verkkosivut, hakukoneoptimointi ja tapahtumat. Espoo ja Helsinki, koko Suomi."
        columns={SEO_FOOTER}
        base="© 2026 WS Media Oy · Espoo · Y-tunnus 3615084-4"
      />

      <SiteEffects />
    </div>
  );
}
