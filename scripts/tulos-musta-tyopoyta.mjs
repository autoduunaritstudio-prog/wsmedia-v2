/**
 * tulos-musta-tyopoyta.mjs — etusivun Tulokset-nayttamo (tietokone): nakyyko
 * puhelimessa tumma ruutu kun asiakasta vaihdetaan. Kuvataan puhelimen naytto
 * aikapisteissa valinnan jalkeen ja lasketaan sen keskikirkkaus (0-255).
 * Videon tumma tausta on #0b131d (kirkkaus ~18); pysakuvat ovat selvasti kirkkaampia.
 *   node scripts/tulos-musta-tyopoyta.mjs [--url=http://localhost:3111/] [--viive=600]
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);
const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const URL_ = arg("url", "http://localhost:3111/"), VIIVE = +arg("viive", 600);
const AJAT = [30, 120, 250, 450, 700, 1000, 1600, 2400];
for (const eng of ["webkit", "chromium"]) {
  const b = await requireBrowser(eng).launch(launchOptions(eng));
  try {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.addInitScript(() => { try { localStorage.setItem("wsmedia.consent", JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch {} });
    if (VIIVE) await p.route(/\/referenssit\/.*\.(webp|mp4|jpg|png)(\?|$)/, async (r) => { await new Promise((x) => setTimeout(x, VIIVE)); r.continue(); });
    await p.goto(URL_, { waitUntil: "load" });
    await p.waitForFunction(() => !document.documentElement.classList.contains("hero-locked"), null, { timeout: 15000 }).catch(() => {});
    await p.evaluate(() => document.querySelector(".tn")?.scrollIntoView({ block: "center", behavior: "instant" }));
    await p.waitForTimeout(3000);
    const rivit = [];
    for (const tab of ["tn-tab-ydr", "tn-tab-colormaster", "tn-tab-ydr"]) {
      await p.click(`#${tab}`);
      const t0 = Date.now(); const arvot = [];
      for (const t of AJAT) {
        const odota = t - (Date.now() - t0); if (odota > 0) await p.waitForTimeout(odota);
        const box = await p.evaluate(() => { const e = document.querySelector(".tn-puhelin"); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + 14, y: r.y + 60, width: r.width - 28, height: r.height - 140 }; });
        if (!box) { arvot.push("-"); continue; }
        const png = await p.screenshot({ clip: box });
        const lum = await p.evaluate(async (b64) => { const im = new Image(); im.src = "data:image/png;base64," + b64; await im.decode(); const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const g = c.getContext("2d"); g.drawImage(im, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; return Math.round(s / (d.length / 4)); }, png.toString("base64"));
        arvot.push(lum);
      }
      rivit.push(`  ${tab.replace("tn-tab-", "").padEnd(12)} ${AJAT.map((t, i) => `${t}ms:${String(arvot[i]).padStart(3)}`).join("  ")}`);
    }
    console.log(`${eng} ${URL_} viive=${VIIVE}ms (puhelimen nayton keskikirkkaus)\n${rivit.join("\n")}`);
  } finally { await b.close(); }
}
