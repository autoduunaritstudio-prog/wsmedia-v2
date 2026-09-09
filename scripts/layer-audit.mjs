/**
 * layer-audit.mjs — komposiittikerrosten lukumaara, tekstuurimuisti ja
 * promootiosyyt kahdessa nakymakoossa.
 *
 * Ajo (tuotantobuild portissa 3111):
 *   node scripts/layer-audit.mjs [--variants=base,nowc] [--url=...]
 *
 * HEADED on pakko: talla koneella headless ajaa SwiftShaderilla, ja
 * kerrostus on GPU-riippuvaista. Renderoija tulostetaan raporttiin.
 *
 * Mitattavat koot ovat kiinteat: 1728x992 ja 864x496, molemmat dpr 2.
 * Vyohyke johdetaan .cal- ja .case-elementtien sijainnista, jotta
 * mittaus osuu samaan sisaltoon vaikka sivun korkeus muuttuu koon
 * mukana.
 *
 * Tekstuurikoko = leveys * korkeus * 4. LayerTreen width/height ovat jo
 * laitepikseleita, joten dpr EI kerrota uudelleen - se olisi
 * nelinkertainen yliarvio.
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const TARGET = arg("url", "http://localhost:3111/");
const VARIANTS = arg("variants", "base").split(",").filter(Boolean);

/** Varianttien CSS asennetaan sivun latauksen jalkeen. */
const CSS = {
  base: "",
  nobdp: "#bdP1,#bdP2,#bdP3,#bdP4,#bdP5 { will-change: auto !important }",
  nobtn: ".btn { will-change: auto !important }",
  nopar: "[data-par] { will-change: auto !important }",
  nostrip: ".logostrip-track { will-change: auto !important }",
  nomask: ".logostrip { -webkit-mask-image: none !important; mask-image: none !important }",
  // Kaikki nelja epailtya kerralla, metalbd ja tilt koskematta.
  ehdotus: [
    "#bdP1,#bdP2,#bdP3,#bdP4,#bdP5 { will-change: auto !important }",
    ".btn { will-change: auto !important }",
    "[data-par] { will-change: auto !important }",
  ].join(" "),
};

const SIZES = [
  { w: 1728, h: 992 },
  { w: 864, h: 496 },
];

const browser = await requireBrowser("chromium").launch(launchOptions("chromium", true));
const out = [];
try {
  // Renderoijan varmistus kerran.
  {
    const c = await browser.newContext();
    const p = await c.newPage();
    await p.goto("about:blank");
    const gl = await p.evaluate(() => {
      const cv = document.createElement("canvas");
      const g = cv.getContext("webgl2") || cv.getContext("webgl");
      if (!g) return "ei WebGL";
      const d = g.getExtension("WEBGL_debug_renderer_info");
      return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER);
    });
    console.log(`  RENDEROIJA: ${gl}`);
    if (/SwiftShader|llvmpipe/i.test(gl)) { console.error("  OHJELMISTORASTEROINTI - mittaus ei kelpaa"); process.exit(1); }
    await c.close();
  }

  for (const VARIANT of VARIANTS) {
    for (const { w, h } of SIZES) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await page.goto(TARGET, { waitUntil: "commit" });
      if (CSS[VARIANT]) await page.addStyleTag({ content: CSS[VARIANT] });
      await page.waitForTimeout(4500);
      await page.evaluate(() => document.querySelectorAll("video").forEach((v) => v.pause()));

      // Vyohyke .cal:n ylareunasta viimeisen .case:n alareunaan, keskikohta.
      const mid = await page.evaluate(() => {
        const cal = document.querySelector(".cal");
        const last = [...document.querySelectorAll(".case")].at(-1);
        if (!cal) return null;
        const top = cal.getBoundingClientRect().top + scrollY;
        const bot = last ? last.getBoundingClientRect().bottom + scrollY : top + innerHeight;
        return Math.round((top + bot) / 2 - innerHeight / 2);
      });
      await page.evaluate((y) => scrollTo(0, y), mid ?? 0);
      await page.evaluate(async () => { let a=-1,b=scrollY,n=0; while(a!==b&&n++<40){a=b;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));b=scrollY;} });
      await page.waitForTimeout(700);

      await cdp.send("DOM.enable");
      await cdp.send("LayerTree.enable");
      const got = new Promise((r) => cdp.once("LayerTree.layerTreeDidChange", r));
      await page.evaluate(() => scrollBy(0, 1));
      await page.waitForTimeout(800);
      const ev = await got;
      const layers = ev.layers || [];

      let bytes = 0;
      for (const l of layers) bytes += (l.width || 0) * (l.height || 0) * 4;

      const top = layers.slice().sort((a, b) => b.width * b.height - a.width * a.height).slice(0, 10);
      const rows = [];
      for (const l of top) {
        let name = "(ei solmua)";
        if (l.backendNodeId) {
          try {
            const d = await cdp.send("DOM.describeNode", { backendNodeId: l.backendNodeId });
            const n = d.node; name = n.localName || n.nodeName || "?";
            const at = n.attributes || [];
            for (let i = 0; i < at.length; i += 2) {
              if (at[i] === "id") name = "#" + at[i + 1];
              else if (at[i] === "class" && !name.startsWith("#")) name += "." + at[i + 1].split(/\s+/).slice(0, 3).join(".");
            }
          } catch { /* solmu ehti kadota */ }
        }
        let reasons = [];
        try {
          const r = await cdp.send("LayerTree.compositingReasons", { layerId: l.layerId });
          reasons = r.compositingReasonIds?.length ? r.compositingReasonIds : (r.compositingReasons || []);
        } catch { /* ei saatavilla */ }
        rows.push({ name, w: Math.round(l.width), h: Math.round(l.height),
          mb: +((l.width * l.height * 4) / 1048576).toFixed(1), reasons: reasons.slice(0, 3).join(", ") || "-" });
      }
      out.push({ VARIANT, w, h, y: mid, n: layers.length, mb: +(bytes / 1048576).toFixed(1), rows });
      await ctx.close();
    }
  }
} finally { await browser.close().catch(() => {}); }

for (const o of out) {
  console.log(`\n=== ${o.VARIANT}  ${o.w}x${o.h} dpr 2  (scrollY ${o.y}) ===`);
  console.log(`  kerroksia ${o.n}, tekstuurimuisti ${o.mb} MB`);
  console.log(`  kymmenen suurinta:`);
  for (const r of o.rows) console.log(`    ${String(r.mb).padStart(6)} MB  ${String(r.w).padStart(5)}x${String(r.h).padStart(5)}  ${r.name.padEnd(30)} ${r.reasons}`);
}
console.log("\n  YHTEENVETO");
for (const o of out) console.log(`    ${o.VARIANT.padEnd(10)} ${String(o.w).padStart(4)}x${String(o.h).padStart(3)}  kerroksia ${String(o.n).padStart(4)}  muisti ${String(o.mb).padStart(7)} MB`);
