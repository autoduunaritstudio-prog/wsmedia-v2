/**
 * linkit.mjs: sisaisten linkkien, ankkureiden ja kehotuspainikkeiden tarkistus.
 *
 *   node scripts/yoajo/linkit.mjs --json=<tiedosto>
 *
 * Kaynnistaa tuotantopalvelimen itse. Jokaiselta reitilta (hydraation jalkeen):
 *   1. kaikki a[href]: sisaiset -> kohdereitin HTTP-tila ja ankkurin id
 *      kohdesivun DOMissa; ulkoiset -> muoto, target ja rel (ei pyyntoja);
 *      tel: ja mailto: -> muoto
 *   2. [data-varaus], [data-yhteys] ja Kehotukset.tsx:n kasittelemat saman
 *      sivun ankkurit (#tarjous, #lomake, #kartoitus): klikataan
 *      ohjelmallisesti ja katsotaan mika ikkuna aukesi (dialog.vi =
 *      varaus, dialog.yi = yhteys)
 *   3. valikkonappi avaa FullscreenNavin
 * Kolmansille osapuolille ei tehda pyyntoja (konteksti estaa ne).
 */
import { writeFileSync } from "node:fs";
import { REITIT, arg, kaynnistaPalvelin, sammutaPalvelin, uusiKonteksti, odotaValmis, POHJA } from "./_yhteinen.mjs";
const { launchOptions, requireBrowser } = await import(new URL("../_browser.mjs", import.meta.url).href);

const JSON_OUT = arg("json");
const tila = new Map();   // polku -> HTTP-tila
const idt = new Map();    // polku -> Set(id)
const raportti = { reitit: {} };

