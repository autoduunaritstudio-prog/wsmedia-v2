/**
 * lataus.mjs: latauksen mittaus ilman vieritysta.
 *
 *   node scripts/yoajo/lataus.mjs --json=<tiedosto> [--reitit=...] [--moottorit=chromium,webkit,firefox]
 *                                 [--verkot=ei,fast4g,slow3g]
 *
 * Kaynnistaa tuotantopalvelimen itse. 1440x900, dpr 1.
 * Verkkoprofiilit (CDP Network.emulateNetworkConditions, vain Chromium):
 *   ei      ei rajoitusta
 *   fast4g  DevToolsin "Fast 4G": 9 Mbit/s alas, 1,5 Mbit/s ylos, 165 ms
 *   slow3g  DevToolsin "Slow 3G": 400 kbit/s alas ja ylos, 2000 ms
 * WebKit ja Firefox mitataan vain ilman rajoitusta.
 *
 * Kirjaa jokaisesta latauksesta:
 *   - LCP, CLS, FCP (PerformanceObserver; WebKit ei tue LCP:ta)
 *   - long taskit (Chromium) ja niiden summa yli 50 ms = TBT-arvio
 *   - latausruutu (.hero-load / .lataus): milloin naytolla ensimmaisen
 *     kerran, milloin poissa, ja oliko sivu naytolla ennen sita (vilahdus)
 *   - kaikki pyynnot: polku, tyyppi, siirretyt tavut, alkuaika
 *   - 8 s kohdalla: mitka isot (> 100 kt) resurssit on ladattu, vaikka ne
 *     ovat ensimmaisen nakyman ulkopuolella
 */
import { writeFileSync } from "node:fs";
import { REITIT, arg, kaynnistaPalvelin, sammutaPalvelin, uusiKonteksti, POHJA } from "./_yhteinen.mjs";
const { launchOptions, requireBrowser } = await import(new URL("../_browser.mjs", import.meta.url).href);

const JSON_OUT = arg("json");
const reitit = arg("reitit") ? arg("reitit").split(",") : REITIT;
const moottorit = (arg("moottorit") || "chromium,webkit,firefox").split(",");
const verkot = (arg("verkot") || "ei,fast4g,slow3g").split(",");
const ODOTUS = +arg("odotus", 8000);

const VERKKO = {
  fast4g: { offline: false, latency: 165, downloadThroughput: (9e6 / 8) * 0.9, uploadThroughput: (1.5e6 / 8) * 0.9 },
  slow3g: { offline: false, latency: 2000, downloadThroughput: (500e3 / 8) * 0.8, uploadThroughput: (500e3 / 8) * 0.8 },
};

/* Ajetaan ennen sivun skripteja. Kehysnaytteistin tallentaa joka
   kehyksessa, onko latausruutu nakyvissa ja onko sivun muuta sisaltoa
   piirretty. */
const INIT = `(() => {
  const m = window.__mit = { lcp: 0, lcpEl: "", cls: 0, fcp: 0, lt: [], ruutu: [], t0: performance.now() };
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) { m.lcp = e.startTime; m.lcpEl = e.element ? (e.element.tagName + "." + (e.element.className || "").toString().slice(0, 60)) : (e.url || ""); } }).observe({ type: "largest-contentful-paint", buffered: true }); } catch (e) {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) m.cls += e.value; }).observe({ type: "layout-shift", buffered: true }); } catch (e) {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === "first-contentful-paint") m.fcp = e.startTime; }).observe({ type: "paint", buffered: true }); } catch (e) {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) m.lt.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: "longtask", buffered: true }); } catch (e) {}
  let ed = null;
  const nayte = () => {
    const r = document.querySelector(".hero-load, .lataus");
    let tila = "ei";
    if (r) {
      const cs = getComputedStyle(r);
      tila = cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.05 ? "piilo" : "nakyy";
    }
    const body = !!document.body && document.body.children.length > 0;
    const k = tila + (body ? "+body" : "");
    if (k !== ed) { m.ruutu.push([Math.round(performance.now()), k]); ed = k; }
    if (performance.now() < 30000) requestAnimationFrame(nayte);
  };
  requestAnimationFrame(nayte);
})();`;

