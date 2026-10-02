/* FPS-VERTAILU: oma sivu ja hoyrymedia.fi/lyhytvideot samalla ajolla.
   Vierittaa 60 x 240 px rullahiirella ja mittaa kehysvalit.
   Ajo (tuotantobuild portissa 3000):
     node scripts/perf-vertailu/vertailu.cjs
   RATES=1,4,6  prosessorin hidastuskertoimet
   RUNS=2       toistot per rivi
   SITES=ws,hoyry tai mika tahansa osoite */
// Lopullinen vertailu: fps ilman jaljitysta, 1x/4x/6x, WS (paikallinen) vs Hoyry
const { launch, run, LOCAL, HOYRY } = require('./lib.cjs');
(async () => { const b = await launch(); try {
  const rates = (process.env.RATES || '1,4,6').split(',').map(Number); const n = +(process.env.RUNS || 2); const sites = (process.env.SITES || 'ws,hoyry').split(',');
  for (const rate of rates) for (const s of sites) { const url = s === 'hoyry' ? HOYRY : s === 'ws' ? LOCAL : s; const rs = [];
    for (let i = 0; i < n; i++) rs.push(await run(b, url, { rate }));
    const avg = k => (rs.reduce((a, r) => a + r[k], 0) / n);
    console.log(`${s.padEnd(6)} ${rate}x  fps ${avg('fps').toFixed(1).padStart(5)}  p50 ${avg('p50').toFixed(0).padStart(4)} ms  p95 ${avg('p95').toFixed(0).padStart(4)} ms  paasaie ${(rs.reduce((a, r) => a + r.main.task, 0) / n).toFixed(1)} ms/kehys  (ajot: ${rs.map(r => r.fps).join(', ')})`); }
} finally { await b.close(); } })();
