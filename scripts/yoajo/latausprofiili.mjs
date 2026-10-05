/**
 * latausprofiili.mjs: JavaScriptin CPU-profiili sivun latauksesta (Chromium).
 *
 *   node scripts/yoajo/latausprofiili.mjs --reitit=/lyhytvideot [--suostumus=ei] [--w=1350] [--h=940]
 *
 * --suostumus=ei: tuore kavija ilman evastevalintaa (kuten Lighthouse).
 * Tulostaa long taskit ja raskaimmat funktiot omalla ajalla 4 s ajalta.
 */
import { REITIT, arg, kaynnistaPalvelin, sammutaPalvelin, POHJA } from "./_yhteinen.mjs";
const { launchOptions, requireBrowser } = await import(new URL("../_browser.mjs", import.meta.url).href);
const reitit = arg("reitit") ? arg("reitit").split(",") : REITIT;
const W = +arg("w", 1350), H = +arg("h", 940);
const ilman = arg("suostumus") === "ei";
const palvelin = await kaynnistaPalvelin();
const browser = await requireBrowser("chromium").launch(launchOptions("chromium"));
try {
  for (const r of reitit) {
    const ctx = await browser.newContext({ viewport: { width: W, height: H } });
    if (!ilman) await ctx.addInitScript(`localStorage.setItem("wsmedia.consent",JSON.stringify({analytics:false,v:1,ts:Date.now()}))`);
    await ctx.route("**/*", (rt) => (new URL(rt.request().url()).hostname === "localhost" ? rt.continue() : rt.abort()));
    await ctx.addInitScript(`window.__lt=[];new PerformanceObserver(l=>{for(const e of l.getEntries())window.__lt.push([Math.round(e.startTime),Math.round(e.duration)])}).observe({type:"longtask",buffered:true})`);
    const page = await ctx.newPage();
    const lahteet = new Map();
    page.on("response", async (res) => { if (res.request().resourceType() === "script") lahteet.set(res.url(), await res.text().catch(() => "")); });
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Profiler.enable");
    await cdp.send("Profiler.setSamplingInterval", { interval: 200 });
    await cdp.send("Profiler.start");
    await page.goto(POHJA + r, { waitUntil: "load" });
    await page.waitForTimeout(4000);
    const { profile } = await cdp.send("Profiler.stop");
    console.log(`\n=== ${r} long taskit`, JSON.stringify(await page.evaluate(() => window.__lt)));
    const ids = new Map(profile.nodes.map((n) => [n.id, n]));
    const agg = new Map();
    profile.samples.forEach((s, i) => {
      const cf = ids.get(s).callFrame;
      const k = `${cf.functionName || "(anon)"}|${cf.url}|${cf.lineNumber}|${cf.columnNumber}`;
      agg.set(k, (agg.get(k) || 0) + (profile.timeDeltas[i] || 0));
    });
    for (const [k, us] of [...agg].sort((a, b) => b[1] - a[1]).slice(0, 15)) {
      const [fn, url, ln, col] = k.split("|");
      const src = (lahteet.get(url) || "").split("\n")[+ln] || "";
      console.log(`${(us / 1000).toFixed(0).padStart(6)} ms ${fn} ${url.split("/").pop()}:${col}  ${src.slice(Math.max(0, +col - 20), +col + 100).replace(/\s+/g, " ")}`);
    }
    await ctx.close();
  }
} finally {
  await browser.close().catch(() => {});
  sammutaPalvelin(palvelin);
}
