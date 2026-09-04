/**
 * _browser.mjs — yhteinen selaimen kaynnistys mittausskripteille.
 *
 * KAKSI ASIAA, JOTKA OLIVAT AIEMMIN VAARIN:
 *
 * 1. HEADLESS SAA OIKEAN GPU:N. Playwrightin oletus-headless on
 *    "chromium headless shell", joka rasteroi SwiftShaderilla
 *    (ohjelmisto). Se on syy siihen miksi headless-mittaukset olivat
 *    roskaa ja miksi --headed oli pakko. GPU-lipuilla sama headless
 *    kayttaa Metal-ajuria. Mitattu tallä koneella:
 *      headless oletus            SwiftShader
 *      headless + GPU-liput       Apple M1 Pro, Metal
 *      channel:chromium headless  Apple M1 Pro, Metal
 *      headed                     Apple M1 Pro, Metal
 *    Nakyvaa ikkunaa ei siis tarvita mihinkaan mittaukseen.
 *
 * 2. YKSI KAYNNISTYS PER TEHTAVA. macOS aktivoi sovelluksen sen
 *    kaynnistyessa, joten --window-position ei estanyt ikkunaa
 *    tulemasta eteen. Variantit ja toistot ajetaan saman instanssin
 *    sisalla omina konteksteinaan, ei omina selaimina.
 */
import { existsSync } from "node:fs";

const PW = process.env.PW_ROOT || new URL("../node_modules/playwright/index.mjs", import.meta.url).href;
export const pw = await import(PW);

/** WebKit ei tue naita; ne annetaan vain Chromiumille. */
const GPU_ARGS = ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"];

export function launchOptions(engine = "chromium", headed = false) {
  if (engine !== "chromium") return headed ? { headless: false } : { headless: true };
  if (!headed) return { headless: true, args: GPU_ARGS };
  // Nakyva ikkuna vain pyynnosta: ruudun ulkopuolelle ja ilman
  // taustathrottlausta, jottei mittaus vaaristy jos se jaa taakse.
  return {
    headless: false,
    args: [...GPU_ARGS, "--window-position=-2400,0", "--disable-background-timer-throttling",
           "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding"],
  };
}

/** Selainbinaari ei tule npm ci:n mukana; kaadutaan selkeaan virheeseen. */
export function requireBrowser(engine = "chromium") {
  const b = pw[engine];
  if (!b) { console.error(`Tuntematon moottori: ${engine}`); process.exit(1); }
  let exe = null;
  try { exe = b.executablePath(); } catch { /* ei asennettu */ }
  if (!exe || !existsSync(exe)) {
    console.error(`\n${engine}-binaaria ei loydy. Playwright-paketti on asennettu, selain ei.\n\nAja:\n  npx playwright install ${engine}\n`);
    process.exit(1);
  }
  return b;
}

/** Varmistaa etta renderoija on oikea GPU eika ohjelmistorasteroija. */
export async function rendererOf(browser) {
  const c = await browser.newContext();
  try {
    const p = await c.newPage();
    await p.goto("about:blank");
    return await p.evaluate(() => {
      const cv = document.createElement("canvas");
      const g = cv.getContext("webgl2") || cv.getContext("webgl");
      if (!g) return "ei WebGL";
      const d = g.getExtension("WEBGL_debug_renderer_info");
      return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER);
    });
  } finally { await c.close().catch(() => {}); }
}
