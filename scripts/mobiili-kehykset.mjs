/**
 * mobiili-kehykset.mjs: puhelinversion vierityksen kehysajat (7.10.2026).
 *
 *   node scripts/mobiili-kehykset.mjs [--pohja=http://localhost:4100] [--out=tulos.json]
 *
 * Tuotantobuild (next build && next start), Playwright headless GPU-lipuilla
 * (scripts/_browser.mjs), nakyma 390 x 664 (iPhone 12:n Safarin nakyva alue),
 * kosketuslaite, CPU-hidastus 4x ja 6x CDP:lla. Sivu vieritetaan alusta
 * loppuun 2 400 px/s: vieritys kirjoitetaan joka kehys ajan mukaan, ja
 * kehysvali luetaan requestAnimationFrame-aikaleimoista. Tulos: mediaani,
 * p95 ja yli 33 ms kehysten osuus.
 *
 * Evastesuostumus on annettu valmiiksi (banneri ei peita), kolmansien
 * osapuolten pyynnot estetty.
 */
import { writeFileSync } from "node:fs";
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);

const arg = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const POHJA = arg("pohja", "http://localhost:4100");
const OUT = arg("out", null);
const SIVUT = ["/", "/lyhytvideot", "/verkkosivut", "/hakukoneoptimointi", "/graafinen-suunnittelu"];
const HIDASTUS = [4, 6];
const NOPEUS = 2400; // px/s

const browser = await requireBrowser("chromium").launch(launchOptions("chromium"));
const tulokset = [];
try {
  for (const cpu of HIDASTUS) {
    for (const r of SIVUT) {
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
        await p.waitForTimeout(1500);
        const cdp = await ctx.newCDPSession(p);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
        await p.waitForTimeout(500);
        const valit = await p.evaluate(async (NOPEUS) => {
          const max = document.documentElement.scrollHeight - innerHeight;
          const kesto = (max / NOPEUS) * 1000;
          const v = [];
          await new Promise((valmis) => {
            let alku = 0, edel = 0;
            const k = (t) => {
              if (!alku) { alku = t; edel = t; }
              else { v.push(t - edel); edel = t; }
              const s = Math.min(1, (t - alku) / kesto);
              window.scrollTo({ top: s * max, behavior: "instant" });
              if (s < 1) requestAnimationFrame(k); else valmis();
            };
            requestAnimationFrame(k);
          });
          return v;
        }, NOPEUS);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
        const j = [...valit].sort((a, b) => a - b);
        const q = (x) => j[Math.min(j.length - 1, Math.floor(x * j.length))];
        const t = { sivu: r, cpu, kehyksia: j.length, mediaani: +q(0.5).toFixed(1), p95: +q(0.95).toFixed(1), yli33: +((j.filter((x) => x > 33.4).length / j.length) * 100).toFixed(1) };
        tulokset.push(t);
        console.log(JSON.stringify(t));
      } finally {
        await ctx.close().catch(() => {});
      }
    }
  }
} finally {
  await browser.close().catch(() => {});
}
if (OUT) writeFileSync(OUT, JSON.stringify(tulokset, null, 1));
