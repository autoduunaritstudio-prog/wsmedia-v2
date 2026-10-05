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
  const [nayta] = useState(() => (typeof window === "undefined" ? true : suoraSaapuminen()));
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
      /* Ruutu jaa DOMiin piilotettuna (display: none), ei poisteta: sen
         lasnaolo kertoo CSS:lle, etta sivu avattiin ruudun kautta, ks.
         globals.css "HERON TEKSTI RUUDUN TAKANA". */
      poisto = window.setTimeout(() => el?.classList.add("lataus-pois"), HAIVYTYS_MS);
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
    let kaikkiValmiina = false;
    const valmis = (nimi: string) => {
      if (!odotettavat.delete(nimi)) return;
      painoValmis += PAINO[nimi];
      if (odotettavat.size === 0) kaikkiValmiina = true;
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
      if (kaikkiValmiina) return 1;
      return (painoValmis + PAINO.video * videoOsuus()) / painoYht;
    };

    /* PALKKI LIIKKUU KOMPOSITORISSA KOKO AJAN (2.10.2026).
       Ennen skriptia palkkia kuljettaa CSS-animaatio (lataus-palkki).
       Skriptin otettua ohjat palkkia liikutetaan Web Animations
       -rajapinnalla (element.animate), joka ajetaan sekin kompositorissa:
       mitattuna 4x hidastuksella paasaikeella kirjoitettu palkki seisoi
       sekunteja kerrallaan, koska sivun kaynnistys varasi paasaikeen.

       Liike on aina "nykyisesta kohdasta tavoitteeseen" -animaatio:
         - todellinen edistyminen kasvaa -> uusi animaatio sinne
           (0,5 s + 1,4 s kertaa matka) ja sen jalkeen hidas hiipiminen kohti 90 %:a (12 s), joten palkki
           ei pysahdy vaikka mitaan ei valmistuisi;
         - kaikki valmista (tai katto) -> loppuunajo pehmealla
           kiihdytyksella ja jarrutuksella, kesto 0,7..1,3 s jaljella olevan
           matkan mukaan (Tuomaksen palaute: loppu oli liian terava).
       Logon taytto (maski) ei voi liikkua kompositorissa; se luetaan
       palkista joka kehys aina kun paasaie ehtii. */
    const palkki = el?.querySelector<HTMLElement>(".hero-load-bar") ?? null;
    const nykyinen = (): number => {
      if (!palkki) return 0;
      const m = /matrix\(([-\d.e]+)/.exec(getComputedStyle(palkki).transform);
      return m ? Math.min(Math.max(parseFloat(m[1]), 0), 1) : 0;
    };
    let anim: Animation | null = null;
    const HIIPIMINEN_MS = 12000;
    const kohti = (tavoite: number) => {
      if (!palkki || typeof palkki.animate !== "function") return;
      const v = nykyinen();
      const g = Math.max(tavoite, v);
      const katto = Math.max(0.9, g);
      /* Nousun kesto matkan mukaan: iso harppaus (video valmistui) kestaa
         pidempaan eika nayta hypylta. */
      const nousu = 500 + 1400 * (g - v);
      const uusi = palkki.animate(
        [
          { transform: `scaleX(${v})`, easing: "cubic-bezier(.4,0,.3,1)" },
          { transform: `scaleX(${g})`, offset: nousu / (nousu + HIIPIMINEN_MS), easing: "cubic-bezier(.2,.5,.3,1)" },
          { transform: `scaleX(${katto})` },
        ],
        { duration: nousu + HIIPIMINEN_MS, fill: "forwards" },
      );
      anim?.cancel();
      anim = uusi;
    };
    let auennut = false;
    let raf = 0;
    let kiinni = false;
    const loppuun = () => {
      if (auennut) return;
      auennut = true;
      window.clearTimeout(katto);
      /* NOPEALLA YHTEYDELLA RUUTUA EI NAE (5.10.2026). Sisalto (merkki,
         palkki, teksti) tulee esiin vasta 0,8 s piirron jalkeen
         (.hero-load-sisus, CSS). Jos kaikki ehti valmiiksi sita ennen,
         kavija on nahnyt vain tumman pohjan: palkkia ei ajeta loppuun eika
         ruutua haivyteta, vaan sivu avataan heti. */
      const sisus = el?.querySelector<HTMLElement>(".hero-load-sisus");
      if (sisus && parseFloat(getComputedStyle(sisus).opacity) < 0.01) {
        kiinni = true;
        cancelAnimationFrame(raf);
        anim?.cancel();
        el?.classList.add("heti");
        avaa();
        return;
      }
      if (!palkki || typeof palkki.animate !== "function") { avaa(); return; }
      const v = nykyinen();
      const uusi = palkki.animate([{ transform: `scaleX(${v})` }, { transform: "scaleX(1)" }], {
        duration: 700 + 600 * (1 - v),
        easing: "cubic-bezier(.65,0,.35,1)",
        fill: "forwards",
      });
      anim?.cancel();
      anim = uusi;
      uusi.onfinish = () => {
        /* Kehyssilmukka pois: palkki on taynna eika sita enaa lueta. */
        kiinni = true;
        cancelAnimationFrame(raf);
        el?.style.setProperty("--hero-load-p", "100%");
        avaa();
      };
    };

    /* Ohjat skriptille: animaatio jatkaa siita mihin CSS ehti, ja vasta
       sitten CSS-animaatio pois (.lataus-js), ettei palkki hyppaa. */
    kohti(0);
    el?.classList.add("lataus-js");

    /* EDISTYMINEN. Todellinen osuus: fontit 15 %, tausta 25 %, video 60 %
       (videon osuus kasvaa sita mukaa kuin dataa tulee), joten nopealla
       yhteydella palkki etenee nopeasti ja hitaalla hitaasti. */
    let edTavoite = 0;
    const kehys = () => {
      const tod = todellinen();
      if (tod >= 1) { loppuun(); }
      else if (!auennut && tod > edTavoite + 0.03) { edTavoite = tod; kohti(tod); }
      el?.style.setProperty("--hero-load-p", `${(nykyinen() * 100).toFixed(1)}%`);
      if (!kiinni) raf = requestAnimationFrame(kehys);
    };
    raf = requestAnimationFrame(kehys);
    siivous.push(() => { kiinni = true; cancelAnimationFrame(raf); anim?.cancel(); });

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
    katto = window.setTimeout(loppuun, KATTO_MS);

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
        <div className="hero-load-sisus">
          <div className="hero-load-logo">
            <LogoMark className="hero-load-dim" />
            <LogoMark className="hero-load-fill" />
          </div>
          <div className="hero-load-track">
            <div className="hero-load-bar" />
          </div>
          <p className="lataus-teksti">Hetki, sivu latautuu</p>
        </div>
      </div>
    </>
  );
}
