/**
 * seo.mjs: sivukohtainen SEO-tarkistus tuotantobuildista.
 *
 *   node scripts/yoajo/seo.mjs --json=<tiedosto>
 *
 * Jokaiselta reitilta: title, meta description, canonical, og:* ja
 * twitter:* (kuvareitti haetaan paikalliselta palvelimelta), h1-maara,
 * otsikkohierarkian hypyt, alt-tekstit, html lang, JSON-LD:n jasennys ja
 * FAQPage-kysymysten vertailu sivulla nakyviin kysymyksiin.
 * Lisaksi robots.txt ja sitemap.xml: generoituvatko (HTTP 200, muoto).
 * Sisaltoa ei muuteta eika kolmansille osapuolille tehda pyyntoja.
 */
import { writeFileSync } from "node:fs";
import { REITIT, arg, kaynnistaPalvelin, sammutaPalvelin, uusiKonteksti, odotaValmis, POHJA } from "./_yhteinen.mjs";
const { launchOptions, requireBrowser } = await import(new URL("../_browser.mjs", import.meta.url).href);

const JSON_OUT = arg("json");
const paikallinen = (u) => u.replace(/^https?:\/\/(www\.)?wsmedia\.fi/, POHJA).replace(/^http:\/\/localhost:3000/, POHJA);
const tulos = { reitit: {}, robots: null, sitemap: null };

