/**
 * Kiinteä taustakuvio. Staattinen markup; liikkeen hoitaa SiteEffects
 * suoraan skrollin funktiona (ks. app/components/SiteEffects.tsx).
 */
export default function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <svg id="bdSvg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
        {/* hienovarainen mittaruudukko, liukuu hitaasti skrollin mukana */}
        <g id="bdGrid" stroke="#e4e4e9" strokeWidth="1">
          <line x1="0" y1="150" x2="1440" y2="150" />
          <line x1="0" y1="450" x2="1440" y2="450" />
          <line x1="0" y1="750" x2="1440" y2="750" />
          <line x1="240" y1="0" x2="240" y2="900" />
          <line x1="720" y1="0" x2="720" y2="900" />
          <line x1="1200" y1="0" x2="1200" y2="900" />
        </g>
        {/* tekninen kehysrakennelma, vasen: piirtyy skrollin mukaan */}
        <g stroke="#c7c7ce" strokeWidth="1.3">
          <path id="bdP1" d="M 90 90 L 90 340 L 340 340" pathLength="100" strokeDasharray="100" />
          <path id="bdP2" d="M 90 90 L 340 90" pathLength="100" strokeDasharray="100" />
          <circle cx="90" cy="90" r="3" fill="#c7c7ce" stroke="none" />
          <circle cx="340" cy="340" r="3" fill="#c7c7ce" stroke="none" />
          <path d="M 140 210 L 260 210" strokeDasharray="3 5" />
        </g>
        {/* tekninen kehysrakennelma, oikea yläkulma */}
        <g stroke="#c7c7ce" strokeWidth="1.3">
          <path id="bdP3" d="M 1150 60 L 1380 60 L 1380 260" pathLength="100" strokeDasharray="100" />
          <circle cx="1150" cy="60" r="3" fill="#c7c7ce" stroke="none" />
          <circle cx="1380" cy="260" r="3" fill="#c7c7ce" stroke="none" />
          <path d="M 1230 60 L 1230 160" strokeDasharray="3 5" />
        </g>
        {/* kelluva rengasmerkki, keskiylä: pyörii skrollin mukaan */}
        <g id="bdRing" transform="translate(770,110)">
          <circle cx="0" cy="0" r="46" stroke="#d6d6dc" strokeWidth="1.2" strokeDasharray="5 9" />
          <circle cx="0" cy="-46" r="3" fill="#bcbcc4" />
        </g>
        {/* pitkä diagonaalinen linjapari, oikea alakulma */}
        <g stroke="#c7c7ce" strokeWidth="1.3">
          <path id="bdP4" d="M 1180 650 L 1360 780" pathLength="100" strokeDasharray="100" />
          <path d="M 1180 650 L 1120 800" />
          <circle cx="1180" cy="650" r="3" fill="#c7c7ce" stroke="none" />
        </g>
        {/* pieni koordinaattisolmu, vasen alakulma */}
        <g stroke="#c7c7ce" strokeWidth="1.3">
          <path id="bdP5" d="M 210 760 L 210 860 L 400 860" pathLength="100" strokeDasharray="100" />
          <circle cx="210" cy="760" r="3" fill="#c7c7ce" stroke="none" />
          <circle cx="400" cy="860" r="3" fill="#c7c7ce" stroke="none" />
        </g>
        {/* pitkä ohut ura-viiva, liikkuu skrollin mukana */}
        <path
          id="bdWave"
          d="M 0 500 C 260 470, 520 540, 780 500 S 1200 460, 1440 505"
          stroke="#dedee3"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
