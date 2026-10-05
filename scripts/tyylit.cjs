/* SIVUKOHTAISET TYYLITIEDOSTOT (2.10.2026).

   MIKSI. app/globals.css sisaltaa kaikkien sivujen tyylit, ja se ladattiin
   jokaiselle sivulle ennen kuin mitaan piirretaan (noin 64 KiB pakattuna).
   Noin kolmasosa saannoista voi osua vain jollakin toisella sivulla.

   MITEN. Taman skriptin tuottama tiedosto app/_tyylit/<sivu>.css on
   globals.css sellaisenaan, josta on POISTETTU saannot, jotka voivat osua
   vain jollakin muulla sivulla. Mitaan ei siirreta eika jarjestys muutu,
   joten jaljelle jaavien saantojen keskinainen voittojarjestys on tasan
   sama kuin ennen. (Ensimmainen yritys siirsi sivusaannot omiin
   tiedostoihinsa; silloin ne latautuivat yhteisten jalkeen ja voittivat
   saantoja, jotka ennen voittivat ne. Lasketuissa tyyleissa nakyi eroja.)

   Saanto poistetaan sivulta S vain, jos JOKAINEN sen valitsin vaatii
   ylimmalla tasollaan toisen sivun juuriluokan (.page-<sivu>, tai
   .page-palvelu / .wsx jotka ovat vain palvelusivuilla). Sulkujen sisalla
   (:not, :has, :is muilla kuin pelkilla sivuluokilla) olevia ei lasketa.

   MUOKKAA AINA app/globals.css:aa. _tyylit/ on generoitu eika ole
   versionhallinnassa. next.config.ts ajaa taman jokaisen kaannoksen ja
   kehityspalvelimen alussa, ja kehityspalvelimen aikana globals.css:n
   muutos tuottaa tiedostot uudelleen. */
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const PALVELU = ["lyhytvideot", "verkkosivut", "hakukoneoptimointi", "graafinen-suunnittelu", "meista", "tm"];
/** Tiedostot: sivu -> sen juuriluokat. "perus" = etusivu ja muut. */
const KOHTEET = {
  perus: [],
  lyhytvideot: ["lyhytvideot", "palvelu"],
  verkkosivut: ["verkkosivut", "palvelu"],
  hakukoneoptimointi: ["hakukoneoptimointi", "palvelu"],
  "graafinen-suunnittelu": ["graafinen-suunnittelu", "palvelu"],
  meista: ["meista", "hakukoneoptimointi", "palvelu"],
  "toihin-meille": ["tm", "hakukoneoptimointi", "palvelu"],
  tietosuoja: ["tietosuoja"],
  laskutustiedot: ["laskutustiedot", "hakukoneoptimointi", "palvelu"],
  yhteystiedot: ["yhteystiedot", "hakukoneoptimointi", "palvelu"],
};

/** Sivut, joille valitsin voi osua, tai null jos sita ei ole rajattu. */
function rajaus(sel) {
  let ylin = "";
  let i = 0;
  while (i < sel.length) {
    const c = sel[i];
    if (c === "(") {
      let j = i + 1, d = 1;
      while (j < sel.length && d) { if (sel[j] === "(") d++; else if (sel[j] === ")") d--; j++; }
      const sisus = sel.slice(i + 1, j - 1);
      if (/:(is|where)$/.test(ylin)) {
        const sivut = sisus.split(",").map((o) => { const m = /^\s*\.page-([a-z-]+)\s*$/.exec(o); return m ? m[1] : null; });
        if (sivut.every(Boolean)) { ylin += ` .__ryhma(${sivut.join("|")})`; i = j; continue; }
      }
      ylin += "()";
      i = j;
      continue;
    }
    ylin += c;
    i++;
  }
  const ryhmat = [];
  for (const m of ylin.matchAll(/\.page-([a-z-]+)(?![a-z-])/g)) ryhmat.push(m[1] === "palvelu" ? PALVELU : [m[1]]);
  for (const m of ylin.matchAll(/\.__ryhma\(([^)]*)\)/g)) ryhmat.push(m[1].split("|").flatMap((s) => (s === "palvelu" ? PALVELU : [s])));
  if (/\.wsx(?![a-z-])/.test(ylin)) ryhmat.push(PALVELU);
  if (!ryhmat.length) return null;
  // Kaikkien ehtojen on toteuduttava: leikkaus.
  return ryhmat.reduce((a, r) => a.filter((x) => r.includes(x)), ryhmat[0]);
}

/** Voiko saanto osua sivulla, jonka juuriluokat ovat `juuret`. */
function osuuko(rule, juuret) {
  const sivut = juuret.flatMap((j) => (j === "palvelu" ? [] : [j]));
  for (const sel of rule.selectors) {
    const r = rajaus(sel);
    if (r === null) return true;
    if (r.some((s) => sivut.includes(s))) return true;
  }
  return false;
}

function generoi(juuri = process.cwd()) {
  const lahde = path.join(juuri, "app/globals.css");
  const kohde = path.join(juuri, "app/_tyylit");
  const css = fs.readFileSync(lahde, "utf8");
  fs.mkdirSync(kohde, { recursive: true });
  const raportti = {};
  for (const [nimi, juuret] of Object.entries(KOHTEET)) {
    const root = postcss.parse(css);
    root.walkComments((c) => c.remove());
    root.walkRules((r) => {
      let a = r.parent;
      while (a && a.type === "atrule") { if (/keyframes/.test(a.name)) return; a = a.parent; }
      if (!osuuko(r, juuret)) r.remove();
    });
    // Tyhjiksi jaaneet @media/@supports pois.
    let poistettiin = true;
    while (poistettiin) {
      poistettiin = false;
      root.walkAtRules((a) => { if (a.nodes && a.nodes.length === 0 && a.name !== "theme") { a.remove(); poistettiin = true; } });
    }
    const ulos = `/* GENEROITU tiedostosta app/globals.css (scripts/tyylit.cjs). Ala muokkaa. */\n${root.toString()}\n`;
    const tiedosto = path.join(kohde, `${nimi}.css`);
    if (!fs.existsSync(tiedosto) || fs.readFileSync(tiedosto, "utf8") !== ulos) fs.writeFileSync(tiedosto, ulos);
    raportti[nimi] = Math.round(ulos.length / 1024);
  }
  return raportti;
}

let seurataan = false;
/** Kehityspalvelimelle: tuota uudelleen kun globals.css muuttuu. */
function seuraa(juuri = process.cwd()) {
  if (seurataan) return;
  seurataan = true;
  let ajastin = null;
  fs.watch(path.join(juuri, "app/globals.css"), () => {
    clearTimeout(ajastin);
    ajastin = setTimeout(() => { try { generoi(juuri); } catch (e) { console.error("[tyylit]", e.message); } }, 80);
  });
}

module.exports = { generoi, seuraa, rajaus };

if (require.main === module) console.log(generoi());
