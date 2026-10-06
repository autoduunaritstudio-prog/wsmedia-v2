

import TulosNayttamo, { type Tulos } from "./TulosNayttamo";

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






/* Nayttamon sisalto. Luvut: Colormaster ja YDR asiakkaiden koosteista
   9/2026, YDR:n katselut ja Laaksolahden huoltosivun sija Tuomakselta
   5.10.2026, klikit sivustonvaihdossa nakyvyysraportista 12.9.-29.9.2026. */
const TULOKSET: Tulos[] = [
  {
    id: "colormaster",
    nimi: "Colormaster",
    ala: "automaalaamo",
    palvelu: "Lyhytvideot",
    luku: "1,6 milj.",
    selite: "katselukertaa neljässä kuukaudessa",
    logo: { src: "/logos/colormaster.png", w: 798, h: 340 },
    tausta: "/referenssit/colormaster-tausta.webp",
    video: { src: "/referenssit/colormaster.mp4", poster: "/referenssit/colormaster.webp", kahva: "colormaster.fi" },
    teimme:
      "Suunnittelimme, kuvasimme ja editoimme lyhytvideot Instagramiin ja TikTokiin. Näkyvyys tuli pelkällä sisällöllä, ilman maksettua mainontaa.",
    linkit: [
      { tyyppi: "ig", url: "https://www.instagram.com/colormaster.fi/" },
      { tyyppi: "tt", url: "https://www.tiktok.com/@color.master.oy" },
    ],
    rivit: [
      { l: "Katselukerrat, 4 kk", nyt: "1,6 milj." },
      { l: "Seuraajat Instagramissa", nyt: "1 600" },
      { l: "Seuraajat TikTokissa", nyt: "2 651" },
    ],
  },
  {
    id: "ydr",
    nimi: "YDR Autohuolto",
    ala: "autohuolto, Tuusula",
    palvelu: "Lyhytvideot",
    luku: "1 milj.",
    selite: "katselukertaa kolmessa kuukaudessa",
    logo: { src: "/logos/ydr-autohuolto.png", w: 816, h: 246 },
    tausta: "/referenssit/ydr-tausta.webp",
    video: { src: "/referenssit/ydr-autohuolto.mp4", poster: "/referenssit/ydr-autohuolto.webp", kahva: "ydr_autohuolto" },
    teimme:
      "Some lähti liikkeelle lähes tyhjästä: TikTokissa ei ollut seuraajia lainkaan. Teemme korjaamon lyhytvideot Instagramiin ja TikTokiin alusta loppuun.",
    linkit: [
      { tyyppi: "ig", url: "https://www.instagram.com/ydr_autohuolto/" },
      { tyyppi: "tt", url: "https://www.tiktok.com/@ydr_autohuolto" },
    ],
    rivit: [
      { l: "Katselukerrat, 3 kk", nyt: "1 milj." },
      { l: "Seuraajat Instagramissa", ennen: "250", nyt: "1 000" },
      { l: "Seuraajat TikTokissa", ennen: "0", nyt: "750" },
    ],
  },
  {
    id: "laaksolahti",
    nimi: "Laaksolahden Sähkö",
    ala: "sähkötyöt ja ilmalämpöpumput",
    palvelu: "Verkkosivut ja SEO",
    luku: "35 → 10",
    selite: "huoltosivun sija Googlessa kahdessa viikossa",
    logo: { src: "/logos/ls-monogram-color.png", w: 2054, h: 2052, monogrammi: true },
    tausta: "/referenssit/laaksolahti-tausta.webp",
    sivut: [
      { nimi: "Etusivu", d: SHOTS.laaksolahti, m: "/referenssit/ls-m-etu.webp" },
      { nimi: "Huolto", d: "/referenssit/ls-d-huolto.webp", m: "/referenssit/ls-m-huolto.webp" },
      { nimi: "Ajanvaraus", d: "/referenssit/ls-d-ajan.webp", m: "/referenssit/ls-m-ajan.webp" },
      { nimi: "Säästölaskuri", d: "/referenssit/ls-d-laskuri.webp", m: "/referenssit/ls-m-laskuri.webp" },
    ],
    teimme:
      "Rakensimme sähköliikkeelle oman sivuston sähkötöille, ilmalämpöpumpuille, latausasemille ja aurinkopaneeleille. Vieritykseen sidotut videot esittelevät pumput, tuotekortista lähtee tarjouspyyntö ja kartoituksen voi varata suoraan kalenterista. Vanhat osoitteet siirrettiin niin, ettei hakuliikenne katkennut.",
    linkit: [{ tyyppi: "web", url: "https://laaksolahdensahko.fi/" }],
    rivit: [
      { l: "Ilmalämpöpumpun huolto, sija Googlessa", ennen: "35", nyt: "10" },
      { l: "Sivuja", nyt: "noin 50" },
      { l: "Kartoituksen ajanvaraus", nyt: "verkossa" },
      { l: "Hakuklikit sivustonvaihdossa", nyt: "ennallaan" },
    ],
  },
];

export default function Results() {
  return (
    <section id="tulokset" style={{ paddingTop: "110px" }}>
      <Kaiku sana="TULOKSET" puoli="vas" luokka="etu" />
      <div className="wrap">
        <h2 className="etu-h2 rv">Tulokset, joilla on väliä.</h2>

        <TulosNayttamo tulokset={TULOKSET} />
      </div>
    </section>
  );
}
