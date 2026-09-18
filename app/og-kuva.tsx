import { ImageResponse } from "next/og";

/**
 * JAKOKUVA GENEROIDAAN, EI TALLENNETA.
 *
 * Lyhytvideosivun og:image osoitti tiedostoon /og/lyhytvideotuotanto-
 * yrityksille.jpg, jota ei ole olemassa: koko public/og-kansiota ei
 * ollut, ja kuva palautti 404:n. Verkkosivuilla og:image puuttui
 * kokonaan ja twitter:card oli pieni "summary". Kumpikin sivu nayttaa
 * siis jaettuna pelkalta tekstilta.
 *
 * Kuvan voisi piirtaa kasin ja tallentaa publiciin, mutta silloin se
 * on kaksi tiedostoa jotka vanhenevat erikseen otsikoiden kanssa.
 * Nextin ImageResponse piirtaa sen kaannoksessa samasta tekstista
 * jota sivu muutenkin kayttaa, jolloin kuva ei voi kertoa eri asiaa
 * kuin sivu.
 *
 * 1200x630 on se koko jonka seka Facebook, LinkedIn etta X lukevat.
 * Varit ovat sivuston omat: pohja #0b0f14, teksti #f4f7fa, korostus
 * #6fecff.
 */
export const OG_KOKO = { width: 1200, height: 630 };
export const OG_TYYPPI = "image/png";

export function ogKuva({ kick, otsikko, korostus }: { kick: string; otsikko: string; korostus: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0f14",
          padding: "72px 80px",
          color: "#f4f7fa",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#6fecff",
            }}
          >
            {kick}
          </div>
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1.08, letterSpacing: -2 }}>
            {otsikko}
          </div>
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1.08, letterSpacing: -2, color: "#6fecff" }}>
            {korostus}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a9b8c6" }}>
          <div style={{ display: "flex", color: "#f4f7fa", letterSpacing: 4 }}>WS MEDIA</div>
          <div style={{ display: "flex" }}>Espoo · Helsinki · koko Suomi</div>
        </div>
      </div>
    ),
    OG_KOKO,
  );
}
