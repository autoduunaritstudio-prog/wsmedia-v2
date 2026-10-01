/* PEITON TUNNISTUS PINOTUSSA VIERITYKSESSA.

   Sivun osiot ovat pinnattuja (sticky) ja seuraava vaihe nousee niiden
   PAALLE. IntersectionObserver ei tieda peitosta: pinnattu elementti on
   geometrisesti nakymassa koko sen ajan kun sen paalla on toinen osio.
   Siksi referenssikorttien videot jatkoivat toistoa sivun loppuun asti
   jonkin toisen osion alla. MITATTU 30.9.2026 1440x900: viisi
   piilossa soivaa videota lukitsi vierityksen 30 fps:iin.

   Tarkistus on osumatesti kahdessa pisteessa elementin sisalla: jos
   kummassakin pisteessa paallimmainen elementti on jokin muu kuin tama
   elementti tai sen esivanhempi, elementti on peitossa. Esivanhempi
   hyvaksytaan, koska pointer-events: none -lapsen kohdalla osuma menee
   sen alla olevalle vanhemmalle.

   Testi ajetaan vierityksen aikana korkeintaan kerran 150 ms:ssa ja
   aina vierityksen paatyttya, eli se ei ole kehyskohtaista tyota. */
/* KEVENNYS 1.10.2026: yksi yhteinen ajastin ja vierityskuuntelija
   kaikille seurattaville (ennen jokaisella oma), nelja osumapistetta
   kuuden sijaan, ja tieto siita onko osuma kiintean kerroksen sisalla
   muistetaan elementtikohtaisesti. Ennen jokainen piste kavi
   esivanhempiensa getComputedStyle-ketjun lapi joka kerta. */
const kiinteaMuisti = new WeakMap<Element, boolean>();
function onKiintea(osuma: Element): boolean {
  const m = kiinteaMuisti.get(osuma);
  if (m !== undefined) return m;
  let tulos = false;
  for (let a: Element | null = osuma; a && a !== document.body; a = a.parentElement) {
    const am = kiinteaMuisti.get(a);
    if (am !== undefined) {
      tulos = am;
      break;
    }
    if (getComputedStyle(a).position === "fixed") {
      tulos = true;
      break;
    }
  }
  kiinteaMuisti.set(osuma, tulos);
  return tulos;
}

type Seurattava = { el: HTMLElement; cb: (peitossa: boolean) => void; tila: boolean | null };
const seurattavat = new Set<Seurattava>();
let ajastin = 0;
let viimeksi = 0;
let kuuntelee = false;

function tarkista(s: Seurattava, vw: number, vh: number) {
  const r = s.el.getBoundingClientRect();
  if (r.bottom <= 0 || r.top >= vh || r.width === 0) return;
  // Pisteet elementin NAKYVALTA osalta: korkea osio voi alkaa nakyman
  // ylapuolelta, jolloin sen oma keskikohta on ruudun ulkopuolella.
  const x0 = Math.max(r.left, 0);
  const x1 = Math.min(r.right, vw);
  const y0 = Math.max(r.top, 0);
  const y1 = Math.min(r.bottom, vh);
  let laskettu = 0;
  let peitettyja = 0;
  for (const fx of [0.3, 0.7]) {
    for (const fy of [0.35, 0.65]) {
      const x = Math.min(Math.max(x0 + (x1 - x0) * fx, 1), vw - 1);
      const y = Math.min(Math.max(y0 + (y1 - y0) * fy, 1), vh - 1);
      const osuma = document.elementFromPoint(x, y);
      if (!osuma) continue;
      // Kiintea kerros (valikko, alapalkki, evasteilmoitus) kulkee
      // kaiken paalla koko sivun ajan. Sen alle osunutta pistetta ei
      // lasketa kumpaankaan suuntaan.
      if (onKiintea(osuma)) continue;
      laskettu++;
      if (!s.el.contains(osuma) && !osuma.contains(s.el)) peitettyja++;
    }
  }
  const peitetty = laskettu > 0 && peitettyja === laskettu;
  if (peitetty !== s.tila) {
    s.tila = peitetty;
    s.cb(peitetty);
  }
}

function tarkistaKaikki() {
  ajastin = 0;
  viimeksi = performance.now();
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  for (const s of seurattavat) tarkista(s, vw, vh);
}

function ajasta() {
  if (ajastin) return;
  const odota = Math.max(0, 150 - (performance.now() - viimeksi));
  ajastin = window.setTimeout(tarkistaKaikki, odota);
}

export function seuraaPeittoa(el: HTMLElement, cb: (peitossa: boolean) => void): () => void {
  const s: Seurattava = { el, cb, tila: null };
  seurattavat.add(s);
  if (!kuuntelee) {
    kuuntelee = true;
    window.addEventListener("scroll", ajasta, { passive: true });
    window.addEventListener("resize", ajasta, { passive: true });
  }
  ajasta();
  return () => {
    seurattavat.delete(s);
    if (seurattavat.size === 0 && kuuntelee) {
      kuuntelee = false;
      window.removeEventListener("scroll", ajasta);
      window.removeEventListener("resize", ajasta);
      if (ajastin) clearTimeout(ajastin);
      ajastin = 0;
    }
  };
}
