"use client";

/* TOIHIN MEILLE, PUHELINVERSION OMAT TEHOSTEET (suunnitelman renderVals:
   h, roolit, mallit, askeleet, od, seo, ukk, taidot, hMalli, laheta).
   Kirjoittaa suoraan DOMiin, ei renderoi mitaan. Yhteiset asiat (palkki,
   valikko, hakemusikkuna, paljastukset, korttipino, parallaksi, verkko)
   ovat Moottori.tsx:ssa. */

import { useEffect } from "react";
import { kuuntele, onMobiili, rajaa, type Tila } from "@/app/components/mobiili/vieritys";
import { lahetaHakemus } from "../hakemus";
import { HMALLIT, askelTyyli, hMalliTyyli, malliTyyli, odTyyli, rooliTyyli, taitoTyyli } from "./tilat";

/* Suunnitelman hero: 0..SC sormivihje ja rengas, kansi nousee KA..KA+HV. */
const SC = 320;
const KA = 300;

export default function Efektit() {
  useEffect(() => {
    if (!onMobiili()) return;
    const juuri = document.querySelector<HTMLElement>(".mo-s-toihin");
    if (!juuri) return;
    const q = <T extends Element = HTMLElement>(s: string) => juuri.querySelector<T>(s);
    const qa = <T extends Element = HTMLElement>(s: string) => [...juuri.querySelectorAll<T>(s)];
    const siivous: Array<() => void> = [];
    const mitat = () => window.setTimeout(() => juuri.dispatchEvent(new Event("mo:mitat")), 60);

    /* ---------- HERO ---------- */
    const vihje = q("[data-toihin=vihje]");
    const rengas = q<SVGCircleElement>("[data-toihin=rengas]");
    const teksti = q("[data-toihin=teksti]");
    const peitto = q("[data-toihin=peitto]");
    let viime = "";
    siivous.push(
      kuuntele({
        kirjoita: (t: Tila) => {
          const { HV } = t;
          /* Heron jalkeen arvot pysyvat lopputilassa (hero on peitossa);
             avain estaa turhat kirjoitukset. Rajaus eika paluu, jotta myos
             suora hyppy heron ohi kirjoittaa lopputilan. */
          const y = Math.min(t.y, KA + 2 * HV + 200);
          const pf = rajaa(y / SC);
          const kansi = rajaa((y - KA) / HV);
          const avain = `${pf.toFixed(4)}|${kansi.toFixed(4)}|${y < 80 ? y : 80}`;
          if (avain === viime) return;
          viime = avain;
          if (vihje) {
            vihje.style.opacity = (1 - rajaa((pf - 0.7) / 0.2)).toFixed(3);
            vihje.style.transform = `translateX(-50%) translateY(${(6 * (1 - rajaa(y / 80))).toFixed(1)}px)`;
          }
          rengas?.setAttribute("stroke-dashoffset", (81.7 * (1 - pf)).toFixed(1));
          if (teksti) teksti.style.transform = `translateY(${(-50 * kansi).toFixed(1)}px)`;
          if (peitto) peitto.style.opacity = (0.6 * (1 - Math.pow(1 - kansi, 2))).toFixed(3);
        },
      }),
    );

    /* ---------- PROSESSIN KARUSELLI (onAsk) ---------- */
    const ask = q("[data-toihin=askeleet]");
    const askPalkki = q("[data-toihin=askelpalkki]");
    const askKortit = qa("[data-askel]");
    let askel = 0;
    const onAsk = () => {
      if (!ask) return;
      const m = Math.max(1, ask.scrollWidth - ask.clientWidth);
      const i = ask.scrollLeft >= m - 4 ? 2 : rajaa(Math.round(ask.scrollLeft / 262), 0, 2);
      if (i === askel) return;
      askel = i;
      if (askPalkki) askPalkki.style.transform = `scaleX(${(i * 50) / 100})`;
      askKortit.forEach((a, k) => {
        const s = askelTyyli(k, i);
        a.style.background = s.bg;
        a.style.boxShadow = s.reuna;
        const n = a.querySelector<HTMLElement>("[data-askel-nro]");
        if (n) {
          n.style.background = s.nBg;
          n.style.color = s.nFg;
        }
      });
    };
    ask?.addEventListener("scroll", onAsk, { passive: true });
    siivous.push(() => ask?.removeEventListener("scroll", onAsk));

    /* ---------- VALILEHDET, SEO-TEKSTI, UKK, TAIDOT, HAKEMUKSEN MALLI ---------- */
    const vaihda = (nappi: string, paneeli: string, i: number, tyyli: (n: HTMLElement, on: boolean, k: number) => void) => {
      qa(`[${nappi}]`).forEach((b) => {
        const k = Number(b.getAttribute(nappi));
        const on = k === i;
        b.setAttribute("aria-selected", String(on));
        tyyli(b, on, k);
      });
      qa(`[${paneeli}]`).forEach((p) => (p.hidden = Number(p.getAttribute(paneeli)) !== i));
      mitat();
    };
    let ukkAuki = 0;
    const taidot = new Set<string>();
    let hmalli = 0;
    const klikki = (e: MouseEvent) => {
      const t = e.target as Element;
      const rooli = t.closest<HTMLElement>("[data-rooli]");
      if (rooli) {
        vaihda("data-rooli", "data-rooli-paneeli", Number(rooli.dataset.rooli), (b, on) => {
          const s = rooliTyyli(on);
          b.style.background = s.bg;
          b.style.color = s.fg;
          b.style.boxShadow = s.reuna;
        });
        return;
      }
      const malli = t.closest<HTMLElement>("[data-malli]");
      if (malli) {
        vaihda("data-malli", "data-malli-paneeli", Number(malli.dataset.malli), (b, on) => {
          const s = malliTyyli(on);
          b.style.background = s.tabBg;
          b.style.color = s.tabFg;
        });
        return;
      }
      const od = t.closest<HTMLElement>("[data-od]");
      if (od) {
        const i = Number(od.dataset.od);
        vaihda("data-od", "data-od-paneeli", i, (b, _on, k) => {
          const s = odTyyli(k as 0 | 1, i);
          b.style.background = s.bg;
          b.style.color = s.fg;
        });
        return;
      }
      const seo = t.closest<HTMLElement>("[data-toihin=seo-nappi]");
      if (seo) {
        const osa = q("[data-toihin=seo]");
        if (osa) {
          osa.hidden = !osa.hidden;
          seo.textContent = osa.hidden ? "Lue koko teksti" : "Näytä vähemmän";
          seo.setAttribute("aria-expanded", String(!osa.hidden));
        }
        mitat();
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
        mitat();
        return;
      }
      const kaikki = t.closest<HTMLElement>("[data-ukk-kaikki]");
      if (kaikki) {
        qa("[data-ukk-rivi]").forEach((r) => (r.hidden = false));
        kaikki.remove();
        mitat();
        return;
      }
      const taito = t.closest<HTMLElement>("[data-taito]");
      if (taito) {
        const n = taito.dataset.taito || "";
        const on = !taidot.has(n);
        if (on) taidot.add(n);
        else taidot.delete(n);
        const s = taitoTyyli(on);
        taito.setAttribute("aria-pressed", String(on));
        taito.style.background = s.bg;
        taito.style.color = s.fg;
        taito.style.boxShadow = s.reuna;
        const ok = taito.querySelector<SVGElement>("[data-taito-ok]");
        if (ok) ok.style.display = on ? "" : "none";
        return;
      }
      const hm = t.closest<HTMLElement>("[data-hmalli]");
      if (hm) {
        hmalli = Number(hm.dataset.hmalli);
        qa("[data-hmalli]").forEach((b) => {
          const on = Number(b.dataset.hmalli) === hmalli;
          const s = hMalliTyyli(on);
          b.setAttribute("aria-pressed", String(on));
          b.style.background = s.bg;
          b.style.color = s.fg;
        });
      }
    };
    juuri.addEventListener("click", klikki);
    siivous.push(() => juuri.removeEventListener("click", klikki));

    /* ---------- AVOIN HAKEMUS (sivun oma lomake) ----------
       Sama lahetys kuin tyopoydan lomakkeella ja HakemusIkkunalla
       (lahetaHakemus, /api/lomake, 6.10.2026). Kentat nimetaan sen mukaan;
       valitut taidot, malli ja liitteet kulkevat mukana. */
    const lomake = q<HTMLFormElement>("[data-toihin=lomake]");
    let lahettaa = false;
    let valmis = false; // perillä olevaa hakemusta ei lähetetä toiseen kertaan
    const laheta = async (e: Event) => {
      e.preventDefault();
      if (!lomake || lahettaa || valmis) return;
      const kiitos = q("[data-toihin=kiitos]");
      if (kiitos) kiitos.hidden = true;
      const d = new FormData(lomake);
      const nappi = lomake.querySelector<HTMLButtonElement>("button[type=submit]");
      const virhe = lomake.querySelector<HTMLElement>("[data-mo-lomakevirhe]");
      const nayta = (t: string | null) => {
        if (!virhe) return;
        virhe.textContent = t ?? "";
        virhe.hidden = !t;
        mitat();
      };
      const nimi = String(d.get("nimi") ?? "").trim();
      const posti = String(d.get("email") ?? "").trim();
      if (!nimi || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(posti)) {
        nayta("Kirjoita nimi ja sähköposti, niin voimme vastata.");
        return;
      }
      nayta(null);
      d.set("sahkoposti", String(d.get("email") ?? ""));
      d.set("nayte", String(d.get("linkki") ?? ""));
      d.set("malli", HMALLIT[hmalli]);
      const osaaminen = qa("[data-taito]").map((b) => b.dataset.taito || "").filter((n) => taidot.has(n));
      const liite = lomake.querySelector<HTMLInputElement>('input[type="file"]');
      const liitteet = liite?.files ? [...liite.files] : [];
      d.delete("liite");
      lahettaa = true;
      const teksti = nappi?.textContent ?? "";
      if (nappi) {
        nappi.disabled = true;
        nappi.textContent = "Lähetetään…";
      }
      const viesti = await lahetaHakemus(d, osaaminen, liitteet);
      lahettaa = false;
      if (nappi) {
        nappi.disabled = false;
        nappi.textContent = teksti;
      }
      if (viesti) {
        nayta(viesti);
        return;
      }
      valmis = true;
      if (kiitos) kiitos.hidden = false;
      mitat();
    };
    lomake?.addEventListener("submit", laheta);
    siivous.push(() => lomake?.removeEventListener("submit", laheta));

    return () => siivous.forEach((f) => f());
  }, []);
  return null;
}
