import type { Metadata } from "next";

import Backdrop from "../components/Backdrop";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SiteEffects from "../components/SiteEffects";
import SmartLink from "../components/SmartLink";
import { SUBPAGE_FOOTER, OVERLAY_NAV } from "../components/site-data";

import Stage from "./Stage";
import { buildJsonLd } from "./jsonld";
import { Miksi, Palvelut, Prosessi, Hinta, Tiedostot, Materiaalit } from "./sections";
import { Kenelle, Alueet, Kaytannossa, Blogi, Tarjous, Loppu } from "./sections2";
import { Ukk } from "./ukk";

const TITLE = "Graafinen suunnittelu yritykselle | Yritysilme ja teippaukset | WS Media";
const DESCRIPTION =
  "Graafinen suunnittelu yritykselle avaimet käteen: logo, yritysilme ja ohjeisto sekä teippaukset ja painotuotteet asennettuna. Yksi tarjous, yksi lasku.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://wsmedia.fi/graafinen-suunnittelu" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: "WS Media",
    url: "https://wsmedia.fi/graafinen-suunnittelu",
    title: TITLE,
    description:
      "Logo, yritysilme ja graafinen ohjeisto — sekä käyntikortit, teippaukset ja kyltit valmiiksi asennettuna. Yksi tarjous, yksi lasku.",
  },
};

export default function GraafinenSuunnittelu() {
  return (
    <div className="page-palvelu page-graafinen-suunnittelu">
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
            <li aria-current="page">Graafinen suunnittelu</li>
          </ol>
        </nav>
      </div>

      <header className="hero">
        <div className="wrap">
        <p className="kick li d1">Graafinen suunnittelu yritykselle</p>
        <h1 className="li d2" data-par="0.05">Yksi ilme. <span className="accent">Kaikki pinnat.</span></h1>
        <p className="sub li d3" data-par="0.035">Suunnittelemme logon, värit ja koko yritysilmeen — ja viemme sen käyntikortista pakettiauton kylkeen asti. Sinä et etsi painotaloa etkä teippaajaa: saat yhden tarjouksen, yhden yhteyshenkilön ja yhden laskun.</p>
        <div className="heroctas li d4" data-par="0.025">
        <a className="btn mag" href="#tarjous">Pyydä tarjous</a>
        <a className="tlink" href="#hinta">Laske arvio hinnasta</a>
        </div>
        <p className="herotrust li d4">
        <span><i />Avaimet käteen: suunnittelu, materiaalit ja asennus</span>
        <span><i />Saat alkuperäistiedostot ja täydet oikeudet</span>
        <span><i />Koko Suomi</span>
        </p>
        </div>
        <Stage />
      </header>

      <Miksi />
      <Palvelut />
      <Prosessi />
      <Hinta />
      <Tiedostot />
      <Materiaalit />
      <Kenelle />
      <Alueet />
      <Ukk />
      <Kaytannossa />
      <Blogi />
      <Tarjous />
      <Loppu />

      <Footer
        intro="Graafinen suunnittelu, verkkosivut, lyhytvideot ja tapahtumat. Espoo ja koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy · Espoo"
        brandHeading="h2"
      />
      <SiteEffects />
    </div>
  );
}
