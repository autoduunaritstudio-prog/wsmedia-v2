import type { Metadata } from "next";

import NetBackdrop from "../components/NetBackdrop";
import Logos from "../components/Logos";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Palkki from "../components/Palkki";
import SiteEffects from "../components/SiteEffects";
import { OVERLAY_NAV, SUBPAGE_FOOTER } from "../components/site-data";

import Hero from "./components/Hero";
import { buildJsonLd } from "./jsonld";
import { Laatta, Vaite } from "../components/Maasto";
import {
  Hinnoittelu,
  Kenelle,
  Nakyvyys,
  Ongelma,
  Prosessi,
  Sisalto,
  Tarjous,
  Toteutustapa,
  Ukk,
} from "./components/sections";

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

export default function Verkkosivut() {
  return (
    <div className="page-palvelu page-verkkosivut wsx">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />

      {/* SAMA KUVAKIELI KUIN HAKUKONEOPTIMOINTISIVULLA, EI SAMA SIVU.
          .wsx on sivuston kuvakielen nimiavaruus: rae, ylisuuret
          aariviivasanat, taysleveat valokuvat, pinottu vieritys ja
          porrastuvat rivit tulevat sielta molemmille sivuille samasta
          toteutuksesta. Ero tehdaan rytmilla, kuva-aiheilla ja
          artefakteilla, ei tyylilla.

          Metallikuvio poistui. Se oli vaalealle pohjalle piirretty
          kuvio, ja tumma sivu tekee siita likaisen harmaan verkon
          jonka lapi valokuvat eivat lue. Sivun pohja on nyt
          yhtenainen ja valo tulee kuvista. */}
      {/* SIVUTASON VERKOSTO. Sama kerros ja sama paikka kuin
          Lyhytvideot-alasivulla: yksi verkosto koko sivulle, ei viitta
          osiokohtaista. Osiokohtaiset kerrokset alkoivat ja loppuivat
          osion mukana, joten kuvio katkesi jokaisella rajalla, ja ne
          osiot joilla kerrosta ei ollut lukivat tyhjina. */}
      <NetBackdrop merkit={false} />

      <div className="rae" aria-hidden="true" />
      <div id="prog" />

      <Nav
        anchorBase="/"
        links={OVERLAY_NAV}
        ctaHref="#tarjous"
        ctaLabel="Pyydä tarjous"
        logoHref="/"
      />

      {/* PINNATTU HERO JA PEITTAVA COVER, sama tekniikka kuin
          etusivulla. Hero jaa kiinni nakyman ylareunaan, sen tausta
          rakentuu vierityksen mukana loppuun asti, ja vasta sen
          jalkeen cover liukuu sen paalle. Pari ja sen cover ovat saman
          kaareen lapsia: se on ehto jonka rikkominen kaataa
          pinnauksen aanettomasti.

          Coverin ylareunassa on asiakaslogonauha: ensimmainen asia
          joka nousee heron paalle on todiste, ei uusi myyntilause. */}
      <div className="stickysub">
        <Hero />
        <div className="cover">
          <NetBackdrop mount="cover" />
          <Logos />

      {/* ENSIMMAINEN PINO. Tuttu tilanne jaa alle, hengahdys nousee sen
          paalle ja palvelun sisalto nousee hengahdyksen paalle.
          Lause oli aiemmin neljannen kortin leipatekstissa SANATARKASTI
          samassa muodossa, eli sivu sanoi saman kahdesti kolmen
          ruudun valein. Nyt lause on vain taalla ja kortti jatkaa
          siita eteenpain. */}
      <div className="pino">
        <Ongelma />

        <div className="pino">
          <Vaite
            kuva="/verkkosivut/tila.webp"
            alla="Sivusto on useimmiten ensimmäinen kohtaaminen, ja se tapahtuu ennen kuin kukaan ehtii kertoa mitään."
          >
            Moni yritys on selvästi parempi kuin miltä se <b><i>verkossa näyttää.</i></b>
          </Vaite>

          <div className="pino">
            <Sisalto />

            <Toteutustapa />
          </div>
        </div>
      </div>

      <Nakyvyys />

      {/* HENGAHDYS SIIRTYI PROSESSIN ETEEN.
          Kuva on kasi piirtamassa rautalankamallia lampun alla ja
          lause on prosessin ensimmaisesta askeleesta, mutta molemmat
          olivat kolme osiota ennen Prosessia, Sisallon ja
          Toteutustavan valissa. Hengahdys kertoo mita seuraavaksi
          tulee, joten se kuuluu sen osion eteen josta se puhuu.
          Kick "Prosessi" jaa pois: osion nimi on sivukiskossa heti
          taman alla. */}
      <div className="pino">
        <Laatta kuva="/verkkosivut/kartoitus.webp" korkeus="taysi">
          <p className="laatta-lause suuri">
            Et tarvitse mitään <b><i>valmiiksi.</i></b>
          </p>
          <p className="laatta-alla">
            Tekstit, kuvat ja rakenne ovat osa toteutusta, eivät sen edellytys.
          </p>
        </Laatta>

        <Prosessi />
      </div>

      {/* KOLMAS PINO. Tulokset-osio poistettiin: sen luvut olivat
          lupauksia joiden takana ei ole yhtaan mitattua asiakastyota,
          ja sivulla on jo kaksi kohtaa jotka sanovat saman ilman
          numeroa. Hengahdys jaa alle ja hinnasto nousee sen paalle,
          eli pino on nyt kaksiosainen kuten kaksi muutakin. */}
      <div className="pino">
        <Vaite
          kuva="/verkkosivut/naytto.webp"
          alla="Hinta päätetään ennen kuin työ alkaa, eikä se perustu arvioon käytetyistä tunneista vaan sivumäärään ja sisällön laajuuteen."
        >
          Emme kilpaile hinnalla vaan sillä, että sivusto <b><i>löytyy ja myy.</i></b>
        </Vaite>

        <Hinnoittelu />
      </div>

      <Kenelle />
      <Ukk />
      <Tarjous />
        </div>
      </div>

      <Footer
        intro="Lyhytvideot, verkkosivut ja graafinen ilme yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy · Y-tunnus 3615084-4 · Espoo"
        brandHeading="h2"
      />

      <Palkki />
      <SiteEffects />
    </div>
  );
}
