/**
 * read-window.mjs — kuinka monta pikselia scrollia lukukaista on
 * ESTEETTOMASTI nakyvissa.
 *
 * Ajo (tuotantobuild portissa 3111):
 *   node scripts/read-window.mjs [--w=1728] [--h=906] [--step=25]
 *                                [--heights=906] [--geom]
 *
 * MENETELMA. Geometrinen paallekkaisyys ei kelpaa: se kertoo vain
 * tutkitun elementin peitosta eika huomaa valikerroksia. Tassa kysytaan
 * selaimelta elementFromPointilla kuka pisteessa oikeasti on. Kolme
 * pistetta otsikon leveydelta (25/50/75 %) ja KAIKKIEN on osuttava
 * samaan h3:een - yksi piste ei riita, koska kapea peittaja voi jattaa
 * reunan vapaaksi.
 *
 * Evastebanneri hylataan ENNEN latausta. Auki ollessaan se esiintyy
 * peittajalistalla (DIV.cc-in, DIV.cc-opt) ja lyhentaa ikkunaa, mika
 * sekoittuisi mitattavaan ilmioon.
 *
 * HEADLESS on oletus (CLAUDE.md). Kerrostus ei vaikuta osumatestiin:
 * elementFromPoint on asettelua, ei rasterointia.
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const has = (k) => process.argv.includes(`--${k}`);
const TARGET = arg("url", "http://localhost:3111/");
const W = +arg("w", 1728);
const HEIGHTS = arg("heights", arg("h", "906")).split(",").map(Number);
const STEP = +arg("step", 25);
/** --css=".x{...}" injektoidaan latauksen jalkeen: A/B ilman kaannosta. */
const CSS = arg("css", "");

