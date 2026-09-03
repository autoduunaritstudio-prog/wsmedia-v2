/**
 * rv-verify.mjs — reveal-jarjestelman hyvaksyntaajo.
 *
 * Ajo (tuotantobuild kaynnissa portissa 3111):
 *   node rv-verify.mjs [--headed] [--n=20] [--url=...]
 *
 * Ajaa kaikki vaaditut kokeet ja tulostaa yhteenvedon. Uudelleenajettava
 * samoilla parametreilla, joten ennen/jalkeen on vertailukelpoinen.
 */
const PW = process.env.PW_ROOT || new URL("../node_modules/playwright/index.mjs", import.meta.url).href;
const { chromium } = await import(PW);

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
// CLAUDE.md: oletus on headless. Nakyva ikkuna vain kun kayttaja on
// pyytanyt nakevansa ajon, ja silloin ruudun ulkopuolelle niin ettei se
// varasta fokusta. Kolme viimeista lippua estavat taustaikkunan
// ajastin- ja rAF-hidastuksen, jonka kanssa mittaus olisi roskaa.
const HEADED = process.argv.includes("--headed");
const launchOpts = HEADED
  ? {
      headless: false,
      args: [
        "--window-position=-2400,0",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
      ],
    }
  : { headless: true };
const N = +arg("n", 20);
const TARGET = arg("url", "http://localhost:3111/");

const state = () => ({
  ready: document.documentElement.classList.contains("rv-ready"),
  rv: document.querySelectorAll(".rv").length,
  on: document.querySelectorAll(".rv.on").length,
  // Aidosti piilossa, EI kesken siirtyman: .rv-siirtyma kestaa satoja
  // ms, joten 0,99 laskisi animoituvat mukaan ja tekisi testista flakyn.
  hidden: [...document.querySelectorAll(".rv")].filter((e) => +getComputedStyle(e).opacity < 0.05).length,
});

const browser = await chromium.launch(launchOpts);
let fails = 0;
const ok = (c, msg) => { if (!c) fails++; console.log(`  ${c ? "OK  " : "FAIL"}  ${msg}`); };

// try/finally: selain suljetaan MYOS virhetilanteessa, jottei prosesseja
// jaa pyorimaan.
try {

// ---------- 1. N kylmaa latausta, tilannekuvat 2 / 5 / 10 s ----------
console.log(`\n== 1. ${N} kylmaa latausta (1254x783, dpr 2) ==`);
{
  const rows = [];
  for (let i = 0; i < N; i++) {
    const c = await browser.newContext({ viewport: { width: 1254, height: 783 }, deviceScaleFactor: 2 });
    const p = await c.newPage();
    await p.goto(TARGET, { waitUntil: "commit" });
    const r = {};
    for (const t of [2000, 5000, 10000]) {
      await p.waitForTimeout(t - (r.last ?? 0)); r.last = t;
      r[t] = await p.evaluate(state);
    }
    rows.push(r);
    await c.close();
  }
  for (const t of [2000, 5000, 10000]) {
    const ready = rows.filter((r) => r[t].ready).length;
    const on = rows.map((r) => r[t].on);
    const hid = rows.map((r) => r[t].hidden);
    console.log(`  ${t / 1000} s: rv-ready ${ready}/${N}   .on min/max ${Math.min(...on)}/${Math.max(...on)}   piilossa min/max ${Math.min(...hid)}/${Math.max(...hid)}`);
    ok(ready === N, `${t / 1000} s: rv-ready paalla kaikissa ${N} latauksessa`);
  }
}

// ---------- 2. scrollaus lapi ja takaisin ----------
console.log("\n== 2. Scrollaus lapi koko sivun ja takaisin ==");
{
  const c = await browser.newContext({ viewport: { width: 1254, height: 783 }, deviceScaleFactor: 2 });
  const p = await c.newPage();
  await p.goto(TARGET, { waitUntil: "commit" });
  await p.waitForTimeout(2500);
  const h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(70); }
  await p.waitForTimeout(1500);
  const down = await p.evaluate(state);
  for (let y = h; y >= 0; y -= 600) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(50); }
  await p.waitForTimeout(700);
  const up = await p.evaluate(state);
  console.log(`  alas: .on ${down.on}/${down.rv}, piilossa ${down.hidden}   ylos: .on ${up.on}/${up.rv}, piilossa ${up.hidden}`);
  ok(down.on === down.rv, `kaikki ${down.rv} .rv-elementtia paljastui`);
  ok(up.hidden === 0, "mikaan ei jaanyt piiloon takaisin ylos scrollatessa");
  await c.close();
}

