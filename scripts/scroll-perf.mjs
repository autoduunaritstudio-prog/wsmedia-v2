/**
 * scroll-perf.mjs — vierityksen kehysajat ja renderointivaiheiden erittely.
 *
 * Ajo (tuotantobuild kaynnissa portissa 3111):
 *   node scripts/scroll-perf.mjs [--variant=base] [--url=...] [--cpu=1]
 *                                [--w=1254] [--h=783] [--dpr=2]
 *                                [--trace] [--headed] [--json=tiedosto]
 *
 * Vieritys ajetaan OIKEILLA wheel-tapahtumilla (page.mouse.wheel), jotta
 * Lenis kasittelee ne kuten kayttajan rullauksen. Kehysvalit mitataan
 * sivun sisalla requestAnimationFramella; --trace lisaksi kerää CDP:n
 * devtools-jaljen ja erittelee ajan tapahtumanimittain (Paint,
 * UpdateLayoutTree, Layout, CompositeLayers, ...).
 *
 * VARIANTIT (A/B). Jokainen asennetaan ennen sivun skripteja:
 *   base        ei muutosta
 *   nometal     .metalbd / -glow / -facets pois  (kayttajan alkuperainen A/B)
 *   noglow      vain .metalbd-glow pois
 *   nofacets    vain .metalbd-facets pois
 *   nocards     korttien oma metallipinta (.cmb) pois
 *   nowrite     kerrokset nakyvissa, mutta --mb-gx/--mb-gy -kirjoitukset
 *               nielaistaan -> eristaa per-frame-MAALAUKSEN siita etta
 *               kerros ylipaataan on olemassa
 *   noxf        fasettien ja ryhmien transformit jaadytetaan
 *   nomask nooopacity nopane nosticky noscrim nostroke novecteffect
 *   nofill contain smallbox emptysvg hidesvg opacity0 nowillchange
 *   panewc panewc2 panewc3     ks. CSS-taulukko alta
 *
 * VAROITUS RENDEROIJASTA. Tallä koneella headless kayttaa SwiftShaderia
 * (ohjelmistorasterointi) ja nakyva ikkuna oikeaa GPU:ta (ANGLE Metal,
 * M1 Pro). Mitattu: headless-mediaani 16,7 ms ja >20ms 43 %, sama ajo
 * --headed-lipulla mediaani 8,3 ms ja >20ms 0,0 %. RASTEROINTIIN
 * liittyvaa mittausta EI siis saa tehda headlessina - kaytä --headed.
 * Headless kelpaa yha ajoitus- ja logiikkatestaukseen (rv-verify).
 */
const PW = process.env.PW_ROOT || new URL("../node_modules/playwright/index.mjs", import.meta.url).href;
const { chromium } = await import(PW);

// SELAINBINAARI EI TULE npm ci:N MUKANA. Paketti asentuu, selain ei:
// playwrightilla ei ole asennusskriptia (lock: hasInstallScript=false),
// mika on tarkoituksellista - se pitaa Vercelin buildin kevyena. Siksi
// tarkistus tassa: kaadutaan selkeaan virheeseen sen sijaan etta
// Playwright heittaisi oman pitkan jaljityksensa. EI automaattista
// asennusta: se latailisi satoja megatavuja kysymatta.
const { existsSync } = await import("node:fs");
let __exe = null;
try { __exe = chromium.executablePath(); } catch { /* ei asennettu lainkaan */ }
if (!__exe || !existsSync(__exe)) {
  console.error("\nChromium-binaaria ei loydy. Playwright-paketti on asennettu, selain ei.\n\nAja:\n  npx playwright install chromium\n");
  process.exit(1);
}

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const has = (k) => process.argv.includes(`--${k}`);

const VARIANT = arg("variant", "base");
const TARGET = arg("url", "http://localhost:3111/");
const W = +arg("w", 1254), H = +arg("h", 783), DPR = +arg("dpr", 2), CPU = +arg("cpu", 1);

