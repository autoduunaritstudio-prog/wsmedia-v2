/**
 * flicker-scan.mjs — valkkymisen mittaus LIIKKEESSA, ei paikallaan.
 *
 * Ajo (tuotantobuild kaynnissa portissa 3111):
 *   node scripts/flicker-scan.mjs [--variant=base] [--from=4000] [--to=9000]
 *                                 [--step=60] [--headed] [--engine=chromium]
 *
 * MENETELMA. Paikallaan mittaaminen ei kata tilaa jossa oire esiintyy.
 * Tassa otetaan kaappaus joka askeleella, siirretaan EDELLISTA kaappausta
 * scrollY-erotuksen verran ja verrataan vasta sitten. Normaalissa
 * vierityksessa jaannos on lahella nollaa: sisalto on sama, se vain
 * liikkui. Valkkyminen nakyy suurena ja oskilloivana jaannoksena.
 *
 * Samalla seurataan CDP:n LayerTreesta komposiittikerrosten LUKUMAARAA
 * ja yhteismuistia funktiona scrollY:sta. Jos kerrosmaara heiluu samassa
 * kohdassa kuin jaannos, syy on kerrosbudjetissa.
 *
 * Askelten valissa odotetaan kunnes vieritys on asettunut, jotta
 * scrollY:n luku ja kaappaus vastaavat samaa hetkea - muuten jaannos
 * mittaisi omaa kilpajuoksuaan.
 */
const PW = process.env.PW_ROOT || new URL("../node_modules/playwright/index.mjs", import.meta.url).href;
const pw = await import(PW);
const { createRequire } = await import("node:module");
const require = createRequire(new URL("../package.json", import.meta.url));
const sharp = require("sharp");

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const has = (k) => process.argv.includes(`--${k}`);

const ENGINE = arg("engine", "chromium");
const VARIANT = arg("variant", "base");
const TARGET = arg("url", "http://localhost:3111/");
const FROM = +arg("from", 0), TO = +arg("to", 11000), STEP = +arg("step", 60);
const W = +arg("w", 1254), H = +arg("h", 783);

const engine = pw[ENGINE];
const { existsSync } = await import("node:fs");
let __exe = null;
try { __exe = engine.executablePath(); } catch { /* ei asennettu */ }
if (!__exe || !existsSync(__exe)) {
  console.error(`\n${ENGINE}-binaaria ei loydy.\n\nAja:\n  npx playwright install ${ENGINE}\n`);
  process.exit(1);
}

const CSS = {
  nowillchange: "*, *::before, *::after { will-change: auto !important }",
  norefsopacity: ".refs { opacity: 1 !important }",
  nocmb: ".cmb { display: none !important }",
  nometal: ".metalbd { display: none !important }",
  novideo: "video { visibility: hidden !important }",
};

const launchOpts = has("headed")
  ? { headless: false, args: ENGINE === "chromium" ? ["--window-position=-2400,0", "--disable-background-timer-throttling", "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding"] : [] }
  : { headless: true };

