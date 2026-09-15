import type { Metadata } from "next";

import Logos from "../components/Logos";
import MetalBackdrop from "../components/MetalBackdrop";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SiteEffects from "../components/SiteEffects";
import StatBand from "../components/StatBand";
import { OVERLAY_NAV, VERKKOSIVUT_FOOTER } from "../components/site-data";

import Hero from "./components/Hero";
import { buildJsonLd } from "./jsonld";
import { Asiakkaat, Nakyvyys, Ongelma, Prosessi, Sisalto, Toteutustapa } from "./sections";
import { Alueet, Hinnoittelu, Kenelle, Tarjous, Tulokset, Ukk } from "./sections2";

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

/* SAMAT LUVUT KUIN ETUSIVULLA (app/page.tsx STATS). Nama ovat yrityksen
   lukuja, eivat taman sivun lukuja, joten kahta eri arvoa samasta
   asiasta ei saa olla olemassa. Kun luvut paivitetaan, molemmat paikat
   on paivitettava yhdessa.

   \u00A0 = sitomaton valilyonti: tuhaterotin ei saa katketa riville. */
const STATS = [
  { value: "150+", label: "toteutettua projektia" },
  { value: "5\u00A0000\u00A0000+", label: "katselukertaa yhteensä" },
  { value: "8", label: "arkipäivää keskim. toimitusaika" },
  { value: "4,8/5", label: "keskiarvosana asiakkailta" },
];

export default function Verkkosivut() {
  return (
    <div className="page-palvelu page-verkkosivut">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />

      {/* ETUSIVUN TAUSTAKUVIO, EI OMAA. Sivu kaytti aiemmin
          <Backdrop variant="simple" />:a, joka ei esiinny etusivulla
          lainkaan, joten alasivu luki eri sivustona. Metallikuvio on
          etusivun tunnus ja se tuodaan tanne sellaisenaan: sama kuvio,
          sama kirkas aukko keskella, sama SiteEffectsin ohjaama liike. */}
      <MetalBackdrop />
      <div id="prog" />

      <Nav
        anchorBase="/"
        links={OVERLAY_NAV}
        ctaHref="#tarjous"
        ctaLabel="Pyydä tarjous"
        logoHref="/"
      />

      {/* PINNATTU HERO JA PEITTAVA COVER, sama periaate kuin etusivulla ja
          lyhytvideosivulla. Hero jaa kiinni nakyman ylareunaan ja cover
          liukuu sen paalle natiivilla sticky-kaytoksella. Pari ja sen
          cover ovat saman kaareen lapsia, se on ehto jonka rikkominen
          kaataa pinnauksen.

          Coverin ylareunassa on sama asiakaslogonauha ja sama lukukaista
          kuin etusivulla: ensimmainen asia joka nousee heron paalle on
          todiste, ei uusi myyntilause.

          Murupolku poistui virrasta kokonaan. Se oli 33px korkea rivi
          heron ylapuolella, ja pinnatun heron kanssa se olisi jaanyt
          navin ja heron valiin omaksi kaistakseen. BreadcrumbList-
          merkinta sailyy jsonld.ts:ssa, eli hakukone saa polun yha. */}
      <div className="stickysub">
        <Hero />
        <div className="cover">
          <MetalBackdrop />
          <Logos />

          <section style={{ padding: "64px 0 20px" }}>
            <div className="wrap">
              <StatBand stats={STATS} />
            </div>
          </section>

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
          {/* YKSI CTA KAHDEN SIJAAN. Sivun lopussa oli <Loppu />, jonka
              ainoa nappi osoitti takaisin samaan lomakkeeseen muutaman
              sadan pikselin paahan. Kaksi pyyntoa samaan kohteeseen on
              pelkkaa valinnan vaivaa, joten paatosotsikko ja lomake ovat
              nyt samassa osiossa, kuten lyhytvideosivulla.

              Blogi ja Taustaa ovat pois toistaiseksi. Blogissa ei ole
              viela tarpeeksi sisaltoa, ja Taustaa oli 1059px hakukonetta
              varten kirjoitettua toistoa asioista jotka sivu on jo
              sanonut. Molempien koodi sailyy sections2.tsx:ssa. */}
          <Tarjous />
        </div>
      </div>

      <Footer
        intro="Lyhytvideot, verkkosivut ja graafinen ilme. Espoo ja Helsinki, koko Suomi. Yrityksille jotka haluavat kasvaa."
        columns={VERKKOSIVUT_FOOTER}
        base="© 2026 WS Media Oy · Espoo · Y-tunnus 3615084-4"
      />

      <SiteEffects />
    </div>
  );
}
