"use client";

import { useEffect, useRef } from "react";
import n from "./HakuNousu.module.css";

/**
 * HAKUTULOS NOUSEE (3.10.2026, realistisempi versio).
 *
 * Heron oikea palsta on hakutulossivu sellaisena kuin asiakas sen
 * nakee: valkoinen pohja, sivuston nimi ja ikoni, polku, sininen otsikko
 * ja kuvausteksti. Yrityksesi tulos nousee viidennelta sijalta
 * ensimmaiseksi sita mukaa kun lukija vierittaa, ja tuloslistan
 * ulkopuolella laskurit kertovat sijoituksen, suuntaa antavan
 * klikkiosuuden ja kuukauden seka sen, mitka nelja tyota on tehty.
 * Yritysten nimet ovat keksittyja esimerkkeja.
 *
 * MEKANIIKKA. Desktopilla hero on pinnattu (.hk-pin, globals.css), ja
 * etenema lasketaan pinnauskaaresta. Kapealla naytolla etenema
 * lasketaan kortin sijainnista. Rivit liikkuvat transformilla (--y),
 * ja arvot kirjoitetaan vain kun ne muuttuvat. Kirjoitusanimaatio on
 * kertaluonteinen ja ohitetaan reduced-motionilla; scrub jaa.
 */
type Tulos = { nimi: string; polku: string; otsikko: string; kuvaus: string; ikoni: string; vari: string; tahdet?: string };
const KILPAILIJAT: Tulos[] = [
  {
    nimi: "Kilpailija Oy",
    polku: "kilpailija.fi › ilmalampopumput",
    otsikko: "Ilmalämpöpumput ja asennus | Kilpailija Oy",
    kuvaus: "Laaja valikoima ilmalämpöpumppuja. Pyydä tarjous asennuksesta koko Uudellemaalle.",
    ikoni: "K",
    vari: "#e8710a",
  },
  {
    nimi: "Verkkokauppa",
    polku: "verkkokauppa.example › lampopumput",
    otsikko: "Lämpöpumput edullisesti verkosta",
    kuvaus: "Ilmalämpöpumput suoraan kotiin. Toimitus 1–3 arkipäivässä, asennus erikseen.",
    ikoni: "V",
    vari: "#1e8e3e",
  },
  {
    nimi: "Yrityshakemisto",
    polku: "hakemisto.example › espoo › lvi",
    otsikko: "LVI-yritykset Espoo – vertaa ja pyydä tarjouksia",
    kuvaus: "Löydä paikalliset LVI-yritykset Espoosta, arviot ja yhteystiedot.",
    ikoni: "H",
    vari: "#7b61ff",
  },
  {
    nimi: "Lämpöpumppuopas",
    polku: "lampopumppu-opas.example",
    otsikko: "Näin valitset ilmalämpöpumpun – opas",
    kuvaus: "Vertailimme suosituimmat mallit. Mitä asennus maksaa ja mihin kannattaa kiinnittää huomiota.",
    ikoni: "L",
    vari: "#d93025",
  },
];
const OMA: Tulos = {
  nimi: "Yrityksesi Oy",
  polku: "yrityksesi.fi › palvelut › ilmalampopumput",
  otsikko: "Ilmalämpöpumpun asennus Espoossa | Yrityksesi Oy",
  kuvaus: "Asennus avaimet käteen pääkaupunkiseudulla. Kiinteä hinta, asennus yhdessä päivässä.",
  ikoni: "Y",
  vari: "#0b8aa3",
  tahdet: "4,9 ★★★★★ (127)",
};
const TYOT: [string, string][] = [
  ["Tekninen kunto", "Nopeus ja indeksointi korjattu"],
  ["Sisältö", "Oma palvelusivu tälle haulle"],
  ["Auktoriteetti", "Maininnat luotettavista lähteistä"],
  ["Paikallinen näkyvyys", "Yritysprofiili ja arvostelut"],
];
const HAKU = "ilmalämpöpumppu asennus espoo";
const RIVI = 84;
const N = KILPAILIJAT.length; // oma lahtee sijalta N+1

function Rivi({ t, oma }: { t: Tulos; oma?: boolean }) {
  return (
    <li className={oma ? `${n.rivi} ${n.oma}` : n.rivi} data-n={oma ? "oma" : "muu"}>
      <div className={n.lahde}>
        <i className={n.ikoni} style={{ background: t.vari }}>
          {t.ikoni}
        </i>
        <span>
          <b>{t.nimi}</b>
          <small>{t.polku}</small>
        </span>
        {oma ? <em className={n.sina}>Sinä</em> : null}
      </div>
      <p className={n.otsikko}>{t.otsikko}</p>
      <p className={n.kuvaus}>
        {t.tahdet ? <span className={n.tahdet}>{t.tahdet} · </span> : null}
        {t.kuvaus}
      </p>
    </li>
  );
}

