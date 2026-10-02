const D = process.env.RAE_DIR || require('path').join(__dirname, 'tyo'); require('fs').mkdirSync(D, { recursive: true });
const { launch } = require('../lib.cjs'); const fs = require('fs');
(async () => { const b = await launch(); try {
  const ctx = await b.newContext({ viewport: { width: 300, height: 100 }, deviceScaleFactor: 1 }); const p = await ctx.newPage();
  const u = 'data:image/png;base64,' + fs.readFileSync(D + '/lut.png').toString('base64');
  await p.setContent(`<!doctype html><html><head><style>body{margin:0;background:${process.argv[2] || '#0b0f14'}}.r{position:fixed;left:0;top:0;width:256px;height:16px;background-image:url(${u});background-size:256px 16px;background-repeat:no-repeat}</style></head><body><div class="r"></div></body></html>`);
  await p.waitForTimeout(500); await p.screenshot({ path: D + '/lut-out.png', clip: { x: 0, y: 0, width: 256, height: 16 } });
} finally { await b.close(); } })();
