/* Sivun tyylit: generoitu app/globals.css:sta, ks. scripts/tyylit.cjs. */
import "../_tyylit/hakukoneoptimointi.css";
import type { Metadata } from "next";

import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Palkki from "../components/Palkki";
import SiteEffects from "../components/SiteEffects";
import { SUBPAGE_FOOTER, OVERLAY_NAV } from "../components/site-data";


import Jakso from "../components/Jakso";
import NetBackdrop from "../components/NetBackdrop";
import Logos from "../components/Logos";
import Hero from "./components/Hero";
import { Vaite } from "../components/Maasto";
import Suotimet from "./components/Suotimet";
import Nakyvyys from "./components/Nakyvyys";
import Sisalto from "./components/Sisalto";
import {
  Hinnoittelu,
  Kenelle,
  Paikallinen,
  Tarjous,
  Ukk,
} from "./components/sections";

import { buildJsonLd } from "./jsonld";
import Toimintaalue from "../components/Toimintaalue";

export const metadata: Metadata = {
  title: "Hakukoneoptimointi yritykselle | SEO-palvelut | WS Media",
  description:
    "Hakukoneoptimointi yritykselle: tekninen SEO, sisältö ja paikallinen näkyvyys, sekä näkyvyys tekoälyhauissa. Kuukausipaketit alkaen 390 €/kk.",
  alternates: { canonical: "https://wsmedia.fi/hakukoneoptimointi" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: "WS Media",
    url: "https://wsmedia.fi/hakukoneoptimointi",
    title: "Hakukoneoptimointi yritykselle | SEO-palvelut | WS Media",
    description:
      "Tekninen SEO, sisältö ja paikallinen näkyvyys, sekä näkyvyys tekoälyhauissa. Kuukausipaketit alkaen 390 €/kk.",
  },
};

