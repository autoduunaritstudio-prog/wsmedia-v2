/**
 * refs-poster-verify.mjs — Referenssit-korttien poster/video-kattelyn
 * hyvaksyntaajo.
 *
 * Ajo (tuotantobuild kaynnissa portissa 3111):
 *   node scripts/refs-poster-verify.mjs [--headed] [--url=...]
 *
 * MITA TAMA TODISTAA. Poster piilotettiin aiemmin 'playing'-tapahtumassa,
 * joka laukeaa ENNEN kuin selain on esittanyt ensimmaisen videoruudun.
 * Referenssit-coverin tummalla pohjalla se nakyi valahduksena. Korjaus
 * sitoo piilotuksen requestVideoFrameCallbackiin.
 *
 * Mittaus ei katso kuvan jaannosta lainkaan: videon oma liike tuottaa
 * samanlaisia piikkeja kuin valahdys, joten jaannos ei erota niita.
 * Sen sijaan kirjataan TAPAHTUMAJARJESTYS - playing, ensimmainen esitetty
 * ruutu, posterin luokkamutaatio, pause ja kelaus alkuun - ja tarkistetaan
 * etta piilotus tulee aina ruudun jalkeen eika koskaan pausen jalkeen.
 *
 * Mittarin oma rVFC rekisteroidaan ENNEN sovelluksen omaa: instrumentointi
 * kiinnittyy jasennysvaiheessa (video-solmun ilmestyessa), sovellus vasta
 * hydraatiossa. Siksi 'frame' kirjautuu aina ennen sovelluksen
 * paljastusta, ja jarjestysvaate on aito eika mittausartefakti.
 */
const { launchOptions, requireBrowser, rendererOf } = await import(new URL("./_browser.mjs", import.meta.url).href);

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const HEADED = process.argv.includes("--headed");
const TARGET = arg("url", "http://localhost:3111/");

/** Kirjaa tapahtumat sivun sisalla. Ajetaan ennen sovelluksen koodia. */
const INSTRUMENT = () => {
  window.__vlog = [];
  const seen = new WeakSet();
  const push = (o) => window.__vlog.push({ t: performance.now(), ...o });

  const attach = (v) => {
    if (seen.has(v) || !v.className.match(/refcard-vid|event-vid/)) return;
    seen.add(v);
    const id = (v.querySelector("source")?.getAttribute("src") || v.className).split("/").pop();
    const rec = (type, extra) => push({ id, type, ct: +v.currentTime.toFixed(3), paused: v.paused, rs: v.readyState, ...extra });

    v.addEventListener("playing", () => {
      rec("playing");
      // Mittarin oma kuittaus: milloin selain TODELLA esitti ruudun.
      v.requestVideoFrameCallback?.((_now, md) => rec("frame", { presented: md.presentedFrames }));
    });
    v.addEventListener("pause", () => {
      rec("pause");
      // Kelaus alkuun on viivastetty; kirjataan milloin se tapahtuu.
      const t0 = performance.now();
      const poll = () => {
        if (v.currentTime === 0) { rec("rewind", { dt: +(performance.now() - t0).toFixed(1) }); return; }
        if (performance.now() - t0 > 2000 || !v.paused) return;
        requestAnimationFrame(poll);
      };
      requestAnimationFrame(poll);
    });

    const poster = v.parentElement?.querySelector(".refcard-poster, .event-poster");
    if (poster) {
      new MutationObserver(() => {
        const hidden = poster.classList.contains("is-hidden");
        rec(hidden ? "poster-hide" : "poster-show", { op: getComputedStyle(poster).opacity });
      }).observe(poster, { attributes: true, attributeFilter: ["class"] });
    }
  };

  const scan = () => document.querySelectorAll("video").forEach(attach);
  const start = () => {
    scan();
    new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  };
  if (document.documentElement) start();
  else document.addEventListener("readystatechange", start, { once: true });
};

/**
 * Kortit nakyman sisalla. Tama on ainoa luotettava tapa loytaa oikea
 * scrollY: #referenssit on sticky ja sen offsetParent on positioitu
 * .refzone, joten offsetTop ei ole dokumenttikoordinaatti eika osion
 * sisalto ole nakyvissa siina kohdassa.
 */
