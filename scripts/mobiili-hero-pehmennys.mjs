/**
 * mobiili-hero-pehmennys.mjs: etusivun heron pehmennyksen tarkistus (9.10.2026).
 *   node scripts/mobiili-hero-pehmennys.mjs  (tuotantobuild portissa 4100)
 * Nykiva vieritys 60 px / 4 kehysta: elokuvaruudun hyppy per kehys, lopputila,
 * paluu ylos, hyppy kansi-vaiheeseen, reduced motion (= raaka arvo).
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);
const browser = await requireBrowser("chromium").launch(launchOptions("chromium"));
const POHJA = "http://localhost:4100";
try {
  for (const reduced of [false, true]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: reduced ? "reduce" : "no-preference" });
    await ctx.addInitScript(`try{localStorage.setItem("wsmedia.consent",JSON.stringify({analytics:false,v:1,ts:Date.now()}))}catch(e){}`);
    await ctx.route("**/*", (q) => (new URL(q.request().url()).hostname === "localhost" ? q.continue() : q.abort()));
    const p = await ctx.newPage();
    const errs = [];
    p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
    await p.goto(POHJA + "/", { waitUntil: "load" });
    await p.waitForFunction(() => !document.documentElement.dataset.lataus, null, { timeout: 20000 }).catch(() => {});
    await p.waitForTimeout(1500);
    const r = await p.evaluate(async () => {
      const ruutu = document.querySelector("[data-etu=ruutu]");
      const teksti = document.querySelector("[data-etu=teksti]");
      const raf = () => new Promise((r) => requestAnimationFrame(r));
      const tila = () => ruutu.style.backgroundPosition + " | " + teksti.style.transform;
      const fi = () => { const [x, y] = ruutu.style.backgroundPosition.split(" ").map(parseFloat); return Math.round((x / 100) * 7) + 8 * Math.round((y / 100) * 4); };
      // Nykiva vieritys: 60 px askel joka 4. kehys, 0..640
      const hypyt = []; let ed = fi();
      for (let y = 60; y <= 600; y += 60) {
        window.scrollTo({ top: y, behavior: "instant" });
        for (let k = 0; k < 4; k++) { await raf(); const f = fi(); hypyt.push(Math.abs(f - ed)); ed = f; }
      }
      for (let k = 0; k < 40; k++) await raf();
      const lopussa = { y: scrollY, f: fi(), odotettu: Math.round(Math.min(1, scrollY / 650) * 37) };
      // Paluu ylos
      window.scrollTo({ top: 0, behavior: "instant" });
      for (let k = 0; k < 40; k++) await raf();
      const ylhaalla = tila();
      // Keskelle hyppy (kansi-vaihe)
      window.scrollTo({ top: 650 + innerHeight * 0.5, behavior: "instant" });
      await raf(); await raf();
      const hypynJalkeen = tila();
      return { maxHyppy: Math.max(...hypyt), hypyt: hypyt.join(","), lopussa, ylhaalla, hypynJalkeen };
    });
    // Uudelleenlataus keskelta
    await p.reload({ waitUntil: "load" });
    await p.waitForTimeout(1500);
    const lataus = await p.evaluate(() => ({ y: scrollY, t: document.querySelector("[data-etu=teksti]").style.transform }));
    console.log(JSON.stringify({ reduced, ...r, lataus, errs }, null, 1));
    await ctx.close();
  }
} finally { await browser.close(); }
