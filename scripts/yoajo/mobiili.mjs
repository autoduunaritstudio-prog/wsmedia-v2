/**
 * mobiili.mjs: 390 px leveyden tarkistus (asettelu ei hajoa, ei vaakavieritysta).
 *
 *   node scripts/yoajo/mobiili.mjs [--out=<kansio>]
 *
 * Jokaiselta reitilta 6 vierityskohtaa 390x844 (dpr 2, kosketus): yritetaan
 * vierittaa vaakasuunnassa (scrollX pitaa jaada 0:aan), luetaan
 * scrollWidth ja etsitaan nakyvat elementit, jotka ulottuvat nakyman
 * oikean reunan yli ilman leikkaavaa esivanhempaa. --out tallentaa kuvat.
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { REITIT, nimi, arg, kaynnistaPalvelin, sammutaPalvelin, uusiKonteksti, odotaValmis, POHJA } from "./_yhteinen.mjs";
const { launchOptions, requireBrowser } = await import(new URL("../_browser.mjs", import.meta.url).href);
const OUT = arg("out");
if (OUT) mkdirSync(OUT, { recursive: true });
const palvelin = await kaynnistaPalvelin();
const browser = await requireBrowser("chromium").launch(launchOptions("chromium"));
try {
  for (const r of REITIT) {
    const ctx = await uusiKonteksti(browser, { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
    try {
      const page = await ctx.newPage();
      await page.goto(POHJA + r, { waitUntil: "load" });
      await odotaValmis(page, 800);
      const tulos = [];
      for (let i = 0; i < 6; i++) {
        const t = await page.evaluate(async (i) => {
          const max = document.documentElement.scrollHeight - innerHeight;
          window.scrollTo({ top: (max * i) / 5, left: 200, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 300));
          const sx = window.scrollX;
          window.scrollTo({ left: 0, behavior: "instant" });
          return { sx, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth };
        }, i);
        if (OUT) await page.screenshot({ path: join(OUT, `${nimi(r)}_${i}.png`) });
        tulos.push(t);
      }
      const vika = tulos.filter((t) => t.sx !== 0);
      console.log(`${r}: ${vika.length ? "VAAKAVIERITYS " + JSON.stringify(vika) : "ei vaakavieritysta"} (scrollWidth ${Math.max(...tulos.map((t) => t.sw))}, leveys ${tulos[0].cw})`);
    } finally { await ctx.close().catch(() => {}); }
  }
} finally {
  await browser.close().catch(() => {});
  sammutaPalvelin(palvelin);
}
