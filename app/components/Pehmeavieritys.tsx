"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/**
 * PEHMEA VIERITYS.
 *
 * ONGELMA JOKA TAHAN RATKAISTAAN. Mac-ohjauslevy ja Magic Mouse
 * tuottavat pikselitarkkoja vierintatapahtumia, kymmenia pienia askelia
 * sekunnissa, ja sivu nayttaa silloin tasan silta milta sen pitaakin.
 * Tavallisen hiiren rulla antaa yhden napsautuksen kerrallaan, ja selain
 * siirtaa sivua kertaheitolla noin sadan pikselin verran. Koko sivun
 * kuvakieli on sidottu vierityksen arvoon, joten napsautushiirella
 * jokainen arvo hyppaa saman verran: liike ei ole rajumpi vaan se
 * katoaa, koska vali-asentoja ei piirreta kertaakaan.
 *
 * SiteEffectsissa on jo koristeiden oma pehmennys, joka tekee hypysta
 * liu'un kaiuille, parallaksille ja paljastukselle. Se ei kuitenkaan
 * koske itse sivun liikkeeseen: sivu loikkaa yha, ja juuri se tuntuu
 * teravalta. Tama komponentti pehmentaa liikkeen itsensa.
 *
 * MIKSI LENIS EIKA OMA TOTEUTUS. Vierityksen pehmennyksessa kaikki
 * vaikeus on reunatapauksissa: sisakkaiset vieritysalueet, ankkurit,
 * nappaimisto, kosketus, modaalit, iframet. Oma toteutus olisi niiden
 * uudelleenkeksimista. Lenis ajaa oikeaa window-vieritysta
 * (ei transformia), joten position: sticky, selaimen oma haku ja koko
 * .pino-arkkitehtuuri toimivat muuttumattomina. Juuri siksi se
 * kelpaa tahan: tama sivusto EI kesta vierityksen korvaamista
 * transformilla.
 *
 * ASETUKSET. lerp 0,1 tarkoittaa etta joka kehyksessa kuljetaan
 * kymmenesosa jaljella olevasta matkasta, eli noin 230 ms yhdeksaan
 * kymmenesosaan. wheelMultiplier 0,7 lyhentaa yhden napsautuksen
 * askelta, jolloin matkaa on vahemman pehmennettavana.
 *
 * KOSKETUS JAA NATIIVIKSI. syncTouch on oletuksena epatosi eika sita
 * kytketa paalle: puhelimen oma vieritys hitausliikkeineen on parempi
 * kuin mikaan jaljitelma, ja sen korvaaminen on yleisin tapa saada
 * pehmea vieritys tuntumaan rikkinaiselta.
 *
 * LUKOT. Heron latausruutu pysayttaa vierityksen luokalla hero-locked,
 * jonka takana on html { overflow: hidden }. Se ei yksin riita kun
 * Lenis on paalla: overflow estaa kayttajan vierityksen mutta ei
 * skriptattua, ja Lenis ajaa omaa window.scrollTo:taan. Juuri tahan
 * Lenis aiemmin kaatui ja poistettiin kokonaan. Nyt lukko havaitaan ja
 * Lenis pysaytetaan sen ajaksi, mika on sen oma tukema tapa.
 *
 * prefers-reduced-motion: ei kaynnisteta lainkaan. Pehmea vieritys on
 * liiketta, ja se on tasan se liike jonka asetus pyytaa pois.
 */

/** Luokat joiden aikana vieritys on lukittu. */
const LUKOT = ["hero-locked", "lukossa"];

export default function Pehmeavieritys() {
  /* SIVUNVAIHTO (4.10.2026). Lenis elaa juuriasettelussa sivujen yli.
     Kun sivu vaihtui (esim. footerin linkista), Next vieritti alkuun
     mutta Lenisin oma tavoite jai vanhan sivun loppuun, ja uusi sivu
     liukui lopusta alkuun. Nyt sivun vaihtuessa Lenis hyppaa heti
     alkuun tai, jos osoitteessa on #ankkuri, suoraan sen kohdalle. */
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const ensimmainen = useRef(true);
  useEffect(() => {
    if (ensimmainen.current) {
      ensimmainen.current = false;
      return;
    }
    const lenis = lenisRef.current;
    const hyppaa = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const kohde = hash ? document.getElementById(hash) : null;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(kohde ?? 0, { immediate: true, force: true });
      } else if (kohde) kohde.scrollIntoView({ behavior: "instant" as ScrollBehavior });
      else window.scrollTo({ top: 0, behavior: "instant" });
    };
    hyppaa();
    /* Uuden sivun korkeus voi kasvaa vasta seuraavassa kehyksessa
       (kuvat, pinnatut osiot), joten ankkuri tarkistetaan viela kerran. */
    const r = requestAnimationFrame(() => requestAnimationFrame(hyppaa));
    return () => cancelAnimationFrame(r);
  }, [pathname]);

  /* SAMAN SIVUN ANKKURIT HYPPAAVAT SUORAAN (4.10.2026). Kehotukset.tsx
     ohjaa klikkauksen tanne. Pitka liuku heron "Katso hinnat"
     -linkista hinnastoon kesti ja ajoi kaikki pinon animaatiot lapi. */
  useEffect(() => {
    const hyppy = (e: Event) => {
      const kohde = document.getElementById((e as CustomEvent<string>).detail);
      if (!kohde) return;
      const lenis = lenisRef.current;
      if (lenis) lenis.scrollTo(kohde, { immediate: true, force: true });
      else kohde.scrollIntoView({ behavior: "instant" as ScrollBehavior });
      history.replaceState(history.state, "", `#${kohde.id}`);
    };
    window.addEventListener("ws:hyppy", hyppy);
    return () => window.removeEventListener("ws:hyppy", hyppy);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.7,
      gestureOrientation: "vertical",
      /* Ankkurit hoitaa Kehotukset.tsx: kehotukset avaavat ikkunan,
         muut ankkurit hyppaavat suoraan (ws:hyppy). */
      anchors: false,
      /* Lenis pyorittaa oman rAF-silmukkansa. Erillinen silmukka olisi
         yksi kehyskohtainen callback lisaa ilman etta se antaa mitaan. */
      autoRaf: true,
    });
    lenisRef.current = lenis;

    const html = document.documentElement;
    let pysaytetty = false;

    const tarkistaLukko = () => {
      const lukossa = LUKOT.some((k) => html.classList.contains(k));
      if (lukossa === pysaytetty) return;
      pysaytetty = lukossa;
      if (lukossa) lenis.stop();
      else lenis.start();
    };

    /* Heti kerran: lukko on voitu asettaa jo ennen taman komponentin
       kiinnittymista, koska heron oma efekti voi ajaa ensin. */
    tarkistaLukko();

    const mo = new MutationObserver(tarkistaLukko);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => {
      mo.disconnect();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