const palvelin = await kaynnistaPalvelin();
const browser = await requireBrowser("chromium").launch(launchOptions("chromium"));
try {
  const ctx = await uusiKonteksti(browser, { reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const r of REITIT) {
    const raaka = await (await fetch(POHJA + r)).text();
    await page.goto(POHJA + r, { waitUntil: "load" });
    await odotaValmis(page, 600);
    const d = await page.evaluate(() => {
      const m = (s) => document.querySelector(s)?.getAttribute("content") ?? null;
      const otsikot = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({ t: +(h.getAttribute("aria-level") || h.tagName[1]), x: h.textContent.trim().replace(/\s+/g, " ").slice(0, 60), nakyy: h.getClientRects().length > 0 }));
      const hypyt = [];
      let ed = 0;
      for (const o of otsikot) { if (ed && o.t > ed + 1) hypyt.push(`h${ed} -> h${o.t}: ${o.x}`); ed = o.t; }
      const kuvat = [...document.querySelectorAll("img")].map((i) => ({ src: i.getAttribute("src")?.slice(0, 80), alt: i.getAttribute("alt"), ariaHidden: !!i.closest("[aria-hidden='true']") }));
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent);
      /* nakyvat UKK-kysymykset: summary/button/dt/h3 UKK-osion sisalla */
      const ukk = document.querySelector("#ukk, .qa2, .etu-ukk, [id*='ukk']");
      const kysymykset = ukk ? [...ukk.querySelectorAll("summary, dt, button, h3, h4")].map((e) => e.textContent.trim().replace(/\s+/g, " ")).filter((t) => t.endsWith("?")) : [];
      return {
        lang: document.documentElement.lang,
        title: document.title,
        description: m('meta[name="description"]'),
        canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
        robotsMeta: m('meta[name="robots"]'),
        og: Object.fromEntries([...document.querySelectorAll('meta[property^="og:"]')].map((e) => [e.getAttribute("property"), e.getAttribute("content")])),
        tw: Object.fromEntries([...document.querySelectorAll('meta[name^="twitter:"]')].map((e) => [e.getAttribute("name"), e.getAttribute("content")])),
        h1: otsikot.filter((o) => o.t === 1).map((o) => o.x),
        hypyt, kuvat, ld, kysymykset,
      };
    });
    const ongelmat = [];
    if (d.lang !== "fi") ongelmat.push(`lang="${d.lang}"`);
    if (!d.title) ongelmat.push("title puuttuu");
    else if (d.title.length > 65) ongelmat.push(`title ${d.title.length} merkkia`);
    if (!d.description) ongelmat.push("description puuttuu");
    else if (d.description.length > 165 || d.description.length < 70) ongelmat.push(`description ${d.description.length} merkkia`);
    if (!d.canonical) ongelmat.push("canonical puuttuu");
    else if (!/^https:\/\/wsmedia\.fi(\/|$)/.test(d.canonical)) ongelmat.push(`canonical ${d.canonical}`);
    if (d.h1.length !== 1) ongelmat.push(`h1-maara ${d.h1.length}: ${JSON.stringify(d.h1)}`);
    for (const h of d.hypyt) ongelmat.push(`otsikkohyppy ${h}`);
    for (const k of d.kuvat) if (k.alt === null) ongelmat.push(`img ilman alt: ${k.src}`);
    for (const k of ["og:title", "og:description", "og:url", "og:image", "og:type", "og:locale"]) if (!d.og[k]) ongelmat.push(`${k} puuttuu`);
    if (d.og["og:url"] && d.canonical && d.og["og:url"].replace(/\/$/, "") !== d.canonical.replace(/\/$/, "")) ongelmat.push(`og:url ${d.og["og:url"]} != canonical ${d.canonical}`);
    for (const k of ["og:image", "twitter:image"]) {
      const u = d.og[k] ?? d.tw[k];
      if (!u) continue;
      if (!/^https:\/\/wsmedia\.fi\//.test(u)) ongelmat.push(`${k} ei absoluuttinen wsmedia.fi: ${u}`);
      const res = await fetch(paikallinen(u)).catch(() => null);
      const tyyppi = res?.headers.get("content-type") || "";
      if (!res || res.status !== 200 || !tyyppi.startsWith("image/")) ongelmat.push(`${k} ${u} -> ${res ? res.status : "virhe"} ${tyyppi}`);
    }
    const ldTyypit = [];
    for (const s of d.ld) {
      let j;
      try { j = JSON.parse(s); } catch (e) { ongelmat.push(`JSON-LD ei jasenny: ${e.message}`); continue; }
      const kaikki = [];
      const kay = (o) => { if (Array.isArray(o)) o.forEach(kay); else if (o && typeof o === "object") { if (o["@type"]) kaikki.push(o); Object.values(o).forEach(kay); } };
      kay(j);
      for (const o of kaikki) {
        ldTyypit.push(o["@type"]);
        for (const [k, v] of Object.entries(o)) {
          if (v === "" || v === null || (typeof v === "string" && /\[(HINTA|X)\]|undefined|NaN/.test(v))) ongelmat.push(`JSON-LD ${o["@type"]}.${k} = ${JSON.stringify(v)}`);
          if (typeof v === "string" && /^https?:\/\//.test(v) && /localhost/.test(v)) ongelmat.push(`JSON-LD ${o["@type"]}.${k} localhost: ${v}`);
        }
        if (o["@type"] === "FAQPage") {
          const ldK = (o.mainEntity || []).map((q) => q.name.trim().replace(/\s+/g, " "));
          const puuttuvatSivulta = ldK.filter((q) => !d.kysymykset.includes(q));
          const puuttuvatLd = d.kysymykset.filter((q) => !ldK.includes(q));
          if (puuttuvatSivulta.length) ongelmat.push(`FAQPage-kysymyksia joita ei nay sivulla: ${JSON.stringify(puuttuvatSivulta)}`);
          if (puuttuvatLd.length) ongelmat.push(`sivun UKK-kysymyksia joita ei ole FAQPagessa: ${JSON.stringify(puuttuvatLd)}`);
          for (const q of o.mainEntity || []) if (!q.acceptedAnswer?.text) ongelmat.push(`FAQPage vastaus puuttuu: ${q.name}`);
        }
      }
    }
    /* ensimmaisen palvelinvastauksen HTML: title ja canonical jo ennen skripteja */
    if (!/<title>[^<]+<\/title>/.test(raaka)) ongelmat.push("title puuttuu palvelimen HTML:sta");
    tulos.reitit[r] = { title: d.title, description: d.description, canonical: d.canonical, og: d.og, h1: d.h1, ldTyypit, kysymyksia: d.kysymykset.length, ongelmat };
    console.log(`${r}: "${d.title}" | h1 ${d.h1.length} | LD ${ldTyypit.join(",")} | UKK ${d.kysymykset.length} | ongelmia ${ongelmat.length}`);
    for (const o of ongelmat) console.log("   ", o);
  }
  for (const [k, polku] of [["robots", "/robots.txt"], ["sitemap", "/sitemap.xml"]]) {
    const res = await fetch(POHJA + polku);
    const teksti = await res.text();
    tulos[k] = { status: res.status, tyyppi: res.headers.get("content-type"), pituus: teksti.length, alku: teksti.slice(0, 400) };
    if (k === "sitemap") tulos[k].urlit = [...teksti.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    console.log(polku, res.status, res.headers.get("content-type"), k === "sitemap" ? tulos[k].urlit.length + " url" : teksti.replace(/\n/g, " | "));
  }
  await ctx.close();
} finally {
  await browser.close().catch(() => {});
  sammutaPalvelin(palvelin);
  if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(tulos, null, 1));
}
