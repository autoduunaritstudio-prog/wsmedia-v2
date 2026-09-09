/**
 * booking-text-diag.mjs — miksi kalenterin viereinen tekstilohko ei nay.
 *
 * Ajo (tuotantobuild kaynnissa portissa 3200):
 *   node scripts/booking-text-diag.mjs [--url=...] [--shot=tiedosto.png]
 *
 * Vieritetaan niin etta .cal on nakyman keskella ja luetaan .svc, .cal ja
 * .svc-txt: sijainti, koko, laskettu opacity/visibility/transform seka
 * elementin todellinen osumapiste (elementFromPoint) sen omassa
 * keskipisteessa. Naista erottuu kolme eri vikaa toisistaan: piilotettu
 * tila, nakyman ulkopuolelle asemoitu laatikko ja jonkin toisen
 * elementin peitto.
 */
const { launchOptions, requireBrowser } = await import(new URL("./_browser.mjs", import.meta.url).href);

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };

const TARGET = arg("url", "http://localhost:3200/");
const SHOT = arg("shot", "");
const W = +arg("w", 1728), H = +arg("h", 992);

const browser = await requireBrowser("chromium").launch(launchOptions("chromium", false));
try {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(TARGET, { waitUntil: "commit" });
  await page.waitForTimeout(3500);

  // .cal nakyman keskelle. ITEROIDEN: sticky-kerrokset ja parallaksi
  // siirtavat kohdetta kun sivu vierii, joten yksi hyppy ei osu.
  for (let i = 0; i < 8; i++) {
    const off = await page.evaluate(() => {
      const r = document.querySelector(".cal").getBoundingClientRect();
      const d = Math.round(r.top + r.height / 2 - innerHeight / 2);
      if (Math.abs(d) > 4) scrollTo(0, Math.round(scrollY + d));
      return d;
    });
    await page.waitForTimeout(350);
    if (Math.abs(off) <= 4) break;
  }
  await page.waitForTimeout(600);

  const info = await page.evaluate(() => {
    const pick = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const cx = Math.round(r.left + r.width / 2), cy = Math.round(r.top + r.height / 2);
      const hit = document.elementFromPoint(
        Math.min(Math.max(cx, 1), innerWidth - 1),
        Math.min(Math.max(cy, 1), innerHeight - 1),
      );
      return {
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        opacity: cs.opacity, visibility: cs.visibility, display: cs.display,
        transform: cs.transform, translate: cs.translate, filter: cs.filter,
        color: cs.color, backdrop: cs.backdropFilter,
        zIndex: cs.zIndex, position: cs.position, overflow: cs.overflow,
        classes: el.className,
        hit: hit ? `${hit.tagName.toLowerCase()}.${(hit.className || "").toString().split(" ").slice(0, 3).join(".")}` : null,
        text: (el.textContent || "").trim().slice(0, 40),
      };
    };
    const svc = document.querySelector(".kart .svc");
    return {
      scrollY: Math.round(scrollY),
      svc: pick(svc),
      visual: pick(document.querySelector(".kart .svc-visual")),
      txt: pick(document.querySelector(".kart .svc-txt")),
      cal: pick(document.querySelector(".cal")),
      h3: pick(document.querySelector(".kart .svc-txt h3")),
      // Esivanhempien ketju: mika tahansa niista voi piilottaa lohkon.
      chain: (() => {
        const out = [];
        let el = document.querySelector(".kart .svc-txt");
        while (el && el !== document.documentElement) {
          const cs = getComputedStyle(el);
          if (cs.opacity !== "1" || cs.visibility !== "visible" || cs.display === "none" ||
              cs.overflow !== "visible" || cs.filter !== "none" || cs.clipPath !== "none") {
            out.push({
              el: `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ").slice(0, 3).join(".")}`,
              opacity: cs.opacity, visibility: cs.visibility, display: cs.display,
              overflow: cs.overflow, filter: cs.filter, clipPath: cs.clipPath,
            });
          }
          el = el.parentElement;
        }
        return out;
      })(),
    };
  });

  console.log(JSON.stringify(info, null, 2));
  if (SHOT) { await page.screenshot({ path: SHOT }); console.log(`\nkuva: ${SHOT}`); }
  await ctx.close();
} finally {
  await browser.close().catch(() => {});
}
