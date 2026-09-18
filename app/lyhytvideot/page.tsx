
import type { CSSProperties } from "react";
import type { Metadata } from "next";

import NetBackdrop from "../components/NetBackdrop";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Palkki from "../components/Palkki";
import SiteEffects from "../components/SiteEffects";
import Logos from "../components/Logos";
import StatBand from "../components/StatBand";
import { SUBPAGE_FOOTER, OVERLAY_NAV } from "../components/site-data";

import Hero from "./components/Hero";
import { Kaytannossa } from "./components/sections2";
import {
  Alustat,
  Jakso,
  Hinnoittelu,
  Kenelle,
  Kokonaisuus,
  Miksi,
  Prosessi,
  Tarjous,
  Tulokset,
  Ukk,
} from "./components/wsx";
import { Laatta, Vaite } from "../components/Maasto";
import { structuredData } from "./structured-data";

const TITLE = "Lyhytvideotuotanto yrityksille | TikTok, Reels & Shorts | WS Media";
/* 220 merkkia oli selvasti pidempi kuin hakutuloksessa nakyva osuus,
   joten loppu katkesi: "Espoo, Helsinki ja koko Suomi" ei nakynyt
   kenellekaan. 155 merkkia mahtuu, ja tarkein jaa alkuun. */
const DESCRIPTION =
  "Lyhytvideot yrityksille avaimet käteen: käsikirjoitus, kuvaus ja editointi TikTokiin, Reelsiin ja Shortsiin. Kiinteä kuukausihinta, ei pitkiä sopimuksia.";
/* OG_IMAGE poistui. Se osoitti tiedostoon jota ei ole olemassa, eli
   jaettu linkki nayttaa rikkinaisen kuvan sijasta ei mitaan. Kuva
   generoidaan nyt kaannoksessa, ks. app/og-kuva.tsx ja taman kansion
   opengraph-image.tsx: Next liittaa sen metadataan itse. */

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyhytvideotuotanto yrityksille | WS Media",
    description:
      "TikTok, Instagram Reels ja YouTube Shorts avaimet käteen. Kiinteä kuukausihinta, ei pitkiä sopimuksia.",
  },
  other: {
    "geo.region": "FI-18",
    "geo.placename": "Espoo",
  },
};

export const viewport = { themeColor: "#ffffff" };

const i = (n: number) => ({ "--i": n }) as CSSProperties;

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
  /* Oli 8 arkipaivaa, kun heron lipuke samassa nakymassa sanoi
     "Toimitettu 7 paivassa". Kaksi lukua samasta asiasta yhdella
     ruudulla lukee virheena, ja lukija uskoo kumman tahansa. */
  { value: "7", label: "päivää keskim. toimitusaika" },
  { value: "4,8/5", label: "keskiarvosana asiakkailta" },
];

export default function Lyhytvideot() {
  return (
    <div className="page-palvelu page-lyhytvideot wsx">
      {/* SIVUTASON VERKOSTO. Tama on se kerros joka renderoi myos
          NetMarksit, eli herossa kelluvat Instagram-, TikTok- ja
          YouTube-merkit. Se jai pois kun sivu siirtyi wsx-ilmeeseen,
          ja sen mukana heron oma liike. mount="fixed" on oletus. */}
      <NetBackdrop />

      {/* RAE. Sama kiintea rakeinen kalvo kuin kahdella muulla
          palvelusivulla: tasainen digitaalinen pinta lukee tyhjana. */}
      <div className="rae" aria-hidden="true" />
      <div id="prog" />

      <Nav
        anchorBase="/"
        links={OVERLAY_NAV}
        ohitaKohde="#paasisalto"
        ctaHref="#tarjous"
        ctaLabel="Pyydä tarjous"
        logoHref="/"
      />

      <div className="stickysub">
        <Hero />
        <div className="cover">
          <NetBackdrop mount="cover" />
          <Logos />

          <section className="seo-sec" style={{ padding: "56px 0 12px" }}>
            <div className="swrap">
              <StatBand stats={STATS} />
            </div>
          </section>

          {/* PINOT, NELJAS VERSIO.
              Kanavat nousee coverina Algoritmi-hengahdyksen paalle.
              Kanavat ja Tehtya tyota ovat SAMAN kaareen sisalla, eli
              niilla on yksi pohja ja yksi katkeamaton kuvio: aiemmin
              molemmilla oli oma verkostokerroksensa omalla
              pistekentallaan, ja kuviointi katkesi niiden valissa.
              Sama kaare Prosessille ja Kokonaisuudelle. */}
          <div className="pino">
            <Miksi />

            <div className="pino">
              {/* Kehotuspalkki alkaa tasta. Ks. Palkki.tsx. */}
              <Vaite
                palkkiAlkaa
                kuva="/lyhytvideot/kuvaaminen.webp"
                alla="Uusi tili voi tavoittaa saman yleisön kuin vakiintunut brändi. Se on pienen yrityksen etu."
              >
                Algoritmi jakaa sisältöä kiinnostuksen, ei <b><i>seuraajamäärän mukaan.</i></b>
              </Vaite>

              <div className="pino">
                <Jakso merkit>
                  <Alustat />
                  <Tulokset />
                </Jakso>

                <div className="pino">
                  <Laatta kuva="/lyhytvideot/kuvauspaiva.webp" korkeus="taysi">
                    <p className="laatta-kick">Kuvauspäivä</p>
                    <p className="laatta-lause suuri">
                      Yksi päivä, <b><i>useita kanavia.</i></b>
                    </p>
                    <p className="laatta-alla">
                      Samasta kuvauspäivästä syntyy sisältö TikTokiin, Reelsiin, Shortsiin ja
                      LinkedIniin. Tuotantokustannus jakautuu monelle kanavalle.
                    </p>
                  </Laatta>

                  <div className="pino">
                    <Jakso>
                      <Prosessi />
                      <Kokonaisuus />
                    </Jakso>

                    <div className="pino">
                      <Vaite
                        kuva="/lyhytvideot/ovi.webp"
                        alla="Ohjaamme katsojan verkkosivuille, yhteydenottolomakkeelle tai myymälään ja mittaamme, mitä siitä seuraa."
                      >
                        Näyttökerrat ovat <b><i>välitavoite.</i></b>
                      </Vaite>

                      <Hinnoittelu />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Kenelle />
          <Ukk />
          <Kaytannossa />
          <Tarjous />
        </div>
      </div>

      <Footer
        intro="Lyhytvideotuotanto, verkkosivut ja graafinen ilme yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy · Y-tunnus 3615084-4 · Espoo"
        brandHeading="h2"
      />

      <Palkki />
      <SiteEffects />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
