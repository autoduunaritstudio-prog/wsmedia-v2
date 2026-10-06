"use client";

import { useState } from "react";

import TulosVideo from "./TulosVideo";
import { InstagramUI } from "./SomeKayttoliittyma";

/**
 * TULOKSET NAYTTAMONA (5.10.2026).
 *
 * Kolmen samanlaisen kortin sijaan yksi lava: vasemmalla asiakkaat
 * valilehtina (logo ja paaluku), oikealla valitun asiakkaan tyo isona
 * ja tarina lyhyesti: mita tehtiin ja mika muuttui (ennen -> nyt).
 * Rakenne case-tarinoiden mallista: yksi paamittari, tilanne ennen,
 * tehty tyo ja tulos todennettavina lukuina.
 *
 * Vain valittu video toistuu, joten lava on kevyempi kuin kolme
 * rinnakkaista videota.
 */
export type Sivu = { nimi: string; d: string; m: string };
export type Linkki = { tyyppi: "ig" | "tt" | "web"; url: string };
export type Rivi = { l: string; ennen?: string; nyt: string };
export type Tulos = {
  id: string;
  nimi: string;
  ala: string;
  palvelu: string;
  luku: string;
  selite: string;
  logo: { src: string; w: number; h: number; monogrammi?: boolean };
  tausta: string;
  video?: { src: string; poster: string; kahva: string };
  sivut?: Sivu[];
  teimme: string;
  linkit?: Linkki[];
  rivit: Rivi[];
};

/* Kanavien kuvakkeet valmistajien varein: Instagramin liukuvari,
   TikTokin musta pohja ja turkoosi-punainen kaksoisvarjo. */
const TT_POLKU =
  "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";

const LINKKI = {
  ig: {
    nimi: "Instagram",
    ikoni: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="tn-ikoni">
        <defs>
          <radialGradient id="tn-ig-vari" cx="30%" cy="107%" r="150%">
            <stop offset="0" stopColor="#fdf497" />
            <stop offset=".05" stopColor="#fdf497" />
            <stop offset=".45" stopColor="#fd5949" />
            <stop offset=".6" stopColor="#d6249f" />
            <stop offset=".9" stopColor="#285AEB" />
          </radialGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#tn-ig-vari)" />
        <g fill="none" stroke="#fff" strokeWidth="1.9">
          <rect x="5" y="5" width="14" height="14" rx="4.2" />
          <circle cx="12" cy="12" r="3.4" />
        </g>
        <circle cx="16.3" cy="7.7" r="1.05" fill="#fff" />
      </svg>
    ),
  },
  tt: {
    nimi: "TikTok",
    ikoni: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="tn-ikoni">
        <rect width="24" height="24" rx="6" fill="#000" />
        <g transform="translate(5.2 4.6) scale(.58)">
          <path d={TT_POLKU} fill="#25F4EE" transform="translate(-1.1 -1)" />
          <path d={TT_POLKU} fill="#FE2C55" transform="translate(1.1 1)" />
          <path d={TT_POLKU} fill="#fff" />
        </g>
      </svg>
    ),
  },
  web: {
    nimi: "Avaa sivusto",
    ikoni: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="tn-ikoni tn-ikoni-viiva">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17 M12 3.5c2.4 2.4 3.4 5.2 3.4 8.5s-1 6.1-3.4 8.5c-2.4-2.4-3.4-5.2-3.4-8.5s1-6.1 3.4-8.5z" />
      </svg>
    ),
  },
} as const;

