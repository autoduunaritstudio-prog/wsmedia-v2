const D = process.env.RAE_DIR || require('path').join(__dirname, 'tyo'); require('fs').mkdirSync(D, { recursive: true });
const { launch } = require('../lib.cjs'); const fs = require('fs');
(async () => { const b = await launch(); try {
  const bgs = (process.argv[2] || '#0b0f14').split(','); const nimi = (process.argv[3] || bgs[0]).replace('#', ''); // kuvan pohjavari, oletus = ensimmainen
  for (const bg of bgs) for (const dpr of [1, 2]) {
    const ctx = await b.newContext({ viewport: { width: 720, height: 540 }, deviceScaleFactor: dpr }); const p = await ctx.newPage();
    const u1 = 'data:image/png;base64,' + fs.readFileSync(D + `/rae-${nimi}-1x.png`).toString('base64'), u2 = 'data:image/png;base64,' + fs.readFileSync(D + `/rae-${nimi}-2x.png`).toString('base64');
    await p.setContent(`<!doctype html><html><head><style>body{margin:0;background:${bg}}.r{position:fixed;inset:0;background-image:url("${dpr === 2 ? u2 : u1}");background-size:180px 180px}</style></head><body><div class="r"></div></body></html>`);
    await p.waitForTimeout(600); await p.screenshot({ path: `${D}/uusi-${dpr}x-${bg.replace('#', '')}.png` }); await ctx.close(); }
} finally { await b.close(); } })();
/* Vertailu: uusi-<dpr>x-<pohja>.png vastaan alkup-<dpr>x.png (1-kalibroi.cjs). Samalla pohjavarilla eron pitaa olla 0. */
