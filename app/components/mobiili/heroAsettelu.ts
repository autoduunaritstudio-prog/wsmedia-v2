/* HERON ASETTELU MATALILLA NAYTOILLA (7.10.2026).

   iPhone 12:n Safarissa nakyva korkeus on noin 664 px; suunnitelma on
   piirretty 844 px:lle, ja sita matalammilla naytoilla heron animaatio ja
   otsikko menivat paallekkain. Periaate (hyvaksytty malli
   _mobiili-design/korjaukset/seo-hero-malli.html, asettele()):

   - vieritysvihje ja loppuviesti alareunassa: top = svh - 12 - 58
     (CSS: top: calc(100svh - 70px))
   - tekstilohko ankkuroidaan vihjeen ylapuolelle (CSS: bottom: 82px),
     joten se on oikeassa paikassa jo ensimmaisessa piirrossa
   - kuvitus alkaa ylapalkin alta (kuvaY) ja pienenee mittakaavalla niin,
     etta sen suojattava osa paattyy 14 px tekstin ylapuolelle:
     s = min(1, (tekstin ylareuna - 14 - kuvaY) / kuvituksen korkeus).
     Mittakaava kirjoitetaan CSS:n scale-ominaisuuteen (transform-origin
     ylhaalla keskella), jolloin vierityksen transform pysyy erillaan.
   - matalilla naytoilla (svh < 730) tiivis versio: luokka
     mo-hero-tiivis heron juureen (sama raja kuin CSS:n media-ehdossa).

   Kutsutaan mountissa, fonttien latauduttua ja kun nakyman koko muuttuu.
   Palauttaa siivousfunktion. */

import { kuuntele, tilaNyt } from "./vieritys";

export type HeroAsettelu = {
  /** Heron pinnattu (sticky) laatikko. */
  hero: HTMLElement | null;
  /** Skaalattava kuvitus. */
  kuva: HTMLElement | null;
  /** Kuvituksen ylareuna px heron ylareunasta. */
  kuvaY: number;
  /** Suojattavan osan korkeus skaalaamattomana (oletus kuvan offsetHeight). */
  kuvaH?: (kuva: HTMLElement) => number;
  /** Tekstilohko (ankkuroitu alas CSS:lla). */
  teksti: HTMLElement | null;
  /** Kutsutaan uudella mittakaavalla (esim. Efektit lisaa sen omaan transformiinsa). */
  muuttui?: (s: number) => void;
};

export const TIIVIS_RAJA = 730;

export function asetteleHero(o: HeroAsettelu) {
  let viimeS = -1;
  let viimeAvain = "";
  const aja = () => {
    const { hero, kuva, teksti } = o;
    if (!hero || !kuva || !teksti) return;
    const { HV, W } = tilaNyt();
    const avain = `${W}x${HV}`;
    hero.classList.toggle("mo-hero-tiivis", HV < TIIVIS_RAJA);
    const kuvaH = o.kuvaH ? o.kuvaH(kuva) : kuva.offsetHeight;
    const tekstiY = teksti.offsetTop;
    const s = Math.max(0.2, Math.min(1, (tekstiY - 14 - o.kuvaY) / Math.max(1, kuvaH)));
    if (Math.abs(s - viimeS) < 0.002 && avain === viimeAvain) return;
    viimeS = s;
    viimeAvain = avain;
    kuva.style.transformOrigin = "50% 0";
    kuva.style.setProperty("scale", s.toFixed(4));
    kuva.classList.toggle("mo-hero-skaalattu", s < 0.999);
    o.muuttui?.(s);
  };
  aja();
  document.fonts?.ready.then(aja, () => {});
  let edW = 0, edH = 0;
  const irrota = kuuntele({
    lue: (t) => {
      if (t.W !== edW || t.HV !== edH) {
        edW = t.W;
        edH = t.HV;
        aja();
      }
    },
  });
  return irrota;
}
