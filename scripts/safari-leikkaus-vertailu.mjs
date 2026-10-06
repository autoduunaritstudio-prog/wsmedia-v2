/**
 * safari-leikkaus-vertailu.mjs — todentaa etta NavCarriersin clipPath-leikkaus
 * tuottaa saman kuvan kuin entinen SVG-maski (rect rx=20), ja etta elava sivu
 * kirjoittaa leikkaukseen korttireian keilavyohykkeella.
 *   node scripts/safari-leikkaus-vertailu.mjs [--url=http://localhost:3111/]
 */
const { pw, launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);
const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const URL_ = arg("url", "http://localhost:3111/");
const cases = [[300, 200, 700, 380], [120, 90, 30, 25], [50.5, 60.3, 900.2, 410.7]];
const page = (kind, idx) => `<body style="margin:0;background:#000"><svg width="1200" height="700" style="display:block"><defs>
${cases.map(([x, y, w, h], i) => kind === "mask"
  ? `<mask id="m${i}" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%"><rect x="0" y="0" width="100%" height="100%" fill="#fff"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="#000"/></mask>`
  : (() => { const rx = Math.min(20, w / 2), ry = Math.min(20, h / 2), f = (v) => v.toFixed(1);
      const d = `M-10000 -10000H20000V20000H-10000ZM${f(x + rx)} ${f(y)}H${f(x + w - rx)}A${f(rx)} ${f(ry)} 0 0 1 ${f(x + w)} ${f(y + ry)}V${f(y + h - ry)}A${f(rx)} ${f(ry)} 0 0 1 ${f(x + w - rx)} ${f(y + h)}H${f(x + rx)}A${f(rx)} ${f(ry)} 0 0 1 ${f(x)} ${f(y + h - ry)}V${f(y + ry)}A${f(rx)} ${f(ry)} 0 0 1 ${f(x + rx)} ${f(y)}Z`;
      return `<clipPath id="m${i}" clipPathUnits="userSpaceOnUse"><path clip-rule="evenodd" d="${d}"/></clipPath>`; })()).join("")}
</defs>${cases.map((_, i) => `<g ${kind === "mask" ? "mask" : "clip-path"}="url(#m${i})" style="display:${i === idx ? "inline" : "none"}"><rect width="1200" height="700" fill="#fff"/></g>`).join("")}</svg></body>`;
for (const engine of ["webkit", "chromium"]) {
  const b = await requireBrowser(engine).launch(launchOptions(engine));
  try {
    const ctx = await b.newContext({ viewport: { width: 1200, height: 700 }, deviceScaleFactor: 2 });
    const p = await ctx.newPage();
    for (let i = 0; i < cases.length; i++) {
      const shots = {};
      for (const k of ["mask", "clip"]) { await p.setContent(page(k, i)); shots[k] = await p.screenshot({ type: "png" }); }
      // vertaa pikseleittain kankaalla
      const diff = await p.evaluate(async ([a, c]) => {
        const load = (b64) => new Promise((r) => { const im = new Image(); im.onload = () => r(im); im.src = "data:image/png;base64," + b64; });
        const [ia, ic] = await Promise.all([load(a), load(c)]);
        const cv = (im) => { const x = document.createElement("canvas"); x.width = im.width; x.height = im.height; const g = x.getContext("2d"); g.drawImage(im, 0, 0); return g.getImageData(0, 0, im.width, im.height).data; };
        const da = cv(ia), dc = cv(ic); let n = 0, mx = 0, tumma = 0, valo = 0;
        for (let j = 0; j < da.length; j += 4) { const d = Math.abs(da[j] - dc[j]); if (d > 0) n++; if (d > mx) mx = d; if (da[j] < 128) tumma++; else valo++; }
        return { px: da.length / 4, eri: n, max: mx, tumma, valo };
      }, [shots.mask.toString("base64"), shots.clip.toString("base64")]);
      console.log(`${engine} tapaus ${i} ${JSON.stringify(cases[i])}: eroavia pikseleita ${diff.eri}/${diff.px}, suurin ero ${diff.max}/255 (reika ${diff.tumma} px, valaistu ${diff.valo} px)`);
    }
    if (engine === "webkit") {
      const q = await ctx.newPage();
      await q.addInitScript(() => { try { localStorage.setItem("wsmedia.consent", JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch {} });
      await q.setViewportSize({ width: 1440, height: 900 });
      await q.goto(URL_, { waitUntil: "load" });
      await q.waitForFunction(() => !document.documentElement.classList.contains("hero-locked"), null, { timeout: 15000 }).catch(() => {});
      await q.mouse.move(700, 450);
      const rows = [];
      for (let i = 0; i < 80; i++) {
        await q.mouse.wheel(0, 100); await q.waitForTimeout(40);
        const s = await q.evaluate(() => { const g = document.querySelector('.navbeams [data-b="grp"]'); const c = document.querySelector('.navbeams [data-b="clip"]'); return { y: Math.round(scrollY), op: g ? +g.style.opacity : null, holes: c ? (c.getAttribute("d").match(/M/g) || []).length - 1 : null, cp: g?.getAttribute("clip-path"), mask: !!document.querySelector(".navbeams mask") }; });
        rows.push(s);
      }
      const on = rows.filter((r) => r.op > 0.001);
      console.log(`elava sivu: keila nakyvissa ${on.length}/${rows.length} naytteessa (y ${on[0]?.y}-${on.at(-1)?.y}), niista reia kanssa ${on.filter((r) => r.holes === 1).length}; clip-path=${rows[0].cp}, mask-elementti jaljella=${rows[0].mask}`);
    }
    await ctx.close();
  } finally { await b.close().catch(() => {}); }
}
