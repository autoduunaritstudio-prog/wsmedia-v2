"use client";

/* MOBIILIN MOOTTORI (6.10.2026).

   Suunnitelman yhteinen kayttaytyminen (kytkeAnkkurit, paivita,
   componentDidMount, kaynnistaVerkko, laske) yhdessa paikassa. Toimii
   vain kun .mo-root on nakyvissa eli max-width: 767px. Tyopoydalla
   mikaan tasta ei kaynnisty.

   - Ylapalkki: piiloon alas vieritettaessa, takaisin ylos vieritettaessa,
     lasitausta heron jalkeen, etusivulla vaalea/tumma teema osion mukaan.
   - Valikko: CSS-checkbox (kuori.css). Tama sulkee sen linkista, Escista
     ja takaisin-painikkeella palattaessa.
   - Lomakeikkunat (#lomake, #tarjous, #hakemus) avautuvat alhaalta, eivat
     vierita. Lahetys avaa sahkopostin samalla sisallolla kuin sivuston
     YhteysIkkuna ja HakemusIkkuna (hakemusMailto).
   - Muut ankkurit hyppaavat suoraan kohteeseen, otsikkopalkki (76 px)
     huomioiden. Kartoituslinkit ([data-varaus]) avaa Kehotukset.tsx.
   - CTA-palkki liukuu pois kun sivun oma CTA on nakyvissa.
   - Paljastukset (.mo-rv ...), laskurit ([data-laske] + [data-luku]),
     parallaksi ([data-px]), korttipinot ([data-pino] + [data-kortti]).
   - Taustan verkkokangas ([data-mo-verkko] canvas) ja sen savyliuku
     ([data-verkko]-kaistat). */

import { useEffect } from "react";
import { hakemusMailto } from "@/app/toihin-meille/hakemus";
import { openConsentSettings } from "@/app/components/consent/consent";
import { MOBIILI, hyppaa, kuuntele, onMobiili, pyyda, rajaa, reduce, tilaNyt, type Tila } from "./vieritys";

export type VerkkoTila = "etu" | "syaani" | "meista" | "toihin";
export type Otsake =
  /** Ison sivun palkki: KA = heron vierityskaaren pituus (suunnitelman KA tai 650),
      piilo/lasi = rajat muodossa KA + HV + lisa. teema = etusivun vaalea/tumma. */
  | { tapa: "iso"; ka: number; piilo: number; lasi: number; teema?: boolean }
  | { tapa: "pieni" };

type Props = {
  otsake: Otsake;
  /** Taustan verkko: siemen (suunnitelman `let a = N`), tila ja pohjavari (savy() ilman kaistoja). */
  verkko?: { siemen: number; tila: VerkkoTila; pohja: [number, number, number] };
  /** Lisavalitsimet paljastukselle (oletus .mo-rv, .mo-rv-k, .mo-rv-s, .mo-rv-z, .mo-rv-n). */
  paljastus?: string;
};

const PALJASTUS = ".mo-rv, .mo-rv-k, .mo-rv-s, .mo-rv-z, .mo-rv-n";
const LOMAKE = new Set(["lomake", "tarjous", "hakemus"]);
const OTSAKE_KORKEUS = 76;

