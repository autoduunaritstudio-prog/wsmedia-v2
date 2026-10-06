/* Sivun tyylit: generoitu app/globals.css:sta, ks. scripts/tyylit.cjs. */
import "../_tyylit/toihin-meille.css";
import type { Metadata } from "next";

import Footer from "../components/Footer";
import Nav from "../components/Nav";
import NetBackdrop from "../components/NetBackdrop";
import SiteEffects from "../components/SiteEffects";
import { SUBPAGE_FOOTER, OVERLAY_NAV } from "../components/site-data";

import HakemusIkkuna from "./HakemusIkkuna";
import { buildJsonLd } from "./jsonld";
import {
  Hakemus,
  Hero,
  Miksi,
  Nayta,
  Odotukset,
  Prosessi,
  Roolit,
  Tyomalli,
  Tyonkuva,
} from "./sections";
import { Ukk } from "./ukk";
import ToihinMobiili from "./mobiili/Mobiili";

const TITLE = "Töihin WS Medialle | Freelancerit ja tekijät";
const DESCRIPTION =
  "Haemme freelancereita ja osaajia: videokuvaajat, editoijat, kehittäjät, hakukoneoptimoijat ja graafiset suunnittelijat. Toimeksianto tai työsuhde.";

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
 * Rekrytointisivu (5.10.2026). Sama tumma .wsx-ilme kuin palvelusivuilla
 * ja Meista-sivulla: verkostotausta, kuvahero, Kaiku-sanat, kuvakaista,
 * Kenelle-kortit, UKK ja sama lomakeosio. Sivun omat tyylit .page-tm.
 */
export default function ToihinMeille() {
  return (
    <>
    {/* Tyopoydan puu .mo-tyopoyta-kaaressa (display: contents, asettelu ei
        muutu). Puhelinversio on taman JALKEEN, koska tyopoydan skriptit
        hakevat ensimmaisen footerin ja headerin koko dokumentista. */}
    <div className="mo-tyopoyta">
    <div className="page-palvelu page-hakukoneoptimointi page-tm wsx">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />
      <NetBackdrop merkit={false} />
      <div className="rae" aria-hidden="true" />

      <Nav
        anchorBase="/"
        links={OVERLAY_NAV}
        ctaHref="#hakemus"
        ctaLabel="Lähetä hakemus"
        logoHref="/"
      />

      <Hero />
      <Miksi />
      <Roolit />
      <Nayta />
      <Tyomalli />
      <Prosessi />
      <Odotukset />
      <Tyonkuva />
      <Ukk />
      <Hakemus />

      <Footer
        intro="Lyhytvideotuotanto, verkkosivut ja graafinen ilme yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy"
        brandHeading="h2"
      />
      <HakemusIkkuna />
      <SiteEffects />
    </div>
    </div>
    {/* PUHELINVERSIO (6.10.2026): nakyy vain max-width 767px, ks.
        app/components/mobiili/mobiili.css ja app/toihin-meille/mobiili. */}
    <ToihinMobiili />
    </>
  );
}