const browser = await engine.launch(launchOpts);
try {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  // LayerTree vain Chromiumille; WebKit ei tue CDP:ta.
  const layers = [];
  let cdp = null;
  if (ENGINE === "chromium") {
    cdp = await ctx.newCDPSession(page);
    await cdp.send("LayerTree.enable");
    cdp.on("LayerTree.layerTreeDidChange", (e) => {
      const ls = e.layers || [];
      layers.push({ t: Date.now(), n: ls.length, mem: ls.reduce((a, l) => a + (l.width || 0) * (l.height || 0), 0) });
    });
  }

  await page.goto(TARGET, { waitUntil: "commit" });
  if (CSS[VARIANT]) await page.addStyleTag({ content: CSS[VARIANT] });
  await page.waitForTimeout(4000);
  if (has("novideo") || VARIANT === "novideo") await page.evaluate(() => document.querySelectorAll("video").forEach((v) => v.pause()));

  const raw = async () => sharp(await page.screenshot()).raw().toBuffer({ resolveWithObject: true });

  // Jaannos: siirra edellista dy:n verran ja vertaa paallekkain jaavaa osaa.
  const residual = (prev, cur, dy) => {
    const { data: A, info } = prev, { data: B } = cur;
    const w = info.width, h = info.height, ch = info.channels;
    let diff = 0, tot = 0;
    const rows = new Array(h).fill(0);
    for (let y = 0; y + dy < h && y >= 0; y++) {
      const ya = y + dy; if (ya < 0 || ya >= h) continue;
      for (let x = 0; x < w; x++) {
        const ia = (ya * w + x) * ch, ib = (y * w + x) * ch;
        tot++;
        if (Math.abs(A[ia] - B[ib]) > 12 || Math.abs(A[ia + 1] - B[ib + 1]) > 12 || Math.abs(A[ia + 2] - B[ib + 2]) > 12) { diff++; rows[y]++; }
      }
    }
    return { pct: tot ? +(diff / tot * 100).toFixed(2) : 0, rows };
  };

  await page.evaluate((y) => scrollTo(0, y), FROM);
  await page.waitForTimeout(900);
  let prev = await raw();
  let prevY = await page.evaluate(() => Math.round(scrollY));
  const series = [];
  for (let target = FROM + STEP; target <= TO; target += STEP) {
    await page.evaluate((y) => scrollTo(0, y), target);
    // odota kunnes vieritys on asettunut: kaappaus ja scrollY samasta hetkesta
    await page.evaluate(async () => {
      let a = -1, b = scrollY, n = 0;
      while (a !== b && n++ < 30) { a = b; await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); b = scrollY; }
    });
    const y = await page.evaluate(() => Math.round(scrollY));
    const cur = await raw();
    const dy = y - prevY;
    const r = residual(prev, cur, dy);
    const layerNow = layers.length ? layers[layers.length - 1] : null;
    series.push({ y, dy, res: r.pct, rows: r.rows, layers: layerNow?.n ?? null, mem: layerNow ? Math.round(layerNow.mem / 1e6) : null });
    prev = cur; prevY = y;
  }

  const med = [...series.map((s) => s.res)].sort((a, b) => a - b)[series.length >> 1];
  const peaks = series.filter((s) => s.res > Math.max(2, med * 4)).sort((a, b) => b.res - a.res);
  console.log(`\n=== ${ENGINE} / ${VARIANT}  scrollY ${FROM}..${TO} askel ${STEP} ===`);
  console.log(`  naytteita ${series.length}, jaannoksen mediaani ${med.toFixed(2)} %, max ${Math.max(...series.map((s) => s.res)).toFixed(2)} %`);
  console.log(`  piikkeja (> max(2%, 4x mediaani)): ${peaks.length}`);
  for (const p of peaks.slice(0, 12)) {
    const top = p.rows.map((n, i) => [i, n]).filter(([, n]) => n > W * 0.05).map(([i]) => i);
    const band = top.length ? `rivit ${top[0]}-${top[top.length - 1]} / ${H}` : "hajallaan";
    console.log(`    y=${String(p.y).padStart(5)}  jaannos ${String(p.res).padStart(6)} %  dy=${String(p.dy).padStart(4)}  ${band}  kerroksia ${p.layers ?? "-"}`);
  }
  if (layers.length) {
    const ns = layers.map((l) => l.n);
    console.log(`  KERROKSET: muutoksia ${layers.length}, min ${Math.min(...ns)}, max ${Math.max(...ns)}, viimeinen ${ns[ns.length - 1]}`);
    const sy = series.filter((s) => s.layers !== null);
    if (sy.length) {
      const uniq = [...new Set(sy.map((s) => s.layers))];
      console.log(`  kerrosmaara scrollY:n funktiona: ${uniq.length} eri arvoa ${JSON.stringify(uniq.slice(0, 12))}`);
      console.log(`  muistin huippu ${Math.max(...sy.map((s) => s.mem))} Mpx`);
    }
  }
} finally {
  await browser.close().catch(() => {});
}
