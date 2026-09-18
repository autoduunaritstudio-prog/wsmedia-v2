import type { Metadata } from "next";

import NetBackdrop from "../components/NetBackdrop";
import Logos from "../components/Logos";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Palkki from "../components/Palkki";
import SiteEffects from "../components/SiteEffects";
import { OVERLAY_NAV, SUBPAGE_FOOTER } from "../components/site-data";

import Jakso from "../components/Jakso";
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
        ohitaKohde="#paasisalto"
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

      {/* YKSI PEITTOKETJU, HENGAHDYS JOKA TOINEN VAIHE.
          =============================================================
          Ennen: ketju katkesi kahdesti. Nakyvyys ja Prosessi olivat
          pinon ULKOPUOLELLA eli tavallisessa virtauksessa, joten osa
          osioista nousi edellisen paalle ja osa ei. Sama sivu teki
          kahta eri asiaa, ja juuri se lukee hajonneena.

          Mitattuna (nakyma 868px) hengahdysten valit olivat:
            hengahdys -> hengahdys   4102px = 4,7 nakymaa
            hengahdys -> hengahdys   1560px = 1,8 nakymaa
            hengahdys -> loppu       3799px = 4,4 nakymaa
          Eli kaksi lahes viiden nakyman umpinaista jaksoa ja niiden
          valissa kohta jossa kaksi hengahdysta oli lahes kiinni
          toisissaan, valissa vain 0,8 nakyman Prosessi.

          Nyt: 1,3 / 1,8 / 3,0 / 1,8 / 2,3 nakymaa. Kaksi keinoa:

          1. KAIKKI SAMASSA KETJUSSA. Jokainen vaihe nousee edellisen
             paalle Hinnoitteluun asti, ja hanta (UKK, Tarjous) on
             tavallista virtausta. Sama rakenne kuin Lyhytvideoilla.

          2. JAKSO ON YKSI VAIHE. Prosessi on 692px eli 0,8 nakymaa.
             Yksin kahden hengahdyksen valissa se lukee vahingolta.
             Kaareessa Kenellen kanssa se on yksi vaihe, ja sama
             temppu pitaa Toteutustavan ja Nakyvyyden yhdessa.

          Kenelle siirtyi hannasta ketjuun myos sisallon takia: se
          rajaa kenelle tama sopii, ja rajaus ennen hintaa on
          rehellisempi jarjestys kuin hinta ennen rajausta. */}
      <div className="pino">
        {/* TUTTU TILANNE JA PALVELUN SISALTO OVAT YKSI VAIHE.
            Sisalto nousi aiemmin coverina Tuttu tilanteen paalle,
            vaikka se ei ole vastaus vaan saman ajatuksen jatko:
            ensin mika on vialla, sitten mita palvelu sisaltaa. Kaksi
            peittovaihetta peräkkain sanoi etta nama ovat eri asioita.

            Kaareessa ne ovat yksi pinta ja yksi kuvio: jakso-pari
            ottaa pohjan ja verkoston itselleen ja osiot sen sisalla
            ovat lapinakyvia, joten Tuttu tilanteen tausta jatkuu
            katkeamatta Palvelun sisaltoon. Hiusviiva niiden valista on
            myos pois. Ensimmainen cover on siis vasta hengahdys. */}
        <Jakso omaPohja={false}>
          <Ongelma />
          <Sisalto />
        </Jakso>

        <div className="pino">
          {/* SIVUN ENSIMMAINEN COVER JA AINOA HENGAHDYS ENNEN
              PROSESSIA.

              KUVA VAIHTUI KOLMANNEN KERRAN. koodi.webp on tyopoyta
              jolla on ruutu JA kahvikuppi, ja kuppi on kuvan lahin ja
              kirkkain kappale, joten se vei aiheen: lause puhui
              sivuston tekemisesta ja kuva luki kahvilana. Rajaus ei
              auta, koska cover jattaa vaakasuunnassa vain 15 %
              varaa, ja zoomaus pudottaa kupin mutta samalla ruudun.
              Sama tiedosto on lisaksi jo Tarjous-osion pohjana, eli
              sama kuva olisi ollut sivulla kahdesti.

              Nyt kuvassa piirretaan sivun rautalankamallia kynalla, ja
              lause sanoo tasan sen: valmispohjassa sivu valitaan,
              raataloidyssa se piirretaan. Se on myos seuraavan osion
              kysymys. */}
          <Vaite
            kuva="/verkkosivut/luonnos.webp"
            alla="Valitseminen on nopeampaa, piirtäminen antaa sivun jonka rakenne on päätetty eikä peritty. Kumpi kannattaa, riippuu alasta ja aikataulusta."
          >
            Valmispohjassa sivu valitaan. Räätälöidyssä se <b><i>piirretään.</i></b>
          </Vaite>

          <div className="pino">
            <Jakso>
              <Toteutustapa />
              <Nakyvyys />
            </Jakso>

            <div className="pino">
              {/* Kuva on kaksi ihmista poydan aaressa ja tyhja arkki
                  niiden valissa, ja lause on prosessin ensimmaisesta
                  askeleesta, joten hengahdys on sen osion edessa
                  josta se puhuu. Kick "Prosessi" jaa pois: osion
                  nimi on sivukiskossa heti taman alla. */}
              <Laatta kuva="/verkkosivut/kartoitus.webp" korkeus="taysi">
                <p className="laatta-lause suuri">
                  Et tarvitse mitään <b><i>valmiiksi.</i></b>
                </p>
                <p className="laatta-alla">
                  Tekstit, kuvat ja rakenne ovat osa toteutusta, eivät sen edellytys.
                </p>
              </Laatta>

              <div className="pino">
                <Jakso>
                  <Prosessi />
                  <Kenelle />
                </Jakso>

                {/* Tulokset-osio poistettiin aiemmin: sen luvut
                    olivat lupauksia joiden takana ei ole yhtaan
                    mitattua asiakastyota. */}
                <div className="pino">
                  <Vaite
                    kuva="/verkkosivut/naytto.webp"
                    alla="Hinta päätetään ennen kuin työ alkaa, eikä se perustu arvioon käytetyistä tunneista vaan sivumäärään ja sisällön laajuuteen."
                  >
                    Emme kilpaile hinnalla vaan sillä, että sivusto <b><i>löytyy ja myy.</i></b>
                  </Vaite>

                  <Hinnoittelu />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