// CLAUDE.md: oletus headless; nakyva ikkuna vain pyynnosta ja silloin
// ruudun ulkopuolelle ilman taustathrottlausta.
const HEADED = has("headed");
const launchOpts = HEADED
  ? { headless: false, args: ["--window-position=-2400,0", "--disable-background-timer-throttling", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding"] }
  : { headless: true };

const CSS = {
  nometal: ".metalbd, .metalbd-glow, .metalbd-facets { display: none !important }",
  noglow: ".metalbd-glow { display: none !important }",
  nofacets: ".metalbd-facets { display: none !important }",
  nocards: ".cmb { display: none !important }",
  // Inline-tyyli haviaa !importantille tyylitiedostossa, joten tama
  // jaadyttaa myos SiteEffectsin joka kehyksessa kirjoittamat transformit.
  noxf: ".metalbd-facets, .mbf { transform: none !important }",
  // Maski pakottaa oman renderointivaiheen koko maskatulle alueelle.
  nomask: ".metalbd-inset { -webkit-mask-image: none !important; mask-image: none !important }",
  // opacity < 1 luo pinoamiskontekstin ja oman rasteroitavan alueen.
  noopacity: ".metalbd, .metalbd-dark, .cmb { opacity: 1 !important }",
  nopane: ".metalbd-pane { display: none !important }",
  // Sticky-pane liikkuu suhteessa dokumenttiin joka kehyksessa.
  nosticky: ".metalbd-pane { position: static !important }",
  noscrim: ".refscrim, .refsscrim { display: none !important }",
  // --- fasettikerroksen mekanismin eristys ---
  nostroke: ".mbf { stroke: none !important }",
  novecteffect: ".mbf circle { vector-effect: none !important }",
  nofill: ".mbc-1,.mbc-2,.mbc-3,.mbc-4,.mbc-5 { fill: none !important }",
  contain: ".metalbd-pane { contain: paint !important }",
  // Pienempi rasteroitava ala: 160% -> 110%
  smallbox: ".metalbd-facets { left:-5% !important; top:-5% !important; width:110% !important; height:110% !important }",
  // Sisalto pois mutta elementti jaa asetteluun ja kerroksiin
  emptysvg: ".mbf { stroke: none !important } .mbc-1,.mbc-2,.mbc-3,.mbc-4,.mbc-5 { fill: none !important }",
  hidesvg: ".metalbd-facets { visibility: hidden !important }",
  opacity0: ".metalbd-facets { opacity: 0 !important }",
  // Kerrospromootio pois: onko oma komposiittikerros itse ongelma?
  nowillchange: ".metalbd-facets, .mbf { will-change: auto !important }",
  // Sticky-panen sisalto ei muutu vierittaessa (vain hidas gx/gy ja
  // kierto), joten koko pane voisi olla YKSI komposiittikerros jota
  // kompositori pitaa paikallaan sen sijaan etta laatat rasteroidaan
  // uudelleen sisallon vierieessa ohi.
  panewc: ".metalbd-pane { will-change: transform !important }",
  panewc2: ".metalbd-pane { will-change: transform !important } .metalbd-facets, .mbf { will-change: auto !important }",
  panewc3: ".metalbd-pane { will-change: transform !important; contain: paint !important } .metalbd-facets, .mbf { will-change: auto !important }",
};

const RUNS = +arg("runs", 1);
const results = [];
const browser = await chromium.launch(launchOpts);
try {
for (let run = 0; run < RUNS; run++) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });

  if (VARIANT === "nowrite") {
    await page.addInitScript(() => {
      const orig = CSSStyleDeclaration.prototype.setProperty;
      CSSStyleDeclaration.prototype.setProperty = function (n, v, p) {
        if (n === "--mb-gx" || n === "--mb-gy") return;
        return orig.call(this, n, v, p);
      };
    });
  }

  // Kehysvalimittari asennetaan ennen sivun skripteja; nauhoitus alkaa
  // vasta kun __perfStart kutsutaan, jotta lataus ei sekoitu mittaukseen.
  await page.addInitScript(() => {
    window.__perf = { on: false, frames: [] };
    let last = 0;
    const tick = (t) => {
      if (window.__perf.on) {
        if (last) window.__perf.frames.push({ dt: t - last, y: Math.round(scrollY) });
        last = t;
      } else last = 0;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.__perfStart = () => { window.__perf.frames.length = 0; window.__perf.on = true; };
    window.__perfStop = () => { window.__perf.on = false; return window.__perf.frames; };
  });

  await page.goto(TARGET, { waitUntil: "commit" });
  if (CSS[VARIANT]) await page.addStyleTag({ content: CSS[VARIANT] });
  await page.waitForTimeout(3500); // latausruutu ohi, asettelu vakaa

  const docH = await page.evaluate(() => document.documentElement.scrollHeight);

  let traceEvents = [];
  if (has("trace")) {
    const chunks = [];
    cdp.on("Tracing.dataCollected", (d) => chunks.push(...d.value));
    await cdp.send("Tracing.start", {
      categories: "devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.frame",
      transferMode: "ReportEvents",
    });
    var stopTrace = async () => {
      const done = new Promise((r) => cdp.once("Tracing.tracingComplete", r));
      await cdp.send("Tracing.end");
      await done;
      traceEvents = chunks;
    };
  }

  await page.mouse.move(W / 2, H / 2);
  await page.evaluate(() => window.__perfStart());

  // Alas pohjaan ja takaisin oikeilla wheel-tapahtumilla.
  const STEP = 120;
  for (let i = 0; i * STEP < docH; i++) { await page.mouse.wheel(0, STEP); await page.waitForTimeout(16); }
  await page.waitForTimeout(400);
  for (let i = 0; i * STEP < docH; i++) { await page.mouse.wheel(0, -STEP); await page.waitForTimeout(16); }
  await page.waitForTimeout(400);

  const frames = await page.evaluate(() => window.__perfStop());
  if (has("trace")) await stopTrace();

  // ---- kehysvalitilastot ----
  const dts = frames.map((f) => f.dt).sort((a, b) => a - b);
  const pct = (p) => dts.length ? dts[Math.min(dts.length - 1, Math.floor(dts.length * p))] : 0;
  const over = (ms) => frames.filter((f) => f.dt > ms).length / Math.max(frames.length, 1) * 100;

  // ---- vyohykkeet 500px valein: missa nykiminen keskittyy ----
  const zones = new Map();
  for (const f of frames) {
    const z = Math.floor(f.y / 500) * 500;
    if (!zones.has(z)) zones.set(z, { n: 0, bad: 0, worst: 0 });
    const o = zones.get(z);
    o.n++; if (f.dt > 20) o.bad++; o.worst = Math.max(o.worst, f.dt);
  }
  const worstZones = [...zones.entries()]
    .filter(([, o]) => o.n >= 10)
    .map(([y, o]) => ({ y, n: o.n, badPct: +(o.bad / o.n * 100).toFixed(1), worst: +o.worst.toFixed(1) }))
    .sort((a, b) => b.badPct - a.badPct).slice(0, 6);

  // ---- jaljen erittely vaiheittain ----
  let phases = null;
  if (has("trace")) {
    const sum = {};
    for (const e of traceEvents) {
      if (e.ph !== "X" || typeof e.dur !== "number") continue;
      sum[e.name] = (sum[e.name] || 0) + e.dur / 1000;
    }
    phases = Object.entries(sum).sort((a, b) => b[1] - a[1]).slice(0, 14)
      .map(([name, ms]) => ({ name, ms: +ms.toFixed(1) }));
  }

  const out = {
    variant: VARIANT, w: W, h: H, dpr: DPR, cpu: CPU, frames: frames.length,
    medianMs: +pct(0.5).toFixed(2), p95Ms: +pct(0.95).toFixed(2),
    worstMs: +(dts.at(-1) ?? 0).toFixed(1),
    over20Pct: +over(20).toFixed(1), over40Pct: +over(40).toFixed(1),
    worstZones, phases,
  };
  results.push(out);
  const json = arg("json", "");
  if (json) (await import("node:fs")).writeFileSync(json, JSON.stringify(out, null, 1));
  if (RUNS === 1) {
    console.log(`${VARIANT.padEnd(9)} kehyksia ${String(out.frames).padStart(5)}  mediaani ${String(out.medianMs).padStart(6)} ms  p95 ${String(out.p95Ms).padStart(6)} ms  pahin ${String(out.worstMs).padStart(6)} ms  >20ms ${String(out.over20Pct).padStart(5)} %  >40ms ${String(out.over40Pct).padStart(5)} %`);
    if (worstZones.length) console.log(`          pahimmat vyohykkeet: ${worstZones.map((z) => `y${z.y} ${z.badPct}%`).join("  ")}`);
    if (phases) { console.log("          vaiheet (ms yhteensa):"); for (const p of phases) console.log(`            ${p.name.padEnd(34)} ${p.ms}`); }
  }
  await ctx.close();
}
if (RUNS > 1) {
  const m = (k) => results.map((r) => r[k]);
  const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
  const f = (a) => `${avg(a).toFixed(1)} (${Math.min(...a).toFixed(1)}-${Math.max(...a).toFixed(1)})`;
  console.log(`${VARIANT.padEnd(10)} n=${RUNS}  >20ms ${f(m("over20Pct")).padEnd(20)} >40ms ${f(m("over40Pct")).padEnd(18)} pahin ${f(m("worstMs"))}`);
  const zw = {};
  for (const r of results) for (const z of r.worstZones) { (zw[z.y] ??= []).push(z.badPct); }
  const top = Object.entries(zw).map(([y, a]) => [y, avg(a)]).sort((a, b) => b[1] - a[1]).slice(0, 4);
  console.log(`           pahimmat vyohykkeet: ${top.map(([y, v]) => `y${y} ${v.toFixed(0)}%`).join("  ")}`);
}
} finally {
  await browser.close().catch(() => {});
}