const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export default function Moottori({ otsake, verkko, paljastus }: Props) {
  useEffect(() => {
    let lopetus: (() => void) | null = null;
    const aloita = () => {
      if (lopetus || !onMobiili()) return;
      const juuri = document.querySelector<HTMLElement>(".mo-root");
      if (!juuri) return;
      lopetus = kayta(juuri, otsake, verkko, paljastus);
    };
    const mq = matchMedia(MOBIILI);
    const vaihto = () => {
      if (mq.matches) aloita();
      else if (lopetus) {
        lopetus();
        lopetus = null;
      }
    };
    aloita();
    mq.addEventListener("change", vaihto);
    return () => {
      mq.removeEventListener("change", vaihto);
      lopetus?.();
    };
    // Asetukset ovat sivukohtaisia vakioita.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function kayta(juuri: HTMLElement, otsake: Otsake, verkko: Props["verkko"], paljastus?: string) {
  const siivous: Array<() => void> = [];
  const R = reduce();
  const html = document.documentElement;

  /* ---------------- VALIKKO ---------------- */
  const cb = juuri.querySelector<HTMLInputElement>("#m-wv-auki");
  const suljeValikko = () => {
    if (cb && cb.checked) {
      cb.checked = false;
      return true;
    }
    return false;
  };
  const pageshow = () => suljeValikko();
  window.addEventListener("pageshow", pageshow);
  siivous.push(() => window.removeEventListener("pageshow", pageshow));
  suljeValikko();

  /* ---------------- LOMAKEIKKUNA ---------------- */
  const ik = juuri.querySelector<HTMLElement>(".mo-ik");
  let paluu: HTMLElement | null = null;
  const avaa = (n: HTMLElement) => {
    if (!ik) return;
    paluu = n;
    ik.classList.remove("mo-valmis");
    ik.classList.add("mo-auki");
    ik.setAttribute("aria-hidden", "false");
    html.classList.add("mo-lukko");
    const r = ik.querySelector<HTMLElement>(".mo-ik-rulla");
    if (r) r.scrollTop = 0;
    window.setTimeout(() => ik.querySelector<HTMLElement>(".mo-ik-laatikko")?.focus({ preventScroll: true }), 60);
  };
  const sulje = () => {
    if (!ik || !ik.classList.contains("mo-auki")) return;
    ik.classList.remove("mo-auki");
    ik.setAttribute("aria-hidden", "true");
    html.classList.remove("mo-lukko");
    paluu?.focus?.({ preventScroll: true });
  };
  siivous.push(() => html.classList.remove("mo-lukko"));

  /* ---------------- ANKKURIT ---------------- */
  const kohdeY = (id: string) => {
    const t = document.getElementById("m-" + id) ?? (id.startsWith("m-") ? document.getElementById(id) : null);
    if (!t || !juuri.contains(t)) return null;
    return t.getBoundingClientRect().top + window.scrollY - OTSAKE_KORKEUS;
  };
  const mene = (id: string, n: HTMLElement) => {
    const oli = suljeValikko();
    if (LOMAKE.has(id) && ik) {
      window.setTimeout(() => avaa(n), oli ? 320 : 0);
      return;
    }
    const hyppy = () => {
      const y = kohdeY(id);
      if (y != null) hyppaa(y);
    };
    if (oli) window.setTimeout(hyppy, 380);
    else hyppy();
  };
  const klikki = (e: Event) => {
    const k = e as KeyboardEvent;
    const t = e.target as Element | null;
    if (!t || !t.closest) return;
    if (e.type === "keydown" && k.key === "Escape") {
      sulje();
      suljeValikko();
      return;
    }
    if (!juuri.contains(t)) return;
    if (e.type === "click" && t.closest("[data-sulje]")) {
      e.preventDefault();
      sulje();
      return;
    }
    if (e.type === "click" && t.closest("[data-mo-evasteet]")) {
      e.preventDefault();
      openConsentSettings();
      return;
    }
    const n = t.closest<HTMLElement>("[data-ankkuri]");
    if (n) {
      if (e.type === "keydown" && k.key !== "Enter" && k.key !== " ") return;
      e.preventDefault();
      e.stopPropagation();
      mene(n.getAttribute("data-ankkuri") || "", n);
      return;
    }
    if (e.type !== "click") return;
    const a = t.closest<HTMLAnchorElement>("a[href]");
    if (!a) return;
    const me = e as MouseEvent;
    if (me.button !== 0 || me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return;
    if (a.hasAttribute("data-varaus")) {
      /* Kehotukset avaa varausikkunan; valikko suljetaan alta. */
      suljeValikko();
      return;
    }
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#m-")) {
      e.preventDefault();
      e.stopPropagation();
      mene(href.slice(3), a);
      return;
    }
    /* Valikon linkki toiselle sivulle: valikko kiinni ennen siirtymaa. */
    if (a.closest(".mo-wv-ov")) suljeValikko();
  };
  /* Kaappausvaihe: ehditaan ennen Kehotukset.tsx:n dokumenttikuuntelijaa,
     joka ohjaa saman sivun #-linkit tyopoydan ikkunoihin. */
  document.addEventListener("click", klikki, true);
  document.addEventListener("keydown", klikki, true);
  siivous.push(() => {
    document.removeEventListener("click", klikki, true);
    document.removeEventListener("keydown", klikki, true);
  });

  /* Toiselta sivulta tultaessa (esim. /#referenssit): mobiilin oma kohde. */
  if (location.hash.length > 1) {
    const id = decodeURIComponent(location.hash.slice(1));
    const hyppy = () => {
      const y = kohdeY(id);
      if (y != null) hyppaa(y);
    };
    requestAnimationFrame(hyppy);
    const k = window.setTimeout(hyppy, 400);
    siivous.push(() => window.clearTimeout(k));
  }

  /* ---------------- LOMAKKEEN LAHETYS ---------------- */
  if (ik) {
    const f = ik.querySelector("form");
    const laheta = (e: Event) => {
      e.preventDefault();
      if (!f) return;
      let ok = true;
      f.querySelectorAll<HTMLInputElement>("input[required]").forEach((i) => {
        const v = i.value.trim();
        const bad = !v || (i.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));
        i.classList.toggle("mo-ik-virhe", bad);
        if (bad && ok) {
          ok = false;
          i.focus();
        }
      });
      if (!ok) return;
      const d = new FormData(f);
      const k = (x: string) => String(d.get(x) ?? "").trim();
      const hak = ik.getAttribute("data-ikkuna") === "hakemus";
      let url: string;
      if (hak) url = hakemusMailto(d, d.getAll("osaaminen").map(String));
      else {
        /* Sama sisalto kuin YhteysIkkuna.tsx:n laheta(). */
        const valitut = d.getAll("palvelu").map(String);
        const rivit = [
          `Nimi: ${k("nimi")}`,
          `Puhelin: ${k("puhelin")}`,
          `Sähköposti: ${k("sahkoposti")}`,
          `Yritys: ${k("yritys")}`,
          `Palvelu: ${valitut.join(", ") || "ei valittu"}`,
          "",
          k("viesti"),
        ];
        const aihe = `Yhteydenotto: ${valitut.join(", ") || "WS Media"}`;
        url = `mailto:info@wsmedia.fi?subject=${encodeURIComponent(aihe)}&body=${encodeURIComponent(rivit.join("\n"))}`;
      }
      window.location.href = url;
      ik.classList.add("mo-valmis");
      const r = ik.querySelector<HTMLElement>(".mo-ik-rulla");
      if (r) r.scrollTop = 0;
    };
    const syote = (e: Event) => (e.target as HTMLElement).classList?.remove("mo-ik-virhe");
    f?.addEventListener("submit", laheta);
    f?.addEventListener("input", syote);
    siivous.push(() => {
      f?.removeEventListener("submit", laheta);
      f?.removeEventListener("input", syote);
    });
  }

  /* ---------------- PALJASTUKSET JA LASKURIT ---------------- */
  const laskurit = (alue: Element) => {
    const luvut = [...alue.querySelectorAll<HTMLElement>("[data-luku]")];
    const palkit = [...alue.querySelectorAll<HTMLElement>("[data-luku-palkki]")];
    if (R) return;
    const alku = performance.now();
    const askel = (nyt: number) => {
      const p = Math.min(1, (nyt - alku) / 1700);
      const L = 1 - Math.pow(1 - p, 3);
      luvut.forEach((n) => (n.textContent = fmt(Number(n.dataset.luku) * L) + (n.dataset.lukuJalki ?? "")));
      palkit.forEach((n) => (n.style.transform = `scaleX(${L.toFixed(4)})`));
      if (p < 1) siivousRaf = requestAnimationFrame(askel);
    };
    siivousRaf = requestAnimationFrame(askel);
  };
  let siivousRaf = 0;
  siivous.push(() => cancelAnimationFrame(siivousRaf));
  /* Palvelimen HTML:ssa luvut ovat lopullisia (ilman JS:aa ja hakukoneelle).
     Ennen paljastusta ne nollataan; alue on silloin viela nakymaton. */
  if (!R) {
    juuri.querySelectorAll<HTMLElement>("[data-laske]:not(.mo-on)").forEach((a) => {
      a.querySelectorAll<HTMLElement>("[data-luku]").forEach((n) => (n.textContent = fmt(0) + (n.dataset.lukuJalki ?? "")));
      a.querySelectorAll<HTMLElement>("[data-luku-palkki]").forEach((n) => (n.style.transform = "scaleX(0)"));
    });
  }
  const valitsin = paljastus ? `${PALJASTUS}, ${paljastus}` : PALJASTUS;
  const kaikki = [...juuri.querySelectorAll<HTMLElement>(valitsin)];
  const paljasta = (n: Element) => {
    n.classList.add("mo-on");
    n.dispatchEvent(new CustomEvent("mo:on", { bubbles: true }));
    if (n.hasAttribute("data-laske")) laskurit(n);
  };
  if (R || typeof IntersectionObserver === "undefined") kaikki.forEach(paljasta);
  else {
    const io = new IntersectionObserver(
      (ent) =>
        ent.forEach((e) => {
          if (!e.isIntersecting) return;
          paljasta(e.target);
          io.unobserve(e.target);
        }),
      { threshold: 0.12 },
    );
    kaikki.forEach((n) => io.observe(n));
    siivous.push(() => io.disconnect());
  }

  /* ---------------- YLAPALKKI ---------------- */
  const hdr = juuri.querySelector<HTMLElement>("[data-mo-otsake]");
  const teemat = otsake.tapa === "iso" && otsake.teema ? [...juuri.querySelectorAll<HTMLElement>("[data-teema]")] : [];
  let hdrTeema = "tumma";
  const aseta = (el: HTMLElement | null, k: string, v: string | null) => {
    if (!el) return;
    if (v == null) {
      if (el.hasAttribute(k)) el.removeAttribute(k);
    } else if (el.getAttribute(k) !== v) el.setAttribute(k, v);
  };

  /* ---------------- CTA-PALKKI ---------------- */
  const palkki = juuri.querySelector<HTMLElement>("[data-mo-palkki]");
  const pieniPalkki = palkki?.getAttribute("data-mo-palkki") === "pieni";
  let ctat: HTMLElement[] | null = null;
  const keraa = (HV: number) => {
    ctat = [...juuri.querySelectorAll<HTMLElement>('[data-ankkuri="lomake"], [data-ankkuri="tarjous"], [data-ankkuri="hakemus"], [data-varaus], form')].filter(
      (n) => !n.closest(".mo-ik") && !n.closest(".mo-wv-ov") && !n.closest("[data-mo-palkki]") && !n.closest("[data-mo-otsake]") && n.getBoundingClientRect().top + window.scrollY > HV + 60,
    );
  };
  const kk = window.setTimeout(() => {
    ctat = null;
    pyyda();
  }, 1200);
  siivous.push(() => window.clearTimeout(kk));
  let ctaNakyy = false;

  /* ---------------- PARALLAKSI JA KORTTIPINOT ---------------- */
  const px = [...juuri.querySelectorAll<HTMLElement>("[data-px]")];
  type Pino = { kortit: HTMLElement[]; alku: number; askel: number; oma: boolean; matka: number; sk: number; hi: number };
  const pinot: Pino[] = [...juuri.querySelectorAll<HTMLElement>("[data-pino]")].map((p) => {
    const c = JSON.parse(p.getAttribute("data-pino") || "{}");
    return { kortit: [...p.querySelectorAll<HTMLElement>("[data-kortti]")], alku: c.alku ?? 84, askel: c.askel ?? 14, oma: !!c.oma, matka: c.matka ?? -40, sk: c.sk ?? 0.06, hi: c.hi ?? 0.45 };
  });
  const pxArvot: number[] = px.map(() => NaN);
  const pinoArvot: number[][] = pinot.map((p) => p.kortit.map(() => 0));

  const irrota = kuuntele({
    lue: (t: Tila) => {
      // Teema: [data-teema], jonka alue kattaa y = 34 nakymassa.
      if (teemat.length) {
        let tm = "tumma";
        for (const n of teemat) {
          const r = n.getBoundingClientRect();
          if (r.top <= 34 && r.bottom > 34) tm = n.getAttribute("data-teema") || "tumma";
        }
        hdrTeema = tm;
      }
      // CTA-osio nakyvissa?
      if (palkki) {
        if (!ctat) keraa(t.HV);
        const ala = t.HV - palkki.offsetHeight;
        ctaNakyy = ctat!.some((n) => {
          const r = n.getBoundingClientRect();
          return r.height > 0 && r.bottom > 70 && r.top < ala - 10;
        });
      }
      px.forEach((n, i) => {
        const r = (n.parentElement?.parentElement ?? n).getBoundingClientRect();
        const s = (r.top + r.height / 2) / t.HV - 0.5;
        pxArvot[i] = t.reduce ? 0 : rajaa(-s * 80, -50, 50);
      });
      pinot.forEach((p, j) => {
        const rr = p.kortit.map((n) => n.getBoundingClientRect());
        pinoArvot[j] = rr.map((r, i) => {
          const seur = rr[i + 1];
          if (!seur || t.reduce) return 0;
          const st = p.alku + (p.oma ? i : i + 1) * p.askel;
          const matka = p.matka < 0 ? Math.max(1, r.height + p.matka) : p.matka;
          return rajaa(1 - (seur.top - st) / matka);
        });
      });
    },
    kirjoita: (t: Tila) => {
      if (hdr) {
        if (otsake.tapa === "iso") {
          const piilo = !t.reduce && t.y > otsake.ka + t.HV + otsake.piilo && !t.ylos;
          aseta(hdr, "data-piilo", piilo ? "1" : null);
          aseta(hdr, "data-lasi", t.y > otsake.ka + t.HV + otsake.lasi ? "1" : null);
          if (otsake.teema) aseta(hdr, "data-teema", hdrTeema);
        } else {
          aseta(hdr, "data-piilo", t.suunta > 0 && t.y > 700 ? "1" : null);
          aseta(hdr, "data-lasi", t.y > 30 ? "1" : null);
        }
      }
      if (palkki) {
        if (pieniPalkki) aseta(palkki, "data-nakyy", t.y > 700 ? "1" : null);
        const piiloon = ctaNakyy;
        if ((palkki.getAttribute("data-piilo") === "1") !== piiloon) {
          aseta(palkki, "data-piilo", piiloon ? "1" : null);
          palkki.setAttribute("aria-hidden", piiloon ? "true" : "false");
          palkki.inert = piiloon;
        }
      }
      px.forEach((n, i) => {
        const v = pxArvot[i];
        if (n.dataset.moPx !== v.toFixed(1)) {
          n.dataset.moPx = v.toFixed(1);
          n.style.transform = `translateY(${v.toFixed(1)}px)`;
        }
      });
      pinot.forEach((p, j) =>
        p.kortit.forEach((n, i) => {
          const k = pinoArvot[j][i];
          const tunnus = k.toFixed(3);
          if (n.dataset.moK === tunnus) return;
          n.dataset.moK = tunnus;
          n.style.transform = `scale(${(1 - p.sk * k).toFixed(4)})`;
          const h = n.querySelector<HTMLElement>("[data-kortti-himmea]");
          if (h) h.style.opacity = (p.hi * k).toFixed(3);
        }),
      );
    },
  });
  siivous.push(irrota);

  /* ---------------- VERKKOKANGAS ---------------- */
  if (verkko) {
    const loppu = kaynnistaVerkko(juuri, verkko);
    siivous.push(loppu);
  }

  /* ---------------- KUVIEN LAISKA LATAUS ----------------
     Selaimen oma loading="lazy" hakee kuvat jo noin 1250-2500 px:n
     paasta, eli puhelimessa myos heron alla olevat logot ja korttikuvat
     heti ensimmaisen piirron aikana, jolloin ne kilpailevat LCP:n kanssa.
     Tassa kuvat ([data-mo-src], [data-mo-srcset], [data-mo-poster],
     [data-mo-bg]) haetaan vasta sivun latauduttua ja kun ne ovat
     nakyman paassa. Vaakakaruselli ladataan kokonaan kun se lahestyy,
     ettei pyyhkaisy paljasta tyhjia kortteja. */
  siivous.push(lataaKuvat(juuri));

  /* Uudelleenmittaus kun sisalto muuttuu (UKK auki, kuvat latautuivat). */
  const mitat = () => {
    ctat = null;
    pyyda();
  };
  window.addEventListener("load", mitat);
  juuri.addEventListener("mo:mitat", mitat);
  siivous.push(() => {
    window.removeEventListener("load", mitat);
    juuri.removeEventListener("mo:mitat", mitat);
  });

  return () => siivous.forEach((f) => f());
}

/* ==================================================================
   VERKKOKANGAS. Suunnitelman kaynnistaVerkko() ja savy() sellaisenaan;
   kaksi eroa toteutuksessa:
   1. Taustan savyliuku piirretaan samaan canvasiin. Suunnitelma kirjoitti
      sen joka kehys linear-gradientiksi erilliselle nakyman kokoiselle
      kerrokselle, joka maalautui joka kehys uudelleen.
   2. Kangas piirtaa vain kun se on nakyvissa, ja kaynnistyy vasta sivun
      latauduttua, jottei se kilpaile ensimmaisen piirron kanssa.
   Leveys on nakyman leveys (suunnitelmassa 390).
   ================================================================== */
type Kaista = { Y: number; rgb: number[]; tumma: number; W: number; a: number };

function kaynnistaVerkko(juuri: HTMLElement, cfg: NonNullable<Props["verkko"]>) {
  const cv = juuri.querySelector<HTMLCanvasElement>("[data-mo-verkko]");
  if (!cv) return () => {};
  const ctx = cv.getContext("2d");
  if (!ctx) return () => {};
  let loppu = false;
  let raf = 0;
  const R = reduce();
  const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const kerros = juuri.querySelector<HTMLElement>("[data-kerros]");
  const kaistaEl = [...juuri.querySelectorAll<HTMLElement>("[data-verkko]")];
  let kaistat: Kaista[] = [];
  let lt = 0;

  const savy = (Y: number) => {
    const ks = kaistat;
    if (!ks.length) return { rgb: cfg.pohja, d: cfg.tila === "etu" ? 0 : 1, a: 1 };
    let c = ks[0].rgb.slice();
    let d = ks[0].tumma;
    let al = ks[0].a;
    for (let i = 1; i < ks.length; i++) {
      const Wk = ks[i].W || 460;
      const u = rajaa((Y - (ks[i].Y - Wk)) / (2 * Wk));
      if (u <= 0) break;
      const m = u * u * (3 - 2 * u);
      c = c.map((v, k) => v + (ks[i].rgb[k] - v) * m);
      d = d + (ks[i].tumma - d) * m;
      al = al + (ks[i].a - al) * m;
    }
    if (cfg.tila !== "etu") d = 1;
    if (cfg.tila === "meista" || cfg.tila === "toihin") al = 1;
    return { rgb: c, d, a: al };
  };

  let W = 0;
  let HH = 0;
  let pts: { x0: number; y0: number; vx: number; vy: number }[] = [];
  const PX = 220, PY = 900, LINK = 175, SP = 14;
  const alusta = () => {
    const t = tilaNyt();
    W = t.W;
    HH = t.HV;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(HH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    let a = cfg.siemen;
    const rnd = () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t2 = Math.imul(a ^ (a >>> 15), 1 | a);
      t2 = (t2 + Math.imul(t2 ^ (t2 >>> 7), 61 | t2)) ^ t2;
      return ((t2 ^ (t2 >>> 14)) >>> 0) / 4294967296;
    };
    const fw = W + PX, fh = HH + PY;
    const n = Math.round((fw * fh) / 24000);
    pts = Array.from({ length: n }, () => ({ x0: rnd() * fw, y0: rnd() * fh, vx: (rnd() - 0.5) * 2 * SP, vy: (rnd() - 0.5) * 2 * SP }));
  };
  const taita = (x: number, l: number) => {
    const m = ((x % (2 * l)) + 2 * l) % (2 * l);
    return m > l ? 2 * l - m : m;
  };
  const vari = (d: number, al: number) =>
    cfg.tila === "etu"
      ? `rgba(${Math.round(31 + 80 * d)},${Math.round(74 + 162 * d)},${Math.round(110 + 145 * d)},${al.toFixed(3)})`
      : `rgba(111,236,255,${al.toFixed(3)})`;

  let sp = 0;
  let nakyvissa = true;
  const piirra = (nyt: number) => {
    if (loppu) return;
    raf = requestAnimationFrame(piirra);
    if (!nakyvissa || document.hidden) return;
    const y = window.scrollY;
    const t = R ? 0 : nyt / 1000;
    const max = Math.max(1, korkeus - HH);
    sp += (Math.min(1, y / max) - sp) * 0.12;
    const ox = -Math.sin(sp * Math.PI) * PX, oy = -sp * PY;
    const fw = W + PX, fh = HH + PY;
    const pohja = y + lt;
    // Taustan savyliuku (suunnitelman tausta.gradientti, 53 px:n valein).
    const g = ctx.createLinearGradient(0, 0, 0, HH);
    for (let yy = 0; yy <= HH; yy += 53) {
      const c = savy(pohja + yy).rgb.map((v) => Math.round(v));
      g.addColorStop(Math.min(1, yy / HH), `rgb(${c.join(",")})`);
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, HH);
    const xs: number[] = [], ys: number[] = [];
    for (const p of pts) {
      const x = taita(p.x0 + p.vx * t, fw) + ox, yv = taita(p.y0 + p.vy * t, fh) + oy;
      if (x < -LINK || x > W + LINK || yv < -LINK || yv > HH + LINK) continue;
      xs.push(x);
      ys.push(yv);
    }
    ctx.lineWidth = 0.85;
    for (let i = 0; i < xs.length; i++)
      for (let j = i + 1; j < xs.length; j++) {
        const dx = xs[i] - xs[j], dy = ys[i] - ys[j], dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > LINK) continue;
        const ym = (ys[i] + ys[j]) / 2;
        const s = savy(pohja + ym);
        let al: number;
        if (cfg.tila === "etu") al = (1 - dist / LINK) * 0.46 * (0.62 - 0.07 * s.d) * s.a;
        else if (cfg.tila === "syaani") al = (1 - dist / LINK) * 0.46 * 0.55 * s.a;
        else if (cfg.tila === "meista") al = (1 - dist / LINK) * 0.46 * 0.55;
        else al = (1 - dist / LINK) * 0.25;
        ctx.strokeStyle = vari(s.d, al);
        ctx.beginPath();
        ctx.moveTo(xs[i], ys[i]);
        ctx.lineTo(xs[j], ys[j]);
        ctx.stroke();
      }
    for (let i = 0; i < xs.length; i++) {
      const s = savy(pohja + ys[i]);
      let al: number;
      if (cfg.tila === "etu") al = 0.55 * (0.62 - 0.07 * s.d) * s.a;
      else if (cfg.tila === "syaani") al = 0.55 * 0.55 * s.a;
      else al = 0.3;
      ctx.fillStyle = vari(s.d, al);
      ctx.beginPath();
      ctx.arc(xs[i], ys[i], 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  /* Kaistat, kerroksen ylareuna ja sivun korkeus luetaan vierityskehyksen
     lukuvaiheessa (vieritys.ts), ei piirtokehyksessa: piirto ei silloin
     pakota asettelua muiden kirjoitusten jalkeen. */
  let korkeus = document.documentElement.scrollHeight;
  const irrota = kuuntele({
    lue: (tl: Tila) => {
      const kr = kerros ? kerros.getBoundingClientRect().top : 0;
      lt = Math.max(0, Math.round(kr));
      korkeus = document.documentElement.scrollHeight;
      kaistat = kaistaEl.map((n) => {
        const r = n.getBoundingClientRect();
        const teema = n.getAttribute("data-teema");
        return {
          Y: Math.round(r.top + tl.y),
          rgb: hex(n.getAttribute("data-vari") || "#0b131d"),
          tumma: teema === "tumma" || teema === "tummaa" ? 1 : 0,
          W: cfg.tila === "etu" && n.getAttribute("data-raja") === "terava" ? 1 : 460,
          a: cfg.tila === "etu" || cfg.tila === "syaani" ? parseFloat(n.getAttribute("data-verkko-alfa") || "1") : 1,
        };
      });
    },
  });

  // Piirretaan vain kun kangas on nakyvissa (kerros on ruudulla).
  const io = new IntersectionObserver((e) => (nakyvissa = e.some((x) => x.isIntersecting)), { rootMargin: "100px 0px" });
  io.observe(kerros ?? cv);
  const koko = () => {
    const t = tilaNyt();
    if (t.W !== W || t.HV !== HH) alusta();
  };
  window.addEventListener("resize", koko, { passive: true });

  // Kaynnistys vasta latauksen jalkeen ja joutoajalla: ei ensimmaisen piirron tielle.
  let ajastin = 0;
  const kaynnista = () => {
    if (loppu) return;
    alusta();
    raf = requestAnimationFrame(piirra);
  };
  const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  const odota = () => {
    if (ric) ajastin = ric(kaynnista, { timeout: 1500 });
    else ajastin = window.setTimeout(kaynnista, 200);
  };
  if (document.readyState === "complete") odota();
  else window.addEventListener("load", odota, { once: true });

  return () => {
    loppu = true;
    irrota();
    cancelAnimationFrame(raf);
    io.disconnect();
    window.removeEventListener("resize", koko);
    window.removeEventListener("load", odota);
    const cic = (window as unknown as { cancelIdleCallback?: (n: number) => void }).cancelIdleCallback;
    if (ric && cic) cic(ajastin);
    else window.clearTimeout(ajastin);
  };
}

const KUVA = "[data-mo-src], [data-mo-srcset], [data-mo-poster], [data-mo-bg]";
function asetaKuva(n: HTMLElement) {
  const d = n.dataset;
  if (d.moSrcset) {
    n.setAttribute("srcset", d.moSrcset);
    delete d.moSrcset;
  }
  if (d.moSrc) {
    n.setAttribute("src", d.moSrc);
    delete d.moSrc;
  }
  if (d.moPoster) {
    n.setAttribute("poster", d.moPoster);
    delete d.moPoster;
  }
  if (d.moBg) {
    n.style.backgroundImage = `url(${d.moBg})`;
    delete d.moBg;
  }
}
function lataaKuvat(juuri: HTMLElement) {
  let io: IntersectionObserver | null = null;
  let loppu = false;
  const vieritettava = (n: HTMLElement) => {
    for (let p = n.parentElement; p && p !== juuri; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX;
      if (o === "auto" || o === "scroll") return p;
    }
    return n;
  };
  const aloita = () => {
    if (loppu) return;
    const kohteet = new Map<Element, HTMLElement[]>();
    juuri.querySelectorAll<HTMLElement>(KUVA).forEach((n) => {
      const k = vieritettava(n);
      const l = kohteet.get(k);
      if (l) l.push(n);
      else kohteet.set(k, [n]);
    });
    if (typeof IntersectionObserver === "undefined") {
      kohteet.forEach((l) => l.forEach(asetaKuva));
      return;
    }
    io = new IntersectionObserver(
      (ent) =>
        ent.forEach((e) => {
          if (!e.isIntersecting) return;
          kohteet.get(e.target)?.forEach(asetaKuva);
          io?.unobserve(e.target);
        }),
      { rootMargin: "100% 0px 100% 0px" },
    );
    kohteet.forEach((_, k) => io!.observe(k));
  };
  if (document.readyState === "complete") aloita();
  else window.addEventListener("load", aloita, { once: true });
  return () => {
    loppu = true;
    io?.disconnect();
    window.removeEventListener("load", aloita);
  };
}
