/* Yhteinen pohja perf-vertailun skripteille.

   AJOYMPARISTO VAIKUTTAA TULOKSEEN. Luvut tiedostossa README.md on
   mitattu pilvikoneessa, jossa EI ole naytonohjainta: Chrome kokoaa ja
   rasteroi kaiken prosessorilla. Se on tarkoituksella huonoin tapaus.
   Macilla, jossa on naytonohjain, samat skriptit antavat selvasti
   korkeammat fps-luvut eika kokoonpanon hinta nay samalla tavalla.

   Ymparistomuuttujat:
     CHROME      polku Chrome-binaariin (oletus: Playwrightin oma Chromium,
                 jossa ei ole H.264:aa eli sivun mp4-videot eivat pyori)
     HTTPS_PROXY valityspalvelin ulkoisille sivuille, jos sellainen on
     WS_URL      mitattava oma sivu (oletus localhost:3000/lyhytvideot) */
const { chromium } = require(process.env.PW_ROOT || 'playwright');
const LOCAL = process.env.WS_URL || 'http://localhost:3000/lyhytvideot?mittaa';
const HOYRY = 'https://www.hoyrymedia.fi/lyhytvideot';
async function launch() {
  const args = ['--autoplay-policy=no-user-gesture-required'];
  if (process.env.HTTPS_PROXY) args.push('--proxy-server=' + process.env.HTTPS_PROXY, '--proxy-bypass-list=localhost;127.0.0.1');
  if (process.env.CI_NO_SANDBOX) args.push('--no-sandbox');
  return chromium.launch({ headless: true, ...(process.env.CHROME ? { executablePath: process.env.CHROME } : {}), args });
}
// Yksi ajo: lataa, odota, vierita 60 x 240 px, palauta fps ja paasaikeen kuorma
async function run(browser, url, { rate = 1, css = '', trace = false, steps = 60, settle = 4000, init = null, vw = 1366, vh = 768, banner = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  if (init) await page.addInitScript(init);
  if (!banner) await page.addInitScript(() => { try { if (location.hostname === 'localhost') localStorage.setItem('wsmedia.consent', JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch { } });
  let ok = false;
  for (let a = 0; a < 3 && !ok; a++) { const r = await page.goto(url, { waitUntil: 'load', timeout: 90000 }).catch(() => null); ok = !!r && r.status() === 200; }
  await page.waitForTimeout(settle);
  if (css) await page.addStyleTag({ content: css });
  if (rate > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  await page.waitForTimeout(600);
  await cdp.send('Performance.enable');
  const m0 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
  let events = [];
  if (trace) {
    cdp.on('Tracing.dataCollected', e => { events.push(...e.value); });
    await cdp.send('Tracing.start', { transferMode: 'ReportEvents', traceConfig: { includedCategories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'cc', 'gpu', 'viz'] } });
  }
  await page.evaluate(() => { window.__f = []; let p = performance.now(); const t = n => { __f.push(n - p); p = n; window.__raf = requestAnimationFrame(t); }; window.__raf = requestAnimationFrame(t); });
  await page.mouse.move(vw / 2, 400);
  const t0 = Date.now();
  for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, 240); await page.waitForTimeout(100); }
  await page.waitForTimeout(400);
  const wall = Date.now() - t0;
  const sc = await page.evaluate(() => { cancelAnimationFrame(__raf); const f = __f.slice(2); const s = [...f].sort((a, b) => a - b); const q = p => s[Math.min(s.length - 1, Math.floor(s.length * p))]; const tot = f.reduce((a, b) => a + b, 0); return { frames: f.length, fps: +(f.length / tot * 1000).toFixed(1), p50: +q(.5).toFixed(1), p95: +q(.95).toFixed(1), max: +q(1).toFixed(0), y: Math.round(scrollY), kevyt: document.documentElement.dataset.kevyt || null }; });
  const m1 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
  const d = k => +(((m1[k] - m0[k]) * 1000) / sc.frames).toFixed(2);
  sc.main = { task: d('TaskDuration'), script: d('ScriptDuration'), style: d('RecalcStyleDuration'), layout: d('LayoutDuration'), busy: +(((m1.TaskDuration - m0.TaskDuration) * 1000) / wall * 100).toFixed(0) };
  if (trace) {
    await new Promise(async res => { cdp.once('Tracing.tracingComplete', res); await cdp.send('Tracing.end'); });
    const sum = {};
    for (const e of events) if (e.ph === 'X' && e.dur) { const k = e.name; (sum[k] = sum[k] || [0, 0]); sum[k][0] += e.dur / 1000; sum[k][1]++; }
    const g = k => sum[k] ? sum[k] : [0, 0];
    sc.t = { drawMs: +(g('Display::DrawAndSwap')[0] / Math.max(1, g('Display::DrawAndSwap')[1])).toFixed(1), draws: g('Display::DrawAndSwap')[1], quads: Math.round(g('SoftwareRenderer::DoDrawQuad')[1] / Math.max(1, g('Display::DrawAndSwap')[1])), passes: +(g('DirectRenderer::DrawRenderPass')[1] / Math.max(1, g('Display::DrawAndSwap')[1])).toFixed(1), rasterMs: Math.round(g('RasterTask')[0]), mainMs: +(g('ProxyMain::BeginMainFrame')[0] / Math.max(1, g('ProxyMain::BeginMainFrame')[1])).toFixed(1), commitMs: +(g('Commit')[0] / Math.max(1, g('Commit')[1])).toFixed(1), fn: Math.round(g('FunctionCall')[0]), styleMs: Math.round(g('UpdateLayoutTree')[0]), paintMs: Math.round(g('Paint')[0]), layerize: Math.round(g('Layerize')[0]), prepaint: Math.round(g('PrePaint')[0]) };
    sc.trace = Object.entries(sum).sort((a, b) => b[1][0] - a[1][0]).slice(0, 28).map(([k, [ms, n]]) => `${k}: ${ms.toFixed(0)}ms/${n}`);
  }
  await ctx.close();
  return sc;
}
module.exports = { launch, run, LOCAL, HOYRY };
