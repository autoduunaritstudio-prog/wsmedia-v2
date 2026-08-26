import type { Metadata } from "next";

import Backdrop from "../components/Backdrop";
import Footer from "../components/Footer";
import HeroBrowserStage from "../components/HeroBrowserStage";
import Nav from "../components/Nav";
import SiteEffects from "../components/SiteEffects";
import SmartLink from "../components/SmartLink";
import WordSwap from "../components/WordSwap";
import { SUBPAGE_NAV, VERKKOSIVUT_FOOTER } from "../components/site-data";

import { buildJsonLd } from "./jsonld";
import { Asiakkaat, Nakyvyys, Ongelma, Prosessi, Sisalto, Toteutustapa } from "./sections";
import { Alueet, Blogi, Hinnoittelu, Kenelle, Loppu, Tarjous, Taustaa, Tulokset, Ukk } from "./sections2";

export const metadata: Metadata = {
  title: "Verkkosivut yritykselle | Kotisivujen suunnittelu ja toteutus | WS Media",
  description:
    "Verkkosivut yritykselle avaimet käteen: suunnittelu, tekstit ja tekninen hakukoneoptimointi. Nopeat kotisivut kiinteällä projektihinnalla, ei piilokuluja. Espoo ja koko Suomi.",
  alternates: { canonical: "https://wsmedia.fi/verkkosivut" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: "WS Media",
    url: "https://wsmedia.fi/verkkosivut",
    title: "Verkkosivut yritykselle | Kotisivujen suunnittelu ja toteutus | WS Media",
    description:
      "Verkkosivut yritykselle avaimet käteen: suunnittelu, tekstit ja tekninen hakukoneoptimointi. Kiinteä projektihinta.",
  },
};

/** Heron vaihtuvat lauseet. Vain ensimmainen renderoityy palvelimella, jotta
 *  H1 pysyy hakukoneelle yhtena lauseena. */
const SWAP_WORDS = [
  "löytyvät Googlesta.",
  "latautuvat sekunnissa.",
  "muuttavat kävijät yhteydenotoiksi.",
  "kestävät vuosia.",
];

export default function Verkkosivut() {
  return (
    <div className="page-palvelu page-verkkosivut">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />

      <Backdrop variant="simple" />
      <div id="prog" />

      <Nav
        links={SUBPAGE_NAV.map((l) => ({ ...l, current: l.href === "/verkkosivut" }))}
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
              <SmartLink href="/palvelut">Palvelut</SmartLink>
            </li>
            <li aria-current="page">Verkkosivut</li>
          </ol>
        </nav>
      </div>

      <header className="hero">
        <div className="wrap">
          <p className="kick li d1">Verkkosivut yritykselle</p>
          <h1 className="li d2" data-par="0.05">
            Verkkosivut yritykselle, jotka
            <br />
            <WordSwap words={SWAP_WORDS} deferToClient />
          </h1>
          <p className="sub li d3" data-par="0.035">
            Verkkosivujen suunnittelu ja toteutus avaimet käteen: sivurakenne, tekstit, tekninen
            hakukoneoptimointi ja julkaisu. Perussivustosta täysin räätälöityyn toteutukseen —
            kiinteällä projektihinnalla.
          </p>
          <div className="heroctas li d4" data-par="0.025">
            <a className="btn mag" href="#tarjous">
              Pyydä tarjous
            </a>
            <a className="tlink" href="#hinnoittelu">
              Katso mitä verkkosivut maksavat
            </a>
          </div>
          <p className="herotrust li d4">
            <span>
              <i />
              Kiinteä projektihinta, ei piilokuluja
            </span>
            <span>
              <i />
              Valmis 2–4 viikossa
            </span>
            <span>
              <i />
              Espoo · Helsinki · koko Suomi
            </span>
          </p>
        </div>

        <HeroBrowserStage />
      </header>

      <Ongelma />
      <Sisalto />
      <Toteutustapa />
      <Nakyvyys />
      <Prosessi />
      <Tulokset />
      <Asiakkaat />
      <Hinnoittelu />
      <Kenelle />
      <Alueet />
      <Ukk />
      <Taustaa />
      <Blogi />
      <Tarjous />
      <Loppu />

      <Footer
        intro="Lyhytvideot, verkkosivut ja tapahtumat. Espoo ja Helsinki, koko Suomi. Yrityksille jotka haluavat kasvaa."
        columns={VERKKOSIVUT_FOOTER}
        base="© 2026 WS Media Oy · Espoo · Y-tunnus 3615084-4"
      />

      <SiteEffects />
    </div>
  );
}
