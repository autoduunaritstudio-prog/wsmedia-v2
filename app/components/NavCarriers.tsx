"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * KOKEILU v2: kaksi tikku-ukkoa kantavat logon ja valikkopainikkeen pois ja
 * takaisin. POISTO YHDELLA RIVILLA: <NavCarriers /> pois FullscreenNavista.
 *
 * ---------------------------------------------------------------------
 * KOKO SEKVENSSI ON PUHDAS FUNKTIO SCROLL-POSITIOSTA. Ei tilakonetta, ei
 * setTimeoutia, ei "kesken olevaa" sekvenssia jota pitaisi perua. Sama
 * periaate kuin sivuston muilla scroll-efekteilla (hero-scrim,
 * --mb-gy, coverien scrim): arvo johdetaan joka framessa geometriasta.
 *
 *   ph = clamp((navH + 120 + RUN - strip.top)    / RUN, 0, 1)   piilotus
 *   ps = clamp((24 - strip.bottom)               / RUN, 0, 1)   paluu
 *   u1 = clamp(ph - ps, 0, 1)      0 = kotona, 1 = kannettu pois
 *
 * KAKSI VYOHYKETTA. Toinen laukeaa Referenssit-osiossa ja kayttaa TASAN
 * samaa mekaniikkaa - vain etenema tulee toisesta lahteesta:
 *
 *   u2 = clamp(dim - clamp((ap - 0,85) / 0,15, 0, 1), 0, 1)
 *   u  = max(u1, u2)
 *
 * dim = --refs-dim ja ap = --refs-ap, molemmat SiteEffectsin jo laskemia
 * (dim = raaka rp, ankkuri A = min(.refsticky-korkeus, vh); ap = 1 -
 * .aftercover.top / vh). Tassa ei lasketa niita uudelleen: kaksi silmukkaa
 * jotka mittaavat saman rectin eri vaiheessa framea antaisivat kaksi eri
 * totuutta samasta hetkesta.
 *
 * max() eika summa tai tilamuuttuja: kumpikin osatermi on jatkuva funktio
 * scrollista, joten maksimi on sita myos. Vyohykkeet eivat leikkaa (ks.
 * VYOHYKKEIDEN RAJAT alla), joten max = se termi joka on kaynnissa; jos ne
 * joskus leikkaisivat, tulos ei silti hyppaisi.
 *
 * VYOHYKKEIDEN RAJAT scrollY:na. S = .logostripin ylareuna dokumentissa,
 * Hs sen korkeus, R = .refsin staattinen ylareuna, F = .aftercoverin:
 *
 *   vyohyke 1: [S - navH - 500,  S + Hs + 356]
 *   vyohyke 2: [R - A,           R - 0,4A]  (vienti)
 *              [F - 0,15vh,      F]         (palautus, u2 = 1 valissa)
 *
 * Erillisyys vaatii S + Hs + 356 < R - A. Valissa on koko Palvelut-osio ja
 * .refsticky, yhteensa yli 2200px; suurin A on min(H1, vh) = 1093, joten
 * ehdon vasen puoli jaa yli 750px paahan oikeasta pienimmalla marginaalilla.
 *
 * Bufferit 120 / 24 ovat TASAN samat kuin nav-hide-logiikalla, ja mitta
 * tulee samasta .logostrip-rectista - vain jatkuvana arvona pisteen sijaan.
 *
 * Kolme seurausta:
 *  - Nopea scroll = nopea liike automaattisesti. Askelvaihe johdetaan
 *    KULJETUSTA MATKASTA (gait = matka / 2*STEP), ei kellosta, joten
 *    jalkojen kiinnitys maahan patee millä tahansa nopeudella.
 *  - Suunnanvaihto ei voi sekoittaa mitaan: kaikki on funktio u:sta, ja
 *    u vain kulkee takaisin samaa rataa.
 *  - Elementit eivat tarvitse opacity-piilotusta lainkaan. Ne ovat
 *    kasien mukana; kun hahmo on poissa ruudulta, elementti on myos.
 *    Siksi "ilmestyy takaisin ja jaa jumiin" -tila ei ole enaa olemassa.
 *
 * Paluumatka on lahdon tarkka peilikuva: hahmo palaa samalta reunalta
 * jolta se lahti, kantaen, asettaa elementin ja poistuu samaa reittia.
 * Se on suora seuraus siita etta liike on yksi funktio - ja lukeutuu
 * luontevasti, kuten samasta ovesta palaava ihminen.
 * ---------------------------------------------------------------------
 */

type Vec = { x: number; y: number };

/** Kaksiluinen kaanteiskinematiikka: palauttaa nivelen sijainnin. */
function ik(root: Vec, target: Vec, a: number, b: number, flip: number): Vec {
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(a - b) + 0.01), a + b - 0.01);
  const base = Math.atan2(dy, dx);
  const cos = Math.min(Math.max((a * a + d * d - b * b) / (2 * a * d), -1), 1);
  const ang = base + flip * Math.acos(cos);
  return { x: root.x + Math.cos(ang) * a, y: root.y + Math.sin(ang) * a };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const rot = (p: Vec, o: Vec, a: number): Vec => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const dx = p.x - o.x;
  const dy = p.y - o.y;
  return { x: o.x + dx * c - dy * s, y: o.y + dx * s + dy * c };
};

