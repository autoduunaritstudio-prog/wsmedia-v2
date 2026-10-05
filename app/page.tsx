// Etusivun ainoa taustakerros. Vanha <Backdrop /> (ohuet viivat, pisteet,
// kulmamerkit) poistettiin taalta kun metallikuvio alkoi kattaa coverista
// footeriin; alasivut kayttavat sita yha variant="simple":lla.
/* Sivun tyylit: generoitu app/globals.css:sta, ks. scripts/tyylit.cjs. */
import "./_tyylit/perus.css";
import type { Metadata } from "next";
import MetalBackdrop from "./components/MetalBackdrop";
import SiteEffects from "./components/SiteEffects";
import EtuTummennus from "./components/EtuTummennus";
import Palkki from "./components/Palkki";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Logos from "./components/Logos";
import Services from "./components/Services";
import Booking from "./components/Booking";
import Refs from "./components/Refs";
import Results from "./components/Results";
import HomeFaq from "./components/HomeFaq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { HOME_FOOTER, OVERLAY_NAV } from "./components/site-data";
import { buildHomeFaqJsonLd } from "./faq-data";
import { ORG_ID, ORGANISAATIO } from "./components/organisaatio";

/* ETUSIVUN METATIEDOT. Aiemmin etusivu peri juuren oletukset ("WS Media,
   etusivu"), eika sillä ollut canonicalia eika jakotietoja. Otsikko kantaa
   paahakusanan (mainostoimisto Espoo), kuvaus luettelee palvelut. */
const OTSIKKO = "Mainostoimisto Espoo: lyhytvideot ja verkkosivut | WS Media";
const KUVAUS =
  "WS Media on espoolainen mainostoimisto: lyhytvideot, verkkosivut, hakukoneoptimointi ja graafinen suunnittelu samasta tiimistä. Kiinteät hinnat.";

export const metadata: Metadata = {
  title: OTSIKKO,
  description: KUVAUS,
  alternates: { canonical: "https://wsmedia.fi" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: "WS Media",
    url: "https://wsmedia.fi",
    title: OTSIKKO,
    description: KUVAUS,
  },
};

const STATS = [
  { value: "150+", label: "toteutettua projektia" },
  // \u00A0 = sitomaton valilyonti: tuhaterotin ei saa katkaista lukua
  // riville jos sarake kapenee. Aiempi placeholder kaytti tavallista
  // valilyontia, joka olisi voinut katketa.
  { value: "5\u00A0000\u00A0000+", label: "katselukertaa yhteensä" },
  { value: "8", label: "arkipäivää keskim. toimitusaika" },
  /* 4,8/5 poistettiin: arvosana oli suullista palautetta eika mitattu
     luku. Tilalle YDR:n tulos, jonka Tuomas vahvisti 30.9.2026. */
  { value: "1\u00A0000\u00A0000+", label: "katselukertaa yhdelle asiakkaalle 3 kk:ssa" },
];

export default function Home() {
  return (
    <>
      {/* FAQPage samasta lahteesta kuin nakyva UKK-osio (app/faq-data.tsx),
          jolloin merkinta ja sisalto eivat paase erkanemaan. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeFaqJsonLd()) }}
      />
      {/* Yritys ja sivusto: sama organisaatiosolmu kuin muilla sivuilla. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                ...ORGANISAATIO,
                description:
                  "Espoolainen mainostoimisto: lyhytvideot, verkkosivut, hakukoneoptimointi ja graafinen suunnittelu yrityksille.",
                areaServed: { "@type": "Country", name: "Suomi" },
              },
              {
                "@type": "WebSite",
                "@id": "https://wsmedia.fi/#sivusto",
                url: "https://wsmedia.fi",
                name: "WS Media",
                inLanguage: "fi-FI",
                publisher: { "@id": ORG_ID },
              },
            ],
          }),
        }}
      />
      <Nav links={OVERLAY_NAV.map((l) => ({ ...l, current: l.href === "/" }))} ctaHref="#lomake" ctaLabel="Pyydä tarjous" />
      {/* Sticky hero + nouseva cover. Hero pysyy kiinnitettyna ruudun
          ylareunaan ja cover liukuu sen paalle natiivilla sticky-kaytoksella;
          JS hoitaa vain tummennuksen voimakkuuden. Vyohyke paattyy coverin
          loppuun, jolloin hero irtoaa - siihen mennessa se on jo kokonaan
          peitossa. Cover ulottuu Palvelut-osion loppuun asti, koska sen on
          oltava vahintaan heron korkuinen (ks. .cover globals.css:ssa). */}
      <div className="stickyzone">
        <Hero />
        <div className="cover">
          {/* Metallikuvio vain coverin alueella: hero jaa omalle
              taustalleen, ja kuvio kulkee logonauhasta lukukaistan
              loppuun. */}
          <MetalBackdrop variant="verkko" />
          <Logos />
          <Services />
        </div>
      </div>
      {/* Toinen ja kolmas sticky+cover-pari. .refzone on .coverin ULKOPUOLELLA
          ja omalla tasollaan, koska Referenssit tarvitsee coverikseen kaiken
          sen jalkeisen sisallon - sticky-elementti ja sen cover on oltava
          saman kaareen lapsia. Lukukaista ja Tulokset menevat .aftercoveriin
          eli Referenssien coveriksi. */}
      <Refs stats={STATS}>
        <Booking />
        <Results />
      </Refs>
      {/* Naiden alta metallikuvio nakyy taas: .aftercover oli viimeinen
          lapinakymaton lohko. z-index 3 nostaa nama .coverin sisalla olevan
          kuviokerroksen ylapuolelle. */}
      <div className="belowcover">
        <HomeFaq />
        <Contact />
      </div>
      <Footer
        intro="Lyhytvideot, verkkosivut ja graafinen ilme. Espoo ja Helsinki. Yrityksille jotka haluavat kasvaa."
        columns={HOME_FOOTER}
        base="© 2026 WS Media Oy"
        tumma
      />
      {/* Pysyva kehotuspainike oikeassa alakulmassa kuten palvelusivuilla. */}
      <Palkki
        otsikko="Maksuton kartoitus"
        selite="Käymme tilanteesi läpi ja kerromme, mikä auttaa. Ei sido mihinkään."
        nappi="Varaa kartoitus"
      />
      <SiteEffects />
      <EtuTummennus />
    </>
  );
}