// ---------- 3. 15 s ilman scrollausta ----------
console.log("\n== 3. 15 s ilman scrollausta ==");
{
  const c = await browser.newContext({ viewport: { width: 1254, height: 783 }, deviceScaleFactor: 2 });
  const p = await c.newPage();
  await p.goto(TARGET, { waitUntil: "commit" });
  await p.waitForTimeout(15000);
  const s = await p.evaluate(state);
  console.log(`  15 s: rv-ready ${s.ready}, .on ${s.on}/${s.rv}, piilossa ${s.hidden}`);
  ok(s.ready, "rv-ready yha paalla 15 s jalkeen (varaventtiili ei lauennut)");
  await p.evaluate(() => scrollTo(0, 2145)); await p.waitForTimeout(800);
  const a = await p.evaluate(state);
  console.log(`  scrollaus 15 s jalkeen: .on ${a.on}/${a.rv}`);
  ok(a.on > 0, "reveal elaa yha 15 s jalkeen: scrollaus paljastaa");
  await c.close();
}

// ---------- 4. havainnoija ei toimita ----------
console.log("\n== 4. Havainnoija ei toimita (taustavalilehden ja rikkinaisen IO:n tapaus) ==");
{
  // Chromium ei automaatiossa raportoi taustavalilehtea hidden-tilaan,
  // joten piilotettua dokumenttia ei voi jaljitella luotettavasti.
  // Testataan sen sijaan SE OMINAISUUS jota piilotettu valilehti
  // koettelee, ja ankarammin: IntersectionObserver korvataan tynkalla
  // joka ei toimita KOSKAAN. Se on tiukempi kuin piilotettu valilehti,
  // jossa toimitus vain viivastyy nakyviin vaihtoon asti.
  const c = await browser.newContext({ viewport: { width: 1254, height: 783 }, deviceScaleFactor: 2 });
  const p = await c.newPage();
  await p.addInitScript(() => {
    window.IntersectionObserver = class {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return []; }
    };
  });
  await p.goto(TARGET, { waitUntil: "commit" });
  await p.waitForTimeout(3000);
  const before = await p.evaluate(state);
  console.log(`  3 s (ennen varaventtiilia): rv-ready ${before.ready}, piilossa ${before.hidden}/${before.rv}`);
  await p.waitForTimeout(7000);
  const after = await p.evaluate(state);
  console.log(`  10 s (varaventtiilin jalkeen): rv-ready ${after.ready}, piilossa ${after.hidden}/${after.rv}`);
  ok(after.ready === false, "varaventtiili laukesi kun havainnoija ei toimita");
  ok(after.hidden === 0, "FAIL-VISIBLE: kaikki sisalto nakyvissa vaikka havainnoija on kuollut");
  const sh = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < sh; y += 500) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(50); }
  await p.waitForTimeout(500);
  const end = await p.evaluate(state);
  ok(end.hidden === 0, "tyhjaa sivua ei synny missaan kohtaa scrollausta");
  await c.close();
}

// ---------- 5. prefers-reduced-motion ----------
console.log("\n== 5. prefers-reduced-motion ==");
{
  const c = await browser.newContext({ viewport: { width: 1254, height: 783 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const p = await c.newPage();
  await p.goto(TARGET, { waitUntil: "commit" });
  await p.waitForTimeout(3000);
  const s = await p.evaluate(state);
  const anim = await p.evaluate(() => [...document.querySelectorAll(".rv")].filter((e) => getComputedStyle(e).animationName !== "none").length);
  console.log(`  rv-ready ${s.ready}, .on ${s.on}/${s.rv}, piilossa ${s.hidden}, animaatioita ${anim}`);
  ok(s.hidden === 0, "reduced-motion: yksikaan .rv ei ole piilossa (ei alkutilaan jaamista)");
  await c.close();
}

// ---------- 6. nayttokorkeudet ----------
console.log("\n== 6. Nayttokorkeudet 600 / 783 / 900 / 1080 ==");
for (const h of [600, 783, 900, 1080]) {
  const c = await browser.newContext({ viewport: { width: 1254, height: h }, deviceScaleFactor: 2 });
  const p = await c.newPage();
  await p.goto(TARGET, { waitUntil: "commit" });
  await p.waitForTimeout(3000);
  const s = await p.evaluate(state);
  const sh = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < sh; y += 400) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(60); }
  await p.waitForTimeout(600);
  const e = await p.evaluate(state);
  console.log(`  h=${h}: 3 s rv-ready ${s.ready} .on ${s.on}/${s.rv}  ->  scrollauksen jalkeen .on ${e.on}/${e.rv}, piilossa ${e.hidden}`);
  ok(s.ready, `h=${h}: rv-ready paalla 3 s kohdalla`);
  ok(e.hidden === 0, `h=${h}: mikaan ei jaanyt piiloon`);
  await c.close();
}

} finally {
  await browser.close().catch(() => {});
}

console.log(`\n${fails === 0 ? "KAIKKI LApAISI" : `${fails} EPAONNISTUNUTTA TARKISTUSTA`}`);
process.exit(fails === 0 ? 0 : 1);
