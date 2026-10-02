"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./Logo";
import { onSaastoTiukka } from "./kevyttila";

/**
 * LATAUSRUUTU PALVELUSIVULLE (2.10.2026).
 *
 * Sama ulkoasu kuin etusivun heron latausruudulla (.hero-load: merkki
 * tayttyy ja palkki etenee), mutta odotettavat asiat ovat taman sivun:
 *   1. fontit
 *   2. verkostotausta on valmiina kuvana (NetBackdrop ilmoittaa)
 *   3. heron keskimmaisen puhelimen video on toistokunnossa
 * Kun ruutu haipyy, sivu on kerralla valmis: tausta ja videot eivat
 * ilmesty eri aikaan, ja raskas alkutyo on tehty ruudun takana.
 *
 * KATTO. Palkki ajetaan loppuun viimeistaan KATTO_MS kiinnittymisen jalkeen,
 * vaikka jokin jaisi kesken. Hitaalla yhteydella video jatkaa
 * latautumista ja lahtee kayntiin kun ehtii.
 *
 * VAIN SUORALLA SAAPUMISELLA. Kun sivulle tullaan sivuston sisalta,
 * ruutua ei nayteta: joka siirtymalla toistuva ruutu on viive eika apu.
 * Ehto: ruutu on jo palvelimen HTML:ssa (dokumentti ladattiin talle
 * sivulle) eika sita ole viela naytetty.
 *
 * VIERITYS. Sivua ei lukita overflow: hidden -saannolla, koska se
 * poistaa vierityspalkin ja siirtaa sisaltoa palkin leveyden verran
 * (Windows). Rulla, kosketus ja nappaimet estetaan tapahtumista ruudun
 * ajan, ja sijainti palautetaan alkuun avautuessa.
 *
 * VARAVENTTIILIT ILMAN JAVASCRIPTIA. Ruutu on palvelimen HTML:ssa, jotta
 * se peittaa sivun ensimmaisesta kuvasta asti. Jos skripti ei koskaan
 * kaynnisty, CSS-animaatio haivyttaa ruudun 15 sekunnin kohdalla, ja
 * <noscript> piilottaa sen heti.
 */

const KATTO_MS = 1500;
const HAIVYTYS_MS = 800;
const VIERITYSNAPPAIMET = new Set([
  " ",
  "PageDown",
  "PageUp",
  "ArrowDown",
  "ArrowUp",
  "End",
  "Home",
]);

let naytetty = false;

function suoraSaapuminen(): boolean {
  /* Ruutu on palvelimen HTML:ssa. Jos se on DOMissa jo ennen taman
     komponentin ensimmaista renderointia, dokumentti ladattiin talle
     sivulle. Sisaisella siirtymalla sita ei ole. (Osoitetta ei voi
     kayttaa: Next renderoi uuden sivun ennen kuin osoite vaihtuu.) */
  return !naytetty && !!document.querySelector(".lataus");
}

type Props = {
  /** Videon valitsin, jonka toistokuntoa odotetaan. */
  video?: string;
};

