/**
 * safari-oikea.mjs — kehysmittaus OIKEALLA Safarilla (safaridriver / WebDriver).
 *
 * Playwrightin WebKit ei kayta Safarin video- ja kompositointipolkua, joten
 * videoihin liittyvat paatokset tarkistetaan tasta. Safaria ei voi ajaa
 * piilossa: mittauksen ajan ruudulla on Safari-ikkuna.
 *
 * Edellyttaa: Safari > Asetukset > Kehittaja > "Salli etaautomaatio".
 *
 * Vieritys tehdaan sivun sisalla synteettisilla wheel-tapahtumilla, joita
 * Lenis kasittelee kuten oikeita (se vierittaa itse). Mittari on sama kuin
 * safari-piste.mjs:ssa: kiinteassa kohdassa +-100 px edestakaisin ~1,5 s,
 * kehysvalit rAF:lla.
 *
 *   node scripts/safari-oikea.mjs --url=http://localhost:3111/ --pos=4300,4800,5200
 *        [--runs=3] [--variant=base|eikopiota|natiivi] [--port=4444]
 */
import { spawn } from "node:child_process";

const arg = (k, d) => { const m = process.argv.find((a) => a.startsWith(`--${k}=`)); return m ? m.slice(k.length + 3) : d; };
const URL_ = arg("url", "http://localhost:3111/");
const POS = arg("pos", "4300,4800,5200").split(",").map(Number);
const RUNS = +arg("runs", 3);
const VARIANTS = arg("variant", "base").split(",");
const PORT = +arg("port", 4444);
const MODE = arg("mode", "piste"); // piste | kartta (koko sivu alas, vyohykkeittain)
const ZONE = +arg("zone", 1000);
const CSS = arg("css", "");
const RANGE = arg("range", "");
const PASSES = +arg("passes", 1); // kartta: montako alasvieritysta samassa latauksessa (mitataan viimeinen) // esim. 6000-8000: KESKIOSA-mittari vain talta valilta // lisatyyli sivulle latauksen jalkeen (eristyskokeet)
const W = 1440, H = 900;

const VARIANT_JS = {
  base: "",
  // Videot soivat, mutta niita ei kopioida kortin kankaalle.
  eikopiota: `(() => { const o = CanvasRenderingContext2D.prototype.drawImage; CanvasRenderingContext2D.prototype.drawImage = function (s, ...a) { if (s instanceof HTMLVideoElement && this.canvas.classList.contains("refcard-kangas")) return; return o.call(this, s, ...a); }; })();`,
  // Natiivi <video> nakyviin, kangas piiloon (ei kopiota).
  natiivi: `(() => { const st = document.createElement("style"); st.textContent = ".refcard-kangas{visibility:hidden!important}.refcard-vid{opacity:1!important}"; document.head.appendChild(st); const o = CanvasRenderingContext2D.prototype.drawImage; CanvasRenderingContext2D.prototype.drawImage = function (s, ...a) { if (s instanceof HTMLVideoElement && this.canvas.classList.contains("refcard-kangas")) return; return o.call(this, s, ...a); }; })();`,
};

