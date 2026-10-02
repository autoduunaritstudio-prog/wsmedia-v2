/* NAKYVYYS-KORTTIEN NAYTOT (2.10.2026).
   Jokainen kortti nayttaa sen asian josta se puhuu, sellaisena kuin
   lukija sen oikeasti nakee: PageSpeed-mittari, sivuston linkkikartta,
   Googlen hakutulos ja puhelimen soittonappi. Liike kaynnistyy kerran
   kun kortti tulee nakyviin (.rv.on), ja jokaisessa on yksi hidas
   jatkuva liike joka kertoo mita tapahtuu (indeksoija kulkee
   linkkeja pitkin, kavija napauttaa soittonappia).

   Luvut ovat esimerkkeja eivatka mittaustuloksia, ja ne on merkitty
   nayttoon sanalla "esimerkki" tai "tavoite". */

import type { CSSProperties, ReactNode } from "react";

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

function Nopeus() {
  const MITAT: Array<[string, string, number]> = [
    ["Ensimmäinen näkymä", "0,8 s", 0.34],
    ["Suurin elementti", "1,4 s", 0.52],
    ["Asettelun siirtymä", "0", 0.08],
  ];
  return (
    <div className="np-nopeus">
      <div className="np-mittari">
        <svg viewBox="0 0 100 100">
          <circle className="np-m-rata" cx="50" cy="50" r="42" />
          <circle className="np-m-kaari" cx="50" cy="50" r="42" pathLength={100} />
        </svg>
        <b className="np-m-luku" />
        <span className="np-m-ala">mobiili</span>
      </div>
      <ul className="np-mitat">
        {MITAT.map(([n, v, w], i) => (
          <li key={n} style={d(0.5 + i * 0.18)}>
            <span>{n}</span>
            <b>{v}</b>
            <i style={{ "--w": w } as CSSProperties} />
          </li>
        ))}
        <li className="np-tavoite">PageSpeed-tavoite, esimerkki</li>
      </ul>
    </div>
  );
}

function Rakenne() {
  /* Puu: etusivu ylhaalla, kolme palvelusivua ja yhteystiedot. Polut
     ovat samat joita pitkin indeksoijan piste kulkee. */
  const POLKU = "M150 34 V58 H54 V84 M150 58 H246 V84 M150 58 V84";
  return (
    <svg className="np-puu" viewBox="0 0 300 150" preserveAspectRatio="xMidYMid meet">
      <path className="np-p-viiva" d={POLKU} pathLength={1} />
      <path className="np-p-viiva np-p-2" d="M54 106 V122 M246 106 V122" pathLength={1} />
      <g className="np-p-solmu np-p-juuri" style={d(0)}>
        <rect x="104" y="10" width="92" height="24" rx="7" />
        <text x="150" y="26">etusivu</text>
      </g>
      {[
        [54, "/putkiremontit"],
        [150, "/lvi-huolto"],
        [246, "/viemärit"],
      ].map(([x, t], i) => (
        <g className="np-p-solmu" style={d(0.55 + i * 0.12)} key={t as string}>
          <rect x={(x as number) - 46} y="84" width="92" height="22" rx="6" />
          <text x={x as number} y="99">
            {t}
          </text>
        </g>
      ))}
      {[
        [54, "hinnat"],
        [246, "yhteystiedot"],
      ].map(([x, t], i) => (
        <g className="np-p-solmu np-p-pieni" style={d(1 + i * 0.12)} key={t as string}>
          <rect x={(x as number) - 38} y="122" width="76" height="18" rx="5" />
          <text x={x as number} y="135">
            {t}
          </text>
        </g>
      ))}
      {/* Indeksoija: piste kulkee linkkeja pitkin etusivulta alas. */}
      <circle className="np-p-botti" r="4">
        <animateMotion dur="5.2s" repeatCount="indefinite" path="M150 34 V58 H54 V84 V106 V122 V106 V84 V58 H246 V84 V106 V122 V106 V84 V58 H150 V84 V58 V34" />
      </circle>
    </svg>
  );
}

function Haku() {
  return (
    <div className="np-haku">
      <div className="np-h-kentta">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </svg>
        <span className="np-h-sana">
          <span>kotisivut espoo</span>
        </span>
      </div>
      <ol className="np-h-tulokset">
        <li className="np-h-muu" style={{ "--y": 0, "--y2": 1 } as CSSProperties}>
          <small>kilpailija-a.fi</small>
          <i />
        </li>
        <li className="np-h-muu" style={{ "--y": 1, "--y2": 2 } as CSSProperties}>
          <small>kilpailija-b.fi</small>
          <i />
        </li>
        <li className="np-h-oma" style={{ "--y": 2, "--y2": 0 } as CSSProperties}>
          <small>wsmedia.fi</small>
          <b>Kotisivut yritykselle Espoossa</b>
        </li>
      </ol>
    </div>
  );
}

function Puhelin() {
  return (
    <div className="np-kokemus">
      <div className="np-puhelin">
        <i className="np-ph-kuva" />
        <i className="np-ph-rivi" />
        <i className="np-ph-rivi np-ph-lyhyt" />
        <span className="np-ph-nappi">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" />
          </svg>
          Soita
        </span>
        <span className="np-ph-sormi" />
      </div>
      <div className="np-ilmoitus">
        <b>Uusi yhteydenotto</b>
        <span>Puhelu verkkosivuilta</span>
      </div>
    </div>
  );
}

export const NAKYVYYS_NAYTOT: ReactNode[] = [
  <Nopeus key="n" />,
  <Rakenne key="r" />,
  <Haku key="h" />,
  <Puhelin key="p" />,
];

/* Kortin ylaosan merkinta ja iso luku, samassa muodossa kuin
   Lyhytvideoiden Miksi-korteissa. */
export const NAKYVYYS_OTSAKE: Array<{ kick: string; luku: string }> = [
  { kick: "Latausnopeus", luku: "90+" },
  { kick: "Rakenne", luku: "Oma sivu" },
  { kick: "Hakusanat", luku: "Sivu 1" },
  { kick: "Käyttäjäkokemus", luku: "1 napautus" },
];
