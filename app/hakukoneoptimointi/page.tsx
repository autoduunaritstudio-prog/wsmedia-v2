import type { Metadata } from "next";

import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SiteEffects from "../components/SiteEffects";
import { SUBPAGE_FOOTER, OVERLAY_NAV } from "../components/site-data";

import { Vaite } from "./components/Artefaktit";
import Hero from "./components/Hero";
import { Juova, Laatta } from "./components/Maasto";
import Suotimet from "./components/Suotimet";
import Nakyvyys from "./components/Nakyvyys";
import Sisalto from "./components/Sisalto";
import {
  Aikataulu,
  Hinnoittelu,
  Kenelle,
  Mittarit,
  Paikallinen,
  Tarjous,
  Ukk,
} from "./components/sections";
import Tape from "./components/Tape";
import { buildJsonLd } from "./jsonld";

export const metadata: Metadata = {
  title: "Hakukoneoptimointi yritykselle | SEO-palvelut ja hinta | WS Media",
  description:
    "Hakukoneoptimointi yritykselle: tekninen SEO, sisältö ja paikallinen näkyvyys, sekä näkyvyys tekoälyhauissa. Kuukausipaketit alkaen 390 €/kk.",
  alternates: { canonical: "https://wsmedia.fi/hakukoneoptimointi" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: "WS Media",
    url: "https://wsmedia.fi/hakukoneoptimointi",
    title: "Hakukoneoptimointi yritykselle | SEO-palvelut ja hinta | WS Media",
    description:
      "Tekninen SEO, sisältö ja paikallinen näkyvyys, sekä näkyvyys tekoälyhauissa. Kuukausipaketit alkaen 390 €/kk.",
  },
};

export default function Hakukoneoptimointi() {
  return (
    <div className="page-palvelu page-hakukoneoptimointi seo26">
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

      {/* KATSOTTUNA: metallikuvio teki pohjasta likaisen harmaan.
          Etusivulla se toimii, koska siella sen paalla on tumma hero ja
          valkoinen cover jotka rajaavat sen. Talla sivulla se nakyi
          koko matkan viistoina harmaina juovina, ja lopputulos luki
          pesemattomana taustana eika materiaalina. Sivun oma pohja on
          puhdas, ja varit tulevat osioista ja valokuvista. */}
      <div id="prog" />

      {/* RAE. Kiintea rakeinen kalvo koko sivun paalla. Tasainen
          digitaalinen pinta lukee tyhjana, rae tekee siita
          materiaalia. Kohina tuotetaan selaimessa, joten mukana ei
          kulje yhtaan tavua kuvadataa. */}
      <div className="rae" aria-hidden="true" />

      <Nav
        anchorBase="/"
        links={OVERLAY_NAV}
        ctaHref="#tarjous"
        ctaLabel="Pyydä tarjous"
        logoHref="/"
      />

      {/* Murupolku pois virrasta: se oli 33px korkea rivi ylisuuren
          otsikon ylapuolella, ja juuri sen ylapuolella on nyt osion oma
          numerorivi joka tekee saman tyon paremmin. BreadcrumbList-
          merkinta sailyy jsonld.ts:ssa. */}
      <Hero />
      <Tape />

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
      <div className="pino">
        <Nakyvyys />

        <div className="pino">
          {/* Levahdyspaikka ennen sivun raskainta osiota. Yksi lause,
              ei mitaan luettavaa, tumma pohja. */}
          <Vaite
            kuva="/hakukoneoptimointi/kuitu.webp"
            alla="Tekninen kunto, sisältö, auktoriteetti ja paikallinen näkyvyys. Neljä työtä, yksi tiimi, yksi lasku."
          >
            Hakukoneoptimointi ei ole <b><i>temppu.</i></b> Se on neljä työtä joita tehdään yhtä aikaa.
          </Vaite>

          <div className="pino">
            <Sisalto />

            <div className="pino">
              {/* Sivun rehellisin lause ei ole tekstiosio vaan
                  taysleveä kuva, jonka paalla se on. Kuvassa on
                  ihminen tyossaan aamulla, eli tasan se jota lause
                  koskee: hakukoneoptimointi ei tuota tulosta
                  paivassa, koska tyo on oikeaa tyota. */}
              <Laatta kuva="/hakukoneoptimointi/paja.webp" korkeus="taysi">
                <p className="laatta-kick">Aikataulu</p>
                <p className="laatta-lause">
                  Kukaan ei voi luvata <b><i>päivämäärää.</i></b>
                </p>
                <p className="laatta-alla">
                  Emme lupaa sijaa yksi emmekä tiettyä prosenttia. Sovimme mittarit etukäteen ja
                  raportoimme ne kuukausittain, myös silloin kun luvut eivät miellytä.
                </p>
              </Laatta>

              <Aikataulu />
            </div>
          </div>
        </div>
      </div>

      <Paikallinen />

      {/* Sama pino toisen kerran: Mittarit jaa alle, hengahdys nousee
          sen paalle, ja hinnasto nousee hengahdyksen paalle. */}
      <div className="pino">
        <Mittarit />

        <div className="pino">
          {/* KUVA VAIHTUI. Ensimmainen oli kasi poydalla, paperi ja
              kahvikuppi: tunnelmaltaan oikea mutta aiheeltaan vaara.
              Tama sivu myy Google-nakyvyytta, joten ostopaatoksen
              hetki on naytön aaressa eika poydan aaressa. Nyt kuvassa
              on kasi nappaimistolla ja naytön kylma valo pimeassa
              huoneessa. */}
          <Vaite
            kuva="/hakukoneoptimointi/haku2.webp"
            alla="Kartoitus ja alustava auditointi ovat maksuttomia eivätkä sido mihinkään."
          >
            Näy siellä, missä <b><i>ostopäätös syntyy.</i></b>
          </Vaite>

          <Hinnoittelu />
        </div>
      </div>
      <Kenelle />

      <Juova />

      <Ukk />
      {/* Taustaa ja Blogi ovat pois toistaiseksi: Taustaa oli
          hakukonetta varten kirjoitettua toistoa asioista jotka sivu on
          jo sanonut, ja blogissa ei ole viela tarpeeksi sisaltoa.
          Loppu-lohko poistui, koska sen ainoa nappi osoitti takaisin
          samaan lomakkeeseen muutaman sadan pikselin paahan - sen
          otsikko ja teksti ovat nyt Tarjous-osion sisalla. Kaikkien
          koodi sailyy sections2.tsx:ssa. */}
      <Tarjous />

      {/* MITATTU ETUSIVULTA. Etusivun footerissa on nelja lohkoa:
          brandi, Palvelut, Yritys ja Yhteystiedot. Talla sivulla oli
          SEO_FOOTER jossa on nelja OMAA saraketta, eli komponentti
          renderoi kuusi lohkoa ja footeri oli silminnahden eri levyinen
          ja eri rytminen kuin etusivulla. SUBPAGE_FOOTER antaa saman
          neljan lohkon rakenteen kuin etusivu. */}
      <Footer
        intro="Lyhytvideot, verkkosivut ja graafinen ilme yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy · Y-tunnus 3615084-4 · Espoo"
        brandHeading="h2"
      />

      <SiteEffects />
    </div>
  );
}