const base = `http://localhost:${PORT}`;
const wd = async (method, path, body) => {
  const r = await fetch(base + path, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json();
  if (j.value && j.value.error) throw new Error(`${path}: ${j.value.error} ${j.value.message}`);
  return j.value;
};

const driver = spawn("safaridriver", ["-p", String(PORT)], { stdio: "ignore" });
let sid = null;
try {
  for (let i = 0; i < 40; i++) { try { await fetch(base + "/status"); break; } catch { await new Promise((r) => setTimeout(r, 150)); } }
  sid = (await wd("POST", "/session", { capabilities: { alwaysMatch: { browserName: "safari" } } })).sessionId;
  const S = `/session/${sid}`;
  await wd("POST", `${S}/window/rect`, { x: 0, y: 0, width: W, height: H + 80 });
  await wd("POST", `${S}/timeouts`, { script: 60000 });
  // Sivunlatauksen jalkeen Safari voi hetken vastata "no such frame";
  // yritetaan uudelleen.
  const retry = async (fn) => { for (let i = 0; ; i++) { try { return await fn(); } catch (e) { if (i > 20 || !/no such frame|no such window/.test(String(e))) throw e; await new Promise((r) => setTimeout(r, 300)); } } };
  const exec = (script, args = []) => retry(() => wd("POST", `${S}/execute/sync`, { script, args }));
  const execAsync = (script, args = []) => retry(() => wd("POST", `${S}/execute/async`, { script, args }));

  const res = {};
  for (let r = 0; r < RUNS; r++) for (const v of VARIANTS) {
    await wd("POST", `${S}/url`, { url: URL_ });
    await exec(`localStorage.setItem("wsmedia.consent", JSON.stringify({ analytics: false, v: 1, ts: Date.now() }));`);
    await wd("POST", `${S}/url`, { url: URL_ });
    await execAsync(`const done = arguments[arguments.length - 1]; const t = Date.now(); (function w() { if (!document.documentElement.classList.contains("hero-locked") || Date.now() - t > 15000) done(); else setTimeout(w, 100); })();`);
    if (VARIANT_JS[v]) await exec(VARIANT_JS[v]);
    if (CSS) await exec(`const st = document.createElement("style"); st.textContent = arguments[0]; document.head.appendChild(st);`, [CSS]);
    await new Promise((r) => setTimeout(r, 1500));
    if (MODE === "kartta") {
      const out = await execAsync(`
        const done = arguments[arguments.length - 1];
        const wheel = (dy) => window.dispatchEvent(new WheelEvent("wheel", { deltaY: dy, deltaMode: 0, bubbles: true, cancelable: true, clientX: 720, clientY: 450 }));
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        (async () => {
          // JS-aika kehyksessa: kaaritaan rAF (silmukat rekisteroityvat joka kehys uudelleen).
          const oRaf = window.requestAnimationFrame.bind(window); let js = 0; const src = {};
          window.requestAnimationFrame = (cb) => { const st = (new Error().stack || "").split("\\n")[1] || "?"; const k = (st.match(/([^/]+\\.js:\\d+:\\d+)/) || [st])[0].slice(-40); return oRaf((t) => { const a = performance.now(); try { cb(t); } finally { const d = performance.now() - a; js += d; src[k] = (src[k] || 0) + d; } }); };
          const f = []; let last = 0, on = true;
          const tick = (t) => { if (!on) return; if (last) f.push([t - last, Math.round(scrollY), js]); js = 0; last = t; oRaf(tick); }; oRaf(tick);
          const passes = arguments[0];
          for (let ps = 0; ps < passes; ps++) {
            if (ps > 0) { for (let i = 0; i < 400 && scrollY > 5; i++) { wheel(-600); await sleep(16); } await sleep(1500); f.length = 0; last = 0; }
            let prev = -1, stuck = 0;
            for (let i = 0; i < 900 && stuck < 25; i++) { wheel(100); await sleep(16); const y = scrollY; stuck = y === prev ? stuck + 1 : 0; prev = y; }
          }
          on = false; window.requestAnimationFrame = oRaf; done({ f, src, docH: document.documentElement.scrollHeight });
        })();`, [PASSES]);
      (res[`${v}|kartta`] ||= []).push(out);
      continue;
    }
    for (const pos of POS) {
      const out = await execAsync(`
        const done = arguments[arguments.length - 1]; const pos = arguments[0];
        const wheel = (dy) => window.dispatchEvent(new WheelEvent("wheel", { deltaY: dy, deltaMode: 0, bubbles: true, cancelable: true, clientX: 720, clientY: 450 }));
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        (async () => {
          for (let i = 0; i < 400; i++) { const y = scrollY; if (Math.abs(y - pos) < 60) break; wheel(Math.sign(pos - y) * Math.min(300, Math.max(40, Math.abs(pos - y) / 3))); await sleep(60); }
          await sleep(1000);
          const y0 = Math.round(scrollY); const f = []; let last = 0, on = true;
          const tick = (t) => { if (!on) return; if (last) f.push(t - last); last = t; requestAnimationFrame(tick); }; requestAnimationFrame(tick);
          for (let i = 0; i < 90; i++) { wheel(i % 20 < 10 ? 100 : -100); await sleep(16); }
          on = false;
          const vids = [...document.querySelectorAll("video")].filter((x) => !x.paused).length;
          done({ f, y0, vids });
        })();`, [pos]);
      (res[`${v}|${pos}`] ||= []).push(out);
    }
  }
  console.log(`OIKEA SAFARI ${URL_} ${W}x${H} runs=${RUNS}${CSS ? " css=" + CSS : ""}`);
  if (MODE === "kartta") {
    for (const v of VARIANTS) {
      const rr = res[`${v}|kartta`]; const all = rr.flatMap((x) => x.f);
      const docH = rr[0].docH; const [r0, r1] = RANGE ? RANGE.split("-").map(Number) : [1500, docH - 2500]; const mid = all.filter((x) => x[1] > r0 && x[1] < r1);
      const md = mid.map((x) => x[0]).sort((a, b) => a - b), mj = mid.map((x) => x[2]).sort((a, b) => a - b);
      console.log(`  ${v}: KESKIOSA kehys med ${md[md.length >> 1]?.toFixed(0)} p90 ${md[Math.floor(md.length * .9)]?.toFixed(0)} ms, JS/kehys med ${mj[mj.length >> 1]?.toFixed(1)} p90 ${mj[Math.floor(mj.length * .9)]?.toFixed(1)} ms, n=${mid.length}`);
      const src = {}; for (const x of rr) for (const [k, d] of Object.entries(x.src)) src[k] = (src[k] || 0) + d;
      console.log("    rAF-JS lahteittain: " + Object.entries(src).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, d]) => `${k} ${d.toFixed(0)}ms`).join(" | "));
      console.log(`  ${v}: koko sivu >20ms ${(all.filter((x) => x[0] > 20).length / all.length * 100).toFixed(0)}% (ajot ${rr.map((x) => (x.f.filter((d) => d[0] > 20).length / x.f.length * 100).toFixed(0)).join("/")})`);
      const z = new Map(); for (const [dt, y] of all) { const k = Math.floor(y / ZONE) * ZONE; const o = z.get(k) || { n: 0, bad: 0, d: [] }; o.n++; o.d.push(dt); if (dt > 20) o.bad++; z.set(k, o); }
      for (const [k, o] of [...z].sort((a, b) => a[0] - b[0])) { const d = o.d.sort((a, b) => a - b); const q = (p) => d[Math.min(d.length - 1, Math.floor(d.length * p))].toFixed(0); console.log(`    y${String(k).padEnd(6)} ${String((o.bad / o.n * 100).toFixed(0)).padStart(3)}% ${"#".repeat(Math.round(o.bad / o.n * 20)).padEnd(20)} p10 ${q(.1)} med ${q(.5)} p90 ${q(.9)} ms  n=${o.n}`); }
    }
  }
  for (const v of (MODE === "kartta" ? [] : VARIANTS)) {
    const parts = POS.map((pos) => {
      const rr = res[`${v}|${pos}`]; const all = rr.flatMap((x) => x.f).sort((a, b) => a - b);
      const med = all[all.length >> 1], p95 = all[Math.floor(all.length * 0.95)];
      const per = rr.map((x) => (x.f.filter((d) => d > 20).length / x.f.length * 100).toFixed(0)).join("/");
      return `y${pos} med ${med.toFixed(1)} p95 ${p95.toFixed(1)} >20ms ${(all.filter((d) => d > 20).length / all.length * 100).toFixed(0)}% (${per}) videoita ${rr[0].vids}`;
    });
    console.log(`  ${v.padEnd(10)} ${parts.join("  |  ")}`);
  }
} finally {
  if (sid) await fetch(`${base}/session/${sid}`, { method: "DELETE" }).catch(() => {});
  driver.kill();
}
