/**
 * _yhteinen.mjs: yoajon (5.10.2026) mittausskriptien yhteiset osat.
 *
 * - tuotantopalvelimen kaynnistys ja sammutus (next start, oma portti)
 * - reittilista (kaikki app/**\/page.tsx)
 * - konteksti: evastesuostumus valmiiksi annettuna (analytics: false),
 *   kolmansien osapuolten pyynnot estetty
 * - odotus kunnes latausruudut ovat poissa
 *
 * Selain kaynnistetaan aina scripts/_browser.mjs:n kautta (GPU-liput).
 */
import { spawn } from "node:child_process";
import { setTimeout as nuku } from "node:timers/promises";

export const JUURI = new URL("../../", import.meta.url).pathname;
export const PORTTI = +(process.env.YOAJO_PORT || 3123);
export const POHJA = `http://localhost:${PORTTI}`;

export const REITIT = [
  "/",
  "/lyhytvideot",
  "/verkkosivut",
  "/hakukoneoptimointi",
  "/graafinen-suunnittelu",
  "/meista",
  "/toihin-meille",
  "/yhteystiedot",
  "/laskutustiedot",
  "/tietosuoja",
];

export const nimi = (r) => (r === "/" ? "etusivu" : r.slice(1).replace(/\//g, "_"));

export const arg = (k, d) => {
  const m = process.argv.find((a) => a.startsWith(`--${k}=`));
  return m ? m.slice(k.length + 3) : d;
};
export const has = (k) => process.argv.includes(`--${k}`);

/** Kaynnistaa `next start` -palvelimen ja odottaa vastausta. */
export async function kaynnistaPalvelin() {
  const p = spawn("npx", ["next", "start", "-p", String(PORTTI)], {
    cwd: JUURI,
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
  });
  let loki = "";
  p.stdout.on("data", (d) => (loki += d));
  p.stderr.on("data", (d) => (loki += d));
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch(POHJA + "/robots.txt");
      if (r.ok) return p;
    } catch { /* ei viela */ }
    await nuku(250);
  }
  sammutaPalvelin(p);
  throw new Error("Palvelin ei kaynnistynyt:\n" + loki);
}

export function sammutaPalvelin(p) {
  if (!p) return;
  try { process.kill(-p.pid, "SIGTERM"); } catch { /* jo poissa */ }
}

const SUOSTUMUS = `try{localStorage.setItem("wsmedia.consent",JSON.stringify({analytics:false,v:1,ts:Date.now()}))}catch(e){}`;

/** Uusi konteksti: suostumus annettu, vain localhost sallittu. */
export async function uusiKonteksti(browser, opts = {}) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    ...opts,
  });
  await ctx.addInitScript(SUOSTUMUS);
  await ctx.route("**/*", (route) => {
    const u = new URL(route.request().url());
    if (u.hostname === "localhost" || u.protocol === "data:" || u.protocol === "blob:") return route.continue();
    return route.abort();
  });
  return ctx;
}

/** Odottaa etta latausruudut ja hero-lukko ovat poissa. */
export async function odotaValmis(page, lisa = 1200) {
  await page
    .waitForFunction(
      () => {
        const h = document.documentElement;
        if (h.classList.contains("hero-locked")) return false;
        const hl = document.querySelector(".hero-load");
        if (hl && !hl.classList.contains("is-gone")) return false;
        const l = document.querySelector(".lataus");
        if (l && !l.classList.contains("lataus-pois")) return false;
        return document.readyState === "complete";
      },
      null,
      { timeout: 30000, polling: 100 },
    )
    .catch(() => {});
  await page.waitForTimeout(lisa);
}

export const kehys = (page, n = 2) =>
  page.evaluate((n) => new Promise((r) => {
    let i = 0;
    const f = () => (++i >= n ? r() : requestAnimationFrame(f));
    requestAnimationFrame(f);
  }), n);
