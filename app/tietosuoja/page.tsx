import type { Metadata } from "next";

import Backdrop from "../components/Backdrop";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SiteEffects from "../components/SiteEffects";
import SmartLink from "../components/SmartLink";
import { SUBPAGE_FOOTER, SUBPAGE_NAV } from "../components/site-data";
import CookieSettingsButton from "../components/consent/CookieSettingsButton";

import { COOKIE_ROWS, SECTIONS } from "./content";

export const metadata: Metadata = {
  title: "Tietosuojaseloste | WS Media",
  description:
    "WS Media Oy:n tietosuojaseloste: mitä henkilötietoja keräämme, millä perusteella niitä käsitellään, mitä evästeitä sivustolla käytetään ja mitkä ovat rekisteröidyn oikeudet.",
  alternates: { canonical: "https://wsmedia.fi/tietosuoja" },
  robots: { index: true, follow: true },
};

const beforeCookies = SECTIONS.filter((s) => s.n < 7);
const afterCookies = SECTIONS.filter((s) => s.n > 7);

function SectionBlock({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="ts-sec rv" id={`osio-${n}`}>
      <h2>
        <span className="ts-num">{n}</span>
        {title}
      </h2>
      <div className="ts-body">{children}</div>
    </section>
  );
}

export default function Tietosuoja() {
  return (
    <div className="page-tietosuoja">
      <Backdrop variant="simple" />
      <div id="prog" />

      <Nav links={SUBPAGE_NAV} ctaHref="/#lomake" ctaLabel="Pyydä tarjous" logoHref="/" />

      <div className="wrap crumbs">
        <nav aria-label="Murupolku">
          <ol>
            <li>
              <SmartLink href="/">Etusivu</SmartLink>
            </li>
            <li aria-current="page">Tietosuojaseloste</li>
          </ol>
        </nav>
      </div>

      <header className="ts-head">
        <div className="wrap-n">
          <span className="kick li d1">WS Media Oy · Tietosuoja</span>
          <h1 className="li d2">Tietosuojaseloste</h1>
          <p className="ts-meta li d3">Laadittu 26.8.2026 · Sisäinen luonnos</p>

          {/*
            Lahdedokumentin oma varoitus. Sailytetty tarkoituksella: seloste ei
            ole juridisesti tarkistettu eika hakasulkeissa olevia kohtia ole
            taytetty. Poista tama vasta kun molemmat on hoidettu.
          */}
          <div className="ts-warn li d4" role="note">
            <b>Luonnos</b>
            <p>
              Tämä dokumentti on rakennettu GDPR:n ja Suomen tietoyhteiskuntakaaren vakiorakenteen
              mukaan, mutta se ei korvaa oikeudellista tarkistusta. Kaikki hakasulkeissa [ ] olevat
              kohdat pitää täyttää tai vahvistaa ennen julkaisua.
            </p>
          </div>
        </div>
      </header>

      <div className="wrap-n ts-doc">
        {beforeCookies.map((s) => (
          <SectionBlock key={s.n} n={s.n} title={s.title}>
            {s.body}
          </SectionBlock>
        ))}

        <SectionBlock n={7} title="Käytössä olevat evästeet ja seurantatyökalut">
          <p>
            Verkkosivustolla käytetään seuraavia kolmannen osapuolen palveluita, jotka voivat
            asettaa evästeitä laitteellesi:
          </p>
          <div className="ts-tablewrap">
            <table className="ts-table">
              <thead>
                <tr>
                  <th scope="col">Palvelu</th>
                  <th scope="col">Tarkoitus</th>
                  <th scope="col">Tietojen käsittelijä</th>
                </tr>
              </thead>
              <tbody>
                {COOKIE_ROWS.map((r) => (
                  <tr key={r.service}>
                    <th scope="row">{r.service}</th>
                    <td>{r.purpose}</td>
                    <td>{r.processor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Ei-välttämättömät evästeet (analytiikka ja markkinointi) asetetaan vasta kävijän
            annettua suostumuksensa evästebannerin kautta. Voit milloin tahansa muuttaa
            suostumustasi:{" "}
            <CookieSettingsButton label="avaa evästeasetukset" />
          </p>
        </SectionBlock>

        {afterCookies.map((s) => (
          <SectionBlock key={s.n} n={s.n} title={s.title}>
            {s.body}
          </SectionBlock>
        ))}
      </div>

      <Footer
        intro="Lyhytvideotuotanto, verkkosivut ja tapahtumat yrityksille. Espoo ja Helsinki, koko Suomi."
        columns={SUBPAGE_FOOTER}
        base="© 2026 WS Media Oy · Y-tunnus 3615084-4 · Espoo"
      />

      <SiteEffects />
    </div>
  );
}
