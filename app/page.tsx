// Etusivun ainoa taustakerros. Vanha <Backdrop /> (ohuet viivat, pisteet,
// kulmamerkit) poistettiin taalta kun metallikuvio alkoi kattaa coverista
// footeriin; alasivut kayttavat sita yha variant="simple":lla.
import MetalBackdrop from "./components/MetalBackdrop";
import SiteEffects from "./components/SiteEffects";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Logos from "./components/Logos";
import StatBand from "./components/StatBand";
import Services from "./components/Services";
import Refs from "./components/Refs";
import Results from "./components/Results";
import Process from "./components/Process";
import HomeFaq from "./components/HomeFaq";
import Contact from "./components/Contact";
import FinalCta from "./components/FinalCta";
import Footer from "./components/Footer";
import { HOME_FOOTER, OVERLAY_NAV } from "./components/site-data";
import { buildHomeFaqJsonLd } from "./faq-data";

const STATS = [
  { value: "150+", label: "toteutettua projektia" },
  // \u00A0 = sitomaton valilyonti: tuhaterotin ei saa katkaista lukua
  // riville jos sarake kapenee. Aiempi placeholder kaytti tavallista
  // valilyontia, joka olisi voinut katketa.
  { value: "5\u00A0000\u00A0000+", label: "katselukertaa yhteensä" },
  { value: "8", label: "arkipäivää keskim. toimitusaika" },
  { value: "4,8/5", label: "keskiarvosana asiakkailta" },
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
      <div id="prog" />
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
          <MetalBackdrop />
          <Logos />
          <Services />
          <Refs />
          <section className="statband-sec">
            <div className="wrap">
              <StatBand stats={STATS} />
            </div>
          </section>
        </div>
      </div>
      {/* Metallikuvio ulottuu coverista footeriin asti. .cover on
          z-index 2, joten sen sisalla oleva kuviokerros peittaisi nama
          osiot ilman omaa korkeampaa tasoa. */}
      <div className="belowcover">
        <Results />
        <Process />
        <HomeFaq />
        <Contact />
        <FinalCta />
      </div>
      <Footer
        intro="Lyhytvideot, verkkosivut ja tapahtumat. Espoo ja Helsinki. Yrityksille jotka haluavat kasvaa."
        columns={HOME_FOOTER}
        base="© 2026 WS Media Oy · Espoo"
      />
      <SiteEffects />
    </>
  );
}
