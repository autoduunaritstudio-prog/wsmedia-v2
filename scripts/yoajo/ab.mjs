/**
 * ab.mjs: CSS-eristyskoe vierityksen kehysajoille valitulla moottorilla.
 *
 *   node scripts/yoajo/ab.mjs --moottori=firefox --reitit=/lyhytvideot --variantit=base,nofilter,...
 *
 * Jokainen variantti injektoi yhden CSS-saannon ennen sivun skripteja ja
 * ajaa saman tasaisen vierityksen kuin vieritys.mjs. Kertoo mika
 * ominaisuus maksaa: ulkonakoa ei muuteta talla, vain mitataan.
 */
import { REITIT, arg, kaynnistaPalvelin, sammutaPalvelin, uusiKonteksti, odotaValmis, POHJA } from "./_yhteinen.mjs";
const { launchOptions, requireBrowser } = await import(new URL("../_browser.mjs", import.meta.url).href);
const MOOTTORI = arg("moottori", "firefox");
const reitit = arg("reitit") ? arg("reitit").split(",") : REITIT;
const CSS = {
  base: "",
  nofilter: "*:not(html), *::before, *::after { filter: none !important }",
  nobackdrop: "*, *::before, *::after { backdrop-filter: none !important; -webkit-backdrop-filter: none !important }",
  nomask: "*, *::before, *::after { mask-image: none !important; -webkit-mask-image: none !important }",
  noblend: "*, *::before, *::after { mix-blend-mode: normal !important }",
  nocanvas: "canvas { visibility: hidden !important }",
  noanim: "*, *::before, *::after { animation-play-state: paused !important }",
  nonetbd: ".netbd { display: none !important }",
  noshadow: "*, *::before, *::after { box-shadow: none !important; text-shadow: none !important }",
  nokuvapohja: ".kuvapohja > img, .kuvapohja picture, .kuvapohja video { display: none !important }",
  nograd: "*, *::before, *::after { background-image: none !important }",
  novideo: "video { display: none !important }",
  nosticky: "*, *::before, *::after { position: static !important }",
  nowillchange: "*, *::before, *::after { will-change: auto !important }",
  noclip: "*, *::before, *::after { clip-path: none !important }",
  kuvafilter: ".wsx .laatta > img, .wsx .juova img, .wsx .vaite.kuvallinen > img, .wsx .seo-sec.kuvapohja > .pohjakuva, .wsx .lava-tausta img { filter: none !important }",
  nmfilter: ".nm > svg { filter: none !important }",
  nonm: ".nm { display: none !important }",
  noglow: ".netbd-glow { display: none !important }",
  nofsnav: ".fsnav { display: none !important }",
  nomt: ".mt-t, .mt-fc { background-image: none !important }",
  nopar: "[data-par] { translate: none !important }",
  muutfilter: "*:not(html):not(.pohjakuva):not(.laatta > img):not(.juova img):not(.vaite > img):not(.lava-tausta img):not(.nm > svg) { filter: none !important }",
};
const variantit = (arg("variantit") || Object.keys(CSS).join(",")).split(",");
requireBrowser(MOOTTORI);
const palvelin = await kaynnistaPalvelin();
const browser = await requireBrowser(MOOTTORI).launch(launchOptions(MOOTTORI));
try {
  for (const r of reitit) for (const v of variantit) {
    const ctx = await uusiKonteksti(browser);
    try {
      if (CSS[v]) await ctx.addInitScript(`document.addEventListener("DOMContentLoaded",()=>{const s=document.createElement("style");s.textContent=${JSON.stringify(CSS[v])};document.head.appendChild(s)})`);
      const page = await ctx.newPage();
      await page.goto(POHJA + r, { waitUntil: "load" });
      await odotaValmis(page, 1200);
      const t = await page.evaluate(async () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        window.scrollTo({ top: 0, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 300));
        const dts = [], ys = [];
        await new Promise((ok) => {
          let t0 = 0, ed = 0;
          const f = (t) => {
            if (!t0) { t0 = t; ed = t; } else { dts.push(t - ed); ys.push(scrollY); ed = t; }
            const y = Math.min(max, ((t - t0) / 1000) * 1500);
            window.scrollTo({ top: y, behavior: "instant" });
            if (y < max) requestAnimationFrame(f); else ok();
          };
          requestAnimationFrame(f);
        });
        const s = [...dts].sort((a, b) => a - b);
        return { med: s[s.length >> 1], p95: s[Math.floor(s.length * 0.95)], fps: 1000 / (dts.reduce((a, b) => a + b, 0) / dts.length) };
      });
      console.log(`${MOOTTORI} ${r} ${v.padEnd(12)} fps ${t.fps.toFixed(1).padStart(5)} med ${t.med.toFixed(1)} p95 ${t.p95.toFixed(1)}`);
    } finally { await ctx.close().catch(() => {}); }
  }
} finally {
  await browser.close().catch(() => {});
  sammutaPalvelin(palvelin);
}
