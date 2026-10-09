"use client";

/* MEISTA-SIVUN PUHELINVERSION OMAT TEHOSTEET (suunnitelman renderVals: h,
   tiimi, seo, laheta). Kirjoittaa suoraan DOMiin, ei renderoi mitaan.
   Yhteiset asiat (palkki, valikko, ikkunat, paljastukset, pino, parallaksi,
   verkko) ovat Moottori.tsx:ssa. */

import { kytkeTarjous } from "@/app/components/mobiili/tarjous";
import { useEffect } from "react";
import { kuuntele, onMobiili, rajaa, reduce, tilaNyt, type Tila } from "@/app/components/mobiili/vieritys";

/* Suunnitelman vakiot: tarkennus lukittuu 0..SC, kansi nousee KA:sta. */
const SC = 320;
const KA = 300;

export default function Efektit() {
  useEffect(() => {
    if (!onMobiili()) return;
    const juuri = document.querySelector<HTMLElement>(".mo-s-meista");
    if (!juuri) return;
    const q = <T extends Element = HTMLElement>(s: string) => juuri.querySelector<T>(s);
    const siivous: Array<() => void> = [];
    const R = reduce();

    /* ---------- HERO: etsimen tarkennus, AF-kehys, aikakoodi, kansi ---------- */
    const kuva = q("[data-meista=kuva]");
    const sumea = q("[data-meista=sumea]");
    const af = q("[data-meista=af]");
    const afY = q("[data-af=y]"), afA = q("[data-af=a]"), afV = q("[data-af=v]"), afO = q("[data-af=o]"), afT = q("[data-af=t]");
    const aika = q("[data-meista=aika]");
    const vihje = q("[data-meista=vihje]");
    const rengas = q<SVGCircleElement>("[data-meista=rengas]");
    const teksti = q("[data-meista=teksti]");
    const peitto = q("[data-meista=peitto]");
    const pad = (n: number) => String(n).padStart(2, "0");
    let sek = 0;
    let yNyt = 0;
    const kirjoitaAika = () => {
      if (!aika) return;
      const s = sek + Math.floor(yNyt / 40);
      const txt = "00:" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60);
      if (aika.textContent !== txt) aika.textContent = txt;
    };
    let viime = "";
    let lukittu: boolean | null = null;
    let wc = false;
    siivous.push(
      kuuntele({
        kirjoita: (t: Tila) => {
          const { yp: y, HV } = t;
          yNyt = y;
          const kaari = KA + 2 * HV;
          // will-change vain heron ajaksi.
          const heroSsa = y < kaari;
          if (kuva && heroSsa !== wc) {
            wc = heroSsa;
            kuva.style.willChange = heroSsa ? "transform" : "auto";
          }
          /* Arvot kyllastyvat viimeistaan kohdassa KA + HV, joten heron
             jalkeen avain pysyy samana eika mitaan kirjoiteta. (Aiempi
             varhainen paluu jatti tilan vanhaksi, kun hyppy ohitti heron
             yhdella kertaa, esim. ankkuri tai uudelleenlataus.) */
          const pf = rajaa(y / SC);
          const e = pf * pf * (3 - 2 * pf);
          const kansi = rajaa((y - KA) / HV);
          if (heroSsa) kirjoitaAika();
          const avain = `${pf.toFixed(4)}|${kansi.toFixed(4)}|${y < 80 ? y : 80}`;
          if (avain === viime) return;
          viime = avain;
          if (kuva) kuva.style.transform = `translateX(-46%) scale(${(1.18 - 0.14 * e + 0.06 * kansi).toFixed(4)})`;
          if (sumea) sumea.style.opacity = R ? "0" : (1 - e).toFixed(3);
          const x = Math.round(24 + 36 * e), yy = Math.round(44 + 10 * e), w = Math.round(300 - 150 * e), h = Math.round(180 - 82 * e);
          if (afY) afY.style.transform = `translate(${x}px, ${yy}px) scaleX(${w / 100})`;
          if (afA) afA.style.transform = `translate(${x}px, ${yy + h - 1.5}px) scaleX(${w / 100})`;
          if (afV) afV.style.transform = `translate(${x}px, ${yy}px) scaleY(${h / 100})`;
          if (afO) afO.style.transform = `translate(${x + w - 1.5}px, ${yy}px) scaleY(${h / 100})`;
          if (afT) afT.style.transform = `translate(${x}px, ${yy - 16}px)`;
          const lk = pf > 0.85;
          if (lk !== lukittu) {
            lukittu = lk;
            if (af) af.style.color = lk ? "#3ddc84" : "rgba(255,255,255,.85)";
            if (afT) afT.textContent = lk ? "AF LUKITTU" : "AF";
          }
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
    /* Aikakoodi kay sekunnin valein (suunnitelman kello), ei reduced motionissa. */
    if (!R) {
      const kello = window.setInterval(() => {
        sek++;
        if (yNyt < KA + 2 * tilaNyt().HV) kirjoitaAika();
      }, 1000);
      siivous.push(() => window.clearInterval(kello));
    }

    /* ---------- TIIMIKARUSELLI ---------- */
    const tiimi = q("[data-meista=tiimi]");
    const nro = q("[data-meista=tiiminro]");
    const kortit = tiimi ? [...tiimi.querySelectorAll<HTMLElement>(".mo-m-kortti")] : [];
    const pisteet = tiimi?.parentElement?.lastElementChild ? ([...tiimi.parentElement.lastElementChild.children] as HTMLElement[]) : [];
    let valittu = 0;
    const onTiimi = () => {
      if (!tiimi) return;
      const m = Math.max(1, tiimi.scrollWidth - tiimi.clientWidth);
      const i = tiimi.scrollLeft >= m - 4 ? 2 : rajaa(Math.round(tiimi.scrollLeft / 284), 0, 2);
      if (i === valittu) return;
      valittu = i;
      if (nro) nro.textContent = String(i + 1);
      kortit.forEach((k, j) => {
        const on = j === i;
        k.style.transform = `scale(${on ? 1 : 0.94})`;
        k.style.opacity = String(on ? 1 : 0.6);
        k.style.boxShadow = on ? "inset 0 0 0 1px rgba(111,236,255,.35), 0 30px 50px -28px rgba(0,0,0,.95)" : "inset 0 0 0 1px rgba(255,255,255,.08)";
        const kl = k.querySelector<HTMLElement>(".mo-m-klaffi");
        if (kl) kl.style.transform = `rotate(${on ? 0 : -16}deg)`;
      });
      pisteet.forEach((p, j) => {
        p.style.width = `${j === i ? 22 : 6}px`;
        p.style.background = j === i ? "#6fecff" : "rgba(255,255,255,.25)";
      });
    };
    tiimi?.addEventListener("scroll", onTiimi, { passive: true });
    siivous.push(() => tiimi?.removeEventListener("scroll", onTiimi));

    /* ---------- LYHYESTI: Lue lisaa ---------- */
    const seo = q("[data-meista=seo]");
    const seoNappi = q("[data-meista=seo-nappi]");
    const vaihdaSeo = () => {
      if (!seo || !seoNappi) return;
      const auki = seo.hidden;
      seo.hidden = !auki;
      seoNappi.textContent = auki ? "Näytä vähemmän" : "Lue lisää";
      seoNappi.setAttribute("aria-expanded", String(auki));
      window.setTimeout(() => juuri.dispatchEvent(new Event("mo:mitat")), 60);
    };
    seoNappi?.addEventListener("click", vaihdaSeo);
    siivous.push(() => seoNappi?.removeEventListener("click", vaihdaSeo));

    /* ---------- TARJOUSPYYNTO (osion oma lomake, kuten etusivulla) ---------- */
    const lomake = q<HTMLFormElement>("[data-meista=lomake]");
    /* /api/lomake kuten tyopoydan BudgetForm (tarjous.ts). */
    siivous.push(kytkeTarjous(lomake, q("[data-meista=kiitos]"), () => window.setTimeout(() => juuri.dispatchEvent(new Event("mo:mitat")), 60)));

    return () => siivous.forEach((f) => f());
  }, []);
  return null;
}
