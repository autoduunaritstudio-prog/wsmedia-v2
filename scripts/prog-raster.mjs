/**
 * prog-raster.mjs — mita #prog-palkin taustan ja leveysanimaation muoto
 * maksaa maalauksessa ja rasteroinnissa.
 *
 * Ajo (tuotantobuild kaynnissa portissa 3200):
 *   node scripts/prog-raster.mjs [--url=...] [--runs=3] [--headed]
 *
 * TAUSTA. eb339c2 paikansi valkkymisen .cal- ja .case-vyohykkeelle ja
 * osoitti sen rasterirajoitteiseksi (RasterTask 19-23 ms). #prog on
 * kiinnitetty koko nakyman levyinen palkki jonka leveys kirjoitetaan
 * uudelleen JOKA kehyksessa. Kun sen tausta on pelkka vari, Chromium voi
 * pitaa kerroksen yhtena varina eika rasteroi siita laattoja lainkaan.
 * Taustakuva (myos kahden identtisen pysakin gradientti) vie tuon
 * mahdollisuuden, jolloin jokainen leveyden muutos on uusi rasterointi.
 *
 * VARIANTIT
 *   solid    background: var(--blue)                 (tila ennen 9.9.)
 *   grad     background: linear-gradient(sama vari)  (nykyinen puu)
 *   scalex   gradientti + width: 100% + scaleX()     (ehdotus)
 *   noprog   #prog kokonaan pois                     (ylaraja hyodylle)
 *
 * MITATTAVAT. Yhden ajon aikana: CDP-jaljen Paint- ja RasterTask-summat
 * mitatulta vyohykkeelta, LayerTree.layerPainted -tapahtumien lukumaara
 * ja kehysvalit. Vyohyke johdetaan .cal- ja .case-elementtien omasta
 * sijainnista, ei kovakoodatusta scrollY:sta, koska sivun korkeus muuttuu
 * osioita lisattaessa ja poistettaessa.
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const has = (k) => process.argv.includes(`--${k}`);

const TARGET = arg("url", "http://localhost:3200/");
const RUNS = +arg("runs", 3);
const W = +arg("w", 1728), H = +arg("h", 992), DPR = +arg("dpr", 2);
const HEADED = has("headed");

/** Tyyliohitus varianteittain. Inline-leveys vaatii !importantin. */
const CSS = {
  solid: "#prog { background: var(--blue) !important }",
  grad: "",
  scalex:
    "#prog { width: 100% !important; transform-origin: 0 50%; will-change: transform }",
  noprog: "#prog { display: none !important }",
};

/**
 * scaleX-variantti: sovellus kirjoittaa yha style.widthin, joten kirjoitus
 * ohjataan transformiksi elementtikohtaisella asetusfunktiolla. Inline-
 * ominaisuus varjostaa prototyypin, joten muut elementit eivat hairiinny.
 */
const SCALEX_PATCH = () => {
  const el = document.getElementById("prog");
  if (!el) return;
  Object.defineProperty(el.style, "width", {
    configurable: true,
    get: () => "100%",
    set(v) {
      const p = (parseFloat(v) || 0) / 100;
      el.style.transform = `scaleX(${p.toFixed(4)})`;
    },
  });
  el.style.transform = "scaleX(0)";
};

const FRAME_METER = () => {
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
};

const median = (a) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[s.length >> 1] : 0; };

