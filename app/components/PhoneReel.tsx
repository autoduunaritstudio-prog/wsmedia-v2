"use client";

import { useEffect, useRef, useState } from "react";
import { peilaaKankaalle } from "./videokangas";
import { kytkeSaasto, onKevyt, onSaasto, onSaastoTiukka } from "./kevyttila";

/**
 * PUHELINMOCKUP JOSSA ON AITO VIDEO JA INSTAGRAM REELS -KAYTTOLIITTYMA.
 *
 * Eroaa <Phone />-komponentista siina etta ruudulla on oikea video
 * gradientin sijaan, ja etta laskurit kasvavat toiston mukana.
 *
 * LASKURIT JOHDETAAN VIDEON currentTimesta, EIVAT AJASTIMESTA.
 * Kolme syyta: luku palautuu itsestaan alkuun kun video luuppaa, se
 * pysahtyy jos selain pysayttaa toiston (esim. valilehti taustalla,
 * saastotila), eika se voi ajautua eri tahtiin kuvan kanssa. Ajastin
 * olisi rikkonut kaikki kolme.
 *
 * KASVU EI OLE TASAINEN. Tasaisesti nouseva luku lukee mittarina, ei
 * ihmisten reaktioina. Askeleet tulevat kiinteasta taulukosta, joten
 * nousu on epasaannollinen mutta TOISTETTAVA: sama kohta videossa antaa
 * aina saman luvun, eika palvelin- ja selainrenderi voi erota.
 */

/* 24 askelta, summa 1,000. Kasittain valitut niin etta valissa on
   tasaisia jaksoja ja muutama piikki - noin kayttaytyy video joka saa
   nakyvyytta aalloissa. */
const STEPS = [
  8, 12, 9, 31, 24, 14, 11, 46, 38, 22, 17, 15, 62, 51, 33, 26, 19, 88, 74, 45, 29, 21, 18, 87,
];
const TOTAL = STEPS.reduce((a, b) => a + b, 0);

/** Osuus 0..1 -> kuinka suuri osa kokonaiskasvusta on kertynyt. */
const grown = (p: number) => {
  const n = Math.min(Math.floor(p * STEPS.length), STEPS.length);
  let s = 0;
  for (let i = 0; i < n; i++) s += STEPS[i];
  return s / TOTAL;
};

const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

type Props = {
  className: string;
  depth: number;
  /**
   * Kumman alustan kayttoliittyma piirretaan. Sama komponentti molemmille,
   * koska videon toisto, nakyvyysvartija ja laskurimekanismi ovat tasan
   * samat - vain kehyksen elementit ja niiden paikat eroavat.
   */
  variant?: "reels" | "tiktok";
  src: string;
  poster: string;
  handle: string;
  /**
   * Profiilikuva. Kun tama puuttuu, avatar piirtyy gradienttina - se on
   * paikkamerkki asiakkaille joilta ei ole toimitettu logoa.
   */
  avatar?: string;
  caption: string;
  music: string;
  /** Alku- ja loppuluvut: mihin laskuri nousee videon aikana. */
  likes: [number, number];
  comments: [number, number];
  shares: [number, number];
  /** Vain tiktok-variantissa: tallennusten maara. */
  saves?: [number, number];
  /** Sivupuhelin: kevyessa tilassa (hidas laite) nayttaa pysakuvan. */
  toissijainen?: boolean;
};

