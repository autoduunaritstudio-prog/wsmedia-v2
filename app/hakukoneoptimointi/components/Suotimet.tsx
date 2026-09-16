/**
 * SVG-SUODINMAARITTELYT.
 *
 * INLINE SAMASSA DOKUMENTISSA, EI OMANA TIEDOSTONAAN. Safari ei tue
 * muotoa filter: url("tiedosto.svg#id") HTML-elementeilla lainkaan:
 * suodin jaa hiljaa pois ja kuvat nakyvat varillisina. Ainoa muoto
 * joka toimii kaikkialla on inline-SVG samassa dokumentissa, joten
 * tama komponentti renderoidaan kerran sivun alkuun.
 *
 * TRITONI EIKA DUOTONI. Kaksi paatepistetta (musta ja syaani) litistaa
 * keskisavyt, ja valokuvissa juuri keskisavyt kantavat muodon. Kolmas
 * piste sinisella pitaa ne elossa. Jokainen tableValues-luku on yhden
 * varin yksi kanava jaettuna 255:lla, jarjestyksessa tummasta
 * vaaleaan:
 *   #11151a = 17, 21, 26   -> .06667 .08235 .10196
 *   #007c8f =  0, 124, 143 -> 0      .48627 .56078
 *   #6fecff = 111, 236, 255 -> .43529 .92549 1
 * Nain minka tahansa savyn voi johtaa uudelleen ilman arvailua.
 *
 * color-interpolation-filters="sRGB" on PAKOLLINEN. Ilman sita selain
 * laskee linearRGB:ssa ja keskisavyt haalistuvat pesuveden varisiksi.
 *
 * Harmaasavymuunnos kayttaa luminanssipainoja (.2126 .7152 .0722) eika
 * kolmasosia: kolmasosilla ihmisen iho ja punaiset pinnat tummuvat
 * vaarin.
 */
export default function Suotimet() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", pointerEvents: "none" }}
    >
      <defs>
        <filter id="seo-tritoni" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0      0      0      1 0"
          />
          <feComponentTransfer colorInterpolationFilters="sRGB">
            <feFuncR type="table" tableValues="0.06667 0 0.43529" />
            <feFuncG type="table" tableValues="0.08235 0.48627 0.92549" />
            <feFuncB type="table" tableValues="0.10196 0.56078 1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
