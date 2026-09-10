"use client";

import { useEffect, useRef, useState } from "react";

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
}: Props) {
  const vid = useRef<HTMLVideoElement>(null);
  const [p, setP] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = vid.current;
    if (!v) return;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const d = v.duration;
      if (d > 0) setP(Math.min(v.currentTime / d, 1));
    };
    // Toisto vasta kun mockup on nakyvissa. Hero on sivun alussa, joten
    // tama laukeaa kaytannossa heti - mutta jos kayttaja saapuu
    // ankkurilinkilla keskelle sivua, video ei ala pyoria nakymattomissa.
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (e.isIntersecting) {
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
        }
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const g = grown(p);
  const at = ([a, b]: [number, number]) => fmt(a + (b - a) * g);
  const tt = variant === "tiktok";

  return (
    <div className={`phone ${className}`} data-depth={depth}>
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
            <i style={{ transform: `scaleX(${p.toFixed(4)})` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
