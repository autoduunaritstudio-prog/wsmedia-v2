"use client";

/* LYHYTVIDEOT-SIVUN PUHELINVERSION OMAT TEHOSTEET (suunnitelman
   Palvelusivu.dc.html: renderVals h, puhelimet, tyk, sana, refit,
   kanavat, prosessi, paketit, kenelle, ukk, seo, laheta). Kirjoittaa
   suoraan DOMiin, ei renderoi mitaan. Yhteiset asiat (ylapalkki, valikko,
   ikkunat, CTA-palkki, paljastukset, laskurit, parallaksi, verkko,
   laiskat kuvat) ovat Moottori.tsx:ssa.

   Videot (heron puhelimet ja referenssikortit): preload none, muted
   asetetaan tassa (React ei kirjoita attribuuttia), toisto vain kun
   video on nakyvissa, ja reduced motion -tilassa ei toistoa lainkaan,
   jolloin nakyy kansikuva. */

import { useEffect } from "react";
import { kuuntele, onMobiili, pehmea, rajaa, reduce, type Tila } from "@/app/components/mobiili/vieritys";

/* Suunnitelman vakiot: SC = 340 (puhelinten levittaytyminen), KA = SC - 140. */
const SC = 340;
const KA = SC - 140;
const PUOLI = [-1, 1, 0];

const kk = (n: number) => (n >= 1000 ? (Math.round(n / 100) / 10).toString().replace(".", ",") + " t." : String(Math.round(n)));

const toista = (v: HTMLVideoElement) => {
  v.muted = true;
  const p = v.play();
  if (p && p.catch) p.catch(() => {});
};

