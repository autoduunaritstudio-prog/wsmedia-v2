/**
 * lighthouse.mjs: Lighthouse desktop-profiililla kerran per sivu.
 *
 *   node scripts/yoajo/lighthouse.mjs --out=<kansio> [--reitit=...]
 *
 * Kaynnistaa tuotantopalvelimen itse. Lighthouse ajetaan npx:lla
 * (lighthouse@13) Playwrightin Chromiumilla headlessina GPU-lipuilla.
 * Tuore profiili, joten evastebanneri nakyy kuten ensikavijalle.
 * Tulostaa: pisteet, FCP, LCP, CLS, TBT, SI, siirto yhteensa, JS.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REITIT, nimi, arg, kaynnistaPalvelin, sammutaPalvelin, POHJA } from "./_yhteinen.mjs";
const { requireBrowser } = await import(new URL("../_browser.mjs", import.meta.url).href);

const OUT = arg("out");
if (!OUT) { console.error("--out puuttuu"); process.exit(1); }
mkdirSync(OUT, { recursive: true });
const reitit = arg("reitit") ? arg("reitit").split(",") : REITIT;
const chrome = requireBrowser("chromium").executablePath();

const yht = [];
const palvelin = await kaynnistaPalvelin();
try {
  for (const r of reitit) {
    const f = join(OUT, `${nimi(r)}.json`);
    try {
      execFileSync("npx", ["-y", "lighthouse@13", POHJA + r, "--preset=desktop", "--output=json", `--output-path=${f}`,
        "--only-categories=performance,seo,accessibility,best-practices", "--quiet",
        "--chrome-flags=--headless=new --use-angle=metal --enable-gpu --ignore-gpu-blocklist"],
        { env: { ...process.env, CHROME_PATH: chrome }, stdio: ["ignore", "ignore", "pipe"], timeout: 180000 });
    } catch (e) { console.error(r, "lighthouse virhe", String(e.stderr || e).slice(0, 300)); continue; }
    const j = JSON.parse(readFileSync(f, "utf8"));
    const a = j.audits;
    const js = (a["network-requests"]?.details?.items || []).filter((i) => i.resourceType === "Script").reduce((s, i) => s + (i.transferSize || 0), 0);
    const rivi = {
      reitti: r,
      perf: Math.round(j.categories.performance.score * 100),
      seo: Math.round(j.categories.seo.score * 100),
      a11y: Math.round(j.categories.accessibility.score * 100),
      bp: Math.round(j.categories["best-practices"].score * 100),
      fcp: Math.round(a["first-contentful-paint"].numericValue),
      lcp: Math.round(a["largest-contentful-paint"].numericValue),
      cls: +a["cumulative-layout-shift"].numericValue.toFixed(4),
      tbt: Math.round(a["total-blocking-time"].numericValue),
      si: Math.round(a["speed-index"].numericValue),
      siirtoKiB: Math.round(a["total-byte-weight"].numericValue / 1024),
      jsKiB: Math.round(js / 1024),
      longTasks: (a["long-tasks"]?.details?.items || []).length,
      seoVirheet: Object.values(a).filter((x) => j.categories.seo.auditRefs.some((ref) => ref.id === x.id && ref.weight > 0) && x.score !== null && x.score < 1).map((x) => x.id),
    };
    yht.push(rivi);
    console.log(JSON.stringify(rivi));
  }
} finally {
  sammutaPalvelin(palvelin);
  writeFileSync(join(OUT, "yhteenveto.json"), JSON.stringify(yht, null, 1));
}
