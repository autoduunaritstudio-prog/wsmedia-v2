/**
 * vertaa.mjs: vertaa kahta kuvat.mjs-ajoa.
 *
 *   node scripts/yoajo/vertaa.mjs --ref=<kansio> --uusi=<kansio> [--kynnys=16] [--diff=<kansio>]
 *
 * Pikseli on muuttunut, jos jonkin kanavan ero > kynnys. Pikselit, jotka
 * muuttuvat itsestaan saman ajon a- ja b-kuvan valilla (kummassa tahansa
 * ajossa), jatetaan pois ja niiden ymparisto 3 px sateella. Tulostaa
 * kohdat, joissa muuttuneita pikseleita on yli 150, ja kirjoittaa niista
 * erokuvan (muutos punaisena, pois jatetty alue sinisena).
 */
import { readdirSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { arg } from "./_yhteinen.mjs";
import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)("sharp");

const REF = arg("ref"), UUSI = arg("uusi"), T = +arg("kynnys", 16);
const DIFF = arg("diff", join(UUSI, "_diff"));
mkdirSync(DIFF, { recursive: true });

const raaka = async (p) => {
  const { data, info } = await sharp(p).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
};
const ero = (a, b, i) => Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]));

const avaimet = readdirSync(REF).filter((f) => f.endsWith("_a.png")).map((f) => f.slice(0, -6)).sort();
const tulos = [];
for (const k of avaimet) {
  if (!existsSync(join(UUSI, k + "_a.png"))) { tulos.push({ k, puuttuu: true }); continue; }
  const [ra, rb, ua, ub] = await Promise.all([k + "_a", k + "_b", k + "_a", k + "_b"].map((n, i) => raaka(join(i < 2 ? REF : UUSI, n + ".png"))));
  const { w, h } = ra;
  if (ua.w !== w || ua.h !== h) { tulos.push({ k, koko: true }); continue; }
  const elava = new Uint8Array(w * h);
  for (let p = 0; p < w * h; p++) {
    const i = p * 3;
    if (ero(ra.data, rb.data, i) > T || ero(ua.data, ub.data, i) > T) elava[p] = 1;
  }
  const R = 3, maski = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!elava[y * w + x]) continue;
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      const yy = y + dy, xx = x + dx;
      if (yy >= 0 && yy < h && xx >= 0 && xx < w) maski[yy * w + xx] = 1;
    }
  }
  let muut = 0, maskattu = 0;
  const out = Buffer.from(ra.data);
  for (let p = 0; p < w * h; p++) {
    const i = p * 3;
    if (maski[p]) { maskattu++; out[i + 2] = Math.min(255, out[i + 2] + 60); continue; }
    if (ero(ra.data, ua.data, i) > T) { muut++; out[i] = 255; out[i + 1] = 0; out[i + 2] = 0; }
  }
  const r = { k, muut, maskattuOsuus: +(maskattu / (w * h)).toFixed(3) };
  if (muut > 150) await sharp(out, { raw: { width: w, height: h, channels: 3 } }).png().toFile(join(DIFF, k + ".png"));
  tulos.push(r);
}
writeFileSync(join(DIFF, "tulos.json"), JSON.stringify(tulos, null, 1));
const poikkeavat = tulos.filter((t) => t.puuttuu || t.koko || t.muut > 150);
console.log(`kohtia ${tulos.length}, poikkeavia ${poikkeavat.length}`);
for (const t of poikkeavat) console.log(t.k, t.puuttuu ? "PUUTTUU" : t.koko ? "KOKO" : `${t.muut} px (maskattu ${t.maskattuOsuus})`);