const inView = () => [...document.querySelectorAll(".refcard, .event")].filter((e) => {
  const r = e.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight && r.height > 0;
}).length;

const goto = async (p, y, step = 300, pause = 60) => {
  const from = await p.evaluate(() => scrollY);
  const dir = y > from ? 1 : -1;
  for (let cur = from; dir > 0 ? cur < y : cur > y; cur += dir * step) {
    await p.evaluate((v) => window.scrollTo(0, v), cur);
    await p.waitForTimeout(pause);
  }
  await p.evaluate((v) => window.scrollTo(0, v), y);
  await p.waitForTimeout(pause);
};

/** Vierittaa alaspain kunnes referenssikortit ovat nakymassa. */
async function scrollToCards(p, want = 3) {
  const max = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < max; y += 300) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(60);
    const n = await p.evaluate(inView);
    if (n >= want) return { y, n };
  }
  return { y: -1, n: 0 };
}

const browser = await requireBrowser("chromium").launch(launchOptions("chromium", HEADED));
let fails = 0;
const ok = (c, msg) => { if (!c) fails++; console.log(`  ${c ? "OK  " : "FAIL"}  ${msg}`); };

/** Yksi lapiajo: alas Referensseihin, siella hetki, takaisin ylos. */
async function run(label, viewport, opts = {}) {
  const c = await browser.newContext({ viewport, deviceScaleFactor: 2, ...opts });
  const p = await c.newPage();
  await p.addInitScript(INSTRUMENT);
  await p.goto(TARGET, { waitUntil: "commit" });
  await p.waitForTimeout(2500);

  // Alas kunnes kortit ovat nakymassa, siella 3 s (toisto kaynnistyy ja
  // poster piiloutuu), sitten pois nakymasta ja takaisin ylos - jolloin
  // pausen, posterin palautuksen ja kelauksen jarjestys kirjautuu.
  const hit = await scrollToCards(p);
  await p.waitForTimeout(3000);
  const seenCards = await p.evaluate(inView);
  const down = await p.evaluate(() => window.__vlog.slice());
  await goto(p, hit.y + 2500, 300, 50);
  await p.waitForTimeout(1200);
  await goto(p, 0, 500, 40);
  await p.waitForTimeout(1500);
  const all = await p.evaluate(() => window.__vlog.slice());
  await c.close();
  return { label, hit, seenCards, down, all };
}

