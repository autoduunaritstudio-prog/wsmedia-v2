/**
 * engine-perf.mjs — sama mittaus Chromiumilla ja WebKitilla.
 *
 * Ajo (tuotantobuild kaynnissa portissa 3111):
 *   node scripts/engine-perf.mjs [--engine=chromium|webkit] [--variant=base]
 *                                [--runs=1] [--url=...] [--w=1254] [--h=783]
 *                                [--dpr=2] [--headed] [--reduce]
 *
 * Mittaa kaksi asiaa samasta ajosta:
 *   a) LATAUS: aika sivun alusta siihen kun html.hero-locked poistuu
 *      (HeroScrubin release), seka kehysten latausmaara sita ennen
 *   b) VIERITYS: kehysvalit vyohykkeittain, oikeilla wheel-tapahtumilla
 *
 * HUOM MENETELMASTA: Playwrightin WebKit EI OLE SAFARI. Se on sama
 * moottori (WebKit) eri sovelluskuoressa: eri prosessimalli, eri
 * GPU-polku, ei Safarin omia optimointeja eika sen laajennuksia. Se
 * riittaa renderointi- ja dekoodauspolun tutkimiseen, mutta lopullinen
 * vahvistus on tehtava oikeassa Safarissa kasin.
 *
 * CDP:ta ei kayteta: WebKit ei tue sita. Kaikki mittaus on sivun
 * sisaista instrumentointia, joten se on identtinen molemmilla
 * moottoreilla eika vertailu vinoudu tyokalusta.
 */
