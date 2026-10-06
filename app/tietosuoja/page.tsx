/* Sivun tyylit: generoitu app/globals.css:sta, ks. scripts/tyylit.cjs.
   Sama tumma .wsx-teema kuin Laskutustiedot- ja Yhteystiedot-sivuilla. */
import "../_tyylit/tietosuoja.css";
import type { Metadata } from "next";

import Footer from "../components/Footer";
import Nav from "../components/Nav";
import NetBackdrop from "../components/NetBackdrop";
import SiteEffects from "../components/SiteEffects";
import { SUBPAGE_FOOTER, OVERLAY_NAV, ROUTES } from "../components/site-data";
import CookieSettingsButton from "../components/consent/CookieSettingsButton";

import { EVASTEET, PAIVITETTY, SECTIONS } from "./content";
import TietosuojaMobiili from "./mobiili/Mobiili";

export const metadata: Metadata = {
  title: "Tietosuojaseloste | WS Media",
  description:
    "WS Media Oy:n tietosuojaseloste: mitä henkilötietoja käsittelemme ja miksi, mitä evästeitä sivustolla käytetään, kuinka kauan tietoja säilytetään ja mitkä ovat oikeutesi.",
  alternates: { canonical: "https://wsmedia.fi/tietosuoja" },
  robots: { index: false, follow: true },
};

function Evasteosio() {
  return (
    <>
      <p>
        Evästeet ovat pieniä tiedostoja, jotka sivusto tallentaa selaimeesi. Välttämätön tallenne on
        aina käytössä. Analytiikka- ja markkinointievästeet otetaan käyttöön vain, jos hyväksyt ne
        evästeilmoituksessa. Ennen suostumusta sivusto ei lataa Googlen eikä Metan seurantakoodeja.
      </p>
      <div className="ts-taulu" role="region" aria-label="Sivuston evästeet" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th scope="col">Eväste</th>
              <th scope="col">Palvelu ja tarkoitus</th>
              <th scope="col">Säilyy</th>
            </tr>
          </thead>
          <tbody>
            {EVASTEET.map((e) => (
              <tr key={e.nimi}>
                <th scope="row">
                  <code>{e.nimi}</code>
                  <span className={`ts-tyyppi ts-tyyppi-${e.tyyppi === "Välttämätön" ? "v" : "s"}`}>{e.tyyppi}</span>
                </th>
                <td>
                  <b>{e.palvelu}.</b> {e.tarkoitus}
                </td>
                <td>{e.kesto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Google Search Consolen avulla seuraamme, millä hauilla sivusto näkyy Googlessa. Se ei aseta
        sivustolla evästeitä, ja sen kautta saamme vain koostettuja tilastoja.
      </p>
      <p>
        Voit muuttaa tai perua suostumuksesi milloin tahansa:{" "}
        <CookieSettingsButton label="avaa evästeasetukset" />. Evästeet voi poistaa myös selaimen
        asetuksista.
      </p>
    </>
  );
}

export default function Tietosuoja() {
  return (
    <>
      {/* Tyopoydan puu .mo-tyopoyta-kaaressa (display: contents, asettelu ei
          muutu). Puhelinversio (max-width 767px) on taman JALKEEN, koska
          tyopoydan skriptit hakevat ensimmaisen footerin ja headerin. */}
      <div className="mo-tyopoyta">
    <div className="page-palvelu page-hakukoneoptimointi page-tietosuoja wsx">
      <NetBackdrop merkit={false} />
      <div className="rae" aria-hidden="true" />

      <Nav anchorBase="/" links={OVERLAY_NAV} ctaHref={ROUTES.yhteys} ctaLabel="Ota yhteyttä" logoHref="/" />

      <header className="seo-hero ts-hero">
        <div className="swrap ts-in">
          <div>
            <h1 className="seo-h1">Tietosuojaseloste</h1>
            <p className="hero-lead">
              Tällä sivulla kerromme, mitä tietoja keräämme, mihin niitä käytetään ja kuinka kauan niitä
              säilytetään. Seuranta- ja mainosevästeet otetaan käyttöön vain suostumuksellasi.
            </p>
            <p className="ts-pvm">Päivitetty {PAIVITETTY}</p>
          </div>

          <aside className="ts-arkki" aria-label="Tietosuoja lyhyesti">
            <p className="ts-otsake">Lyhyesti</p>
            <dl>
              <div className="ts-rivi">
                <dt>Rekisterinpitäjä</dt>
                <dd>WS Media Oy</dd>
              </div>
              <div className="ts-rivi">
                <dt>Seurantaevästeet</dt>
                <dd>Vain suostumuksellasi</dd>
              </div>
              <div className="ts-rivi">
                <dt>Tietojen myynti</dt>
                <dd>Emme myy tietoja</dd>
              </div>
              <div className="ts-rivi">
                <dt>Tietopyynnöt</dt>
                <dd>
                  <a href="mailto:info@wsmedia.fi">info@wsmedia.fi</a>
                </dd>
              </div>
            </dl>
            <CookieSettingsButton label="Evästeasetukset" />
          </aside>
        </div>
      </header>

      <div className="swrap ts-doc">
        <nav className="ts-toc" aria-label="Sisällys">
          <p>Sisällys</p>
          <ol>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.lyhyt}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="ts-osiot">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="ts-sec" aria-labelledby={`${s.id}-h`}>
              <h2 id={`${s.id}-h`}>
                <span className="ts-num">{s.n}</span>
                {s.title}
              </h2>
              <div className="ts-body">{s.id === "evasteet" ? <Evasteosio /> : s.body}</div>
            </section>
          ))}
        </div>
      </div>

      <Footer
        intro="Lyhytvideotuotanto, verkkosivut ja graafinen ilme yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy"
        brandHeading="h2"
      />
      <SiteEffects />
    </div>
      </div>
      <TietosuojaMobiili />
    </>
  );
}
