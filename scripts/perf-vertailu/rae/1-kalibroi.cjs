// Kalibrointi: renderoi alkuperainen .rae (soft-light) tasaisen pohjavarin paalle ja tallenna erotus.
const D = process.env.RAE_DIR || require('path').join(__dirname, 'tyo'); require('fs').mkdirSync(D, { recursive: true });
const { launch, LOCAL } = require('../lib.cjs');
(async () => { const b = await launch(); try {
  const bg = process.argv[2] || '#0b0f14';
  const p0 = await (await b.newContext()).newPage(); await p0.goto(LOCAL, { waitUntil: 'load' });
  const st = await p0.evaluate(() => { const cs = getComputedStyle(document.querySelector('.rae')); return { bi: cs.backgroundImage, op: cs.opacity, mb: cs.mixBlendMode, bs: cs.backgroundSize, br: cs.backgroundRepeat }; });
  console.log(st.op, st.mb, st.bs, st.br, st.bi.length);
  for (const dpr of [1, 2]) {
    const ctx = await b.newContext({ viewport: { width: 720, height: 540 }, deviceScaleFactor: dpr }); const p = await ctx.newPage();
    const html = on => `<!doctype html><html><head><style>body{margin:0;background:${bg}}.r{position:fixed;inset:0;opacity:${st.op};mix-blend-mode:${on ? st.mb : 'normal'};${on ? `background-image:${st.bi}` : ''}}</style></head><body><div class="r"></div></body></html>`;
    await p.setContent(html(false)); await p.waitForTimeout(300); await p.screenshot({ path: `${D}/pohja-${dpr}x.png` });
    await p.setContent(html(true)); await p.waitForTimeout(800); await p.screenshot({ path: `${D}/alkup-${dpr}x.png` });
    await ctx.close();
  }
  require('fs').writeFileSync(D + '/style.json', JSON.stringify(st));
} finally { await b.close(); } })();
