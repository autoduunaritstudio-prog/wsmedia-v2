/* Sivun tyylit: generoitu app/globals.css:sta, ks. scripts/tyylit.cjs. */
import "../_tyylit/graafinen-suunnittelu.css";
import type { Metadata } from "next";

import Footer from "../components/Footer";
import Jakso from "../components/Jakso";
import Logos from "../components/Logos";
import NetBackdrop from "../components/NetBackdrop";
import Nav from "../components/Nav";
import Palkki from "../components/Palkki";
import SiteEffects from "../components/SiteEffects";
import { Laatta, Vaite } from "../components/Maasto";
import { SUBPAGE_FOOTER, OVERLAY_NAV } from "../components/site-data";

import TeippausHero from "./components/TeippausHero";
import RepeytyvaReuna from "./components/RepeytyvaReuna";
import { buildJsonLd } from "./jsonld";
import { Materiaalit, Miksi, Palvelut } from "./sections";
import { Alueet, Hinta, Kaytannossa, Kenelle, Tarjous } from "./sections2";
import { Ukk } from "./ukk";

const TITLE = "Graafinen suunnittelu ja logo yritykselle | Espoo | WS Media";
const DESCRIPTION =
  "Logo, yritysilme ja graafinen ohjeisto yritykselle. Hoidamme myös käyntikortit, roll-upit ja auton mainosteippauksen valmiiksi. Logo alk. 490 €.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://wsmedia.fi/graafinen-suunnittelu" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: "WS Media",
    url: "https://wsmedia.fi/graafinen-suunnittelu",
    title: TITLE,
    /* Ajatusviivat pois: ne paljastavat koneen kirjoittaman tekstin, ja
       tama pätkä nakyy jaetussa linkissa sellaisenaan. */
    description: DESCRIPTION,
  },
};

export default function GraafinenSuunnittelu() {
  return (
    <div className="page-palvelu page-graafinen-suunnittelu wsx">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }}
      />

      {/* SIVUTASON VERKOSTO. Sama kerros ja sama paikka kuin kolmella
          muulla palvelusivulla: yksi verkosto koko sivulle. Sivulla oli
          aiemmin <Backdrop variant="simple" />, joka on vaalean ilmeen
          pohja eika kuulu tahan kuvakieleen lainkaan. */}
      <NetBackdrop merkit={false} />

      {/* RAE. Sama kiintea rakeinen kalvo kuin muilla palvelusivuilla:
          tasainen digitaalinen pinta lukee tyhjana. */}
      <div className="rae" aria-hidden="true" />

      <Nav
        anchorBase="/"
        links={OVERLAY_NAV}
        ohitaKohde="#paasisalto"
        ctaHref="#tarjous"
        ctaLabel="Varaa maksuton kartoitus"
        logoHref="/"
      />

      {/* PINNATTU HERO JA PEITTAVA COVER, sama tekniikka kuin
          Verkkosivuilla ja Lyhytvideoilla. Hero jaa kiinni nakyman
          ylareunaan, ja vasta sen jalkeen cover liukuu sen paalle.
          Pari ja sen cover ovat saman kaareen lapsia: se on ehto jonka
          rikkominen kaataa pinnauksen aanettomasti.

          Coverin ylareunassa on asiakaslogonauha: ensimmainen asia joka
          nousee heron paalle on todiste, ei uusi myyntilause.

          Murupolku poistui virrasta. Se oli 33px korkea rivi ylisuuren
          otsikon ylapuolella, ja pinnatun heron kanssa se olisi jaanyt
          coverin alle nakymattomiin. BreadcrumbList-merkinta sailyy
          jsonld.ts:ssa. */}
      <div className="stickysub">
        {/* TEIPPAUS-HERO (prototyyppi wsmedia-teippaus-hero, porttaus
            sellaisenaan). Korvaa aiemman heron ja nelja pinnan
            nayttamon. Desktopilla heron peraan jaa 100svh hantaa, jonka
            paalle cover nousee, ks. globals.css. */}
        <TeippausHero />
        <div className="cover">
          {/* Coverin ylareuna repeaa auki kuin teippi, ks. RepeytyvaReuna.tsx. */}
          <RepeytyvaReuna />
          <NetBackdrop mount="cover" />
          <Logos />

          {/* YKSI PEITTOKETJU, HENGAHDYS JOKA TOINEN VAIHE.
              =======================================================
              Sivu oli aiemmin kolmetoista perakkaista osiota
              tavallisessa virtauksessa: ei peittoa, ei hengahdyksia ja
              ei rytmia. Nyt sama rakenne kuin kolmella muulla
              palvelusivulla.

              JAKSO ON YKSI VAIHE. Miksi ja Palvelut ovat yhdessa
              lupaus ja sen sisalto, Prosessi ja Aineistot ovat "miten
              se tehdaan ja mita siita jaa kateen", Materiaalit ja
              Toiminta-alue ovat molemmat toteutuksen reunaehtoja, ja
              hanta Hinnasta Tarjoukseen on yksi pinta.

              Hengahdykset ovat samaa sarjaa kuin kahdella muulla
              palvelusivulla: kuvallinen vaite, taysi laatta, kuvallinen
              vaite. Kuvat ovat public/graafinen-suunnittelu-kansiossa. */}
          <div className="pino">
            <Jakso omaPohja={false}>
              <Miksi />
              <Palvelut />
            </Jakso>

            <div className="pino">
              {/* Kehotuspalkki alkaa tasta, kuten kahdella muulla
                  palvelusivulla. Kuvassa Laaksolahden Sahkon pakettiauton
                  teippaussuunnitelma naytolla ja tabletilla (3.10.2026). */}
              <Vaite
                palkkiAlkaa
                kuva="/graafinen-suunnittelu/ilme-teippaus.webp"
                alla="Asiakas näkee pakettiautosi liikenteessä ja myöhemmin saman logon hakutuloksissa. Jos ne näyttävät samalta, hän tunnistaa yrityksesi jo ennen kuin soittaa.">
                Kun kaikki näyttää samalta, yritys <b><i>jää mieleen.</i></b>
              </Vaite>

              {/* RAKENNE 3.10.2026: Prosessi ja ikkunalaatta poistettu.
                  Vaitteen paalle nousee suoraan hinnasta tarjoukseen
                  ulottuva pinta. */}
              <Jakso tausta>
                <Hinta />
                <Kenelle />
                <Materiaalit />
                <Ukk />
                <Alueet />
                <Kaytannossa />
                <Tarjous />
              </Jakso>
            </div>
          </div>
        </div>
      </div>

      <Footer
        intro="Lyhytvideotuotanto, verkkosivut ja graafinen ilme yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy"
        brandHeading="h2"
      />

      <Palkki
        otsikko="Maksuton kartoitus"
        selite="Logo, ilme tai teippaus. Saat kiinteän hinnan, ei sido mihinkään."
        nappi="Varaa kartoitus"
      />
      <SiteEffects />
    </div>
  );
}
