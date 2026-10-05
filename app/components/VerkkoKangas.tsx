"use client";

import { useEffect, useRef } from "react";

/**
 * VAALEA VERKOSTOKUVIO ETUSIVULLE (5.10.2026).
 *
 * Sama aihe kuin palvelusivujen NetBackdropissa (pisteet ja niiden
 * valiset viivat), mutta vaalealla pohjalla ja kevyempana. Piirretaan
 * MetalBackdropin sticky-paneen sisaan, joten kerroksen sijainti,
 * korkeus ja maskit ovat samat kuin fasettikuviolla.
 *
 * DETERMINISTINEN. Etusivulla on kaksi vaaleaa kerrosta (coverin ja
 * .aftercoverin), jotka ovat saumassa samassa nakymasijainnissa. Pisteet
 * ovat siemenluvusta ja kellonajasta laskettuja, joten molemmat
 * piirtavat saman kuvan eika saumaa nay.
 *
 * Silmukka kay vain kun kerros on nakyvissa ja valilehti esilla.
 * Reduced motion: yksi pysahtynyt kuva.
 */
const LINK = 175;
const DPR_MAX = 1.5;
/* Kameran liikevara kuten NetBackdropissa: kentta on nakymaa PAN_Y
   korkeampi ja PAN_X leveampi, ja sivun etenema 0..1 valitsee mika
   kaista siita nakyy. */
const PAN_Y = 900;
const PAN_X = 220;
const SPEED = 16; // px/s
const SCROLL_TAU = 0.12;