const palvelin = await kaynnistaPalvelin();
const browser = await requireBrowser("chromium").launch(launchOptions("chromium"));
try {
  const ctx = await uusiKonteksti(browser, { reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const lueIdt = async (polku) => {
    if (idt.has(polku)) return idt.get(polku);
    const p2 = await ctx.newPage();
    try {
      const res = await p2.goto(POHJA + polku, { waitUntil: "load" });
      tila.set(polku, res ? res.status() : 0);
      await p2.waitForTimeout(800);
      const s = new Set(await p2.evaluate(() => [...document.querySelectorAll("[id]")].map((e) => e.id)));
      idt.set(polku, s);
      return s;
    } finally { await p2.close(); }
  };

  for (const r of REITIT) {
    await page.goto(POHJA + r, { waitUntil: "load" });
    await odotaValmis(page, 800);
    const omat = new Set(await page.evaluate(() => [...document.querySelectorAll("[id]")].map((e) => e.id)));
    idt.set(r, omat);
    tila.set(r, 200);
    const linkit = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a, i) => {
      a.dataset.yoI = String(i);
      const alue = a.closest("nav, footer, header, dialog, .fsnav, section, [id]");
      return {
        i, href: a.getAttribute("href"), abs: a.href, teksti: (a.textContent || a.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 50),
        target: a.getAttribute("target"), rel: a.getAttribute("rel"),
        varaus: a.hasAttribute("data-varaus"), yhteys: a.hasAttribute("data-yhteys"),
        alue: alue ? (alue.id ? "#" + alue.id : alue.tagName.toLowerCase() + "." + String(alue.className).split(" ")[0]) : "",
      };
    }));
    const rr = { linkkeja: linkit.length, sisaiset: 0, ulkoiset: 0, ongelmat: [] };
    raportti.reitit[r] = rr;
    for (const l of linkit) {
      const h = l.href;
      if (/^(tel|mailto):/.test(h)) {
        if (h.startsWith("tel:") && !/^tel:\+?\d{6,15}$/.test(h)) rr.ongelmat.push({ ...l, vika: "tel-muoto" });
        if (h.startsWith("mailto:") && !/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}(\?.*)?$/i.test(h)) rr.ongelmat.push({ ...l, vika: "mailto-muoto" });
        continue;
      }
      const u = new URL(l.abs);
      if (u.origin !== POHJA) {
        rr.ulkoiset++;
        if (!/^https:\/\//.test(h)) rr.ongelmat.push({ ...l, vika: "ulkoinen ei https" });
        if (l.target !== "_blank") rr.ongelmat.push({ ...l, vika: "ulkoinen ilman target=_blank" });
        else if (!/noopener|noreferrer/.test(l.rel || "")) rr.ongelmat.push({ ...l, vika: "target=_blank ilman rel=noopener" });
        continue;
      }
      rr.sisaiset++;
      if (h === "#" || h === "") { rr.ongelmat.push({ ...l, vika: "tyhja #" }); continue; }
      const polku = u.pathname.replace(/\/$/, "") || "/";
      if (!tila.has(polku)) {
        const res = await page.request.get(POHJA + polku, { maxRedirects: 0 }).catch(() => null);
        tila.set(polku, res ? res.status() : 0);
      }
      const st = tila.get(polku);
      if (st !== 200) { rr.ongelmat.push({ ...l, vika: `HTTP ${st}` }); continue; }
      if (u.hash.length > 1) {
        const id = decodeURIComponent(u.hash.slice(1));
        const s = polku === r ? omat : await lueIdt(polku);
        /* Kehotukset.tsx kaappaa saman sivun #tarjous/#lomake/#kartoitus -> ikkuna, id:ta ei tarvita */
        const kaapattu = polku === r && ["tarjous", "lomake", "kartoitus"].includes(id);
        if (!s.has(id) && !kaapattu) rr.ongelmat.push({ ...l, vika: `ankkuri #${id} puuttuu sivulta ${polku}` });
      }
    }

    /* Kehotuspainikkeet: klikkaa ja katso ikkuna */
    const kehot = await page.evaluate(() => {
      const ank = new Set(["#tarjous", "#lomake", "#kartoitus"]);
      const out = [];
      document.querySelectorAll("[data-varaus], [data-yhteys], a[href]").forEach((el, i) => {
        if (el.closest("dialog")) return;
        let odotus = null;
        if (el.hasAttribute("data-varaus")) odotus = "varaus";
        else if (el.hasAttribute("data-yhteys")) odotus = "yhteys";
        else {
          const u = new URL(el.href, location.href);
          if (u.pathname !== location.pathname || !ank.has(u.hash)) return;
          odotus = el.closest("#hinnoittelu") || el.closest("#ukk") || /^kysy/i.test(el.textContent.trim()) ? "yhteys" : "varaus";
        }
        el.dataset.yoK = String(i);
        out.push({ k: i, odotus, palvelu: el.dataset.palvelu || null, teksti: (el.textContent || el.getAttribute("aria-label") || "").trim().replace(/\s+/g, " ").slice(0, 40) });
      });
      return out;
    });
    rr.kehotuksia = kehot.length;
    for (const k of kehot) {
      const tulos = await page.evaluate(async (k) => {
        const el = document.querySelector(`[data-yo-k="${k}"]`);
        const ennen = location.href;
        el.click();
        await new Promise((r) => setTimeout(r, 120));
        const auki = document.querySelector("dialog[open]");
        const mika = auki ? (auki.classList.contains("vi") ? "varaus" : "yhteys") : (location.href !== ennen ? "navigointi " + location.href : "ei mitaan");
        let valittu = null;
        if (auki && !auki.classList.contains("vi")) {
          valittu = [...auki.querySelectorAll(".yi-palvelut label.on")].map((l) => l.textContent.trim()).join(",");
        }
        auki?.close();
        document.documentElement.classList.remove("lukossa");
        await new Promise((r) => setTimeout(r, 60));
        return { mika, valittu };
      }, k.k);
      if (tulos.mika !== k.odotus) rr.ongelmat.push({ ...k, vika: `avasi: ${tulos.mika}, odotettiin ${k.odotus}` });
      else if (k.palvelu && tulos.valittu !== null && tulos.valittu !== k.palvelu) rr.ongelmat.push({ ...k, vika: `palvelu esivalittu "${tulos.valittu}", odotettiin "${k.palvelu}"` });
    }
    if (page.url() !== POHJA + r && page.url() !== POHJA + r + "/") await page.goto(POHJA + r, { waitUntil: "load" });

    /* Valikko */
    const nappi = await page.$("button.navtoggle");
    if (nappi) {
      await nappi.evaluate((b) => b.click());
      await page.waitForTimeout(700);
      rr.valikko = await page.evaluate(() => {
        const n = document.querySelector(".fsnav");
        if (!n) return "ei loytynyt";
        return n.classList.contains("on") && n.getAttribute("aria-hidden") === "false" ? "aukesi" : "piilossa";
      });
      await page.keyboard.press("Escape");
    } else rr.valikko = "nappia ei loytynyt";

    console.log(`${r}: linkkeja ${linkit.length} (sis ${rr.sisaiset}, ulk ${rr.ulkoiset}), kehotuksia ${kehot.length}, valikko ${rr.valikko}, ongelmia ${rr.ongelmat.length}`);
    for (const o of rr.ongelmat) console.log("   ", o.vika, "|", o.href ?? "", "|", o.teksti, "|", o.alue ?? "");
  }
  await ctx.close();
} finally {
  await browser.close().catch(() => {});
  sammutaPalvelin(palvelin);
  if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(raportti, null, 1));
}