const L = { thigh: 18, shin: 18, torso: 22, neck: 6, head: 5.5, upperArm: 15, foreArm: 15 };
const STEP = 42;      // askelpituus px; gait johdetaan matkasta, ei ajasta
const LIFT = 9;
const BOB = 3.5;
const RUN = 380;      // scroll-matka jolla koko sekvenssi tapahtuu
const HIDE_BUF = 120; // sama kuin NAV_HIDE_BUFFER_IN
const SHOW_BUF = 24;  // sama kuin NAV_SHOW_BUFFER_OUT
const A = 0.4;        // u: kavely sisaan paattyy
const B = 0.55;       // u: tartunta paattyy, kanto alkaa
const LEAN_MAX = 0.28; // rad, n. 16 astetta
/* Liikehaivytys. Nopeus tulee samasta rAF-silmukasta ja samasta
   .logostrip-rectista kuin hahmojen sijainti - ei erillista mekanismia.
   K on mitoitettu niin etta reipas veto (n. 2000 px/s) osuu kattoon ja
   tavallinen selailu (n. 400 px/s) jaa 0,6px:aan eli tuskin nakyvaksi. */
const BLUR_K = 0.0015;
const BLUR_MAX = 3;
const BLUR_DECAY = 0.75; // per frame; palautuu teravaksi n. 8 framessa
/* Palautusikkuna RAAKANA apRaw:na. Leveys 0,15 on sama kuin ennen, joten
   kavelynopeus ei muutu; alaraja 0,85 -> 0,95 siirtaa koko ikkunan tasan
   0,10 * vh pikselia myohemmaksi. Rajattu ap ei olisi tahan kelvannut:
   se on jo 1,0 kun .aftercover peittaa nakyman ylareunan. */
const RET_LO = 0.95;
/* 0,15 -> 0,45. Kolminkertainen ikkuna samasta alkupisteesta. Kavelymatka
   jaa ennalleen: se on JAETTU logonauhavyohykkeen kanssa (sama a.edge,
   sama a.home), joten sen kasvattaminen nopeuttaisi myos lahtoa. Eika
   sille ole tarvetta - kolminkertaistaminen yksin vie paluun nopeuden
   arvoon 0,57-0,73 px/scrollpx, kun lahdon nopeus on 0,61-0,68. Paluu
   siis kavelee nyt tasan samaa vauhtia kuin lahto; pidempi matka tekisi
   siita lahtoa NOPEAMMAN. */
const RET_W = 0.45;
/* Lamppujakso. Ankkurit mitataan ajossa (ks. measure):
     S_start = hetki jolloin .refsin ylareuna on tasan nakyman ylareunassa
               eli cover on peittanyt edellisen osion KOKONAAN
     S_end   = hetki jolloin .aftercoverin ylareuna osuu korttirivin
               YLAREUNAAN eli cover on peittanyt koko rivin
   Vaiheet ovat murto-osia mitatusta spanista. */
const LAMP_A = 0.20;  // a) lamppujen tuonti
const LAMP_C = 0.30;  // c) lamppujen vienti
/* Lampunkantajan aloituspiste on ruudun ULKOPUOLELLA, samat 90px kuin
   logonkantajalla. Hahmon puolikas leveys on n. 26px (jalat taydessa
   askeleessa +-21, kadet +20, paa r 5,5), joten 90px vie sen kokonaan
   reunan taakse eika se voi ilmestya tyhjasta.
   Kavelymatka JOHDETAAN talta: matka = |pysahdyspaikka - aloituspiste|.
   Aiempi kiintea kerroin jatti aloituspisteen nakyman SISAPUOLELLE
   leveyksilla >= 1028px, mika nakyi juuri poppina. */
const LAMP_EDGE = 90;
/* S_end MITATAAN, ei arvata: ankkuri on korttirivin YLAREUNA, eli lamput
   ovat poissa vasta kun cover on peittanyt koko rivin. Sen sijainti
   riippuu seka nakyman korkeudesta etta sisallon nostosta, joten kiintea
   apRaw-luku ei voi olla oikein millaan yhdella arvolla. */
const BEAM_RAMP = 0.15; // keilan nousu/lasku vaiheen b sisalla
const BEAM_HALF_O = 0.30; // rad, ulkokeilan puolikulma (n. 17 astetta)
const BEAM_HALF_I = 0.15; // rad, sisakeila
const LAMP_LEN = 15;      // lampun rungon pituus kadesta paahan
const MASK_PAD = 4;       // px, videokorttien maskin varmuusmarginaali
/* Taustan aariarvot navipalkin takana: --color-bg ja --color-dark.
   Kaytetaan blendin lapi nakyvan varin laskentaan, ks. paintFor(). */
const BG = 255;
const DK = 13;

