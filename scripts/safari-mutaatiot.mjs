/**
 * safari-mutaatiot.mjs — mitka elementit muuttuvat (style/class/attr) vierityksen aikana
 * annetulla vyohykkeella, montako kertaa ja mitka ominaisuudet. Myos mitka videot pyorivat.
 *   node scripts/safari-mutaatiot.mjs [--engine=webkit] [--from=4500] [--to=7500]
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);
const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const ENGINE = arg("engine", "webkit"), URL_ = arg("url", "https://wsmedia.fi/");
const W = 1440, H = 900, FROM = +arg("from", 4500), TO = +arg("to", 7500);
const b = await requireBrowser(ENGINE).launch(launchOptions(ENGINE));
try {
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.addInitScript(() => { try { localStorage.setItem("wsmedia.consent", JSON.stringify({ analytics: false, v: 1, ts: Date.now() })); } catch {} });
  await page.goto(URL_, { waitUntil: "load" });
  await page.waitForFunction(() => !document.documentElement.classList.contains("hero-locked"), null, { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(800);
  await page.mouse.move(W / 2, H / 2);
  for (let i = 0; i < 200 && (await page.evaluate(() => scrollY)) < FROM - 50; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(16); }
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const name = (e) => { let s = e.tagName.toLowerCase(); if (e.id) s += "#" + e.id; if (typeof e.className === "string" && e.className) s += "." + e.className.trim().split(/\s+/).slice(0, 3).join("."); const p = e.parentElement; return (p ? (p.id ? "#" + p.id : (typeof p.className === "string" ? p.className.split(" ")[0] : p.tagName.toLowerCase())) + " > " : "") + s; };
    const M = window.__mut = new Map(); window.__frames = 0;
    const tick = () => { window.__frames++; window.__raf = requestAnimationFrame(tick); }; tick();
    const prev = new WeakMap();
    window.__obs = new MutationObserver((list) => {
      for (const m of list) {
        const e = m.target; if (!(e instanceof Element)) continue;
        const k = name(e) + " [" + m.attributeName + "]";
        const o = M.get(k) || { n: 0, props: new Set(), area: 0 };
        o.n++;
        if (m.attributeName === "style") { const old = prev.get(e) || m.oldValue || ""; const cur = e.getAttribute("style") || ""; const pa = Object.fromEntries(old.split(";").map((x) => x.split(":").map((y) => y.trim())).filter((x) => x[0])); for (const [pk, pv] of cur.split(";").map((x) => x.split(":").map((y) => y.trim())).filter((x) => x[0])) if (pa[pk] !== pv) o.props.add(pk); prev.set(e, cur); }
        const r = e.getBoundingClientRect(); o.area = Math.max(o.area, Math.round(r.width * r.height / 1000));
        M.set(k, o);
      }
    });
    window.__obs.observe(document.documentElement, { attributes: true, subtree: true, attributeOldValue: true });
  });
  for (let i = 0; i < 200 && (await page.evaluate(() => scrollY)) < TO; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(16); }
  await page.waitForTimeout(300);
  const res = await page.evaluate(() => {
    window.__obs.disconnect(); cancelAnimationFrame(window.__raf);
    const vids = [...document.querySelectorAll("video")].map((v) => ({ c: (v.className || "") + " " + (v.currentSrc || v.src).split("/").pop(), playing: !v.paused, w: v.videoWidth, h: v.videoHeight, box: Math.round(v.getBoundingClientRect().width) + "x" + Math.round(v.getBoundingClientRect().height) }));
    return { frames: window.__frames, muts: [...window.__mut].map(([k, o]) => ({ k, n: o.n, props: [...o.props].join(","), areaK: o.area })).sort((a, b) => b.n - a.n).slice(0, 30), vids, kevyt: document.documentElement.dataset.kevyt || "-" };
  });
  console.log(`${ENGINE} kehyksia ${res.frames}, data-kevyt=${res.kevyt}`);
  for (const m of res.muts) console.log(`  ${String(m.n).padStart(4)}x  ${String(m.areaK).padStart(6)}k px²  ${m.k}  {${m.props}}`);
  console.log("videot:"); for (const v of res.vids) console.log(`  ${v.playing ? "TOISTAA" : "tauolla"} ${v.w}x${v.h} -> ${v.box}  ${v.c}`);
  await ctx.close();
} finally { await b.close().catch(() => {}); }
