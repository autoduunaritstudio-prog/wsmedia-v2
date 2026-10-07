/**
 * safari-piste.mjs — pysahtyy kiinteisiin kohtiin ja vierittaa siina edestakaisin
 * (+-100 px) 3 s, mittaa kehysvalit ja kirjaa tilan (toistuvat videot, kevyt-tila).
 * Vahentaa hajontaa: jokaisesta kohdasta tulee ~180 kehysta samassa tilassa.
 *   node scripts/safari-piste.mjs [--engine=webkit] [--pos=300,4300,5200,5500,5800,6100]
 *        [--runs=3] [--css=...] [--blockvars=--a-,--b-]
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);
const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const ENGINE = arg("engine", "webkit"), URL_ = arg("url", "https://wsmedia.fi/"), RUNS = +arg("runs", 3);
const POS = arg("pos", "300,4300,5200,5500,5800,6100").split(",").map(Number);
const NOPLAY = process.argv.includes("--noplay");
const INIT = arg("init", ""); // JS-tiedosto, joka ajetaan sivulla ennen sen omia skripteja
const VID = arg("vid", ""); // kansio, josta /referenssit/*.mp4 tarjoillaan (videokoodauksen kokeet)
const CSS = arg("css", ""), BLOCK = arg("blockvars", ""), W = 1440, H = 900;
const res = {};
const b = await requireBrowser(ENGINE).launch(launchOptions(ENGINE));
try {
  for (let r = 0; r < RUNS; r++) {
    const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    if (BLOCK) await page.addInitScript((list) => { const pre = list.split(","); const o = CSSStyleDeclaration.prototype.setProperty; CSSStyleDeclaration.prototype.setProperty = function (n, v, p) { if (pre.some((x) => n.startsWith(x))) return; return o.call(this, n, v, p); }; }, BLOCK);
    if (VID) {
      const { readFileSync } = await import("node:fs");
      await page.route(/\/referenssit\/[^/?]+\.mp4/, (rt) => {
        const n = new URL(rt.request().url()).pathname.split("/").pop();
        rt.fulfill({ status: 200, contentType: "video/mp4", body: readFileSync(`${VID}/${n}`) });
      });
    }
    if (INIT) await page.addInitScript({ path: INIT });
    if (NOPLAY) await page.addInitScript(() => { HTMLMediaElement.prototype.play = function () { return Promise.resolve(); }; });
    await page.addInitScript(() => {
      try { localStorage.setItem("wsmedia.consent", JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch {}
      window.__f = []; window.__on = false; let last = 0;
      const tick = (t) => { if (window.__on) { if (last) window.__f.push(t - last); last = t; } else last = 0; requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    await page.goto(URL_, { waitUntil: "load" });
    await page.waitForFunction(() => !document.documentElement.classList.contains("hero-locked"), null, { timeout: 15000 }).catch(() => {});
    if (CSS) await page.addStyleTag({ content: CSS });
    await page.waitForTimeout(1500);
    await page.mouse.move(W / 2, H / 2);
    for (const pos of POS) {
      // lahesty kohtaa Lenisin kautta pienin askelin, ettei ylitys karkaa
      for (let i = 0; i < 300; i++) {
        const y = await page.evaluate(() => scrollY);
        if (Math.abs(y - pos) < 60) break;
        await page.mouse.wheel(0, Math.sign(pos - y) * Math.min(300, Math.max(40, Math.abs(pos - y) / 3)));
        await page.waitForTimeout(60);
      }
      await page.waitForTimeout(1000);
      const y0 = await page.evaluate(() => Math.round(scrollY));
      await page.evaluate(() => { window.__f.length = 0; window.__on = true; });
      for (let i = 0; i < 90; i++) { await page.mouse.wheel(0, i % 20 < 10 ? 100 : -100); await page.waitForTimeout(16); }
      const st = await page.evaluate(() => { window.__on = false; return { f: window.__f.slice(), vids: [...document.querySelectorAll("video")].filter((v) => !v.paused).map((v) => (v.currentSrc || v.src).split("/").pop()), kevyt: document.documentElement.dataset.kevyt || "" }; });
      (res[pos] ||= []).push({ ...st, y0 });
    }
    await ctx.close();
  }
} finally { await b.close().catch(() => {}); }
console.log(`${ENGINE} ${URL_} runs=${RUNS} ${CSS ? "css=" + CSS : ""} ${BLOCK ? "blockvars=" + BLOCK : ""}${NOPLAY ? " noplay" : ""}${VID ? " vid=" + VID.split("/").pop() : ""}${INIT ? " init=" + INIT.split("/").pop() : ""}`);
for (const pos of POS) {
  const all = res[pos].flatMap((x) => x.f).sort((a, b) => a - b);
  const pr = res[pos].map((x) => (x.f.filter((d) => d > 20).length / x.f.length * 100).toFixed(0)).join("/");
  console.log(`  y${String(pos).padEnd(5)} med ${all[all.length >> 1].toFixed(0)} p95 ${all[Math.floor(all.length * .95)].toFixed(0)}  >20ms ${(all.filter((d) => d > 20).length / all.length * 100).toFixed(0).padStart(3)}% (ajot ${pr})  y0=${res[pos].map((x) => x.y0).join("/")}  videot: ${[...new Set(res[pos].map((x) => x.vids.join("+") || "-"))].join(" | ")}${res[pos].some((x) => x.kevyt) ? " KEVYT" : ""}`);
}