const tulokset = [];
/* binaarit tarkistetaan ennen palvelinta: requireBrowser lopettaa prosessin */
for (const m of moottorit) requireBrowser(m);
const palvelin = await kaynnistaPalvelin();
try {
  for (const moottori of moottorit) {
    const browser = await requireBrowser(moottori).launch(launchOptions(moottori));
    try {
      for (const verkko of moottori === "chromium" ? verkot : ["ei"]) {
        for (const r of reitit) {
          const ctx = await uusiKonteksti(browser);
          try {
            await ctx.addInitScript(INIT);
            const page = await ctx.newPage();
            if (moottori === "chromium") {
              const cdp = await ctx.newCDPSession(page);
              await cdp.send("Network.enable");
              await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
              if (VERKKO[verkko]) await cdp.send("Network.emulateNetworkConditions", VERKKO[verkko]);
            }
            const pyynnot = [];
            const alku = Date.now();
            page.on("requestfinished", async (req) => {
              let tavut = 0;
              try { const s = await req.sizes(); tavut = s.responseBodySize + s.responseHeadersSize; } catch { /* ei saatavilla */ }
              const u = new URL(req.url());
              pyynnot.push({ polku: u.pathname + (u.search.length < 60 ? u.search : ""), tyyppi: req.resourceType(), tavut, alku: req.timing().startTime ? Math.round(req.timing().startTime - alku) : null, valmis: Date.now() - alku });
            });
            const odotus = verkko === "slow3g" ? Math.max(ODOTUS, 25000) : ODOTUS;
            await page.goto(POHJA + r, { waitUntil: "commit", timeout: 120000 });
            await page.waitForLoadState("load", { timeout: 120000 }).catch(() => {});
            const loadMs = Date.now() - alku;
            await page.waitForTimeout(Math.max(0, odotus - loadMs));
            const m = await page.evaluate(() => window.__mit);
            const nakyma = await page.evaluate(() => {
              /* mitka media-elementit ovat ensimmaisessa nakymassa */
              const out = [];
              for (const el of document.querySelectorAll("img, video, source")) {
                const src = el.currentSrc || el.src || el.getAttribute("src") || "";
                if (!src) continue;
                const box = (el.tagName === "SOURCE" ? el.parentElement : el).getBoundingClientRect();
                out.push({ src: new URL(src, location.href).pathname, nakyvissa: box.bottom > 0 && box.top < innerHeight && box.width > 0, top: Math.round(box.top + scrollY) });
              }
              return out;
            });
            const tbt = (m.lt || []).reduce((s, [, d]) => s + Math.max(0, d - 50), 0);
            const isot = pyynnot.filter((p) => p.tavut > 100e3).map((p) => {
              const n = nakyma.find((x) => x.src === p.polku);
              return { ...p, top: n ? n.top : null, nakyvissa: n ? n.nakyvissa : null };
            });
            const rivi = {
              moottori, verkko, reitti: r, loadMs,
              lcp: Math.round(m.lcp), lcpEl: m.lcpEl, cls: +m.cls.toFixed(4), fcp: Math.round(m.fcp),
              longtaskit: m.lt.length, tbtArvio: tbt,
              ruutu: m.ruutu,
              tavutYht: pyynnot.reduce((s, p) => s + p.tavut, 0),
              js: pyynnot.filter((p) => p.tyyppi === "script").reduce((s, p) => s + p.tavut, 0),
              css: pyynnot.filter((p) => p.tyyppi === "stylesheet").reduce((s, p) => s + p.tavut, 0),
              kuvat: pyynnot.filter((p) => p.tyyppi === "image").reduce((s, p) => s + p.tavut, 0),
              media: pyynnot.filter((p) => p.tyyppi === "media").reduce((s, p) => s + p.tavut, 0),
              fontit: pyynnot.filter((p) => p.tyyppi === "font").reduce((s, p) => s + p.tavut, 0),
              pyyntoja: pyynnot.length,
              isot,
            };
            tulokset.push(rivi);
            console.log(`${moottori} ${verkko} ${r}: load ${loadMs} ms, LCP ${rivi.lcp}, FCP ${rivi.fcp}, CLS ${rivi.cls}, TBT~${tbt}, ${(rivi.tavutYht / 1024).toFixed(0)} KiB (js ${(rivi.js / 1024).toFixed(0)}, media ${(rivi.media / 1024).toFixed(0)}, kuvat ${(rivi.kuvat / 1024).toFixed(0)}), ruutu ${JSON.stringify(m.ruutu)}`);
          } finally {
            await ctx.close().catch(() => {});
          }
        }
      }
    } finally {
      await browser.close().catch(() => {});
    }
  }
} finally {
  sammutaPalvelin(palvelin);
  if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(tulokset, null, 1));
}
