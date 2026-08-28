/**
 * KOKEILU: tikku-ukko joka "vie" logon ja valikkopainikkeen mukanaan kun
 * ne piiloutuvat logonauhan kohdalla, ja tuo ne takaisin kun nav palautuu.
 *
 * POISTO YHDELLA RIVILLA: poista <NavCarrier /> FullscreenNav.tsx:sta.
 * Komponentti ja sen CSS-lohko (".carrier" globals.css:ssa) ovat itsenaisia
 * eivatka mitkaan muut saannot viittaa niihin. SiteEffectsin
 * data-carrier-lippu jaa harmittomaksi: ilman .carrier-elementtia sita ei
 * lue kukaan.
 *
 * EI OMAA SCROLL-LASKENTAA. Koko sekvenssi kytkeytyy .nav-away-luokkaan,
 * jonka nav-hide-logiikka jo togglaa .logostripin rectista samoilla
 * NAV_HIDE_BUFFER_IN / NAV_SHOW_BUFFER_OUT -arvoilla. Suunta valitaan
 * CSS:ssa: luokan ollessa paalla soi carry-out, sen puuttuessa carry-in.
 */
export default function NavCarrier() {
  return (
    <span className="carrier" aria-hidden="true">
      <svg viewBox="0 0 40 46" fill="none" stroke="currentColor" strokeWidth="2">
        {/* Pelkkaa viivapiirrosta: ympyrapaa ja neljä raajaa. Paa on
            erikseen jotta se ei kierry kasien mukana. */}
        <circle cx="20" cy="7" r="5.5" />
        <path d="M20 12.5 V28" strokeLinecap="round" />
        <path d="M20 28 L13 43 M20 28 L27 43" strokeLinecap="round" />
        <g className="carrier-arms">
          <path d="M20 17 L11 23 M20 17 L29 23" strokeLinecap="round" />
        </g>
      </svg>
    </span>
  );
}
