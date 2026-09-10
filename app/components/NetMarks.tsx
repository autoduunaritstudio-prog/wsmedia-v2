import PlatformMark from "./PlatformMark";

/**
 * Verkoston seassa kelluvat alustamerkit: Instagram, TikTok ja
 * YouTube Shorts.
 *
 * MIKSI OMA KERROS EIKA CANVASILLE PIIRRETTY. Merkit ovat viivapiirroksia
 * joissa on pyoristyksia ja kaaria. Canvasille piirrettyna ne olisi
 * rasteroitava uudestaan jokaisessa kehyksessa, vaikka ne eivat itse
 * liiku pisteiden mukana. DOM-kerroksena selain rasteroi ne kerran ja
 * liikuttaa valmista tekstuuria.
 *
 * KAKSI LIIKETTA, KAKSI ERI OMINAISUUTTA. Merkki seka kelluu ETTA
 * kulkee vierityksen mukana, ja nama on pidettava erillaan:
 *   kellunta   -> translate      (nmfloat-keyframe)
 *   vieritys   -> transform      (--nsp-muuttuja)
 * CSS:n translate ja transform ovat eri ominaisuuksia jotka lasketaan
 * yhteen. Jos molemmat kirjoitettaisiin translateen, keyframe voittaisi
 * ja vieritys jaisi kokonaan pois - sama ansa joka loytyi aiemmin
 * puhelinten kellunnasta ja kuplien keskityksesta.
 *
 * SIJAINNIT OVAT MITATTUJA, EIVAT ARVATTUJA. 1727x906 nakymassa heron
 * sisalto vie alueet 158..927 x 268..638 (tekstipalsta) ja
 * 950..1587 x 172..655 (puhelimet kuplineen), navin logo 144..231 x
 * 59..101 ja valikkonappi 1524..1584 x 50..110. Merkit sijoitetaan
 * naiden ulkopuolelle kolmeen vapaaseen kaistaan: vasempaan reunaan,
 * ylakaistaan ja alakaistaan. Prosentteina, jotta ne pysyvat
 * vastaavilla paikoilla muillakin leveyksilla.
 *
 * SYVYYS ON YKSI LUKU JOKA OHJAA KOLMEA ASIAA. z kertoo kuinka lahella
 * merkki on: se saa suuremman koon, vahvemman lapinakyvyyden ja pidemman
 * vieritysmatkan. Kaukainen merkki liikkuu vahemman kuin lahella oleva -
 * se on parallaksin koko idea. Ilman sita kymmenen merkkia liikkuisi
 * yhtena laattana ja nayttaisi tarra-arkilta ikkunan paalla.
 */

type Mark = {
  k: string;
  /** vasen reuna prosentteina nakyman leveydesta */
  x: number;
  /** ylareuna prosentteina nakyman korkeudesta */
  y: number;
  /** merkin leveys pikseleina */
  s: number;
  /** lapinakyvyys */
  o: number;
  /** syvyys: 1 = verkon etutasolla, 0,4 = kaukana takana */
  z: number;
  /** kellunnan jakso sekunteina */
  t: number;
  /** vaihe: negatiivinen viive aloittaa animaation keskelta */
  d: number;
  /** vaakadriftin suunta ja voimakkuus, -1..1 */
  h: number;
  kind: "ig" | "tt" | "yt";
};

/* Pystymatka taydella syvyydella. Sama suuruusluokka kuin canvasin
   PAN_Y (900px) mutta hieman suurempi, koska merkki on yksittainen
   kappale eika kentta: sen liike on nahtava suoraan, ei pisteiden
   keskinaisesta muutoksesta. Miinusmerkki: sivua alaspain vierittaessa
   tausta nousee. */
const TRAVEL_Y = -1050;
/* Vaakadrift on murto-osa pystysta. Sivua ei vaakasuunnassa vieriteta,
   joten liikkeella ei ole siella omaa syyta - se on vain rikkomassa
   sen etta merkit nousisivat tasan suoraan yhdensuuntaisina. */
const TRAVEL_X = 70;

/* Kymmenen merkkia kolmessa kaistassa. Kokojakauma on tarkoituksella
   epatasainen: kaksi isoa, kolme keskikokoista ja viisi pienta.
   Tasakokoinen joukko olisi lukenut ruudukkona, ei syvyytena. */
const MARKS: Mark[] = [
  // Vasen reuna
  { k: "a", x: 3.6, y: 22, s: 54, o: 0.5, z: 0.95, t: 11, d: -1, h: 0.6, kind: "ig" },
  { k: "b", x: 1.6, y: 45, s: 40, o: 0.38, z: 0.7, t: 16, d: -6, h: -0.5, kind: "yt" },
  { k: "c", x: 5.0, y: 66, s: 34, o: 0.34, z: 0.58, t: 13, d: -5, h: -0.8, kind: "tt" },
  { k: "d", x: 1.2, y: 86, s: 28, o: 0.26, z: 0.44, t: 18, d: -11, h: 0.4, kind: "ig" },
  // Ylakaista
  { k: "e", x: 21, y: 4, s: 30, o: 0.28, z: 0.5, t: 15, d: -3, h: 0.55, kind: "tt" },
  { k: "f", x: 37, y: 6, s: 30, o: 0.27, z: 0.48, t: 17, d: -8, h: -0.45, kind: "yt" },
  { k: "g", x: 55, y: 2.5, s: 26, o: 0.24, z: 0.4, t: 19, d: -13, h: 0.3, kind: "ig" },
  { k: "h", x: 72, y: 7, s: 26, o: 0.23, z: 0.38, t: 14, d: -9, h: -0.65, kind: "tt" },
  // Alakaista ja oikea reuna
  { k: "i", x: 45, y: 82, s: 46, o: 0.42, z: 0.85, t: 12, d: -4, h: 0.35, kind: "ig" },
  { k: "j", x: 93.5, y: 62, s: 34, o: 0.3, z: 0.55, t: 14, d: -2, h: 0.75, kind: "tt" },
];

export default function NetMarks() {
  return (
    <div className="netmarks" aria-hidden="true">
      {MARKS.map((m) => (
        <span
          key={m.k}
          className={"nm nm-" + m.kind}
          style={
            {
              left: m.x + "%",
              top: m.y + "%",
              width: m.s,
              height: m.s,
              opacity: m.o,
              animationDuration: m.t + "s",
              animationDelay: m.d + "s",
              "--nx": Math.round(m.h * TRAVEL_X * m.z),
              "--ny": Math.round(TRAVEL_Y * m.z),
            } as React.CSSProperties
          }
        >
          <PlatformMark id={m.kind === "ig" ? "instagram" : m.kind === "tt" ? "tiktok" : "youtube"} />
        </span>
      ))}
    </div>
  );
}
