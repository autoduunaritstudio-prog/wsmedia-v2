/**
 * safari-videotauko.mjs — todentaa RefCardsin vieritystauon: WebKitissa
 * videot pysahtyvat vierityksen ajaksi (poster pysyy piilossa, kangas nayttaa
 * kuvaa) ja jatkavat levossa; Chromiumissa ne soivat koko ajan.
 *   node scripts/safari-videotauko.mjs [--url=http://localhost:3111/]
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);
const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const URL_ = arg("url", "http://localhost:3111/");
const tila = () => [...document.querySelectorAll(".refgrid .refcard")].map((c) => {
  const v = c.querySelector("video"), p = c.querySelector(".refcard-poster");
  return (v.paused ? "P" : "S") + (p.classList.contains("is-hidden") ? "-" : "K") + (v.currentTime > 0.05 ? "+" : "0");
}).join(" ");
for (const engine of ["webkit", "chromium"]) {
  const b = await requireBrowser(engine).launch(launchOptions(engine));
  try {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.addInitScript(() => { try { localStorage.setItem("wsmedia.consent", JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch {} });
    await page.goto(URL_, { waitUntil: "load" });
    await page.waitForFunction(() => !document.documentElement.classList.contains("hero-locked"), null, { timeout: 15000 }).catch(() => {});
    await page.mouse.move(720, 450);
    for (let i = 0; i < 300 && (await page.evaluate(() => scrollY)) < 4300; i++) { await page.mouse.wheel(0, 150); await page.waitForTimeout(30); }
    const log = [];
    log.push(["vierityksen aikana (heti saapuessa)", await page.evaluate(tila)]);
    await page.waitForTimeout(1500);
    log.push(["levossa 1,5 s", await page.evaluate(tila)]);
    for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, i % 2 ? -100 : 100); await page.waitForTimeout(40); }
    log.push(["vierityksen aikana", await page.evaluate(tila)]);
    const flash = await page.evaluate(async () => { let k = 0; const t = performance.now(); while (performance.now() - t < 600) { await new Promise((r) => requestAnimationFrame(r)); if ([...document.querySelectorAll(".refgrid .refcard-poster")].some((p) => !p.classList.contains("is-hidden"))) k++; } return k; });
    log.push(["600 ms levon alussa: kehyksia joissa jokin poster nakyi", String(flash)]);
    log.push(["levon jalkeen", await page.evaluate(tila)]);
    // Nappaimistopysaytys (Enter, WCAG 2.2.2) ei saa kumoutua vierityksella.
    await page.waitForTimeout(800);
    await page.evaluate(() => document.querySelector(".refgrid .refcard").focus({ preventScroll: true }));
    await page.keyboard.press("Enter");
    await page.waitForTimeout(400);
    log.push(["Enter ensimmaisella kortilla", await page.evaluate(tila)]);
    for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, i % 2 ? -100 : 100); await page.waitForTimeout(40); }
    await page.waitForTimeout(1200);
    log.push(["vieritys + lepo 1,2 s (1. kortin pysyttava P)", await page.evaluate(tila)]);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(600);
    log.push(["Enter uudelleen (1. kortti soi)", await page.evaluate(tila)]);
    for (let i = 0; i < 60; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(16); }
    await page.waitForTimeout(800);
    const pois = await page.evaluate(() => [...document.querySelectorAll(".refgrid .refcard")].map((c) => { const v = c.querySelector("video"); return (v.paused ? "P" : "S") + (c.querySelector(".refcard-poster").classList.contains("is-hidden") ? "-" : "K") + (v.currentTime > 0.05 ? "+" : "0"); }).join(" "));
    log.push([`ohitettu (y ${await page.evaluate(() => Math.round(scrollY))})`, pois]);
    console.log(`${engine}   (S=soi P=tauko, K=poster nakyy -=piilossa, +=kesken 0=alussa)`);
    for (const [k, v] of log) console.log(`  ${k.padEnd(56)} ${v}`);
    await ctx.close();
  } finally { await b.close().catch(() => {}); }
}
