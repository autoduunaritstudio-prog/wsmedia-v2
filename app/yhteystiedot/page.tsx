/* Sivun tyylit: generoitu app/globals.css:sta, ks. scripts/tyylit.cjs.

   YHTEYSTIEDOT. Sama tumma .wsx-teema kuin Meista-sivulla, oma muoto:
   - Puhelinnumero on sivun otsikko: iso, yksi napautus soittaa.
   - Filminauha: WS Median omat kuvauskuvat ruutuina, rei'itys reunoissa.
     Liukuu vierityksen mukaan (data-parx), ei ajastettua liiketta.
   - Tekijat lopputekstien tapaan: palvelu vasemmalla, nimi oikealla. */
import "../_tyylit/yhteystiedot.css";
import type { Metadata } from "next";

import Footer from "../components/Footer";
import Kopioi from "../components/Kopioi";
import { AUKIOLO, GOOGLE_PROFIILI, ORG_ID, ORGANISAATIO } from "../components/organisaatio";
import Nav from "../components/Nav";
import NetBackdrop from "../components/NetBackdrop";
import SiteEffects from "../components/SiteEffects";
import { CONTACT, SUBPAGE_FOOTER, OVERLAY_NAV, ROUTES } from "../components/site-data";
import YhteysMobiili from "./mobiili/Mobiili";

const OTSIKKO = "Yhteystiedot | WS Media, Espoo";
const KUVAUS =
  "Ota yhteyttä WS Mediaan: puh. 040 564 8770, info@wsmedia.fi, Kuusiniementie 8 F 3, Espoo. Avoinna ma–pe 9–18 ja la 11–16. Vastaamme 24 tunnissa.";

export const metadata: Metadata = {
  title: OTSIKKO,
  description: KUVAUS,
  alternates: { canonical: "https://wsmedia.fi/yhteystiedot" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "fi_FI",
    siteName: "WS Media",
    url: "https://wsmedia.fi/yhteystiedot",
    title: OTSIKKO,
    description: KUVAUS,
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://wsmedia.fi/yhteystiedot#sivu",
      url: "https://wsmedia.fi/yhteystiedot",
      name: "Yhteystiedot",
      inLanguage: "fi-FI",
      about: { "@id": ORG_ID },
    },
    ORGANISAATIO,
  ],
};

/* Filminauhan ruudut: vain WS Median omia kuvia. Nauha on nakymaa
   leveampi, ja se liukuu sivusuunnassa vierityksen mukaan (data-parx,
   SiteEffects). Siksi reunoilla on kaksi ruutua lisaa: liukuessa reuna
   ei paljastu tyhjana. */
const RUUDUT: [string, string][] = [
  ["/kuvat/huoltoasema.webp", ""],
  ["/kuvat/halli-kortti.webp", "Kuvaus asiakkaan hallissa"],
  ["/kuvat/kuvauskeikka.webp", "Kuvauskeikka kadulla"],
  ["/kuvat/fx9.webp", "Kamera kuvauspaikalla kiitoradalla"],
  ["/kuvat/huoltoasema.webp", "Kuvaus huoltoasemalla"],
  ["/kuvat/autossa-kortti.webp", "Kuvaus auton sisällä"],
  ["/kuvat/halli-kortti.webp", ""],
];

/* Tekijat: kuka hoitaa minkakin asian. */
const TEKIJAT: [string, string, string][] = [
  ["Graafinen suunnittelu", "Ville Karppinen", "Asiakasvastaava. Myös tarjoukset ja sopimukset."],
  ["Verkkosivut ja hakukoneoptimointi", "Tuomas Ivanov", "Perustaja"],
  ["Lyhytvideot ja Meta-mainonta", "Alex Pettersborg", "Toimitusjohtaja ja tuottaja"],
];

