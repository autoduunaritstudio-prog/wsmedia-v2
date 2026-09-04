/**
 * motion-suspects.mjs — nelja reduced-motionin sammuttamaa asiaa erikseen.
 *
 * Ajo (tuotantobuild portissa 3111):
 *   node scripts/motion-suspects.mjs [--engine=chromium|webkit] [--w=1728]
 *                                    [--h=992] [--dpr=2] [--runs=1]
 *
 * YKSI SELAIMEN KAYNNISTYS: kaikki variantit ajetaan saman instanssin
 * sisalla omina konteksteinaan.
 *
 * MITTARIT. Kehysajat eivat toistu kayttajan ikkunakoolla, joten:
 *   Chromium  Paint + RasterTask CDP-jaljesta, seka kerrosmaara
 *   WebKit    ei CDP:ta -> joutokaynnin ja vierityksen kehysvalin EROTUS
 *             (perustaso +9 ms/kehys), joka on moottorin oma vertailu
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const ENGINE = arg("engine", "chromium");
const TARGET = arg("url", "http://localhost:3111/");
const W = +arg("w", 1728), H = +arg("h", 992), DPR = +arg("dpr", 2);
const HEADED = process.argv.includes("--headed");

/** Kiintea varjo = sama kaava --tilt = 0:lla, eli ulkoasu levossa. */
const FIXED_SHADOW =
  "[data-tilt]{box-shadow:0 26px 54px -26px rgba(13,13,16,.52),0 3px 10px -4px rgba(13,13,16,.30)!important}";

const CSS = {
  base: "",
  // Koko tilt pois: seka kaanto etta varjon animointi.
  notilt: `[data-tilt]{transform:none!important}${FIXED_SHADOW}`,
  // Vain VARJO jaadytetaan, kaanto jaa -> varjo on maalausta.
  noshadow: FIXED_SHADOW,
  // Vain KAANTO jaadytetaan, varjo jaa -> kaanto on komposiittia.
  norot: "[data-tilt]{transform:none!important}",
  norv: ".rv{opacity:1!important;transform:none!important;transition:none!important;animation:none!important}",
  nospin: ".gsurf-wheel{animation:none!important;filter:none!important}",
};

/** nocount ei ole CSS:aa: estetaan rullaus poistamalla data-count. */
const INIT_NOCOUNT = () => {
  const strip = () => document.querySelectorAll("[data-count]").forEach((e) => e.removeAttribute("data-count"));
  const boot = () => {
    if (!document.documentElement) return setTimeout(boot, 0);
    strip();
    new MutationObserver(strip).observe(document.documentElement, { subtree: true, childList: true });
  };
  boot();
};

const VARIANTS = ["base", "notilt", "noshadow", "norot", "norv", "nocount", "nospin"];

const browser = await requireBrowser(ENGINE).launch(launchOptions(ENGINE, HEADED));
const rows = [];
try {
  for (const v of VARIANTS) {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
    const page = await ctx.newPage();
    if (v === "nocount") await page.addInitScript(INIT_NOCOUNT);
    await page.addInitScript(() => {
      window.__f = { on: false, d: [] };
      let last = 0;
      const t = (x) => { if (window.__f.on) { if (last) window.__f.d.push(x - last); last = x; } else last = 0; requestAnimationFrame(t); };
      requestAnimationFrame(t);
      window.__fStart = () => { window.__f.d.length = 0; window.__f.on = true; };
      window.__fStop = () => { window.__f.on = false; return window.__f.d.slice(); };
    });

    let cdp = null, layers = [], chunks = [];
    if (ENGINE === "chromium") {
      cdp = await ctx.newCDPSession(page);
      await cdp.send("LayerTree.enable");
      cdp.on("LayerTree.layerTreeDidChange", (e) => layers.push((e.layers || []).length));
    }

    await page.goto(TARGET, { waitUntil: "commit" });
    if (CSS[v]) await page.addStyleTag({ content: CSS[v] });
    await page.waitForTimeout(4000);
    await page.evaluate(() => document.querySelectorAll("video").forEach((x) => x.pause()));

    // joutokaynti: moottorin oma perustaso
    await page.evaluate(() => window.__fStart());
    await page.waitForTimeout(1500);
    const idle = await page.evaluate(() => window.__fStop());

    if (cdp) {
      cdp.on("Tracing.dataCollected", (d) => chunks.push(...d.value));
      await cdp.send("Tracing.start", { categories: "devtools.timeline,disabled-by-default-devtools.timeline", transferMode: "ReportEvents" });
    }
    await page.mouse.move(W / 2, H / 2);
    await page.evaluate(() => window.__fStart());
    const docH = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let i = 0; i * 140 < docH; i++) { await page.mouse.wheel(0, 140); await page.waitForTimeout(16); }
    await page.waitForTimeout(300);
    const scroll = await page.evaluate(() => window.__fStop());
    let paint = null, raster = null;
    if (cdp) {
      const done = new Promise((r) => cdp.once("Tracing.tracingComplete", r));
      await cdp.send("Tracing.end"); await done;
      const sum = {};
      for (const e of chunks) if (e.ph === "X" && typeof e.dur === "number") sum[e.name] = (sum[e.name] || 0) + e.dur / 1000;
      paint = +(sum.Paint || 0).toFixed(1); raster = +(sum.RasterTask || 0).toFixed(1);
    }
    const med = (a) => { const s = a.slice().sort((x, y) => x - y); return s.length ? +s[s.length >> 1].toFixed(1) : 0; };
    rows.push({ v, idle: med(idle), scroll: med(scroll), delta: +(med(scroll) - med(idle)).toFixed(1),
      paint, raster, layers: layers.length ? `${Math.min(...layers)}-${Math.max(...layers)}` : "-" });
    await ctx.close();
  }
} finally { await browser.close().catch(() => {}); }

const b = rows[0];
console.log(`\n=== ${ENGINE}  ${W}x${H} dpr ${DPR} ===`);
console.log(`  ${"variantti".padEnd(10)} ${"joutok.".padStart(8)} ${"vieritys".padStart(9)} ${"erotus".padStart(7)}` +
  (ENGINE === "chromium" ? ` ${"Paint ms".padStart(9)} ${"Raster ms".padStart(10)} ${"kerroksia".padStart(10)}` : ""));
for (const r of rows) {
  const d = (n, base) => base && n !== null ? ` (${n - base >= 0 ? "+" : ""}${((n - base) / base * 100).toFixed(0)} %)` : "";
  console.log(`  ${r.v.padEnd(10)} ${String(r.idle).padStart(8)} ${String(r.scroll).padStart(9)} ${String(r.delta).padStart(7)}` +
    (ENGINE === "chromium" ? ` ${String(r.paint).padStart(9)}${d(r.paint, b.paint).padEnd(9)} ${String(r.raster).padStart(10)}${d(r.raster, b.raster).padEnd(9)} ${r.layers.padStart(10)}` : ""));
}
