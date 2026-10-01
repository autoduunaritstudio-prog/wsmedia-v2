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

import Hero from "./components/Hero";
import { buildJsonLd } from "./jsonld";
import { Materiaalit, Miksi, Palvelut, Prosessi, Tiedostot } from "./sections";
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
        <Hero />
        <div className="cover">
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
                  palvelusivulla. Kuvassa kayntikortit, varimallit ja
                  puhelin samalla tunnuksella: lause puhuu juuri siita. */}
              <Vaite
                palkkiAlkaa
                kuva="/graafinen-suunnittelu/ilme.webp"
                alla="Asiakas näkee pakettiautosi liikenteessä ja myöhemmin saman logon hakutuloksissa. Jos ne näyttävät samalta, hän tunnistaa yrityksesi jo ennen kuin soittaa.">
                Kun kaikki näyttää samalta, yritys <b><i>jää mieleen.</i></b>
              </Vaite>

              <div className="pino">
                <Jakso>
                  <Prosessi />
                  <Tiedostot />
                </Jakso>

                <div className="pino">
                  {/* Keskimmainen hengahdys on taysi laatta, kuten
                      lyhytvideoilla ja verkkosivuilla: vaite, laatta,
                      vaite. */}
                  <Laatta kuva="/graafinen-suunnittelu/pakettiauto.webp" korkeus="taysi">
                    <p className="laatta-kick">Auton mainosteippaus</p>
                    <p className="laatta-lause suuri">
                      Pakettiauto ajaa <b><i>joka tapauksessa.</i></b>
                    </p>
                    <p className="laatta-alla">
                      Teippauksella siitä tulee mainos, joka näkyy joka ajokilometrillä ilman erillistä mainosbudjettia.
                    </p>
                  </Laatta>

                  <div className="pino">
                    <Jakso>
                      <Materiaalit />
                      <Alueet />
                    </Jakso>

                    <div className="pino">
                      <Vaite
                        kuva="/graafinen-suunnittelu/luonnokset.webp"
                        alla="Kartoitus ja tarjous ovat maksuttomia eivätkä sido mihinkään."
                      >
                        Logo alkaen 490 €, koko ilme <b><i>alkaen 1 490 €.</i></b>
                      </Vaite>

                      {/* SIVUN HANTA ON YKSI PINTA, ks. kolme muuta
                          palvelusivua. Vierekkaiset kerrokset ovat aina
                          kaksi eri kuviota, ja raja niiden valissa
                          nakyy vaikka vari olisi sama. Yksi kaare, yksi
                          kerros, viisi osiota sen sisalla. */}
                      <Jakso>
                        <Hinta />
                        <Kenelle />
                        <Ukk />
                        <Kaytannossa />
                        <Tarjous />
                      </Jakso>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer
        intro="Graafinen suunnittelu, verkkosivut ja lyhytvideot yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy · Y-tunnus 3615084-4 · Espoo"
        brandHeading="h2"
      />

      <Palkki
        otsikko="Maksuton kartoitus"
        selite="Logo, ilme tai teippaus. Saat kiinteän hinnan, ei sido mihinkään."
        nappi="Pyydä tarjous"
      />
      <SiteEffects />
    </div>
  );
}
