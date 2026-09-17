/**
 * SIVU RAKENTUU VIERITTAESSA.
 *
 * Heron tausta ei ole kuva verkkosivusta vaan verkkosivun
 * RAKENTUMINEN. Lukija vierittaa, ja rautalankamalli piirtyy
 * osa kerrallaan: ensin kehys, sitten navigaatio, otsikko, sisalto,
 * kortit ja lopuksi footeri. Vasta kun viimeinen osa on paikallaan,
 * cover nousee sen paalle.
 *
 * Tama on sama asia jota sivu myy, tehtyna liikkeeksi. Mikaan muu
 * skrubbaus ei olisi voinut olla talla sivulla: kuva raketista tai
 * abstraktista muodosta olisi ollut koriste taman paalla.
 *
 * MEKANIIKKA. Jokainen osa saa oman ikkunansa --hero-s:sta (0..1),
 * joka tulee SiteEffectsista ja kertoo kuinka pitkalle heron oma
 * pinnattu matka on kuljettu. Ikkuna lasketaan CSS:ssa clampilla,
 * eli taalla ei ole yhtaan JS-laskentaa eika yhtaan ajastinta:
 * liike on sidottu vierintaan ja purkautuu samaa rataa takaisin.
 *
 * pathLength="1" tekee viivan piirtymisesta yksikotonta, joten
 * polkujen todellisia pituuksia ei tarvitse mitata.
 */

/** Osan jarjestysnumero 0..N-1 annetaan CSS-muuttujana, ja CSS
 *  johtaa siita ikkunan alku- ja loppukohdan. */
const osa = (n: number) => ({ "--n": n }) as React.CSSProperties;

export default function Rakentuu() {
  return (
    <div className="rakentuu" aria-hidden="true">
      <svg viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid meet">
        {/* 1. Kehys */}
        <rect className="rk-viiva" style={osa(0)} x="90" y="40" width="1020" height="680" rx="14" pathLength={1} />

        {/* 2. Selainpalkki ja sen kolme pistetta */}
        <path className="rk-viiva" style={osa(1)} d="M90 96 H1110" pathLength={1} />
        <g className="rk-tayte" style={osa(1)}>
          <circle cx="122" cy="68" r="5" />
          <circle cx="142" cy="68" r="5" />
          <circle cx="162" cy="68" r="5" />
        </g>
        <rect className="rk-tayte" style={osa(1)} x="196" y="59" width="330" height="18" rx="9" />

        {/* 3. Navigaatio */}
        <g className="rk-tayte" style={osa(2)}>
          <rect x="130" y="130" width="96" height="14" rx="7" />
          <rect x="770" y="132" width="62" height="10" rx="5" />
          <rect x="852" y="132" width="62" height="10" rx="5" />
          <rect x="934" y="132" width="62" height="10" rx="5" />
          <rect className="rk-syaani" x="1016" y="126" width="54" height="22" rx="11" />
        </g>
        <path className="rk-viiva" style={osa(2)} d="M90 176 H1110" pathLength={1} />

        {/* 4. Otsikko ja leipateksti */}
        <g className="rk-tayte" style={osa(3)}>
          <rect x="130" y="224" width="520" height="30" rx="6" />
          <rect x="130" y="270" width="400" height="30" rx="6" />
          <rect x="130" y="330" width="330" height="12" rx="6" />
          <rect x="130" y="354" width="286" height="12" rx="6" />
          <rect className="rk-syaani" x="130" y="398" width="132" height="34" rx="17" />
        </g>

        {/* 5. Kuva-alue oikealle */}
        <rect className="rk-viiva" style={osa(4)} x="700" y="216" width="372" height="236" rx="10" pathLength={1} />
        <path className="rk-viiva" style={osa(4)} d="M700 400 L790 330 L860 386 L930 300 L1072 404" pathLength={1} />

        {/* 6. Kolme korttia */}
        <g style={osa(5)}>
          {[130, 456, 782].map((x) => (
            <g key={x}>
              <rect className="rk-viiva" x={x} y="500" width="288" height="150" rx="10" pathLength={1} />
              <rect className="rk-tayte" x={x + 24} y="530" width="120" height="12" rx="6" />
              <rect className="rk-tayte" x={x + 24} y="558" width="200" height="9" rx="4.5" />
              <rect className="rk-tayte" x={x + 24} y="578" width="168" height="9" rx="4.5" />
            </g>
          ))}
        </g>

        {/* 7. Footeri */}
        <path className="rk-viiva" style={osa(6)} d="M90 686 H1110" pathLength={1} />
        <g className="rk-tayte" style={osa(6)}>
          <rect x="130" y="700" width="140" height="9" rx="4.5" />
          <rect x="940" y="700" width="130" height="9" rx="4.5" />
        </g>
      </svg>
    </div>
  );
}

/* VAIHEIDEN NIMET. Sama jarjestys ja sama --n kuin SVG:n osilla, eli
   kisko ja rautalankamalli ovat sama mittaus kahdesta paasta. */
export const VAIHEET = [
  "kehys",
  "selainpalkki",
  "navigaatio",
  "otsikko",
  "kuva-alue",
  "sisältökortit",
  "footeri",
];

/**
 * MITTAKISKO.
 *
 * Rautalankamalli oli taustalla 26 prosentin opasiteetilla, eli se
 * rakentui mutta kukaan ei nahnyt sita rakentuvan. Skrubbaus joka ei
 * nay ei ole skrubbaus.
 *
 * Kisko on sama mittaus etualalla ja luettavana: seitseman vaihetta
 * allekkain, ja jokainen syttyy tasan silloin kun sen oma osa
 * piirtyy taustalle. Ikkuna on sama rivi CSS:aa kuin SVG:n osilla,
 * joten ne eivat voi eksya toisistaan.
 *
 * Tama on myos se mita osio vaittaa: sivusto rakennetaan
 * jarjestyksessa, rakenne ensin ja ulkoasu sen paalle. Kisko on
 * vaitteen todiste eika koriste.
 */
export function Mittakisko() {
  return (
    <ol className="rk-kisko" aria-hidden="true">
      {VAIHEET.map((v, n) => (
        <li key={v} style={osa(n)}>
          <i />
          <b>{String(n + 1).padStart(2, "0")}</b>
          <span>{v}</span>
        </li>
      ))}
    </ol>
  );
}
