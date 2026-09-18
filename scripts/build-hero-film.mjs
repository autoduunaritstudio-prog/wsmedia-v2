/* HERON VIERITYSELOKUVAN RAKENNUS.
 *
 * Lahde on hero_final.mp4: 1920x1080, 25 fps, tasan 151 ruutua, 6,040 s.
 * Ruutusarja oli aiemmin sama materiaali yksittaisina kuvatiedostoina,
 * eli 151 erillista pakattua kuvaa ilman ruutujen valista pakkausta.
 *
 * MITATTU LAHTEESTA (SSIM koko 1920x1080 resoluutiossa lahdetta vastaan):
 *
 *   avif-sarja (nykyinen)   4,96 MB   0,987   (koodin oma aiempi mittaus)
 *   h264 crf 23  GOP 12     2,72 MB   0,991
 *   h264 crf 26  GOP 12     1,94 MB   0,989   <- valittu
 *   h264 crf 29  GOP 12     1,43 MB   0,986
 *   av1  crf 34  GOP 12     3,61 MB   0,995
 *
 * crf 26 on ainoa kohta jossa tiedosto on alle puolet nykyisesta JA
 * tarkkuus on nykyista parempi. AV1 havisi tassa, koska GOP 12 vie siita
 * juuri sen edun jonka vuoksi se yleensa valitaan: pitkat ruutuvalit.
 * Yksi koodekki riittaa, ja h264 on se jolle WebCodecsin tuki on laajin.
 *
 * GOP 12 EI OLE PAKKAUSVALINTA VAAN KELAUSVALINTA. Purkaja paasee mihin
 * tahansa ruutuun purkamalla enintaan 12 ruutua avainkuvasta eteenpain.
 * Isompi GOP pienentaisi tiedostoa mutta tekisi nopeasta vierityksesta
 * kalliin, ja juuri nopea vieritys on se mika tata rasittaa.
 *
 * -sc_threshold 0 estaa kohtausvaihtoa lisaamasta ylimaaraisia
 * avainkuvia, jolloin GOP on oikeasti tasan 12 eika "korkeintaan 12".
 * +faststart siirtaa moov-atomin tiedoston alkuun, jotta demuksaus voi
 * alkaa ennen kuin koko tiedosto on ladattu.
 *
 * REV tiedostonimessa: ruudut ja elokuva ovat ikuisessa valimuistissa,
 * joten sisallon muuttuessa MYOS osoitteen on muututtava.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, statSync } from "node:fs";

const REV = "v1";
const LAHDE = "hero_final.mp4";
const ULOS_DIR = "public/hero";
const NIMI = `film-${REV}.mp4`;
const CRF = 26;
const GOP = 12;

const sh = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "inherit"] }).toString();

const probe = JSON.parse(
  sh("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height,r_frame_rate,nb_frames",
    "-of", "json", LAHDE,
  ]),
).streams[0];

const [num, den] = probe.r_frame_rate.split("/").map(Number);
const fps = num / den;
const ruutuja = Number(probe.nb_frames);

mkdirSync(ULOS_DIR, { recursive: true });
sh("ffmpeg", [
  "-v", "error", "-y", "-i", LAHDE,
  "-c:v", "libx264", "-crf", String(CRF), "-preset", "slow",
  "-g", String(GOP), "-keyint_min", String(GOP), "-sc_threshold", "0",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
  `${ULOS_DIR}/${NIMI}`,
]);

const koko = statSync(`${ULOS_DIR}/${NIMI}`).size;
const manifest = {
  rev: REV,
  src: `/hero/${NIMI}`,
  frames: ruutuja,
  fps,
  width: Number(probe.width),
  height: Number(probe.height),
  gop: GOP,
  bytes: koko,
};
writeFileSync(`${ULOS_DIR}/film.json`, JSON.stringify(manifest, null, 2) + "\n");

/* SAMA TIETO MYOS TS-VAKIONA. Komponentti tarvitsee osoitteen ja
   ruutumaaran kaannosaikana, eika niita saa kirjoittaa kasin kahteen
   paikkaan: REV nousee ja toinen jaa jalkeen. Tiedosto on generoitu,
   joten sita ei muokata kasin. */
writeFileSync(
  "app/components/film-tiedot.ts",
  `/* GENEROITU: scripts/build-hero-film.mjs. Ala muokkaa kasin. */\n` +
    `export const FILM = {\n` +
    `  src: ${JSON.stringify(manifest.src)},\n` +
    `  frames: ${manifest.frames},\n` +
    `  width: ${manifest.width},\n` +
    `  height: ${manifest.height},\n` +
    `} as const;\n`,
);

console.log(
  `${NIMI}: ${ruutuja} ruutua, ${probe.width}x${probe.height}, ${fps} fps, ` +
    `${(koko / 1024 / 1024).toFixed(2)} MB, GOP ${GOP}`,
);