export default function Yhteystiedot() {
  return (
    <>
      {/* Tyopoydan puu .mo-tyopoyta-kaaressa (display: contents, asettelu ei
          muutu). Puhelinversio (max-width 767px) on taman JALKEEN, koska
          tyopoydan skriptit hakevat ensimmaisen footerin ja headerin. */}
      <div className="mo-tyopoyta">
    <div className="page-palvelu page-hakukoneoptimointi page-yhteystiedot wsx">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
      <NetBackdrop merkit={false} />
      <div className="rae" aria-hidden="true" />

      <Nav
        anchorBase="/"
        links={OVERLAY_NAV}
        ctaHref={`mailto:${CONTACT.email}`}
        ctaLabel="Lähetä sähköpostia"
        logoHref="/"
      />

      <header className="seo-hero yt-hero">
        <div className="swrap">
          <h1 className="yt-h1">Ota yhteyttä WS Mediaan</h1>
          <a className="yt-numero" href={CONTACT.phoneHref}>
            {CONTACT.phone}
          </a>
          <p className="yt-lead">Soita tai kirjoita. Vastaamme 24 tunnin sisällä.</p>
          {/* Kehotukset avaa napeista yhteysikkunan (data-yhteys) ja
              varauskalenterin (data-varaus), kuten muillakin sivuilla. */}
          <div className="heroctas yt-napit">
            <button type="button" className="btn mag" data-yhteys="">
              Lähetä viesti
            </button>
            <button type="button" className="yt-toinen" data-varaus="">
              Varaa maksuton kartoitus
            </button>
          </div>

          <dl className="yt-rivi">
            <div>
              <dt>Sähköposti</dt>
              <dd>
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                <Kopioi arvo={CONTACT.email} nimi="sähköpostiosoite" />
              </dd>
            </div>
            <div>
              <dt>Osoite</dt>
              <dd>
                {CONTACT.street}, {CONTACT.city}
              </dd>
            </div>
            <div>
              <dt>Aukioloajat</dt>
              <dd className="yt-auki">
                {AUKIOLO.map((r) => (
                  <span key={r.paivat}>
                    <b>{r.paivat}</b> {r.ajat}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>Google</dt>
              <dd>
                <a href={GOOGLE_PROFIILI} target="_blank" rel="noopener noreferrer">
                  Kartta ja arvostelut
                </a>
              </dd>
            </div>
            <div>
              <dt>Laskutus</dt>
              <dd>
                <a href={ROUTES.laskutus}>Laskutustiedot</a>
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* Filminauha liukuu vierityksen mukaan: data-parx siirtaa sita
          vaakasuunnassa sita enemman, mita kauempana se on nakyman
          keskelta, ja liike purkautuu samaa rataa takaisin. */}
      <div className="yt-filmi" role="img" aria-label="WS Median kuvauksia">
        <div className="yt-filmi-in" data-parx="-0.4">
          {RUUDUT.map(([src, alt], n) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={n} src={src} alt={alt} loading="lazy" decoding="async" />
          ))}
        </div>
      </div>

      <section className="seo-sec yt-tekijat" id="kenelle">
        <div className="swrap">
          <h2 className="seo-h2 rv">Kenelle asiasi kuuluu</h2>
          <p className="seo-lead rv">
            Kaikki viestit tulevat samaan osoitteeseen, ja ohjaamme ne oikealle ihmiselle.
          </p>
          <dl className="yt-krediitit rv">
            {TEKIJAT.map(([ala, nimi, rooli]) => (
              <div key={ala}>
                <dt>{ala}</dt>
                <dd>
                  <b>{nimi}</b>
                  <span>{rooli}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="yt-alue rv">
            Toimimme Espoosta käsin koko pääkaupunkiseudulla ja muualla Suomessa. Kuvaukset tehdään
            yrityksesi tiloissa tai sovitussa paikassa, ja valmiit videot ja sivut toimitetaan
            sähköisesti.
          </p>
        </div>
      </section>

      <Footer
        intro="Lyhytvideotuotanto, verkkosivut ja graafinen ilme yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy"
        brandHeading="h2"
      />
      <SiteEffects />
    </div>
      </div>
      <YhteysMobiili />
    </>
  );
}
