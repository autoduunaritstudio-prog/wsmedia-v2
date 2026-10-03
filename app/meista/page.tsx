/* Sivun tyylit: generoitu app/globals.css:sta, ks. scripts/tyylit.cjs. */
import "../_tyylit/meista.css";
import type { Metadata } from "next";

import Footer from "../components/Footer";
import Nav from "../components/Nav";
import NetBackdrop from "../components/NetBackdrop";
import Palkki from "../components/Palkki";
import SiteEffects from "../components/SiteEffects";
import { Vaite } from "../components/Maasto";
import { SUBPAGE_FOOTER, OVERLAY_NAV } from "../components/site-data";

import { buildJsonLd } from "./jsonld";
import { Hero, Lyhyesti, Miksi, Tapa, Tarjous, Tiimi } from "./components/sections";

/* HAKUSANAT. Sivu kilpailee paikallisista yleishauista ("mainostoimisto
   espoo", "markkinointitoimisto espoo"), joissa hakutulosten karjessa
   ovat toimistojen Espoo-sivut. Palvelusivut kattavat palvelukohtaiset
   haut, joten Meista-sivun tehtava on yrityshaku ja paikkakunta:
   otsikko, H1 ja ingressi sanovat molemmat. */
const OTSIKKO = "Meistä | Mainostoimisto Espoossa | WS Media";
const KUVAUS =
  "Tutustu WS Median tekijöihin: espoolainen mainostoimisto, jossa lyhytvideot, verkkosivut, hakukoneoptimointi ja graafinen suunnittelu tehdään yhdessä.";

export const metadata: Metadata = {
  title: OTSIKKO,
  description: KUVAUS,
  alternates: { canonical: "https://wsmedia.fi/meista" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: "WS Media",
    url: "https://wsmedia.fi/meista",
    title: OTSIKKO,
    description: KUVAUS,
  },
};

export default function Meista() {
  return (
    <div className="page-palvelu page-hakukoneoptimointi page-meista wsx">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />
      <NetBackdrop merkit={false} />
      <div id="prog" />
      <div className="rae" aria-hidden="true" />

      <Nav anchorBase="/" links={OVERLAY_NAV} ctaHref="#tarjous" ctaLabel="Pyydä tarjous" logoHref="/" />

      <Hero />

      {/* Ei peittoketjua: osiot seuraavat toisiaan tavallisessa virrassa,
          ja kaksi kuvakaistaa toimivat hengahdyksina. */}
      <Miksi />
      <Vaite
        kuva="/kuvat/huoltoasema.webp"
        alla="Asiakkaan tiloissa, autolla tai kadulla. Videot toimitetaan julkaisuvalmiina."
      >
        Kuvaamme siellä, missä <b><i>työ tehdään.</i></b>
      </Vaite>
      <Tiimi />
      <Vaite
        palkkiAlkaa
        kuva="/kuvat/kuvauskeikka.webp"
        alla="Kun yksi tiimi vastaa kaikesta, kukaan ei voi sanoa, että vika on toisen toimittajan päässä."
      >
        Video, sivusto ja mainonta <b><i>samasta paikasta.</i></b>
      </Vaite>
      <Tapa />
      <Lyhyesti />
      <Tarjous />

      <Footer
        intro="Lyhytvideotuotanto, verkkosivut ja graafinen ilme yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy · Y-tunnus 3615084-4 · Espoo"
        brandHeading="h2"
      />

      <Palkki
        otsikko="Maksuton kartoitus"
        selite="Käymme tilanteesi läpi ja kerromme, mikä auttaa. Ei sido mihinkään."
        nappi="Pyydä kartoitus"
      />
      <SiteEffects />
    </div>
  );
}
