/**
 * safari-jsaika.mjs — erottaa JS-ajan renderoinnista WebKitissa ja Chromiumissa.
 * Kaarii requestAnimationFrame-, scroll- ja wheel-kasittelijat ja kirjaa
 * jokaisen ajon keston rekisterointipaikan (skripti:rivi:sarake) mukaan.
 *   node scripts/safari-jsaika.mjs --engine=webkit|chromium [--url=] [--runs=2]
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);
const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const ENGINE = arg("engine", "webkit"), URL_ = arg("url", "https://wsmedia.fi/"), RUNS = +arg("runs", 2);
const W = 1440, H = 900, DPR = 2;
const agg = new Map(); const frames = [];
const b = await requireBrowser(ENGINE).launch(launchOptions(ENGINE));
try {
  for (let r = 0; r < RUNS; r++) {
    const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      try { localStorage.setItem("wsmedia.consent", JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch {}
      const M = window.__M = { on: false, cost: {}, fr: [], js: 0 };
      const where = () => { const s = (new Error().stack || "").split("\n").map((l) => l.trim()).filter((l) => /https?:/.test(l)); const l = s[1] || s[0] || "?"; const m = l.match(/([^/]+\.js[^)]*?)(?:\)|$)/); return m ? m[1] : l.slice(-60); };
      const wrap = (fn, key) => function (...a) { const t = performance.now(); try { return fn.apply(this, a); } finally { if (M.on) { const d = performance.now() - t; M.js += d; const c = M.cost[key] || (M.cost[key] = [0, 0, 0]); c[0] += d; c[1]++; if (d > c[2]) c[2] = d; } } };
      const oRaf = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = (cb) => oRaf(wrap(cb, "raf " + where()));
      const oAdd = EventTarget.prototype.addEventListener;
      const map = new WeakMap();
      EventTarget.prototype.addEventListener = function (t, f, o) {
        if (f && (t === "scroll" || t === "wheel" || t === "resize" || t === "pointermove" || t === "mousemove") && typeof f === "function") {
          let w = map.get(f); if (!w) { w = wrap(f, t + " " + where()); map.set(f, w); } return oAdd.call(this, t, w, o);
        }
        return oAdd.call(this, t, f, o);
      };
      const oRem = EventTarget.prototype.removeEventListener;
      EventTarget.prototype.removeEventListener = function (t, f, o) { return oRem.call(this, t, (f && map.get(f)) || f, o); };
      let last = 0;
      const tick = (t) => { if (M.on) { if (last) M.fr.push([t - last, M.js]); M.js = 0; last = t; } else last = 0; oRaf(tick); };
      oRaf(tick);
    });
    await page.goto(URL_, { waitUntil: "load" });
    await page.waitForFunction(() => !document.documentElement.classList.contains("hero-locked"), null, { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const docH = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.mouse.move(W / 2, H / 2);
    await page.evaluate(() => { window.__M.on = true; });
    for (let i = 0; i * 100 < docH; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(16); }
    await page.waitForTimeout(500);
    const res = await page.evaluate(() => { window.__M.on = false; return { cost: window.__M.cost, fr: window.__M.fr, kevyt: document.documentElement.dataset.kevyt || "-" }; });
    console.log(`run ${r}: data-kevyt=${res.kevyt}`);
    frames.push(...res.fr);
    for (const [k, [s, n, mx]] of Object.entries(res.cost)) { const o = agg.get(k) || [0, 0, 0]; o[0] += s; o[1] += n; o[2] = Math.max(o[2], mx); agg.set(k, o); }
    await ctx.close();
  }
} finally { await b.close().catch(() => {}); }
const d = frames.map((f) => f[0]).sort((a, b) => a - b), q = (p) => d[Math.floor(d.length * p)].toFixed(1);
const js = frames.map((f) => f[1]).sort((a, b) => a - b), qj = (p) => js[Math.floor(js.length * p)].toFixed(2);
const slow = frames.filter((f) => f[0] > 20);
console.log(`${ENGINE}: kehysvali med ${q(.5)} p95 ${q(.95)} ms | JS/kehys med ${qj(.5)} p95 ${qj(.95)} ms | hitaita (>20ms) ${(slow.length / frames.length * 100).toFixed(0)}%, niiden JS keskim. ${(slow.reduce((a, f) => a + f[1], 0) / Math.max(1, slow.length)).toFixed(2)} ms`);
const totalMs = frames.reduce((a, f) => a + f[0], 0);
console.log(`kokonaisaika ${(totalMs / 1000).toFixed(1)} s, JS yhteensa ${(frames.reduce((a, f) => a + f[1], 0) / 1000).toFixed(2)} s`);
for (const [k, [s, n, mx]] of [...agg].sort((a, b) => b[1][0] - a[1][0]).slice(0, 14)) console.log(`  ${(s).toFixed(0).padStart(6)} ms  n=${String(n).padStart(5)}  keskim ${(s / n).toFixed(2)}  max ${mx.toFixed(1)}  ${k}`);
