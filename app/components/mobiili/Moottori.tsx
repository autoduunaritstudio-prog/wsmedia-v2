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
     YhteysIkkuna ja HakemusIkkuna: /api/lomake (lahetaLomake, lahetaHakemus).
   - Muut ankkurit hyppaavat suoraan kohteeseen, otsikkopalkki (76 px)
     huomioiden. Kartoituslinkit ([data-varaus]) avaa Kehotukset.tsx.
   - CTA-palkki liukuu pois kun sivun oma CTA on nakyvissa.
   - Paljastukset (.mo-rv ...), laskurit ([data-laske] + [data-luku]),
     parallaksi ([data-px]), korttipinot ([data-pino] + [data-kortti]).
   - Taustan verkkokangas ([data-mo-verkko] canvas) ja sen savyliuku
     ([data-verkko]-kaistat). */

import { useEffect } from "react";
import { lahetaHakemus } from "@/app/toihin-meille/hakemus";
import { lahetaLomake } from "@/app/components/lomake";
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
    let lahettaa = false;
    const laheta = async (e: Event) => {
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
      const nappi = f.querySelector<HTMLButtonElement>("button[type=submit]");
      const virhe = f.querySelector<HTMLElement>("[data-mo-lomakevirhe]");
      if (lahettaa) return;
      lahettaa = true;
      const teksti = nappi?.textContent ?? "";
      if (nappi) {
        nappi.disabled = true;
        nappi.textContent = "Lähetetään…";
      }
      if (virhe) virhe.hidden = true;
      /* Sama lahetys kuin tyopoydan YhteysIkkuna ja HakemusIkkuna. */
      let viesti: string | null;
      if (hak) viesti = await lahetaHakemus(d, d.getAll("osaaminen").map(String));
      else {
        const valitut = d.getAll("palvelu").map(String);
        const ok = await lahetaLomake("yhteys", {
          nimi: k("nimi"),
          yritys: k("yritys"),
          puhelin: k("puhelin"),
          sahkoposti: k("sahkoposti"),
          palvelu: valitut.join(", "),
          viesti: k("viesti"),
          verkkosivu: k("verkkosivu"),
        });
        viesti = ok ? null : "Viesti ei lähtenyt. Yritä uudelleen, soita 040 564 8770 tai kirjoita osoitteeseen info@wsmedia.fi.";
      }
      lahettaa = false;
      if (nappi) {
        nappi.disabled = false;
        nappi.textContent = teksti;
      }
      if (viesti) {
        if (virhe) {
          virhe.textContent = viesti;
          virhe.hidden = false;
        }
        return;
      }
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
  /* Nopea vieritys (yli 1,5 nakymaa sekunnissa): paljastus ilman
     siirtymaa, ettei sisalto haivy sisaan vasta pysahtymisen jalkeen. */
  let nopeus = 0;
  let edY = window.scrollY;
  let edT = performance.now();
  const paljasta = (n: Element) => {
    const ht = performance.now();
    if (ht - edT > 0) {
      const v = (Math.abs(window.scrollY - edY) / (ht - edT)) * 1000;
      nopeus = ht - edT < 400 ? Math.max(v, nopeus * 0.5) : v;
    }
    edY = window.scrollY;
    edT = ht;
    if (!R && nopeus > 1.5 * (window.innerHeight || 664)) {
      n.classList.add("mo-heti");
      window.setTimeout(() => n.classList.remove("mo-heti"), 120);
    }
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
      /* Paljastus alkaa ennen kuin osio on ruudulla (neljannes nakymaa
         etukateen), jolloin se on jo valmis kun lukija ehtii sen kohdalle. */
      { threshold: 0, rootMargin: "0px 0px 25% 0px" },
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
      (n) => !n.closest(".mo-ik") && !n.closest(".mo-wv-ov") && !n.closest("[data-mo-palkki]") && !n.closest("[data-mo-otsake]"),
    );
    void HV;
  };
  /* Heron napit ovat pinnatussa herossa, jonka paalle kansi
     ([data-kerros]) nousee: kun kansi on nappien kohdalla, ne eivat enaa
     nay, vaikka niiden laatikko on yha ruudulla. */
  const kansi = juuri.querySelector<HTMLElement>("[data-kerros]");
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

  /* Suunnan hystereesi: piiloon vasta 12 px:n alasvierityksen jalkeen,
     esiin 24 px:n ylosvierityksen jalkeen (ei yhden pikselin
     varinasta). */
  let otsakePiilo = false;
  let kertyma = 0;
  let otsakeY = window.scrollY;
  const otsakeSuunta = (y: number, raja: number, reduce: boolean) => {
    const dy = y - otsakeY;
    otsakeY = y;
    if (reduce || y <= raja) {
      otsakePiilo = false;
      kertyma = 0;
      return false;
    }
    if (dy > 0) kertyma = kertyma > 0 ? kertyma + dy : dy;
    else if (dy < 0) kertyma = kertyma < 0 ? kertyma + dy : dy;
    if (!otsakePiilo && kertyma >= 12) otsakePiilo = true;
    else if (otsakePiilo && kertyma <= -24) otsakePiilo = false;
    return otsakePiilo;
  };

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
        const kansiY = kansi ? kansi.getBoundingClientRect().top : Infinity;
        ctaNakyy = ctat!.some((n) => {
          const r = n.getBoundingClientRect();
          if (kansi && !kansi.contains(n) && r.top >= kansiY - 10) return false; // kannen alla
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
          const piilo = otsakeSuunta(t.y, otsake.ka + t.HV + otsake.piilo, t.reduce);
          aseta(hdr, "data-piilo", piilo ? "1" : null);
          aseta(hdr, "data-lasi", t.y > otsake.ka + t.HV + otsake.lasi ? "1" : null);
          if (otsake.teema) aseta(hdr, "data-teema", hdrTeema);
        } else {
          aseta(hdr, "data-piilo", otsakeSuunta(t.y, 700, t.reduce) ? "1" : null);
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

  /* ---------------- HERO JAADYTETAAN KANNEN NOUSUN AJAKSI ----------------
     Kun kansi ([data-kerros]) nousee heron paalle, heron jatkuvat
     animaatiot ja videot pysahtyvat (.mo-hero-jaa, mobiili.css), ja hero on
     omana kerroksenaan (will-change: transform) vain taman ajan. Kun kansi
     palaa alas, ne jatkuvat. Lyhytvideoiden heroon ei kosketa. */
  const heroKaari = kansi && !juuri.classList.contains("mo-s-lyhytvideot") ? (kansi.previousElementSibling as HTMLElement | null) : null;
  let heroJaassa = false;
  let heroKerros = false;
  let jaaVideot: HTMLVideoElement[] = [];
  const irrotaJaa = heroKaari
    ? kuuntele({
        lue: (t: Tila) => {
          const kt = kansi!.getBoundingClientRect().top;
          /* will-change vain nousun ajan (kansi osittain heron paalla). */
          const kerros = kt < t.HV - 1 && kt > 0;
          if (kerros !== heroKerros) {
            heroKerros = kerros;
            heroKaari.classList.toggle("mo-hero-nousu", kerros);
          }
          const jaa = kt < t.HV - 1;
          if (jaa === heroJaassa) return;
          heroJaassa = jaa;
          heroKaari.classList.toggle("mo-hero-jaa", jaa);
          if (jaa) {
            jaaVideot = [...heroKaari.querySelectorAll("video")].filter((v) => !v.paused);
            jaaVideot.forEach((v) => v.pause());
          } else {
            jaaVideot.forEach((v) => v.play().catch(() => {}));
            jaaVideot = [];
          }
        },
      })
    : null;
  if (irrotaJaa) siivous.push(irrotaJaa);

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

  /* ---------------- JATKUVAT ANIMAATIOT TAUOLLE ----------------
     Jokainen toistuva (infinite) CSS-animaatio, myos ::before/::after,
     pysahtyy kun sen elementti on nakyman ulkopuolella (.mo-tauko,
     mobiili.css). Etsitaan kerran joutoajalla. */
  siivous.push(tauotaAnimaatiot(juuri));

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
   1. Taustan savyliuku on kaaren ([data-kerros]) sisainen kiintea kerros,
      joka rakennetaan kerran kaistoista ja vierii sivun mukana
      (rakennaSavy, 8.10.2026). Suunnitelma kirjoitti sen joka kehys
      nakyman kokoiselle kerrokselle; kangas piirtaa nyt vain viivat ja
      pisteet lapinakyvalle pohjalle.
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
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
  /* KEVENNYS (7.10.2026). Ulkoasu kuten ennen, kustannus pois:
     - enintaan 24 piirtoa sekunnissa ja vain kun kangas on nakyvissa
     - devicePixelRatio enintaan 1,5 (alusta)
     - savy() kerran kehyksessa 53 px:n kaistoille taulukkoon
     - viivat ja pisteet 6 lapinakyvyysluokkaan (etusivulla lisaksi 3
       savyluokkaa), yksi polku ja yksi strokeStyle per luokka
     - taustaliuku ei ole kankaassa vaan omana kerroksenaan (rakennaSavy). */
  const LUOKAT = 6;
  const AMAX = cfg.tila === "etu" ? 0.46 * 0.62 : cfg.tila === "toihin" ? 0.25 : 0.46 * 0.55;
  const PMAX = cfg.tila === "etu" ? 0.55 * 0.62 : cfg.tila === "syaani" ? 0.55 * 0.55 : 0.3;
  const SAVYT = cfg.tila === "etu" ? 3 : 1;
  const vari = (d: number, al: number) =>
    cfg.tila === "etu"
      ? `rgba(${Math.round(31 + 80 * d)},${Math.round(74 + 162 * d)},${Math.round(110 + 145 * d)},${al.toFixed(3)})`
      : `rgba(111,236,255,${al.toFixed(3)})`;
  const tyylit: string[][] = [];
  const pTyylit: string[][] = [];
  for (let sv = 0; sv < SAVYT; sv++) {
    const d = SAVYT === 1 ? 1 : sv / (SAVYT - 1);
    tyylit.push(Array.from({ length: LUOKAT }, (_, k) => vari(d, ((k + 0.5) / LUOKAT) * AMAX)));
    pTyylit.push(Array.from({ length: LUOKAT }, (_, k) => vari(d, ((k + 0.5) / LUOKAT) * PMAX)));
  }
  const polut: Path2D[] = [];
  const pPolut: Path2D[] = [];
  const ASKEL = 53;
  let taulu: { d: number; a: number }[] = [];
  let gradAvain = "";

  let sp = 0;
  let nakyvissa = true;
  let viimePiirto = 0;
  let viimeAvain = "";
  const piirra = (nyt: number) => {
    if (loppu) return;
    raf = requestAnimationFrame(piirra);
    if (!nakyvissa || document.hidden) return;
    const dt = nyt - viimePiirto;
    if (dt < 1000 / 24 - 2) return; // enintaan 24 kertaa sekunnissa
    viimePiirto = nyt;
    const y = window.scrollY;
    const t = R ? 0 : nyt / 1000;
    const max = Math.max(1, korkeus - HH);
    const kerroin = 1 - Math.pow(1 - 0.12, Math.min(dt, 200) / (1000 / 60));
    sp += (Math.min(1, y / max) - sp) * kerroin;
    const pohja = y + lt;
    const kaistaAvain = kaistat.map((k) => k.Y).join(",");
    // Liikkumaton tila (reduced motion, ei vieritysta): ei piirreta uudelleen.
    const avain = `${Math.round(pohja)}|${kaistaAvain}|${sp.toFixed(4)}|${W}x${HH}`;
    if (R && avain === viimeAvain) return;
    viimeAvain = avain;
    const ox = -Math.sin(sp * Math.PI) * PX, oy = -sp * PY;
    const fw = W + PX, fh = HH + PY;
    // Savytaulukko 53 px:n kaistoille (myos reunojen yli LINK verran):
    // viivojen ja pisteiden tummuus ja himmennys. Itse savyliuku on oma
    // kerroksensa kaaren sisalla (rakennaSavy), ei kankaassa.
    const gAvain = `${Math.round(pohja)}|${kaistaAvain}|${HH}`;
    if (gAvain !== gradAvain || !taulu.length) {
      gradAvain = gAvain;
      const n = Math.ceil((HH + 2 * LINK) / ASKEL) + 1;
      taulu = new Array(n);
      for (let k = 0; k < n; k++) {
        const sv = savy(pohja + k * ASKEL - LINK);
        taulu[k] = { d: sv.d, a: sv.a };
      }
    }
    const savyY = (yy: number) => taulu[Math.max(0, Math.min(taulu.length - 1, Math.round((yy + LINK) / ASKEL)))];
    ctx.clearRect(0, 0, W, HH);
    const xs: number[] = [], ys: number[] = [];
    for (const p of pts) {
      const x = taita(p.x0 + p.vx * t, fw) + ox, yv = taita(p.y0 + p.vy * t, fh) + oy;
      if (x < -LINK || x > W + LINK || yv < -LINK || yv > HH + LINK) continue;
      xs.push(x);
      ys.push(yv);
    }
    for (let i = 0; i < SAVYT * LUOKAT; i++) {
      polut[i] = new Path2D();
      pPolut[i] = new Path2D();
    }
    const luokka = (al: number, max: number) => Math.max(0, Math.min(LUOKAT - 1, Math.floor((al / max) * LUOKAT)));
    const savyLuokka = (d: number) => (SAVYT === 1 ? 0 : Math.round(d * (SAVYT - 1)));
    const kayta = new Uint8Array(SAVYT * LUOKAT);
    const pKayta = new Uint8Array(SAVYT * LUOKAT);
    for (let i = 0; i < xs.length; i++)
      for (let j = i + 1; j < xs.length; j++) {
        const dx = xs[i] - xs[j], dy = ys[i] - ys[j], d2 = dx * dx + dy * dy;
        if (d2 > LINK * LINK) continue;
        const dist = Math.sqrt(d2);
        const s = savyY((ys[i] + ys[j]) / 2);
        let al: number;
        if (cfg.tila === "etu") al = (1 - dist / LINK) * 0.46 * (0.62 - 0.07 * s.d) * s.a;
        else if (cfg.tila === "syaani") al = (1 - dist / LINK) * 0.46 * 0.55 * s.a;
        else if (cfg.tila === "meista") al = (1 - dist / LINK) * 0.46 * 0.55;
        else al = (1 - dist / LINK) * 0.25;
        if (al <= 0.004) continue;
        const k = savyLuokka(s.d) * LUOKAT + luokka(al, AMAX);
        polut[k].moveTo(xs[i], ys[i]);
        polut[k].lineTo(xs[j], ys[j]);
        kayta[k] = 1;
      }
    ctx.lineWidth = 0.85;
    for (let k = 0; k < SAVYT * LUOKAT; k++) {
      if (!kayta[k]) continue;
      ctx.strokeStyle = tyylit[Math.floor(k / LUOKAT)][k % LUOKAT];
      ctx.stroke(polut[k]);
    }
    for (let i = 0; i < xs.length; i++) {
      const s = savyY(ys[i]);
      let al: number;
      if (cfg.tila === "etu") al = 0.55 * (0.62 - 0.07 * s.d) * s.a;
      else if (cfg.tila === "syaani") al = 0.55 * 0.55 * s.a;
      else al = 0.3;
      const k = savyLuokka(s.d) * LUOKAT + luokka(al, PMAX);
      pPolut[k].moveTo(xs[i] + 1.6, ys[i]);
      pPolut[k].arc(xs[i], ys[i], 1.6, 0, Math.PI * 2);
      pKayta[k] = 1;
    }
    for (let k = 0; k < SAVYT * LUOKAT; k++) {
      if (!pKayta[k]) continue;
      ctx.fillStyle = pTyylit[Math.floor(k / LUOKAT)][k % LUOKAT];
      ctx.fill(pPolut[k]);
    }
  };

  const mittaaKaistat = (y: number): Kaista[] =>
    kaistaEl.map((n) => {
      const r = n.getBoundingClientRect();
      const teema = n.getAttribute("data-teema");
      return {
        Y: Math.round(r.top + y),
        rgb: hex(n.getAttribute("data-vari") || "#0b131d"),
        tumma: teema === "tumma" || teema === "tummaa" ? 1 : 0,
        W: cfg.tila === "etu" && n.getAttribute("data-raja") === "terava" ? 1 : 460,
        a: cfg.tila === "etu" || cfg.tila === "syaani" ? parseFloat(n.getAttribute("data-verkko-alfa") || "1") : 1,
      };
    });

  /* SAVYLIUKU OMANA KERROKSENA (8.10.2026). Ennen liuku piirrettiin
     kankaaseen 24 kertaa sekunnissa, ja tumma-vaalea-raja nyki
     vieritettaessa. Nyt [data-kerros]-kaaren sisalla on koko kaaren
     korkuinen kerros, jonka linear-gradient rakennetaan kerran kaistojen
     paikoista (sama savy(), kaistan leveys 460 px tai terava raja). Se
     vierii sivun mukana ilman JavaScriptia; uudelleen vain kun asettelu
     muuttuu. Kerrosjarjestys: savykerros alimpana, kangas (sticky) sen
     paalla, osiot ylimpana. */
  const savyKerros = kerros ? document.createElement("div") : null;
  if (savyKerros && kerros) {
    savyKerros.setAttribute("aria-hidden", "true");
    savyKerros.style.cssText = "position:absolute;left:0;right:0;top:0;height:100%;z-index:0;pointer-events:none";
    kerros.prepend(savyKerros);
  }
  let savyAvain = "";
  const rakennaSavy = () => {
    if (!kerros || !savyKerros || loppu) return;
    const y = window.scrollY;
    const kTop = kerros.getBoundingClientRect().top + y;
    const H = kerros.offsetHeight;
    kaistat = mittaaKaistat(y);
    const avain = `${Math.round(kTop)}|${H}|${kaistat.map((k) => k.Y).join(",")}`;
    if (avain === savyAvain) return;
    savyAvain = avain;
    const stopit: string[] = [];
    for (let yy = 0; yy <= H + ASKEL; yy += ASKEL) {
      const c = savy(kTop + yy).rgb.map((v) => Math.round(v));
      stopit.push(`rgb(${c.join(",")}) ${Math.min(yy, H)}px`);
    }
    savyKerros.style.background = `linear-gradient(180deg, ${stopit.join(", ")})`;
    // Kankaan oma kiintea taustavari pois: liuku nakyy sen lapi.
    for (const el of [...(cv.parentElement?.children ?? [])]) if (el !== cv) (el as HTMLElement).style.background = "transparent";
  };
  let savyRaf = 0;
  const pyydaSavy = () => {
    if (!savyRaf) savyRaf = requestAnimationFrame(() => { savyRaf = 0; rakennaSavy(); });
  };
  const ro = typeof ResizeObserver !== "undefined" && kerros ? new ResizeObserver(pyydaSavy) : null;
  if (ro && kerros) ro.observe(kerros);
  juuri.addEventListener("mo:mitat", pyydaSavy);
  window.addEventListener("load", pyydaSavy);
  document.fonts?.ready.then(pyydaSavy, () => {});
  pyydaSavy();

  /* Kaistat, kerroksen ylareuna ja sivun korkeus luetaan vierityskehyksen
     lukuvaiheessa (vieritys.ts), ei piirtokehyksessa: piirto ei silloin
     pakota asettelua muiden kirjoitusten jalkeen. */
  let korkeus = document.documentElement.scrollHeight;
  const irrota = kuuntele({
    lue: (tl: Tila) => {
      const kr = kerros ? kerros.getBoundingClientRect().top : 0;
      lt = Math.max(0, Math.round(kr));
      korkeus = document.documentElement.scrollHeight;
      kaistat = mittaaKaistat(tl.y);
    },
  });

  // Piirretaan vain kun kangas on nakyvissa (kerros on ruudulla).
  const io = new IntersectionObserver((e) => (nakyvissa = e.some((x) => x.isIntersecting)), { rootMargin: "100px 0px" });
  io.observe(kerros ?? cv);
  const koko = () => {
    const t = tilaNyt();
    if (t.W !== W || t.HV !== HH) {
      alusta();
      gradAvain = "";
    }
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
    cancelAnimationFrame(savyRaf);
    ro?.disconnect();
    juuri.removeEventListener("mo:mitat", pyydaSavy);
    window.removeEventListener("load", pyydaSavy);
    savyKerros?.remove();
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
      { rootMargin: "200% 0px" },
    );
    kohteet.forEach((_, k) => io!.observe(k));
  };
  /* Heti DOMContentLoadedin jalkeen joutoajalla (ei odoteta window.loadia). */
  const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  let ajastin = 0;
  const odota = () => {
    if (ric) ajastin = ric(aloita, { timeout: 600 });
    else ajastin = window.setTimeout(aloita, 50);
  };
  if (document.readyState !== "loading") odota();
  else document.addEventListener("DOMContentLoaded", odota, { once: true });
  return () => {
    loppu = true;
    io?.disconnect();
    document.removeEventListener("DOMContentLoaded", odota);
    const cic = (window as unknown as { cancelIdleCallback?: (n: number) => void }).cancelIdleCallback;
    if (ric && cic) cic(ajastin);
    else window.clearTimeout(ajastin);
  };
}

