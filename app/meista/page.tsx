/* Sivun tyylit: generoitu app/globals.css:sta, ks. scripts/tyylit.cjs. */
import "../_tyylit/meista.css";
import type { Metadata } from "next";

import Footer from "../components/Footer";
import Logos from "../components/Logos";
import Nav from "../components/Nav";
import NetBackdrop from "../components/NetBackdrop";
import Palkki from "../components/Palkki";
import SiteEffects from "../components/SiteEffects";
import { Vaite } from "../components/Maasto";
import { SUBPAGE_FOOTER, OVERLAY_NAV } from "../components/site-data";

import { buildJsonLd } from "./jsonld";
import { Hero, Lyhyesti, Miksi, Tapa, Tarjous, Tiimi } from "./components/sections";
import MeistaMobiili from "./mobiili/Mobiili";

/* HAKUSANAT. Sivu kilpailee paikallisista yleishauista ("mainostoimisto
   espoo", "markkinointitoimisto espoo"), joissa hakutulosten karjessa
   ovat toimistojen Espoo-sivut. Palvelusivut kattavat palvelukohtaiset
   haut, joten Meista-sivun tehtava on yrityshaku ja paikkakunta:
   H1 ja ingressi sanovat molemmat. Otsikossa ei ole "Mainostoimisto
   Espoossa", koska etusivun otsikko tavoittelee samaa hakua ja kaksi
   sivua kilpailisi siita keskenaan (SEO-tarkistus 6.10.2026, 3.1). */
const OTSIKKO = "Meistä: tekijät ja toimintatapa | WS Media";
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
    <>
    {/* Tyopoydan puu .mo-tyopoyta-kaaressa (display: contents, asettelu ei
        muutu). Puhelinversio on taman JALKEEN, ks. app/meista/mobiili. */}
    <div className="mo-tyopoyta">
    <div className="page-palvelu page-hakukoneoptimointi page-meista wsx">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />
      <NetBackdrop merkit={false} />
      <div className="rae" aria-hidden="true" />

      <Nav anchorBase="/" links={OVERLAY_NAV} ctaHref="#tarjous" ctaLabel="Varaa maksuton kartoitus" logoHref="/" />

      <Hero />
      {/* Asiakkaat logonauhana kuten palvelusivuilla. */}
      <Logos />

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
        base="© 2026 WS Media Oy"
        brandHeading="h2"
      />

      <Palkki
        otsikko="Maksuton kartoitus"
        selite="Käymme tilanteesi läpi ja kerromme, mikä auttaa. Ei sido mihinkään."
        nappi="Varaa kartoitus"
      />
      <SiteEffects />
    </div>
    </div>
    <MeistaMobiili />
    </>
  );
}
