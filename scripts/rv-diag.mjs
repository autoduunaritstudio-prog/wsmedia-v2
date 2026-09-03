/**
 * rv-diag.mjs — reveal-jarjestelman diagnoosi.
 *
 * Ajo:
 *   node rv-diag.mjs [--url=http://localhost:3111/] [--h=783] [--w=1254]
 *                    [--dpr=2] [--reduce] [--cpu=1] [--net=none|3g|4g]
 *                    [--wait=12000] [--headed]
 *
 * Tuotantobuildia vastaan (next build && next start), EI dev-palvelinta.
 * Throttlaus CDP:n kautta (Emulation.setCPUThrottlingRate,
 * Network.emulateNetworkConditions).
 *
 * Instrumentointi asennetaan ENNEN sivun skriptien ajoa
 * (addInitScript), jotta html-luokan muutokset nakyvat alusta asti.
 */
// Skripti asuu scratchpadissa, joten playwright tuodaan projektin polusta.
const PW = process.env.PW_ROOT || new URL("../node_modules/playwright/index.mjs", import.meta.url).href;
const { chromium } = await import(PW);

const arg = (k, d) => {
  const m = process.argv.find((a) => a.startsWith(`--${k}=`));
  return m ? m.slice(k.length + 3) : d;
};
const has = (k) => process.argv.includes(`--${k}`);

const TARGET = arg("url", "http://localhost:3111/");
const W = +arg("w", 1254);
const H = +arg("h", 783);
const DPR = +arg("dpr", 2);
const WAIT = +arg("wait", 12000);
const CPU = +arg("cpu", 1);
const NET = arg("net", "none");

const NETS = {
  none: null,
  "4g": { offline: false, downloadThroughput: (9 * 1024 * 1024) / 8, uploadThroughput: (9 * 1024 * 1024) / 8, latency: 40 },
  "3g": { offline: false, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150 },
};

// Kirjaa html-luokan muutokset ja .on-maaran. Ajetaan sivun kontekstissa
// ennen kuin yksikaan sivun skripti on ajanut.
const INIT = () => {
  window.__rv = { log: [], err: [], t0: performance.now() };
  const push = (ev, extra) =>
    window.__rv.log.push({
      t: Math.round(performance.now() - window.__rv.t0),
      ev,
      ready: document.documentElement.classList.contains("rv-ready"),
      rv: document.querySelectorAll(".rv").length,
      on: document.querySelectorAll(".rv.on").length,
      ...extra,
    });
  window.__rvPush = push;
  addEventListener("error", (e) => window.__rv.err.push({ t: Math.round(performance.now()), msg: String(e.message), src: e.filename + ":" + e.lineno }));
  addEventListener("unhandledrejection", (e) => window.__rv.err.push({ t: Math.round(performance.now()), msg: "rejection: " + String(e.reason) }));
  const start = () => {
    push("alku");
    new MutationObserver(() => push("html-luokka")).observe(document.documentElement, {
      attributes: true, attributeFilter: ["class"],
    });
    // .on-maaran muutokset koko dokumentista
    new MutationObserver((ms) => {
      if (ms.some((m) => m.target instanceof Element && m.target.classList.contains("rv")))
        push("rv-luokka");
    }).observe(document.documentElement, {
      subtree: true, attributes: true, attributeFilter: ["class"],
    });
    addEventListener("hero:unlocked", () => push("hero:unlocked"));
  };
  if (document.documentElement) start();
  else addEventListener("DOMContentLoaded", start);
};

// CLAUDE.md: oletus on headless. Nakyva ikkuna vain kun kayttaja on
// pyytanyt nakevansa ajon, ja silloin ruudun ulkopuolelle niin ettei se
// varasta fokusta. Kolme viimeista lippua estavat taustaikkunan
// ajastin- ja rAF-hidastuksen, jonka kanssa mittaus olisi roskaa.
const HEADED = has("headed");
const launchOpts = HEADED
  ? {
      headless: false,
      args: [
        "--window-position=-2400,0",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
      ],
    }
  : { headless: true };
const browser = await chromium.launch(launchOpts);
try {
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: DPR,
  reducedMotion: has("reduce") ? "reduce" : "no-preference",
});
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
if (NETS[NET]) { await cdp.send("Network.enable"); await cdp.send("Network.emulateNetworkConditions", NETS[NET]); }

const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") pageErrors.push("console: " + m.text()); });

await page.addInitScript(INIT);
await page.goto(TARGET, { waitUntil: "commit" });

const snaps = [];
for (const ms of [1000, 2000, 5000, 10000, WAIT].filter((x, i, a) => x <= WAIT && a.indexOf(x) === i)) {
  await page.waitForTimeout(ms - (snaps.at(-1)?.ms ?? 0));
  snaps.push(await page.evaluate((ms) => ({
    ms,
    ready: document.documentElement.classList.contains("rv-ready"),
    rv: document.querySelectorAll(".rv").length,
    on: document.querySelectorAll(".rv.on").length,
    heroLocked: document.documentElement.classList.contains("hero-locked"),
    scrollY: Math.round(scrollY),
    html: document.documentElement.className,
    opacity0: [...document.querySelectorAll(".rv")].filter((e) => +getComputedStyle(e).opacity < 0.99).length,
  }), ms));
}

const out = await page.evaluate(() => ({ log: window.__rv.log, err: window.__rv.err }));
console.log(JSON.stringify({ url: TARGET, w: W, h: H, dpr: DPR, cpu: CPU, net: NET, reduce: has("reduce"), snaps, log: out.log, err: out.err, pageErrors }, null, 1));
} finally {
  await browser.close().catch(() => {});
}
