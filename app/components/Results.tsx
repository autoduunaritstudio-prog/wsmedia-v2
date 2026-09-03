import fs from "node:fs";
import path from "node:path";

import Image from "next/image";
import type { CSSProperties } from "react";

import { LogoMark } from "./Logo";
import SocialIcon from "./SocialIcon";
import type { SocialLink } from "./site-data";

/**
 * KUVAT TULEVAT VAKIOISTA, EIVAT KOODIIN KOVAKOODATTUINA POLKUINA.
 *
 * Yhdellekaan kolmesta kortista ei ole repossa kayttokelpoista
 * vaakakuvaa (ks. commit-viesti ja raportti): referenssiposterit ovat
 * 608x1080 pystykuvaa ja aftermovie on kolmen ruudun kollaasi, jonka
 * saumat ovat 31,4 % ja 63,8 % kohdalla joka ainoassa ruudussa.
 * Kumpaakaan ei voi rajata vaakakaistaleeksi ilman etta lopputulosta
 * pitaisi katsoa silmalla - ja sita ei tassa tyotavassa tehda.
 *
 * Siksi polut ovat vakioita ja komponentti tarkistaa KAANNOSAIKANA
 * (palvelinkomponentti) onko tiedosto olemassa. Jos ei ole, kuvapaikka
 * renderoituu neutraalina taytteena: ei rikkinaista kuvaikonia eika
 * layout-hyppya, koska aspect-ratio varaa tilan joka tapauksessa.
 *
 * TUOTA KUVAT NAIHIN POLKUIHIN, vahintaan 668x376 px (kortti 333,33 CSS
 * px leveana dpr 2:lla), 16:9, WebP:
 */
const SHOTS = {
  colormaster: "/referenssit/colormaster.webp",
  laaksolahti: "/referenssit/laaksolahdensahko.webp",
  garagefest: "/tapahtumat/garage-fest.webp",
} as const;

/**
 * Kuvapaikan mitat. Kuvakaista on aina 16:9 (.case-shot aspect-ratio),
 * mutta next/image saa TODELLISET intrinsic-mitat, ei rajattuja: rajaus
 * tehdaan CSS:ssa object-fit: coverilla. Aspect-ratio varaa tilan ennen
 * latausta -> CLS 0 riippumatta lahteen suhteesta.
 */
const SHOT_FALLBACK = { w: 668, h: 376 };

/** Alustakohtainen luku. Ikoni tulee SocialIconista, ei uutta piirrosta. */
type Plat = { icon: SocialLink["icon"]; label: string; n: string };

const hasShot = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src));

const CASES = [
  {
    shot: SHOTS.colormaster,
    shotW: 608,
    shotH: 1080,
    logo: { src: "/logos/colormaster.png", w: 70, alt: "Colormaster" },
    count: "1,6 milj.",
    title: "Colormaster · automaalamo",
    text: "Katselukertaa Instagramissa ja TikTokissa yhteensä, neljässä kuukaudessa ilman maksettua mainontaa.",
    plat: [
      { icon: "instagram", label: "Instagram", n: "1 500" },
      { icon: "tiktok", label: "TikTok", n: "3 000" },
    ] as Plat[],
    par: "0.015",
    fill: "Lyhytvideot",
  },
  {
    shot: SHOTS.laaksolahti,
    shotW: SHOT_FALLBACK.w,
    shotH: SHOT_FALLBACK.h,
    logo: { src: "/logos/ls-monogram-color.png", w: 30, alt: "Laaksolahden Sähkö" },
    count: "100 / 98",
    title: "Laaksolahden Sähkö · sähkötyöt ja ilmalämpöpumput",
    text: "PageSpeed työpöydällä ja mobiilissa, mitattu 9/2026",
    plat: null,
    par: "0.035",
    fill: "Verkkosivut",
  },
  {
    shot: SHOTS.garagefest,
    shotW: SHOT_FALLBACK.w,
    shotH: SHOT_FALLBACK.h,
    logo: null, // Garage Fest on oma tapahtumamme -> WS Median merkki
    count: "1 000",
    title: "Garage Fest · autoviikonloppu Espoossa",
    text: "kävijää tapahtumaan, jonka järjestimme itse",
    plat: null,
    par: "0.015",
    fill: "Tapahtumat",
  },
];

/** Logon korkeus. Ks. LOGO_H-perustelu .case-logo-saannossa. */
const LOGO_H = 26;

export default function Results() {
  return (
    <section id="tulokset" style={{ paddingTop: "110px" }}>
      <div className="wrap">
        <div className="shead right rv" data-par="0.03">
          <span className="kick">Referenssit</span>
          <h2>Tulokset, joilla on väliä.</h2>
          <p className="sub">Kolme asiakasta, kolme mitattua tulosta.</p>
        </div>

        <div className="cases stagger">
          {CASES.map((c, i) => (
            <div
              className="card case rv tilt"
              style={{ "--i": i } as CSSProperties}
              data-par={c.par}
              /* Reunimmaiset kortit kaantyvat toisiaan kohti, keskimmainen
                 jaa suoraan. Etumerkki on sama konventio kuin .cal ja
                 .event kayttavat: rotateY + tuo VASEMMAN reunan katsojaa
                 kohti, - oikean. */
              data-tilt={i === 0 ? "y" : i === 2 ? "-y" : undefined}
              data-tilt-profile={i === 1 ? undefined : "card"}
              key={c.title}
            >
              {/* overflow: hidden on VAIN tassa laatikossa, ei kortissa:
                  kortin varjo ei saa leikkautua. */}
              <div className="case-shot">
                {hasShot(c.shot) ? (
                  <Image src={c.shot} alt={`${c.title} – kuva työstä`} width={c.shotW} height={c.shotH} />
                ) : null}
              </div>
              <div className="case-body">
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
                {/* Alustarivi: ikoni + luku samalla perusviivalla, ei laatikoita.
                    Ikonit ovat aria-hidden, joten alustan nimi tulee .vh:na
                    ruudunlukijalle. "seuraajaa" jakautuu molempiin luonnostaan. */}
                {c.plat ? (
                  <div className="case-plat">
                    {c.plat.map((pl, j) => (
                      <span className="plat" key={pl.icon}>
                        {j > 0 ? (
                          <span className="plat-sep" aria-hidden="true">
                            ·
                          </span>
                        ) : null}
                        <SocialIcon name={pl.icon} />
                        <span className="vh">{pl.label} </span>
                        <b>{pl.n}</b>
                      </span>
                    ))}{" "}
                    seuraajaa
                  </div>
                ) : null}
                {/* Pilleri on tekstia eika linkkia: etusivulla ei ole
                    palvelukohtaisia ankkureita eika Tapahtumille omaa
                    sivua. */}
                <span className="fill">{c.fill}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
