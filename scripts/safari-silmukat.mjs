/**
 * safari-silmukat.mjs — sammuttaa yhden per-kehys-silmukan kerrallaan
 * (requestAnimationFrame-kutsupaikan mukaan) ja mittaa kehysvalit.
 * Lisaksi vyohykkeittainen erittely ja mita osioita vyohykkeella on.
 *   node scripts/safari-silmukat.mjs [--engine=webkit] [--runs=3] [--only=..]
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);
const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const ENGINE = arg("engine", "webkit"), URL_ = arg("url", "https://wsmedia.fi/"), RUNS = +arg("runs", 3);
const W = +arg("w", 1440), H = +arg("h", 900), DPR = +arg("dpr", 2);
// Kutsupaikat live-buildista 7.10.2026 (chunk:sarake). Ks. raportti.
const V = {
  base: null,
  'x-siteeffects': "3ks4givajdq9s.js:1:48",
  'x-navcarriers': "3ks4givajdq9s.js:1:26",
  'x-heroscrub': "37a_k1wlv2fw2.js:1:20",
  'x-verkko': "37a_k1wlv2fw2.js:1:37",
};
const ONLY = arg("only", "") ? arg("only").split(",") : Object.keys(V);
const out = {}; let sections = null;
const b = await requireBrowser(ENGINE).launch(launchOptions(ENGINE));
try {
  for (let r = 0; r < RUNS; r++) for (const v of ONLY) {
    const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
    const page = await ctx.newPage();
    await page.addInitScript((blk) => {
      try { localStorage.setItem("wsmedia.consent", JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch {}
      const oRaf = window.requestAnimationFrame.bind(window);
      if (blk) window.requestAnimationFrame = (cb) => { const s = new Error().stack || ""; const line = s.split("\n").find((l) => /https?:/.test(l)) || ""; if (line.includes(blk.split(":")[0]) && new RegExp(blk.replace(/\./g, "\\.") + "\\d{3}").test(line)) { window.__blocked = (window.__blocked || 0) + 1; return 0; } return oRaf(cb); };
      window.__f = []; window.__on = false; let last = 0;
      const tick = (t) => { if (window.__on) { if (last) window.__f.push([t - last, Math.round(scrollY)]); last = t; } else last = 0; oRaf(tick); };
      oRaf(tick);
    }, V[v]);
    await page.goto(URL_, { waitUntil: "load" });
    await page.waitForFunction(() => !document.documentElement.classList.contains("hero-locked"), null, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const docH = await page.evaluate(() => document.documentElement.scrollHeight);
    if (!sections) sections = await page.evaluate(() => [...document.querySelectorAll("main > *, body > section, section[id], footer")].map((e) => ({ k: (e.id ? "#" + e.id : "") + "." + [...e.classList].slice(0, 2).join("."), y: Math.round(e.getBoundingClientRect().top + scrollY), h: Math.round(e.offsetHeight) })).filter((s) => s.h > 200));
    await page.mouse.move(W / 2, H / 2);
    await page.evaluate(() => { window.__f.length = 0; window.__on = true; });
    for (let i = 0; i * 100 < docH; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(16); }
    await page.waitForTimeout(600);
    const res = await page.evaluate(() => { window.__on = false; return { f: window.__f, blocked: window.__blocked || 0, maxY: Math.round(scrollY) }; });
    (out[v] ||= []).push(res);
    await ctx.close();
  }
} finally { await b.close().catch(() => {}); }
console.log(`${ENGINE} ${W}x${H}@${DPR} runs=${RUNS}`);
for (const v of ONLY) {
  const all = out[v].flatMap((r) => r.f); const d = all.map((x) => x[0]).sort((a, b) => a - b);
  const q = (p) => d[Math.min(d.length - 1, Math.floor(d.length * p))].toFixed(1);
  const per = out[v].map((r) => (r.f.filter((x) => x[0] > 20).length / r.f.length * 100).toFixed(0)).join("/");
  console.log(`${v.padEnd(15)} med ${q(.5)} p95 ${q(.95)}  >20ms ${(all.filter((x) => x[0] > 20).length / all.length * 100).toFixed(0)}% (ajot ${per})  estetty=${out[v][0].blocked} loppuY=${out[v].map((r) => r.maxY).join("/")}`);
}
const all = out[ONLY[0]].flatMap((r) => r.f); const z = new Map();
for (const [dt, y] of all) { const k = Math.floor(y / 1000) * 1000; const o = z.get(k) || { n: 0, bad: 0 }; o.n++; if (dt > 20) o.bad++; z.set(k, o); }
console.log(`vyohykkeet (${ONLY[0]}):`);
for (const [k, o] of [...z].sort((a, b) => a[0] - b[0])) console.log(`  y${String(k).padEnd(6)} >20ms ${String((o.bad / o.n * 100).toFixed(0)).padStart(3)}%  n=${o.n}   ${sections.filter((s) => s.y < k + 1000 + H && s.y + s.h > k).map((s) => s.k).join(" ")}`);