function siemen(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/* Kimpoaminen kentan reunoista: x heijastetaan valille 0..L. */
const taita = (x: number, l: number) => {
  const m = ((x % (2 * l)) + 2 * l) % (2 * l);
  return m > l ? 2 * l - m : m;
};

type Piste = { x0: number; y0: number; vx: number; vy: number };

export default function VerkkoKangas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const hiljaa = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let pisteet: Piste[] = [];
    let rgb = "31,74,110";
    let tyylit: string[] = [];
    let pisteVari = "";
    /* TUMMUMINEN (5.10.2026): vaalean taustan alla oleva .metalbd-yo
       tummuu EtuTummennuksen kirjoittamalla opacityllä. Viivat haipyvat
       samassa suhteessa. Arvo luetaan inline-tyylista (pelkka merkkijono) ja
       tyylit rakennetaan uudelleen vain kun se muuttuu. */
    const yoEl = cv.parentElement?.querySelector<HTMLElement>(".metalbd-yo") ?? null;
    let yoV = -1;
    /* UKK:n kohdalla kuvio himmenee, jotta se ei hairitse lukemista.
       EtuTummennus kirjoittaa canvasin data-himmea-arvon (0..1). */
    let himV = -1;
    let perusRgb = [31, 74, 110];
    let perusAlfa = 1;
    const TUMMA_RGB = [111, 236, 255];
    const rakenna = (m: number) => {
      // Kuvio haipyy samassa tahdissa kuin pohja tummuu (5.10.2026,
      // Tuomaksen toive): savy liukuu syaaniin, mutta peittavyys laskee
      // nollaan, joten tummalla pohjalla kuviota ei enaa ole.
      const c = perusRgb.map((x, i) => Math.round(x + (TUMMA_RGB[i] - x) * m));
      rgb = c.join(",");
      // Kuvio ei katoa kokonaan: taysin tummana jaa 45 %, jolloin
      // haipyminen jatkuu vasta kun Referenssit nousee sen paalle
      // (ensin 1 - m ja 1 - m^3, molemmat katosivat liian nopeasti).
      const alfa = perusAlfa * (1 - 0.55 * m * m) * (1 - Math.max(himV, 0));
      tyylit = Array.from({ length: TASOT + 1 }, (_, k) => `rgba(${rgb},${((k / TASOT) * 0.5 * alfa).toFixed(3)})`);
      pisteVari = `rgba(${rgb},${(0.6 * alfa).toFixed(3)})`;
    };
    const TASOT = 16;
    let fw = 0;
    let fh = 0;
    let sp = -1;
    let edellinen = 0;

    /* VIERITYS LUETAAN VIERITYSTAPAHTUMASSA, EI KEHYKSESSA (5.10.2026).
       scrollY ja scrollHeight pakottavat tyylit ja asettelun laskettaviksi,
       jos jokin muu kehyskutsu (SiteEffects, EtuTummennus) on jo ehtinyt
       kirjoittaa tyyleja. Mitattuna 4x-hidastuksella tama silmukka maksoi
       1,3 s pakotettua tyylilaskentaa 7 s:n vierityksessa. Vieritystapahtuma
       ajetaan kehyksen alussa ennen kehyskutsuja, jolloin luku on halpa;
       dokumentin korkeus luetaan vain kun se muuttuu (ResizeObserver).
       Kamera on pehmennetty (SCROLL_TAU), joten mahdollinen yhden kehyksen
       viive ei nay. */
    let vierY = window.scrollY;
    let span = document.documentElement.scrollHeight - window.innerHeight;
    const etenema = () => (span > 0 ? Math.min(Math.max(vierY / span, 0), 1) : 0);
    const mittaaSpan = () => {
      span = document.documentElement.scrollHeight - window.innerHeight;
      vierY = window.scrollY;
    };

    const koko = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
      w = r.width;
      h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cs = getComputedStyle(cv);
      const v = cs.getPropertyValue("--verkko-rgb").trim();
      if (v) perusRgb = v.split(",").map((x) => parseFloat(x));
      const a = parseFloat(cs.getPropertyValue("--verkko-alfa"));
      perusAlfa = Number.isFinite(a) ? a : 1;
      rakenna(Math.max(yoV, 0));
      fw = w + PAN_X;
      fh = h + PAN_Y;
      const n = Math.max(40, Math.min(130, Math.round((fw * fh) / 24000)));
      const s = siemen(7);
      pisteet = Array.from({ length: n }, () => ({
        x0: s() * fw,
        y0: s() * fh,
        vx: (s() - 0.5) * 2 * SPEED,
        vy: (s() - 0.5) * 2 * SPEED,
      }));
    };

    const piirra = (aika: number) => {
      const t = aika / 1000;
      const hv = parseFloat(cv.dataset.himmea ?? "0") || 0;
      const m = yoEl ? parseFloat(yoEl.style.opacity) || 0 : 0;
      if (m !== yoV || hv !== himV) {
        yoV = m;
        himV = hv;
        rakenna(m);
      }
      ctx.clearRect(0, 0, w, h);
      const ox = -(Math.sin(sp * Math.PI) * PAN_X);
      const oy = -(sp * PAN_Y);
      const xs: number[] = [];
      const ys: number[] = [];
      for (const p of pisteet) {
        const x = taita(p.x0 + p.vx * t, fw) + ox;
        const y = taita(p.y0 + p.vy * t, fh) + oy;
        if (x < -LINK || x > w + LINK || y < -LINK || y > h + LINK) continue;
        xs.push(x);
        ys.push(y);
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < xs.length; i++) {
        for (let j = i + 1; j < xs.length; j++) {
          const dx = xs[i] - xs[j];
          const dy = ys[i] - ys[j];
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const k = Math.round((1 - Math.sqrt(d2) / LINK) * TASOT);
          if (k <= 0) continue;
          ctx.strokeStyle = tyylit[k];
          ctx.beginPath();
          ctx.moveTo(xs[i], ys[i]);
          ctx.lineTo(xs[j], ys[j]);
          ctx.stroke();
        }
      }
      ctx.fillStyle = pisteVari;
      for (let i = 0; i < xs.length; i++) {
        ctx.beginPath();
        ctx.arc(xs[i], ys[i], 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    /* Vieritys tasoitetaan kuten NetBackdropissa, jotta kamera ei nyi. */
    const kello = () => performance.timeOrigin + performance.now();
    const paivitaKamera = (nyt: number) => {
      const dt = edellinen ? Math.min((nyt - edellinen) / 1000, 0.05) : 0;
      edellinen = nyt;
      const kohde = etenema();
      if (sp < 0 || dt === 0 || hiljaa) sp = kohde;
      else sp += (kohde - sp) * (1 - Math.exp(-dt / SCROLL_TAU));
    };

    let raf = 0;
    let nakyy = false;
    const silmukka = (nyt: number) => {
      raf = 0;
      if (!nakyy || document.hidden) {
        edellinen = 0;
        return;
      }
      paivitaKamera(nyt);
      piirra(kello());
      raf = requestAnimationFrame(silmukka);
    };
    const kaynnista = () => {
      if (!raf && nakyy && !document.hidden && !hiljaa) raf = requestAnimationFrame(silmukka);
    };
    /* Reduced motion: ei ajelehtimista, mutta kamera seuraa vieritysta
       (kayttajan oma liike, ks. CLAUDE.md). Piirretaan vierityksessa. */
    const vieritys = () => {
      vierY = window.scrollY;
      if (!hiljaa) return;
      sp = etenema();
      piirra(0);
    };

    koko();
    sp = etenema();
    piirra(hiljaa ? 0 : kello());
    const ro = new ResizeObserver(() => {
      koko();
      piirra(hiljaa ? 0 : kello());
    });
    ro.observe(cv);
    const roDoc = new ResizeObserver(mittaaSpan);
    roDoc.observe(document.documentElement);
    window.addEventListener("resize", mittaaSpan, { passive: true });
    const io = new IntersectionObserver((e) => {
      nakyy = e.some((x) => x.isIntersecting);
      kaynnista();
    });
    io.observe(cv);
    const nakyvyys = () => kaynnista();
    document.addEventListener("visibilitychange", nakyvyys);
    window.addEventListener("scroll", vieritys, { passive: true });
    return () => {
      window.removeEventListener("scroll", vieritys);
      window.removeEventListener("resize", mittaaSpan);
      ro.disconnect();
      roDoc.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", nakyvyys);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className="metalbd-verkko" />;
}
