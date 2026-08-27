import Backdrop from "./components/Backdrop";
import SiteEffects from "./components/SiteEffects";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Logos from "./components/Logos";
import StatBand from "./components/StatBand";
import Services from "./components/Services";
import Work from "./components/Work";
import Results from "./components/Results";
import Process from "./components/Process";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import FinalCta from "./components/FinalCta";
import Footer from "./components/Footer";
import { HOME_FOOTER, OVERLAY_NAV } from "./components/site-data";

const STATS = [
  { value: "00", label: "toteutettua projektia" },
  { value: "0 000 000+", label: "katselukertaa yhteensä" },
  { value: "00", label: "arkipäivää keskim. toimitusaika" },
  { value: "4,9/5", label: "keskiarvosana asiakkailta" },
];

export default function Home() {
  return (
    <>
      <Backdrop />
      <div id="prog" />
      <Nav links={OVERLAY_NAV.map((l) => ({ ...l, current: l.href === "/" }))} ctaHref="#lomake" ctaLabel="Pyydä tarjous" />
      <Hero />
      <Logos />
      <section style={{ padding: "70px 0 20px" }}>
        <div className="wrap">
          <StatBand stats={STATS} />
        </div>
      </section>
      <Services />
      <Work />
      <Results />
      <Process />
      <Pricing />
      <Contact />
      <FinalCta />
      <Footer
        intro="Lyhytvideot, verkkosivut ja tapahtumat. Espoo ja Helsinki. Yrityksille jotka haluavat kasvaa."
        columns={HOME_FOOTER}
        base="© 2026 WS Media Oy · Espoo"
      />
      <SiteEffects />
    </>
  );
}
