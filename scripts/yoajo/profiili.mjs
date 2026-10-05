/**
 * profiili.mjs: JavaScriptin CPU-profiili vierityksen aikana (Chromium).
 *
 *   node scripts/yoajo/profiili.mjs --reitit=/,/lyhytvideot [--cpu=4] [--nopeus=1500]
 *
 * Sama vieritys kuin vieritys.mjs:ssa. Tulostaa reitin raskaimmat
 * funktiot omalla ajalla (self time) seka koodinpatkan funktion kohdalta,
 * jotta minimoitu funktio loytyy lahdekoodista haulla. Lisaksi
 * tyylilaskennan ja asettelun suurimmat aiheuttajat jaljesta.
 */
import { REITIT, arg, kaynnistaPalvelin, sammutaPalvelin, uusiKonteksti, odotaValmis, POHJA } from "./_yhteinen.mjs";
const { launchOptions, requireBrowser } = await import(new URL("../_browser.mjs", import.meta.url).href);

const reitit = arg("reitit") ? arg("reitit").split(",") : REITIT;
const CPU = +arg("cpu", 4), NOPEUS = +arg("nopeus", 1500);

const palvelin = await kaynnistaPalvelin();
const browser = await requireBrowser("chromium").launch(launchOptions("chromium"));
try {
  for (const r of reitit) {
    const ctx = await uusiKonteksti(browser);
    try {
      const page = await ctx.newPage();
      const lahteet = new Map();
      page.on("response", async (res) => {
        if (res.request().resourceType() === "script") lahteet.set(res.url(), await res.text().catch(() => ""));
      });
      await page.goto(POHJA + r, { waitUntil: "load" });
      await odotaValmis(page, 1200);
      const cdp = await ctx.newCDPSession(page);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
      await cdp.send("Profiler.enable");
      await cdp.send("Profiler.setSamplingInterval", { interval: 200 });
      await cdp.send("Profiler.start");
      await page.evaluate(async (nopeus) => {
        const max = document.documentElement.scrollHeight - innerHeight;
        window.scrollTo({ top: 0, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 300));
        await new Promise((valmis) => {
          let t0 = 0;
          const f = (t) => {
            t0 ||= t;
            const y = Math.min(max, ((t - t0) / 1000) * nopeus);
            window.scrollTo({ top: y, behavior: "instant" });
            if (y < max) requestAnimationFrame(f); else valmis();
          };
          requestAnimationFrame(f);
        });
      }, NOPEUS);
      const { profile } = await cdp.send("Profiler.stop");
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
      const dt = {};
      const ids = new Map(profile.nodes.map((n) => [n.id, n]));
      for (let i = 0; i < profile.samples.length; i++) {
        const n = ids.get(profile.samples[i]);
        dt[n.id] = (dt[n.id] || 0) + (profile.timeDeltas[i] || 0);
      }
      const agg = new Map();
      let yht = 0;
      for (const [id, us] of Object.entries(dt)) {
        const n = ids.get(+id);
        const cf = n.callFrame;
        yht += us;
        const k = `${cf.functionName || "(anon)"} ${cf.url.split("/").pop()}:${cf.lineNumber}:${cf.columnNumber}`;
        const a = agg.get(k) || { us: 0, cf };
        a.us += us;
        agg.set(k, a);
      }
      const lista = [...agg.entries()].sort((a, b) => b[1].us - a[1].us).slice(0, 18);
      console.log(`\n=== ${r} (cpu ${CPU}x), naytteita yhteensa ${(yht / 1000).toFixed(0)} ms`);
      for (const [k, a] of lista) {
        const src = lahteet.get(a.cf.url);
        let patka = "";
        if (src && a.cf.lineNumber >= 0) {
          const rivi = src.split("\n")[a.cf.lineNumber] || "";
          patka = rivi.slice(Math.max(0, a.cf.columnNumber - 10), a.cf.columnNumber + 110).replace(/\s+/g, " ");
        }
        console.log(`${(a.us / 1000).toFixed(0).padStart(6)} ms  ${k}\n          ${patka}`);
      }
    } finally {
      await ctx.close().catch(() => {});
    }
  }
} finally {
  await browser.close().catch(() => {});
  sammutaPalvelin(palvelin);
}
