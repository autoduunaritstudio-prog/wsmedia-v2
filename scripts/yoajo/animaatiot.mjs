/**
 * animaatiot.mjs: kaynnissa olevat CSS-animaatiot ja SMIL kun sivu on paikallaan.
 *
 *   node scripts/yoajo/animaatiot.mjs [--reitit=...] [--kohdat=0,0.5]
 *
 * Kertoo jokaisesta vierityskohdasta animaatiot, jotka pyorivat (playState
 * running) vaikka kohde ei ole nakymassa. Ne laskevat tyylit joka kehys.
 */
import { REITIT, arg, kaynnistaPalvelin, sammutaPalvelin, uusiKonteksti, odotaValmis, POHJA } from "./_yhteinen.mjs";
const { launchOptions, requireBrowser } = await import(new URL("../_browser.mjs", import.meta.url).href);
const reitit = arg("reitit") ? arg("reitit").split(",") : REITIT;
const kohdat = (arg("kohdat") || "0,0.5,1").split(",").map(Number);
const palvelin = await kaynnistaPalvelin();
const browser = await requireBrowser("chromium").launch(launchOptions("chromium"));
try {
  const ctx = await uusiKonteksti(browser);
  const page = await ctx.newPage();
  for (const r of reitit) {
    await page.goto(POHJA + r, { waitUntil: "load" });
    await odotaValmis(page, 1000);
    for (const k of kohdat) {
      const l = await page.evaluate(async (k) => {
        window.scrollTo({ top: k * (document.documentElement.scrollHeight - innerHeight), behavior: "instant" });
        await new Promise((r) => setTimeout(r, 700));
        const out = {};
        for (const a of document.getAnimations()) {
          if (a.playState !== "running" || !a.effect) continue;
          const t = a.effect.target, pseudo = a.effect.pseudoElement || "";
          if (!t) continue;
          const r = t.getBoundingClientRect();
          const cs = getComputedStyle(t);
          const nakyy = r.bottom > 0 && r.top < innerHeight && r.width > 0 && cs.visibility !== "hidden";
          if (nakyy) continue;
          const nimi = (a.animationName || a.constructor.name) + " " + t.tagName.toLowerCase() + "." + String(t.className?.baseVal ?? t.className).split(" ").slice(0, 2).join(".") + pseudo;
          out[nimi] = (out[nimi] || 0) + 1;
        }
        const smil = [...document.querySelectorAll("svg")].filter((s) => s.querySelector("animate, animateMotion, animateTransform") && !s.animationsPaused()).map((s) => {
          const r = s.getBoundingClientRect();
          return (r.bottom > 0 && r.top < innerHeight ? "nakyy " : "PIILOSSA ") + s.getAttribute("class");
        });
        return { out, smil };
      }, k);
      console.log(`${r} @${k}: ${JSON.stringify(l.out)} smil ${JSON.stringify(l.smil)}`);
    }
  }
  await ctx.close();
} finally {
  await browser.close().catch(() => {});
  sammutaPalvelin(palvelin);
}
