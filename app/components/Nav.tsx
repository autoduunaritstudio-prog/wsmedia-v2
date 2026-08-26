/**
 * Navigaatio. Koko rakenne (ylapalkki + taysvalikko) on FullscreenNavissa,
 * koska overlay on renderoitava <nav>:n ULKOPUOLELLE: navilla on
 * backdrop-filter, ja se tekee elementista containing blockin
 * position: fixed -jalkelaisille. Jos overlay on navin sisalla, se puristuu
 * palkin korkuiseksi eika peita ruutua.
 */
export { default } from "./FullscreenNav";
