import fs from "node:fs";
import path from "node:path";

import Image from "next/image";
import type { CSSProperties } from "react";

import SocialIcon from "./SocialIcon";

import type { SocialLink } from "./site-data";
import { Kaiku } from "./Maasto";

/**
 * KUVAT TULEVAT VAKIOISTA, EIVAT KOODIIN KOVAKOODATTUINA POLKUINA.
 *
 * Colormasterille ja Laaksolahdelle on toimitettu valmiit, lahteessa
 * 16:9 rajatut kuvat. YDR:lle ei viela ole: Refs.tsx:n
 * ydr-autohuolto.webp on 608x1080 pystyposteri, eika sita voi rajata
 * vaakakaistaleeksi ilman etta lopputulosta katsotaan silmalla.
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
  laaksolahti: "/referenssit/laaksolahdensahko-case.webp",
  ydr: "/referenssit/ydr-autohuolto-case.webp",
} as const;


/**
 * Spec-sarake. Yksikko EI ole sarakkeessa vaan rivin yhteisena
 * otsikkona (specUnit): silloin se esiintyy kerran eika kahdesti, eika
 * se voi irrota koskemaan vain toista saraketta niin kuin kavi kun se
 * oli rivin lopussa yhteisena. Otsikko on oma lohkonsa sarakeruudukon
 * ULKOPUOLELLA, joten rivitys ei voi sitoa sita kumpaankaan sarakkeeseen.
 */
type Spec = { icon: SocialLink["icon"]; label: string; n: string };

const hasShot = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src));

const CASES = [
  {
    shot: SHOTS.colormaster,
    shotAlt: "Colormasterin toimitilat ja opasteet",
    shotW: 1000,
    shotH: 563,
    name: "Colormaster",
    trade: "automaalaamo",
    count: "1,6 milj.",
    title: "Colormaster · automaalaamo",
    text: "Katselukertaa Instagramissa ja TikTokissa yhteensä, neljässä kuukaudessa ilman maksettua mainontaa.",
    specUnit: "seuraajaa",
    spec: [
      { icon: "instagram", label: "Instagram", n: "1 600" },
      { icon: "tiktok", label: "TikTok", n: "2 651" },
    ] as Spec[],
    par: "0.015",
    fill: "Lyhytvideot",
  },
  {
    shot: SHOTS.laaksolahti,
    shotAlt: "Laaksolahden Sähkön verkkosivun etusivu",
    shotW: 1000,
    shotH: 563,
    name: "Laaksolahden Sähkö",
    trade: "sähkötyöt ja ilmalämpöpumput",
    count: "100 / 98",
    title: "Laaksolahden Sähkö · sähkötyöt ja ilmalämpöpumput",
    text: "PageSpeed työpöydällä ja mobiilissa, mitattu 9/2026",
    specUnit: null,
    spec: null,
    par: "0.035",
    fill: "Verkkosivut",
  },
  {
    shot: SHOTS.ydr,
    shotAlt: "YDR Autohuollon korjaamo Tuusulassa",
    shotW: 1000,
    shotH: 563,
    name: "YDR Autohuolto",
    trade: "autohuolto",
    /* Luvut asiakkaan omasta koosteesta 9/2026. Instagram kasvoi
       250 -> 824 ja TikTok 0 -> 300; sarake nayttaa loppuluvun, koska
       pohja on yksiarvoinen (Colormasterin kortti). */
    count: "390 000",
    title: "YDR Autohuolto · autohuolto",
    text: "Katselukertaa Instagramissa ja TikTokissa yhteensä, kahdessa kuukaudessa aloituksesta.",
    specUnit: "seuraajaa",
    spec: [
      { icon: "instagram", label: "Instagram", n: "824" },
      { icon: "tiktok", label: "TikTok", n: "300" },
    ] as Spec[],
    par: "0.015",
    fill: "Lyhytvideot",
  },
];


export default function Results() {
  return (
    <section id="tulokset" style={{ paddingTop: "110px" }}>
      <Kaiku sana="TULOKSET" puoli="vas" luokka="etu" />
      <div className="wrap">
        <div className="etu-ord rv">
          <span>Tulokset</span>
          <i>Kolme asiakasta, kolme mitattua tulosta</i>
        </div>
        <h2 className="etu-h2 rv">Tulokset, joilla on väliä.</h2>

        {/* UUSI ILME 5.10.2026: korttien sijaan tuloslista. Jokainen tulos
            on rivi: iso luku, asiakas ja selitys, kuva. Luku on rivin
            paaasia, joten se on suurin elementti eika kortin keskella. */}
        <ol className="tul-lista">
          {CASES.map((c, i) => (
            <li className="tul rv" style={{ "--i": i } as CSSProperties} key={c.title}>
              <div className="tul-luku">
                <span className="tul-tag">{c.fill}</span>
                <div className="tul-num" data-count={c.count}>
                  {c.count}
                </div>
              </div>
              <div className="tul-txt">
                <p className="tul-asiakas">
                  <b>{c.name}</b> · {c.trade}
                </p>
                <p className="tul-p">{c.text}</p>
                {c.spec ? (
                  <div className="tul-spec">
                    {c.spec.map((sp) => (
                      <span className="tul-chip" key={sp.icon}>
                        <SocialIcon name={sp.icon} />
                        <b>{sp.n}</b> {c.specUnit}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="tul-kuva">
                {hasShot(c.shot) ? (
                  <Image
                    src={c.shot}
                    alt={c.shotAlt ?? `${c.title} – kuva työstä`}
                    width={c.shotW}
                    height={c.shotH}
                    sizes="(max-width: 900px) 100vw, 340px"
                    quality={88}
                  />
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
