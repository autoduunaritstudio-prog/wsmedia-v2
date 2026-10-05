/**
 * kuvat.mjs: referenssi- ja vertailukuvakaappaukset kaikista reiteista.
 *
 *   node scripts/yoajo/kuvat.mjs --out=<kansio> [--reitit=/,/meista] [--w=1440] [--h=900]
 *
 * Kaynnistaa tuotantopalvelimen itse (next build on ajettava ensin).
 * Jokaiselta reitilta 13 vierityskohtaa (0, 1/12, ..., 1 vieritettavasta
 * matkasta) kahdessa tilassa: reducedMotion 'reduce' ja normaali.
 *
 * Jokaisesta kohdasta otetaan KAKSI kuvaa 400 ms valein (a ja b). Niiden
 * ero kertoo, mitka pikselit elavat itsestaan (canvas-verkosto, video,
 * kellunta). Vertailu (vertaa.mjs) jattaa nama pikselit pois, jolloin
 * jaljelle jaa todellinen muutos.
 *
 * CSS-animaatiot pysaytetaan kuvaa varten (Playwright animations:
 * "disabled": aarelliset loppuun, toistuvat alkuun). Videot pysaytetaan.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REITIT, nimi, arg, kaynnistaPalvelin, sammutaPalvelin, uusiKonteksti, odotaValmis, kehys, POHJA } from "./_yhteinen.mjs";
const { launchOptions, requireBrowser } = await import(new URL("../_browser.mjs", import.meta.url).href);

const OUT = arg("out");
if (!OUT) { console.error("--out=<kansio> puuttuu"); process.exit(1); }
const W = +arg("w", 1440), H = +arg("h", 900);
const reitit = arg("reitit") ? arg("reitit").split(",") : REITIT;
const KOHTIA = 13;
mkdirSync(OUT, { recursive: true });

const palvelin = await kaynnistaPalvelin();
const browser = await requireBrowser("chromium").launch(launchOptions("chromium"));
const meta = {};
try {
  for (const tila of ["reduce", "normaali"]) {
    for (const r of reitit) {
      const ctx = await uusiKonteksti(browser, {
        viewport: { width: W, height: H },
        reducedMotion: tila === "reduce" ? "reduce" : "no-preference",
      });
      try {
        const page = await ctx.newPage();
        await page.goto(POHJA + r, { waitUntil: "load" });
        await odotaValmis(page, 1500);
        const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
        meta[`${tila}:${r}`] = { max };
        for (let i = 0; i < KOHTIA; i++) {
          const y = Math.round((max * i) / (KOHTIA - 1));
          await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
          await kehys(page, 3);
          await page.waitForTimeout(tila === "reduce" ? 500 : 1100);
          await page.evaluate(() => document.querySelectorAll("video").forEach((v) => v.pause()));
          const base = join(OUT, `${tila}__${nimi(r)}__${String(i).padStart(2, "0")}`);
          await page.screenshot({ path: base + "_a.png", animations: "disabled", caret: "hide" });
          await page.waitForTimeout(400);
          await page.screenshot({ path: base + "_b.png", animations: "disabled", caret: "hide" });
        }
        process.stdout.write(`${tila} ${r} max=${max}\n`);
      } finally {
        await ctx.close().catch(() => {});
      }
    }
  }
  writeFileSync(join(OUT, "meta.json"), JSON.stringify(meta, null, 1));
} finally {
  await browser.close().catch(() => {});
  sammutaPalvelin(palvelin);
}
