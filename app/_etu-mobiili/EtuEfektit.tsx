"use client";

/* ETUSIVUN PUHELINVERSION OMAT TEHOSTEET (suunnitelman renderVals: h,
   sana, refit, tulokset, ukk, laheta). Kirjoittaa suoraan DOMiin, ei
   renderoi mitaan. Yhteiset asiat (palkki, valikko, ikkunat,
   paljastukset, pino, verkko) ovat Moottori.tsx:ssa. */

import { useEffect } from "react";
import { kuuntele, onMobiili, rajaa, type Tila, pyyda } from "@/app/components/mobiili/vieritys";

const SPRITE = "/mobiili/film-ikkuna.webp";

export default function EtuEfektit() {
  useEffect(() => {
    if (!onMobiili()) return;
    const juuri = document.querySelector<HTMLElement>(".mo-s-etu");
    if (!juuri) return;
    const q = <T extends Element = HTMLElement>(s: string) => juuri.querySelector<T>(s);
    const siivous: Array<() => void> = [];

    /* ---------- HERO: elokuva kelautuu 0..650, kansi nousee 650..650+HV ---------- */
    const film = q("[data-etu=film]");
    const ruutu = q("[data-etu=ruutu]");
    const vihje = q("[data-etu=vihje]");
    const rengas = q<SVGCircleElement>("[data-etu=rengas]");
    const teksti = q("[data-etu=teksti]");
    const peitto = q("[data-etu=peitto]");
    let viime = "";
    /* Elokuvaruutu koko leveydella ylhaalla (scale 1). Ylos siirretaan
       vain jos alas ankkuroitu teksti muuten peittaisi tunnuksen:
       siirto = clamp(tekstin ylareuna - 337, -60, 0). Kansi-vaiheen
       -60 * kansi lisataan tahan. Mitataan mountissa, fonttien
       latauduttua ja kun nakyman koko muuttuu. */
    let siirto = 0;
    const mittaaSiirto = () => {
      if (!teksti) return;
      siirto = Math.max(-60, Math.min(0, teksti.offsetTop - 337));
      viime = "";
      pyyda();
    };
    mittaaSiirto();
    document.fonts?.ready.then(mittaaSiirto, () => {});
    let edKoko = "";
    siivous.push(kuuntele({ lue: (t: Tila) => { const k = `${t.W}x${t.HV}`; if (k !== edKoko) { edKoko = k; mittaaSiirto(); } } }));
    siivous.push(
      kuuntele({
        kirjoita: (t: Tila) => {
          const { y, HV } = t;
          if (y > 650 + 2 * HV + 200 && viime) return; // hero on jo kokonaan peitossa
          const pf = rajaa(y / 650);
          const f = Math.round(pf * 37);
          const kansi = rajaa((y - 650) / HV);
          const avain = `${f}|${kansi.toFixed(4)}|${y < 720 ? y : 720}`;
          if (avain === viime) return;
          viime = avain;
          if (ruutu) ruutu.style.backgroundPosition = `${((f % 8) / 7) * 100}% ${(Math.floor(f / 8) / 4) * 100}%`;
          if (film) film.style.transform = `translateY(${(siirto - 60 * kansi).toFixed(1)}px)`;
          if (vihje) {
            vihje.style.opacity = (1 - rajaa((y - 560) / 150)).toFixed(3);
            vihje.style.transform = `translateX(-50%) translateY(${(6 * (1 - rajaa(y / 80))).toFixed(1)}px)`;
          }
          rengas?.setAttribute("stroke-dashoffset", (81.7 * (1 - pf)).toFixed(1));
          if (teksti) teksti.style.transform = `translateY(${(-50 * kansi).toFixed(1)}px)`;
          if (peitto) peitto.style.opacity = (0.6 * (1 - Math.pow(1 - kansi, 2))).toFixed(3);
        },
      }),
    );

    /* Elokuvan koko sarja (650 kt) haetaan vasta sivun latauduttua.
       Siihen asti ruudussa on ensimmainen kuva (film-ikkuna-0.webp). */
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
      if (window.scrollY >= 650 + (window.innerHeight || 844)) return;
      sana = (sana + 1) % sanat.length;
      sanaEl.textContent = sanat[sana];
      sanaEl.style.animation = "none";
      void sanaEl.offsetWidth;
      sanaEl.style.animation = "";
    }, 2600);
    siivous.push(() => window.clearInterval(ajastin));

    /* ---------- REFERENSSIKARUSELLI ---------- */
    const refit = q("[data-etu=refit]");
    const pisteet = refit?.nextElementSibling ? [...(refit.nextElementSibling as HTMLElement).children] as HTMLElement[] : [];
    let ref = 0;
    const onRefit = () => {
      if (!refit) return;
      const i = rajaa(Math.round(refit.scrollLeft / 224), 0, 4);
      if (i === ref) return;
      ref = i;
      [...refit.querySelectorAll<HTMLElement>(".mo-e-ref")].forEach((a, k) => {
        const on = k === i;
        a.style.transform = `scale(${on ? 1 : 0.9})`;
        a.style.opacity = String(on ? 1 : 0.55);
        const p = a.querySelector<HTMLElement>(".mo-e-prog i");
        if (p) p.style.animationPlayState = on ? "running" : "paused";
      });
      pisteet.forEach((p, k) => {
        p.style.width = `${k === i ? 22 : 6}px`;
        p.style.background = k === i ? "#6fecff" : "rgba(255,255,255,.28)";
      });
    };
    refit?.addEventListener("scroll", onRefit, { passive: true });
    siivous.push(() => refit?.removeEventListener("scroll", onRefit));

    /* ---------- TULOSKARUSELLI ---------- */
    const tul = q("[data-etu=tulokset]");
    const nro = q("[data-etu=tulosnro]");
    const tPisteet = tul?.nextElementSibling ? [...(tul.nextElementSibling as HTMLElement).children] as HTMLElement[] : [];
    let tulos = 0;
    const onTulos = () => {
      if (!tul) return;
      const i = rajaa(Math.round(tul.scrollLeft / 330), 0, 2);
      if (i === tulos) return;
      tulos = i;
      if (nro) nro.textContent = String(i + 1);
      tPisteet.forEach((p, k) => {
        p.style.width = `${k === i ? 22 : 6}px`;
        p.style.background = k === i ? "#6fecff" : "rgba(255,255,255,.25)";
      });
    };
    tul?.addEventListener("scroll", onTulos, { passive: true });
    siivous.push(() => tul?.removeEventListener("scroll", onTulos));

    /* ---------- KLIKIT: tuloskortin Lue lisaa, UKK, Nayta kaikki ---------- */
    const mitat = () => juuri.dispatchEvent(new Event("mo:mitat"));
    let tulosAuki = -1;
    let ukkAuki = 0;
    const klikki = (e: MouseEvent) => {
      const t = e.target as Element;
      const avaa = t.closest<HTMLElement>("[data-etu-avaa]");
      if (avaa) {
        const i = Number(avaa.dataset.etuAvaa);
        tulosAuki = tulosAuki === i ? -1 : i;
        juuri.querySelectorAll<HTMLElement>("[data-etu-avaa]").forEach((b) => {
          const on = Number(b.dataset.etuAvaa) === tulosAuki;
          b.textContent = on ? "Näytä vähemmän" : "Lue lisää";
          const p = b.previousElementSibling as HTMLElement | null;
          if (p) p.style.setProperty("-webkit-line-clamp", on ? "40" : "3");
        });
        window.setTimeout(mitat, 60);
        return;
      }
      const u = t.closest<HTMLElement>("[data-ukk]");
      if (u) {
        const i = Number(u.dataset.ukk);
        ukkAuki = ukkAuki === i ? -1 : i;
        juuri.querySelectorAll<HTMLElement>("[data-ukk]").forEach((b) => {
          const on = Number(b.dataset.ukk) === ukkAuki;
          b.classList.toggle("mo-auki", on);
          b.setAttribute("aria-expanded", String(on));
          const v = juuri.querySelector<HTMLElement>(`[data-ukk-vast="${b.dataset.ukk}"]`);
          if (v) v.hidden = !on;
        });
        window.setTimeout(mitat, 60);
        return;
      }
      const kaikki = t.closest<HTMLElement>("[data-ukk-kaikki]");
      if (kaikki) {
        juuri.querySelectorAll<HTMLElement>("[data-ukk-rivi]").forEach((r) => (r.hidden = false));
        kaikki.remove();
        window.setTimeout(mitat, 60);
      }
    };
    juuri.addEventListener("click", klikki);
    siivous.push(() => juuri.removeEventListener("click", klikki));

    /* ---------- TARJOUSPYYNTO (osion oma lomake) ---------- */
    const lomake = q<HTMLFormElement>("[data-etu=lomake]");
    const laheta = (e: Event) => {
      e.preventDefault();
      if (!lomake) return;
      const d = new FormData(lomake);
      const k = (x: string) => String(d.get(x) ?? "").trim();
      const rivit = [`Nimi: ${k("nimi")}`, `Sähköposti: ${k("email")}`, `Puhelin: ${k("puhelin")}`, `Paikkakunta: ${k("paikkakunta")}`, "", k("viesti")];
      window.location.href = `mailto:info@wsmedia.fi?subject=${encodeURIComponent("Tarjouspyyntö: WS Media")}&body=${encodeURIComponent(rivit.join("\n"))}`;
      const kiitos = q("[data-etu=kiitos]");
      if (kiitos) kiitos.hidden = false;
    };
    lomake?.addEventListener("submit", laheta);
    siivous.push(() => lomake?.removeEventListener("submit", laheta));

    return () => siivous.forEach((f) => f());
  }, []);
  return null;
}
