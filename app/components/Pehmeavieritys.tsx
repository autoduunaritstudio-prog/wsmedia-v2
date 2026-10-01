"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.7,
      gestureOrientation: "vertical",
      /* Ankkurit (#tarjous, #hinnoittelu) Lenisin kautta, jolloin ne
         liukuvat samalla kaavalla kuin muu vieritys eivatka hypi
         keskella pehmeaa liiketta. */
      anchors: true,
      /* Lenis pyorittaa oman rAF-silmukkansa. Erillinen silmukka olisi
         yksi kehyskohtainen callback lisaa ilman etta se antaa mitaan. */
      autoRaf: true,
    });

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
    };
  }, []);

  return null;
}
