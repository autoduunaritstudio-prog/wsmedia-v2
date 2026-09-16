import type { CSSProperties } from "react";

/* ==================================================================
   DATAGRAFIIKAT
   ==================================================================
   MIKSI EI VALOKUVIA. Katsoin lapi Ahrefsin, Semrushin ja Surferin.
   Yhdellakaan ei ole yhtaan vertauskuvallista kuvituskuvaa. Niiden
   grafiikka on DATAA ja TUOTETTA: sijoitustaulukoita, volyymipalkkeja,
   mittareita, hakutulosnakymia, muutoslukuja vihreana ja punaisena.

   Syy on looginen. Juoksurata tarkoittaa sijoitusta vasta kun sen
   selittaa; sijoituslista tarkoittaa sijoitusta heti. Kun palvelu on
   mitattava, sen kuva on mittaus.

   Kaikki tassa tiedostossa on SVG:ta ja CSS:aa, ei kuvatiedostoja.
   Ne skaalautuvat, ne ovat sivun vareissa ilman suotimia, ne eivat
   maksa latausta ja ne ovat tarkkoja missa tahansa koossa.
   ================================================================== */

/* ---------- SIJOITUSKAYRA ----------
   12 kuukautta, sijoitus 12 -> 1. Y-akseli on KAANNETTY, koska
   sijoituksessa pieni luku on hyva: kayra nousee kun luku laskee.
   Juuri se kaannos on asia jonka tama kuva selittaa kerralla.

   Polku on kirjoitettu auki eika laskettu: 12 pistetta on niin vahan
   etta generointi olisi vain mutkikkaampi tapa sanoa sama. */
const SIJAT = [12, 12, 11, 9, 8, 6, 5, 4, 3, 2, 2, 1];

