import fs from "node:fs";
import path from "node:path";

import Image from "next/image";
import type { CSSProperties } from "react";

import { LogoMark } from "./Logo";

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
  colormaster: "/referenssit/colormaster-shot.webp",
  laaksolahti: "/referenssit/laaksolahdensahko.webp",
  garagefest: "/tapahtumat/garage-fest.webp",
} as const;

/** Kuvan koko kortissa. 16:9 valittu, ks. raportti. */
const SHOT_W = 668;
const SHOT_H = 376;

const hasShot = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src));

const CASES = [
  {
    shot: SHOTS.colormaster,
    logo: { src: "/logos/colormaster.png", w: 70, alt: "Colormaster" },
    count: "1 500",
    title: "Colormaster · automaalamo",
    text: "seuraajaa neljässä kuukaudessa, ilman maksettua mainontaa",
    par: "0.015",
    fill: "Lyhytvideot",
  },
  {
    shot: SHOTS.laaksolahti,
    logo: { src: "/logos/ls-monogram-color.png", w: 30, alt: "Laaksolahden Sähkö" },
    count: "100 / 98",
    title: "Laaksolahden Sähkö · sähkötyöt ja ilmalämpöpumput",
    text: "PageSpeed työpöydällä ja mobiilissa, mitattu 9/2026",
    par: "0.035",
    fill: "Verkkosivut",
  },
  {
    shot: SHOTS.garagefest,
    logo: null, // Garage Fest on oma tapahtumamme -> WS Median merkki
    count: "1 000",
    title: "Garage Fest · autoviikonloppu Espoossa",
    text: "kävijää tapahtumaan, jonka järjestimme itse",
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
                  <Image src={c.shot} alt={`${c.title} – kuva työstä`} width={SHOT_W} height={SHOT_H} />
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
