import type { Metadata } from "next";

import Backdrop from "../components/Backdrop";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SiteEffects from "../components/SiteEffects";
import SmartLink from "../components/SmartLink";
import { SUBPAGE_FOOTER, OVERLAY_NAV } from "../components/site-data";

import ApplicationForm from "./ApplicationForm";
import { buildJsonLd } from "./jsonld";
import { Miksi, Roolit, ValiCta, Tyomalli, Prosessi, Odotukset, Tyonkuva } from "./sections";
import { Ukk } from "./ukk";

const TITLE = "Töihin WS Medialle | Avoin haku freelancereille ja tekijöille";
const DESCRIPTION =
  "Haemme jatkuvasti freelancereita ja osaajia: videokuvaajat, editoijat, kehittäjät, hakukoneoptimoijat, graafiset suunnittelijat ja asentajat. Toimeksianto tai työsuhde, koko Suomi.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://wsmedia.fi/toihin-meille" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: "WS Media",
    url: "https://wsmedia.fi/toihin-meille",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/**
 * Rekrytointisivu. EI .page-palvelu-kerroksessa: se on palvelusivujen
 * yhteinen kerros, eika tama sivu myy palvelua asiakkaalle. Sivutyyppi on
 * itsenainen samaan tapaan kuin /tietosuoja.
 */
export default function ToihinMeille() {
  return (
    <div className="page-toihin-meille">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />

      <Backdrop variant="simple" />
      <div id="prog" />
      <Nav
        anchorBase="/"
        links={OVERLAY_NAV}
        ctaHref="#hakemus"
        ctaLabel="Lähetä hakemus"
        logoHref="/"
      />

      <div className="wrap crumbs">
        <nav aria-label="Murupolku">
          <ol>
            <li>
              <SmartLink href="/">Etusivu</SmartLink>
            </li>
            <li aria-current="page">Töihin meille</li>
          </ol>
        </nav>
      </div>

      <header className="hero">
      <div className="wrap">
      <p className="kick li d1">Avoin haku</p>
      <h1 className="li d2" data-par="0.05">Töihin <span className="accent">WS Medialle</span></h1>
      <p className="sub li d3" data-par="0.035">Teemme lyhytvideoita, verkkosivuja, hakukoneoptimointia ja yritysilmeitä — usein samalle asiakkaalle samaan aikaan. Siksi etsimme jatkuvasti tekijöitä, jotka osaavat oman kapean alansa erittäin hyvin. Töitä voi tehdä freelancerina laskutuksella tai työsuhteessa.</p>
      <div className="heroctas li d4" data-par="0.025">
      <a className="btn mag" href="#hakemus">Jätä avoin hakemus</a>
      <a className="tlink" href="#roolit">Katso keitä etsimme</a>
      </div>
      <p className="herotrust li d4">
      <span><i />Toimeksianto tai työsuhde</span>
      <span><i />Etätyö, koko Suomi</span>
      <span><i />Vastaamme viikon sisällä</span>
      </p>
      </div>

      <div className="cluster li d5" data-par="-0.02" aria-label="Rooleja joihin haemme tekijöitä">
      <span className="rchip"><em>▶</em>Videokuvaaja</span>
      <span className="rchip"><em>✂</em>Editoija</span>
      <span className="rchip"><em>✦</em>Motion designer</span>
      <span className="rchip"><em>&lt;/&gt;</em>Next.js-kehittäjä</span>
      <span className="rchip"><em>W</em>WordPress-kehittäjä</span>
      <span className="rchip"><em>↑</em>Hakukoneoptimoija</span>
      <span className="rchip"><em>◆</em>Graafinen suunnittelija</span>
      <span className="rchip"><em>▬</em>Teippausasentaja</span>
      </div>
      </header>

      <Miksi />
      <Roolit />
      <ValiCta />
      <Tyomalli />
      <Prosessi />
      <Odotukset />
      <Tyonkuva />
      <Ukk />
      <ApplicationForm />

      <Footer
        intro="Lyhytvideot, verkkosivut, graafinen suunnittelu ja tapahtumat. Espoo ja koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy · Espoo"
        brandHeading="h2"
      />
      <SiteEffects />
    </div>
  );
}