export default function TulosNayttamo({ tulokset }: { tulokset: Tulos[] }) {
  const [valittu, setValittu] = useState(0);
  const t = tulokset[valittu];

  return (
    <div className="tn">
      <div className="tn-lista" role="tablist" aria-label="Asiakkaat">
        {tulokset.map((x, i) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            id={`tn-tab-${x.id}`}
            aria-selected={i === valittu}
            aria-controls="tn-lava"
            className={i === valittu ? "tn-tab on" : "tn-tab"}
            onClick={() => setValittu(i)}
          >
            <span className="tn-tab-yla">
              {/* lazy (6.10.2026): valilehdet ovat syvalla ruudun alla, ja
                  puhelimessa tama puu on piilossa, jolloin eager-kuva (280 kt
                  PNG:ta) haettaisiin turhaan ennen puhelinversion LCP:ta. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={x.logo.src} alt="" width={x.logo.w} height={x.logo.h} className={x.logo.monogrammi ? "mono" : ""} loading="lazy" decoding="async" />
              {x.logo.monogrammi ? <b>{x.nimi}</b> : <span className="vh">{x.nimi}</span>}
              <span className="tn-tab-palvelu">{x.palvelu}</span>
            </span>
            <span className="tn-tab-luku">{x.luku}</span>
            <span className="tn-tab-selite">{x.selite}</span>
          </button>
        ))}
      </div>

      <div
        className={t.sivut ? "tn-lava tn-lava-sivu" : "tn-lava"}
        id="tn-lava"
        role="tabpanel"
        aria-labelledby={`tn-tab-${t.id}`}
        style={{ "--tausta": `url(${t.tausta})` } as React.CSSProperties}
        key={t.id}
      >
        <div className="tn-media">
          {t.video ? (
            <div className="tn-puhelin">
              <TulosVideo src={t.video.src} poster={t.video.poster} kuvaus={`${t.nimi}: lyhytvideo`} />
              <span className="tn-saari" aria-hidden="true" />
              <InstagramUI kahva={t.video.kahva} />
            </div>
          ) : t.sivut ? (
            <SivuNakyma nimi={t.nimi} sivut={t.sivut} />
          ) : null}
        </div>
        <div className="tn-tarina">
          <p className="tn-kick">
            {t.nimi} · {t.ala}
          </p>
          <h3>Mitä teimme</h3>
          <p className="tn-teimme">{t.teimme}</p>
          <ul className="tn-rivit">
            {t.rivit.map((r) => (
              <li key={r.l}>
                <span className="tn-rivi-l">{r.l}</span>
                <span className="tn-rivi-arvo">
                  {r.ennen ? (
                    <>
                      <s>{r.ennen}</s>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 12h13 M13 6l6 6-6 6" />
                      </svg>
                    </>
                  ) : null}
                  <b>{r.nyt}</b>
                </span>
              </li>
            ))}
          </ul>
          {t.linkit?.length ? (
            <div className="tn-linkit">
              {t.linkit.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.nimi}: ${LINKKI[l.tyyppi].nimi} (avautuu uuteen välilehteen)`}>
                  {LINKKI[l.tyyppi].ikoni}
                  {LINKKI[l.tyyppi].nimi}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* Verkkosivucase: selain ja puhelin paallekkain, alla sivut valittavina.
   Ei automaattista vaihtoa: kuva vaihtuu vain kun kayttaja valitsee. */
function SivuNakyma({ nimi, sivut }: { nimi: string; sivut: Sivu[] }) {
  const [i, setI] = useState(0);
  const s = sivut[i];
  return (
    <div className="tn-sivut">
      <div className="tn-laitteet" key={s.nimi}>
        <div className="tn-selain">
          <div className="tn-selain-palkki" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.d} alt={`${nimi}, ${s.nimi.toLowerCase()} tietokoneella`} width={720} height={450} decoding="async" />
        </div>
        <div className="tn-puhelin tn-puhelin-pieni">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.m} alt={`${nimi}, ${s.nimi.toLowerCase()} puhelimella`} width={260} height={563} decoding="async" />
        </div>
      </div>
      <div className="tn-sivuvalinta" role="group" aria-label="Sivuston näkymät">
        {sivut.map((x, j) => (
          <button key={x.nimi} type="button" aria-pressed={j === i} className={j === i ? "on" : ""} onClick={() => setI(j)}>
            {x.nimi}
          </button>
        ))}
      </div>
    </div>
  );
}