export default function Hakukoneoptimointi() {
  return (
    <div className="page-palvelu page-hakukoneoptimointi wsx">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />

      {/* ETUSIVUN TAUSTAKUVIO. Sivu kaytti <Backdrop variant="simple" />:a,
          jota etusivulla ei ole lainkaan. Varimaailman on pysyttava
          etusivun omana, ja pohja on osa varimaailmaa. */}
      {/* Tritonisuodin inline-SVG:na. Safari ei tue ulkoisesta
          tiedostosta viitattua suodinta HTML-elementeilla lainkaan. */}
      <Suotimet />

      {/* SIVUTASON VERKOSTO. Sama kerros ja sama paikka kuin kahdella
          muulla palvelusivulla: yksi verkosto koko sivulle. Ennen
          talla sivulla ei ollut sivutason kerrosta lainkaan, vaan yksi
          osio piti omaansa ja loput olivat paljaalla pohjalla - eli
          kuvio alkoi ja loppui yhden osion mukana. */}
      <NetBackdrop merkit={false} />

      {/* KATSOTTUNA: metallikuvio teki pohjasta likaisen harmaan.
          Etusivulla se toimii, koska siella sen paalla on tumma hero ja
          valkoinen cover jotka rajaavat sen. Talla sivulla se nakyi
          koko matkan viistoina harmaina juovina, ja lopputulos luki
          pesemattomana taustana eika materiaalina. Sivun oma pohja on
          puhdas, ja varit tulevat osioista ja valokuvista. */}

      {/* RAE. Kiintea rakeinen kalvo koko sivun paalla. Tasainen
          digitaalinen pinta lukee tyhjana, rae tekee siita
          materiaalia. Kohina tuotetaan selaimessa, joten mukana ei
          kulje yhtaan tavua kuvadataa. */}
      <div className="rae" aria-hidden="true" />

      <Nav
        anchorBase="/"
        links={OVERLAY_NAV}
        ctaHref="#tarjous"
        ctaLabel="Varaa maksuton kartoitus"
        logoHref="/"
      />

      {/* Murupolku pois virrasta: se oli 33px korkea rivi ylisuuren
          otsikon ylapuolella, ja juuri sen ylapuolella on nyt osion oma
          numerorivi joka tekee saman tyon paremmin. BreadcrumbList-
          merkinta sailyy jsonld.ts:ssa. */}
      {/* HERO JA COVER KUTEN MUILLA PALVELUSIVUILLA (4.10.2026): hero
          pysyy paikallaan, ja kun hakutulos on noussut ykkoseksi, cover
          logonauhoineen nousee sen paalle. Koko loppusivu on coverin
          sisalla. */}
      <div className="hk-pinosto">
      <Hero />
      <div className="cover hk-cover">
        <NetBackdrop mount="cover" />
        <Logos />

      {/* PINO. Osiot nousevat toistensa PAALLE, ja jokainen paalle
          noussut jaa vuorostaan alle kun seuraava nousee.

          MEKANIIKKA on position: sticky; bottom: 0 - ei top. Ero on
          ratkaiseva: top: 0 pinnaisi osion heti kun sen ylareuna osuu
          nakyman ylareunaan, jolloin nakymaa korkeamman osion alaosaa
          ei nakisi koskaan. bottom: 0 antaa osion vierita normaalisti
          kunnes se on KOKONAAN nahty, ja pinnaa vasta sitten.

          KAAREET OVAT SISAKKAIN, EIVAT PERAKKAIN. Kokeilin ensin
          viitta sisarusta yhdessa kaareessa, ja se romahti: kun
          sticky kerran tarttuu, se pysyy kiinni kaareensa loppuun
          asti, joten kolme perakkaista osiota oli nakymassa yhta
          aikaa ja korkein z-index peitti muut. Se ei ollut pino vaan
          kasa.

          Sisakkaisyys korjaa sen, koska jokainen kaare paattyy omaan
          kohtaansa: A vapautuu kun sen kaare loppuu, ja sen kaareen
          sisalla B on jo ehtinyt pinnautua ja vapautua. Samalla
          maalausjarjestys tulee ilmaiseksi DOM-jarjestyksesta:
          sisempi elementti on myohempi, joten se maalautuu ulomman
          paalle ilman yhtaan z-indexia.

          EHTO JOKA RIKKOUTUU AANETTOMASTI: yhdellakaan esivanhemmalla
          ei saa olla overflow: hidden tai clip. */}
      {/* YKSI PEITTOKETJU, HENGAHDYS JOKA TOINEN VAIHE.
          =============================================================
          Ennen: ketju katkesi kahdesti. Ensimmainen pino paattyi
          Aikatauluun, toinen alkoi Mittareista, ja Kenelle, UKK seka
          Tarjous olivat kokonaan pinon ULKOPUOLELLA. Sama sivu teki
          kolmea eri asiaa perakkain, ja juuri se lukee hajonneena.

          Nyt sama rakenne kuin Verkkosivuilla ja Lyhytvideoilla:
          jokainen vaihe nousee edellisen paalle Tarjoukseen asti, ja
          rytmi on raskas vaihe, hengahdys, raskas vaihe.

          JAKSO ON YKSI VAIHE. Palvelun sisalto ja Paikallinen ovat
          saman palvelun kuvaus, Aikataulu ja Mittarit ovat luonteva
          pari (milloin tama nakyy ja mista sen tietaa), ja sivun hanta
          Hinnoittelusta Tarjoukseen on yksi pinta. Kaari ottaa pohjan
          ja verkoston itselleen, joten kuvio ei katkea osioiden
          valissa. */}
      {/* RAKENNE 3.10.2026: yksi B-roll heti alussa ja yksi peitto sen
          paalle. Muut kuvaosiot ja peittokerrokset poistettu: sivu
          etenee tavallisena vierityksena. */}
      {/* 4.10.2026: Vaite nousee coverina Nakyvyyden paalle ja Jakso
          vuorostaan Vaitteen paalle, sama sisakkainen rakenne kuin
          verkkosivuilla. */}
      {/* Ketjun ensimmainen kerros on lapinakyva (pino-avoin ja
          omaPohja={false}), jolloin heron sivutason verkosto jatkuu
          Nakyvyys-osioon katkeamatta, sama tausta eika kaksi. */}
      <div className="pino pino-avoin">
        <Jakso omaPohja={false}>
          <Nakyvyys />
        </Jakso>
        <div className="pino">
          <Vaite
            kuva="/hakukoneoptimointi/kuitu.webp"
            alla="Tekninen kunto, sisältö, auktoriteetti ja paikallinen näkyvyys. Yksikään niistä ei tuota tulosta yksin."
          >
            Hakukoneoptimointi ei ole <b><i>temppu.</i></b> Se on neljä työtä joita tehdään yhtä aikaa.
          </Vaite>
          <Jakso>
            <Sisalto />
            <Paikallinen />
            <Hinnoittelu />
            <Kenelle />
            <Ukk />
            <Toimintaalue
              otsikko="Hakukoneoptimointi Espoosta koko Suomeen"
              rivit={[
                ["Espoo", "Toimipisteemme on Espoossa, ja pääkaupunkiseudun yrityksiä tapaamme mielellämme paikan päällä."],
                ["Koko Suomi", "Hakukoneoptimointi tehdään verkossa, joten sijainti ei vaikuta hintaan eikä aikatauluun."],
                ["Haussa", "Sivut rakennetaan näkymään niillä paikkakunnilla, joilla yrityksesi oikeasti palvelee."],
              ]}
            />
            <Tarjous />
          </Jakso>
        </div>
      </div>
      </div>
      </div>

      {/* MITATTU ETUSIVULTA. Etusivun footerissa on nelja lohkoa:
          brandi, Palvelut, Yritys ja Yhteystiedot. Talla sivulla oli
          SEO_FOOTER jossa on nelja OMAA saraketta, eli komponentti
          renderoi kuusi lohkoa ja footeri oli silminnahden eri levyinen
          ja eri rytminen kuin etusivulla. SUBPAGE_FOOTER antaa saman
          neljan lohkon rakenteen kuin etusivu. */}
      <Footer
        intro="Lyhytvideotuotanto, verkkosivut ja graafinen ilme yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy"
        brandHeading="h2"
      />

      <Palkki />
      <SiteEffects />
    </div>
  );
}