const browser = await requireBrowser("chromium").launch(launchOptions("chromium", has("headed")));
try {
  for (const H of HEIGHTS) {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
    // Suostumus paikalleen ennen ensimmaista skriptia, jotta banneri ei
    // ehdi renderoitua lainkaan.
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("wsmedia.consent", JSON.stringify({ analytics: false, v: 1, ts: Date.now() }));
      } catch { /* privaattitila */ }
    });
    const page = await ctx.newPage();
    await page.goto(TARGET, { waitUntil: "commit" });
    if (CSS) await page.addStyleTag({ content: CSS });
    await page.waitForTimeout(4500);
    await page.evaluate(() => document.querySelectorAll("video").forEach((v) => v.pause()));

    const banner = await page.evaluate(() => !!document.querySelector(".cc-in, .cc-opts"));
    const geom = await page.evaluate(() => {
      const box = (s) => { const e = document.querySelector(s); if (!e) return null;
        const r = e.getBoundingClientRect(); return { top: Math.round(r.top + scrollY), h: Math.round(r.height) }; };
      const cs = (s, p) => { const e = document.querySelector(s); return e ? getComputedStyle(e).getPropertyValue(p).trim() : "-"; };
      return {
        doc: document.documentElement.scrollHeight,
        refzone: box(".refzone"), refsticky: box(".refsticky"), refband: box(".refband"),
        refs: box(".refs"), refgap: box(".refgap"), aftercover: box(".aftercover"),
        h3pin: (() => {
          // Sijainti nakymassa kun paneeli on pinnattu: cy = C + top.
          const p = document.querySelector(".refsticky");
          if (!p) return [];
          const top = parseFloat(getComputedStyle(p).getPropertyValue("--ref-sticky-top")) || 0;
          const pr = p.getBoundingClientRect();
          return [...document.querySelectorAll(".refsticky .svc-txt h3")].map((e) => {
            const b = e.getBoundingClientRect();
            return Math.round(b.top - pr.top + b.height / 2 + top);
          });
        })(),
        refStickyTop: cs(".refsticky", "--ref-sticky-top"),
        refsStickyTop: cs(".refs", "--refs-sticky-top"),
        afterMin: cs(".aftercover", "min-height"),
      };
    });

    const res = await page.evaluate(async ({ STEP }) => {
      const h3s = [...document.querySelectorAll(".refsticky .svc-txt h3")];
      // Vyohyke johdetaan .refzonesta: kaista ei voi olla nakyvissa sen
      // ulkopuolella, ja koko sivun skannaus nelinkertaistaisi ajan.
      const rz = document.querySelector(".refzone").getBoundingClientRect();
      const from = Math.max(0, Math.round(rz.top + scrollY - 2 * innerHeight));
      const to = Math.min(document.documentElement.scrollHeight - innerHeight,
                          Math.round(rz.top + scrollY + rz.height));
      const out = h3s.map((el) => ({ txt: el.textContent.slice(0, 42), free: [], blockers: {}, n: 0 }));
      // behavior: "instant" ON PAKKO. html:lla on scroll-behavior: smooth,
      // joten pelkka scrollTo animoi, ja "odota kunnes scrollY lakkaa
      // muuttumasta" -silmukka poimii valilehtia animaation keskelta.
      // Sellainen naytesarja nayttaa reiallista vapaata kaistaa vaikka
      // kaista on yhtenainen - mitattu ero: 3 katkosta / 0 katkosta.
      const settle = async () => { for (let i = 0; i < 6; i++) await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); };
      for (let y = from; y <= to; y += STEP) {
        scrollTo({ top: y, behavior: "instant" }); await settle();
        const sy = Math.round(scrollY);
        h3s.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const yy = r.top + r.height / 2;
          if (yy < 0 || yy > innerHeight) return;              // ei nakymassa
          out[i].n++;
          const pts = [0.25, 0.5, 0.75].map((f) => document.elementFromPoint(r.left + r.width * f, yy));
          const ok = pts.every((p) => p === el || el.contains(p));
          if (ok) out[i].free.push(sy);
          else for (const p of pts) {
            if (p === el || el.contains(p)) continue;
            const k = (p?.tagName || "?") + (p?.className && typeof p.className === "string" ? "." + p.className.split(/\s+/).slice(0, 2).join(".") : "");
            out[i].blockers[k] = (out[i].blockers[k] || 0) + 1;
          }
        });
        if (scrollY >= to - innerHeight) break;
      }
      return out;
    }, { STEP });

    console.log(`\n=== ${W}x${H}  askel ${STEP}px  banneri ${banner ? "AUKI (mittaus pilalla)" : "pois"} ===`);
    if (has("geom") || true) {
      const f = (n, b) => b ? `${String(b.top).padStart(6)} h ${String(b.h).padStart(5)}` : "     - ";
      for (const k of ["refzone", "refsticky", "refband", "refs", "refgap", "aftercover"])
        if (geom[k]) console.log(`  ${k.padEnd(11)} top ${f(k, geom[k])}`);
      console.log(`  h3 nakymassa pinnattuna: ${geom.h3pin.join("px, ")}px  (nav ulottuu 108px asti, nakyman alareuna ${H}px)`);
      console.log(`  sivun korkeus ${geom.doc}   --ref-sticky-top ${geom.refStickyTop}  --refs-sticky-top ${geom.refsStickyTop}  aftercover min-height ${geom.afterMin}`);
    }
    for (const o of res) {
      // Yhtenaiset jaksot: perakkaiset naytteet joiden vali on STEP.
      const runs = [];
      for (const y of o.free) {
        const last = runs.at(-1);
        if (last && y - last[1] <= STEP) last[1] = y; else runs.push([y, y]);
      }
      const longest = runs.slice().sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]))[0];
      const total = o.free.length * STEP;
      console.log(`\n  "${o.txt}"`);
      console.log(`    esteettomia naytteita ${o.free.length}/${o.n}   yhteensa ~${total}px`);
      console.log(`    jaksot: ${runs.map(([a, b]) => `${a}..${b} (${b - a + STEP}px)`).join("  ") || "ei yhtaan"}`);
      console.log(`    pisin yhtenainen: ${longest ? longest[1] - longest[0] + STEP : 0} px`);
      const bl = Object.entries(o.blockers).sort((a, b) => b[1] - a[1]).slice(0, 6);
      console.log(`    peittajat: ${bl.map(([k, n]) => `${k} ${n}x`).join("  ") || "-"}`);
    }
    await ctx.close();
  }
} finally { await browser.close().catch(() => {}); }
