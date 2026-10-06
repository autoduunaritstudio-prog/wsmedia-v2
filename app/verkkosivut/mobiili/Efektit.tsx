"use client";

/* VERKKOSIVUJEN PUHELINVERSION OMAT TEHOSTEET (suunnitelman renderVals:
   h, sana, sisalto, tavat, ke, paketit, panPisteet, askeleet, ukk, laheta).
   Kirjoittaa suoraan DOMiin, ei renderoi mitaan. Yhteiset asiat (palkki,
   valikko, ikkunat, paljastukset, laskurit, korttipino, parallaksi,
   verkko) ovat Moottori.tsx:ssa. */

import { useEffect } from "react";
import { kuuntele, onMobiili, rajaa, reduce, type Tila } from "@/app/components/mobiili/vieritys";
import { asetteleHero } from "@/app/components/mobiili/heroAsettelu";
import { KE_TAB, LAATTA, PISTE, TAB, askelTila } from "./data";

const SPRITE = "/mobiili/verkkosivut-film-ikkuna.webp";
/* Suunnitelma: elokuva kelautuu 0..SC, kansi alkaa nousta KA:n kohdalla. */
const SC = 420;
const KA = 280;

const tuhannet = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export default function Efektit() {
  useEffect(() => {
    if (!onMobiili()) return;
    const juuri = document.querySelector<HTMLElement>(".mo-s-verkkosivut");
    if (!juuri) return;
    const q = <T extends Element = HTMLElement>(s: string) => juuri.querySelector<T>(s);
    const qa = <T extends Element = HTMLElement>(s: string) => [...juuri.querySelectorAll<T>(s)];
    const siivous: Array<() => void> = [];
    const mitat = () => juuri.dispatchEvent(new Event("mo:mitat"));
    const mitatPian = () => window.setTimeout(mitat, 60);

    /* ---------- HERO ---------- */
    const film = q("[data-vs=film]");
    const ruutu = q("[data-vs=ruutu]");
    const vihje = q("[data-vs=vihje]");
    const rengas = q<SVGCircleElement>("[data-vs=rengas]");
    const teksti = q("[data-vs=teksti]");
    const peitto = q("[data-vs=peitto]");
    let viime = "";
    /* Koodi-ikkuna alkaa ylapalkin alta ja pienenee tekstin ylapuolelle
       mahtuvaksi (heroAsettelu.ts); suojattava osa ruudun ylin 90 %. */
    siivous.push(asetteleHero({ hero: q("[data-vs=hero]"), kuva: film, kuvaY: 68, kuvaH: (k) => k.offsetHeight * 0.9, teksti }));
    siivous.push(
      kuuntele({
        kirjoita: (t: Tila) => {
          const { y, HV } = t;
          if (y > KA + 2 * HV + 200 && viime) return; // hero on jo kokonaan peitossa
          const pf = rajaa(y / SC);
          const f = Math.round(pf * 37);
          const kansi = rajaa((y - KA) / HV);
          const avain = `${f}|${kansi.toFixed(4)}|${y < 320 ? y : 320}|${HV}`;
          if (avain === viime) return;
          viime = avain;
          if (ruutu) ruutu.style.backgroundPosition = `${((f % 8) / 7) * 100}% ${(Math.floor(f / 8) / 4) * 100}%`;
          if (film) film.style.transform = `translateY(${(-60 * kansi).toFixed(1)}px)`;
          if (vihje) {
            vihje.style.opacity = (1 - rajaa((y - 200) / 110)).toFixed(3);
            vihje.style.transform = `translateX(-50%) translateY(${(6 * (1 - rajaa(y / 80))).toFixed(1)}px)`;
          }
          rengas?.setAttribute("stroke-dashoffset", (81.7 * (1 - pf)).toFixed(1));
          if (teksti) teksti.style.transform = `translateY(${(-50 * kansi).toFixed(1)}px)`;
          if (peitto) peitto.style.opacity = (0.6 * (1 - Math.pow(1 - kansi, 2))).toFixed(3);
        },
      }),
    );

    /* Elokuvan koko sarja (515 kt) haetaan vasta sivun latauduttua.
       Siihen asti ruudussa on ensimmainen kuva (verkkosivut-film-ikkuna-0.webp). */
    let peruttu = false;
    const lataaSarja = () => {
      const img = new Image();
      img.decoding = "async";
      img.src = SPRITE;
      const valmis = () => !peruttu && ruutu?.classList.add("mo-film-valmis");
      (img.decode ? img.decode() : Promise.resolve()).then(valmis, valmis);
    };
    if (document.readyState === "complete") lataaSarja();
    else window.addEventListener("load", lataaSarja, { once: true });
    siivous.push(() => {
      peruttu = true;
      window.removeEventListener("load", lataaSarja);
    });

    /* ---------- SANAVAIHTO 2,6 s valein heron aikana ----------
       H1:ssa on yksi span ja vain ensimmainen muoto; muut sanat ovat
       data-sanat-attribuutissa (|-eroteltu). Vaihto kirjoittaa tekstin ja
       kaynnistaa .mo-e-sana-animaation alusta, kuten ennen piilotetun
       spanin nakyviin tulo (display none -> inline-block) teki. */
    const sanaEl = q("[data-sanat]");
    const sanat = sanaEl?.dataset.sanat?.split("|") ?? [];
    let sana = 0;
    const ajastin = window.setInterval(() => {
      if (!sanaEl || sanat.length < 2) return;
      if (window.scrollY >= KA + (window.innerHeight || 844)) return;
      sana = (sana + 1) % sanat.length;
      sanaEl.textContent = sanat[sana];
      sanaEl.style.animation = "none";
      void sanaEl.offsetWidth;
      sanaEl.style.animation = "";
    }, 2600);
    siivous.push(() => window.clearInterval(ajastin));

    /* ---------- VALILEHDET JA LAATAT ---------- */
    /** Nayttaa ryhman kortin i ja piilottaa muut. Juuri nakyviin tullut
        kortti toistaa .mo-l-kortti-in-animaation (display none -> block),
        kuten suunnitelmassa avaimen vaihtuessa. */
    const nayta = (valitsin: string, i: number) =>
      qa(valitsin).forEach((n, k) => {
        if (n.hidden !== (k !== i)) n.hidden = k !== i;
      });
    const tabit = (valitsin: string, i: number) =>
      qa(valitsin).forEach((b, k) => {
        const on = k === i;
        b.style.background = on ? TAB.on.bg : TAB.ei.bg;
        b.style.color = on ? TAB.on.fg : TAB.ei.fg;
        b.setAttribute("aria-selected", String(on));
      });

    let kohta = 0;
    let tapa = 0;
    let kenelle = 0;
    let paketti = Number(q("[data-vs-paketti][aria-selected=true]")?.dataset.vsPaketti ?? 1);

    /* Hinnan laskuri paketin vaihtuessa (suunnitelman animoiHinta, 700 ms). */
    let hintaRaf = 0;
    const animoiHinta = (i: number) => {
      cancelAnimationFrame(hintaRaf);
      const el = q(`[data-vs-paketti-auki="${i}"] [data-vs-hinta]`);
      if (!el) return;
      const hn = Number(el.dataset.vsHinta);
      if (reduce()) {
        el.textContent = tuhannet(hn);
        return;
      }
      const alku = performance.now();
      const askel = (nyt: number) => {
        const p = Math.min(1, (nyt - alku) / 700);
        const a = 1 - Math.pow(1 - p, 3);
        el.textContent = tuhannet(Math.round((hn * a) / 10) * 10);
        if (p < 1) hintaRaf = requestAnimationFrame(askel);
      };
      el.textContent = "0";
      hintaRaf = requestAnimationFrame(askel);
    };
    siivous.push(() => cancelAnimationFrame(hintaRaf));

    let ukkAuki = 0;
    const klikki = (e: MouseEvent) => {
      const t = e.target as Element;
      const laatta = t.closest<HTMLElement>("[data-vs-kohta]");
      if (laatta) {
        const i = Number(laatta.dataset.vsKohta);
        if (i === kohta) return;
        kohta = i;
        qa("[data-vs-kohta]").forEach((b, k) => {
          const s = k === i ? LAATTA.on : LAATTA.ei;
          b.style.background = s.bg;
          b.style.boxShadow = s.reuna;
          b.style.color = s.fg;
          b.setAttribute("aria-pressed", String(k === i));
          b.querySelector("svg")?.setAttribute("stroke", s.ik);
        });
        nayta("[data-vs-kohta-auki]", i);
        mitatPian();
        return;
      }
      const tb = t.closest<HTMLElement>("[data-vs-tapa]");
      if (tb) {
        const i = Number(tb.dataset.vsTapa);
        if (i === tapa) return;
        tapa = i;
        tabit("[data-vs-tapa]", i);
        nayta("[data-vs-tapa-auki]", i);
        mitatPian();
        return;
      }
      const ke = t.closest<HTMLElement>("[data-vs-ke]");
      if (ke) {
        const i = Number(ke.dataset.vsKe);
        if (i === kenelle) return;
        kenelle = i;
        qa("[data-vs-ke]").forEach((b, k) => {
          const on = k === i;
          b.style.background = on ? KE_TAB[k].bg : TAB.ei.bg;
          b.style.color = on ? KE_TAB[k].fg : TAB.ei.fg;
          b.setAttribute("aria-selected", String(on));
        });
        nayta("[data-vs-ke-auki]", i);
        mitatPian();
        return;
      }
      const pk = t.closest<HTMLElement>("[data-vs-paketti]");
      if (pk) {
        const i = Number(pk.dataset.vsPaketti);
        if (i !== paketti) {
          paketti = i;
          tabit("[data-vs-paketti]", i);
          nayta("[data-vs-paketti-auki]", i);
          animoiHinta(i);
        }
        mitatPian();
        return;
      }
      const u = t.closest<HTMLElement>("[data-ukk]");
      if (u) {
        const i = Number(u.dataset.ukk);
        ukkAuki = ukkAuki === i ? -1 : i;
        qa("[data-ukk]").forEach((b) => {
          const on = Number(b.dataset.ukk) === ukkAuki;
          b.classList.toggle("mo-auki", on);
          b.setAttribute("aria-expanded", String(on));
          const v = q(`[data-ukk-vast="${b.dataset.ukk}"]`);
          if (v) v.hidden = !on;
        });
        mitatPian();
        return;
      }
      const kaikki = t.closest<HTMLElement>("[data-ukk-kaikki]");
      if (kaikki) {
        qa("[data-ukk-rivi]").forEach((r) => (r.hidden = false));
        kaikki.remove();
        mitatPian();
      }
    };
    juuri.addEventListener("click", klikki);
    siivous.push(() => juuri.removeEventListener("click", klikki));

    /* ---------- PANEELIKARUSELLI (Nakyvyys) ---------- */
    const pan = q("[data-vs=pan]");
    const panPisteet = pan?.nextElementSibling ? ([...pan.nextElementSibling.children] as HTMLElement[]) : [];
    let panI = 0;
    const onPan = () => {
      if (!pan) return;
      const i = rajaa(Math.round(pan.scrollLeft / 312), 0, 3);
      if (i === panI) return;
      panI = i;
      panPisteet.forEach((p, k) => {
        const s = k === i ? PISTE.on : PISTE.ei;
        p.style.width = `${s.w}px`;
        p.style.background = s.c;
      });
    };
    pan?.addEventListener("scroll", onPan, { passive: true });
    siivous.push(() => pan?.removeEventListener("scroll", onPan));

    /* ---------- PROSESSIN AIKAJANA ---------- */
    const ask = q("[data-vs=askeleet]");
    const askNro = q("[data-vs=askelnro]");
    const askPalkki = q("[data-vs=askelpalkki]");
    const askPisteet = qa("[data-vs-askel-piste]");
    const askKortit = qa("[data-vs-askel-kortti]");
    let A = 0;
    const onAsk = () => {
      if (!ask) return;
      const m = Math.max(1, ask.scrollWidth - ask.clientWidth);
      const i = ask.scrollLeft >= m - 4 ? 4 : rajaa(Math.round(ask.scrollLeft / 274), 0, 4);
      if (i === A) return;
      A = i;
      if (askNro) askNro.textContent = String(i + 1);
      if (askPalkki) askPalkki.style.transform = `scaleX(${(i * 25) / 100})`;
      askPisteet.forEach((p, k) => {
        const s = askelTila(k, i);
        p.style.background = s.bg;
        p.style.boxShadow = s.reuna;
      });
      askKortit.forEach((c, k) => {
        const s = askelTila(k, i);
        c.style.background = s.kbg;
        c.style.boxShadow = s.kreuna;
        const n = c.querySelector<HTMLElement>(".mo-l-nro");
        if (n) {
          n.style.background = s.bg;
          n.style.color = s.fg;
        }
      });
    };
    ask?.addEventListener("scroll", onAsk, { passive: true });
    siivous.push(() => ask?.removeEventListener("scroll", onAsk));

    /* ---------- TARJOUSPYYNTO (osion oma lomake) ---------- */
    const lomake = q<HTMLFormElement>("[data-vs=lomake]");
    const laheta = (e: Event) => {
      e.preventDefault();
      if (!lomake) return;
      const d = new FormData(lomake);
      const k = (x: string) => String(d.get(x) ?? "").trim();
      const rivit = [`Nimi: ${k("nimi")}`, `Sähköposti: ${k("email")}`, `Puhelin: ${k("puhelin")}`, `Paikkakunta: ${k("paikkakunta")}`, "Palvelu: Verkkosivut", "", k("viesti")];
      window.location.href = `mailto:info@wsmedia.fi?subject=${encodeURIComponent("Tarjouspyyntö: Verkkosivut")}&body=${encodeURIComponent(rivit.join("\n"))}`;
      const kiitos = q("[data-vs=kiitos]");
      if (kiitos) kiitos.hidden = false;
      mitatPian();
    };
    lomake?.addEventListener("submit", laheta);
    siivous.push(() => lomake?.removeEventListener("submit", laheta));

    return () => siivous.forEach((f) => f());
  }, []);
  return null;
}
