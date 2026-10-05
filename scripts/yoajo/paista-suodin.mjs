/**
 * paista-suodin.mjs: CSS-varisuodin valmiiksi kuvatiedostoon.
 *
 *   node scripts/yoajo/paista-suodin.mjs
 *
 * Tumman kuvakielen valokuvilla on globals.css:ssa (KIRKKAUS, kohta 1)
 * suodin saturate(.85) contrast(.96) brightness(1.32). Firefox laskee
 * suotimen uudelleen joka kehyksessa, kun kuva liikkuu parallaksilla:
 * mitattuna (headless Firefox, 1440x900) suodin vei vierityksesta noin
 * 20 % kehyksista lyhytvideot- ja verkkosivut-sivulla.
 *
 * Tama skripti piirtaa kuvan Chromiumissa samalla CSS-suotimella
 * luonnollisessa koossaan (dpr 1), ottaa tuloksen haviottomana PNG:na ja
 * pakkaa sen WebP:ksi CLAUDE.md:n reseptilla: laatu valitaan mittaamalla
 * SSIM PNG:ta vasten (ffmpeg ssim), tavoite >= 0,975. Tulos tallennetaan
 * rinnalle nimella <nimi>-k.webp. Alkuperainen jaa, koska samaa kuvaa
 * kaytetaan myos ilman suodinta (etusivu, SEO, Meista, Yhteystiedot).
 */
import { execFileSync } from "node:child_process";
import { readFileSync, statSync, mkdtempSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { JUURI } from "./_yhteinen.mjs";
const { launchOptions, requireBrowser } = await import(new URL("../_browser.mjs", import.meta.url).href);
import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)("sharp");

const SUODIN = "saturate(.85) contrast(.96) brightness(1.32)";
const KUVAT = [
  "kuvat/tarjous-kortit.webp",
  "kuvat/fx9.webp",
  "kuvat/huoltoasema.webp",
  "verkkosivut/luonnos.webp",
  "verkkosivut/naytto.webp",
  "graafinen-suunnittelu/ilme-teippaus.webp",
];
const tmp = mkdtempSync(join(tmpdir(), "paista-"));
const ssimArvo = (a, b) => {
  const r = execFileSync("sh", ["-c", `ffmpeg -hide_banner -i "${a}" -i "${b}" -lavfi ssim -f null - 2>&1 | grep -o 'All:[0-9.]*'`]).toString();
  return parseFloat(r.split(":")[1]);
};

const browser = await requireBrowser("chromium").launch(launchOptions("chromium"));
try {
  for (const k of KUVAT) {
    const lahde = join(JUURI, "public", k);
    const { width: w, height: h } = await sharp(lahde).metadata();
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    try {
      const page = await ctx.newPage();
      const data = readFileSync(lahde).toString("base64");
      await page.setContent(`<!doctype html><html><body style="margin:0;background:#000"><img id="i" style="display:block;width:${w}px;height:${h}px;filter:${SUODIN}" src="data:image/webp;base64,${data}"></body></html>`);
      await page.waitForFunction(() => document.getElementById("i").complete);
      const png = join(tmp, k.replace(/\//g, "_") + ".png");
      await page.screenshot({ path: png, clip: { x: 0, y: 0, width: w, height: h } });
      const kohde = lahde.replace(/\.webp$/, "-k.webp");
      let valittu = null;
      for (const q of [70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94]) {
        execFileSync("cwebp", ["-quiet", "-q", String(q), "-m", "6", "-sharp_yuv", png, "-o", kohde]);
        const s = ssimArvo(png, kohde);
        if (s >= 0.975) { valittu = { q, s }; break; }
      }
      console.log(`${k} ${w}x${h}: q${valittu?.q} SSIM ${valittu?.s} ${statSync(lahde).size} -> ${statSync(kohde).size} t`);
    } finally { await ctx.close().catch(() => {}); }
  }
} finally {
  await browser.close().catch(() => {});
}
