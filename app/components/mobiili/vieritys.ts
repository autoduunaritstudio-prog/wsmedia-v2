/* MOBIILIN VIERITYSVAYLA (6.10.2026).

   Suunnitelmassa jokainen sivu laski vieritysarvot setStatella ja piirsi
   koko puun uudelleen joka kehys. Sivustolla arvot kirjoitetaan suoraan
   DOMiin: yksi passiivinen scroll-kuuntelija, yksi requestAnimationFrame
   per kehys, ja jokainen kuuntelija saa saman tilan. Reactin renderointia
   ei tapahdu vierityksen aikana.

   Jarjestys kehyksessa: ensin kaikki "lue"-vaiheet (getBoundingClientRect),
   sitten kaikki "kirjoita"-vaiheet. Nain mittaus ei pakota asettelua
   kesken kirjoitusten. */

export type Tila = {
  /** window.scrollY */
  y: number;
  /** Pehmennetty scrollY heroille (9.10.2026): seuraa y:ta aikavakiolla
      PEHMENNYS, joten sormen nykaykset ja elokuvaruutujen portaat
      tasoittuvat. Reduced motionissa ja suurissa hypyissa = y. Kaytetaan
      vain heron sisaisiin arvoihin; asettelu ja sticky seuraavat y:ta. */
  yp: number;
  /** Nakyman korkeus, 100svh pikseleina (ei muutu osoitepalkin mukana). */
  HV: number;
  /** Nakyman leveys. */
  W: number;
  /** Vieritetaanko ylos (y < edellinen). */
  ylos: boolean;
  /** Suunta kynnyksella 4 px: 1 alas, -1 ylos, 0 ei tiedossa. */
  suunta: number;
  reduce: boolean;
};

export type Kuuntelija = {
  lue?: (t: Tila) => void;
  kirjoita?: (t: Tila) => void;
};

export const MOBIILI = "(max-width: 767px)";
const kuuntelijat = new Set<Kuuntelija>();
let kaynnissa = false;
let raf = 0;
let edellinen = 0;
let suunta = 0;
let HV = 0;
let W = 0;
let mittari: HTMLDivElement | null = null;
let yp = 0;
let edAika = 0;
let napsauta = true;

/* Heron pehmennyksen aikavakio (s). 0,09 s: 95 % kiinni n. 0,27 s:ssa,
   samaa luokkaa kuin GSAP scrub 0,3. Kehysnopeudesta riippumaton. */
const PEHMENNYS = 0.09;

export const reduce = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
export const onMobiili = () => typeof matchMedia !== "undefined" && matchMedia(MOBIILI).matches;

/** 100svh pikseleina. Mitataan kerran ja uudelleen vain kun leveys
    muuttuu (kaanto), joten osoitepalkin piiloutuminen ei hypayta mitaan. */
function mittaa(pakota = false) {
  const w = window.innerWidth;
  if (!pakota && HV && w === W) return;
  if (!mittari) {
    mittari = document.createElement("div");
    mittari.setAttribute("aria-hidden", "true");
    mittari.style.cssText = "position:fixed;left:0;top:0;width:0;height:100svh;visibility:hidden;pointer-events:none";
    document.body.appendChild(mittari);
  }
  HV = mittari.offsetHeight || window.innerHeight;
  W = w;
}

function kehys(aika: number) {
  raf = 0;
  const y = window.scrollY;
  const ylos = y < edellinen;
  if (y > edellinen + 4) suunta = 1;
  else if (y < edellinen - 4) suunta = -1;
  const r = reduce();
  /* Hyppy (ankkuri, uudelleenlataus, vierityksen palautus) napsautetaan
     suoraan: yhden kehyksen siirtyma yli 0,6 nakymaa ei ole sormesta. */
  const dt = edAika ? Math.min(0.1, Math.max(0, (aika - edAika) / 1000)) : 0;
  edAika = aika;
  if (r || napsauta || Math.abs(y - edellinen) > 0.6 * (HV || 800)) yp = y;
  else yp += (y - yp) * (1 - Math.exp(-dt / PEHMENNYS));
  if (Math.abs(y - yp) < 0.3) yp = y;
  napsauta = false;
  const t: Tila = { y, yp, HV, W, ylos, suunta, reduce: r };
  kuuntelijat.forEach((k) => k.lue?.(t));
  kuuntelijat.forEach((k) => k.kirjoita?.(t));
  edellinen = y;
  /* Pehmennys kesken: jatketaan kehyksia kunnes yp saavuttaa y:n. */
  if (yp !== y) pyyda();
  else edAika = 0;
}

export function pyyda() {
  if (!raf && kaynnissa) raf = requestAnimationFrame(kehys);
}

const onResize = () => {
  mittaa();
  pyyda();
};

function kaynnista() {
  if (kaynnissa) return;
  kaynnissa = true;
  mittaa(true);
  edellinen = window.scrollY;
  yp = edellinen;
  edAika = 0;
  napsauta = true;
  window.addEventListener("scroll", pyyda, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onResize, { passive: true });
  pyyda();
}

function pysayta() {
  if (!kaynnissa) return;
  kaynnissa = false;
  cancelAnimationFrame(raf);
  raf = 0;
  window.removeEventListener("scroll", pyyda);
  window.removeEventListener("resize", onResize);
  window.removeEventListener("orientationchange", onResize);
}

/** Lisaa kuuntelijan. Vayla kaynnistyy ensimmaisesta ja pysahtyy kun
    viimeinen poistuu. Palauttaa poistofunktion. */
export function kuuntele(k: Kuuntelija) {
  kuuntelijat.add(k);
  kaynnista();
  pyyda();
  return () => {
    kuuntelijat.delete(k);
    if (!kuuntelijat.size) pysayta();
  };
}

/** Nykyinen tila ilman kehysta (esim. tapahtumankasittelijoille). */
export function tilaNyt(): Tila {
  if (!HV) mittaa(true);
  return { y: window.scrollY, yp, HV, W, ylos: false, suunta, reduce: reduce() };
}

/** Hyppy ilman vieritysanimaatiota (html:lla on scroll-behavior: smooth). */
export function hyppaa(top: number) {
  window.scrollTo({ top: Math.max(0, top), behavior: "instant" as ScrollBehavior });
  napsauta = true;
  pyyda();
}

export const rajaa = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const pehmea = (v: number) => {
  const t = rajaa(v);
  return t * t * (3 - 2 * t);
};