export default function HakuNousu() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leveä = matchMedia("(min-width: 981px)");
    const kirjoitus = el.querySelector<HTMLElement>("[data-n=haku]")!;
    const oma = el.querySelector<HTMLElement>("[data-n=oma]")!;
    const muut = Array.from(el.querySelectorAll<HTMLElement>("[data-n=muu]"));
    const sija = el.querySelector<HTMLElement>("[data-n=sija]")!;
    const kk = el.querySelector<HTMLElement>("[data-n=kk]")!;
    const klikit = el.querySelector<HTMLElement>("[data-n=klikit]")!;
    const tyot = Array.from(el.querySelectorAll<HTMLElement>("[data-n=tyo]"));
    const pin = el.closest<HTMLElement>(".hk-pin");
    const vihje = pin?.querySelector<HTMLElement>("[data-n=vihje]") ?? null;

    let ajastin = 0;
    if (!reduce) {
      kirjoitus.textContent = "";
      let i = 0;
      const askel = () => {
        kirjoitus.textContent = HAKU.slice(0, ++i);
        if (i < HAKU.length) ajastin = window.setTimeout(askel, 38 + Math.random() * 40);
      };
      ajastin = window.setTimeout(askel, 700);
    }

    const muisti = new WeakMap<Element, string>();
    const aseta = (e: HTMLElement, k: string, v: string) => {
      const avain = k + "=" + v;
      if (muisti.get(e) === avain) return;
      muisti.set(e, avain);
      e.style.setProperty(k, v);
    };
    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    /* Suuntaa antava klikkiosuus sijoittain. */
    const OSUUS = [27, 15, 11, 8, 6];

    let raf = 0;
    let edellinen = -1;
    const laske = () => {
      raf = 0;
      const vh = window.innerHeight;
      let p: number;
      if (pin && leveä.matches) {
        const r = pin.getBoundingClientRect();
        p = clamp(-r.top / Math.max(r.height - vh, 1));
      } else {
        const r = el.getBoundingClientRect();
        p = clamp((vh * 0.9 - r.top) / Math.max(r.height * 1.4, 1));
      }
      const pq = Math.round(p * 400) / 400;
      if (pq === edellinen) return;
      edellinen = pq;
      const f = N - N * ease(clamp((pq - 0.05) / 0.85));
      aseta(oma, "--y", (f * RIVI).toFixed(1) + "px");
      muut.forEach((m, i) => {
        aseta(m, "--y", ((i + clamp(i + 1 - f)) * RIVI).toFixed(1) + "px");
      });
      const s = Math.round(f) + 1;
      if (sija.textContent !== String(s)) sija.textContent = String(s);
      const k = String(1 + Math.round(11 * clamp(pq / 0.9)));
      if (kk.textContent !== k) kk.textContent = k;
      const c = "~" + OSUUS[s - 1] + " %";
      if (klikit.textContent !== c) klikit.textContent = c;
      tyot.forEach((t, i) => {
        const on = pq > 0.12 + i * 0.2 ? "1" : "0";
        if (t.dataset.on !== on) t.dataset.on = on;
      });
      if (vihje) {
        const pois = pq > 0.03 ? "1" : "0";
        if (vihje.dataset.pois !== pois) vihje.dataset.pois = pois;
      }
      /* Ennen vieritysta oma tulos sykkii viidennella sijalla: tama
         olet sina, ja tasta lahdetaan. */
      const alku = pq < 0.03 ? "1" : "0";
      if (el.dataset.alku !== alku) el.dataset.alku = alku;
      const y1 = f < 0.5 ? "1" : "0";
      if (el.dataset.ykkonen !== y1) el.dataset.ykkonen = y1;
    };
    const vieritys = () => {
      if (!raf) raf = requestAnimationFrame(laske);
    };
    window.addEventListener("scroll", vieritys, { passive: true });
    window.addEventListener("resize", vieritys);
    laske();
    return () => {
      window.clearTimeout(ajastin);
      window.removeEventListener("scroll", vieritys);
      window.removeEventListener("resize", vieritys);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={n.kehys} ref={ref} data-ykkonen="0">
      {/* Laskurit hakutulossivun ylapuolella, tummalla pohjalla. */}
      <div className={n.mittari}>
        <div>
          <span className={n.pieni}>Sijoitus</span>
          <b className={n.iso}>
            <em>#</em>
            <span data-n="sija">5</span>
          </b>
        </div>
        <div>
          <span className={n.pieni}>Klikeistä</span>
          <b className={n.keski} data-n="klikit">
            ~6 %
          </b>
        </div>
        <div className={n.oikea}>
          <span className={n.pieni}>Kuukausi</span>
          <b className={n.keski}>
            <span data-n="kk">1</span>
            <em> / 12</em>
          </b>
        </div>
      </div>

      <div className={n.serp}>
        <div className={n.haku}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span data-n="haku" className={n.hakuteksti}>
            {HAKU}
          </span>
          <i className={n.kursori} aria-hidden="true" />
        </div>
        <div className={n.valilehdet} aria-hidden="true">
          <span className={n.aktiivinen}>Kaikki</span>
          <span>Kartat</span>
          <span>Kuvat</span>
          <span>Uutiset</span>
        </div>
        <p className={n.maara}>Noin 48 300 tulosta (0,41 s)</p>
        <ol className={n.lista} style={{ height: (N + 1) * RIVI }} aria-hidden="true">
          {KILPAILIJAT.map((t) => (
            <Rivi key={t.polku} t={t} />
          ))}
          <Rivi t={OMA} oma />
        </ol>
      </div>

      <ul className={n.tyot} aria-label="Neljä työtä, jotka nostavat sijoitusta">
        {TYOT.map(([t, kuvaus]) => (
          <li key={t} data-n="tyo" data-on="0">
            <i className={n.tyoMerkki} aria-hidden="true" />
            <b>{t}</b>
            <span>{kuvaus}</span>
          </li>
        ))}
      </ul>
      <p className={n.selite}>Esimerkki seuratusta hakusanasta. Yritysten nimet ovat keksittyjä.</p>
    </div>
  );
}
