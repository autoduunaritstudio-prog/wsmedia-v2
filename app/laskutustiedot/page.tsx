/* Sivun tyylit: generoitu app/globals.css:sta, ks. scripts/tyylit.cjs.
   Sama tumma .wsx-teema kuin Meista-sivulla. */
import "../_tyylit/laskutustiedot.css";
import type { Metadata } from "next";

import Footer from "../components/Footer";
import Nav from "../components/Nav";
import NetBackdrop from "../components/NetBackdrop";
import Kopioi from "../components/Kopioi";
import SiteEffects from "../components/SiteEffects";
import { SUBPAGE_FOOTER, OVERLAY_NAV, ROUTES } from "../components/site-data";

/* LAHTEET (tarkistettu 3.10.2026):
   - Y-tunnus, kotipaikka ja ALV-rekisterointi:
     YTJ, tietopalvelu.ytj.fi/yritys/3615084-4
   - Verkkolaskuosoite ja valittaja: verkkolaskuosoite.fi
   - Postiosoite: Tuomaksen ilmoittama 3.10.2026 (YTJ:ssa viela vanha
     Haukilahdenkatu 1 A 135)
   Kun jokin naista muuttuu, paivita tieto myos lahteeseen. */
const YRITYS: [string, string][] = [
  ["Yritys", "WS Media Oy"],
  ["Y-tunnus", "3615084-4"],
  ["ALV-tunnus", "FI36150844"],
  ["Kotipaikka", "Espoo"],
  ["Postiosoite", "Kuusiniementie 8 F 3, 02710 Espoo"],
];

const VERKKOLASKU: [string, string][] = [
  ["Verkkolaskuosoite", "003736150844"],
  ["Välittäjä", "Apix Messaging Oy"],
  ["Välittäjätunnus", "003723327487"],
];

export const metadata: Metadata = {
  title: "Laskutustiedot | WS Media",
  description:
    "WS Media Oy:n laskutustiedot: Y-tunnus 3615084-4, ALV-tunnus, postiosoite sekä verkkolaskuosoite 003736150844 ja välittäjä Apix Messaging Oy.",
  alternates: { canonical: "https://wsmedia.fi/laskutustiedot" },
  /* Ei hakuarvoa: sivu on olemassa laskuttajia varten. */
  robots: { index: false, follow: true },
};

function Rivi({ k, v, kopio }: { k: string; v: string; kopio?: boolean }) {
  return (
    <div className="lt-rivi">
      <dt>{k}</dt>
      <dd>
        <span>{v}</span>
        {kopio ? <Kopioi arvo={v.replace(/\s/g, "")} nimi={k} /> : null}
      </dd>
    </div>
  );
}

export default function Laskutustiedot() {
  return (
    <div className="page-palvelu page-hakukoneoptimointi page-laskutustiedot wsx">
      <NetBackdrop merkit={false} />
      <div className="rae" aria-hidden="true" />

      <Nav anchorBase="/" links={OVERLAY_NAV} ctaHref={ROUTES.yhteys} ctaLabel="Ota yhteyttä" logoHref="/" />

      {/* Sivun ainoa kuvallinen asia on itse lasku: vaalea paperiarkki,
          jossa vastaanottajan ja verkkolaskun tiedot ovat siina
          jarjestyksessa kuin ne kirjoitetaan laskulle. */}
      <header className="seo-hero lt-hero">
        <div className="swrap lt-in">
          <div className="lt-teksti">
            <h1 className="seo-h1">Laskutustiedot</h1>
            <p className="hero-lead">
              Lähetä laskut ensisijaisesti verkkolaskuna. Tiedot vastaavat kaupparekisteriä ja
              Verkkolaskuosoitteistoa, ja jokaisen numeron voi kopioida suoraan.
            </p>
            <p className="lt-huom">
              Jos verkkolasku ei onnistu, kirjoita osoitteeseen{" "}
              <a href="mailto:info@wsmedia.fi">info@wsmedia.fi</a>, niin sovitaan toimitustapa.
              Merkitse laskuun viite tai yhteyshenkilö, jotta lasku kohdistuu oikein. Tiedot löytyvät
              myös{" "}
              <a href="https://verkkolaskuosoite.fi" rel="noopener" target="_blank">
                Verkkolaskuosoitteistosta
              </a>
              .
            </p>
          </div>

          <article className="lt-arkki" aria-label="WS Media Oy:n laskutustiedot">
            <p className="lt-otsake">Laskun vastaanottaja</p>
            <p className="lt-nimi">{YRITYS[0][1]}</p>
            <dl>
              {YRITYS.slice(1).map(([k, v]) => (
                <Rivi key={k} k={k} v={v} kopio={k === "Y-tunnus" || k === "ALV-tunnus"} />
              ))}
            </dl>
            <div className="lt-verkko">
              <p className="lt-otsake">Verkkolasku</p>
              <div className="lt-osoite">
                <span>{VERKKOLASKU[0][1]}</span>
                <Kopioi arvo={VERKKOLASKU[0][1]} nimi="verkkolaskuosoite" />
              </div>
              <dl>
                {VERKKOLASKU.slice(1).map(([k, v]) => (
                  <Rivi key={k} k={k} v={v} kopio={k === "Välittäjätunnus"} />
                ))}
              </dl>
            </div>
          </article>
        </div>
      </header>

      <Footer
        intro="Lyhytvideotuotanto, verkkosivut ja graafinen ilme yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy"
        brandHeading="h2"
      />
      <SiteEffects />
    </div>
  );
}