export default function Efektit() {
  useEffect(() => {
    if (!onMobiili()) return;
    const juuri = document.querySelector<HTMLElement>(".mo-s-lyhytvideot");
    if (!juuri) return;
    const q = <T extends Element = HTMLElement>(s: string) => juuri.querySelector<T>(s);
    const qa = <T extends Element = HTMLElement>(s: string) => [...juuri.querySelectorAll<T>(s)];
    const siivous: Array<() => void> = [];
    const R = reduce();
    const mitat = () => juuri.dispatchEvent(new Event("mo:mitat"));

    const videot = qa<HTMLVideoElement>("video");
    videot.forEach((v) => {
      v.muted = true;
      v.defaultMuted = true;
    });

    /* ---------- HERO: puhelimet levittaytyvat 0..340, kansi nousee 200..200+HV ---------- */
    const lava = q("[data-lv=lava]");
    const puhelimet = qa("[data-lv-puh]");
    const heroVideot = qa<HTMLVideoElement>("[data-lv-video]");
    const tyk = { l: q("[data-lv-tyk=l]"), k: q("[data-lv-tyk=k]"), j: q("[data-lv-tyk=j]") };
    const vihje = q("[data-lv=vihje]");
    const rengas = q<SVGCircleElement>("[data-lv=rengas]");
    const teksti = q("[data-lv=teksti]");
    const peitto = q("[data-lv=peitto]");
    let viime = "";
    /* Heron videot kaynnistyvat vasta sivun latauduttua (ei LCP:n tielle). */
    let ladattu = document.readyState === "complete";
    let heroSoi = false;
    const heroToisto = (nakyy: boolean) => {
      const soi = nakyy && ladattu && !R;
      if (soi === heroSoi) return;
      heroSoi = soi;
      heroVideot.forEach((v) => (soi ? toista(v) : v.pause()));
    };

    /* ---------- PROSESSI: aikajana scrubbaa vierityksen mukana ---------- */
    const aj = q("[data-aikajana]");
    const ajPalkki = q("[data-lv=aikajana-palkki]");
    const nrot = qa("[data-lv-nro]");
    const askelTekstit = qa("[data-lv-askel]");
    let P = 0;
    let viimeP = "";
    const askelOn: boolean[] = nrot.map((_, i) => i === 0);

    let viimeY = -1;
    siivous.push(
      kuuntele({
        lue: (t: Tila) => {
          if (!aj) return;
          const r = aj.getBoundingClientRect();
          P = rajaa((t.HV * 0.62 - r.top) / Math.max(1, r.height - 40));
        },
        kirjoita: (t: Tila) => {
          const { y, HV } = t;
          viimeY = y;
          heroToisto(y < KA + HV);
          // Hero on kokonaan peitossa: ei kirjoiteta turhaan.
          if (!(y > KA + 2 * HV + 200 && viime)) {
            const pf = rajaa(y / SC);
            const e = pehmea(pf);
            const kansi = rajaa((y - KA) / HV);
            const avain = `${e.toFixed(4)}|${kansi.toFixed(4)}|${Math.min(y, 300)}|${HV}`;
            if (avain !== viime) {
              viime = avain;
              if (lava) lava.style.transform = `translateY(${(-30 * e - 70 * kansi).toFixed(1)}px)`;
              const PW = Math.round((HV - 442) * 0.47);
              puhelimet.forEach((n) => {
                const puoli = PUOLI[Number(n.dataset.lvPuh)] ?? 0;
                const paa = puoli === 0;
                const x = Math.round(puoli * (PW * 0.62 + 38 * e));
                const r = (puoli * (6 + 7 * e)).toFixed(2);
                const s = paa ? (1 + 0.05 * e).toFixed(4) : (1 - 0.06 * e).toFixed(4);
                n.style.transform = `translateX(${x}px) rotate(${r}deg) scale(${s})`;
                if (!paa) n.style.opacity = (1 - 0.35 * e).toFixed(3);
              });
              const aseta = (n: HTMLElement | null, v: string) => {
                if (n && n.textContent !== v) n.textContent = v;
              };
              aseta(tyk.l, kk(1240 + (3180 - 1240) * e));
              aseta(tyk.k, kk(86 + (214 - 86) * e));
              aseta(tyk.j, kk(41 + (132 - 41) * e));
              if (vihje) {
                vihje.style.opacity = (1 - rajaa((y - 140) / 110)).toFixed(3);
                vihje.style.transform = `translateX(-50%) translateY(${(6 * (1 - rajaa(y / 80))).toFixed(1)}px)`;
              }
              rengas?.setAttribute("stroke-dashoffset", (81.7 * (1 - pf)).toFixed(1));
              if (teksti) teksti.style.transform = `translateY(${(-50 * kansi).toFixed(1)}px)`;
              if (peitto) peitto.style.opacity = (0.6 * (1 - Math.pow(1 - kansi, 2))).toFixed(3);
            }
          }
          // Prosessi
          const pk = P.toFixed(4);
          if (pk !== viimeP) {
            viimeP = pk;
            if (ajPalkki) ajPalkki.style.transform = `scaleY(${pk})`;
            nrot.forEach((n, i) => {
              const on = P >= i / 3 - 0.02;
              if (on === askelOn[i]) return;
              askelOn[i] = on;
              n.style.background = on ? "#6fecff" : "#0b131d";
              n.style.color = on ? "#0b0f14" : "#8fa3b5";
              n.style.boxShadow = on ? "0 0 0 5px rgba(111,236,255,.14)" : "inset 0 0 0 1.5px rgba(255,255,255,.18)";
              if (askelTekstit[i]) askelTekstit[i].style.opacity = on ? "1" : "0.45";
            });
          }
        },
      }),
    );
    const latautui = () => {
      ladattu = true;
      if (viimeY >= 0) heroToisto(viimeY < KA + (window.innerHeight || 844));
    };
    if (!ladattu) {
      window.addEventListener("load", latautui, { once: true });
      siivous.push(() => window.removeEventListener("load", latautui));
    }

    /* ---------- SANAVAIHTO 2,6 s valein heron aikana (alkutila sana = 1) ---------- */
    if (!R) {
      const sanat = qa("[data-sana]");
      let sana = 1;
      const ajastin = window.setInterval(() => {
        if (window.scrollY >= KA + (window.innerHeight || 844)) return;
        sanat[sana].hidden = true;
        sana = (sana + 1) % sanat.length;
        sanat[sana].hidden = false;
      }, 2600);
      siivous.push(() => window.clearInterval(ajastin));
    }

    /* ---------- KANAVAKARUSELLI ---------- */
    const kanavat = q("[data-lv=kanavat]");
    const kPisteet = kanavat?.nextElementSibling ? ([...kanavat.nextElementSibling.children] as HTMLElement[]) : [];
    let kanava = 0;
    const onKanava = () => {
      if (!kanavat) return;
      const i = rajaa(Math.round(kanavat.scrollLeft / 300), 0, 2);
      if (i === kanava) return;
      kanava = i;
      kPisteet.forEach((p, k) => {
        p.style.width = `${k === i ? 22 : 6}px`;
        p.style.background = k === i ? "#6fecff" : "rgba(255,255,255,.25)";
      });
    };
    kanavat?.addEventListener("scroll", onKanava, { passive: true });
    siivous.push(() => kanavat?.removeEventListener("scroll", onKanava));

    /* ---------- REFERENSSIKARUSELLI + videot ---------- */
    const refit = q("[data-lv=refit]");
    const rPisteet = refit?.nextElementSibling ? ([...refit.nextElementSibling.children] as HTMLElement[]) : [];
    const refVideot = qa<HTMLVideoElement>("video[data-ref]");
    let ref = 0;
    let refNakyy = false;
    const soita = () =>
      refVideot.forEach((v) => {
        if (refNakyy && !R && v.dataset.ref === String(ref)) {
          v.preload = "auto";
          toista(v);
        } else v.pause();
      });
    const onRefit = () => {
      if (!refit) return;
      const i = rajaa(Math.round(refit.scrollLeft / 214), 0, 4);
      if (i === ref) return;
      ref = i;
      qa(".mo-l-ref").forEach((a, k) => {
        const on = k === i;
        a.style.transform = `scale(${on ? 1 : 0.9})`;
        a.style.opacity = String(on ? 1 : 0.55);
        const v = a.querySelector<HTMLElement>("video");
        if (v) v.style.opacity = on ? "1" : "0";
        const p = a.querySelector<HTMLElement>(".mo-e-prog i");
        if (p) p.style.animationPlayState = on ? "running" : "paused";
      });
      rPisteet.forEach((p, k) => {
        p.style.width = `${k === i ? 22 : 6}px`;
        p.style.background = k === i ? "#6fecff" : "rgba(255,255,255,.28)";
      });
      soita();
    };
    refit?.addEventListener("scroll", onRefit, { passive: true });
    siivous.push(() => refit?.removeEventListener("scroll", onRefit));
    if (refit && typeof IntersectionObserver !== "undefined") {
      const io = new IntersectionObserver((ent) => {
        const n = ent.some((e) => e.isIntersecting);
        if (n === refNakyy) return;
        refNakyy = n;
        soita();
      }, { threshold: 0.12 });
      io.observe(refit);
      siivous.push(() => io.disconnect());
    }
    siivous.push(() => videot.forEach((v) => v.pause()));

    /* ---------- KLIKIT: paketit, kenelle, UKK, Nayta kaikki, koko teksti ---------- */
    let ukkAuki = 0;
    const klikki = (e: MouseEvent) => {
      const t = e.target as Element;
      const pak = t.closest<HTMLElement>("[data-lv-paketti]");
      if (pak) {
        const i = Number(pak.dataset.lvPaketti);
        qa("[data-lv-paketti]").forEach((b) => {
          const on = Number(b.dataset.lvPaketti) === i;
          b.setAttribute("aria-selected", String(on));
          b.style.background = on ? "#6fecff" : "transparent";
          b.style.color = on ? "#0b0f14" : "#c9d6e2";
        });
        qa("[data-lv-paketti-kortti]").forEach((k) => (k.hidden = Number(k.dataset.lvPakettiKortti) !== i));
        window.setTimeout(mitat, 60);
        return;
      }
      const ke = t.closest<HTMLElement>("[data-lv-kenelle]");
      if (ke) {
        const i = Number(ke.dataset.lvKenelle);
        qa("[data-lv-kenelle]").forEach((b) => {
          const k = Number(b.dataset.lvKenelle);
          const on = k === i;
          b.setAttribute("aria-selected", String(on));
          b.style.background = on ? (k === 0 ? "#6fecff" : "#ff9a4d") : "transparent";
          b.style.color = on ? "#0b0f14" : "#c9d6e2";
        });
        qa("[data-lv-kenelle-lista]").forEach((l) => (l.hidden = Number(l.dataset.lvKenelleLista) !== i));
        window.setTimeout(mitat, 60);
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
        window.setTimeout(mitat, 60);
        return;
      }
      const kaikki = t.closest<HTMLElement>("[data-ukk-kaikki]");
      if (kaikki) {
        qa("[data-ukk-rivi]").forEach((r) => (r.hidden = false));
        kaikki.remove();
        window.setTimeout(mitat, 60);
        return;
      }
      const seo = t.closest<HTMLElement>("[data-lv=seo-nappi]");
      if (seo) {
        const s = q("[data-lv=seo]");
        if (!s) return;
        s.hidden = !s.hidden;
        seo.textContent = s.hidden ? "Lue koko teksti" : "Näytä vähemmän";
        window.setTimeout(mitat, 60);
      }
    };
    juuri.addEventListener("click", klikki);
    siivous.push(() => juuri.removeEventListener("click", klikki));

    /* ---------- TARJOUSPYYNTO (osion oma lomake) ---------- */
    const lomake = q<HTMLFormElement>("[data-lv=lomake]");
    const laheta = (e: Event) => {
      e.preventDefault();
      if (!lomake) return;
      const d = new FormData(lomake);
      const k = (x: string) => String(d.get(x) ?? "").trim();
      const rivit = [`Nimi: ${k("nimi")}`, `Sähköposti: ${k("email")}`, `Puhelin: ${k("puhelin")}`, `Paikkakunta: ${k("paikkakunta")}`, "Palvelu: Lyhytvideot", "", k("viesti")];
      window.location.href = `mailto:info@wsmedia.fi?subject=${encodeURIComponent("Tarjouspyyntö: Lyhytvideot")}&body=${encodeURIComponent(rivit.join("\n"))}`;
      const kiitos = q("[data-lv=kiitos]");
      if (kiitos) kiitos.hidden = false;
    };
    lomake?.addEventListener("submit", laheta);
    siivous.push(() => lomake?.removeEventListener("submit", laheta));

    return () => siivous.forEach((f) => f());
  }, []);
  return null;
}
