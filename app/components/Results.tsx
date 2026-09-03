import Image from "next/image";
import type { CSSProperties } from "react";

import { LogoMark } from "./Logo";

/**
 * SPARKLINE VAIN SIELLA MISSA ON AIKASARJA.
 *
 * Nouseva kayra esittaa kasvua ajassa. PageSpeed-pistemaara ja
 * kavijamaara ovat yksittaisia mittauksia, eivat aikasarjoja, joten kayra
 * esittaisi niiden kohdalla dataa jota ei ole. Sparkline jaa siksi vain
 * Colormasterille, jonka luku on aito kasvu neljan kuukauden yli.
 *
 * points puuttuu -> kayraa ei renderoida lainkaan.
 */
/**
 * LOGON KORKEUS 30 px on johdettu kuvasuhteista, ei valittu silmalla.
 * Levein merkki on Colormaster 798x340 (2,347), joka 30 px:n korkeudella
 * on 70 px levea = 21 % kortin 333 px leveydesta. Kapein on
 * LS-monogrammi 2054x2052 (1,001), joka on silla korkeudella 30x30.
 * Suhde levein/kapein on siis 2,3 - riittavan lahella toisiaan etta
 * kolmikko lukeutuu yhtenaisena rivina. Korkeus on kiintea ja leveys
 * auto, joten eri kuvasuhteet eivat voi rikkoa ruudukon tasakorkeutta.
 *
 * WS Median oma merkki tulee LogoMark-komponenttina eika tiedostona:
 * se on currentColor-taytteinen inline-SVG, joten se skaalautuu
 * tarkkana ja perii varin CSS:sta.
 */
const LOGO_H = 30;

const CASES = [
  {
    logo: { src: "/logos/colormaster.png", w: 70, alt: "Colormaster" },
    count: "1 500",
    title: "Colormaster · automaalamo",
    text: "seuraajaa neljässä kuukaudessa, ilman maksettua mainontaa",
    points:
      "0,52 22,46 44,49 66,34 88,38 110,24 132,29 154,16 176,20 198,9 220,12",
    par: "0.015",
    fill: "Lyhytvideot",
    proof: "spark" as const,
  },
  {
    logo: { src: "/logos/ls-monogram-color.png", w: 30, alt: "Laaksolahden Sähkö" },
    count: "100 / 98",
    title: "Laaksolahden Sähkö · sähkötyöt ja ilmalämpöpumput",
    text: "PageSpeed työpöydällä ja mobiilissa, mitattu 9/2026",
    par: "0.035",
    fill: "Verkkosivut",
    proof: "rings" as const,
  },
  {
    logo: null, // Garage Fest on oma tapahtumamme -> WS Median merkki
    count: "1 000",
    title: "Garage Fest · autoviikonloppu Espoossa",
    text: "kävijää tapahtumaan, jonka järjestimme itse",
    par: "0.015",
    fill: "Tapahtumat",
    proof: "shot" as const,
  },
];

/** Sparkline-täytön alue: viivan pisteet plus sulkeva pohja. */
const areaPoints = (points: string) => `${points} 220,60 0,60`;

/**
 * Pistemäärärengas. Kehä lasketaan sateesta (2πr), ei silmamääräisesti,
 * joten dasharray on tasan oikea osuus: 100 % = koko kehä, 98 % = 98/100.
 *
 * EI JÄLJITTELE PageSpeed Insightsia. Sivuston oma sininen ja --ink, ei
 * Lighthousen vihreää eikä sen kehysgrafiikkaa: luku on meidän
 * raportoimamme mittaustulos, ei kuvaruutukaappauksen näköinen kopio
 * Googlen widgetistä.
 */
const R = 20;
const C = 2 * Math.PI * R;

function ScoreRing({ score, label }: { score: number; label: string }) {
  return (
    <div className="ring">
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle className="ring-track" cx="24" cy="24" r={R} />
        <circle
          className="ring-arc"
          cx="24"
          cy="24"
          r={R}
          strokeDasharray={`${((C * score) / 100).toFixed(3)} ${((C * (100 - score)) / 100).toFixed(3)}`}
        />
        <text className="ring-num" x="24" y="24" dominantBaseline="central" textAnchor="middle">
          {score}
        </text>
      </svg>
      <span>{label}</span>
    </div>
  );
}

export default function Results() {
  return (
    <section id="tulokset" style={{ paddingTop: "110px" }}>
      <div className="wrap">
        <div className="shead right rv" data-par="0.03">
          <span className="kick">Referenssit</span>
          <h2>Tulokset, joilla on väliä.</h2>
          <p className="sub">Kolme asiakasta, kolme mitattua tulosta.</p>
        </div>

        {/* Gradientti määritellään kerran, kaikki sparklinet viittaavat siihen. */}
        <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
          <defs>
            <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0064cc" stopOpacity=".18" />
              <stop offset="100%" stopColor="#0064cc" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="cases stagger">
          {CASES.map((c, i) => (
            <div
              className="card case rv tilt"
              style={{ "--i": i } as CSSProperties}
              data-par={c.par}
              /* Reunimmaiset kortit kaantyvat toisiaan kohti, keskimmainen
                 jaa suoraan. Etumerkki on sama konventio kuin .cal ja
                 .event kayttavat: rotateY + tuo VASEMMAN reunan katsojaa
                 kohti, - oikean. Vasen kortti saa siis "y" ja oikea "-y",
                 jolloin ne peilaavat toisensa keskikortin ympari. */
              data-tilt={i === 0 ? "y" : i === 2 ? "-y" : undefined}
              data-tilt-profile={i === 1 ? undefined : "card"}
              key={c.title}
            >
              <div className="case-logo">
                {c.logo ? (
                  <Image src={c.logo.src} alt={c.logo.alt} width={c.logo.w} height={LOGO_H} />
                ) : (
                  <LogoMark className="case-logo-mark" />
                )}
              </div>
              <div className="num" data-count={c.count}>
                {c.count}
              </div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              {/* TODISTEVYOHYKE. Kiintea korkeus kaikilla kolmella, jotta
                  ruudukon tasakorkeus ei tuota tyhjaa yhteenkaan korttiin:
                  aiemmin vain kortti 1 kantoi sparklinen, ja ero oli
                  mitattuna 34,5 px. */}
              <div className="case-proof">
                {c.proof === "spark" ? (
                  <svg className="spark" viewBox="0 0 220 60" preserveAspectRatio="none">
                    <polygon className="fillp" points={areaPoints(c.points!)} />
                    <polyline points={c.points!} />
                  </svg>
                ) : c.proof === "rings" ? (
                  <div className="rings">
                    <ScoreRing score={100} label="Työpöytä" />
                    <ScoreRing score={98} label="Mobiili" />
                  </div>
                ) : (
                  /* Aito kuva tapahtumasta, ei abstraktia visualisointia:
                     esim. 100 pistetta x 10 lukeutuisi luvuksi 100, mika
                     olisi harhaanjohtavaa kortin luvun 1 000 rinnalla. */
                  <Image
                    className="case-shot"
                    src="/tapahtumat/aftermovie.webp"
                    alt="Garage Fest -tapahtuman aftermoviesta poimittu ruutu"
                    width={274}
                    height={72}
                  />
                )}
              </div>
              {/* Pilleri on tekstia eika linkkia: etusivulla ei ole
                  palvelukohtaisia ankkureita (#palvelut kattaa kaikki nelja
                  paneelia), eika Tapahtumille ole omaa sivua lainkaan. */}
              <span className="fill">{c.fill}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
