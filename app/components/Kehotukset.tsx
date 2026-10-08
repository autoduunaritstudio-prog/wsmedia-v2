"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import YhteysIkkuna from "./YhteysIkkuna";
import VarausIkkuna from "./VarausIkkuna";
import { alustaBotId } from "./botid";

/**
 * KAIKKI KEHOTUSPAINIKKEET AVAAVAT IKKUNAN (4.10.2026).
 *
 * Yksikaan painike ei vie sivun loppuun. Klikkaus ohjataan:
 *
 * - [data-varaus] ja saman sivun ankkurit #tarjous, #lomake, #kartoitus
 *   -> VarausIkkuna (maksuton kartoitus, 30 min, kalenteriin)
 * - [data-yhteys], hinnoittelukorttien napit (#hinnoittelu) ja
 *   "Kysy suoraan" -linkit -> YhteysIkkuna (viesti, palvelu esivalittuna)
 *
 * Kuuntelija on documentilla kuplavaiheessa: Reactin omat onClickit
 * (esim. koko ruudun navin sulkeminen) ajetaan ensin, ja
 * stopPropagation estaa Lenisin (window) ankkurivierityksen.
 */
const ANKKURIT = new Set(["#tarjous", "#lomake", "#kartoitus"]);

const PALVELU_POLUSTA: Record<string, string> = {
  "/lyhytvideot": "Lyhytvideot",
  "/verkkosivut": "Verkkosivut",
  "/hakukoneoptimointi": "Hakukoneoptimointi",
  "/graafinen-suunnittelu": "Graafinen suunnittelu",
};

export type YhteysTieto = { palvelu?: string; paketti?: string; otsikko?: string; toive?: string };

export default function Kehotukset() {
  const polku = usePathname();
  const palvelu = PALVELU_POLUSTA[polku];

  /* Bottisuojan alustus (ks. botid.ts): ensimmainen fokus lomakkeen tai
     ikkunan kenttaan lataa kirjaston ja kaarii fetchin. Haasteskripti
     haetaan vasta lahetyksessa. Sivulatauksessa ei ladata mitaan. */
  useEffect(() => {
    const fokus = (e: FocusEvent) => {
      if (!(e.target as Element | null)?.closest?.("form, dialog")) return;
      document.removeEventListener("focusin", fokus);
      void alustaBotId();
    };
    document.addEventListener("focusin", fokus);
    return () => document.removeEventListener("focusin", fokus);
  }, []);

  useEffect(() => {
    const klikki = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as Element | null)?.closest?.("[data-varaus], [data-yhteys], a[href]");
      if (!el) return;
      /* Ikkunoiden omat linkit (puhelin, sahkoposti) toimivat normaalisti. */
      if (el.closest("dialog")) return;

      let kohde: "varaus" | "yhteys" | null = null;
      let paketti: string | undefined;
      let palveluNyt = palvelu;
      let otsikko: string | undefined;
      if (el.hasAttribute("data-varaus")) kohde = "varaus";
      else if (el.hasAttribute("data-yhteys")) {
        kohde = "yhteys";
        /* Esim. hintalaskurin valinnat: data-paketti ja data-paketti-otsikko. */
        const h = el as HTMLElement;
        /* Etusivun palvelukortit: data-palvelu esivalitsee palvelun. */
        palveluNyt = h.dataset.palvelu || palvelu;
        paketti = h.dataset.paketti || undefined;
        otsikko = h.dataset.pakettiOtsikko || undefined;
      }
      else {
        const a = el as HTMLAnchorElement;
        const u = new URL(a.href, location.href);
        if (u.pathname !== location.pathname || u.hash.length < 2) return;
        /* Muut saman sivun ankkurit (esim. heron "Katso hinnat"): suora
           hyppy ilman vieritysanimaatiota, ks. Pehmeavieritys. */
        if (!ANKKURIT.has(u.hash)) {
          const id = decodeURIComponent(u.hash.slice(1));
          if (!document.getElementById(id)) return;
          e.preventDefault();
          e.stopPropagation();
          window.dispatchEvent(new CustomEvent("ws:hyppy", { detail: id }));
          return;
        }
        const hinnasto = a.closest("#hinnoittelu");
        /* UKK:n tekstilinkit ("tarjouslomakkeella", "tarjouspyynnon")
           puhuvat lomakkeesta, joten ne avaavat yhteyslomakkeen. */
        if (hinnasto || a.closest("#ukk") || /^kysy/i.test(a.textContent?.trim() ?? "")) {
          kohde = "yhteys";
          if (hinnasto) {
            /* Paketin nimi: data-paketti (taulukot) tai lahimman kortin otsikko. */
            paketti = a.dataset.paketti;
            let k: Element | null = a.parentElement;
            while (k && k !== hinnasto && !k.querySelector("h3, h4")) k = k.parentElement;
            paketti ??= k?.querySelector("h3, h4")?.textContent?.trim() || undefined;
          }
        } else kohde = "varaus";
      }
      e.preventDefault();
      e.stopPropagation();
      const tieto: YhteysTieto = { palvelu: palveluNyt, paketti, otsikko };
      window.dispatchEvent(new CustomEvent(kohde === "varaus" ? "ws:varaus" : "ws:yhteys", { detail: tieto }));
    };
    document.addEventListener("click", klikki);
    return () => document.removeEventListener("click", klikki);
  }, [palvelu]);

  return (
    <>
      <YhteysIkkuna />
      <VarausIkkuna />
    </>
  );
}
