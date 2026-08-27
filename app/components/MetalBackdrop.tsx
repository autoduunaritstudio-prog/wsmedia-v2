/**
 * Etusivun taustakuvio: harjatun metallin sävyinen S-käyrä.
 *
 * KOKEILU — helposti peruttavissa: tama korvaa etusivulla <Backdrop />:n
 * yhdella rivilla app/page.tsx:ssa. Vaihtamalla importin takaisin vanha
 * taustakuvio palaa sellaisenaan; SiteEffectsin vanha scrub kysyy
 * elementteja id:lla ja muuttuu no-opiksi kun niita ei ole.
 *
 * Muodot ovat CSS-gradientteja eivat SVG-polkuja: pehmeareunainen
 * radial-gradient on kevyempi rasteroida kuin blur-suodatettu SVG-polku,
 * ja sita voi siirtaa transformilla ilman uudelleenpiirtoa.
 *
 * Kohina on ainoa SVG: feTurbulence taysleveana suodattimena, staattinen,
 * joten se rasteroidaan kertaalleen. Se antaa pinnalle harjatun metallin
 * tunnun jota pelkka gradientti ei anna.
 *
 * Liikkeen hoitaa SiteEffects samassa rAF-silmukassa kuin muutkin
 * scroll-efektit, pelkilla transformeilla.
 */
export default function MetalBackdrop() {
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
