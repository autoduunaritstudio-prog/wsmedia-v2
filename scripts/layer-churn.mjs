/**
 * layer-churn.mjs — komposiittikerrosten VAIHTUVUUS scrollatessa.
 *
 * Ajo (tuotantobuild portissa 3111):
 *   node scripts/layer-churn.mjs [--w=1728] [--h=992] [--from=6500]
 *                                [--to=9500] [--step=50] [--variant=base]
 *
 * Ei mittaa muistia. Muistihypoteesi kaatui aiemmin: ehdotettu korjaus
 * muutti kerrosmuistia 0,7 % eika se voi selittaa oiretta.
 *
 * Tassa kysytaan onko kerrosjoukko VAKAA scrollin aikana. Overlap-syysta
 * ylennetty kerros voi syntya ja purkautua sen mukaan mitka elementit
 * sattuvat olemaan paallekkain, ja purku pakottaa uudelleenmaalauksen.
 *
 * HEADED on pakko: headless ajaa talla koneella SwiftShaderilla.
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const TARGET = arg("url", "http://localhost:3111/");
const W = +arg("w", 1728), H = +arg("h", 992);
const FROM = +arg("from", 6500), TO = +arg("to", 9500), STEP = +arg("step", 50);
const VARIANT = arg("variant", "base");

const CSS = {
  base: "",
  nomask: ".logostrip { -webkit-mask-image: none !important; mask-image: none !important }",
  nostripwc: ".logostrip-track { will-change: auto !important }",
  nomaskwc: ".logostrip { -webkit-mask-image: none !important; mask-image: none !important } .logostrip-track { will-change: auto !important }",
  nombf: ".mbf { will-change: auto !important }",
  nofacets: ".metalbd-facets { display: none !important }",
  noblob: ".metalbd-blob { display: none !important }",
  nobackdrop: ".backdrop { display: none !important }",
};

const browser = await requireBrowser("chromium").launch(launchOptions("chromium", true));
try {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await page.goto(TARGET, { waitUntil: "commit" });
  if (CSS[VARIANT]) await page.addStyleTag({ content: CSS[VARIANT] });
  await page.waitForTimeout(4500);
  await page.evaluate(() => document.querySelectorAll("video").forEach((v) => v.pause()));
  await cdp.send("DOM.enable");
  await cdp.send("LayerTree.enable");

  let latest = null;
  cdp.on("LayerTree.layerTreeDidChange", (e) => { latest = e.layers || []; });

  const nameCache = new Map();
  const nameOf = async (id) => {
    if (!id) return "(ei solmua)";
    if (nameCache.has(id)) return nameCache.get(id);
    let name = "(ei solmua)";
    try {
      const d = await cdp.send("DOM.describeNode", { backendNodeId: id });
      const n = d.node; name = n.localName || n.nodeName || "?";
      const at = n.attributes || [];
      for (let i = 0; i < at.length; i += 2) {
        if (at[i] === "id") name = "#" + at[i + 1];
        else if (at[i] === "class" && !name.startsWith("#")) name += "." + at[i + 1].split(/\s+/).slice(0, 3).join(".");
      }
    } catch { /* solmu ehti kadota */ }
    nameCache.set(id, name);
    return name;
  };

  const samples = [];
  for (let y = FROM; y <= TO; y += STEP) {
    await page.evaluate((v) => scrollTo(0, v), y);
    await page.evaluate(async () => { let a=-1,b=scrollY,n=0; while(a!==b&&n++<40){a=b;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));b=scrollY;} });
    latest = null;
    await page.evaluate(() => scrollBy(0, 1));
    const t0 = Date.now();
    while (latest === null && Date.now() - t0 < 1500) await page.waitForTimeout(30);
    if (latest === null) continue;
    const map = new Map();
    for (const l of latest) {
      const key = (l.backendNodeId ?? "x") + ":" + Math.round(l.width) + "x" + Math.round(l.height);
      map.set(key, { id: l.backendNodeId, paint: l.paintCount ?? 0, w: Math.round(l.width), h: Math.round(l.height), layerId: l.layerId });
    }
    samples.push({ y: await page.evaluate(() => Math.round(scrollY)), n: latest.length, map });
  }

  // a) kerroslukumaara
  const counts = samples.map((s) => s.n);
  const uniq = [...new Set(counts)].sort((a, b) => a - b);
  console.log(`\n=== ${VARIANT}  ${W}x${H} dpr 2   scrollY ${FROM}..${TO} askel ${STEP} (${samples.length} naytetta) ===`);
  console.log(`  a) KERROSLUKUMAARA  min ${Math.min(...counts)}  max ${Math.max(...counts)}  eri arvoja ${uniq.length}  ${JSON.stringify(uniq)}`);
  if (uniq.length === 1) console.log(`     -> VAKIO, ei vaihtuvuutta lukumaarassa`);

  // b) ilmestyvat / katoavat kerrokset
  const flips = new Map();
  for (let i = 1; i < samples.length; i++) {
    const prev = samples[i - 1].map, cur = samples[i].map;
    for (const k of cur.keys()) if (!prev.has(k)) {
      const e = flips.get(k) ?? { in: 0, out: 0, ys: [], id: cur.get(k).id, dim: cur.get(k).w + "x" + cur.get(k).h };
      e.in++; if (e.ys.length < 6) e.ys.push("+" + samples[i].y); flips.set(k, e);
    }
    for (const k of prev.keys()) if (!cur.has(k)) {
      const e = flips.get(k) ?? { in: 0, out: 0, ys: [], id: prev.get(k).id, dim: prev.get(k).w + "x" + prev.get(k).h };
      e.out++; if (e.ys.length < 6) e.ys.push("-" + samples[i].y); flips.set(k, e);
    }
  }
  console.log(`  b) VAIHTAVAT KERROKSET: ${flips.size} kpl`);
  const sorted = [...flips.entries()].sort((a, b) => (b[1].in + b[1].out) - (a[1].in + a[1].out)).slice(0, 15);
  for (const [, e] of sorted) {
    const name = await nameOf(e.id);
    let reasons = "-";
    console.log(`     ${name.padEnd(30)} ${e.dim.padEnd(12)} ilmestyi ${e.in}x katosi ${e.out}x   ${e.ys.join(" ")}`);
  }
  if (!flips.size) console.log(`     -> yksikaan kerros ei ilmestynyt eika kadonnut`);

  // c) paintCount kasvaa
  const first = new Map(), last = new Map();
  for (const s of samples) for (const [k, v] of s.map) { if (!first.has(k)) first.set(k, v.paint); last.set(k, v.paint); }
  const grew = [];
  for (const [k, f] of first) { const d = (last.get(k) ?? f) - f; if (d > 5) grew.push({ k, d, id: samples.find(s=>s.map.has(k)).map.get(k) }); }
  grew.sort((a, b) => b.d - a.d);
  console.log(`  c) paintCount kasvoi > 5: ${grew.length} kerrosta`);
  for (const g of grew.slice(0, 12)) {
    const name = await nameOf(g.id.id);
    console.log(`     ${name.padEnd(30)} ${(g.id.w + "x" + g.id.h).padEnd(12)} +${g.d} maalausta`);
  }
} finally { await browser.close().catch(() => {}); }
