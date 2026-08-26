import Backdrop from "./components/Backdrop";
import SiteEffects from "./components/SiteEffects";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
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

export default function Home() {
  return (
    <>
      <Backdrop />
      <div id="prog" />
      <Nav />
      <Hero />
      <Marquee />
      <Logos />
      <StatBand />
      <Services />
      <Work />
      <Results />
      <Process />
      <Pricing />
      <Contact />
      <FinalCta />
      <Footer />
      <SiteEffects />
    </>
  );
}
