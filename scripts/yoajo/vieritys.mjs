/**
 * vieritys.mjs: vierityksen kehysajat ylhaalta alas tasaisella nopeudella.
 *
 *   node scripts/yoajo/vieritys.mjs --json=<tiedosto> [--reitit=...]
 *        [--moottorit=chromium,webkit,firefox] [--cpu=1,4,6] [--nopeus=1500]
 *        [--w=1440] [--h=900] [--trace=<kansio>]
 *
 * Kaynnistaa tuotantopalvelimen itse. Vieritys ajetaan sivun sisalla:
 * joka kehyksessa scrollTo(nopeus * kulunut aika), joten nopeus on sama
 * kaikilla moottoreilla ja hidastuksilla (hitaalla koneella kehykset ovat
 * pidempia, matka sama). Kehysvalit mitataan requestAnimationFramella.
 * CPU-hidastus (Emulation.setCPUThrottlingRate) vain Chromiumilla;
 * WebKit ja Firefox ajetaan ilman hidastusta.
 *
 * --trace: Chromiumilla 4x-hidastuksella myos devtools-jalki, josta
 * lasketaan aika luokittain (script, style, layout, paint, composite)
 * ja hitaimmat 500 px:n vierityskaistat seka niiden keskella oleva osio.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { REITIT, nimi, arg, kaynnistaPalvelin, sammutaPalvelin, uusiKonteksti, odotaValmis, POHJA } from "./_yhteinen.mjs";
const { launchOptions, requireBrowser } = await import(new URL("../_browser.mjs", import.meta.url).href);

const JSON_OUT = arg("json");
const reitit = arg("reitit") ? arg("reitit").split(",") : REITIT;
const moottorit = (arg("moottorit") || "chromium,webkit,firefox").split(",");
const cput = (arg("cpu") || "1,4,6").split(",").map(Number);
const NOPEUS = +arg("nopeus", 1500);
const W = +arg("w", 1440), H = +arg("h", 900);
const TRACE = arg("trace");
if (TRACE) mkdirSync(TRACE, { recursive: true });

const LUOKAT = {
  script: ["FunctionCall", "EvaluateScript", "TimerFire", "FireAnimationFrame", "EventDispatch", "v8.compile", "RunMicrotasks", "V8.Execute"],
  style: ["UpdateLayoutTree", "RecalculateStyles", "ScheduleStyleRecalculation"],
  layout: ["Layout", "UpdateLayerTree", "PrePaint"],
  paint: ["Paint", "PaintImage", "RasterTask", "Decode Image", "ImageDecodeTask", "GPUTask"],
  composite: ["CompositeLayers", "Commit", "UpdateLayer", "Layerize", "ActivateLayerTree"],
};

const per = (a, q) => {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  return s[Math.min(s.length - 1, Math.floor(q * s.length))];
};

async function aja(page) {
  return page.evaluate(async (nopeus) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 400));
    const dts = [], ys = [];
    return new Promise((valmis) => {
      let t0 = 0, ed = 0;
      const f = (t) => {
        if (!t0) { t0 = t; ed = t; }
        else { dts.push(t - ed); ys.push(scrollY); ed = t; }
        const y = Math.min(max, ((t - t0) / 1000) * nopeus);
        window.scrollTo({ top: y, behavior: "instant" });
        if (y < max) requestAnimationFrame(f);
        else {
          /* hitaimmat kaistat: 500 px:n kaistan keskimaarainen kehysaika */
          const kaistat = {};
          dts.forEach((d, i) => { const k = Math.floor(ys[i] / 500); (kaistat[k] ||= []).push(d); });
          const lista = Object.entries(kaistat).map(([k, a]) => ({ y: +k * 500, ka: a.reduce((s, x) => s + x, 0) / a.length, n: a.length }));
          lista.sort((a, b) => b.ka - a.ka);
          const top = [];
          for (const k of lista.slice(0, 3)) {
            window.scrollTo({ top: k.y + 250 - innerHeight / 2, behavior: "instant" });
            const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
            let osio = el, nimi = "";
            while (osio && osio !== document.body) {
              if (osio.id || osio.tagName === "SECTION") { nimi = (osio.id ? "#" + osio.id : "") + "." + String(osio.className || "").split(" ").slice(0, 2).join("."); break; }
              osio = osio.parentElement;
            }
            top.push({ y: k.y, ka: +k.ka.toFixed(1), osio: nimi || (el ? el.tagName + "." + String(el.className).slice(0, 40) : "") });
          }
          valmis({ dts, max, top });
        }
      };
      requestAnimationFrame(f);
    });
  }, NOPEUS);
}

const tulokset = [];
/* binaarit tarkistetaan ennen palvelinta: requireBrowser lopettaa prosessin */
for (const m of moottorit) requireBrowser(m);
const palvelin = await kaynnistaPalvelin();
try {
  for (const moottori of moottorit) {
    const browser = await requireBrowser(moottori).launch(launchOptions(moottori));
    try {
      for (const cpu of moottori === "chromium" ? cput : [1]) {
        for (const r of reitit) {
          const ctx = await uusiKonteksti(browser, { viewport: { width: W, height: H } });
          try {
            const page = await ctx.newPage();
            await page.goto(POHJA + r, { waitUntil: "load" });
            await odotaValmis(page, 1200);
            let cdp = null;
            if (moottori === "chromium") {
              cdp = await ctx.newCDPSession(page);
              await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
            }
            const jalki = TRACE && moottori === "chromium" && cpu === 4;
            if (jalki) await browser.startTracing(page, { categories: ["devtools.timeline", "disabled-by-default-devtools.timeline"] });
            const { dts, max, top } = await aja(page);
            let luokat = null;
            if (jalki) {
              const buf = await browser.stopTracing();
              const tapahtumat = JSON.parse(buf.toString()).traceEvents;
              luokat = {};
              for (const [luokka, nimet] of Object.entries(LUOKAT)) {
                luokat[luokka] = Math.round(tapahtumat.filter((e) => e.ph === "X" && nimet.includes(e.name) && e.dur).reduce((s, e) => s + e.dur, 0) / 1000);
              }
              writeFileSync(join(TRACE, `${nimi(r)}.json`), buf);
            }
            if (cdp) await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
            const rivi = {
              moottori, cpu, reitti: r, max, kehyksia: dts.length,
              mediaani: +per(dts, 0.5).toFixed(1),
              p95: +per(dts, 0.95).toFixed(1),
              yli33: +(dts.filter((d) => d > 33.4).length / dts.length).toFixed(3),
              fps: +(1000 / (dts.reduce((s, d) => s + d, 0) / dts.length)).toFixed(1),
              hitaimmat: top,
              luokat,
            };
            tulokset.push(rivi);
            console.log(`${moottori} cpu${cpu} ${r}: med ${rivi.mediaani} p95 ${rivi.p95} >33 ${(rivi.yli33 * 100).toFixed(1)} % fps ${rivi.fps} | ${top.map((t) => `${t.y}:${t.ka}ms ${t.osio}`).join(" ; ")}${luokat ? " | " + JSON.stringify(luokat) : ""}`);
          } finally {
            await ctx.close().catch(() => {});
          }
        }
      }
    } finally {
      await browser.close().catch(() => {});
    }
  }
} finally {
  sammutaPalvelin(palvelin);
  if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(tulokset, null, 1));
}
