/* VERTAILUKUVAT kiinteista vierityskohdista. Videot eivat kaynnisty ja
   jatkuvat animaatiot pysaytetaan alkuun, joten sama sivu antaa samat
   kuvat joka ajolla.
   Ajo: node scripts/perf-vertailu/kuvat.cjs <hakemisto> [osoite] [askel px] [leveys] [korkeus]
   CSS=...  lisaa tyylin ennen kuvia, YS=0,500 valitsee kohdat, DPR=2, RM=1 (reduced motion) */
// Vertailukuvat: sama sivu, sama tila, kiinteat vierityskohdat. node shots.js <hakemisto> [url] [step]
const { launch, LOCAL } = require('./lib.cjs');
const fs = require('fs');
(async () => { const dir = process.argv[2]; const url = process.argv[3] || LOCAL; const step = +(process.argv[4] || 500); const vw = +(process.argv[5] || 1366), vh = +(process.argv[6] || 768);
  fs.mkdirSync(dir, { recursive: true });
  const b = await launch(); try {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: +(process.env.DPR || 1), reducedMotion: process.env.RM ? 'reduce' : 'no-preference' }); const page = await ctx.newPage();
  await page.addInitScript(() => { try { localStorage.setItem('wsmedia.consent', JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch { } });
  await page.addInitScript(() => { HTMLMediaElement.prototype.play = function () { return Promise.resolve(); }; });
  await page.goto(url, { waitUntil: 'load' }); await page.waitForTimeout(5000);
  if (process.env.CSS) await page.addStyleTag({ content: process.env.CSS });
  if (process.env.YS) { }
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  let ys = []; for (let y = 0; y < H - vh; y += step) ys.push(y); ys.push(H - vh); if (process.env.YS) ys = process.env.YS.split(',').map(Number);
  for (const y of ys) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(1300);
    await page.evaluate(() => { for (const a of document.getAnimations()) { try { const t = a.effect && a.effect.getComputedTiming(); if (t && t.iterations === Infinity) { a.pause(); a.currentTime = 0; } else a.finish(); } catch { } } });
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${dir}/y${String(y).padStart(5, '0')}.png` });
  }
  console.log('shots', ys.length, 'H', H);
} finally { await b.close(); } })();
