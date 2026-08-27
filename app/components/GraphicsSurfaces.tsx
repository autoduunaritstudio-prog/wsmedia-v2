/**
 * Kevennetty pintanayttamo etusivun Palvelut-paneeliin: kaksi neljasta
 * pinnasta ja kiintea brandivari. Taysi nelipintainen versio ja sen
 * varivalahdys jaavat graafinen-suunnittelu-sivulle - etusivulla ei ole
 * syyta pyorittaa toista ajastinta eika ladata kahta ylimaaraista SVG:ta.
 */
export default function GraphicsSurfaces() {
  return (
    <div className="gsurf" aria-label="Havainnekuva: sama yritysilme käyntikortissa ja roll-upissa">
      <div className="scard">
      <span className="tag">Käyntikortti</span>
      <svg viewBox="0 0 420 252" role="img" aria-label="Käyntikortti yrityksen ilmeellä">
      <defs>
      <linearGradient id="cw" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#f6f6fa"/>
      </linearGradient>
      <filter id="csh" x="-25%" y="-25%" width="150%" height="170%">
      <feDropShadow dx="0" dy="9" stdDeviation="11" floodColor="#1d1d1f" floodOpacity=".2"/>
      </filter>
      </defs>

      {/* takakortti, brändipuoli */}
      <g transform="rotate(-8 175 110)" filter="url(#csh)">
      <rect className="bf" x="50" y="34" width="248" height="150" rx="11"/>
      <g transform="translate(157,92)">
      <rect x="0" y="0" width="34" height="34" rx="9" fill="#ffffff" opacity=".96"/>
      <path className="bf" d="M9 25 L17 9 L25 25 Z"/>
      </g>
      <rect x="134" y="141" width="80" height="5" rx="2.5" fill="#ffffff" opacity=".5"/>
      </g>

      {/* etukortti */}
      <g transform="rotate(4 235 146)" filter="url(#csh)">
      <rect x="112" y="72" width="248" height="150" rx="11" fill="url(#cw)" stroke="#e6e6ec"/>
      <path className="bf" d="M112 205 H360 V211 A11 11 0 0 1 349 222 H123 A11 11 0 0 1 112 211 Z"/>
      <g transform="translate(136,96)">
      <rect className="bf" x="0" y="0" width="30" height="30" rx="8"/>
      <path d="M8 22 L15 8 L22 22 Z" fill="#ffffff"/>
      </g>
      <text x="176" y="112" fontSize="15" fontWeight="700" fill="#1d1d1f" letterSpacing="-.3">Yrityksesi Oy</text>
      <text x="176" y="126" fontSize="8" fontWeight="600" fill="#9a9aa1" letterSpacing="1.6">RAKENNUS JA SANEERAUS</text>
      <line x1="136" y1="146" x2="336" y2="146" stroke="#ececf1" strokeWidth="1"/>
      <text x="136" y="168" fontSize="11.5" fontWeight="600" fill="#1d1d1f">Matti Meikäläinen</text>
      <text x="136" y="183" fontSize="9.5" fill="#8a8a90">Toimitusjohtaja</text>
      <text x="336" y="168" fontSize="9.5" fill="#6e6e73" textAnchor="end">040 123 4567</text>
      <text x="336" y="183" fontSize="9.5" fill="#6e6e73" textAnchor="end">matti@yrityksesi.fi</text>
      </g>
      </svg>
      </div>
      <div className="scard">
      <span className="tag">Roll-up</span>
      <svg viewBox="0 0 300 300" role="img" aria-label="Roll-up-banneri yrityksen ilmeellä">
      <defs>
      <linearGradient id="rw" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#f4f5f8"/>
      </linearGradient>
      <linearGradient id="rbase" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#e6e9ee"/><stop offset="1" stopColor="#c3c8d1"/>
      </linearGradient>
      <filter id="rsh" x="-40%" y="-15%" width="180%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#1d1d1f" floodOpacity=".18"/>
      </filter>
      <filter id="gsh" x="-60%" y="-300%" width="220%" height="700%">
      <feGaussianBlur stdDeviation="6"/>
      </filter>
      </defs>

      <ellipse cx="150" cy="276" rx="96" ry="9" fill="#1d1d1f" opacity=".16" filter="url(#gsh)"/>

      {/* tukitanko */}
      <rect x="147" y="34" width="6" height="230" fill="#cfd4dc"/>

      <g filter="url(#rsh)">
      {/* yläkisko */}
      <rect x="70" y="28" width="160" height="8" rx="4" fill="#c3c8d1"/>
      <rect x="70" y="33" width="160" height="3" rx="1.5" fill="#a9b0ba" opacity=".7"/>
      {/* kangas */}
      <rect x="76" y="34" width="148" height="228" rx="3" fill="url(#rw)" stroke="#e4e6ec"/>
      {/* brändialue, aaltoileva alareuna */}
      <path className="bf" d="M76 34 H224 V138 C190 156 110 156 76 138 Z"/>
      <path className="bft" d="M76 122 C110 140 190 140 224 122 V138 C190 156 110 156 76 138 Z" opacity=".55"/>
      {/* tunnus */}
      <g transform="translate(130,58)">
      <rect x="0" y="0" width="40" height="40" rx="11" fill="#ffffff" opacity=".96"/>
      <path className="bf" d="M11 30 L20 11 L29 30 Z"/>
      </g>
      <text x="150" y="120" fontSize="15" fontWeight="700" fill="#ffffff" textAnchor="middle" letterSpacing=".4">YRITYKSESI OY</text>
      {/* leipäteksti */}
      <text x="150" y="182" fontSize="12.5" fontWeight="700" fill="#1d1d1f" textAnchor="middle" letterSpacing="-.2">Palvelemme koko Suomessa</text>
      <text x="150" y="200" fontSize="9" fill="#8a8a90" textAnchor="middle" letterSpacing=".3">Suunnittelu · Tuotanto · Asennus</text>
      <line x1="112" y1="212" x2="188" y2="212" stroke="#e8eaef" strokeWidth="1"/>
      <rect className="bf" x="104" y="224" width="92" height="21" rx="10.5"/>
      <text x="150" y="238" fontSize="9.5" fontWeight="600" fill="#ffffff" textAnchor="middle">yrityksesi.fi</text>
      </g>

      {/* jalusta */}
      <rect x="60" y="260" width="180" height="15" rx="6" fill="url(#rbase)" stroke="#b9bfc9"/>
      <rect x="60" y="266" width="180" height="9" rx="4" fill="#aeb5c0" opacity=".45"/>
      <ellipse cx="78" cy="277" rx="12" ry="4" fill="#b9bfc9"/>
      <ellipse cx="222" cy="277" rx="12" ry="4" fill="#b9bfc9"/>
      </svg>
      </div>
    </div>
  );
}