const { pw, launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const has = (k) => process.argv.includes(`--${k}`);

const ENGINE = arg("engine", "chromium");
const VARIANT = arg("variant", "base");
const TARGET = arg("url", "http://localhost:3111/");
const W = +arg("w", 1254), H = +arg("h", 783), DPR = +arg("dpr", 2), RUNS = +arg("runs", 1);

if (!engine) { console.error(`Tuntematon moottori: ${ENGINE}`); process.exit(1); }


const HEADED = process.argv.includes("--headed");
// Chromiumin taustathrottlauksen estot eivat pade WebKitiin; se ei
// myoskaan tue naita lippuja, joten ne annetaan vain Chromiumille.

const CSS = {
  // HYPOTEESI B: sekoitustila pakottaa alla olevan alueen uudelleen-
  // maalauksen. Navi on koko nakyman levyinen ja position: sticky.
  navblend: "#nav { mix-blend-mode: normal !important }",
  navhide: "#nav { display: none !important }",
  nometal: ".metalbd, .metalbd-glow, .metalbd-facets { display: none !important }",
  nocards: ".cmb { display: none !important }",
};

const results = [];
const browser = await requireBrowser(ENGINE).launch(launchOptions(ENGINE, HEADED));
try {
for (let run = 0; run < RUNS; run++) {
  const ctx = await browser.newContext({
    viewport: { width: W, height: H }, deviceScaleFactor: DPR,
    reducedMotion: has("reduce") ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();

  // HYPOTEESI C: estä VAIN Lenis, ei muuta. Puhtaampi kuin
  // reduced-motion, joka sammuttaa myos scrubin ja paljastukset.
  if (VARIANT === "nolenis") {
    await page.addInitScript(() => {
      // Lenis kuuntelee wheelia window-tasolla. Estetaan sen
      // rekisterointi antamatta muun sivun muuttua.
      const origAdd = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function (t, f, o) {
        if ((t === "wheel" || t === "touchstart" || t === "touchmove") && this === window && new Error().stack?.includes("lenis")) return;
        return origAdd.call(this, t, f, o);
      };
    });
  }

  await page.addInitScript(() => {
    window.__m = { t0: performance.now(), unlockAt: null, frames: [], on: false, draw: [], decode: [] };
    window.__mStart = () => { window.__m.frames.length = 0; window.__m.draw.length = 0; window.__m.on = true; };
    window.__mStop = () => { window.__m.on = false; return { frames: window.__m.frames, draw: window.__m.draw }; };
    let last = 0;
    const tick = (t) => {
      if (window.__m.on) { if (last) window.__m.frames.push({ dt: t - last, y: Math.round(scrollY) }); last = t; }
      else last = 0;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // JARJESTYS ON OLENNAINEN: document.documentElement on null
    // init-skriptin ajohetkella (document_start), joten sita koskeva
    // observer heittaisi ja keskeyttaisi loput - myos __mStartin
    // maarittelyn. Mittari maaritellaan siksi ensin ja DOM-riippuvat
    // osat vasta kun juuri on olemassa.
    addEventListener("hero:unlocked", () => { window.__m.unlockAt ??= Math.round(performance.now() - window.__m.t0); });
    const watchRoot = () => {
      const root = document.documentElement;
      if (!root) return;
      const watch = () => {
        if (root.classList.contains("hero-locked")) window.__m.sawLock = true;
        else if (window.__m.sawLock) window.__m.unlockAt ??= Math.round(performance.now() - window.__m.t0);
      };
      watch();
      new MutationObserver(watch).observe(root, { attributes: true, attributeFilter: ["class"] });
    };
    if (document.documentElement) watchRoot();
    else addEventListener("readystatechange", watchRoot, { once: true });

    // drawImage-kesto: kertooko WebKit dekoodaavansa vasta piirrettaessa
    const proto = CanvasRenderingContext2D.prototype;
    const origDraw = proto.drawImage;
    proto.drawImage = function (...a) {
      const s = performance.now();
      const r = origDraw.apply(this, a);
      const d = performance.now() - s;
      if (window.__m.draw.length < 4000) window.__m.draw.push(d);
      return r;
    };

  });

  await page.goto(TARGET, { waitUntil: "commit" });
  if (CSS[VARIANT]) await page.addStyleTag({ content: CSS[VARIANT] });

  // a) odota vapautusta, enintaan 20 s
  const unlockAt = await page.evaluate(async () => {
    const t = Date.now();
    while (window.__m.unlockAt === null && Date.now() - t < 20000) await new Promise((r) => setTimeout(r, 50));
    return window.__m.unlockAt;
  });
  const loadDraw = await page.evaluate(() => {
    const d = window.__m.draw.slice();
    const s = d.slice().sort((a, b) => a - b);
    return { n: d.length, med: s.length ? +s[s.length >> 1].toFixed(2) : 0, max: s.length ? +s.at(-1).toFixed(2) : 0, total: +d.reduce((a, b) => a + b, 0).toFixed(1) };
  });

  await page.waitForTimeout(1200);
  const docH = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.mouse.move(W / 2, H / 2);
  await page.evaluate(() => window.__mStart());
  const STEP = 120;
  for (let i = 0; i * STEP < docH; i++) { await page.mouse.wheel(0, STEP); await page.waitForTimeout(16); }
  await page.waitForTimeout(400);
  for (let i = 0; i * STEP < docH; i++) { await page.mouse.wheel(0, -STEP); await page.waitForTimeout(16); }
  await page.waitForTimeout(400);
  const { frames, draw } = await page.evaluate(() => window.__mStop());

  const dts = frames.map((f) => f.dt).sort((a, b) => a - b);
  const pct = (p) => dts.length ? dts[Math.min(dts.length - 1, Math.floor(dts.length * p))] : 0;
  const over = (ms) => frames.filter((f) => f.dt > ms).length / Math.max(frames.length, 1) * 100;
  const zones = new Map();
  for (const f of frames) {
    const z = Math.floor(f.y / 500) * 500;
    if (!zones.has(z)) zones.set(z, { n: 0, bad: 0 });
    const o = zones.get(z); o.n++; if (f.dt > 20) o.bad++;
  }
  const ds = draw.slice().sort((a, b) => a - b);
  results.push({
    unlockMs: unlockAt, loadDraw,
    medianMs: +pct(0.5).toFixed(2), p95Ms: +pct(0.95).toFixed(2), worstMs: +(dts.at(-1) ?? 0).toFixed(1),
    over20: +over(20).toFixed(1), over40: +over(40).toFixed(1), frames: frames.length,
    scrollDraw: { n: draw.length, med: ds.length ? +ds[ds.length >> 1].toFixed(2) : 0, p95: ds.length ? +ds[Math.floor(ds.length * 0.95)].toFixed(2) : 0, max: ds.length ? +ds.at(-1).toFixed(2) : 0 },
    zones: [...zones.entries()].filter(([, o]) => o.n >= 10).map(([y, o]) => ({ y, bad: +(o.bad / o.n * 100).toFixed(0) })).sort((a, b) => b.bad - a.bad).slice(0, 5),
  });
  await ctx.close();
}
} finally { await browser.close().catch(() => {}); }

const avg = (f) => (results.reduce((a, r) => a + f(r), 0) / results.length);
const rng = (f) => `${avg(f).toFixed(1)} (${Math.min(...results.map(f)).toFixed(1)}-${Math.max(...results.map(f)).toFixed(1)})`;
console.log(`${ENGINE.padEnd(8)} ${VARIANT.padEnd(9)} n=${RUNS}`);
console.log(`  LATAUS   vapautus ${rng((r) => r.unlockMs)} ms   drawImage latauksen aikana: n=${results[0].loadDraw.n} mediaani ${results[0].loadDraw.med} ms, pahin ${results[0].loadDraw.max} ms, yhteensa ${results[0].loadDraw.total} ms`);
console.log(`  VIERITYS mediaani ${rng((r) => r.medianMs)} ms  p95 ${rng((r) => r.p95Ms)} ms  pahin ${rng((r) => r.worstMs)} ms  >20ms ${rng((r) => r.over20)} %  >40ms ${rng((r) => r.over40)} %`);
console.log(`  drawImage vierityksessa: n=${results[0].scrollDraw.n} mediaani ${results[0].scrollDraw.med} ms p95 ${results[0].scrollDraw.p95} ms pahin ${results[0].scrollDraw.max} ms`);
if (results[0].zones.length) console.log(`  pahimmat vyohykkeet: ${results[0].zones.map((z) => `y${z.y} ${z.bad}%`).join("  ")}`);
