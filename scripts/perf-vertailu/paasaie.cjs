/* PAASAIKEEN TYO KEHYSTA KOHTI tapahtumittain (tyylilaskenta, JS, commit).
   Ajo: node scripts/perf-vertailu/paasaie.cjs ws|hoyry [css]   RATE=4 hidastaa. */
// Paasaikeen oma aika tapahtumittain vierityksen ajalta (ms/kehys)
const { launch, LOCAL, HOYRY } = require('./lib.cjs');
async function one(b, url, css, rate) {
  const ctx = await b.newContext({ viewport: { width: 1366, height: 768 } }); const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page);
  await page.addInitScript(() => { try { if (location.hostname === 'localhost') localStorage.setItem('wsmedia.consent', JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch { } });
  await page.goto(url, { waitUntil: 'load', timeout: 90000 }); await page.waitForTimeout(4500); if (css) await page.addStyleTag({ content: css });
  if (rate > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  const ev = []; cdp.on('Tracing.dataCollected', e => ev.push(...e.value));
  await cdp.send('Tracing.start', { transferMode: 'ReportEvents', traceConfig: { includedCategories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'toplevel', 'blink', 'cc', 'v8'] } });
  await page.evaluate(() => { window.__n = 0; const t = () => { __n++; requestAnimationFrame(t); }; requestAnimationFrame(t); });
  await page.mouse.move(683, 400); for (let i = 0; i < 60; i++) { await page.mouse.wheel(0, 240); await page.waitForTimeout(100); }
  const frames = await page.evaluate(() => __n); const vier = await page.evaluate(() => (window.__vierityMs || []).length ? (window.__vierityMs.reduce((a, b) => a + b, 0) / window.__vierityMs.length) : null);
  await new Promise(async res => { cdp.once('Tracing.tracingComplete', res); await cdp.send('Tracing.end'); });
  await ctx.close();
  const tn = ev.filter(e => e.ph === 'M' && e.name === 'thread_name' && e.args.name === 'CrRendererMain');
  // valitaan se renderoijan paasaie jolla on eniten tapahtumia
  const cnt = {}; for (const e of ev) if (e.ph === 'X') cnt[e.pid + ':' + e.tid] = (cnt[e.pid + ':' + e.tid] || 0) + 1;
  const main = tn.map(t => t.pid + ':' + t.tid).sort((a, b) => (cnt[b] || 0) - (cnt[a] || 0))[0];
  const xs = ev.filter(e => e.ph === 'X' && e.pid + ':' + e.tid === main && e.dur != null).sort((a, b) => a.ts - b.ts || b.dur - a.dur);
  const self = {}; const st = [];
  for (const e of xs) { while (st.length && st[st.length - 1].end <= e.ts) st.pop(); if (st.length) st[st.length - 1].child += e.dur; const o = { e, end: e.ts + e.dur, child: 0 }; st.push(o); (self[e.name] = self[e.name] || []).push(o); }
  const tot = {}; for (const [k, a] of Object.entries(self)) tot[k] = a.reduce((s, o) => s + Math.max(0, o.e.dur - o.child), 0) / 1000;
  const all = Object.values(tot).reduce((a, b) => a + b, 0);
  return { frames, vier, all, tot, style: xs.filter(e => e.name === 'UpdateLayoutTree').map(e => (e.args && e.args.elementCount) || 0) };
}
(async () => { const b = await launch(); try {
  const which = process.argv[2] || 'ws'; const css = process.argv[3] || ''; const rate = +(process.env.RATE || 1);
  const r = await one(b, which === 'hoyry' ? HOYRY : LOCAL, css, rate);
  console.log(`${which}: kehyksia ${r.frames}, paasaie yhteensa ${(r.all / r.frames).toFixed(2)} ms/kehys${r.vier != null ? ', vierityskasittelija ' + r.vier.toFixed(2) + ' ms' : ''}, tyylilaskentoja ${r.style.length}, elementteja ka ${(r.style.reduce((a, b) => a + b, 0) / Math.max(1, r.style.length)).toFixed(0)}`);
  Object.entries(r.tot).sort((a, b) => b[1] - a[1]).slice(0, +(process.env.N || 22)).forEach(([k, v]) => console.log(`  ${(v / r.frames).toFixed(2).padStart(6)} ms/kehys ${v.toFixed(0).padStart(6)} ms  ${k.slice(0, 80)}`));
} finally { await b.close(); } })();