export function Sijoituskayra({ korkeus = 260 }: { korkeus?: number }) {
  const W = 520;
  const H = korkeus;
  const pad = { l: 34, r: 14, t: 16, b: 26 };
  const x = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / (SIJAT.length - 1);
  /* Sijainti 1 ylos, 12 alas. */
  const y = (s: number) => pad.t + ((s - 1) * (H - pad.t - pad.b)) / 11;
  const viiva = SIJAT.map((s, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(s).toFixed(1)}`).join(" ");
  const alue = `${viiva} L${x(SIJAT.length - 1).toFixed(1)} ${H - pad.b} L${x(0).toFixed(1)} ${H - pad.b} Z`;

  return (
    /* VIERINTAAN SIDOTTU PIIRTO. Kayra ei ole kuva kayrasta vaan se
       piirtyy sita mukaa kun heroa vieritetaan: sijoitus nousee
       lukijan omasta liikkeesta. Se on sivun aihe tehtyna liikkeeksi,
       ei koriste sen paalla. pathLength="1" tekee dasharraysta
       yksikottoman, joten polun todellista pituutta ei tarvitse
       mitata JS:lla lainkaan. */
    <figure className="gfx gfx-kayra" data-rvs="">
      <figcaption>
        <b>Sijoitus seuratulla hakusanalla</b>
        <span>12 kk</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Sijoitus nousee sijalta 12 sijalle 1 kahdentoista kuukauden aikana">
        {/* Vaakaviivat sijoille 1, 4, 8 ja 12 */}
        {[1, 4, 8, 12].map((s) => (
          <g key={s}>
            <line x1={pad.l} x2={W - pad.r} y1={y(s)} y2={y(s)} className="gfx-ruudukko" />
            <text x={pad.l - 10} y={y(s) + 4} className="gfx-akseli" textAnchor="end">
              {s}
            </text>
          </g>
        ))}
        <g className="kayra-piirto">
          <path d={alue} className="gfx-alue" />
          <path d={viiva} className="gfx-viiva" pathLength={1} />
          {SIJAT.map((s, i) => (
            <circle key={i} cx={x(i)} cy={y(s)} r={i === SIJAT.length - 1 ? 6 : 3} className={i === SIJAT.length - 1 ? "gfx-piste karki" : "gfx-piste"} />
          ))}
        </g>
        <text x={x(0)} y={H - 8} className="gfx-akseli">
          kk 1
        </text>
        <text x={W - pad.r} y={H - 8} className="gfx-akseli" textAnchor="end">
          kk 12
        </text>
      </svg>
    </figure>
  );
}

/* ---------- AVAINSANATAULUKKO ----------
   Hakusana, volyymipalkki, sijoitus ja muutos. Tama on alan
   vakiokuva: se kertoo yhdella silmayksella mita seurataan ja mihin
   suuntaan ollaan menossa. Palkki on suhteellinen suurimpaan, ei
   absoluuttinen, koska vertailu on rivien valilla. */
const SANAT: [string, number, number, number][] = [
  ["hakukoneoptimointi espoo", 260, 1, 7],
  ["seo toimisto", 880, 3, 12],
  ["hakukoneoptimointi hinta", 720, 2, 5],
  ["avainsanatutkimus", 210, 4, 9],
  ["tekninen seo", 170, 6, 3],
];

export function Avainsanat() {
  const max = Math.max(...SANAT.map((s) => s[1]));
  return (
    <figure className="gfx gfx-sanat">
      <figcaption>
        <b>Seurattavat hakusanat</b>
        <span>volyymi / kk</span>
      </figcaption>
      <table>
        <tbody>
          {SANAT.map(([sana, vol, sija, muutos]) => (
            <tr key={sana}>
              <th scope="row">{sana}</th>
              <td className="gfx-palkki">
                <i style={{ "--w": `${(vol / max) * 100}%` } as CSSProperties} />
                <s>{vol}</s>
              </td>
              <td className="gfx-sija">#{sija}</td>
              <td className="gfx-muutos">▲ {muutos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/* ---------- AUDITOINTILISTA ----------
   Tekninen kunto pass/fail-merkein. Sama muoto kuin Lighthouse- tai
   Search Console -raportissa, eli lukija tunnistaa sen ilman selitysta.
   Kaksi virhetta mukana tarkoituksella: taysin vihrea lista lukee
   mainoksena, kahden virheen lista lukee raporttina. */
const AUDIT: [string, "ok" | "vika"][] = [
  ["Sivustokartta ja robots.txt", "ok"],
  ["Core Web Vitals, mobiili", "ok"],
  ["Otsikkohierarkia H1–H3", "ok"],
  ["Strukturoitu data", "vika"],
  ["Sisäinen linkitys", "ok"],
  ["Rikkinäiset linkit", "vika"],
];

export function Auditointi() {
  const vikoja = AUDIT.filter(([, t]) => t === "vika").length;
  return (
    <figure className="gfx gfx-audit">
      <figcaption>
        <b>Tekninen auditointi</b>
        <span>
          {AUDIT.length - vikoja}/{AUDIT.length} kunnossa
        </span>
      </figcaption>
      <ul>
        {AUDIT.map(([nimi, tila]) => (
          <li className={tila} key={nimi}>
            <em aria-hidden="true">{tila === "ok" ? "✓" : "!"}</em>
            {nimi}
            <s>{tila === "ok" ? "Kunnossa" : "Korjattavaa"}</s>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/* ---------- NAKYVYYSMITTARI ----------
   Osuus toimialan hauista joilla sivusto nakyy. Kehä on conic-gradient
   eika SVG-kaari: yksi elementti, ei polkulaskentaa, ja arvo tulee
   yhtena muuttujana. */
export function Mittari({ arvo = 68, otsikko = "Näkyvyys", alla = "toimialan hauista" }) {
  return (
    <figure className="gfx gfx-mittari">
      <div className="kehä" style={{ "--p": arvo } as CSSProperties}>
        <i>
          <b>{arvo}</b>
          <small>%</small>
        </i>
      </div>
      <figcaption>
        <b>{otsikko}</b>
        <span>{alla}</span>
      </figcaption>
    </figure>
  );
}

/* ---------- LAHDEMAININNAT ----------
   Montako kertaa sivusto mainitaan tekoalyvastausten lahteena. Pylvaat
   kuukausittain: sama muoto kuin Search Consolen nayttokerroissa. */
const MAININNAT = [2, 3, 3, 5, 6, 8, 9, 11, 12, 14, 16, 19];

export function Maininnat() {
  const max = Math.max(...MAININNAT);
  return (
    <figure className="gfx gfx-pylvaat">
      <figcaption>
        <b>Maininnat tekoälyvastauksissa</b>
        <span>kpl / kk</span>
      </figcaption>
      <div className="pylvaat">
        {MAININNAT.map((v, i) => (
          <i key={i} style={{ "--h": `${(v / max) * 100}%` } as CSSProperties} title={`${v} kpl`} />
        ))}
      </div>
    </figure>
  );
}