try {
  console.log(`\nrenderoija: ${await rendererOf(browser)}`);

  for (const [label, viewport] of [
    ["tyopoyta 1728x992", { width: 1728, height: 992 }],
    ["kapea 900x900 (<980px, perspective: none)", { width: 900, height: 900 }],
  ]) {
    const r = await run(label, viewport);
    console.log(`\n== ${label} ==`);
    console.log(`  kortit nakymassa kohdassa scrollY=${r.hit.y}: ${r.seenCards}`);
    ok(r.seenCards > 0, "ajo paasi Referenssit-osioon");

    const ids = [...new Set(r.all.filter((e) => e.type === "playing").map((e) => e.id))];
    ok(ids.length > 0, `videoita kaynnistyi (${ids.length})`);

    for (const id of ids) {
      const ev = r.all.filter((e) => e.id === id);
      const line = ev.map((e) => e.type).join(" > ");
      const firstPlaying = ev.find((e) => e.type === "playing");
      const firstFrame = ev.find((e) => e.type === "frame");
      const firstHide = ev.find((e) => e.type === "poster-hide");
      const lead = firstFrame && firstPlaying ? (firstFrame.t - firstPlaying.t).toFixed(1) : "-";
      console.log(`  ${id}\n    ${line}\n    playing -> ruutu ${lead} ms, ruutu -> poster piiloon ${firstHide && firstFrame ? (firstHide.t - firstFrame.t).toFixed(1) : "-"} ms`);

      ok(!!firstFrame, `${id}: selain esitti ruudun`);
      ok(!!firstHide, `${id}: poster piilotettiin`);
      if (firstFrame && firstHide) ok(firstHide.t >= firstFrame.t, `${id}: poster piiloon VASTA ensimmaisen ruudun jalkeen`);

      // Piilotus ei saa tapahtua pysaytetylla videolla: se olisi juuri se
      // vanhentunut kuittaus jonka gen-numero mitatoi.
      const hideWhilePaused = ev.filter((e) => e.type === "poster-hide" && e.paused);
      ok(hideWhilePaused.length === 0, `${id}: poster ei piiloudu pysaytettyna (${hideWhilePaused.length} osumaa)`);

      // Poster ei palaa kesken toiston: jokaista poster-show'ta ennen on
      // oltava pause.
      const shows = ev.filter((e) => e.type === "poster-show");
      const midPlay = shows.filter((s) => {
        const prev = ev.filter((e) => e.t <= s.t && (e.type === "pause" || e.type === "playing")).pop();
        return prev?.type === "playing";
      });
      ok(midPlay.length === 0, `${id}: poster ei palaa kesken toiston (${midPlay.length} osumaa)`);

      // Kelaus alkuun vasta kun poster on jo peittava.
      for (const rw of ev.filter((e) => e.type === "rewind")) {
        const show = ev.filter((e) => e.type === "poster-show" && e.t <= rw.t).pop();
        ok(!!show, `${id}: poster palasi ennen kelausta`);
        ok(rw.dt >= 180, `${id}: kelaus alkuun ${rw.dt} ms pausen jalkeen (>= 180)`);
      }
    }
  }

  // ---------- vanhentunut kuittaus: pause heti playingin jalkeen ----------
  console.log("\n== Vanhentunut ruutukuittaus: pause valittomasti playingin jalkeen ==");
  {
    const c = await browser.newContext({ viewport: { width: 1728, height: 992 }, deviceScaleFactor: 2 });
    const p = await c.newPage();
    await p.addInitScript(INSTRUMENT);
    await p.goto(TARGET, { waitUntil: "commit" });
    await p.waitForTimeout(2500);
    // Kuuntelija kiinnitetaan HYDRAATION JALKEEN, joten se ajetaan
    // sovelluksen oman kasittelijan JALKEEN: sovellus on siis jo
    // rekisteroinut rVFC:n kun pause() kutsutaan. Juuri tama jarjestys
    // synnyttaa vanhentuneen kuittauksen.
    // Kaikki instrumentoidut videot, myos aftermovie: jos vain kortit
    // pysaytetaan, aftermoviesta tulee aito poster-hide ja koko
    // "ei yhtaan piilotusta" -vaate menettaa merkityksensa.
    await p.evaluate(() => {
      document.querySelectorAll("video.refcard-vid, video.event-vid").forEach((v) => {
        v.addEventListener("playing", () => v.pause());
      });
    });
    const hit = await scrollToCards(p);
    await p.waitForTimeout(2500);
    console.log(`  kortit nakymassa kohdassa scrollY=${hit.y}: ${hit.n}`);
    ok(hit.n >= 3, "ajo paasi Referenssit-osioon");
    const started = await p.evaluate(() => new Set(window.__vlog.filter((e) => e.type === "playing").map((e) => e.id)).size);
    console.log(`  videoita joilla 'playing' ehti lauetat: ${started}`);
    ok(started > 0, "koe ei ole tyhja: playing laukesi ja rVFC oli aseistettu");
    const st = await p.evaluate(() => [...document.querySelectorAll(".refcard-poster, .event-poster")].map((img) => ({
      hidden: img.classList.contains("is-hidden"),
      op: getComputedStyle(img).opacity,
      paused: img.parentElement.querySelector("video").paused,
    })));
    const log = await p.evaluate(() => window.__vlog.filter((e) => e.type === "poster-hide"));
    console.log(`  kortit: ${st.map((s) => `${s.paused ? "paused" : "playing"}/${s.hidden ? "piilossa" : "nakyvissa"} op=${s.op}`).join("  ")}`);
    ok(st.every((s) => s.hidden === false), "poster jai nakyviin kaikilla korteilla");
    ok(st.every((s) => s.op === "1"), "posterin laskettu opacity on 1 (ei kesken haipymista)");
    ok(log.length === 0, `poster-hide ei laueta lainkaan (${log.length} osumaa)`);
    await c.close();
  }

  // ---------- varapolku: rVFC poistettu ----------
  console.log("\n== Varapolku: requestVideoFrameCallback poistettu (Firefoxin tapaus) ==");
  {
    const c = await browser.newContext({ viewport: { width: 1728, height: 992 }, deviceScaleFactor: 2 });
    const p = await c.newPage();
    // Poisto ENNEN sovelluksen koodia, jotta ominaisuustunnistus menee
    // varapolulle. Mittarin oma 'frame'-kirjaus katoaa samalla - siksi
    // tassa kokeessa todiste on posterin piiloutumishetken currentTime:
    // nollaa suurempi aika tarkoittaa etta ruutuja on jo esitetty.
    await p.addInitScript(() => {
      delete HTMLVideoElement.prototype.requestVideoFrameCallback;
      delete HTMLVideoElement.prototype.cancelVideoFrameCallback;
    });
    await p.addInitScript(INSTRUMENT);
    await p.goto(TARGET, { waitUntil: "commit" });
    await p.waitForTimeout(2500);
    // Kehysvali mitataan samasta kontekstista: absoluuttinen ms-raja olisi
    // vaara mittatikku, koska headless GPU:lla kehysvali on tallä koneella
    // n. 8 ms eika 16,7 ms, jolloin kaksi rAF-rastia mahtuu ~10 ms:iin.
    const frame = await p.evaluate(() => new Promise((res) => {
      const d = []; let last = performance.now();
      const f = () => {
        const n = performance.now(); d.push(n - last); last = n;
        if (d.length < 40) requestAnimationFrame(f);
        else { d.sort((a, b) => a - b); res(+d[20].toFixed(2)); }
      };
      requestAnimationFrame(f);
    }));
    const hit = await scrollToCards(p);
    await p.waitForTimeout(3000);
    await goto(p, hit.y + 2500, 300, 50);
    await p.waitForTimeout(1200);
    const log = await p.evaluate(() => window.__vlog.slice());
    console.log(`  kortit nakymassa kohdassa scrollY=${hit.y}: ${hit.n}, kehysvalin mediaani ${frame} ms`);
    ok(hit.n >= 3, "ajo paasi Referenssit-osioon");
    ok(log.filter((e) => e.type === "frame").length === 0, "rVFC oli todella poissa (ei yhtaan 'frame'-kirjausta)");
    const ids = [...new Set(log.filter((e) => e.type === "playing").map((e) => e.id))];
    ok(ids.length > 0, `videoita kaynnistyi (${ids.length})`);
    for (const id of ids) {
      const ev = log.filter((e) => e.id === id);
      const pl = ev.find((e) => e.type === "playing");
      const hide = ev.find((e) => e.type === "poster-hide");
      console.log(`  ${id}: ${ev.map((e) => e.type).join(" > ")}   piiloon ${hide ? `${(hide.t - pl.t).toFixed(1)} ms / ct=${hide.ct}` : "-"}`);
      ok(!!hide, `${id}: varapolku piilotti posterin`);
      if (hide) {
        ok(hide.ct > 0, `${id}: aika oli edennyt (ct=${hide.ct}) kun poster piilotettiin`);
        ok(hide.rs >= 2, `${id}: readyState ${hide.rs} >= HAVE_CURRENT_DATA`);
        // Vahintaan yhden MAALATUN kehyksen verran: yksi rAF playingin
        // jalkeen ei todista esitettya ruutua, ks. Refs.tsx varapolku.
        ok(hide.t - pl.t >= frame, `${id}: piilotus ${(hide.t - pl.t).toFixed(1)} ms playingin jalkeen (>= kehysvali ${frame} ms)`);
        // Mediakello oli edennyt vahintaan kehysvalin verran: kuvaa on
        // siis todella toistettu eika vain aiottu.
        ok(hide.ct * 1000 >= frame, `${id}: mediakello edennyt ${(hide.ct * 1000).toFixed(1)} ms (>= kehysvali)`);
        ok(hide.t - pl.t < 600, `${id}: piilotus tapahtui takarajan sisalla (${(hide.t - pl.t).toFixed(1)} ms)`);
      }
      ok(ev.filter((e) => e.type === "poster-hide" && e.paused).length === 0, `${id}: poster ei piiloudu pysaytettyna`);
    }
    await c.close();
  }

  // ---------- reduced motion ----------
  console.log("\n== prefers-reduced-motion: mitaan ei kaynnisteta ==");
  {
    const c = await browser.newContext({ viewport: { width: 1728, height: 992 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
    const p = await c.newPage();
    await p.addInitScript(INSTRUMENT);
    await p.goto(TARGET, { waitUntil: "commit" });
    await p.waitForTimeout(2000);
    const hit = await scrollToCards(p);
    await p.waitForTimeout(2500);
    const log = await p.evaluate(() => window.__vlog.slice());
    const hidden = await p.evaluate(() => [...document.querySelectorAll(".refcard-poster, .event-poster")].filter((e) => e.classList.contains("is-hidden")).length);
    console.log(`  kortit nakymassa kohdassa scrollY=${hit.y}: ${hit.n}`);
    console.log(`  tapahtumia ${log.length}, piilotettuja postereita ${hidden}`);
    ok(hit.n >= 3, "ajo paasi Referenssit-osioon");
    ok(log.filter((e) => e.type === "playing").length === 0, "yksikaan video ei kaynnistynyt");
    ok(hidden === 0, "yksikaan poster ei piiloutunut");
    await c.close();
  }

  // ---------- kosketuspolku: napautus, yksi kerrallaan ----------
  console.log("\n== Kosketuspolku: napautus kaynnistaa, toinen napautus pysayttaa ==");
  {
    const c = await browser.newContext({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    const p = await c.newPage();
    await p.addInitScript(INSTRUMENT);
    await p.goto(TARGET, { waitUntil: "commit" });
    await p.waitForTimeout(2500);
    const hit = await scrollToCards(p);
    await p.waitForTimeout(1200);
    console.log(`  kortit nakymassa kohdassa scrollY=${hit.y}: ${hit.n}`);
    ok(hit.n >= 3, "ajo paasi Referenssit-osioon");
    const idle = await p.evaluate(() => window.__vlog.filter((e) => e.type === "playing").length);
    ok(idle === 0, "kosketuspolulla mikaan ei kaynnisty itsestaan");

    const cards = p.locator(".refcard");
    await cards.nth(0).click();
    await p.waitForTimeout(1200);
    await cards.nth(1).click();
    await p.waitForTimeout(1200);
    const log = await p.evaluate(() => window.__vlog.slice());
    const byId = {};
    for (const e of log) (byId[e.id] ??= []).push(e.type);
    for (const [id, seq] of Object.entries(byId)) console.log(`  ${id}: ${seq.join(" > ")}`);
    const playingNow = await p.evaluate(() => [...document.querySelectorAll("video.refcard-vid")].filter((v) => !v.paused).length);
    console.log(`  soimassa napautusten jalkeen: ${playingNow}`);
    ok(playingNow === 1, "vain yksi video soi kerrallaan");
    const hideWhilePaused = log.filter((e) => e.type === "poster-hide" && e.paused);
    ok(hideWhilePaused.length === 0, "poster ei piiloudu pysaytettyna");
    for (const id of Object.keys(byId)) {
      const ev = log.filter((e) => e.id === id);
      const f = ev.find((e) => e.type === "frame");
      const h = ev.find((e) => e.type === "poster-hide");
      if (h) ok(!!f && h.t >= f.t, `${id}: poster piiloon vasta ruudun jalkeen`);
    }
    // Vartijan pysayttama kortti: poster palaa ja kelaus tulee vasta sen
    // jalkeen.
    const stopped = log.filter((e) => e.type === "rewind");
    for (const rw of stopped) ok(rw.dt >= 180, `${rw.id}: kelaus ${rw.dt} ms pausen jalkeen (>= 180)`);
    await c.close();
  }
} finally {
  await browser.close().catch(() => {});
}

console.log(`\n${fails === 0 ? "KAIKKI LAPAISI" : `${fails} EPAONNISTUNUTTA TARKISTUSTA`}`);
process.exit(fails === 0 ? 0 : 1);