export default function PhoneReel({
  className,
  depth,
  variant = "reels",
  src,
  poster,
  handle,
  avatar,
  caption,
  music,
  likes,
  comments,
  shares,
  saves,
  toissijainen = false,
}: Props) {
  const vid = useRef<HTMLVideoElement>(null);
  const prg = useRef<HTMLElement>(null);
  const kangas = useRef<HTMLCanvasElement>(null);
  /* Videon kuva piirretaan kankaalle, ks. videokangas.ts: kolme
     rinnakkain nakyvaa videota lukitsi sivun 30 fps:iin. */
  useEffect(() => {
    const v = vid.current;
    const c = kangas.current;
    if (!v || !c) return;
    return peilaaKankaalle(v, c);
  }, []);
  /* SUORITUSKYKY 30.9.2026. Aiemmin tila p paivitettiin JOKA KEHYS
     (setP rAF:ssa), eli kolme puhelinta renderoitiin Reactissa uudelleen
     kolmesti kehyksessa niin kauan kuin videot pyorivat. Nyt Reactin tila
     on vain porras (STEPS, 24 askelta), joka muuttuu 24 kertaa kierroksen
     aikana, ja etenemapalkki kirjoitetaan suoraan DOMiin. */
  const [p, setP] = useState(0);
  const [playing, setPlaying] = useState(false);
  /* KASIKAYTTO (2.10.2026). Hitaalla laitteella tai yhteydella video ei
     lahde itsestaan, vaan ruudulla on toistopainike. Painallus on
     kayttajan oma valinta ja ohittaa tunnistuksen talle videolle. */
  const [kasin, setKasin] = useState(false);
  const pyydetty = useRef(false);

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    let raf = 0;
    let porras = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const d = v.duration;
      if (!(d > 0)) return;
      const q = Math.min(v.currentTime / d, 1);
      const bar = prg.current;
      if (bar) bar.style.transform = `scaleX(${q.toFixed(4)})`;
      const n = Math.min(Math.floor(q * STEPS.length), STEPS.length);
      if (n !== porras) {
        porras = n;
        setP(q);
      }
    };

    /* PEITTO. Hero on pinnattu, ja cover nousee sen PAALLE. Pelkka
       IntersectionObserver videon omalla laatikolla ei huomaa peittoa,
       joten videot pyorivat koko sivun ajan coverin alla. MITATTU
       1440x900: kolme pyorivaa piilovideota lukitsi koko sivun
       vierityksen 30 fps:iin (ilman niita 64..119 fps). Peitto luetaan
       coverista: kun sen ylareuna on noussut nakyman ylimpaan
       neljannekseen, puhelimet ovat sen alla. */
    let nakyy = false;
    let peitossa = false;
    const cover = v.closest(".stickysub")?.querySelector<HTMLElement>(":scope > .cover") ?? null;
    const html = document.documentElement;
    /* LATAUSRUUTU, ks. Latausruutu.tsx. Ruudun aikana video ei pyori
       vaan latautuu valmiiksi, ja lahtee kayntiin kun ruutu avautuu.
       Sivupuhelimet lahtevat puoli sekuntia keskimmaisen jalkeen, jotta
       kolme purkua ei ala samalla hetkella kuin ruudun haivytys. */
    const lukittu = () => html.dataset.lataus === "1";
    let odottaaVuoroa = toissijainen && lukittu();
    let vuoro = 0;
    /* Sivupuhelin: hidas laite tai hidas verkko. Keskimmainen: vain kun
       selain itse ilmoittaa hitaan yhteyden tai datansaaston. Yksi video
       ei kuormita laitetta, ja kesken toiston pysahtyva paavideo
       nayttaisi vialta. */
    const kasikaytto = () =>
      !pyydetty.current && (toissijainen ? onKevyt() || onSaasto() : onSaastoTiukka());
    if (lukittu() && !kasikaytto()) v.preload = "auto";
    const paivita = () => {
      const k = kasikaytto();
      setKasin(k);
      if (nakyy && !peitossa && !document.hidden && !k && !lukittu() && !odottaaVuoroa) {
        void v.play().then(
          () => setPlaying(true),
          () => setPlaying(false),
        );
        if (!raf) raf = requestAnimationFrame(tick);
      } else {
        v.pause();
        setPlaying(false);
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    // Toisto vasta kun mockup on nakyvissa. Hero on sivun alussa, joten
    // tama laukeaa kaytannossa heti - mutta jos kayttaja saapuu
    // ankkurilinkilla keskelle sivua, video ei ala pyoria nakymattomissa.
    const io = new IntersectionObserver(
      (es) => {
        nakyy = es.some((e) => e.isIntersecting);
        paivita();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    const ioPeitto = cover
      ? new IntersectionObserver(
          (es) => {
            peitossa = es.some((e) => e.isIntersecting);
            paivita();
          },
          { rootMargin: "0px 0px -75% 0px" },
        )
      : null;
    if (cover && ioPeitto) ioPeitto.observe(cover);
    document.addEventListener("visibilitychange", paivita);
    window.addEventListener("ws-kevyt", paivita);
    window.addEventListener("ws-saasto", paivita);
    v.addEventListener("ws-toista", paivita);
    const auki = () => {
      if (odottaaVuoroa) {
        vuoro = window.setTimeout(() => {
          odottaaVuoroa = false;
          paivita();
        }, 500);
      }
      paivita();
    };
    window.addEventListener("ws-lataus-auki", auki);
    /* VERKON MITTAUS selaimille jotka eivat kerro yhteydesta. Jos
       keskimmainen video on yha latautumassa neljan sekunnin kuluttua,
       yhteys on hidas: sivupuhelimet jaavat pysakuvaksi. */
    let hidas = 0;
    if (!toissijainen && !onSaasto()) {
      hidas = window.setTimeout(() => {
        if (v.readyState < 3 && v.networkState === v.NETWORK_LOADING) kytkeSaasto();
      }, 4000);
    }
    return () => {
      window.clearTimeout(vuoro);
      window.clearTimeout(hidas);
      window.removeEventListener("ws-lataus-auki", auki);
      window.removeEventListener("ws-saasto", paivita);
      v.removeEventListener("ws-toista", paivita);
      window.removeEventListener("ws-kevyt", paivita);
      io.disconnect();
      ioPeitto?.disconnect();
      document.removeEventListener("visibilitychange", paivita);
      cancelAnimationFrame(raf);
    };
  }, []);

  const toista = () => {
    pyydetty.current = true;
    vid.current?.dispatchEvent(new Event("ws-toista"));
  };

  const g = grown(p);
  const at = ([a, b]: [number, number]) => fmt(a + (b - a) * g);
  const tt = variant === "tiktok";

  return (
    <div className={`phone ${className}`} data-depth={depth}>
      {/* SIVUNAPIT. Piirretaan .scr:n ULKOPUOLELLE, koska ne ovat
          laitteen kyljessa eivatka ruudulla. Oletuksena CSS piilottaa
          ne: ne lukevat vain silloin kun laite on kaannetty niin etta
          kylki nakyy, ja suoraan edesta katsottuna ne olisivat vain
          kaksi tikkua rungon reunassa. */}
      <i className="ph-napit" aria-hidden="true">
        <b />
        <s />
      </i>
      <div className="scr">
        <video
          ref={vid}
          className="ph-vid"
          width={540}
          height={960}
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
        <canvas
          ref={kangas}
          className="ph-vid ph-kangas"
          width={540}
          height={960}
          aria-hidden="true"
          style={{
            backgroundImage: `url(${poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* TOISTOPAINIKE. Nakyy vain kasikaytossa (hidas laite tai
            verkko) ja kun video ei pyori. Sama merkki jonka Reels ja
            TikTok nayttavat pysaytetyn videon paalla. */}
        {kasin && !playing && (
          <button type="button" className="ph-play" aria-label="Toista video" onClick={toista}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.2v13.6L19 12z" />
            </svg>
          </button>
        )}

        {/* Tummennus ylos ja alas: IG:n oma kaytanto, ja se on tassa myos
            luettavuuden ehto - teksti on suoraan videokuvan paalla. */}
        <div className="ig-scrim" />

        <div className={`ig${tt ? " is-tt" : ""}`}>
          {tt ? (
            /* TikTokin ylapalkki on valilehtipari, ei otsikko. Aktiivinen
               on alleviivattu ja passiivinen himmea - sama merkintatapa
               kuin sovelluksessa. */
            <div className="ig-top ig-tabs">
              <span>Seuraa</span>
              <span className="on">Sinulle</span>
            </div>
          ) : (
            <div className="ig-top">
              <b>Reels</b>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 8h4l1.5-2h5L16 8h4v11H4z" />
                <circle cx="12" cy="13.5" r="3.2" />
              </svg>
            </div>
          )}

          <div className="ig-side">
            {tt && (
              /* TikTokissa profiilikuva on oikean palkin ylin elementti ja
                 siina on oma seuraa-painike. Reelsissa se on alhaalla
                 tunnuksen vieressa, joten sita ei piirreta kahdesti. */
              <span
                className="tt-ava"
                aria-hidden="true"
                style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
              >
                <i />
              </span>
            )}
            <button type="button" className={`ig-act ig-like${playing ? " is-live" : ""}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 20.6 4.3 13a4.8 4.8 0 1 1 7.7-5.6A4.8 4.8 0 1 1 19.7 13z" />
              </svg>
              <small>{at(likes)}</small>
            </button>
            <button type="button" className="ig-act">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3.6c-4.8 0-8.6 3.3-8.6 7.4 0 2.3 1.2 4.4 3.1 5.7l-.8 3.7 3.9-2.1c.8.2 1.6.3 2.4.3 4.8 0 8.6-3.3 8.6-7.6S16.8 3.6 12 3.6z" />
              </svg>
              <small>{at(comments)}</small>
            </button>
            <button type="button" className="ig-act">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.5 3.2 2.8 10.1l6.6 2.4 2.4 6.6z" />
              </svg>
              <small>{at(shares)}</small>
            </button>
            <button type="button" className="ig-act">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.5 3.5h11v17l-5.5-4-5.5 4z" />
              </svg>
              {tt && <small>{at(saves ?? shares)}</small>}
            </button>
            <span className="ig-disc" aria-hidden="true" />
          </div>

          <div className="ig-bottom">
            {tt ? (
              /* TikTokissa alhaalla on pelkka @tunnus ilman avataria ja
                 ilman seuraa-pilleria: molemmat ovat oikeassa palkissa. */
              <div className="ig-user">
                <b>@{handle}</b>
              </div>
            ) : (
              <div className="ig-user">
                <span
                  className="ig-ava"
                  aria-hidden="true"
                  style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
                />
                <b>{handle}</b>
                <span className="ig-follow">Seuraa</span>
              </div>
            )}
            <p className="ig-cap">{caption}</p>
            <div className="ig-music">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 18V6l10-2v12" />
                <circle cx="6.5" cy="18" r="2.5" />
                <circle cx="16.5" cy="16" r="2.5" />
              </svg>
              <span>
                <i>{music}</i>
              </span>
            </div>
          </div>

          {/* Etenemapalkki on VIDEON oma aika, ei CSS-animaatio: palkki ja
              kuva eivat voi ajautua eri tahtiin. */}
          <div className="ig-prg">
            <i ref={prg} style={{ transform: `scaleX(${p.toFixed(4)})` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
