/**
 * mobiili-hero.mjs: puhelinversion herojen vierityksen kehysajat (9.10.2026).
 *
 *   node scripts/mobiili-hero.mjs [--pohja=http://localhost:4100] [--out=tulos.json]
 *     [--sivut=/,/verkkosivut] [--cpu=4] [--toistot=3]
 *
 * Kuten mobiili-kehykset.mjs, mutta vain heron kaari (0 .. 2,5 x nakyma)
 * alas ja takaisin ylos 1 200 px/s, 390 x 664 dpr 3, kosketus, CPU-hidastus
 * CDP:lla. Tulos per sivu: kehysvalin mediaani, p95, yli 20 ms ja yli 33 ms
 * kehysten osuus seka Long Animation Frame -merkintojen kokonaisaika.
 * Kehysajat eivat toistu tarkasti, joten jokainen sivu ajetaan --toistot
 * kertaa ja raportoidaan mediaani ja vaihteluvali.
 */
import { writeFileSync } from "node:fs";
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);

const arg = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const POHJA = arg("pohja", "http://localhost:4100");
const OUT = arg("out", null);
const SIVUT = arg("sivut", "/,/verkkosivut,/graafinen-suunnittelu,/hakukoneoptimointi,/lyhytvideot,/meista,/toihin-meille,/yhteystiedot,/laskutustiedot").split(",");
const CPU = Number(arg("cpu", "4"));
const TOISTOT = Number(arg("toistot", "3"));
const NOPEUS = 1200;

const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const browser = await requireBrowser("chromium").launch(launchOptions("chromium"));
const tulokset = [];
try {
  for (const r of SIVUT) {
    const ajot = [];
    for (let i = 0; i < TOISTOT; i++) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
      await ctx.addInitScript(`try{localStorage.setItem("wsmedia.consent",JSON.stringify({analytics:false,v:1,ts:Date.now()}))}catch(e){}`);
      await ctx.route("**/*", (q) => {
        const u = new URL(q.request().url());
        return u.hostname === "localhost" || /^(data|blob):/.test(u.protocol) ? q.continue() : q.abort();
      });
      try {
        const p = await ctx.newPage();
        await p.goto(POHJA + r, { waitUntil: "load" });
        await p.waitForFunction(() => !document.documentElement.dataset.lataus, null, { timeout: 20000 }).catch(() => {});
        await p.waitForTimeout(2000);
        const cdp = await ctx.newCDPSession(p);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
        await p.waitForTimeout(300);
        const t = await p.evaluate(async (NOPEUS) => {
          const loaf = [];
          let po = null;
          try {
            po = new PerformanceObserver((l) => l.getEntries().forEach((e) => loaf.push(e.duration)));
            po.observe({ type: "long-animation-frame", buffered: false });
          } catch {}
          const max = Math.min(document.documentElement.scrollHeight - innerHeight, Math.round(innerHeight * 2.5 + 650));
          const kesto = (max / NOPEUS) * 1000;
          const v = [];
          for (const suunta of [1, -1]) {
            await new Promise((valmis) => {
              let alku = 0, edel = 0;
              const k = (t) => {
                if (!alku) { alku = t; edel = t; } else { v.push(t - edel); edel = t; }
                const s = Math.min(1, (t - alku) / kesto);
                window.scrollTo({ top: (suunta > 0 ? s : 1 - s) * max, behavior: "instant" });
                if (s < 1) requestAnimationFrame(k); else valmis();
              };
              requestAnimationFrame(k);
            });
          }
          await new Promise((r) => setTimeout(r, 300));
          po?.disconnect();
          const j = v.sort((a, b) => a - b);
          const q = (x) => j[Math.min(j.length - 1, Math.floor(x * j.length))];
          return { mediaani: q(0.5), p95: q(0.95), yli20: (j.filter((x) => x > 20).length / j.length) * 100, yli33: (j.filter((x) => x > 33.4).length / j.length) * 100, loaf: loaf.reduce((a, b) => a + b, 0) };
        }, NOPEUS);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
        ajot.push(t);
      } finally {
        await ctx.close().catch(() => {});
      }
    }
    const k = (n) => ({ med: +med(ajot.map((a) => a[n])).toFixed(1), min: +Math.min(...ajot.map((a) => a[n])).toFixed(1), max: +Math.max(...ajot.map((a) => a[n])).toFixed(1) });
    const t = { sivu: r, cpu: CPU, toistot: TOISTOT, mediaani: k("mediaani"), p95: k("p95"), yli20: k("yli20"), yli33: k("yli33"), loafMs: k("loaf") };
    tulokset.push(t);
    console.log(JSON.stringify(t));
  }
} finally {
  await browser.close().catch(() => {});
}
if (OUT) writeFileSync(OUT, JSON.stringify(tulokset, null, 1));