export default function Latausruutu({ video }: Props) {
  /* Palvelimella aina nakyvissa. Selaimessa sisaisella siirtymalla ei
     lainkaan, jolloin ensimmainenkaan kuva ei nayta ruutua. */
  const [nayta, setNayta] = useState(() => (typeof window === "undefined" ? true : suoraSaapuminen()));
  const ruutu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nayta) return;
    naytetty = true;
    const html = document.documentElement;
    const el = ruutu.current;
    html.dataset.lataus = "1";

    const esta = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    const estaNappain = (e: KeyboardEvent) => {
      if (VIERITYSNAPPAIMET.has(e.key)) esta(e);
    };
    const kuuntelu = { capture: true, passive: false } as const;
    window.addEventListener("wheel", esta, kuuntelu);
    window.addEventListener("touchmove", esta, kuuntelu);
    window.addEventListener("keydown", estaNappain, kuuntelu);
    const vapautaVieritys = () => {
      window.removeEventListener("wheel", esta, kuuntelu);
      window.removeEventListener("touchmove", esta, kuuntelu);
      window.removeEventListener("keydown", estaNappain, kuuntelu);
    };

    let auki = false;
    let katto = 0;
    let poisto = 0;
    const avaa = () => {
      if (auki) return;
      auki = true;
      window.clearTimeout(katto);
      vapautaVieritys();
      /* Ankkurilinkki menee nollauksen edelle, kuten etusivulla. */
      if (!window.location.hash && window.scrollY !== 0) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      delete html.dataset.lataus;
      el?.classList.add("is-gone");
      window.dispatchEvent(new Event("ws-lataus-auki"));
      poisto = window.setTimeout(() => setNayta(false), HAIVYTYS_MS);
    };

    /* EDISTYMINEN (2.10.2026 paivitys). Palkki ei saa seisoa: hitaalla
       koneella se jai pitkaksi aikaa harmaaksi, koska se hyppasi vain kun
       jokin kolmesta asiasta valmistui. Nyt naytetty arvo liukuu joka
       kehys kohti tavoitetta, ja tavoite koostuu kahdesta:
         - TODELLINEN: fontit 15 %, tausta 25 %, video 60 %. Videon osuus
           kasvaa sita mukaa kuin dataa tulee (buffered), joten nopealla
           yhteydella palkki kiitaa ja hitaalla etenee hitaasti.
         - HIIPIMA: hidas eteneminen joka hidastuu kohti 90 %:a. Se pitaa
           palkin liikkeessa silloinkin kun mikaan ei juuri valmistu, mutta
           ei koskaan tayta palkkia itse.
       Kun kaikki on valmis (tai katto tulee vastaan), tavoite on 100 %,
       palkki tayttyy nopeasti loppuun ja ruutu haipyy vasta sitten. */
    const PAINO: Record<string, number> = { fontit: 0.15, tausta: 0.25, video: 0.6 };
    const odotettavat = new Set<string>();
    let painoYht = 0;
    let painoValmis = 0;
    let loppuun = false;
    const valmis = (nimi: string) => {
      if (!odotettavat.delete(nimi)) return;
      painoValmis += PAINO[nimi];
      if (odotettavat.size === 0) loppuun = true;
    };
    const odota = (nimi: string) => {
      odotettavat.add(nimi);
      painoYht += PAINO[nimi];
    };

    const siivous: Array<() => void> = [];

    odota("fontit");
    odota("tausta");
    const v = video && !onSaastoTiukka() ? document.querySelector<HTMLVideoElement>(video) : null;
    /* Videota odotetaan vain jos se on nakyvissa: ankkurilla keskelle
       sivua saapuva ei tarvitse heroa, eika piilotettu video lataudu. */
    const videoMukana = !!v && v.getClientRects().length > 0 && !window.location.hash;
    if (videoMukana) odota("video");

    /* Videon osittainen edistyminen 0..1: puskuroitu aika suhteessa
       siihen maaraan jonka selain tyypillisesti haluaa ennen toistoa. */
    const videoOsuus = () => {
      if (!videoMukana || !v || !odotettavat.has("video")) return 0;
      const b = v.buffered;
      if (!b.length) return 0;
      const tarve = Math.min(v.duration || 3, 3);
      return Math.min(b.end(b.length - 1) / tarve, 0.95);
    };

    const todellinen = () => {
      if (loppuun) return 1;
      return (painoValmis + PAINO.video * videoOsuus()) / painoYht;
    };

    /* Aloitusarvo: ennen skriptin kaynnistymista CSS on jo kuljettanut
       palkkia (lataus-palkki-animaatio, transformilla eli kompositorissa,
       joten se liikkuu vaikka paasaie on varattu). Jatketaan siita,
       ettei palkki hyppaa taaksepain. */
    let nakyva = 0;
    let hiipima = 0;
    const palkki = el?.querySelector<HTMLElement>(".hero-load-bar") ?? null;
    if (palkki) {
      const m = /matrix\(([-\d.e]+)/.exec(getComputedStyle(palkki).transform);
      const alku = m ? parseFloat(m[1]) : 0;
      if (alku > 0) nakyva = hiipima = Math.min(alku, 0.7);
    }
    const kirjoita = () => {
      el?.style.setProperty("--hero-load-p", `${(nakyva * 100).toFixed(2)}%`);
      if (palkki) palkki.style.transform = `scaleX(${nakyva.toFixed(4)})`;
    };
    /* Arvo ensin, luokka sitten: muuten yhden kehyksen ajan palkki
       palaisi nollaan. */
    kirjoita();
    el?.classList.add("lataus-js");

    let raf = 0;
    let ed = 0;
    const kehys = (t: number) => {
      const dt = ed ? Math.min((t - ed) / 1000, 0.1) : 0;
      ed = t;
      const tod = todellinen();
      hiipima = Math.max(hiipima + dt * 0.14 * Math.max(0, 0.9 - hiipima), tod * 0.9);
      const tavoite = loppuun ? 1 : Math.max(tod, hiipima);
      /* Kohti tavoitetta noin 0,2 s:n aikavakiolla; loppuunajo nopeammin. */
      const tau = loppuun ? 0.2 : 0.3;
      /* Nopeuskatto 1,5 palkkia sekunnissa: kun video valmistuu kerralla,
         palkki pyyhkaisee loppuun eika hyppaa. */
      const askel = (tavoite - nakyva) * (1 - Math.exp(-dt / tau));
      nakyva += Math.min(askel, dt * 1.5);
      kirjoita();
      if (loppuun && nakyva > 0.995) {
        nakyva = 1;
        kirjoita();
        raf = 0;
        avaa();
        return;
      }
      raf = requestAnimationFrame(kehys);
    };
    raf = requestAnimationFrame(kehys);
    siivous.push(() => cancelAnimationFrame(raf));

    const fontit = document.fonts?.ready;
    if (fontit) fontit.then(() => valmis("fontit"), () => valmis("fontit"));
    else valmis("fontit");

    if (html.dataset.tausta === "1") valmis("tausta");
    else {
      const t = () => valmis("tausta");
      window.addEventListener("ws-tausta-valmis", t, { once: true });
      siivous.push(() => window.removeEventListener("ws-tausta-valmis", t));
    }

    if (videoMukana && v) {
      if (v.readyState >= 3) valmis("video");
      else {
        const k = () => valmis("video");
        v.addEventListener("canplay", k, { once: true });
        siivous.push(() => v.removeEventListener("canplay", k));
      }
    }

    /* Katto ei avaa suoraan vaan ajaa palkin loppuun: ruutu ei katoa
       keskeneraisen palkin paalta. */
    katto = window.setTimeout(() => {
      loppuun = true;
    }, KATTO_MS);

    return () => {
      window.clearTimeout(katto);
      window.clearTimeout(poisto);
      vapautaVieritys();
      siivous.forEach((f) => f());
      if (!auki) {
        delete html.dataset.lataus;
        window.dispatchEvent(new Event("ws-lataus-auki"));
      }
    };
    // Ajetaan kerran kiinnittyessa: nayta muuttuu vain epatodeksi lopussa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!nayta) return null;

  return (
    <>
      <noscript>
        <style>{".lataus{display:none!important}"}</style>
      </noscript>
      <div className="hero-load lataus" ref={ruutu} aria-hidden="true">
        <div className="hero-load-logo">
          <LogoMark className="hero-load-dim" />
          <LogoMark className="hero-load-fill" />
        </div>
        <div className="hero-load-track">
          <div className="hero-load-bar" />
        </div>
        <p className="lataus-teksti">Hetki, sivu latautuu</p>
      </div>
    </>
  );
}
