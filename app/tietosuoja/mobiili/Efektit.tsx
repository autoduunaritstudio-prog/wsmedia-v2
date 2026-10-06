"use client";

/* TIETOSUOJAN PUHELINVERSION TEHOSTEET (suunnitelman renderVals: toc,
   tocTop, chevLuokka). Kirjoittaa suoraan DOMiin, ei renderoi mitaan.

   - Sisallys avautuu ja sulkeutuu napista; linkki sulkee sen (Moottori
     hoitaa itse hypyn).
   - Sisallys seuraa ylapalkkia: suunnitelmassa top 76 -> 12 px kun palkki
     piiloutuu. Tassa top pysyy 76 px:ssa ja siirto tehdaan transformilla
     (ei top-animaatiota). Palkin tila luetaan Moottorin kirjoittamasta
     data-piilo-attribuutista, jotta molemmat liikkuvat yhdessa.
   - Kun sisallys on auki, ylapalkki ei piiloudu (suunnitelman !s.toc):
     juuren data-toc-auki, ks. lisat.css. */

import { useEffect } from "react";
import { onMobiili } from "@/app/components/mobiili/vieritys";

export default function Efektit() {
  useEffect(() => {
    if (!onMobiili()) return;
    const juuri = document.querySelector<HTMLElement>(".mo-s-tietosuoja");
    if (!juuri) return;
    const toc = juuri.querySelector<HTMLElement>("[data-toc]");
    const nappi = juuri.querySelector<HTMLElement>("[data-toc-nappi]");
    const lista = juuri.querySelector<HTMLElement>("[data-toc-lista]");
    const chev = nappi?.querySelector<SVGElement>(".mo-ts-chev");
    const hdr = juuri.querySelector<HTMLElement>("[data-mo-otsake]");
    if (!toc || !nappi || !lista) return;

    let auki = false;
    const sijoita = () => {
      const piilossa = !auki && hdr?.getAttribute("data-piilo") === "1";
      toc.style.transform = `translateY(${piilossa ? -64 : 0}px)`;
    };
    const aseta = (v: boolean) => {
      auki = v;
      lista.hidden = !v;
      nappi.setAttribute("aria-expanded", String(v));
      chev?.classList.toggle("mo-auki", v);
      juuri.toggleAttribute("data-toc-auki", v);
      sijoita();
    };
    const vaihda = () => aseta(!auki);
    nappi.addEventListener("click", vaihda);

    /* Linkki sulkee luettelon. Ikkunan kaappausvaihe ehtii ennen
       Moottorin dokumenttikuuntelijaa, joka pysayttaa tapahtuman. */
    const linkki = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (a && lista.contains(a)) aseta(false);
    };
    window.addEventListener("click", linkki, true);

    const mo = hdr ? new MutationObserver(sijoita) : null;
    if (hdr) mo!.observe(hdr, { attributes: true, attributeFilter: ["data-piilo"] });

    return () => {
      nappi.removeEventListener("click", vaihda);
      window.removeEventListener("click", linkki, true);
      mo?.disconnect();
      juuri.removeAttribute("data-toc-auki");
    };
  }, []);
  return null;
}
