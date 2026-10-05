/**
 * invalidointi.mjs: mika merkitsee tyylit likaisiksi joka kehyksessa.
 *
 *   node scripts/yoajo/invalidointi.mjs --reitit=/ [--vieritys=1] [--cpu=4]
 *
 * Devtools-jalki invalidointiseurannalla (StyleInvalidatorInvalidationTracking,
 * StyleRecalcInvalidationTracking, ScheduleStyleInvalidationTracking).
 * Tulostaa yleisimmat syyt ja kohde-elementit. --vieritys=0 mittaa
 * paikallaan olevaa sivua 2 s (taustan omat animaatiot).
 */
import { REITIT, arg, kaynnistaPalvelin, sammutaPalvelin, uusiKonteksti, odotaValmis, POHJA } from "./_yhteinen.mjs";
const { launchOptions, requireBrowser } = await import(new URL("../_browser.mjs", import.meta.url).href);
const reitit = arg("reitit") ? arg("reitit").split(",") : REITIT;
const VIER = arg("vieritys", "1") === "1";
const CPU = +arg("cpu", 4);
const palvelin = await kaynnistaPalvelin();
const browser = await requireBrowser("chromium").launch(launchOptions("chromium"));
try {
  for (const r of reitit) {
    const ctx = await uusiKonteksti(browser);
    try {
      const page = await ctx.newPage();
      await page.goto(POHJA + r, { waitUntil: "load" });
      await odotaValmis(page, 1200);
      const cdp = await ctx.newCDPSession(page);
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
      if (VIER) await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await browser.startTracing(page, { categories: ["devtools.timeline", "disabled-by-default-devtools.timeline.invalidationTracking"] });
      await page.evaluate(async (vier) => {
        const max = document.documentElement.scrollHeight - innerHeight;
        await new Promise((valmis) => {
          let t0 = 0;
          const f = (t) => {
            t0 ||= t;
            if (vier) {
              const y = Math.min(max, ((t - t0) / 1000) * 1500);
              window.scrollTo({ top: y, behavior: "instant" });
              if (y < max) requestAnimationFrame(f); else valmis();
            } else if (t - t0 < 2000) requestAnimationFrame(f); else valmis();
          };
          requestAnimationFrame(f);
        });
      }, VIER);
      const ev = JSON.parse((await browser.stopTracing()).toString()).traceEvents;
      const syyt = new Map();
      for (const e of ev) {
        if (!/Invalidation|ScheduleStyle/.test(e.name)) continue;
        const d = e.args?.data || {};
        const k = `${e.name} | ${d.reason || d.changedAttribute || d.changedClass || d.changedPseudo || d.changedId || ""} | ${(d.nodeName || "").slice(0, 70)}`;
        syyt.set(k, (syyt.get(k) || 0) + 1);
      }
      console.log(`\n=== ${r} vieritys=${VIER}`);
      for (const [k, n] of [...syyt].sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(String(n).padStart(6), k);
    } finally { await ctx.close().catch(() => {}); }
  }
} finally {
  await browser.close().catch(() => {});
  sammutaPalvelin(palvelin);
}
