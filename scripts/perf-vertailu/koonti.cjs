/* KEHYKSEN KOONTIAIKA VIERITYSKOHDITTAIN. Toimii vain ohjelmistokoonnilla
   (ei naytonohjainta): lukee Chromen jaljityksesta SoftwareRendererin
   piirtoajat ja nayttaa kalleimmat koontivaiheet.
   Ajo: node scripts/perf-vertailu/koonti.cjs 0,900,4000,9000 [css] */
const { launch, LOCAL } = require('./lib.cjs');
(async () => { const b = await launch(); try {
  const ys = (process.argv[2] || '0,1500,4000,6500,9000,12500').split(',').map(Number); const css = process.argv[3] || ''; const url = process.argv[4] || LOCAL;
  const ctx = await b.newContext({ viewport: { width: 1366, height: 768 } }); const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page);
  await page.addInitScript(() => { try { localStorage.setItem('wsmedia.consent', JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch { } });
  await page.goto(url, { waitUntil: 'load' }); await page.waitForTimeout(4500); if (css) await page.addStyleTag({ content: css });
  for (const y of ys) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y); await page.waitForTimeout(1200);
    const events = []; const h = e => events.push(...e.value); cdp.on('Tracing.dataCollected', h);
    await cdp.send('Tracing.start', { transferMode: 'ReportEvents', traceConfig: { includedCategories: ['viz', 'cc', 'gpu'] } });
    await page.mouse.move(683, 400); for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 40); await page.waitForTimeout(100); } await page.waitForTimeout(200);
    await new Promise(async res => { cdp.once('Tracing.tracingComplete', res); await cdp.send('Tracing.end'); }); cdp.off('Tracing.dataCollected', h);
    const frames = events.filter(e => e.name === 'DirectRenderer::DrawFrame' && e.ph === 'X').sort((a, b) => a.ts - b.ts);
    const passes = events.filter(e => e.name === 'DirectRenderer::DrawRenderPass' && e.ph === 'X');
    const quads = events.filter(e => e.name === 'SoftwareRenderer::DoDrawQuad' && e.ph === 'X');
    if (!frames.length) { console.log('y', y, 'ei kehyksia'); continue; }
    const avg = frames.reduce((a, f) => a + f.dur, 0) / frames.length / 1000;
    // mediaanikehys
    const f = [...frames].sort((a, b) => a.dur - b.dur)[Math.floor(frames.length / 2)];
    const inF = e => e.ts >= f.ts && e.ts <= f.ts + f.dur && e.tid === f.tid;
    const ps = passes.filter(inF).sort((a, b) => a.ts - b.ts);
    console.log(`\n== y=${y}: kehyksia ${frames.length}, DrawFrame ka ${avg.toFixed(1)} ms; mediaanikehys ${(f.dur / 1000).toFixed(1)} ms, passeja ${ps.length}`);
    for (const p of ps) { const qs = quads.filter(q => q.ts >= p.ts && q.ts <= p.ts + p.dur && q.tid === p.tid).filter(q => !ps.some(o => o !== p && o.ts > p.ts && o.ts + o.dur < p.ts + p.dur && q.ts >= o.ts && q.ts <= o.ts + o.dur));
      const top = qs.map(q => q.dur / 1000).sort((a, b) => b - a); console.log(`  pass ${(p.dur / 1000).toFixed(1).padStart(5)} ms, quadeja ${String(qs.length).padStart(3)}, isoimmat: ${top.slice(0, 10).map(x => x.toFixed(1)).join(' ')} | args ${JSON.stringify(p.args || {}).slice(0, 80)}`); }
    if (quads[0]) console.log('  quad args esim:', JSON.stringify(quads[0].args || {}).slice(0, 200));
  }
} finally { await b.close(); } })();
