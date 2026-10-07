/**
 * tulos-musta.mjs — etusivun mobiilin Tulokset-karusellin "musta valahdys"
 * puhelinmockupissa korttia vaihdettaessa.
 *
 * Ajo (tuotantobuild kaynnissa): node scripts/tulos-musta.mjs [url] [viive_ms]
 *   url      oletus http://localhost:4417/
 *   viive_ms keinotekoinen viive .webp/.mp4-vastauksiin (oletus 0)
 *
 * Mita mitataan: pyyhkaisyn jalkeen jokaisella kehyksella uuden kortin
 * puhelimesta (a) onko kansikuva ladattu ja purettu, (b) videon laskettu
 * opacity, (c) onko video jo esittanyt ruudun (requestVideoFrameCallback).
 * "Musta" kehys = puhelin nakyvissa JA
 *   (kansikuva puuttuu ja video ei peita) TAI (video nakyy ennen ensimmaista ruutua).
 * Lisaksi paluu edelliseen korttiin (pause/play) mitataan samoin.
 */
import { pw, launchOptions, requireBrowser } from "./_browser.mjs";

const URL_ = process.argv[2] || "http://localhost:4417/";
const VIIVE = Number(process.argv[3] || 0);

const PROFIILIT = [
  { nimi: "iPhone 15 (WebKit)", engine: "webkit", dev: "iPhone 15" },
  { nimi: "Pixel 7 (Chromium)", engine: "chromium", dev: "Pixel 7" },
];

const SAMPLER = () => {
  /* Esitettyjen ruutujen laskuri jokaiselle tuloskortin videolle sivun
     alusta asti, jotta myos taukoon jaanyt (jo ruudun esittanyt) video
     tunnistetaan oikein. */
  window.__ruudut = new Map();
  window.__seuraa = () =>
    document.querySelectorAll("video[data-etu-tulos]").forEach((v) => {
      if (v.__seurattu || !v.requestVideoFrameCallback) return;
      v.__seurattu = true;
      const kierros = () => v.requestVideoFrameCallback(() => {
        window.__ruudut.set(v, (window.__ruudut.get(v) ?? 0) + 1);
        kierros();
      });
      kierros();
    });
  window.__naytteet = (k, kesto) =>
    new Promise((res) => {
      const art = document.querySelectorAll("[data-etu=tulokset] article")[k];
      const puh = art.querySelector(".mo-e-puh");
      const img = puh.querySelector("img");
      const v = puh.querySelector("video");
      const out = [];
      const t0 = performance.now();
      const askel = () => {
        const t = performance.now() - t0;
        const r = puh.getBoundingClientRect();
        const nakyy = r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight;
        const kuvaOk = img.complete && img.naturalWidth > 1 && !img.src.startsWith("data:");
        const op = Number(getComputedStyle(v).opacity);
        const ruudut = window.__ruudut.get(v) ?? 0;
        const tukeeRvfc = !!v.requestVideoFrameCallback;
        const musta =
          nakyy &&
          ((!kuvaOk && op < 0.99) || (op > 0.01 && (tukeeRvfc ? ruudut === 0 : v.readyState < 2)));
        out.push({ t: Math.round(t), nakyy, kuvaOk, op: +op.toFixed(2), rs: v.readyState, ct: +v.currentTime.toFixed(2), ruudut, musta });
        if (t < kesto) requestAnimationFrame(askel);
        else res(out);
      };
      requestAnimationFrame(askel);
    });
};

const yhteenveto = (n) => {
  const m = n.filter((x) => x.musta);
  const ekaKuva = n.find((x) => x.kuvaOk);
  const ekaNakyva = n.find((x) => x.op > 0.01);
  return {
    kehyksia: n.length,
    mustia: m.length,
    mustaAikavali: m.length ? `${m[0].t}-${m[m.length - 1].t} ms` : "-",
    kansikuvaValmis: ekaKuva ? `${ekaKuva.t} ms` : "ei",
    videoNakyviin: ekaNakyva ? `${ekaNakyva.t} ms (ruutuja ${ekaNakyva.ruudut}, rs ${ekaNakyva.rs})` : "ei",
  };
};

const browsers = {};
try {
  for (const p of PROFIILIT) {
    const b = (browsers[p.engine] ||= await requireBrowser(p.engine).launch(launchOptions(p.engine)));
    const ctx = await b.newContext({ ...pw.devices[p.dev] });
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("wsmedia.consent", JSON.stringify({ analytics: false, v: 1, ts: Date.now() }));
      } catch {}
    });
    await ctx.addInitScript(SAMPLER);
    const page = await ctx.newPage();
    const virheet = [];
    page.on("pageerror", (e) => virheet.push(String(e)));
    if (VIIVE) {
      await page.route(/\.(webp|mp4)(\?|$)/, async (r) => {
        await new Promise((s) => setTimeout(s, VIIVE));
        await r.continue();
      });
    }
    await page.goto(URL_, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.__seuraa());
    // Vieritys karusellin kohdalle (instant, html:lla on scroll-behavior smooth)
    await page.evaluate(() => {
      const t = document.querySelector("[data-etu=tulokset]");
      const y = t.getBoundingClientRect().top + scrollY - innerHeight * 0.25;
      window.scrollTo({ top: y, behavior: "instant" });
    });
    await page.waitForTimeout(1500);
    const ennen = await page.evaluate(() =>
      [...document.querySelectorAll("[data-etu=tulokset] article .mo-e-puh img")].map((i) => ({
        src: i.getAttribute("src").slice(0, 40),
        loading: i.loading,
        complete: i.complete,
        nw: i.naturalWidth,
      })),
    );
    const vaihda = (left) =>
      page.evaluate((l) => document.querySelector("[data-etu=tulokset]").scrollTo({ left: l, behavior: "instant" }), left);

    // 1 -> 2 (YDR, video)
    const n2p = page.evaluate(() => window.__naytteet(1, 1500));
    await vaihda(330);
    const n2 = await n2p;
    // 2 -> 1 (paluu, pause/play)
    const n1p = page.evaluate(() => window.__naytteet(0, 1200));
    await vaihda(0);
    const n1 = await n1p;
    // 1 -> 2 uudelleen
    const n2bp = page.evaluate(() => window.__naytteet(1, 1200));
    await vaihda(330);
    const n2b = await n2bp;

    console.log(`\n=== ${p.nimi}  viive ${VIIVE} ms ===`);
    console.log("puhelinkuvat ennen pyyhkaisya:", JSON.stringify(ennen));
    console.log("1->2 :", JSON.stringify(yhteenveto(n2)));
    console.log("2->1 :", JSON.stringify(yhteenveto(n1)));
    console.log("1->2b:", JSON.stringify(yhteenveto(n2b)));
    if (process.env.RAAKA) console.log(JSON.stringify(n2.slice(0, 40)));
    if (virheet.length) console.log("sivuvirheet:", virheet);
    await ctx.close();
  }
} finally {
  for (const b of Object.values(browsers)) await b.close().catch(() => {});
}
