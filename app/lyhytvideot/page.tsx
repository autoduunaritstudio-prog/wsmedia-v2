
import type { Metadata } from "next";

import NetBackdrop from "../components/NetBackdrop";
import BudgetForm from "../components/BudgetForm";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SiteEffects from "../components/SiteEffects";
import Logos from "../components/Logos";
import StatBand from "../components/StatBand";
import TeamPlaceholder from "../components/TeamPlaceholder";
import { SUBPAGE_FOOTER, OVERLAY_NAV } from "../components/site-data";

import Hero from "./components/Hero";
import { Alustat, Kokonaisuus, Miksi, Prosessi, Tulokset } from "./components/sections";
import {
  Alueet,
  Blogi,
  Hinnoittelu,
  Kaytannossa,
  Kenelle,
  Ukk,
} from "./components/sections2";
import { structuredData } from "./structured-data";

const TITLE = "Lyhytvideotuotanto yrityksille | TikTok, Reels & Shorts | WS Media";
const DESCRIPTION =
  "Lyhytvideotuotanto yrityksille avaimet käteen: strategia, käsikirjoitus, kuvaus ja editointi TikTokiin, Instagram Reelsiin ja YouTube Shortsiin. Kiinteä kuukausihinta, ei pitkiä sopimuksia. Espoo, Helsinki ja koko Suomi.";
const OG_IMAGE = "https://wsmedia.fi/og/lyhytvideotuotanto-yrityksille.jpg";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: "WS Media Oy" }],
  alternates: { canonical: "https://wsmedia.fi/lyhytvideot" },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: "WS Media",
    url: "https://wsmedia.fi/lyhytvideot",
    title: TITLE,
    description:
      "Lyhytvideot yrityksille avaimet käteen: strategia, käsikirjoitus, kuvaus ja editointi. Kiinteä kuukausihinta, ei pitkiä sopimuksia.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "WS Media – lyhytvideotuotanto yrityksille TikTokiin, Instagram Reelsiin ja YouTube Shortsiin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyhytvideotuotanto yrityksille | WS Media",
    description:
      "TikTok, Instagram Reels ja YouTube Shorts avaimet käteen. Kiinteä kuukausihinta, ei pitkiä sopimuksia.",
    images: [OG_IMAGE],
  },
  other: {
    "geo.region": "FI-18",
    "geo.placename": "Espoo",
  },
};

export const viewport = { themeColor: "#ffffff" };

/* SAMAT LUVUT KUIN ETUSIVUN REFERENSSIOSIOSSA (app/page.tsx STATS).
   Nama ovat yrityksen lukuja, eivat taman sivun lukuja, joten kahta eri
   arvoa samasta asiasta ei saa olla olemassa: jos etusivu sanoo 150+ ja
   alasivu jotain muuta, toinen on vaara. Kun luvut paivitetaan,
   molemmat paikat on paivitettava yhdessa.

   \u00A0 = sitomaton valilyonti: tuhaterotin ei saa katketa riville jos
   sarake kapenee. */
const STATS = [
  { value: "150+", label: "toteutettua projektia" },
  { value: "5\u00A0000\u00A0000+", label: "katselukertaa yhteensä" },
  { value: "8", label: "arkipäivää keskim. toimitusaika" },
  { value: "4,8/5", label: "keskiarvosana asiakkailta" },
];

export default function Lyhytvideot() {
  return (
    <div className="page-palvelu page-lyhytvideot page-dark">
      {/* Vaalea metallitausta vaihtui elavaan verkostoon; ks. NetBackdrop. */}
      <NetBackdrop />
      <div id="prog" />

      <Nav
        anchorBase="/"
        links={OVERLAY_NAV}
        ctaHref="#tarjous"
        ctaLabel="Pyydä tarjous"
        logoHref="/"
      />

      {/* PINNATTU HERO JA PEITTAVA COVER, sama periaate kuin etusivulla:
          hero jaa kiinni nakyman ylareunaan ja cover liukuu sen paalle
          natiivilla sticky-kaytoksella. Pari ja sen cover ovat saman
          kaareen lapsia - se on ehto jonka rikkominen kaataa pinnauksen.

          Coverin ylareunassa on sama asiakaslogonauha kuin etusivulla:
          se on ensimmainen asia joka nousee heron paalle, eli mockupien
          jalkeen tulee heti todiste siita kenelle niita on tehty.

          OMA LUOKKA, ei .stickyzone: se on etusivun luokka, ja sen
          saannot sitovat heron vaiheistuksen HeroScrubin --st1..3
          -muuttujiin. Talla sivulla scrubia ei ole, joten h1 olisi
          jaanyt varasyottoon opacity: 0 eli nakymattomaksi. */}
      <div className="stickysub">
        <Hero />
        <div className="cover">
          {/* Sama verkosto kuin herossa, tummana. Cover on
              lapinakymaton, joten heron takana oleva kerros ei nay sen
              lapi - kuvio on toistettava taalla omana kerroksenaan. */}
          <NetBackdrop mount="cover" />
          <Logos />

          <section style={{ padding: "64px 0 20px" }}>
            <div className="wrap">
              {/* Numerorullaus paalle: luvut ovat nyt oikeita, ja
                  referenssiosiossa etusivulla ne rullaavat samoin. */}
              <StatBand stats={STATS} />
            </div>
          </section>

          <Miksi />
          {/* Kolme kuvanauhaa perakkain: Kanavat, Prosessi ja
              Kokonaisuus. Sama rakenne toistuu, ja juuri toisto tekee
              osioiden vaihdoista rytmin sen sijaan etta jokainen olisi
              oma keksintonsa. Jarjestys on myos sisallon jarjestys:
              missa nakya, miten se tehdaan, mita siita kokonaisuutena
              saa. */}
          <Alustat />
          <Prosessi />
          <Kokonaisuus />
          <Tulokset />
          <Hinnoittelu />
          <Kenelle />
          <Alueet />
          <Ukk />
          <Kaytannossa />
          <Blogi />

          {/* YKSI CTA KAHDEN SIJAAN. Sivulla oli aiemmin lomakeosio ja heti
          sen perassa .final-lohko, jonka ainoa nappi osoitti takaisin
          samaan lomakkeeseen muutaman sadan pikselin paahan. Nyt
          paatosotsikko ja lomake ovat samassa osiossa, ja rakenne on sama
          kuin etusivun CTA:ssa: kuva vasemmalla, lomake oikealla.

          id="tarjous" sailyy, koska navin CTA, heron nappi ja sivun
          sisaiset linkit osoittavat siihen. .wrap eika .wrap-n: kahdelle
          palstalle 820px ei riita. */}
          <section id="tarjous" style={{ paddingTop: "20px" }}>
            <div className="wrap">
              <div className="shead center rv" data-par="0.03">
                <h2>
                  Valmis aloittamaan <span className="accent">lyhytvideotuotannon?</span>
                </h2>
                <p className="sub">
                  Vastaamme 24 tunnin sisällä ja kerromme suoraan mitä ehdotamme ja mitä se maksaa.
                </p>
              </div>
              <div className="ctasplit">
                <TeamPlaceholder />
                <BudgetForm
                  budgetLabel="Budjetti kuukaudessa"
                  messageLabel="Mitä tavoittelet lyhytvideoilla?"
                  note="Ei sitoumuksia."
                  tilt="-y"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer
        intro="Lyhytvideotuotanto, verkkosivut ja graafinen ilme yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy · Y-tunnus 3615084-4 · Espoo"
        brandHeading="h2"
      />

      <SiteEffects />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