export default function NavCarriers() {
  const svgRef = useRef<SVGSVGElement>(null);
  const beamRef = useRef<SVGSVGElement>(null);
  // Keilakerros on navin ULKOPUOLELLA, joten se ei voi olla taman
  // komponentin normaalissa puussa: portaali vie sen bodyyn vasta kun
  // efekti on paattanyt etta hahmot ylipaataan kaynnistyvat.
  const [beamHost, setBeamHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>("#nav");
    const svg = svgRef.current;
    if (!nav || !svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 860px)").matches) return;

    const logo = nav.querySelector<HTMLElement>(".logo");
    const toggle = nav.querySelector<HTMLElement>(".navtoggle");
    const strip = document.querySelector<HTMLElement>(".logostrip");
    if (!logo || !toggle || !strip) return;
    // Toisen vyohykkeen lahteet. Puuttuvat alasivuilla - silloin u2 jaa
    // nollaan eika mikaan muu kayttaydy toisin.
    const refCover = document.querySelector<HTMLElement>(".refs");
    const refPanel = document.querySelector<HTMLElement>(".refsticky");
    // Nama on maariteltava ENNEN measurea: measure lukee ruudukon sijainnin
    // S_endia varten ja sita kutsutaan heti alustuksessa.
    const refGrid = document.querySelector<HTMLElement>(".refgrid");
    const refCards = Array.from(document.querySelectorAll<HTMLElement>(".refcard"));
    // Inline-tyylista, ei getComputedStylesta: SiteEffects kirjoittaa arvot
    // juuri sinne, ja luku on pelkka merkkijono - ei tyylien uudelleenlaskentaa.
    const varNum = (el: HTMLElement | null, name: string) => {
      if (!el) return 0;
      const v = parseFloat(el.style.getPropertyValue(name));
      return Number.isFinite(v) ? v : 0;
    };

    nav.classList.add("carriers-on");

    const P = (n: string) => svg.querySelector<SVGElement>(`[data-p="${n}"]`);
    // el = null: lampunkantaja ei siirra mitaan DOM-elementtia, vaan
    // kannettava on SVG-lamppu. Kaikki muu - polku, foot-planting,
    // tartunta, askelkello - on tasan sama.
    type Actor = { el: HTMLElement | null; lamp: boolean; home: Vec; edge: number; sign: number; face: number; prevX: number; prevDist: number | null; gaitAcc: number };
    const actors: Actor[] = [];
    let ground = 0;
    // Lamppujakso apRaw-koordinaatistossa. holdLo vastaa S_startia,
    // holdHi S_endia; spanPx on niiden vali pikseleina.
    let holdLo = 0;
    let holdHi = 0;
    let spanPx = 0;

    const measure = () => {
      const lr = logo.getBoundingClientRect();
      const tr = toggle.getBoundingClientRect();
      ground = Math.max(lr.bottom, tr.bottom);
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      // S_start apRaw:na. refs.top = 0 tarkoittaa etta .refs on siirtynyt
      // tasan oman staattisen ylareunansa verran, jolloin
      //   aftercover.top = H3  ->  apRaw = (vh - H3) / vh.
      // Sama H3 kuin SiteEffectsilla, luettuna samasta elementista.
      holdLo = refCover ? (vh - refCover.offsetHeight) / vh : 0;
      // S_end: se apRaw jolla .aftercoverin ylareuna osuu korttirivin
      // YLAREUNAAN. Ruudukon sijainti luetaan .refsin ylareunaan NAHDEN,
      // jolloin arvo ei riipu siita millaisella scrollilla mittaus sattuu
      // tapahtumaan; pinnattuna .refsin ylareuna on tasan vh - H3, joten
      // korttirivin ylareuna nakymassa on (vh - H3) + gridRel.
      if (refCover && refGrid) {
        const rr = refCover.getBoundingClientRect();
        const gg = refGrid.getBoundingClientRect();
        const cardTop = vh - refCover.offsetHeight + (gg.top - rr.top);
        holdHi = 1 - cardTop / vh;
      } else holdHi = 0;
      spanPx = (holdHi - holdLo) * vh;
      const conf: [HTMLElement, DOMRect, number][] = [
        [logo, lr, -1],
        [toggle, tr, 1],
      ];
      conf.forEach(([el, r, sign], i) => {
        // Elementin KOTI luetaan ilman voimassa olevaa transformia.
        const prev = el.style.transform;
        el.style.transform = "";
        const h = el.getBoundingClientRect();
        el.style.transform = prev;
        const home = { x: h.left + h.width / 2, y: h.top + h.height / 2 };
        const edge = sign < 0 ? -90 : window.innerWidth + 90;
        if (actors[i]) Object.assign(actors[i], { home, edge });
        else actors.push({ el, lamp: false, home, edge, sign, face: -sign, prevX: edge, prevDist: null, gaitAcc: 0 });
      });
      // Lampunkantajat 2 ja 3. Pysahdyspaikka on TASAN se x jossa logo ja
      // valikkopainike ovat - samat mitatut keskikohdat joita logonkantajat
      // kayttavat kotinaan, ei kiintea osuus vw:sta. Ne seisovat siis
      // juuri siina mista elementit vietiin, leveydesta riippumatta.
      [-1, 1].forEach((sign, k) => {
        const i = 2 + k;
        const home = { x: actors[k]?.home.x ?? (sign < 0 ? 0 : vw), y: ground - 40 };
        const edge = sign < 0 ? -LAMP_EDGE : vw + LAMP_EDGE;
        if (actors[i]) Object.assign(actors[i], { home, edge });
        else actors.push({ el: null, lamp: true, home, edge, sign, face: -sign, prevX: edge, prevDist: null, gaitAcc: 0 });
      });
    };
    measure();
    window.addEventListener("resize", measure, { passive: true });

    const stops = Array.from(svg.querySelectorAll<SVGStopElement>("#carrierShadow stop"));
    setBeamHost(document.body);

    // Keilakerros syntyy portaalilla vasta seuraavassa renderissa, joten
    // se haetaan laiskasti eika mountissa.
    type BeamEls = { grp: SVGElement; cone: SVGElement[][]; grad: SVGElement[]; mask: SVGElement[] };
    let beamEls: BeamEls | null = null;
    const getBeam = (): BeamEls | null => {
      if (beamEls) return beamEls;
      const b = beamRef.current;
      if (!b) return null;
      const q = (n: string) => b.querySelector<SVGElement>(`[data-b="${n}"]`);
      const grp = q("grp");
      if (!grp) return null;
      const cone = [0, 1].map((k) => [q(`o${k}`), q(`i${k}`)].filter(Boolean) as SVGElement[]);
      const grad = [0, 1].map((k) => q(`g${k}`)).filter(Boolean) as SVGElement[];
      const mask = [0, 1, 2, 3, 4].map((n) => q(`m${n}`)).filter(Boolean) as SVGElement[];
      beamEls = { grp, cone, grad, mask };
      return beamEls;
    };

    let raf = 0;
    let prevTop: number | null = null;
    let prevT = 0;
    let blur = 0;
    let prevBack = -1;
    let backCss = `rgb(${BG},${BG},${BG})`;
    let idle = true;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const r = strip.getBoundingClientRect();

      // Scroll-nopeus rectin muutoksesta: nauha liikkuu sivun mukana, joten
      // |dTop|/dt ON scroll-nopeus. Ei omaa scroll-kuuntelijaa.
      const dt = prevT ? Math.min((now - prevT) / 1000, 0.05) : 0;
      const vScroll = prevTop !== null && dt > 0 ? Math.abs(r.top - prevTop) / dt : 0;
      prevTop = r.top;
      prevT = now;
      // Nousee heti, laskee vaimennetusti - blur ei jaa roikkumaan kun
      // scroll pysahtyy, mutta ei myoskaan valky yksittaisista frameista.
      blur = Math.max(Math.min(vScroll * BLUR_K, BLUR_MAX), blur * BLUR_DECAY);
      const blurPx = blur < 0.05 ? 0 : blur;
      const navH = nav.getBoundingClientRect().height;
      const ph = clamp((navH + HIDE_BUF + RUN - r.top) / RUN, 0, 1);
      const ps = clamp((SHOW_BUF - r.bottom) / RUN, 0, 1);
      const u1 = clamp(ph - ps, 0, 1);

      // --- vyohyke 2: Referenssit ---
      // Vienti seuraa --refs-dimia sellaisenaan: se on 0,000 tasan sina
      // hetkena kun .refs saavuttaa .refstickyn alareunan, joten kantajat
      // eivat voi lahtea liikkeelle ennen kuin cover oikeasti alkaa peittaa.
      const dim = varNum(refCover, "--refs-dim");
      const apRaw = varNum(refCover, "--refs-ap");
      const u2 = clamp(dim - clamp((apRaw - RET_LO) / RET_W, 0, 1), 0, 1);
      const uNav = Math.max(u1, u2);

      // --- lamppujakso ---
      // KOVA EHTO: kun .refsin ylareuna on viela nakyman sisalla, edellista
      // osiota nakyy ja lamppuja ei ole olemassa. Portti on rectista eika
      // apRaw:sta, jotta se on tasan nolla eika osapikselin verran auki -
      // molemmat ovat funktioita scrollista, joten tama ei ole tilaa.
      const refsTop = refCover ? refCover.getBoundingClientRect().top : 1;
      const covered = refsTop <= 0;
      // t kulkee nollasta ykkoseen valilla S_start -> S_end.
      const t =
        covered && spanPx > 0 ? clamp((apRaw - holdLo) / (holdHi - holdLo), 0, 1) : 0;
      const uLamp = clamp(
        clamp(t / LAMP_A, 0, 1) - clamp((t - (1 - LAMP_C)) / LAMP_C, 0, 1),
        0,
        1,
      );
      // Keilan kirkkaus vaiheen b sisalla: 0 -> taysi -> 0. Kolmiofunktio
      // eika kello, joten ylospain scrollaus kayttaa saman radan takaperin.
      const qb = covered ? clamp((t - LAMP_A) / (1 - LAMP_A - LAMP_C), 0, 1) : 0;
      const beamOn = covered ? clamp(Math.min(qb, 1 - qb) / BEAM_RAMP, 0, 1) : 0;
      const uAny = Math.max(uNav, uLamp);

      // Nav kutistuu (.scrolled) heti ensimmaisilla pikseleilla, joten
      // latauksen aikainen mittaus on molemmissa vyohykkeissa vanhentunut.
      // Mitataan uudelleen kun vyohyke alkaa - transform on silloin viela
      // nolla, joten koti ja maataso luetaan puhtaana.
      if (uAny > 0.001) {
        if (idle) {
          idle = false;
          measure();
        }
      } else if (!idle) idle = true;

      // --- blendin lapi nakyva vari ---
      // #nav on mix-blend-mode: difference, joten renderoity savy on
      // |tausta - lahde|. Taustan harmaa navipalkin kaistalla [0, ground]
      // ladotaan samoista arvoista jotka ohjaavat itse osioita:
      //   paneeli   = --color-bg, jonka paalla .refscrim alfalla --ref-scrim
      //   .refs     = --color-dark, peittaa kaistan ylhaalta alas
      //   .aftercover = --color-bg, peittaa lopuksi saman kaistan
      // Nain vari on LASKETTU eika arvattu, ja se seuraa scrollia 1:1.
      const band = Math.max(ground, 1);
      const fRefs = refCover ? clamp((band - refsTop) / band, 0, 1) : 0;
      const fAfter = clamp((band - (1 - apRaw) * window.innerHeight) / band, 0, 1);
      const sPanel = varNum(refPanel, "--ref-scrim");
      let back = BG - (BG - DK) * sPanel;
      back += (DK - back) * fRefs;
      back += (BG - back) * fAfter;
      const bi = Math.round(back);
      if (bi !== prevBack) {
        prevBack = bi;
        backCss = `rgb(${bi},${bi},${bi})`;
        // Varjon lahdevari = taustan vari. Difference antaa silloin |B-B| = 0
        // eli tasan kertova varjostus (1-alfa)*B: valkoisella 255 -> 214
        // (sama kuin ennen), tummalla 13 -> 10,9 eli olematon - juuri niin
        // kuin kontaktivarjo kayttaytyy mustalla lattialla. Aiempi kiintea
        // #fff olisi antanut tummalla 13 -> 49,6 eli VAALEAN laikun.
        for (const st of stops) st.setAttribute("stop-color", backCss);
      }

      // Videoseinan sijainti luetaan vain kun lamput ovat esilla.
      const gr = uLamp > 0.001 && refGrid ? refGrid.getBoundingClientRect() : null;
      const target = gr
        ? { x: gr.left + gr.width / 2, y: gr.top + gr.height * 0.42 }
        : { x: window.innerWidth / 2, y: window.innerHeight * 0.6 };
      const beamSrc: { ax: number; ay: number; ang: number; len: number }[] = [];

      for (let i = 0; i < actors.length; i++) {
        const a = actors[i];
        const u = a.lamp ? uLamp : uNav;
        const grp = P(`c${i}`);
        // Hahmo on nakyvissa vain kun jotain tapahtuu. Logonkantajalla
        // u = 1 tarkoittaa "kannettu pois ruudulta", lampunkantajalla se on
        // paikallaan seisominen ja valaiseminen - siksi ylaraja vain sille.
        const visible = a.lamp ? u > 0.001 : u > 0.001 && u < 0.999;
        if (grp) {
          grp.style.opacity = visible ? "1" : "0";
          grp.style.filter = blurPx ? `blur(${blurPx.toFixed(2)}px)` : "";
        }
        // Reunus taustan varilla. Viivan oma lahdevari on #fff, joka
        // renderoityy arvoksi 255-B: se on vahva vaalealla (0 = musta) ja
        // tummalla (242 = lahes valkoinen), mutta katoaa kun tausta on
        // keskiharmaa - juuri silloin kun .refscrim on puolivalissa, ja
        // |255-2B| menee nollan lapi B:n arvolla 128. Reunus on lahdevari
        // B, joka renderoityy nollaksi eli MUSTAKSI riippumatta taustasta,
        // joten ainakin toinen niista erottuu aina: max(B, |255-2B|) >= 85
        // kaikilla B. Reunus on omassa ryhmassaan, jotta se ei kehysta
        // kontaktivarjoja.
        const fig = P(`c${i}f`);
        if (fig) {
          fig.style.filter = visible
            ? `drop-shadow(0 0 2px ${backCss}) drop-shadow(0 0 1px ${backCss})`
            : "";
        }

        // --- polku: reuna -> pysahdys -> reuna, x puhtaana funktiona u:sta.
        // Pysahdys on 26px elementista SILLE PUOLELLE josta hahmo tulee,
        // jolloin kadet yltavat sen keskelle ilman etta vartalo peittaa sita.
        // Lampunkantajalla ei ole tartuttavaa elementtia, joten se
        // pysahtyy tasan kotipisteeseensa; logonkantaja 26px sivuun.
        const stopX = a.lamp ? a.home.x : a.home.x + a.sign * 26;
        const D1 = Math.abs(stopX - a.edge);
        const D3 = D1;
        let x: number;
        let dist: number;
        if (a.lamp) {
          // Sama rata, mutta u kayttaytyy jo itse kolmiona (0 -> 1 -> 0),
          // joten reuna -> pysahdys -> reuna syntyy suoraan siita. dist on
          // yha monotoninen matka, ja gaitAcc lukee vain sen itseisarvoista
          // muutosta - askelkello ei siis pyori taaksepain paluullakaan.
          x = a.edge + (stopX - a.edge) * u;
          dist = D1 * u;
        } else if (u < A) {
          const t = u / A;
          x = a.edge + (stopX - a.edge) * t;
          dist = D1 * t;
        } else if (u < B) {
          x = stopX;
          dist = D1;
        } else {
          const t = (u - B) / (1 - B);
          x = stopX + (a.edge - stopX) * t;
          dist = D1 + D3 * t;
        }
        // Askelvaihe KULJETUSTA MATKASTA, ei ajasta - ja nimenomaan matkan
        // ITSEISARVOISESTA muutoksesta, ei dist-arvosta suoraan.
        //
        // Aiemmin tassa oli gait = dist / (2*STEP). dist on funktio u:sta,
        // joten kun u laskee (paluumatka), askelkello pyori TAAKSEPAIN ja
        // heilahtava jalka kaarsi edesta taakse - moonwalk. Tukijalka pysyi
        // silti maassa (lantio -face*STEP, jalka suht. +face*STEP, summa 0),
        // minka takia vika nakyi vain heilahdusjalassa eika koko hahmo
        // luistanut. Se selittaa myos miksi kuvio toistui identtisena
        // molempiin scrollisuuntiin: vaiheet 1-2 ovat aina u:n NOUSUA ja
        // vaiheet 3-4 aina u:n LASKUA, riippumatta siita kumpaan suuntaan
        // kayttaja skrollaa.
        //
        // Kertyma on pelkka esitystiedon apumuuttuja: sijainti ja kanto ovat
        // yha puhtaita funktioita u:sta, joten tama ei palauta sita
        // tilaluokkaa jonka v2 poisti.
        if (a.prevDist === null) a.prevDist = dist;
        a.gaitAcc += Math.abs(dist - a.prevDist);
        a.prevDist = dist;
        const gait = ((a.gaitAcc / (2 * STEP)) % 1 + 1) % 1;
        // Nopeus suoraan x:n muutoksesta - ei johdettuja etumerkkeja.
        const vx = x - a.prevX;
        a.prevX = x;
        if (Math.abs(vx) > 0.4) a.face = Math.sign(vx);
        // Kallistus on suoraan nopeuden funktio: ei tilaa, kaantyy itsestaan.
        const lean = clamp(vx * 0.09, -LEAN_MAX, LEAN_MAX);

        const bob = -BOB * (0.5 - 0.5 * Math.cos(4 * Math.PI * gait));
        const hip: Vec = { x, y: ground - L.thigh - L.shin + bob };
        const shoulder = rot({ x: hip.x, y: hip.y - L.torso }, hip, lean);
        const headP = rot({ x: hip.x, y: hip.y - L.torso - L.neck - L.head }, hip, lean);

        const walking = a.lamp ? u > 0.001 && u < 0.999 : u < A || u > B;
        const feet: Vec[] = [];
        for (let f = 0; f < 2; f++) {
          const p = (gait + f * 0.5) % 1;
          if (!walking) {
            feet.push({ x: hip.x + (f === 0 ? -6 : 7) * a.face, y: ground });
          } else if (p < 0.5) {
            feet.push({ x: hip.x + a.face * STEP * (0.5 - p / 0.5), y: ground });
          } else {
            const t = (p - 0.5) / 0.5;
            feet.push({ x: hip.x + a.face * STEP * (t - 0.5), y: ground - Math.sin(t * Math.PI) * LIFT });
          }
        }

        // Kantoote: nousee tartunnan aikana, pysyy sen jalkeen. Lamppu on
        // kasissa jo tullessa, joten sille ote on taysi koko ajan.
        const hold = a.lamp ? 1 : clamp((u - A) / (B - A), 0, 1);
        const hands: Vec[] = [];
        for (let h = 0; h < 2; h++) {
          const swing = (gait + h * 0.5) % 1;
          const rest: Vec = {
            x: shoulder.x - a.face * Math.cos(swing * 2 * Math.PI) * 9,
            y: shoulder.y + L.upperArm + L.foreArm - 6,
          };
          const carry: Vec = { x: shoulder.x + a.face * 20, y: shoulder.y + 6 };
          hands.push({
            x: rest.x + (carry.x - rest.x) * hold,
            y: rest.y + (carry.y - rest.y) * hold,
          });
        }

        // --- kontaktivarjot ---
        // Ei omaa laskentaa: molemmat lukevat saman x:n ja saman gaitin
        // kuin hahmo ja kannettu elementti.
        //
        // "Hengitys" askeleen mukana: bob on 0 kun lantio on alimmillaan
        // (jalka kantaa) ja -BOB kun se on ylimmillaan (askeleen keskella).
        // Varjo on siis tiivein ja tummin kosketuksessa ja levein ja
        // haalein ilmassa - sama fysikaalinen suhde kuin oikealla varjolla.
        const lift = -bob / BOB;
        const sh = P(`c${i}sh`);
        if (sh) {
          sh.setAttribute("cx", hip.x.toFixed(1));
          sh.setAttribute("cy", (ground + 1).toFixed(1));
          sh.setAttribute("rx", (15 + 4 * lift).toFixed(1));
          sh.setAttribute("ry", (3.6 - 0.5 * lift).toFixed(1));
          sh.style.opacity = (1 - 0.3 * lift).toFixed(2);
        }

        const hd = P(`c${i}h`);
        if (hd) {
          hd.setAttribute("cx", headP.x.toFixed(1));
          hd.setAttribute("cy", headP.y.toFixed(1));
        }
        const sp = P(`c${i}s`);
        if (sp) sp.setAttribute("d", `M${hip.x.toFixed(1)} ${hip.y.toFixed(1)} L${shoulder.x.toFixed(1)} ${shoulder.y.toFixed(1)}`);
        for (let f = 0; f < 2; f++) {
          // flip on KAANTEINEN face:iin nahden: ruutukoordinaateissa (y alas)
          // flip=-1 vie nivelen +x-suuntaan. Kavellessa oikealle (face=+1)
          // polven on taivuttava ETEEN eli +x, joten flip = -face.
          const k = ik(hip, feet[f], L.thigh, L.shin, a.face > 0 ? -1 : 1);
          const s = P(`c${i}l${f}`);
          if (s) s.setAttribute("d", `M${hip.x.toFixed(1)} ${hip.y.toFixed(1)} L${k.x.toFixed(1)} ${k.y.toFixed(1)} L${feet[f].x.toFixed(1)} ${feet[f].y.toFixed(1)}`);
        }
        for (let h = 0; h < 2; h++) {
          // Kyynarpaa taipuu TAAKSE eli face:n vastasuuntaan.
          const e = ik(shoulder, hands[h], L.upperArm, L.foreArm, a.face > 0 ? 1 : -1);
          const s = P(`c${i}a${h}`);
          if (s) s.setAttribute("d", `M${shoulder.x.toFixed(1)} ${shoulder.y.toFixed(1)} L${e.x.toFixed(1)} ${e.y.toFixed(1)} L${hands[h].x.toFixed(1)} ${hands[h].y.toFixed(1)}`);
        }

        // Elementti kulkee kasien mukana. Puhdas funktio u:sta, joten se ei
        // voi jaada valitilaan kun scroll kaantyy.
        const hx = (hands[0].x + hands[1].x) / 2;
        const hy = (hands[0].y + hands[1].y) / 2;
        const dx = (hx - a.home.x) * hold;
        const dy = (hy - a.home.y) * hold;
        if (a.el) a.el.style.transform = hold > 0.001 ? `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)` : "";

        // Lamppu: runko kadesta kohti videoseinaa. Sama kannettava-logiikka
        // kuin logolla, vain esine on SVG eika DOM-elementti.
        if (a.lamp) {
          const tx = target.x - hx;
          const ty = target.y - hy;
          const tl = Math.hypot(tx, ty) || 1;
          const ux = tx / tl;
          const uy = ty / tl;
          const nx = -uy;
          const ny = ux;
          const w0 = 4.2;
          const w1 = 6.4;
          const ex = hx + ux * LAMP_LEN;
          const ey = hy + uy * LAMP_LEN;
          const lp = P(`c${i}lamp`);
          if (lp) {
            lp.setAttribute(
              "d",
              `M${(hx + nx * w0).toFixed(1)} ${(hy + ny * w0).toFixed(1)}` +
                `L${(hx - nx * w0).toFixed(1)} ${(hy - ny * w0).toFixed(1)}` +
                `L${(ex - nx * w1).toFixed(1)} ${(ey - ny * w1).toFixed(1)}` +
                `L${(ex + nx * w1).toFixed(1)} ${(ey + ny * w1).toFixed(1)}Z`,
            );
          }
          // Kartion karki hieman lampun paan ULKOPUOLELLA: nain hahmo itse
          // ei jaa kirkkaimman kohdan sisaan, jolloin difference-blendattu
          // viiva pysyy laskettuna.
          beamSrc[i - 2] = {
            ax: hx + ux * (LAMP_LEN + 6),
            ay: hy + uy * (LAMP_LEN + 6),
            ang: Math.atan2(uy, ux),
            len: tl + (gr ? gr.height * 0.6 : 200),
          };
        }

        // Kannetun elementin oma varjo: seuraa samaa siirtymaa, haipyy
        // holdin mukana eli katoaa kun elementti on asetettu takaisin.
        const esh = P(`c${i}esh`);
        if (esh) {
          esh.setAttribute("cx", (a.lamp ? hx : a.home.x + dx).toFixed(1));
          esh.setAttribute("cy", (ground + 1).toFixed(1));
          esh.setAttribute("rx", "11");
          esh.setAttribute("ry", "2.8");
          esh.style.opacity = (hold * 0.85).toFixed(2);
        }
        // Sama haivytys kannettavaan elementtiin, mutta VAIN kun se on
        // kasissa - muuten logo sumenisi jokaisella nopealla scrollilla.
        if (a.el) {
          a.el.style.filter = hold > 0.001 && blurPx ? `blur(${blurPx.toFixed(2)}px)` : "";
          // Tab-jarjestys: piiloon vasta kun elementti on oikeasti pois ruudulta.
          a.el.style.visibility = u > 0.985 ? "hidden" : "";
        }
      }

      // --- keilat omalla kerroksellaan ---
      const be = getBeam();
      if (be) {
        be.grp.style.opacity = beamOn.toFixed(3);
        if (beamOn > 0.001) {
          for (let k = 0; k < be.cone.length; k++) {
            const src = beamSrc[k];
            if (!src) continue;
            const g = be.grad[k];
            if (g) {
              g.setAttribute("cx", src.ax.toFixed(1));
              g.setAttribute("cy", src.ay.toFixed(1));
              g.setAttribute("r", src.len.toFixed(1));
            }
            const half = [BEAM_HALF_O, BEAM_HALF_I];
            for (let c = 0; c < be.cone[k].length; c++) {
              const a1 = src.ang - half[c];
              const a2 = src.ang + half[c];
              be.cone[k][c].setAttribute(
                "d",
                `M${src.ax.toFixed(1)} ${src.ay.toFixed(1)}` +
                  `L${(src.ax + Math.cos(a1) * src.len).toFixed(1)} ${(src.ay + Math.sin(a1) * src.len).toFixed(1)}` +
                  `L${(src.ax + Math.cos(a2) * src.len).toFixed(1)} ${(src.ay + Math.sin(a2) * src.len).toFixed(1)}Z`,
              );
            }
          }
          // Videokortit LEIKATAAN keilasta maskilla. Kortteihin itseensa ei
          // kosketa millaan tavalla: niiden opacity, filter ja tausta
          // pysyvat sellaisina kuin CSS ne maarittelee, ja keila piirtyy
          // vain niiden ohi ja valiin. Marginaali kattaa osapikselit.
          for (let n = 0; n < be.mask.length; n++) {
            const cr = refCards[n]?.getBoundingClientRect();
            const m = be.mask[n];
            if (!cr) {
              m.setAttribute("width", "0");
              continue;
            }
            m.setAttribute("x", (cr.left - MASK_PAD).toFixed(1));
            m.setAttribute("y", (cr.top - MASK_PAD).toFixed(1));
            m.setAttribute("width", (cr.width + MASK_PAD * 2).toFixed(1));
            m.setAttribute("height", (cr.height + MASK_PAD * 2).toFixed(1));
          }
        }
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      nav.classList.remove("carriers-on");
      setBeamHost(null);
      for (const a of actors) {
        if (!a.el) continue;
        a.el.style.transform = "";
        a.el.style.visibility = "";
        a.el.style.filter = "";
      }
    };
  }, []);

  const carriers = (
    <svg className="carriers" ref={svgRef} aria-hidden="true">
      <defs>
        {/* Pehmea reuna gradientilla eika blur-suodattimella: halvempi
            rasteroida ja pysyy terävänä millä tahansa zoomilla.

            stop-color KIRJOITETAAN joka framessa taustan variksi (ks.
            paintFor-lohko silmukassa). #nav on mix-blend-mode: difference,
            jossa tulos on |tausta - lahde|, joten lahde = tausta antaa
            nollan ja varjosta tulee tasan kertova - oikea kaikilla
            taustoilla. Musta lahde olisi valkoisella taustalla taysin
            nakymaton, kiintea valkoinen taas kaantyisi tummalla osiolla
            VAALEAKSI laikuksi. Attribuutti alla on vain alkuarvo ennen
            ensimmaista framea. */}
        <radialGradient id="carrierShadow">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <g data-p={`c${i}`} key={i} opacity="0">
          {/* Varjot ensin, jotta ne jaavat hahmon alle. Ne ovat ryhman
              ULKOPUOLELLA, koska hahmon reunussuodatin ei saa kehystaa
              niita - varjo on jo valmiiksi pehmea reunainen. */}
          <ellipse data-p={`c${i}sh`} fill="url(#carrierShadow)" stroke="none" />
          <ellipse data-p={`c${i}esh`} fill="url(#carrierShadow)" stroke="none" />
          <g data-p={`c${i}f`}>
            <circle data-p={`c${i}h`} r={L.head} />
            <path data-p={`c${i}s`} />
            <path data-p={`c${i}l0`} />
            <path data-p={`c${i}l1`} />
            <path data-p={`c${i}a0`} />
            <path data-p={`c${i}a1`} />
            {i > 1 && <path data-p={`c${i}lamp`} />}
          </g>
        </g>
      ))}
    </svg>
  );

  return (
    <>
      {carriers}
      {beamHost &&
        createPortal(
          /* Valokeilat EIVAT ole navin sisalla: #nav on mix-blend-mode:
             difference, jossa vaalea keila kaantyisi tummaksi tahraksi.
             Tama kerros on navin alla omana fixed-tasonaan ilman blendia.
             Pehmea reuna tulee radialGradientista - ei filter: bluria. */
          <svg className="navbeams" ref={beamRef} aria-hidden="true">
            <defs>
              {[0, 1].map((k) => (
                <radialGradient key={k} id={`beamG${k}`} data-b={`g${k}`} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fff4d6" stopOpacity="0.30" />
                  <stop offset="45%" stopColor="#fff4d6" stopOpacity="0.13" />
                  <stop offset="100%" stopColor="#fff4d6" stopOpacity="0" />
                </radialGradient>
              ))}
              {/* Videokortit leikataan pois keilasta. Nain kortin oma
                  opacity ja filter pysyvat koskemattomina - keila ei
                  tummenna eika kirkasta niita, vaan kulkee ohi ja valista. */}
              <mask id="beamMask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
                <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
                {[0, 1, 2, 3, 4].map((n) => (
                  <rect key={n} data-b={`m${n}`} width="0" height="0" fill="#000" />
                ))}
              </mask>
            </defs>
            <g data-b="grp" opacity="0" mask="url(#beamMask)">
              {[0, 1].map((k) => (
                <g key={k}>
                  <path data-b={`o${k}`} fill={`url(#beamG${k})`} opacity="0.55" />
                  <path data-b={`i${k}`} fill={`url(#beamG${k})`} />
                </g>
              ))}
            </g>
          </svg>,
          beamHost,
        )}
    </>
  );
}
