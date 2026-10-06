/**
 * safari-eristys.mjs — etsii WebKit-kohtaisen kehyspudotuksen syyn.
 * Yksi selain, jokainen variantti omassa kontekstissaan. Variantti
 * poistaa yhden efektin CSS-injektiolla; muuten sivu on ennallaan.
 *   node scripts/safari-eristys.mjs [--engine=webkit] [--url=https://wsmedia.fi/]
 *        [--runs=2] [--only=a,b] [--w=1440 --h=900 --dpr=2]
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);
const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const ENGINE = arg("engine", "webkit"), URL_ = arg("url", "https://wsmedia.fi/");
const RUNS = +arg("runs", 2), W = +arg("w", 1440), H = +arg("h", 900), DPR = +arg("dpr", 2);

const V = {
  base: "",
  beams: ".navbeams { display: none !important }",
  beammask: ".navbeams g[mask] { mask: none !important }",
  noblend: "*, *::before, *::after { mix-blend-mode: normal !important }",
  navblend: "#nav { mix-blend-mode: normal !important }",
  nobackdrop: "*, *::before, *::after { backdrop-filter: none !important; -webkit-backdrop-filter: none !important }",
  nofilter: "*, *::before, *::after { filter: none !important }",
  nometal: ".metalbd, .metalbd-glow, .metalbd-facets, .metalbd-yo { display: none !important }",
  nocanvas: "canvas { display: none !important }",
  noanim: "*, *::before, *::after { animation-play-state: paused !important; transition: none !important }",
  noshadow: "*, *::before, *::after { box-shadow: none !important; text-shadow: none !important }",
  novideo: "video { display: none !important }",
  nojs: "",
  control: "",
  nolenis: "",
};
const ONLY = arg("only", "") ? arg("only").split(",") : Object.keys(V);

const out = {};
const b = await requireBrowser(ENGINE).launch(launchOptions(ENGINE));
try {
  for (const v of ONLY) {
    out[v] = [];
    for (let r = 0; r < RUNS; r++) {
      const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR, javaScriptEnabled: v !== "nojs" });
      const page = await ctx.newPage();
      await page.addInitScript(() => {
        try { localStorage.setItem("wsmedia.consent", JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch {}
        window.__f = []; window.__on = false; let last = 0;
        const tick = (t) => { if (window.__on) { if (last) window.__f.push([t - last, Math.round(scrollY)]); last = t; } else last = 0; requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      });
      if (v === "nolenis") await page.route(/\.js(\?|$)/, async (rt) => {
        const res = await rt.fetch(); let body = await res.text();
        // Lenisin raf-kutsu ja wheel-kuuntelija pois: korvataan konstruktorin kaynnistys
        if (/lerp/.test(body) && /wheelMultiplier/.test(body)) body = body.replace(/addEventListener\("wheel"/g, 'addEventListener("x-wheel"');
        await rt.fulfill({ response: res, body });
      });
      if (v === "control") await page.setContent(`<body style="margin:0">${Array.from({length:300},(_, i)=>`<p style="height:60px;margin:0;background:hsl(${i*7},50%,60%)">rivi ${i}</p>`).join("")}</body>`);
      else await page.goto(URL_, { waitUntil: "load" });
      if (v === "nojs") await page.addStyleTag({ content: "html,body{overflow:auto!important;height:auto!important}" }).catch(()=>{});
      if (V[v]) await page.addStyleTag({ content: V[v] });
      await page.waitForFunction(() => !document.documentElement.classList.contains("hero-locked"), null, { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(1500);
      const docH = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.mouse.move(W / 2, H / 2);
      if (v === "nojs" || v === "control") await page.evaluate(() => { window.__f=[]; window.__on=true; let last=0; const tick=(t)=>{ if(window.__on){ if(last) window.__f.push([t-last, Math.round(scrollY)]); last=t;} requestAnimationFrame(tick);}; requestAnimationFrame(tick); }).catch(()=>{});
      await page.evaluate(() => { window.__f.length = 0; window.__on = true; });
      for (let i = 0; i * 100 < docH; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(16); }
      await page.waitForTimeout(500);
      const f = await page.evaluate(() => { window.__on = false; return window.__f; });
      out[v].push(f);
      await ctx.close();
    }
  }
} finally { await b.close().catch(() => {}); }

const pr = (v) => {
  const all = out[v].flat(); const d = all.map((x) => x[0]).sort((a, b) => a - b);
  const q = (p) => d[Math.min(d.length - 1, Math.floor(d.length * p))].toFixed(1);
  const over = (ms) => (all.filter((x) => x[0] > ms).length / all.length * 100).toFixed(0);
  return `${v.padEnd(11)} med ${q(.5).padStart(5)}  p95 ${q(.95).padStart(5)}  >20ms ${over(20).padStart(3)}%  >34ms ${over(34).padStart(3)}%  n=${all.length} maxY=${Math.max(...all.map((x)=>x[1]))}`;
};
console.log(`${ENGINE} ${W}x${H}@${DPR} ${URL_} runs=${RUNS}`);
for (const v of ONLY) console.log(pr(v));
if (arg("zones")) {
  const all = out[ONLY[0]].flat(); const z = new Map();
  for (const [dt, y] of all) { const k = Math.floor(y / 1000) * 1000; const o = z.get(k) || { n: 0, s: 0, bad: 0 }; o.n++; o.s += dt; if (dt > 20) o.bad++; z.set(k, o); }
  for (const [k, o] of [...z].sort((a, b) => a[0] - b[0])) console.log(`  y${k}  avg ${(o.s / o.n).toFixed(1)} ms  >20ms ${(o.bad / o.n * 100).toFixed(0)}%  n=${o.n}`);
}
