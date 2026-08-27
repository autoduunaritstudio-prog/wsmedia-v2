"use client";

import { useEffect, useState, type CSSProperties } from "react";

/**
 * Pintanayttamo: sama yritysilme neljalla pinnalla yhta aikaa.
 *
 * Brandivari vaihtuu synkronoidusti kaikilla pinnoilla, koska kaikki nelja
 * SVG:ta lukevat samaa --brand-muuttujaa (.bf/.bft/.bfd/.bs ja .pal span).
 * Muuttuja asetetaan Reactin tilasta juuridiviin, joten DOMia ei kosketa
 * kasin. CSS hoitaa 0.8s pehmennyksen.
 *
 * TAMA EI OLE SCROLL-SIDOTTU: pelkka ajastin, ei mitaan yhteytta
 * SiteEffectsin rAF-silmukkaan eika Lenisiin.
 */

const COLORS = ["#0071e3", "#1f8a70", "#6d4aff", "#c4553a"];
const PERIOD = 4200;

export default function Stage() {
  const [i, setI] = useState(0);

  useEffect(() => {
    // prefers-reduced-motion: vari jaa ensimmaiseen eika valahtele.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % COLORS.length), PERIOD);
    return () => window.clearInterval(id);
  }, []);

  const brandStyle = { "--brand": COLORS[i] } as CSSProperties;

  return (
      <div
          className="stage li d5"
          data-par="-0.025"
          style={brandStyle} aria-label="Havainnekuva: sama yritysilme käyntikortissa, pakettiautossa, julkisivussa ja roll-upissa">
        <div className="pal" aria-hidden="true">
          <b>Ilme</b>
          <span /><span /><span /><span /><span />
        </div>

        <div className="surf">
          <div className="surfcol">

            {/* ---------- KÄYNTIKORTTI ---------- */}
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

            {/* ---------- ROLL-UP ---------- */}
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

          <div className="surfcol">

            {/* ---------- PAKETTIAUTO ---------- */}
            <div className="scard">
              <span className="tag">Pakettiauto</span>
              <svg viewBox="0 0 580 236" role="img" aria-label="Teipattu pakettiauto yrityksen ilmeellä">
                <defs>
                  <linearGradient id="vb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ffffff"/><stop offset=".55" stopColor="#f3f5f8"/><stop offset="1" stopColor="#e2e6ec"/>
                  </linearGradient>
                  <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#4a5563"/><stop offset="1" stopColor="#8a95a4"/>
                  </linearGradient>
                  <filter id="vsh" x="-20%" y="-40%" width="140%" height="220%">
                    <feGaussianBlur stdDeviation="7"/>
                  </filter>
                  <clipPath id="wrapclip">
                    <path d="M244 83 L509 83 L509 176 L486 176 C486 150 470 141 448 141 C426 141 410 150 410 176 L244 176 Z"/>
                  </clipPath>
                </defs>

                <ellipse cx="292" cy="216" rx="238" ry="10" fill="#1d1d1f" opacity=".16" filter="url(#vsh)"/>

                {/* kori */}
                <path fill="url(#vb)" stroke="#cfd5de" strokeWidth="1.5" d="M62 182 L60 148 C60 137 64 132 74 131 L102 127 L138 80 C140 77 144 75 149 75 L506 75 C513 78 517 82 517 89 L517 182 L486 182 C486 152 470 142 448 142 C426 142 410 152 410 182 L188 182 C188 152 172 142 150 142 C128 142 112 152 112 182 Z"/>
                {/* kattoheijastus */}
                <path d="M153 78 H504" stroke="#ffffff" strokeWidth="3" opacity=".9" strokeLinecap="round"/>
                {/* helman varjo */}
                <path d="M112 174 H517 V182 H112 Z" fill="#0d0d10" opacity=".05"/>

                {/* teippaus */}
                <g clipPath="url(#wrapclip)">
                  <path className="bf" d="M244 83 L509 83 L509 176 L244 176 Z"/>
                  <path className="bft" d="M352 78 L404 78 L330 182 L278 182 Z" opacity=".45"/>
                  <path className="bfd" d="M404 78 L426 78 L352 182 L330 182 Z" opacity=".5"/>
                  <g transform="translate(264,100)">
                    <rect x="0" y="0" width="36" height="36" rx="10" fill="#ffffff" opacity=".97"/>
                    <path className="bf" d="M10 27 L18 10 L26 27 Z"/>
                  </g>
                  <text x="312" y="122" fontSize="21" fontWeight="700" fill="#ffffff" letterSpacing=".6">YRITYKSESI OY</text>
                  <text x="312" y="142" fontSize="11" fill="#ffffff" opacity=".88" letterSpacing=".3">yrityksesi.fi · 040 123 4567</text>
                </g>

                {/* ikkunat */}
                <path fill="url(#vg)" d="M110 126 L141 85 L175 85 L175 126 Z"/>
                <path fill="url(#vg)" d="M183 85 L232 85 L232 126 L183 126 Z"/>
                <path d="M116 124 L142 89 L156 89 L130 124 Z" fill="#ffffff" opacity=".22"/>
                <path d="M189 89 L206 89 L190 122 L183 122 Z" fill="#ffffff" opacity=".16"/>

                {/* yksityiskohdat */}
                <path d="M236 85 V176" stroke="#d3d8e0" strokeWidth="1.5"/>
                <rect x="200" y="138" width="22" height="5" rx="2.5" fill="#b9c0ca"/>
                <path d="M180 93 q-16 2 -18 12 q10 2 18 -2 z" fill="#c4cad4" stroke="#adb5c0" strokeWidth="1"/>
                <rect x="58" y="156" width="20" height="24" rx="5" fill="#d3d8e0"/>
                <rect x="62" y="134" width="26" height="13" rx="4" fill="#f7f9fb" stroke="#d3d8e0"/>
                <rect x="65" y="137" width="19" height="7" rx="3" fill="#dfe6ef"/>

                {/* renkaat */}
                <g>
                  <circle cx="150" cy="182" r="32" fill="#1c1c20"/>
                  <circle cx="150" cy="182" r="18" fill="#c5c9d1"/>
                  <circle cx="150" cy="182" r="14.5" fill="#e6e8ed"/>
                  <circle cx="150" cy="182" r="5" fill="#a4aab4"/>
                </g>
                <g>
                  <circle cx="448" cy="182" r="32" fill="#1c1c20"/>
                  <circle cx="448" cy="182" r="18" fill="#c5c9d1"/>
                  <circle cx="448" cy="182" r="14.5" fill="#e6e8ed"/>
                  <circle cx="448" cy="182" r="5" fill="#a4aab4"/>
                </g>
              </svg>
            </div>

            {/* ---------- JULKISIVU ---------- */}
            <div className="scard">
              <span className="tag">Julkisivu ja ikkunat</span>
              <svg viewBox="0 0 580 250" role="img" aria-label="Liiketilan julkisivu ja ikkunateippaus yrityksen ilmeellä">
                <defs>
                  <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#cfdbe8"/><stop offset=".5" stopColor="#e2eaf2"/><stop offset="1" stopColor="#d3dde8"/>
                  </linearGradient>
                  <linearGradient id="wallg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#f1f3f6"/><stop offset="1" stopColor="#e4e7ec"/>
                  </linearGradient>
                  <filter id="glow" x="-40%" y="-80%" width="180%" height="300%">
                    <feGaussianBlur stdDeviation="2.6" result="b"/>
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <clipPath id="gclip"><rect x="42" y="94" width="312" height="118" rx="2"/></clipPath>
                </defs>

                {/* seinä */}
                <rect x="0" y="0" width="580" height="214" fill="url(#wallg)"/>
                <path d="M0 40 H580 M0 78 H580" stroke="#dcdfe5" strokeWidth="1"/>

                {/* julkisivukyltti */}
                <rect x="0" y="14" width="580" height="56" fill="#fbfcfd"/>
                <path d="M0 70 H580" stroke="#d7dae1" strokeWidth="1.5"/>
                <g filter="url(#glow)">
                  <g transform="translate(204,26)">
                    <rect className="bf" x="0" y="0" width="30" height="30" rx="8"/>
                    <path d="M8 22 L15 8 L22 22 Z" fill="#ffffff"/>
                  </g>
                  <text className="bf" x="244" y="47" fontSize="22" fontWeight="700" letterSpacing=".6">YRITYKSESI OY</text>
                </g>

                {/* näyteikkuna */}
                <rect x="38" y="90" width="320" height="126" rx="3" fill="#b9c1cc"/>
                <rect x="42" y="94" width="312" height="118" rx="2" fill="url(#glass)"/>
                <g clipPath="url(#gclip)">
                  <rect x="42" y="94" width="312" height="9" fill="#0d0d10" opacity=".13"/>
                  <path d="M60 212 L150 94 L196 94 L106 212 Z" fill="#ffffff" opacity=".38"/>
                  <path d="M214 212 L304 94 L326 94 L236 212 Z" fill="#ffffff" opacity=".22"/>
                  {/* ikkunateippaus */}
                  <rect x="42" y="150" width="312" height="38" fill="#ffffff" opacity=".78"/>
                  <text className="bf" x="276" y="175" fontSize="13" fontWeight="700" textAnchor="middle" letterSpacing=".8">AVOINNA MA–PE 8–17</text>
                  <g transform="translate(64,106)">
                    <rect className="bf" x="0" y="0" width="30" height="30" rx="8"/>
                    <path d="M8 22 L15 8 L22 22 Z" fill="#ffffff"/>
                  </g>
                  <text className="bf" x="104" y="128" fontSize="15" fontWeight="700" letterSpacing=".4">YRITYKSESI OY</text>
                </g>
                <path d="M198 94 V212" stroke="#b9c1cc" strokeWidth="5"/>

                {/* ovi */}
                <rect x="386" y="90" width="104" height="126" rx="3" fill="#b9c1cc"/>
                <rect x="390" y="94" width="96" height="118" rx="2" fill="url(#glass)"/>
                <rect x="390" y="94" width="96" height="8" fill="#0d0d10" opacity=".13"/>
                <path d="M396 212 L452 94 L470 94 L414 212 Z" fill="#ffffff" opacity=".3"/>
                <rect x="470" y="122" width="6" height="40" rx="3" fill="#8d95a1"/>
                <rect className="bf" x="390" y="180" width="96" height="22" opacity=".92"/>
                <text x="438" y="195" fontSize="9.5" fontWeight="700" fill="#ffffff" textAnchor="middle" letterSpacing=".7">TERVETULOA</text>

                {/* pystyaccent */}
                <g transform="translate(508,96)">
                  <rect className="bf" x="0" y="0" width="46" height="46" rx="12"/>
                  <path d="M12 34 L23 12 L34 34 Z" fill="#ffffff"/>
                </g>

                {/* jalkakäytävä */}
                <rect x="0" y="206" width="580" height="8" fill="#d8dce3"/>
                <rect x="0" y="214" width="580" height="36" fill="#dfe3e9"/>
                <path d="M0 214 H580" stroke="#c9ced6" strokeWidth="1.5"/>
                <ellipse cx="290" cy="220" rx="230" ry="5" fill="#1d1d1f" opacity=".1"/>
              </svg>
            </div>
          </div>
        </div>
        <p className="stagenote">Sama tunnus, samat värit, sama typografia — riippumatta siitä mihin pintaan se päätyy.</p>
      </div>
  );
}
