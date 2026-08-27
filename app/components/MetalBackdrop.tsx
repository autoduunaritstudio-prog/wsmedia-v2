/**
 * Etusivun taustakuvio.
 *
 * KAKSI VERSIOTA, VAIHDETTAVISSA YHDELLA PROPILLA:
 *   <MetalBackdrop />                 -> "facets", uusi fasettikuvio
 *   <MetalBackdrop variant="blobs" /> -> vanha kaarilohkokuvio
 * Ja edelleen: vaihtamalla koko komponentin <Backdrop />:ksi app/page.tsx:ssa
 * palautuu alkuperainen taustakuvio. SiteEffects kysyy kaikkia kerroksia
 * erikseen ja muuttuu no-opiksi niiden osalta joita ei ole.
 *
 * ---------------------------------------------------------------------
 * FACETS (uusi)
 *
 * Rakenne on kaannetty vanhaan nahden. Vanhassa TUMMA muoto piirrettiin
 * vaalealle pohjalle, jolloin koko pinta oli suunnilleen yhta tumma ja
 * teksti tarvitsi joka kohdassa oman lasilevynsa. Tassa pohjana on
 * paallekkain kaksi asiaa:
 *
 *   1. .metalbd-glow - sävyliuku jossa KESKUSTA ON TAYSIN LAPINAKYVA eli
 *      sivun oma valkoinen. Tummuus kasvaa ulospain reunoja kohti. Kirkas
 *      alue ei siis ole maalattu vaaleaksi vaan se on aukko kuviossa,
 *      joten sen paalla kontrasti on tasan sama kuin puhtaalla valkoisella.
 *
 *   2. .metalbd-facets - viisi isoa ympyraa joiden kaaret leikkaavat
 *      toisensa ja jakavat pinnan fasetteihin. Kukin ympyra tuo oman
 *      tayttonsa (hiukan tummempi tai vaaleampi) ja reunalleen ohuen
 *      valkoisen hiusviivan. Hiusviiva on vector-effect="non-scaling-
 *      stroke", joten se on tasan 1px riippumatta siita kuinka paljon
 *      viewBox skaalautuu - juuri se terava saumaviiva jota referenssissa
 *      on, ei sumea reuna.
 *
 * Kirkkaan alueen paikkaa ohjataan muuttujilla --mb-gx / --mb-gy, ja
 * SiteEffects siirtaa --mb-gy:ta skrollin mukana niin etta kirkas kohta
 * pysyy aina nakymakeskuksessa. Luettavuus ei siis riipu siita mihin
 * kohtaan kuviota teksti sattuu osumaan.
 *
 * Kohinaa (feTurbulence) EI ole: referenssi on sileä sävyliuku. Vanha
 * .metalbd-noise on yha olemassa blobs-versiota varten.
 */

type Props = { variant?: "facets" | "blobs" };

export default function MetalBackdrop({ variant = "facets" }: Props) {
  if (variant === "blobs") {
    return (
      <div className="metalbd" aria-hidden="true">
        <div className="metalbd-blob metalbd-a" />
        <div className="metalbd-blob metalbd-b" />
        <div className="metalbd-sweep" />
        <svg className="metalbd-noise" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="metalNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#metalNoise)" />
        </svg>
      </div>
    );
  }

  return (
    <div className="metalbd metalbd-v2" aria-hidden="true">
      <div className="metalbd-glow" />
      <svg
        className="metalbd-facets"
        viewBox="0 0 1200 1600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sateet ovat viewBoxia isompia, joten viewBoxin sisalle jaa vain
            kaaren loiva osa - ei koskaan tunnistettavaa ympyraa. Keskipisteet
            ovat reunojen ulkopuolella samasta syysta. */}
        <g fill="none" stroke="rgba(255,255,255,.62)" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <circle cx="-200" cy="-500" r="1300" fill="rgba(255,255,255,.055)" />
          <circle cx="1700" cy="-300" r="1350" fill="rgba(10,10,12,.075)" />
          <circle cx="600" cy="2600" r="1750" fill="rgba(255,255,255,.07)" />
          <circle cx="1900" cy="1500" r="1250" fill="rgba(10,10,12,.085)" />
          <circle cx="-500" cy="1400" r="900" fill="rgba(10,10,12,.10)" />
        </g>
      </svg>
    </div>
  );
}
