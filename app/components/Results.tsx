import fs from "node:fs";
import path from "node:path";

import Image from "next/image";
import type { CSSProperties } from "react";

import SocialIcon from "./SocialIcon";

/**
 * KORTIN METALLIPINTA.
 *
 * LUOKKANIMET OVAT TARKOITUKSELLA OMAT (cmb-*), EIVAT metalbd-*.
 * SiteEffects hakee kerroksensa naytteenottona koko dokumentista:
 *   querySelectorAll(".metalbd-v2")     -> kirjoittaa --mb-gx/--mb-gy
 *   querySelectorAll(".metalbd-facets") -> kirjoittaa style.transform
 *   querySelectorAll(".mbf-a, .mbf-b")  -> kirjoittaa style.transform
 *   querySelector(".metalbd-a"/"-b"/"-sweep") -> style.transform
 * Jos kortit kayttaisivat naita nimia, ne joutuisivat parallaksin
 * ohjaukseen: kolme korttia saisi joka framessa transformin, ja
 * yksikkokyselyt (.metalbd-a jne.) osuisivat dokumenttijarjestyksessa
 * ENSIMMAISEEN korttiin. Kortit eivat liiku, joten omat nimet pitavat
 * ne JS:n ulottumattomissa ilman yhtaan muutosta SiteEffectsiin.
 *
 * Samasta syysta naissa ei ole will-change: transformia. Osiossa se on
 * parallaksin takia; tassa se olisi kolme turhaa kerrospromootiota.
 */
function CardMetal() {
  return (
    <div className="cmb" aria-hidden="true">
      <div className="cmb-a" />
      <div className="cmb-b" />
      <div className="cmb-sweep" />
      <div className="cmb-gl" />
      <svg className="cmb-facets" viewBox="0 0 1200 1600" preserveAspectRatio="xMidYMid slice">
        <g className="cmbf" fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <circle className="cmbc-1" cx="-200" cy="-500" r="1300" />
          <circle className="cmbc-2" cx="600" cy="2600" r="1750" />
          <circle className="cmbc-3" cx="-500" cy="1400" r="900" />
          <circle className="cmbc-4" cx="1700" cy="-300" r="1350" />
          <circle className="cmbc-5" cx="1900" cy="1500" r="1250" />
        </g>
      </svg>
    </div>
  );
}
import type { SocialLink } from "./site-data";

/**
 * KUVAT TULEVAT VAKIOISTA, EIVAT KOODIIN KOVAKOODATTUINA POLKUINA.
 *
 * Colormasterille on toimitettu valmis, lahteessa 16:9 rajattu kuva.
 * Kahdelle muulle ei viela ole: referenssiposterit ovat 608x1080
 * pystykuvaa ja aftermovie on kolmen ruudun kollaasi, jonka saumat
 * ovat 31,4 % ja 63,8 % kohdalla joka ainoassa ruudussa. Kumpaakaan ei
 * voi rajata vaakakaistaleeksi ilman etta lopputulosta pitaisi katsoa
 * silmalla - ja sita ei tassa tyotavassa tehda.
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
  // HUOM: EI colormaster.webp - se on 608x1080 pystyposteri jota
  // Refs.tsx kayttaa colormaster.mp4:n posterina. Case-kortilla on
  // oma, valmiiksi 16:9 rajattu tiedosto.
  colormaster: "/referenssit/colormaster-case.webp",
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

/**
 * Spec-sarake. KUMMALLAKIN ON OMA yksikkoteksti: aiemmassa versiossa
 * "seuraajaa" oli rivin lopussa yhteisena, jolloin rivin katketessa se
 * jai koskemaan vain jalkimmaista alustaa. Nyt irtoaminen on
 * rakenteellisesti mahdotonta, ei rivityslaskennan varassa.
 */
type Spec = { icon: SocialLink["icon"]; label: string; n: string; unit: string };

const hasShot = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src));

const CASES = [
  {
    shot: SHOTS.colormaster,
    shotAlt: "Colormasterin toimitilat ja opasteet",
    shotW: 1000,
    shotH: 563,
    name: "Colormaster",
    trade: "automaalamo",
    count: "1,6 milj.",
    title: "Colormaster · automaalamo",
    text: "Katselukertaa Instagramissa ja TikTokissa yhteensä, neljässä kuukaudessa ilman maksettua mainontaa.",
    spec: [
      { icon: "instagram", label: "Instagram", n: "1 500", unit: "seuraajaa" },
      { icon: "tiktok", label: "TikTok", n: "3 000", unit: "seuraajaa" },
    ] as Spec[],
    par: "0.015",
    fill: "Lyhytvideot",
  },
  {
    shot: SHOTS.laaksolahti,
    shotAlt: null,
    shotW: SHOT_FALLBACK.w,
    shotH: SHOT_FALLBACK.h,
    name: "Laaksolahden Sähkö",
    trade: "sähkötyöt ja ilmalämpöpumput",
    count: "100 / 98",
    title: "Laaksolahden Sähkö · sähkötyöt ja ilmalämpöpumput",
    text: "PageSpeed työpöydällä ja mobiilissa, mitattu 9/2026",
    spec: null,
    par: "0.035",
    fill: "Verkkosivut",
  },
  {
    shot: SHOTS.garagefest,
    shotAlt: null,
    shotW: SHOT_FALLBACK.w,
    shotH: SHOT_FALLBACK.h,
    name: "Garage Fest",
    trade: "autoviikonloppu Espoossa",
    count: "1 000",
    title: "Garage Fest · autoviikonloppu Espoossa",
    text: "kävijää tapahtumaan, jonka järjestimme itse",
    spec: null,
    par: "0.015",
    fill: "Tapahtumat",
  },
];


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
              {/* overflow: hidden on nyt MYOS kortissa, jotta kuva ja
                  metallikerrokset rajautuvat 20px pyoristykseen. Se ei
                  leikkaa kortin omaa varjoa: elementin oma box-shadow
                  maalataan sen border boxin ULKOPUOLELLE eika kuulu sen
                  omaan overflow-rajaukseen - rajaus koskee jalkelaisia. */}
              <CardMetal />
              <div className="case-shot">
                {hasShot(c.shot) ? (
                  <Image src={c.shot} alt={c.shotAlt ?? `${c.title} – kuva työstä`} width={c.shotW} height={c.shotH} />
                ) : null}
              </div>
              <div className="case-body">
                <div className="case-kick">
                  <b>{c.name}</b> — {c.trade}
                </div>
                <div className="num" data-count={c.count}>
                  {c.count}
                </div>
                <p>{c.text}</p>
                {/* Spec-rivi. Ikonit ovat aria-hidden, mutta alustan nimi
                    on nakyvana labelina, joten ruudunlukija saa sen ilman
                    .vh-kikkaa. */}
                {c.spec ? (
                  <div className="case-spec">
                    {c.spec.map((sp) => (
                      <div className="spec" key={sp.icon}>
                        <div className="spec-label">
                          <SocialIcon name={sp.icon} />
                          {sp.label}
                        </div>
                        <div className="spec-val">{sp.n}</div>
                        <div className="spec-unit">{sp.unit}</div>
                      </div>
                    ))}
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
