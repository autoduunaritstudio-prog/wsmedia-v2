/**
 * safari-kartta.mjs — koko sivun kehyskartta: vieritetaan loppuun asti oikeilla
 * rullatapahtumilla ja kirjataan kehysvalit 500 px:n vyohykkeittain osioineen.
 *   node scripts/safari-kartta.mjs [--engine=webkit] [--url=https://wsmedia.fi/] [--runs=4] [--css=...]
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);
const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const ENGINE = arg("engine", "webkit"), URL_ = arg("url", "https://wsmedia.fi/"), RUNS = +arg("runs", 4);
const BLOCK = arg("blockvars", "");
const W = +arg("w", 1440), H = +arg("h", 900), DPR = +arg("dpr", 2), CSS = arg("css", ""), ZONE = +arg("zone", 500);
const runs = []; let secs = [];
const b = await requireBrowser(ENGINE).launch(launchOptions(ENGINE));
try {
  for (let r = 0; r < RUNS; r++) {
    const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
    const page = await ctx.newPage();
    if (BLOCK) await page.addInitScript((list) => {
      // Estaa nimettyjen CSS-muuttujien kirjoituksen (etuliite), jolloin arvo jaa alkuarvoonsa.
      const pre = list.split(",");
      const o = CSSStyleDeclaration.prototype.setProperty;
      CSSStyleDeclaration.prototype.setProperty = function (n, v, p) { if (pre.some((x) => n.startsWith(x))) return; return o.call(this, n, v, p); };
    }, BLOCK);
    await page.addInitScript(() => {
      try { localStorage.setItem("wsmedia.consent", JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch {}
      window.__f = []; window.__on = false; let last = 0;
      const tick = (t) => { if (window.__on) { if (last) window.__f.push([t - last, Math.round(scrollY)]); last = t; } else last = 0; requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    await page.goto(URL_, { waitUntil: "load" });
    await page.waitForFunction(() => !document.documentElement.classList.contains("hero-locked"), null, { timeout: 15000 }).catch(() => {});
    if (CSS) await page.addStyleTag({ content: CSS });
    await page.waitForTimeout(1500);
    if (!secs.length) secs = await page.evaluate(() => [...document.querySelectorAll("header, section[id], footer, main > div, .stickyzone, .refzone, .aftercover")].map((e) => ({ k: e.id ? "#" + e.id : "." + (e.classList[0] || e.tagName.toLowerCase()), y: Math.round(e.getBoundingClientRect().top + scrollY), h: e.offsetHeight })).filter((s) => s.h > 300));
    await page.mouse.move(W / 2, H / 2);
    await page.evaluate(() => { window.__f.length = 0; window.__on = true; });
    let stuck = 0, prev = -1;
    for (let i = 0; i < 600 && stuck < 25; i++) {
      await page.mouse.wheel(0, 100); await page.waitForTimeout(16);
      const y = await page.evaluate(() => scrollY); stuck = y === prev ? stuck + 1 : 0; prev = y;
    }
    const f = await page.evaluate(() => { window.__on = false; return window.__f; });
    runs.push(f);
    await ctx.close();
  }
} finally { await b.close().catch(() => {}); }
const all = runs.flat(); const d = all.map((x) => x[0]).sort((a, b) => a - b);
console.log(`${ENGINE} ${URL_} ${W}x${H}@${DPR} runs=${RUNS} ${CSS ? "css=" + CSS : ""} ${BLOCK ? "blockvars=" + BLOCK : ""}`);
console.log(`koko sivu: med ${d[d.length >> 1].toFixed(1)} p95 ${d[Math.floor(d.length * .95)].toFixed(1)}  >20ms ${(all.filter((x) => x[0] > 20).length / all.length * 100).toFixed(0)}%  per ajo ${runs.map((f) => (f.filter((x) => x[0] > 20).length / f.length * 100).toFixed(0)).join("/")}  loppuY ${Math.max(...all.map((x) => x[1]))}`);
const z = new Map();
for (const [dt, y] of all) { const k = Math.floor(y / ZONE) * ZONE; const o = z.get(k) || { n: 0, bad: 0, s: 0 }; o.n++; o.s += dt; if (dt > 20) o.bad++; z.set(k, o); }
for (const [k, o] of [...z].sort((a, b) => a[0] - b[0])) {
  const pct = o.bad / o.n * 100;
  const here = secs.filter((s) => s.y < k + ZONE + H * 0.5 && s.y + s.h > k + H * 0.5).map((s) => s.k).join(" ");
  console.log(`  y${String(k).padEnd(6)} ${String(pct.toFixed(0)).padStart(3)}% ${"#".repeat(Math.round(pct / 5)).padEnd(20)} avg ${(o.s / o.n).toFixed(1)}ms n=${String(o.n).padStart(3)}  ${here}`);
}
