/**
 * safari-vyohyke.mjs — mittaa vain kuuman vyohykkeen (oletus y 4500->7500)
 * ja piilottaa siita yhden asian kerrallaan CSS-injektiolla.
 *   node scripts/safari-vyohyke.mjs [--engine=webkit] [--runs=3] [--from=4500] [--to=7500] [--only=a,b]
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);
const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const ENGINE = arg("engine", "webkit"), URL_ = arg("url", "https://wsmedia.fi/"), RUNS = +arg("runs", 3);
const W = +arg("w", 1440), H = +arg("h", 900), DPR = +arg("dpr", 2), FROM = +arg("from", 4500), TO = +arg("to", 7500);
const hide = (s) => `${s} { visibility: hidden !important }`;
const V = {
  base: "",
  carriers: ".carriers { display: none !important }",
  beams: ".navbeams { display: none !important }",
  carrbeams: ".carriers, .navbeams { display: none !important }",
  beammask: ".navbeams g[mask] { mask: none !important }",
  metalyo: hide(".metalbd-yo"),
  metalall: hide(".metalbd, .metalbd-yo, .metalbd-glow, .metalbd-facets, [class*=metalbd]"),
  canvas: hide("canvas"),
  nav: hide("#nav"),
  navblend: "#nav { mix-blend-mode: normal !important }",
  refs: hide("#referenssit"),
  kart: hide("#kartoitus"),
  tulokset: hide("#tulokset"),
  video: hide("video"),
  blendall: "*, *::before, *::after { mix-blend-mode: normal !important }",
  filterall: "*, *::before, *::after { filter: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important }",
  shadowall: "*, *::before, *::after { box-shadow: none !important }",
  animall: "*, *::before, *::after { animation: none !important; transition: none !important }",
};
const ONLY = arg("only", "") ? arg("only").split(",") : Object.keys(V);
const out = {};
const b = await requireBrowser(ENGINE).launch(launchOptions(ENGINE));
try {
  for (let r = 0; r < RUNS; r++) for (const v of ONLY) {
    const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      try { localStorage.setItem("wsmedia.consent", JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch {}
      window.__f = []; window.__on = false; let last = 0;
      const tick = (t) => { if (window.__on) { if (last) window.__f.push([t - last, Math.round(scrollY)]); last = t; } else last = 0; requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    await page.goto(URL_, { waitUntil: "load" });
    await page.waitForFunction(() => !document.documentElement.classList.contains("hero-locked"), null, { timeout: 15000 }).catch(() => {});
    if (V[v]) await page.addStyleTag({ content: V[v] });
    await page.waitForTimeout(800);
    await page.mouse.move(W / 2, H / 2);
    // Paase lahtokohtaan Lenisin omalla tavalla: rullataan kunnes scrollY >= FROM
    for (let i = 0; i < 200 && (await page.evaluate(() => scrollY)) < FROM - 50; i++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(10); }
    await page.waitForTimeout(1200);
    const y0 = await page.evaluate(() => scrollY);
    await page.evaluate(() => { window.__f.length = 0; window.__on = true; });
    for (let i = 0; i < 200 && (await page.evaluate(() => scrollY)) < TO; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(16); }
    await page.waitForTimeout(400);
    const f = await page.evaluate(() => { window.__on = false; return window.__f; });
    (out[v] ||= []).push({ f, y0: Math.round(y0) });
    await ctx.close();
  }
} finally { await b.close().catch(() => {}); }
console.log(`${ENGINE} ${W}x${H}@${DPR} y${FROM}->${TO} runs=${RUNS}`);
for (const v of ONLY) {
  const all = out[v].flatMap((r) => r.f); const d = all.map((x) => x[0]).sort((a, b) => a - b);
  const q = (p) => d[Math.min(d.length - 1, Math.floor(d.length * p))].toFixed(1);
  const per = out[v].map((r) => (r.f.filter((x) => x[0] > 20).length / Math.max(1, r.f.length) * 100).toFixed(0)).join("/");
  console.log(`${v.padEnd(10)} med ${q(.5).padStart(5)} p95 ${q(.95).padStart(5)}  >20ms ${String((all.filter((x) => x[0] > 20).length / all.length * 100).toFixed(0)).padStart(3)}% (ajot ${per})  n=${all.length} alku=${out[v][0].y0}`);
}
