"use client";

import { useEffect, useRef, useState } from "react";

import DemoVideo from "./DemoVideo";

/**
 * Heron selainnayttamo: sivusto rakentuu skeleton-riveina, PageSpeed-mittari
 * laskee ylos ja hakutuloskortti nousee sijalle 1.
 *
 * Molemmat animaatiot kaynnistyvat IntersectionObserverilla samaan tapaan kuin
 * sivuston muut numerolaskurit (SiteEffectsin [data-count]-spinnerit), eivat
 * kiintealla latausviiveella. Kaytannossa nayttamo on heti nakyvissa, mutta
 * IO pitaa kaynnistyksen samalla kaavalla ja estaa animaation ajamisen turhaan
 * jos komponentti joskus siirtyy alemmas sivulla.
 *
 * prefers-reduced-motion: molemmat hyppaavat suoraan lopputilaan.
 */

const SCORE_TARGET = 100;
const SCORE_DURATION = 1400;
const SCORE_DELAY = 1900;
const SERP_DELAY = 2000;

export default function HeroBrowserStage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [ranked, setRanked] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setScore(SCORE_TARGET);
      setRanked(true);
      return;
    }

    let raf = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        timers.push(
          setTimeout(() => {
            let t0: number | null = null;
            const tick = (ts: number) => {
              if (t0 === null) t0 = ts;
              const p = Math.min((ts - t0) / SCORE_DURATION, 1);
              // sama ease-out kuin mockupissa
              const eased = 1 - Math.pow(1 - p, 3);
              setScore(Math.round(eased * SCORE_TARGET));
              if (p < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
          }, SCORE_DELAY),
        );

        timers.push(setTimeout(() => setRanked(true), SERP_DELAY));
      },
      { threshold: 0.25 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, []);

  // Hakutuloskortti: rivit nousevat, meidan rivi paatyy sijalle 1.
  const rank = (fallback: string, after: string) => (ranked ? after : fallback);

  return (
    <div
      className="bstage li d5"
      data-par="-0.03"
      aria-label="Havainnekuva WS Median toteuttamasta verkkosivustosta"
    >
      <div className="bwrap" id="bwrap" ref={wrapRef}>
        <div className="chip-f cf1">
          <em>✓</em>
          <span>
            Toimitus<small>2–4 viikkoa</small>
          </span>
        </div>
        <div className="chip-f cf2">
          <em>⚡</em>
          <span>
            Latausaika<small>alle 1,5 s mobiilissa</small>
          </span>
        </div>

        <div className="bwin">
          <div className="bbar">
            <span className="bdot" />
            <span className="bdot" />
            <span className="bdot" />
            <span className="burl">
              <em>🔒</em>asiakkaasi.fi
            </span>
          </div>
          <div className="bpage">
            <div
              className="bscore"
              id="bscore"
              title="PageSpeed-pisteet"
              style={{ "--p": score } as React.CSSProperties}
            >
              <i>
                <span id="bscoreN">{score}</span>
                <small>PAGESPEED</small>
              </i>
            </div>
            {/* OIKEA TOTEUTETTU SIVUSTO, EI SKELETON-RIVEJA.
                Skeleton oli abstrakti kuva sivustosta: harmaita palkkeja
                jotka esittavat sisaltoa jota ei ole. Se kertoo lukijalle
                mita sivu tekee, mutta ei todista etta olemme tehneet
                yhtaan. Sama video pyorii etusivun Palvelut-osiossa, joten
                alasivu nayttaa saman tyon samalla tavalla.

                Toisto on sidottu nakyvyyteen ja preload odottaa
                nakyvyytta, joten hero ei maksa videon latausta ennen kuin
                se on ruudulla. prefers-reduced-motion jattaa
                poster-kuvan. Ks. DemoVideo. */}
            <DemoVideo
              className="bvid"
              webm="/laaksolahti-demo.webm"
              mp4="/laaksolahti-demo.mp4"
              poster="/laaksolahti-poster.jpg"
              preload="metadata"
              label="Laaksolahden Sähkön verkkosivusto, WS Median toteuttama"
            />
          </div>
        </div>

        <div className="bphone" aria-hidden="true">
          <div className="pscr">
            <div className="pk" />
            <div className="ph" />
            <div className="ph s" />
            <div className="pb" />
            <div className="pc" />
            <div className="pc" />
            <div className="pc" />
          </div>
        </div>

        <div className="serp rv" aria-hidden="true">
          <div className="st">
            <span>Google · palvelu + paikkakunta</span>
            <b>#1</b>
          </div>
          <div className="serplist">
            <div className="serprow r1 up1">
              <i>{rank("1", "2")}</i>
              <u>
                <s />
                <s />
              </u>
            </div>
            <div className="serprow r2 up2">
              <i>{rank("2", "3")}</i>
              <u>
                <s />
                <s />
              </u>
            </div>
            <div className="serprow r3 us">
              <i>{rank("3", "1")}</i>
              <u>
                <s />
                <s />
              </u>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