function tauotaAnimaatiot(juuri: HTMLElement) {
  let io: IntersectionObserver | null = null;
  let loppu = false;
  const etsi = () => {
    if (loppu) return;
    const kohteet = new Set<HTMLElement>();
    const toistuva = (cs: CSSStyleDeclaration) => cs.animationName !== "none" && cs.animationIterationCount.includes("infinite");
    juuri.querySelectorAll<HTMLElement>("*").forEach((n) => {
      if (n.closest(".mo-wv-ov, .mo-ik, .lataus")) return; // valikko ja ikkuna: omat tilansa
      if (toistuva(getComputedStyle(n)) || toistuva(getComputedStyle(n, "::after")) || toistuva(getComputedStyle(n, "::before"))) kohteet.add(n);
    });
    if (!kohteet.size || typeof IntersectionObserver === "undefined") return;
    io = new IntersectionObserver((ent) => ent.forEach((e) => (e.target as HTMLElement).classList.toggle("mo-tauko", !e.isIntersecting)), { rootMargin: "50px 0px" });
    kohteet.forEach((n) => {
      n.classList.add("mo-tauko");
      io!.observe(n);
    });
  };
  const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  const k = ric ? ric(etsi, { timeout: 2000 }) : window.setTimeout(etsi, 500);
  return () => {
    loppu = true;
    io?.disconnect();
    const cic = (window as unknown as { cancelIdleCallback?: (n: number) => void }).cancelIdleCallback;
    if (ric && cic) cic(k);
    else window.clearTimeout(k);
  };
}