const browser = await requireBrowser("chromium").launch(launchOptions("chromium", HEADED));
const results = {};
try {
  for (const variant of ["solid", "grad", "scalex", "noprog"]) {
    results[variant] = [];
    for (let run = 0; run < RUNS; run++) {
      const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);

      await page.addInitScript(FRAME_METER);
      await page.goto(TARGET, { waitUntil: "commit" });
      if (CSS[variant]) await page.addStyleTag({ content: CSS[variant] });
      if (variant === "scalex") await page.evaluate(SCALEX_PATCH);
      await page.waitForTimeout(3500); // latausruutu ohi, asettelu vakaa

      // Vyohyke .cal:n ylareunasta .case-kolmikon alareunaan, molemmin
      // puolin yksi nakyma marginaalia.
      const band = await page.evaluate(() => {
        const q = (s) => document.querySelector(s);
        const cal = q(".cal"), cases = [...document.querySelectorAll(".case")];
        if (!cal) return null;
        const top = cal.getBoundingClientRect().top + scrollY;
        const last = cases.at(-1);
        const bottom = last ? last.getBoundingClientRect().bottom + scrollY : top + innerHeight;
        return { from: Math.max(0, Math.round(top - innerHeight)), to: Math.round(bottom) };
      });
      if (!band) throw new Error(".cal puuttuu sivulta - vaara URL?");

      let painted = 0;
      await cdp.send("LayerTree.enable");
      cdp.on("LayerTree.layerPainted", () => { painted++; });

      const chunks = [];
      cdp.on("Tracing.dataCollected", (d) => chunks.push(...d.value));

      await page.evaluate((y) => scrollTo(0, y), band.from);
      await page.waitForTimeout(700);
      await page.mouse.move(W / 2, H / 2);

      await cdp.send("Tracing.start", {
        categories: "devtools.timeline,disabled-by-default-devtools.timeline",
        transferMode: "ReportEvents",
      });
      painted = 0;
      await page.evaluate(() => window.__perfStart());

      // Oikeilla wheel-tapahtumilla vyohykkeen lapi alas ja takaisin.
      const STEP = 120;
      const steps = Math.ceil((band.to - band.from) / STEP);
      for (let pass = 0; pass < 2; pass++) {
        const dir = pass === 0 ? 1 : -1;
        for (let i = 0; i < steps; i++) {
          await page.mouse.wheel(0, dir * STEP);
          await page.waitForTimeout(16);
        }
        await page.waitForTimeout(300);
      }

      const frames = await page.evaluate(() => window.__perfStop());
      // Ulkoasun tarkistus samasta ajosta: palkin PIIRTYVAN suorakulmion
      // leveyden on vastattava etenemaa, ja korkeuden on pysyttava 2 px.
      const bar = await page.evaluate(() => {
        const el = document.getElementById("prog");
        if (!el || getComputedStyle(el).display === "none") return null;
        const r = el.getBoundingClientRect();
        const max = document.documentElement.scrollHeight - innerHeight;
        return {
          w: Math.round(r.width), h: +r.height.toFixed(2),
          expected: Math.round((max > 0 ? scrollY / max : 0) * innerWidth),
        };
      });
      const done = new Promise((r) => cdp.once("Tracing.tracingComplete", r));
      await cdp.send("Tracing.end");
      await done;

      const sum = {};
      for (const e of chunks) {
        if (e.ph !== "X" || typeof e.dur !== "number") continue;
        sum[e.name] = (sum[e.name] || 0) + e.dur / 1000;
      }
      const dts = frames.map((f) => f.dt);
      results[variant].push({
        band, bar,
        paint: +(sum.Paint || 0).toFixed(1),
        raster: +(sum.RasterTask || 0).toFixed(1),
        layerPainted: painted,
        frames: frames.length,
        medianMs: +median(dts).toFixed(2),
        over20: +(frames.filter((f) => f.dt > 20).length / Math.max(frames.length, 1) * 100).toFixed(1),
      });
      await ctx.close();
    }
    const r = results[variant];
    console.log(
      `${variant.padEnd(7)} n=${r.length}  Paint ${String(median(r.map((x) => x.paint))).padStart(7)} ms  ` +
      `RasterTask ${String(median(r.map((x) => x.raster))).padStart(7)} ms  ` +
      `layerPainted ${String(median(r.map((x) => x.layerPainted))).padStart(5)}  ` +
      `kehysvali ${String(median(r.map((x) => x.medianMs))).padStart(5)} ms  ` +
      `>20ms ${String(median(r.map((x) => x.over20))).padStart(5)} %`,
    );
    console.log(`        ajot: ${r.map((x) => `P${x.paint}/R${x.raster}/L${x.layerPainted}`).join("  ")}`);
    const bars = r.map((x) => x.bar).filter(Boolean);
    if (bars.length) {
      console.log(`        palkki: ${bars.map((b) => `${b.w}px (odotus ${b.expected}px), korkeus ${b.h}px`).join("  ")}`);
    }
  }
  const b = results.grad[0].band;
  console.log(`\nvyohyke scrollY ${b.from}..${b.to}, ikkuna ${W}x${H} dpr ${DPR}`);
} finally {
  await browser.close().catch(() => {});
}
